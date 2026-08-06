import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, Mail, Calendar, 
  Clock, Plus, ArrowRight, BarChart2, Sparkles, X, CheckCircle, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { dashboardApi } from '../lib/api';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const res = await dashboardApi.fetchSummary();
      if (res.success && res.data) {
        const data: any = res.data;
        if (data.tasks) setTasks(data.tasks);
        if (data.events) setEvents(data.events);
        if (data.emails) setEmails(data.emails);
      }
    };
    loadDashboard();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: { status: string }) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t: { status: string }) => t.status !== 'Completed');
  const todayMeetings = events.filter((e: { category: string }) => e.category === 'Meeting');

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Good morning, {user?.name || 'Friend'}! 👋
          </h1>
          <p className="text-gray-500 text-xs mt-1 font-medium">
            {todayDateString} • You have {pendingTasks.length} pending task{pendingTasks.length === 1 ? '' : 's'} and {todayMeetings.length} meeting{todayMeetings.length === 1 ? '' : 's'} today.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard/tasks')}
            className="flex items-center gap-2 bg-[#FF7A00] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#FF8F1F] transition-all shadow-[0_4px_14px_rgba(255,122,0,0.2)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-[#F3EEFF]/80 border border-[#7B3FF2]/20 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7B3FF2] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-gray-900">AI Productivity Assistant</h4>
            <p className="text-xs text-gray-700 font-medium leading-snug">
              {pendingTasks.length > 0
                ? `You have ${pendingTasks.length} task${pendingTasks.length === 1 ? '' : 's'} pending. Focus on high priority items first.`
                : `Your schedule is clear! Create your first task or event to let PlanAI optimize your workday.`}
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left Column: Today's Optimized Plan (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-[#7B3FF2]" />
              Today's Optimized Plan
            </h3>
            <Link to="/dashboard/planner" className="text-[#7B3FF2] text-xs font-semibold hover:underline flex items-center gap-1">
              View full calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-10 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-700 mb-1">No events scheduled for today</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                Keep your day organized by adding meetings, focus blocks, or break sessions.
              </p>
              <button
                onClick={() => navigate('/dashboard/planner')}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Event to Planner
              </button>
            </div>
          ) : (
            <div className="relative pl-2 space-y-4">
              <div className="absolute left-[78px] top-4 bottom-4 w-[2px] bg-gray-200"></div>
              {events.map((item: { startTime: string; title: string; category?: string; platform?: string; priority?: string }, idx: number) => (
                <div key={idx} className="flex items-center gap-4 relative group">
                  <span className="w-16 text-right text-xs font-bold text-gray-500 flex-shrink-0">{item.startTime}</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7B3FF2] z-10 flex-shrink-0 ring-4 ring-white"></div>
                  <div className="flex-1 p-3.5 rounded-xl border bg-[#F3EEFF]/40 border-gray-100 transition-all">
                    <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                    {item.category && (
                      <span className="text-[10px] font-medium text-[#7B3FF2] mt-0.5 inline-block">
                        {item.category} {item.platform ? `• ${item.platform}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Email Summary & Must Do Today (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Email Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 text-base">
                <Mail className="w-5 h-5 text-[#7B3FF2]" />
                Email Inbox ({emails.length})
              </h3>
              <Link to="/dashboard/email" className="text-[#7B3FF2] text-xs font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {emails.length === 0 ? (
              <div className="text-center py-6 px-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <Mail className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-gray-600 mb-1">No emails yet</p>
                <p className="text-[11px] text-gray-400">
                  Connect your Gmail or click "Fetch emails" in the Email tab.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {emails.slice(0, 3).map((email: { sender: string; initial: string; subject: string; priority?: string; time?: string }, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => navigate('/dashboard/email')} 
                    className="p-3 bg-gray-50/60 hover:bg-[#F3EEFF]/30 rounded-xl border border-gray-100 transition-colors cursor-pointer flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#7B3FF2] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {email.initial || email.sender.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-900">{email.sender}</h4>
                        {email.priority && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-[#7B3FF2]">
                            {email.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 truncate">{email.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Must Do Today Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 text-base">
                <CheckSquare className="w-5 h-5 text-[#FF7A00]" />
                Must Do Today ({pendingTasks.length})
              </h3>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center py-6 px-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-gray-700 mb-1">All caught up!</p>
                <p className="text-[11px] text-gray-400 mb-3">No pending tasks remaining.</p>
                <button
                  onClick={() => navigate('/dashboard/tasks')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.slice(0, 4).map((task: { title: string; priority?: string }, idx: number) => (
                  <div key={idx} onClick={() => navigate('/dashboard/tasks')} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7B3FF2] focus:ring-[#7B3FF2]" readOnly />
                      <span className="text-xs font-bold text-gray-800">{task.title}</span>
                    </label>
                    {task.priority && (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-100 text-[#FF7A00]">
                        {task.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Real Analytics Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 text-base">
            <BarChart2 className="w-5 h-5 text-[#7B3FF2]" />
            Your Productivity Summary
          </h3>
          <Link to="/dashboard/analytics" className="text-[#7B3FF2] text-xs font-semibold hover:underline flex items-center gap-1">
            View detailed analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <CheckSquare className="w-5 h-5 text-[#7B3FF2]" />, iconBg: "bg-[#F3EEFF]", label: "Total Tasks", value: `${totalTasks}`, sub: "Created by you" },
            { icon: <CheckCircle className="w-5 h-5 text-green-600" />, iconBg: "bg-green-50", label: "Completed", value: `${completedTasks}`, sub: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% completion` : "0% completion" },
            { icon: <Calendar className="w-5 h-5 text-[#FF7A00]" />, iconBg: "bg-[#FFF3E8]", label: "Scheduled Events", value: `${events.length}`, sub: "In your planner" },
            { icon: <Zap className="w-5 h-5 text-[#7B3FF2]" />, iconBg: "bg-[#F3EEFF]", label: "Emails", value: `${emails.length}`, sub: "In inbox" },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate('/dashboard/analytics')} 
              className="bg-gray-50/60 hover:bg-[#F3EEFF]/30 p-4 rounded-2xl border border-gray-100 transition-all cursor-pointer flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500">{stat.label}</span>
                <h4 className="text-xl font-heading font-extrabold text-gray-900">{stat.value}</h4>
                <span className="text-[11px] font-semibold text-gray-500">{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
