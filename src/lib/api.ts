/**
 * Plan-AI API Client
 * ──────────────────
 * Centralized client for all communication with the Express backend,
 * which proxies requests to the Agent Builder workflow webhook.
 *
 * When the webhook is "under construction", every call resolves with
 * { underConstruction: true } so the UI can show appropriate fallbacks
 * instead of crashing.
 */

const BASE_URL = '/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  underConstruction?: boolean;
  message?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const json = await res.json();

    // Server returned 503 "under construction" — pass it through gracefully
    if (res.status === 503 && json.underConstruction) {
      return {
        success: false,
        underConstruction: true,
        message: json.message,
      };
    }

    return json as ApiResponse<T>;
  } catch (err) {
    // Network error (backend not running) — treat as under construction
    return {
      success: false,
      underConstruction: true,
      message: '🚧 Backend server is not reachable. Start it with: npm run server',
      error: String(err),
    };
  }
}

function get<T>(path: string, params?: Record<string, string | number>) {
  const url = params
    ? `${path}?${new URLSearchParams(
        Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
      )}`
    : path;
  return request<T>(url);
}

function post<T>(path: string, body: unknown) {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function del<T>(path: string) {
  return request<T>(path, { method: 'DELETE' });
}

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () =>
    get<{ status: string; webhookConfigured: boolean; timestamp: string }>('/health'),
};

// ─── Email API ────────────────────────────────────────────────────────────────

export const emailApi = {
  /** Fetch and AI-summarize Gmail emails via the workflow */
  fetchEmails: (limit = 100) => get('/emails', { limit }),

  /** Generate and optionally send an email reply */
  generateReply: (payload: {
    emailId: number | string;
    to: string;
    subject: string;
    tone: string;
    replyText: string;
    send?: boolean;
  }) => post('/emails/reply', payload),

  /** Archive or unarchive an email */
  archiveEmail: (emailId: number | string, archived: boolean) =>
    post('/emails/archive', { emailId, archived }),
};

// ─── Chat / AI Assistant API ──────────────────────────────────────────────────

export const chatApi = {
  /**
   * Send a message to the AI agent.
   * The workflow uses Anthropic Claude (with optional Google Calendar context)
   * or Gemini based on available integrations.
   */
  sendMessage: (
    message: string,
    history: ChatMessage[] = [],
    sessionId?: string
  ) =>
    post<{ reply: string; raw?: unknown }>('/chat', {
      message,
      history,
      sessionId,
    }),
};

// ─── Tasks API ────────────────────────────────────────────────────────────────

export const tasksApi = {
  /** Fetch all tasks from MongoDB */
  fetchTasks: () => get('/tasks'),

  /** Create or update a task in MongoDB */
  upsertTask: (task: Record<string, unknown>) => post('/tasks', task),

  /** Delete a task from MongoDB */
  deleteTask: (taskId: string) => del(`/tasks/${taskId}`),
};

// ─── Planner / Calendar API ───────────────────────────────────────────────────

export const plannerApi = {
  /** Fetch calendar events (Google Calendar if connected, else MongoDB) */
  fetchEvents: (start?: string, end?: string) =>
    get('/planner', {
      ...(start && { start }),
      ...(end && { end }),
    }),

  /** Create or update a calendar event */
  upsertEvent: (event: Record<string, unknown>) =>
    post('/planner/event', event),

  /** Delete a calendar event */
  deleteEvent: (eventId: string) => del(`/planner/event/${eventId}`),
};

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const dashboardApi = {
  /** Fetch aggregated summary data for the dashboard */
  fetchSummary: () => get('/dashboard'),
};

// ─── Generic Agent API ────────────────────────────────────────────────────────

export const agentApi = {
  /** Raw passthrough to the workflow webhook */
  call: (payload: Record<string, unknown>) => post('/agent', payload),
};

// ─── Status helper ────────────────────────────────────────────────────────────

/**
 * Returns a user-friendly status message to show in the UI when the
 * backend workflow is under construction.
 */
export function getUnderConstructionMessage(feature: string): string {
  return `🚧 ${feature} is under construction. The backend workflow will be connected soon.`;
}
