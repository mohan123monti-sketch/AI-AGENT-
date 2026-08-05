import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;
const WEBHOOK_URL = process.env.WEBHOOK_URL || '';

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
function ensureWebhookConfigured(res: Response): boolean {
  if (!WEBHOOK_URL || WEBHOOK_URL.includes('REPLACE_WITH_YOUR_PLATFORM')) {
    res.status(503).json({
      success: false,
      underConstruction: true,
      message:
        '🚧 Workflow webhook is under construction. Set WEBHOOK_URL in .env to activate the backend integration.',
    });
    return false;
  }
  return true;
}

/**
 * Generic helper to POST to the Agent Builder webhook.
 * Sends the payload as JSON and returns the parsed response.
 */
async function callWebhook(payload: Record<string, unknown>) {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: response.status, data };
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  const webhookConfigured =
    Boolean(WEBHOOK_URL) && !WEBHOOK_URL.includes('REPLACE_WITH_YOUR_PLATFORM');
  res.json({
    status: 'ok',
    webhookConfigured,
    webhookUrl: webhookConfigured ? WEBHOOK_URL : 'NOT_CONFIGURED',
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { status, data } = await callWebhook({
      action: 'fetch_emails',
      limit: Number(req.query.limit) || 100,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { emailId, to, subject, tone, replyText, send = false } = req.body;
    const { status, data } = await callWebhook({
      action: 'generate_reply',
      emailId,
      to,
      subject,
      tone: tone || 'Professional',
      replyText,
      sendEmail: send,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { emailId, archived } = req.body;
    const { status, data } = await callWebhook({
      action: 'archive_email',
      emailId,
      archived,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { message, sessionId, history = [] } = req.body;
    const { status, data } = await callWebhook({
      action: 'chat',
      message,
      history,
      sessionId: sessionId || req.headers['x-session-id'] || 'default',
      timestamp: new Date().toISOString(),
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { status, data } = await callWebhook({
      action: 'fetch_tasks',
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { status, data } = await callWebhook({
      action: 'upsert_task',
      task: req.body,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { status, data } = await callWebhook({
      action: 'delete_task',
      taskId: req.params.id,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { start, end } = req.query;
    const { status, data } = await callWebhook({
      action: 'fetch_calendar',
      start: start || new Date().toISOString(),
      end: end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { status, data } = await callWebhook({
      action: 'upsert_event',
      event: req.body,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { status, data } = await callWebhook({
      action: 'delete_event',
      eventId: req.params.id,
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { status, data } = await callWebhook({
      action: 'fetch_dashboard',
      sessionId: req.headers['x-session-id'] || 'default',
    });

    res.status(status).json({ success: true, data });
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
  if (!ensureWebhookConfigured(res)) return;

  try {
    const { status, data } = await callWebhook(req.body);
    res.status(status).json({ success: true, data });
  } catch (err) {
    console.error('[/api/agent]', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const webhookConfigured =
    Boolean(WEBHOOK_URL) && !WEBHOOK_URL.includes('REPLACE_WITH_YOUR_PLATFORM');

  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║         Plan-AI Backend Server            ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`  ▶  Listening on http://localhost:${PORT}`);
  console.log(
    `  📡 Webhook: ${
      webhookConfigured ? `✅ ${WEBHOOK_URL}` : '🚧 NOT CONFIGURED (Under Construction)'
    }`
  );
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
