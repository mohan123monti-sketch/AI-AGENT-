import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, 
  RefreshCw, Check, AlertCircle, Sparkles, Plus, Zap, Search, 
  Filter, Trash2, Edit2, X, Move, AlertTriangle, 
  CheckSquare, Bell, FileText, Video, Users, Paperclip, MapPin, 
  ExternalLink, Mail, ArrowRight, ShieldCheck, Award
} from 'lucide-react';

// --- Interfaces & Types ---
export type EventCategory = 'Task' | 'Meeting' | 'Focus Session' | 'Reminder' | 'Break' | 'Personal' | 'Other';
export type EventPriority = 'High' | 'Medium' | 'Low';
export type EventColor = 'purple' | 'blue' | 'violet' | 'green' | 'orange' | 'light-orange' | 'gray';
export type CalendarViewMode = 'day' | 'week' | 'month' | 'agenda';
export type RecurringType = 'None' | 'Daily' | 'Weekly' | 'Monthly';
export type MeetingPlatform = 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'In Person' | 'Custom';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM in 24h format e.g. "09:30"
  endTime: string;   // HH:MM in 24h format e.g. "11:00"
  priority: EventPriority;
  category: EventCategory;
  reminder?: string; // YYYY-MM-DDTHH:MM
  notes?: string;
  recurring: RecurringType;
  color: EventColor;
  subtasks: Subtask[];
  status: 'Scheduled' | 'Pending' | 'Completed';
  isCarriedForward?: boolean;

  // Meeting Specific Fields
  platform?: MeetingPlatform;
  attendees?: string[]; // list of emails
  attachments?: string[]; // file names
  travelTimeMins?: number;
}

// Initial Mock Events data with Tasks, Meetings, Focus Sessions, Breaks, Reminders
const INITIAL_EVENTS: PlannerEvent[] = [
  {
    id: 'evt-1',
    title: 'Morning Routine & Email Review',
    description: 'Review inbox, set daily goals, clear priority 1 emails.',
    date: '2026-08-03',
    startTime: '08:00',
    endTime: '09:00',
    priority: 'Low',
    category: 'Break',
    notes: 'Keep inbox to zero before starting deep focus block.',
    recurring: 'Daily',
    color: 'green',
    subtasks: [
      { id: 'st-1', title: 'Check Slack channels', completed: true },
      { id: 'st-2', title: 'Filter spam & newsletter', completed: true }
    ],
    status: 'Completed'
  },
  {
    id: 'evt-2',
    title: 'Product Strategy Sync',
    description: 'Sprint planning and architecture review with lead dev team.',
    date: '2026-08-03',
    startTime: '09:00',
    endTime: '10:00',
    priority: 'High',
    category: 'Meeting',
    platform: 'Zoom',
    attendees: ['john@gmail.com', 'alex@gmail.com', 'manager@gmail.com'],
    reminder: '2026-08-03T08:45',
    notes: 'Discuss Q3 API rate limiting & scaling roadmap.',
    attachments: ['Q3_Roadmap_Draft.pdf'],
    recurring: 'Weekly',
    color: 'blue',
    subtasks: [
      { id: 'st-3', title: 'Share sprint demo link', completed: true }
    ],
    status: 'Completed'
  },
  {
    id: 'evt-3',
    title: 'Carried Forward: Security Audit',
    description: 'Review IAM role permissions & audit key rotations.',
    date: '2026-08-03',
    startTime: '10:00',
    endTime: '11:00',
    priority: 'High',
    category: 'Task',
    reminder: '2026-08-03T09:45',
    notes: 'Moved from yesterday due to emergency hotfix.',
    recurring: 'None',
    color: 'light-orange',
    subtasks: [
      { id: 'st-4', title: 'Audit AWS root keys', completed: false },
      { id: 'st-5', title: 'Update password policies', completed: false }
    ],
    status: 'Pending',
    isCarriedForward: true
  },
  {
    id: 'evt-4',
    title: 'Deep Focus: Q3 Marketing Deck',
    description: 'Finalize revenue projections and visual slides.',
    date: '2026-08-03',
    startTime: '11:00',
    endTime: '12:30',
    priority: 'High',
    category: 'Focus Session',
    notes: 'Peak flow window. Turn off Slack notifications.',
    recurring: 'None',
    color: 'violet',
    subtasks: [
      { id: 'st-6', title: 'Add competitor chart', completed: true },
      { id: 'st-7', title: 'Review slide copy with Sarah', completed: false }
    ],
    status: 'Pending'
  },
  {
    id: 'evt-5',
    title: 'Lunch & Recharge',
    description: 'Recharge & outdoor walk.',
    date: '2026-08-03',
    startTime: '12:30',
    endTime: '13:30',
    priority: 'Low',
    category: 'Break',
    notes: 'Rest eyes from screens.',
    recurring: 'Daily',
    color: 'green',
    subtasks: [],
    status: 'Scheduled'
  },
  {
    id: 'evt-6',
    title: 'Client Review: Acme Corp',
    description: 'Product demo & contract extension review.',
    date: '2026-08-03',
    startTime: '13:30',
    endTime: '14:30',
    priority: 'High',
    category: 'Meeting',
    platform: 'Google Meet',
    attendees: ['sarah@acme.com', 'david@acme.com'],
    reminder: '2026-08-03T13:15',
    notes: 'Google Meet: https://meet.google.com/abc-defg-hij',
    recurring: 'None',
    color: 'blue',
    subtasks: [
      { id: 'st-8', title: 'Prepare slide deck', completed: true }
    ],
    status: 'Scheduled'
  },
  {
    id: 'evt-7',
    title: 'Review PRs & Backend Code',
    description: 'Review pending PRs in repository.',
    date: '2026-08-03',
    startTime: '14:30',
    endTime: '16:00',
    priority: 'Medium',
    category: 'Task',
    notes: 'Focus on authentication security changes.',
    recurring: 'Daily',
    color: 'purple',
    subtasks: [],
    status: 'Scheduled'
  },
  {
    id: 'evt-8',
    title: 'Reminder: Submit Expense Report',
    description: 'Upload July travel receipts to portal.',
    date: '2026-08-03',
    startTime: '16:00',
    endTime: '16:30',
    priority: 'Medium',
    category: 'Reminder',
    reminder: '2026-08-03T15:45',
    notes: 'Finance cutoff is 5 PM.',
    recurring: 'Monthly',
    color: 'orange',
    subtasks: [],
    status: 'Scheduled'
  }
];

// Helper Color Mappers based on User Prompt requirements:
// Tasks -> Purple, Meetings -> Blue, Focus Sessions -> Violet, Breaks -> Green, Reminders -> Orange, Carry Forward -> Light Orange, Personal -> Gray
const getColorStyles = (color: EventColor) => {
  switch (color) {
    case 'purple': // Tasks
      return {
        bg: 'bg-[#F3EEFF]',
        border: 'border-[#7B3FF2]/30',
        text: 'text-[#7B3FF2]',
        badge: 'bg-[#7B3FF2] text-white',
        dot: 'bg-[#7B3FF2]',
        hex: '#7B3FF2'
      };
    case 'blue': // Meetings
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-600 text-white',
        dot: 'bg-blue-500',
        hex: '#2563EB'
      };
    case 'violet': // Focus Sessions
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-600 text-white',
        dot: 'bg-purple-500',
        hex: '#8B5CF6'
      };
    case 'green': // Breaks
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        badge: 'bg-green-600 text-white',
        dot: 'bg-green-500',
        hex: '#16A34A'
      };
    case 'orange': // Reminders
      return {
        bg: 'bg-[#FFF3E8]',
        border: 'border-[#FF7A00]/30',
        text: 'text-[#FF7A00]',
        badge: 'bg-[#FF7A00] text-white',
        dot: 'bg-[#FF7A00]',
        hex: '#FF7A00'
      };
    case 'light-orange': // Carry Forward Tasks
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-800',
        badge: 'bg-amber-500 text-white',
        dot: 'bg-amber-500',
        hex: '#F59E0B'
      };
    case 'gray': // Personal & Other
    default:
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-700',
        badge: 'bg-gray-600 text-white',
        dot: 'bg-gray-500',
        hex: '#6B7280'
      };
  }
};

// Convert HH:MM string to total minutes from 00:00
const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
};

// Format minutes to 12h display string (e.g. 570 -> "09:30 AM")
const minutesToDisplayTime = (totalMins: number): string => {
  const normalized = (totalMins + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hours12}:${minsStr} ${period}`;
};

// Format minutes to 24h HH:MM string for inputs
const minutesToInputTime = (totalMins: number): string => {
  const normalized = (totalMins + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const hStr = hours24 < 10 ? `0${hours24}` : `${hours24}`;
  const mStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hStr}:${mStr}`;
};

// Calculate event duration string
const getDurationString = (start: string, end: string): string => {
  const startMins = timeToMinutes(start);
  const endMins = timeToMinutes(end);
  const diffMins = Math.max(15, endMins - startMins);
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins} min`;
};

// Constants for Hourly Grid View
const START_HOUR = 6; // 6:00 AM
const END_HOUR = 22;  // 10:00 PM
const HOUR_HEIGHT = 72; // pixels per hour
const TOTAL_HOURS = END_HOUR - START_HOUR;

export default function Planner() {
  // State
  const [events, setEvents] = useState<PlannerEvent[]>(INITIAL_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-03');
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Modals & Panels State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PlannerEvent | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // AI Optimization & Meeting Preview State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAiPreviewModal, setShowAiPreviewModal] = useState(false);
  const [previewProposedEvents, setPreviewProposedEvents] = useState<PlannerEvent[]>([]);
  const [previewChangesSummary, setPreviewChangesSummary] = useState<Array<{ title: string; oldTime: string; newTime: string; reason: string }>>([]);
  const [previewAiAdvice, setPreviewAiAdvice] = useState<string[]>([]);
  const [previewProductivityBefore, setPreviewProductivityBefore] = useState<number>(82);
  const [previewProductivityAfter, setPreviewProductivityAfter] = useState<number>(94);
  const [previewExplanationQuote, setPreviewExplanationQuote] = useState<string>('');

  // Conflict State
  const [activeConflict, setActiveConflict] = useState<{ eventA: PlannerEvent; eventB: PlannerEvent } | null>(null);

  // Drag & Drop State
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [initialStartMins, setInitialStartMins] = useState<number>(0);
  const [resizingEventId, setResizingEventId] = useState<string | null>(null);

  // Form State for Add Event Modal
  const [formData, setFormData] = useState<Partial<PlannerEvent>>({
    title: '',
    description: '',
    date: '2026-08-03',
    startTime: '10:00',
    endTime: '11:00',
    priority: 'Medium',
    category: 'Task',
    reminder: '',
    notes: '',
    recurring: 'None',
    color: 'purple',
    subtasks: []
  });
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Form State for Schedule Meeting Modal
  const [meetingFormData, setMeetingFormData] = useState<{
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    platform: MeetingPlatform;
    attendees: string[];
    priority: EventPriority;
    reminder: string;
    notes: string;
    attachments: string[];
  }>({
    title: '',
    description: '',
    date: '2026-08-03',
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    platform: 'Google Meet',
    attendees: ['john@gmail.com', 'alex@gmail.com', 'manager@gmail.com'],
    priority: 'High',
    reminder: '',
    notes: '',
    attachments: []
  });
  const [attendeeEmailInput, setAttendeeEmailInput] = useState('');

  // Conflict Detection Effect
  useEffect(() => {
    const dayEvents = events.filter(e => e.date === selectedDate);
    let foundConflict: { eventA: PlannerEvent; eventB: PlannerEvent } | null = null;

    for (let i = 0; i < dayEvents.length; i++) {
      for (let j = i + 1; j < dayEvents.length; j++) {
        const a = dayEvents[i];
        const b = dayEvents[j];
        const aStart = timeToMinutes(a.startTime);
        const aEnd = timeToMinutes(a.endTime);
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);

        if (Math.max(aStart, bStart) < Math.min(aEnd, bEnd)) {
          foundConflict = { eventA: a, eventB: b };
          break;
        }
      }
      if (foundConflict) break;
    }
    setActiveConflict(foundConflict);
  }, [events, selectedDate]);

  // Open Modal for New Event
  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: selectedDate,
      startTime: '10:00',
      endTime: '11:00',
      priority: 'Medium',
      category: 'Task',
      reminder: '',
      notes: '',
      recurring: 'None',
      color: 'purple',
      subtasks: []
    });
    setIsAddModalOpen(true);
  };

  // Open Modal for Schedule Meeting
  const handleOpenScheduleMeetingModal = () => {
    setEditingEvent(null);
    setMeetingFormData({
      title: '',
      description: '',
      date: selectedDate,
      startTime: '14:00',
      endTime: '15:00',
      durationMinutes: 60,
      platform: 'Google Meet',
      attendees: ['john@gmail.com', 'alex@gmail.com', 'manager@gmail.com'],
      priority: 'High',
      reminder: '',
      notes: '',
      attachments: []
    });
    setIsMeetingModalOpen(true);
  };

  // Open Modal for Editing Existing Event or Meeting
  const handleOpenEditModal = (event: PlannerEvent) => {
    setEditingEvent(event);
    if (event.category === 'Meeting') {
      const startM = timeToMinutes(event.startTime);
      const endM = timeToMinutes(event.endTime);
      setMeetingFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        durationMinutes: Math.max(15, endM - startM),
        platform: event.platform || 'Google Meet',
        attendees: event.attendees || [],
        priority: event.priority,
        reminder: event.reminder || '',
        notes: event.notes || '',
        attachments: event.attachments || []
      });
      setIsMeetingModalOpen(true);
    } else {
      setFormData({
        ...event
      });
      setIsAddModalOpen(true);
    }
  };

  // Add Attendee Email Chip
  const handleAddAttendee = () => {
    if (!attendeeEmailInput.trim()) return;
    const email = attendeeEmailInput.trim();
    if (!meetingFormData.attendees.includes(email)) {
      setMeetingFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, email]
      }));
    }
    setAttendeeEmailInput('');
  };

  // Remove Attendee Email Chip
  const handleRemoveAttendee = (email: string) => {
    setMeetingFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== email)
    }));
  };

  // Add Subtask to Form
  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    const newSt: Subtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskInput.trim(),
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSt]
    }));
    setNewSubtaskInput('');
  };

  // Remove Subtask from Form
  const handleRemoveSubtask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: (prev.subtasks || []).filter(s => s.id !== id)
    }));
  };

  // Toggle Subtask Completion in Form
  const handleToggleFormSubtask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: (prev.subtasks || []).map(s => s.id === id ? { ...s, completed: !s.completed } : s)
    }));
  };

  // "Find Best Time" AI Action for Meeting Scheduler
  const handleFindBestTimeForMeeting = () => {
    if (!meetingFormData.title.trim()) return;

    const requestedStart = timeToMinutes(meetingFormData.startTime);
    const duration = meetingFormData.durationMinutes || 60;
    const requestedEnd = requestedStart + duration;

    // Check overlaps with existing day events
    const dayEvents = events.filter(e => e.date === meetingFormData.date && (!editingEvent || e.id !== editingEvent.id));
    let hasConflict = false;
    let conflictingEventName = '';

    dayEvents.forEach(e => {
      const eStart = timeToMinutes(e.startTime);
      const eEnd = timeToMinutes(e.endTime);
      if (Math.max(requestedStart, eStart) < Math.min(requestedEnd, eEnd)) {
        hasConflict = true;
        conflictingEventName = e.title;
      }
    });

    let newStartMins = requestedStart;
    let newEndMins = requestedEnd;
    let explanation = '';

    if (hasConflict) {
      // Find open slot after 14:00 (2:00 PM) or after conflicting items
      newStartMins = 840; // 14:00 PM (2:00 PM)
      newEndMins = newStartMins + duration;
      explanation = `The requested meeting overlaps with your "${conflictingEventName}". Moving the meeting to ${minutesToDisplayTime(newStartMins)} keeps your focus block uninterrupted and avoids conflicts.`;
    } else {
      explanation = `Optimal meeting window selected! Zero time conflicts detected with existing focus blocks, tasks, or breaks.`;
    }

    const meetingEventToSave: PlannerEvent = {
      id: editingEvent ? editingEvent.id : `evt-meeting-${Date.now()}`,
      title: meetingFormData.title,
      description: meetingFormData.description || 'Smart scheduled meeting',
      date: meetingFormData.date,
      startTime: minutesToInputTime(newStartMins),
      endTime: minutesToInputTime(newEndMins),
      priority: meetingFormData.priority,
      category: 'Meeting',
      platform: meetingFormData.platform,
      attendees: meetingFormData.attendees,
      reminder: meetingFormData.reminder,
      notes: meetingFormData.notes,
      attachments: meetingFormData.attachments,
      recurring: 'None',
      color: 'blue',
      subtasks: [],
      status: editingEvent ? editingEvent.status : 'Scheduled'
    };

    const existingOtherEvents = events.filter(e => e.id !== meetingEventToSave.id);
    const proposedList = [...existingOtherEvents, meetingEventToSave];
    proposedList.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    setPreviewProposedEvents(proposedList);
    setPreviewChangesSummary([
      {
        title: meetingEventToSave.title,
        oldTime: minutesToDisplayTime(requestedStart),
        newTime: minutesToDisplayTime(newStartMins),
        reason: hasConflict ? `Conflict resolved with ${conflictingEventName}` : 'Optimal peak slot selected'
      }
    ]);
    setPreviewAiAdvice([
      `Verified attendee calendars (${meetingFormData.attendees.length} participants).`,
      `Inserted 15-min travel/prep buffer time before meeting start.`,
      `Adjusted afternoon break schedule to maintain steady energy levels.`,
      `Meeting duration optimized: ${getDurationString(minutesToInputTime(newStartMins), minutesToInputTime(newEndMins))}.`
    ]);
    setPreviewExplanationQuote(explanation);
    setPreviewProductivityBefore(82);
    setPreviewProductivityAfter(94);

    setIsMeetingModalOpen(false);
    setShowAiPreviewModal(true);
  };

  // Direct Save Event (Task, Focus Session, etc.)
  const handleSaveEventDirectly = () => {
    if (!formData.title?.trim()) return;

    // Color mapper according to event category
    let eventColor: EventColor = 'purple';
    if (formData.category === 'Meeting') eventColor = 'blue';
    else if (formData.category === 'Focus Session') eventColor = 'violet';
    else if (formData.category === 'Break') eventColor = 'green';
    else if (formData.category === 'Reminder') eventColor = 'orange';
    else if (formData.category === 'Personal') eventColor = 'gray';

    const eventToSave: PlannerEvent = {
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      title: formData.title || 'Untitled Event',
      description: formData.description || '',
      date: formData.date || selectedDate,
      startTime: formData.startTime || '10:00',
      endTime: formData.endTime || '11:00',
      priority: formData.priority || 'Medium',
      category: formData.category || 'Task',
      reminder: formData.reminder,
      notes: formData.notes,
      recurring: formData.recurring || 'None',
      color: formData.color || eventColor,
      subtasks: formData.subtasks || [],
      status: editingEvent ? editingEvent.status : 'Scheduled'
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? eventToSave : e));
    } else {
      setEvents([...events, eventToSave]);
    }
    setIsAddModalOpen(false);
  };

  // Confirm Apply AI Schedule Preview
  const handleApplyAiSchedulePreview = () => {
    setEvents(previewProposedEvents);
    setShowAiPreviewModal(false);
  };

  // Delete Event Handler
  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setDeleteConfirmationId(null);
    setIsAddModalOpen(false);
    setIsMeetingModalOpen(false);
  };

  // Toggle Event Completion
  const handleToggleComplete = (id: string) => {
    setEvents(events.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'Completed' ? 'Scheduled' : 'Completed';
        return {
          ...e,
          status: nextStatus,
          isCarriedForward: nextStatus === 'Completed' ? false : e.isCarriedForward
        };
      }
      return e;
    }));
  };

  // AI Auto-Optimize Trigger
  const handleAutoOptimize = () => {
    setIsOptimizing(true);

    setTimeout(() => {
      const dayEvts = events.filter(e => e.date === selectedDate);
      const otherEvts = events.filter(e => e.date !== selectedDate);

      let currentMins = 540; // 09:00 AM
      const optimizedDayEvts: PlannerEvent[] = dayEvts.map(evt => {
        const duration = timeToMinutes(evt.endTime) - timeToMinutes(evt.startTime);
        const actualDuration = duration > 0 ? duration : 60;
        const newStart = minutesToInputTime(currentMins);
        const newEnd = minutesToInputTime(currentMins + actualDuration);
        currentMins += actualDuration + 15; // 15 min break between
        return {
          ...evt,
          startTime: newStart,
          endTime: newEnd
        };
      });

      const changesSummary = dayEvts.map((orig, i) => ({
        title: orig.title,
        oldTime: minutesToDisplayTime(timeToMinutes(orig.startTime)),
        newTime: minutesToDisplayTime(timeToMinutes(optimizedDayEvts[i].startTime)),
        reason: orig.category === 'Focus Session' ? 'Moved to peak morning focus window' : 'Optimized gap & buffer time'
      }));

      setPreviewProposedEvents([...otherEvts, ...optimizedDayEvts]);
      setPreviewChangesSummary(changesSummary);
      setPreviewAiAdvice([
        'Grouped deep focus blocks during peak cognitive energy hours (9:00 AM - 12:00 PM).',
        'Inserted 15-minute buffer periods between all consecutive meetings.',
        'Carried forward non-urgent tasks to open afternoon slots.',
        'Schedule efficiency boosted by +22%.'
      ]);
      setPreviewExplanationQuote('AI analyzed all meetings, tasks, and energy profiles to craft a seamless zero-conflict timeline.');
      setPreviewProductivityBefore(82);
      setPreviewProductivityAfter(96);

      setIsOptimizing(false);
      setShowAiPreviewModal(true);
    }, 700);
  };

  // Auto-resolve Active Conflict
  const handleResolveConflict = (strategy: 'moveA' | 'moveB' | 'shorten') => {
    if (!activeConflict) return;
    const { eventA, eventB } = activeConflict;

    setEvents(prev => prev.map(e => {
      if (strategy === 'moveB' && e.id === eventB.id) {
        const aEndMins = timeToMinutes(eventA.endTime);
        const bDuration = timeToMinutes(eventB.endTime) - timeToMinutes(eventB.startTime);
        return {
          ...e,
          startTime: minutesToInputTime(aEndMins + 15),
          endTime: minutesToInputTime(aEndMins + 15 + bDuration)
        };
      }
      if (strategy === 'moveA' && e.id === eventA.id) {
        const bEndMins = timeToMinutes(eventB.endTime);
        const aDuration = timeToMinutes(eventA.endTime) - timeToMinutes(eventA.startTime);
        return {
          ...e,
          startTime: minutesToInputTime(bEndMins + 15),
          endTime: minutesToInputTime(bEndMins + 15 + aDuration)
        };
      }
      if (strategy === 'shorten' && e.id === eventA.id) {
        const bStartMins = timeToMinutes(eventB.startTime);
        return {
          ...e,
          endTime: minutesToInputTime(bStartMins)
        };
      }
      return e;
    }));
  };

  // Drag & Drop & Resize Handlers
  const handleMouseDownDrag = (e: React.MouseEvent, evt: PlannerEvent) => {
    e.stopPropagation();
    setDraggingEventId(evt.id);
    setDragStartY(e.clientY);
    setInitialStartMins(timeToMinutes(evt.startTime));
  };

  const handleMouseMoveTimeline = (e: React.MouseEvent) => {
    if (!draggingEventId && !resizingEventId) return;

    const deltaY = e.clientY - dragStartY;
    const minsShift = Math.round((deltaY / HOUR_HEIGHT) * 60 / 15) * 15; // snap to 15 mins

    if (draggingEventId) {
      setEvents(prev => prev.map(evt => {
        if (evt.id === draggingEventId) {
          const origDuration = timeToMinutes(evt.endTime) - timeToMinutes(evt.startTime);
          const newStartMins = Math.max(START_HOUR * 60, Math.min(END_HOUR * 60 - origDuration, initialStartMins + minsShift));
          return {
            ...evt,
            startTime: minutesToInputTime(newStartMins),
            endTime: minutesToInputTime(newStartMins + origDuration)
          };
        }
        return evt;
      }));
    } else if (resizingEventId) {
      setEvents(prev => prev.map(evt => {
        if (evt.id === resizingEventId) {
          const startMins = timeToMinutes(evt.startTime);
          const currentEndMins = timeToMinutes(evt.endTime);
          const newEndMins = Math.max(startMins + 15, Math.min(END_HOUR * 60, currentEndMins + minsShift));
          return {
            ...evt,
            endTime: minutesToInputTime(newEndMins)
          };
        }
        return evt;
      }));
      setDragStartY(e.clientY);
    }
  };

  const handleMouseUpTimeline = () => {
    setDraggingEventId(null);
    setResizingEventId(null);
  };

  // Filtering Logic
  const filteredEvents = events.filter(e => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.attendees && e.attendees.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesDate = viewMode === 'day' ? e.date === selectedDate : true;
    const matchesCategory = selectedCategoryFilter === 'All' || e.category === selectedCategoryFilter;
    const matchesStatus = 
      selectedStatusFilter === 'All' ||
      (selectedStatusFilter === 'Completed' && e.status === 'Completed') ||
      (selectedStatusFilter === 'Pending' && e.status !== 'Completed') ||
      (selectedStatusFilter === 'Carried Forward' && e.isCarriedForward);

    return matchesSearch && matchesDate && matchesCategory && matchesStatus;
  });

  // Calculate Metrics for Sub-header
  const focusHours = events
    .filter(e => e.date === selectedDate && e.category === 'Focus Session')
    .reduce((acc, e) => acc + (timeToMinutes(e.endTime) - timeToMinutes(e.startTime)) / 60, 0);

  const meetingHours = events
    .filter(e => e.date === selectedDate && e.category === 'Meeting')
    .reduce((acc, e) => acc + (timeToMinutes(e.endTime) - timeToMinutes(e.startTime)) / 60, 0);

  const carriedForwardCount = events.filter(e => e.date === selectedDate && e.isCarriedForward).length;
  const completedCount = events.filter(e => e.date === selectedDate && e.status === 'Completed').length;
  const totalCount = events.filter(e => e.date === selectedDate).length;
  const efficiencyScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 92;

  // Date Navigation Helpers
  const handlePrevDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDate = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleTodayDate = () => {
    setSelectedDate('2026-08-03');
  };

  // Hours array for timeline ruler
  const hoursArray = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);

  return (
    <div 
      className="max-w-7xl mx-auto min-h-full flex flex-col space-y-6 pb-12 select-none"
      onMouseMove={handleMouseMoveTimeline}
      onMouseUp={handleMouseUpTimeline}
    >
      {/* 1. Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            AI Daily Planner
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Includes Today's Tasks, Carried Forward Tasks, Meetings, Breaks, Reminders & Deadlines.
          </p>
        </div>
        
        {/* Controls: Date Picker, View Mode Switcher, + Add Event, Schedule Meeting, Auto-Optimize */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector */}
          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            <button 
              onClick={handlePrevDate}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleTodayDate}
              className="text-xs font-bold px-3 py-1 bg-gray-100 hover:bg-[#F3EEFF] hover:text-[#7B3FF2] rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <span className="text-xs font-bold px-2 text-gray-700">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <button 
              onClick={handleNextDate}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar View Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200/80 shadow-xs">
            {(['day', 'week', 'month', 'agenda'] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-white text-[#7B3FF2] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* + Add Event Button */}
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-[#7B3FF2] to-[#632BD8] text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>

          {/* Schedule Meeting Button */}
          <button 
            onClick={handleOpenScheduleMeetingModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <Video className="w-4 h-4" />
            Schedule Meeting
          </button>

          {/* AI Auto-Optimize Button */}
          <button 
            onClick={handleAutoOptimize}
            disabled={isOptimizing}
            className="flex items-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black hover:shadow-md transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FF7A00] ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'AI Auto-Optimize'}
          </button>
        </div>
      </div>

      {/* 2. Conflict Warning Banner (If active) */}
      <AnimatePresence>
        {activeConflict && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-amber-900"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm flex items-center gap-2">
                  ⚠️ Schedule Conflict Detected
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  "<span className="font-semibold">{activeConflict.eventA.title}</span>" ({minutesToDisplayTime(timeToMinutes(activeConflict.eventA.startTime))}) overlaps with "<span className="font-semibold">{activeConflict.eventB.title}</span>" ({minutesToDisplayTime(timeToMinutes(activeConflict.eventB.startTime))}).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => handleResolveConflict('moveB')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Reschedule {activeConflict.eventB.category}
              </button>
              <button 
                onClick={() => handleResolveConflict('shorten')}
                className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Shorten Duration
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Search Bar & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events, meetings, attendees, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#7B3FF2] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5 text-[#7B3FF2]" /> Filter:
          </div>
          
          {/* Category Chips */}
          {['All', 'Task', 'Meeting', 'Focus Session', 'Break', 'Reminder'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategoryFilter === cat
                  ? 'bg-[#7B3FF2] text-white shadow-xs font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="w-px h-4 bg-gray-200 mx-1"></div>

          {/* Status Chips */}
          {['All', 'Pending', 'Completed', 'Carried Forward'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Schedule Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1">
        {/* Sub-header Metrics Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div className="w-3 h-3 rounded bg-purple-100 border border-purple-300"></div>
              Focus Blocks ({focusHours}h)
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
              Meetings ({meetingHours}h)
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300"></div>
              Carried Forward ({carriedForwardCount})
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
              Completed ({completedCount})
            </div>
          </div>

          <div className="text-xs font-bold text-[#7B3FF2] bg-[#F3EEFF] px-3 py-1 rounded-full border border-[#7B3FF2]/20 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-[#7B3FF2]" />
            {efficiencyScore}% AI Schedule Efficiency
          </div>
        </div>
        
        {/* VIEW 1: DAY VIEW (Google Calendar Style Hourly Timeline) */}
        {viewMode === 'day' && (
          <div className="flex-1 overflow-y-auto relative p-6 max-h-[700px]">
            {/* Horizontal Hour Grid & Time Labels */}
            <div className="relative min-h-[1152px]">
              {/* Continuous Vertical Timeline Line (centered with dots at left: 80px) */}
              <div className="absolute left-20 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>

              {/* Real-Time Current Time Indicator */}
              <div 
                className="absolute left-16 right-0 border-t-2 border-dashed border-[#7B3FF2] z-20 flex items-center pointer-events-none"
                style={{ top: `${(11.5 - START_HOUR) * HOUR_HEIGHT}px` }}
              >
                <div className="w-3 h-3 rounded-full bg-[#7B3FF2] transform -translate-x-1.5 ring-4 ring-[#7B3FF2]/20 animate-pulse"></div>
                <span className="ml-2 bg-[#7B3FF2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  NOW 11:30 AM
                </span>
              </div>

              {/* Hourly Grid Rows */}
              {hoursArray.map((hour) => {
                const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
                const period = hour >= 12 ? 'PM' : 'AM';
                const hourTop = (hour - START_HOUR) * HOUR_HEIGHT;

                return (
                  <div key={hour} className="absolute left-0 right-0" style={{ top: `${hourTop}px`, height: `${HOUR_HEIGHT}px` }}>
                    {/* Time Ruler Column */}
                    <div className="absolute left-0 w-16 text-right pr-4 transform -translate-y-2.5">
                      <span className="text-xs font-bold text-gray-400">
                        {`${hourFormatted < 10 ? '0' : ''}${hourFormatted}:00 ${period}`}
                      </span>
                    </div>

                    {/* Horizontal Divider Line */}
                    <div className="absolute left-20 right-0 top-0 border-t border-gray-100"></div>

                    {/* Half-hour Sub-line */}
                    <div className="absolute left-20 right-0 top-9 border-t border-dashed border-gray-50"></div>
                  </div>
                );
              })}

              {/* Event Cards Rendered Positionally */}
              {filteredEvents.map((item) => {
                const startMins = timeToMinutes(item.startTime);
                const endMins = timeToMinutes(item.endTime);
                const startOffsetHours = (startMins - START_HOUR * 60) / 60;
                const durationHours = Math.max(0.5, (endMins - startMins) / 60);

                const topPx = startOffsetHours * HOUR_HEIGHT;
                const heightPx = Math.max(54, durationHours * HOUR_HEIGHT - 6);
                
                // Color style determination based on Category & Prompt Rules:
                // Tasks -> Purple, Meetings -> Blue, Focus -> Violet, Breaks -> Green, Reminders -> Orange, Carry -> Light Orange, Personal -> Gray
                let colorKey: EventColor = item.color || 'purple';
                if (item.category === 'Meeting') colorKey = 'blue';
                else if (item.category === 'Focus Session') colorKey = 'violet';
                else if (item.category === 'Break') colorKey = 'green';
                else if (item.category === 'Reminder') colorKey = 'orange';
                else if (item.isCarriedForward) colorKey = 'light-orange';
                else if (item.category === 'Personal') colorKey = 'gray';

                const styleObj = getColorStyles(colorKey);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: `${topPx}px`,
                      left: '96px',
                      right: '16px',
                      height: `${heightPx}px`
                    }}
                    className="z-10 group"
                  >
                    {/* Timeline Dot Alignment */}
                    <div 
                      className={`absolute -left-[16px] top-4 w-3.5 h-3.5 rounded-full bg-white border-2 transform -translate-x-1/2 z-20 shadow-xs transition-transform group-hover:scale-125 ${
                        item.status === 'Completed' ? 'border-green-500 bg-green-500' : ''
                      }`}
                      style={{ borderColor: styleObj.hex }}
                    >
                      {item.status === 'Completed' && <Check className="w-2 h-2 text-white stroke-[3]" />}
                    </div>

                    {/* Event Block Card */}
                    <div 
                      onMouseDown={(e) => handleMouseDownDrag(e, item)}
                      className={`w-full h-full rounded-xl border p-3 shadow-xs flex flex-col justify-between transition-all group-hover:shadow-md cursor-grab active:cursor-grabbing relative overflow-hidden ${styleObj.bg} ${styleObj.border} ${
                        item.status === 'Completed' ? 'opacity-75' : ''
                      }`}
                    >
                      {/* Left color bar indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: styleObj.hex }}></div>

                      <div className="flex items-start justify-between gap-2 pl-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className={`font-bold text-sm text-gray-900 truncate ${item.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                              {item.category === 'Meeting' ? '📅 ' : ''}{item.title}
                            </h4>

                            {/* Category Badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${styleObj.badge}`}>
                              {item.category}
                            </span>

                            {/* Platform Badge for Meetings */}
                            {item.category === 'Meeting' && item.platform && (
                              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Video className="w-3 h-3 text-blue-600" /> {item.platform}
                              </span>
                            )}

                            {/* Carried Forward Badge */}
                            {item.isCarriedForward && (
                              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-600" /> Carried Forward
                              </span>
                            )}

                            {/* Priority Badge */}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                              item.priority === 'High' ? 'bg-red-100 text-red-700 border-red-200' :
                              item.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                              'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {item.priority}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-1 font-medium">{item.description}</p>
                        </div>

                        {/* Event Actions & Completion Checkbox */}
                        <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleComplete(item.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                              item.status === 'Completed'
                                ? 'bg-green-600 text-white border-green-600 shadow-xs'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            {item.status === 'Completed' ? 'Completed' : 'Done'}
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
                            title="Edit Event"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmationId(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Footer Details: Time, Attendees, Reminder, Notes Indicators */}
                      <div className="flex items-center justify-between text-xs font-medium text-gray-500 pl-2 mt-2 pt-1 border-t border-black/5">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-semibold text-gray-700">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {minutesToDisplayTime(startMins)} - {minutesToDisplayTime(endMins)} ({getDurationString(item.startTime, item.endTime)})
                          </span>

                          {/* Meeting Attendees */}
                          {item.category === 'Meeting' && item.attendees && item.attendees.length > 0 && (
                            <span className="flex items-center gap-1 text-[11px] bg-blue-100/70 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200/80 font-bold">
                              <Users className="w-3 h-3 text-blue-600" />
                              {item.attendees.length} Participants
                            </span>
                          )}

                          {item.subtasks && item.subtasks.length > 0 && (
                            <span className="flex items-center gap-1 text-[11px] bg-white/60 px-1.5 py-0.5 rounded border border-gray-200/60">
                              <CheckSquare className="w-3 h-3 text-[#7B3FF2]" />
                              {item.subtasks.filter(s => s.completed).length}/{item.subtasks.length} Subtasks
                            </span>
                          )}

                          {item.reminder && (
                            <span className="flex items-center gap-1 text-[11px] text-purple-700 bg-purple-100/60 px-1.5 py-0.5 rounded" title={`Reminder: ${item.reminder}`}>
                              <Bell className="w-3 h-3" />
                            </span>
                          )}

                          {item.notes && (
                            <span className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100/60 px-1.5 py-0.5 rounded" title={item.notes}>
                              <FileText className="w-3 h-3" /> Notes
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-gray-400">
                          <Move className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Bottom Resize Handle */}
                      <div 
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setResizingEventId(item.id);
                          setDragStartY(e.clientY);
                        }}
                        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-[#7B3FF2]/30 transition-colors"
                        title="Drag to resize duration"
                      />
                    </div>
                  </motion.div>
                );
              })}

              {filteredEvents.length === 0 && (
                <div className="absolute left-28 right-8 top-32 text-center py-16 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-700 text-sm">No events or meetings scheduled for this view</h3>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Click "+ Add Event" or "Schedule Meeting".</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: WEEK VIEW */}
        {viewMode === 'week' && (
          <div className="p-6 overflow-x-auto">
            <div className="min-w-[800px] grid grid-cols-7 gap-3">
              {['Mon Aug 3', 'Tue Aug 4', 'Wed Aug 5', 'Thu Aug 6', 'Fri Aug 7', 'Sat Aug 8', 'Sun Aug 9'].map((dayStr, i) => (
                <div key={i} className={`bg-gray-50 rounded-xl border p-3 ${i === 0 ? 'border-[#7B3FF2] bg-[#F3EEFF]/20' : 'border-gray-200'}`}>
                  <div className="text-center pb-2 border-b border-gray-200 mb-3">
                    <span className={`text-xs font-bold ${i === 0 ? 'text-[#7B3FF2]' : 'text-gray-700'}`}>{dayStr}</span>
                    {i === 0 && <span className="block text-[9px] font-bold text-[#7B3FF2] uppercase">Today</span>}
                  </div>

                  <div className="space-y-2 min-h-[300px]">
                    {i === 0 ? (
                      events.slice(0, 5).map((evt) => {
                        const styleObj = getColorStyles(evt.category === 'Meeting' ? 'blue' : evt.color);
                        return (
                          <div key={evt.id} className={`p-2 rounded-lg border text-xs ${styleObj.bg} ${styleObj.border}`}>
                            <span className="text-[10px] font-bold text-gray-500 block">{minutesToDisplayTime(timeToMinutes(evt.startTime))}</span>
                            <h5 className="font-bold text-gray-900 truncate text-[11px]">
                              {evt.category === 'Meeting' ? '📅 ' : ''}{evt.title}
                            </h5>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-[11px] text-gray-400">No events</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: MONTH VIEW */}
        {viewMode === 'month' && (
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-500 mb-2">
              <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                const isToday = dayNum === 3;
                return (
                  <div key={dayNum} className={`h-24 rounded-xl border p-1.5 flex flex-col justify-between text-xs transition-colors ${
                    isToday ? 'border-[#7B3FF2] bg-[#F3EEFF]/30' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-xs ${isToday ? 'bg-[#7B3FF2] text-white w-5 h-5 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
                        {dayNum}
                      </span>
                      {isToday && <span className="text-[9px] text-[#7B3FF2] font-bold">{events.length} items</span>}
                    </div>

                    {isToday ? (
                      <div className="space-y-1">
                        <div className="bg-blue-600 text-white text-[9px] font-bold px-1 py-0.5 rounded truncate">
                          09:00 Product Strategy
                        </div>
                        <div className="bg-[#7B3FF2] text-white text-[9px] font-bold px-1 py-0.5 rounded truncate">
                          11:00 Q3 Deck
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-300 italic">Empty</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: AGENDA VIEW */}
        {viewMode === 'agenda' && (
          <div className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 border-b pb-2 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#7B3FF2]" /> Integrated Agenda for {selectedDate}
            </h3>

            <div className="space-y-3">
              {filteredEvents.map((evt) => {
                const styleObj = getColorStyles(evt.category === 'Meeting' ? 'blue' : evt.color);
                return (
                  <div key={evt.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${styleObj.bg} ${styleObj.border}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-28 text-xs font-bold text-gray-700">
                        {minutesToDisplayTime(timeToMinutes(evt.startTime))} - {minutesToDisplayTime(timeToMinutes(evt.endTime))}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                          {evt.category === 'Meeting' ? '📅 ' : ''}{evt.title}
                          {evt.platform && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                              {evt.platform}
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-600">{evt.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${styleObj.badge}`}>
                        {evt.category}
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(evt)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. ADD EVENT MODAL (Tasks, Focus Sessions, Breaks, Reminders) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#7B3FF2]" />
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-5 text-xs font-medium">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Q3 Marketing Deck & Task Review"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#7B3FF2] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Add task details or focus session objective..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date || selectedDate}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime || '10:00'}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.endTime || '11:00'}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority || 'Medium'}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as EventPriority })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category || 'Task'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    >
                      <option value="Task">Task (Purple)</option>
                      <option value="Focus Session">Focus Session (Violet)</option>
                      <option value="Break">Break (Green)</option>
                      <option value="Reminder">Reminder (Orange)</option>
                      <option value="Personal">Personal (Gray)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Recurring Event</label>
                    <select
                      value={formData.recurring || 'None'}
                      onChange={(e) => setFormData({ ...formData, recurring: e.target.value as RecurringType })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    >
                      <option value="None">None</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                {/* Subtasks Section */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subtasks (Optional)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add subtask..."
                      value={newSubtaskInput}
                      onChange={(e) => setNewSubtaskInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                      className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#7B3FF2]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {(formData.subtasks || []).map((st) => (
                      <div key={st.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={() => handleToggleFormSubtask(st.id)}
                            className="rounded text-[#7B3FF2] focus:ring-[#7B3FF2]"
                          />
                          <span className={st.completed ? 'line-through text-gray-400' : 'text-gray-800'}>{st.title}</span>
                        </label>
                        <button type="button" onClick={() => handleRemoveSubtask(st.id)} className="text-gray-400 hover:text-red-500">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Notes & Details</label>
                  <textarea
                    rows={3}
                    placeholder="Rich text notes, links, or instructions..."
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2] focus:bg-white"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 pt-5 mt-6">
                {editingEvent ? (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmationId(editingEvent.id)}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-xs cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Event
                  </button>
                ) : <div />}

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEventDirectly}
                    className="px-4 py-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    {editingEvent ? 'Save Changes' : 'Save Event'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. SCHEDULE MEETING MODAL - EXACT MATCH TO USER SCREENSHOT */}
      <AnimatePresence>
        {isMeetingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F8F9FC] rounded-3xl border border-gray-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsMeetingModalOpen(false)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header matching exact screenshot text */}
              <div className="mb-8">
                <h2 className="text-2xl font-heading font-bold text-gray-900">
                  Smart Meeting Scheduler
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  PlanAI finds the best time for everyone without the back-and-forth.
                </p>
              </div>

              {/* 2-Column Grid Layout matching exact screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Card: Upcoming Meetings */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
                      Upcoming Meetings
                    </h3>

                    <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                      {events.filter(e => e.category === 'Meeting').map((evt, idx) => {
                        const dateObj = new Date(evt.date);
                        const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                        const dayStr = dateObj.getDate();

                        return (
                          <div key={evt.id || idx} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-[#F8F9FC]/60 hover:bg-[#F3EEFF]/30 transition-colors">
                            {/* Date Box */}
                            <div className="bg-white p-3 rounded-2xl border border-gray-200/80 text-center min-w-[64px] shadow-xs flex flex-col justify-center items-center">
                              <span className="text-[11px] font-extrabold text-red-500 uppercase tracking-wider">{monthStr || 'OCT'}</span>
                              <span className="text-xl font-bold text-gray-900 leading-tight">{dayStr || (13 + idx)}</span>
                            </div>

                            {/* Meeting Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-gray-900 truncate">{evt.title}</h4>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  {minutesToDisplayTime(timeToMinutes(evt.startTime))}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Video className="w-3.5 h-3.5 text-gray-400" />
                                  {evt.platform || 'Zoom'}
                                </span>
                              </div>

                              {/* Attendee Avatar Dots */}
                              <div className="flex -space-x-2 mt-3">
                                {[1, 2, 3].map((j) => (
                                  <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                                    <img 
                                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${j + idx * 3}`} 
                                      alt="avatar" 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {events.filter(e => e.category === 'Meeting').length === 0 && (
                        <div className="text-center py-10 text-xs text-gray-400">
                          No upcoming meetings scheduled.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Card: Schedule New Meeting */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                      Schedule New Meeting
                    </h3>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Meeting Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Weekly Sync"
                        value={meetingFormData.title}
                        onChange={(e) => setMeetingFormData({ ...meetingFormData, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7B3FF2] focus:ring-1 focus:ring-[#7B3FF2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Attendees</label>
                      <input
                        type="text"
                        placeholder="Add emails..."
                        value={attendeeEmailInput}
                        onChange={(e) => {
                          setAttendeeEmailInput(e.target.value);
                          const emails = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          if (emails.length > 0) {
                            setMeetingFormData(prev => ({ ...prev, attendees: emails }));
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7B3FF2] focus:ring-1 focus:ring-[#7B3FF2]"
                      />
                    </div>

                    {/* Additional Options: Date & Platform */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Date</label>
                        <input
                          type="date"
                          value={meetingFormData.date}
                          onChange={(e) => setMeetingFormData({ ...meetingFormData, date: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Platform</label>
                        <select
                          value={meetingFormData.platform}
                          onChange={(e) => setMeetingFormData({ ...meetingFormData, platform: e.target.value as MeetingPlatform })}
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                        >
                          <option value="Zoom">Zoom</option>
                          <option value="Google Meet">Google Meet</option>
                          <option value="Microsoft Teams">MS Teams</option>
                          <option value="In Person">In Person</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handleFindBestTimeForMeeting}
                      className="w-full bg-[#7B3FF2] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-[#5A2DD8] transition-colors cursor-pointer text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      Find Best Time
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. AI RECOMMENDED SCHEDULE PREVIEW (Side Panel / Modal) */}
      <AnimatePresence>
        {showAiPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#7B3FF2]" />
                    AI Recommended Schedule
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    PlanAI analyzed tasks, meetings, focus sessions, and attendees to build a zero-conflict timeline.
                  </p>
                </div>
                <button onClick={() => setShowAiPreviewModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rationale Explanation Box */}
              {previewExplanationQuote && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl mb-6 text-xs text-blue-900 font-medium leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-blue-950 mb-0.5">AI Schedule Explanation:</span>
                    "{previewExplanationQuote}"
                  </div>
                </div>
              )}

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Current Schedule Summary */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" /> Current Schedule
                  </h4>
                  <div className="space-y-2">
                    {events.filter(e => e.date === selectedDate).map(e => (
                      <div key={e.id} className="p-2.5 bg-white rounded-lg border border-gray-200 text-xs flex justify-between">
                        <span className="font-bold text-gray-800">{e.category === 'Meeting' ? '📅 ' : ''}{e.title}</span>
                        <span className="text-gray-500">{minutesToDisplayTime(timeToMinutes(e.startTime))}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposed Recommended Schedule */}
                <div className="bg-[#F3EEFF]/40 rounded-xl p-4 border border-[#7B3FF2]/20">
                  <h4 className="font-bold text-xs text-[#7B3FF2] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#7B3FF2]" /> Recommended Schedule
                  </h4>
                  <div className="space-y-2">
                    {previewChangesSummary.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-lg border border-[#7B3FF2]/30 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-gray-900">
                          <span>{item.title}</span>
                          <span className="text-[#7B3FF2]">
                            {item.oldTime} → {item.newTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 italic">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Productivity Impact Widget */}
              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-amber-50 p-4 rounded-xl border border-purple-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#7B3FF2]" /> AI Productivity Impact Score
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Schedule optimization eliminates meeting overlaps and preserves peak focus windows.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs flex-shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Current</span>
                    <span className="text-sm font-bold text-gray-600">{previewProductivityBefore}%</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#7B3FF2]" />
                  <div className="text-center">
                    <span className="text-[10px] text-[#7B3FF2] font-bold uppercase block">Optimized</span>
                    <span className="text-base font-extrabold text-[#7B3FF2]">{previewProductivityAfter}%</span>
                  </div>
                </div>
              </div>

              {/* AI Advice Bullet Points */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                <h4 className="font-bold text-xs text-gray-900 mb-2 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#FF7A00]" /> AI Optimization Insights
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {previewAiAdvice.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#7B3FF2] font-bold">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowAiPreviewModal(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyAiSchedulePreview}
                  className="px-5 py-2 bg-gradient-to-r from-[#7B3FF2] to-[#FF7A00] text-white rounded-xl font-bold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Apply Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deleteConfirmationId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-1">Delete Item?</h4>
              <p className="text-xs text-gray-500 mb-6">
                Are you sure you want to delete this event or meeting? The planner schedule will automatically reorganize.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteConfirmationId(null)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEvent(deleteConfirmationId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
