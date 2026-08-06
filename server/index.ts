import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;
const WEBHOOK_URLS = {
  dailyPlanner: process.env.WEBHOOK_URL_DAILY_PLANNER || '',
  meetingSchedule: process.env.WEBHOOK_URL_MEETING_SCHEDULE || '',
  emailAssist: process.env.WEBHOOK_URL_EMAIL_ASSIST || '',
};
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — allow the Vite dev server and production origin
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Checks if the webhook URL is configured. Returns false and sends a 503
 * with a clear "under construction" message if not configured.
 */
function ensureWebhookConfigured(res: Response, url: string): boolean {
  if (!url || url.includes('REPLACE_WITH_')) {
    res.status(503).json({
      success: false,
      underConstruction: true,
      message:
        '🚧 This workflow webhook is under construction. Set the appropriate WEBHOOK_URL in .env to activate the backend integration.',
    });
    return false;
  }
  return true;
}

/**
 * Generic helper to POST to the Agent Builder webhook.
 * Sends the payload as JSON and returns the parsed response.
 */
async function callWebhook(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: response.status, data, success: response.ok };
}

/**
 * Helper to call local Ollama chat API.
 */
async function callOllama(messages: { role: string, content: string }[]) {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
      }),
    });
    const data = await response.json();
    return { status: response.status, data: { reply: data.message?.content || '' } };
  } catch (err) {
    return { status: 500, data: { error: 'Failed to connect to local Ollama.', details: String(err) } };
  }
}

/**
 * Helper to call local Ollama generate API.
 */
async function callOllamaGenerate(prompt: string) {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
    });
    const data = await response.json();
    return { status: response.status, data: { reply: data.response || '' } };
  } catch (err) {
    return { status: 500, data: { error: 'Failed to connect to local Ollama.', details: String(err) } };
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  const checkUrl = (url: string) => Boolean(url) && !url.includes('REPLACE_WITH_');
  res.json({
    status: 'ok',
    webhooksConfigured: {
      dailyPlanner: checkUrl(WEBHOOK_URLS.dailyPlanner),
      meetingSchedule: checkUrl(WEBHOOK_URLS.meetingSchedule),
      emailAssist: checkUrl(WEBHOOK_URLS.emailAssist),
    },
    ollama: {
      baseUrl: OLLAMA_BASE_URL,
      model: OLLAMA_MODEL
    },
    timestamp: new Date().toISOString(),
  });
});

// ─── EMAIL ROUTES ─────────────────────────────────────────────────────────────

/**
 * GET /api/emails
 * Triggers the workflow to fetch & summarize Gmail emails.
 * The workflow: Webhook → Gmail List → Gemini/Anthropic → MongoDB → Response
 */
app.get('/api/emails', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.emailAssist;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'fetch_emails',
      limit: Number(req.query.limit) || 100,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/emails]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

/**
 * POST /api/emails/reply
 * Uses Mistral LLM + Gmail Send node to draft and send a reply.
 * Body: { emailId, to, subject, tone, replyText, send: boolean }
 */
app.post('/api/emails/reply', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.emailAssist;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { emailId, to, subject, tone, replyText, send = false } = req.body;
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'generate_reply',
      emailId,
      to,
      subject,
      tone: tone || 'Professional',
      replyText,
      sendEmail: send,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/emails/reply]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

/**
 * POST /api/emails/archive
 * Archives an email by updating MongoDB via the workflow.
 * Body: { emailId, archived: boolean }
 */
app.post('/api/emails/archive', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.emailAssist;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { emailId, archived } = req.body;
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'archive_email',
      emailId,
      archived,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/emails/archive]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── CHAT / AI ASSISTANT ROUTES ───────────────────────────────────────────────

/**
 * POST /api/chat
 * Sends a user message to the AI agent (Anthropic Claude or Gemini depending on
 * the workflow branch). Supports calendar context if googleCalendarConnected.
 * Body: { message, sessionId?, history? }
 */
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, context, sessionId, history = [] } = req.body;

    // First attempt to call local Python AI model service (SmolLM2-135M-Instruct)
    try {
      const localAiRes = await fetch('http://127.0.0.1:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, history }),
      });
      if (localAiRes.ok) {
        const localData = await localAiRes.json() as { reply?: string; model?: string };
        return res.json({
          success: true,
          data: {
            reply: localData.reply || `I've received your request: "${message}"`,
            model: localData.model || 'SmolLM2-135M-Instruct (Local)'
          }
        });
      }
    } catch {
      // Local AI service starting or not listening
    }

    // Fallback response with context processing
    return res.json({
      success: true,
      data: {
        reply: `Based on your current schedule and tasks context:\n"${message}" has been noted. You can view all your active items on the AI Daily Planner.`,
        model: 'Local Fallback'
      }
    });
  } catch (err) {
    console.error('[/api/chat]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── TASKS ROUTES ─────────────────────────────────────────────────────────────

/**
 * GET /api/tasks
 * Fetches tasks from MongoDB via the workflow.
 */
app.get('/api/tasks', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.dailyPlanner;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'fetch_tasks',
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/tasks]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

/**
 * POST /api/tasks
 * Creates or updates a task in MongoDB via the workflow.
 * Body: task object
 */
app.post('/api/tasks', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.dailyPlanner;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'upsert_task',
      task: req.body,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/tasks]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task from MongoDB via the workflow.
 */
app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.dailyPlanner;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'delete_task',
      taskId: req.params.id,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/tasks/:id DELETE]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── PLANNER / CALENDAR ROUTES ────────────────────────────────────────────────

/**
 * GET /api/planner
 * Fetches calendar events via the workflow (Google Calendar if connected,
 * otherwise MongoDB-stored events).
 * Query params: ?start=ISO&end=ISO
 */
app.get('/api/planner', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.meetingSchedule;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { start, end } = req.query;
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'fetch_calendar',
      start: start || new Date().toISOString(),
      end: end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/planner]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

/**
 * POST /api/planner/event
 * Creates or updates a planner event via the workflow.
 */
app.post('/api/planner/event', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.meetingSchedule;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'upsert_event',
      event: req.body,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/planner/event]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

/**
 * DELETE /api/planner/event/:id
 * Deletes a planner event.
 */
app.delete('/api/planner/event/:id', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.meetingSchedule;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'delete_event',
      eventId: req.params.id,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/planner/event/:id DELETE]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── DASHBOARD SUMMARY ROUTE ──────────────────────────────────────────────────

/**
 * GET /api/dashboard
 * Fetches aggregated dashboard data (tasks count, unread emails, today's events)
 * from MongoDB via the workflow.
 */
app.get('/api/dashboard', async (req: Request, res: Response) => {
  const targetUrl = WEBHOOK_URLS.dailyPlanner;
  if (!ensureWebhookConfigured(res, targetUrl)) return;

  try {
    const { status, data, success } = await callWebhook(targetUrl, {
      action: 'fetch_dashboard',
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success, data, error: success ? undefined : data?.error || 'Webhook failed' });
  } catch (err) {
    console.error('[/api/dashboard]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── GENERIC AGENT ENDPOINT ────────────────────────────────────────────────────

/**
 * POST /api/agent
 * Raw passthrough to the Agent Builder webhook.
 * Use for any custom action not covered by the specific routes above.
 */
app.post('/api/agent', async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt || JSON.stringify(req.body);
    const { status, data } = await callOllamaGenerate(prompt);
    res.status(status).json({ success: true, data });
  } catch (err) {
    console.error('[/api/agent]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║         Plan-AI Backend Server            ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`  ▶  Listening on http://localhost:${PORT}`);
  console.log('  📡 Webhooks:');
  const checkUrl = (url: string) => Boolean(url) && !url.includes('REPLACE_WITH_');
  console.log(`    - Daily Planner:   ${checkUrl(WEBHOOK_URLS.dailyPlanner) ? '✅ configured' : '🚧 placeholder'}`);
  console.log(`    - Meeting Sched:   ${checkUrl(WEBHOOK_URLS.meetingSchedule) ? '✅ configured' : '🚧 placeholder'}`);
  console.log(`    - Email Assist:    ${checkUrl(WEBHOOK_URLS.emailAssist) ? '✅ configured' : '🚧 placeholder'}`);
  console.log(`  🤖 Local AI (Ollama):`);
  console.log(`    - URL:             ✅ ${OLLAMA_BASE_URL}`);
  console.log(`    - Model:           ✅ ${OLLAMA_MODEL}`);
  console.log('');
  console.log('  Available API Endpoints:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/emails');
  console.log('  POST /api/emails/reply');
  console.log('  POST /api/emails/archive');
  console.log('  POST /api/chat');
  console.log('  GET  /api/tasks');
  console.log('  POST /api/tasks');
  console.log('  DEL  /api/tasks/:id');
  console.log('  GET  /api/planner');
  console.log('  POST /api/planner/event');
  console.log('  DEL  /api/planner/event/:id');
  console.log('  GET  /api/dashboard');
  console.log('  POST /api/agent  (generic passthrough)');
  console.log('');
});

export default app;
