/**
 * User Data Utility Functions
 * ───────────────────────────
 * Helps check whether the user has entered real data (tasks, events, emails, notes, reminders)
 * and generates dynamic recommendations and analytics based on actual user entries.
 */

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  isCarriedForward?: boolean;
  isToday?: boolean;
  notes?: string;
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  category: string;
  priority?: string;
  completed: boolean;
  isCarriedForward?: boolean;
}

export interface NoteItem {
  id: number;
  title: string;
  folder: string;
  tags: string[];
  date: string;
  summary: string;
  content: string;
  checklist: { id: number; text: string; done: boolean }[];
  codeBlock?: string;
  attachments: string[];
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  type: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface RecommendationItem {
  id: string | number;
  title: string;
  desc: string;
  tag: string;
  color: string;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  desc: string;
  time: string;
  type: string;
}

const TASKS_KEY = 'planai_user_tasks';
const EVENTS_KEY = 'planai_user_events';
const REMINDERS_KEY = 'planai_user_reminders';
const EMAILS_KEY = 'planai_user_emails';
const NOTES_KEY = 'planai_user_notes';

/** Retrieve stored tasks */
export function getUserTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Retrieve stored planner events */
export function getUserEvents(): PlannerEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Retrieve stored email items */
export function getUserEmails(): Array<{ id: string; subject: string; unread?: boolean }> {
  try {
    const raw = localStorage.getItem(EMAILS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Retrieve stored user notes */
export function getUserNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Retrieve stored reminders */
export function getUserReminders(): ReminderItem[] {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Returns true if user has entered at least one task, event, email, note, or reminder */
export function hasUserData(): boolean {
  const tasks = getUserTasks();
  const events = getUserEvents();
  const emails = getUserEmails();
  const notes = getUserNotes();
  const reminders = getUserReminders();
  return tasks.length > 0 || events.length > 0 || emails.length > 0 || notes.length > 0 || reminders.length > 0;
}

/** Retrieve dynamic notifications built strictly from real user entries */
export function getUserNotifications(): NotificationItem[] {
  const tasks = getUserTasks();
  const events = getUserEvents();
  const emails = getUserEmails();

  const notifications: NotificationItem[] = [];

  // High priority task notifications
  const highPriority = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed');
  highPriority.forEach((t, i) => {
    notifications.push({
      id: `task-urgent-${t.id || i}`,
      title: 'Upcoming Deadline',
      desc: `"${t.title}" due ${t.dueDate || 'today'}`,
      time: 'Just now',
      type: 'urgent'
    });
  });

  // Carried forward task notifications
  const carried = tasks.filter(t => t.isCarriedForward && t.status !== 'Completed');
  carried.forEach((t, i) => {
    notifications.push({
      id: `task-carried-${t.id || i}`,
      title: 'Carried Forward Task',
      desc: `"${t.title}" carried forward to today`,
      time: '1 hour ago',
      type: 'task'
    });
  });

  // Unread emails notifications
  const unreadEmails = emails.filter(e => e.unread);
  unreadEmails.forEach((e, i) => {
    notifications.push({
      id: `email-unread-${e.id || i}`,
      title: 'Unread Email Action Required',
      desc: e.subject || 'Email requiring attention',
      time: '2 hours ago',
      type: 'email'
    });
  });

  // Scheduled events notifications
  events.forEach((e, i) => {
    notifications.push({
      id: `event-scheduled-${e.id || i}`,
      title: 'Planner Update',
      desc: `"${e.title}" scheduled for ${e.startTime || 'today'}`,
      time: '3 hours ago',
      type: 'ai'
    });
  });

  return notifications;
}

/** Generate dynamic recommendations based on real user items */
export function generateUserRecommendations(): RecommendationItem[] {
  const tasks = getUserTasks();
  const events = getUserEvents();
  const emails = getUserEmails();
  const notes = getUserNotes();

  const recs: RecommendationItem[] = [];

  // Urgent tasks check
  const highPriorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed');
  if (highPriorityTasks.length > 0) {
    recs.push({
      id: 'high-priority',
      title: 'High-Priority Alert',
      desc: `You have ${highPriorityTasks.length} high-priority task${highPriorityTasks.length > 1 ? 's' : ''} pending: "${highPriorityTasks[0].title}".`,
      tag: 'Urgent',
      color: 'bg-red-50 text-red-700 border-red-200'
    });
  }

  // Carried forward tasks
  const carriedForward = tasks.filter(t => t.isCarriedForward && t.status !== 'Completed');
  if (carriedForward.length > 0) {
    recs.push({
      id: 'carried-forward',
      title: 'Carried Forward Tasks',
      desc: `${carriedForward.length} task${carriedForward.length > 1 ? 's were' : ' was'} carried forward from previous days.`,
      tag: 'Overdue',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    });
  }

  // Today's schedule events
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.date === todayStr || !e.date);
  if (todayEvents.length > 0) {
    recs.push({
      id: 'today-schedule',
      title: 'Today\'s Schedule',
      desc: `You have ${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} scheduled for today.`,
      tag: 'Calendar',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    });
  }

  // Pending tasks summary
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  if (pendingTasks.length > 0) {
    recs.push({
      id: 'pending-summary',
      title: 'Task Progress',
      desc: `${tasks.length - pendingTasks.length} of ${tasks.length} tasks completed. Keep up the focus!`,
      tag: 'Progress',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    });
  }

  // Unread emails
  const unreadEmails = emails.filter(e => e.unread);
  if (unreadEmails.length > 0) {
    recs.push({
      id: 'unread-emails',
      title: 'Inbox Action Required',
      desc: `You have ${unreadEmails.length} unread email${unreadEmails.length > 1 ? 's' : ''} requiring attention.`,
      tag: 'Email',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    });
  }

  // Notes check
  if (notes.length > 0) {
    recs.push({
      id: 'notes-insight',
      title: 'Notes & Documentation',
      desc: `You have ${notes.length} saved note${notes.length > 1 ? 's' : ''} available in your workspace.`,
      tag: 'Knowledge',
      color: 'bg-purple-50 text-[#7B3FF2] border-purple-200'
    });
  }

  return recs;
}

/** Calculate real productivity analytics metrics from user data */
export function calculateUserAnalytics() {
  const tasks = getUserTasks();
  const events = getUserEvents();
  const notes = getUserNotes();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
  const carriedForwardTasks = tasks.filter(t => t.isCarriedForward && t.status !== 'Completed').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks by category
  const categoryCounts: Record<string, number> = {};
  tasks.forEach(t => {
    const cat = t.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryPieData = Object.entries(categoryCounts).map(([name, value], index) => {
    const colors = ['#7B3FF2', '#FF7A00', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];
    return {
      name,
      value,
      color: colors[index % colors.length]
    };
  });

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    carriedForwardTasks,
    completionRate,
    eventsCount: events.length,
    notesCount: notes.length,
    categoryPieData
  };
}
