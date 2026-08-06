import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, MapPin, Clock, Zap, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReminderItem {
  id: string;
  title: string;
  time: string;
  type?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

const REMINDERS_KEY = 'planai_user_reminders';
const EVENTS_KEY = 'planai_user_events';

export default function Reminders() {
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const savedReminders = localStorage.getItem(REMINDERS_KEY);
      const userReminders: ReminderItem[] = savedReminders ? JSON.parse(savedReminders) : [];

      const savedEvents = localStorage.getItem(EVENTS_KEY);
      const userEvents = savedEvents ? JSON.parse(savedEvents) : [];

      // Extract reminders from events if any
      const eventReminders: ReminderItem[] = userEvents
        .filter((e: { title: string }) => e.title)
        .map((e: { id: string; title: string; startTime?: string; date?: string; priority?: string }) => ({
          id: e.id,
          title: e.title,
          time: `${e.date || 'Today'} at ${e.startTime || 'Scheduled time'}`,
          type: 'Calendar Event',
          priority: (e.priority as 'High' | 'Medium' | 'Low') || 'Medium',
        }));

      return [...userReminders, ...eventReminders];
    } catch {
      return [];
    }
  });

  return (
    <div className="max-w-4xl mx-auto h-full pb-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Intelligent Reminders
            <Bell className="w-5 h-5 text-[#7B3FF2]" />
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Context-aware alerts based on urgency, location, and your scheduled items.</p>
        </div>

        <Link
          to="/dashboard/planner"
          className="flex items-center gap-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Reminder
        </Link>
      </div>

      {reminders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-xl mx-auto my-8 space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#F3EEFF] text-[#7B3FF2] mx-auto flex items-center justify-center">
            <Bell className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-bold text-gray-900">No Active Reminders</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Intelligent reminders trigger automatically when you schedule meetings or add reminders in your Daily Planner.
          </p>
          <Link
            to="/dashboard/planner"
            className="inline-flex items-center gap-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Open Daily Planner
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              key={reminder.id || i}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#7B3FF2]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F3EEFF] text-[#7B3FF2] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                  <div className="text-xs font-medium text-gray-500 mt-1">
                    {reminder.type || 'Alert'} • {reminder.time}
                  </div>
                </div>
              </div>
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-50 text-[#7B3FF2] border border-purple-100">
                {reminder.priority || 'Medium'}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
