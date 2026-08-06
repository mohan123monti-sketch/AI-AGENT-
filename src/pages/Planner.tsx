import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, 
  Sparkles, Plus, Video, Trash2, Edit2, X, Check, Bell, 
  ChevronDown, AlertCircle, FileText, CheckCircle2, User, Filter
} from 'lucide-react';
import { plannerApi } from '../lib/api';

export type EventCategory = 'Focus Block' | 'Meeting' | 'Carried Forward' | 'Break' | 'Task';
export type EventPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PlannerEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "08:00 AM"
  endTime?: string;
  category: EventCategory;
  priority?: EventPriority;
  tags?: string[];
  platform?: string; // e.g. "Zoom"
  meetingLink?: string;
  completed: boolean;
  isCarriedForward?: boolean;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
}

export default function Planner() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month' | 'Agenda'>('Day');
  const [agendaFilter, setAgendaFilter] = useState<string>("Today's Agenda");

  // Date format helpers
  const selectedDateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const miniHeaderString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Dynamic Mini Calendar math
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonthDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => daysInPrevMonth - firstDayOfWeek + 1 + i
  );
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Navigation Handlers
  const handlePrevDate = () => {
    const d = new Date(currentDate);
    if (viewMode === 'Month') {
      d.setMonth(d.getMonth() - 1);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const handleNextDate = () => {
    const d = new Date(currentDate);
    if (viewMode === 'Month') {
      d.setMonth(d.getMonth() + 1);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const handlePrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };


  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isScheduleMeetingModalOpen, setIsScheduleMeetingModalOpen] = useState(false);
  const [isMeetingTypeChoiceModalOpen, setIsMeetingTypeChoiceModalOpen] = useState(false);
  const [meetingTypeChoice, setMeetingTypeChoice] = useState<'zoom' | 'other' | null>(null);
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PlannerEvent | null>(null);

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  // Load events from the live workflow on mount
  useEffect(() => {
    const loadEvents = async () => {
      const res = await plannerApi.fetchEvents();
      if (res.success && Array.isArray(res.data)) {
        setEvents(res.data as PlannerEvent[]);
      }
    };
    loadEvents();
  }, []);

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'Focus Block' as EventCategory,
    priority: 'HIGH' as EventPriority,
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    platform: 'Zoom',
    meetingLink: ''
  });

  // Reminder Form State
  const [reminderForm, setReminderForm] = useState({
    title: '',
    time: 'Today, 5:00 PM',
    priority: 'High' as 'High' | 'Medium' | 'Low'
  });

  // Handlers
  const handleToggleComplete = (id: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        const nextState = !e.completed;
        showToast(nextState ? `Marked "${e.title}" as completed` : `Marked "${e.title}" as pending`);
        return { ...e, completed: nextState };
      }
      return e;
    }));
  };

  const handleDeleteEvent = async (id: string) => {
    const target = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id)); // optimistic
    showToast(`Deleted event "${target?.title}"`);
    await plannerApi.deleteEvent(id); // best-effort sync
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      category: 'Focus Block',
      priority: 'HIGH',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      platform: 'Zoom'
    });
    setIsAddEventModalOpen(true);
  };

  const handleOpenScheduleMeeting = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      category: 'Meeting',
      priority: 'HIGH',
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      platform: 'Zoom',
      meetingLink: ''
    });
    setIsMeetingTypeChoiceModalOpen(true);
  };

  const handleSelectZoomMeeting = () => {
    setMeetingTypeChoice('zoom');
    setEventForm(prev => ({ ...prev, platform: 'Zoom', meetingLink: '' }));
    setIsMeetingTypeChoiceModalOpen(false);
    setIsScheduleMeetingModalOpen(true);
  };

  const handleSelectOtherMeeting = () => {
    setMeetingTypeChoice('other');
    setEventForm(prev => ({ ...prev, platform: 'Other', meetingLink: '' }));
    setIsMeetingTypeChoiceModalOpen(false);
    setIsScheduleMeetingModalOpen(true);
  };

  const handleEditEvent = (evt: PlannerEvent) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title,
      description: evt.description,
      category: evt.category,
      priority: evt.priority || 'HIGH',
      startTime: evt.startTime,
      endTime: evt.endTime || '11:00 AM',
      platform: evt.platform || 'Zoom',
      meetingLink: evt.meetingLink || ''
    });
    setIsAddEventModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title.trim()) return;

    let tags: string[] = [];
    if (eventForm.category === 'Meeting') {
      tags = ['MEETING', eventForm.platform || 'Zoom', eventForm.priority];
    } else if (eventForm.category === 'Carried Forward') {
      tags = ['TASK', 'CARRIED FORWARD', eventForm.priority];
    } else if (eventForm.category === 'Break') {
      tags = ['BREAK', eventForm.priority];
    } else {
      tags = ['FOCUS', eventForm.priority];
    }

    let eventToSave: PlannerEvent;
    if (editingEvent) {
      eventToSave = {
        ...editingEvent,
        title: eventForm.title,
        description: eventForm.description,
        category: eventForm.category,
        priority: eventForm.priority,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        platform: eventForm.platform,
        meetingLink: eventForm.meetingLink,
        tags,
      };
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? eventToSave : e));
      showToast(`Updated "${eventForm.title}"`);
    } else {
      eventToSave = {
        id: `evt-${Date.now()}`,
        title: eventForm.title,
        description: eventForm.description,
        date: selectedDateString,
        startTime: eventForm.startTime,
        endTime: eventForm.endTime,
        category: eventForm.category,
        priority: eventForm.priority,
        platform: eventForm.platform,
        meetingLink: eventForm.meetingLink,
        tags,
        completed: false
      };
      setEvents(prev => [...prev, eventToSave]);
      showToast(`Created meeting "${eventForm.title}"`);
    }

    setIsAddEventModalOpen(false);
    setIsScheduleMeetingModalOpen(false);
    // Best-effort sync to backend
    await plannerApi.upsertEvent(eventToSave as unknown as Record<string, unknown>);
  };

  const handleSaveReminder = () => {
    if (!reminderForm.title.trim()) return;
    const newRem: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: reminderForm.title,
      time: reminderForm.time,
      priority: reminderForm.priority
    };
    setReminders(prev => [...prev, newRem]);
    setIsAddReminderModalOpen(false);
    showToast(`Reminder created for "${reminderForm.title}"`);
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-8 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">AI Daily Planner</h1>
          <p className="text-gray-500 text-xs mt-0.5">Your intelligent schedule for a productive day.</p>
        </div>

        {/* Center Date & View Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Date Picker Pill */}
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-xs text-xs font-semibold text-gray-700">
            <button 
              onClick={handlePrevDate}
              className="p-1 text-gray-400 hover:text-gray-900 cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button 
              onClick={handleToday}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-800 cursor-pointer mx-1"
            >
              Today
            </button>

            <span className="px-2 font-bold text-gray-900">{selectedDateString}</span>

            <button 
              onClick={handleNextDate}
              className="p-1 text-gray-400 hover:text-gray-900 cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Toggle Pill */}
          <div className="flex items-center bg-gray-100/80 p-1 rounded-full text-xs font-semibold text-gray-500">
            {(['Day', 'Week', 'Month', 'Agenda'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === mode 
                    ? 'bg-white text-[#7B3FF2] font-bold shadow-xs' 
                    : 'hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Add Event Button */}
          <button 
            onClick={handleOpenAddEvent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white font-bold text-xs shadow-md shadow-[#7B3FF2]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Sub Header Action Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={handleOpenScheduleMeeting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Video className="w-4 h-4" />
          Schedule Meeting
        </button>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Mini Calendar & Reminders */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Mini Calendar Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-gray-900">{miniHeaderString}</h3>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handlePrevMonth} 
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNextMonth} 
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-gray-400">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            {/* Calendar Dates Grid */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold gap-y-2">
              {/* Trailing days from previous month */}
              {prevMonthDays.map((day, idx) => (
                <span key={`prev-${idx}`} className="text-gray-300 py-1">{day}</span>
              ))}
              
              {/* Days for active month */}
              {monthDays.map(day => {
                const isSelected = currentDate.getDate() === day;
                return (
                  <div key={day} className="flex justify-center">
                    <button 
                      onClick={() => {
                        const d = new Date(currentDate);
                        d.setDate(day);
                        setCurrentDate(d);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-[#7B3FF2] text-white font-bold shadow-xs' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Reminders Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-gray-900">Upcoming Reminders</h3>
              <button 
                onClick={() => showToast("Viewing all reminders")}
                className="text-xs font-bold text-[#7B3FF2] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {reminders.map(rem => (
                <div key={rem.id} className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{rem.title}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">{rem.time}</p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                    rem.priority === 'High' ? 'bg-purple-50 text-[#7B3FF2]' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {rem.priority}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsAddReminderModalOpen(true)}
              className="text-xs font-bold text-[#7B3FF2] hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              + Add Reminder
            </button>
          </div>

        </div>

        {/* Right Column: Interactive Schedule Timeline */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col space-y-5 h-fit">
          
          {/* Legend Row & Agenda Filter Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7B3FF2]"></span>
                <span>Focus Blocks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                <span>Meetings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                <span>Carried Forward</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]"></span>
                <span>Breaks</span>
              </div>
            </div>

            <div className="relative">
              <select 
                value={agendaFilter}
                onChange={(e) => setAgendaFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="Today's Agenda">Today's Agenda</option>
                <option value="All Items">All Items</option>
                <option value="High Priority Only">High Priority Only</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Timeline View Items List */}
          <div className="relative space-y-4">
            {/* Event Items Cards */}
            {events.map((evt) => {
              // Accent styling mapping
              let borderAccent = "border-l-4 border-l-[#7B3FF2] bg-[#FAF5FF]";
              if (evt.category === 'Break') borderAccent = "border-l-4 border-l-[#10B981] bg-[#F4FBF7]";
              if (evt.category === 'Meeting') borderAccent = "border-l-4 border-l-[#3B82F6] bg-[#F5F8FF]";
              if (evt.category === 'Carried Forward') borderAccent = "border-l-4 border-l-[#F59E0B] bg-[#FFFBF0]";
              if (evt.category === 'Focus Block' && !evt.completed) borderAccent = "border-l-4 border-l-slate-700 bg-slate-50/70";

              return (
                <div 
                  key={evt.id}
                  className={`p-4 rounded-2xl border border-gray-100 shadow-xs relative transition-all ${borderAccent}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {/* Title & Tags */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-bold text-sm text-gray-900">{evt.title}</h4>

                        {evt.tags?.map((tag, idx) => (
                          <span 
                            key={idx}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              tag === 'BREAK' 
                                ? 'bg-gray-100 text-gray-600 border-gray-200'
                                : tag === 'LOW'
                                ? 'bg-gray-100 text-gray-600 border-gray-200'
                                : tag === 'MEETING'
                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                : tag === 'Zoom'
                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                : tag === 'HIGH'
                                ? 'bg-red-50 text-red-600 border-red-100'
                                : tag === 'TASK'
                                ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : tag === 'CARRIED FORWARD'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            {tag === 'Zoom' ? '📹 Zoom' : tag}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 font-medium">
                        {evt.description}
                      </p>
                    </div>

                    {/* Right Actions / Info */}
                    <div className="flex items-center gap-2 shrink-0">
                      {evt.category === 'Meeting' && (
                        <a
                          href={evt.meetingLink || 'https://zoom.us/join'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer no-underline"
                        >
                          <Video className="w-3.5 h-3.5 text-white" />
                          Join Meeting
                        </a>
                      )}

                      {evt.endTime && !evt.completed && (
                        <span className="text-xs font-semibold text-gray-400 mr-2">
                          ⏰ {evt.startTime} - {evt.endTime}
                        </span>
                      )}

                      {/* Completion Button */}
                      <button
                        onClick={() => handleToggleComplete(evt.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          evt.completed
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {evt.completed ? (evt.category === 'Carried Forward' ? 'Done' : 'Completed') : 'Done'}
                      </button>

                      {/* Edit Button */}
                      <button 
                        onClick={() => handleEditEvent(evt)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* ADD / EDIT EVENT MODAL */}
      <AnimatePresence>
        {isAddEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7B3FF2]" />
                  {editingEvent ? 'Edit Event' : 'Add New Schedule Event'}
                </h3>
                <button onClick={() => setIsAddEventModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Deep Focus Session"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#7B3FF2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Action goals or meeting agenda..."
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as EventCategory })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    >
                      <option value="Focus Block">Focus Block</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Carried Forward">Carried Forward</option>
                      <option value="Break">Break</option>
                      <option value="Task">Task</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                    <select
                      value={eventForm.priority}
                      onChange={(e) => setEventForm({ ...eventForm, priority: e.target.value as EventPriority })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    >
                      <option value="HIGH">High Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="LOW">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Start Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">End Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 11:30 AM"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                >
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STEP 1: MEETING TYPE CHOICE MODAL */}
      <AnimatePresence>
        {isMeetingTypeChoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#7B3FF2]" />
                  Schedule Meeting
                </h3>
                <button onClick={() => setIsMeetingTypeChoiceModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 font-medium">Choose how you would like to host your meeting:</p>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={handleSelectZoomMeeting}
                  className="p-4 rounded-xl border border-gray-200 hover:border-[#7B3FF2] hover:bg-[#F3EEFF]/40 transition-all text-left flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 group-hover:bg-[#7B3FF2] group-hover:text-white transition-colors">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#7B3FF2] transition-colors">Meeting with Zoom</h4>
                    <p className="text-xs text-gray-500">Fast Zoom video meeting with automated setup</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleSelectOtherMeeting}
                  className="p-4 rounded-xl border border-gray-200 hover:border-[#7B3FF2] hover:bg-[#F3EEFF]/40 transition-all text-left flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7B3FF2] flex items-center justify-center font-bold shrink-0 group-hover:bg-[#7B3FF2] group-hover:text-white transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#7B3FF2] transition-colors">Meeting with Other</h4>
                    <p className="text-xs text-gray-500">Custom meeting with meeting link</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STEP 2: SCHEDULE MEETING MODAL */}
      <AnimatePresence>
        {isScheduleMeetingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#7B3FF2]" />
                  {meetingTypeChoice === 'zoom' ? 'Schedule Zoom Meeting' : 'Schedule Meeting (Other)'}
                </h3>
                <button onClick={() => setIsScheduleMeetingModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Meeting Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Product Strategy Sync"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#7B3FF2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Start Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 02:00 PM"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">End Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 03:00 PM"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>
                </div>

                {meetingTypeChoice === 'other' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Meeting Link *</label>
                    <input
                      type="url"
                      placeholder="e.g. https://meet.google.com/abc-defg-hij"
                      value={eventForm.meetingLink}
                      onChange={(e) => setEventForm({ ...eventForm, meetingLink: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={eventForm.priority}
                    onChange={(e) => setEventForm({ ...eventForm, priority: e.target.value as EventPriority })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleMeetingModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                >
                  Schedule Meeting
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD REMINDER MODAL */}
      <AnimatePresence>
        {isAddReminderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#7B3FF2]" />
                  Add Reminder
                </h3>
                <button onClick={() => setIsAddReminderModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Reminder Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Submit quarterly report"
                    value={reminderForm.title}
                    onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#7B3FF2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Today, 5:00 PM"
                    value={reminderForm.time}
                    onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#7B3FF2]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddReminderModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReminder}
                  className="px-4 py-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                >
                  Save Reminder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
