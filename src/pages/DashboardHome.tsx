import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, Mail, Calendar, 
  Clock, Plus, ArrowRight, BarChart2, Sparkles, X, CheckCircle, Zap
} from 'lucide-react';

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Good morning, Alex! 👋
          </h1>
          <p className="text-gray-500 text-xs mt-1 font-medium">
            Saturday, Aug 1 • You have 7 tasks and 2 meetings today.
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
            <h4 className="font-heading font-bold text-sm text-gray-900">AI Insight</h4>
            <p className="text-xs text-gray-700 font-medium leading-snug">
              You have a 3-hour focus window before your next meeting.<br className="hidden sm:inline" /> Finish "Q3 Marketing Deck" first to maximize your deep work time.
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
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

          <div className="relative pl-2 space-y-4">
            {/* Timeline Line */}
            <div className="absolute left-[78px] top-4 bottom-4 w-[2px] bg-gray-200"></div>

            {[
              { time: "09:00 AM", title: "Daily Sync with Engineering", duration: "30 min", color: "bg-[#7B3FF2]", cardBg: "bg-[#F3EEFF]/40 border-gray-100" },
              { time: "09:30 AM", title: "Deep Focus: Q3 Marketing Deck", duration: "2h", color: "bg-[#7B3FF2]", cardBg: "bg-[#F3EEFF]/70 border-[#7B3FF2]/20 font-semibold" },
              { time: "11:30 AM", title: "Client Meeting", duration: "1h", color: "bg-[#FF7A00]", cardBg: "bg-[#FFF3E8]/80 border-[#FF7A00]/20" },
              { time: "01:00 PM", title: "Lunch Break", duration: "1h", color: "bg-[#7B3FF2]", cardBg: "bg-gray-50/80 border-gray-100" },
              { time: "02:00 PM", title: "Review Campaign Analytics", duration: "1.5h", color: "bg-[#7B3FF2]", cardBg: "bg-[#F3EEFF]/40 border-gray-100" },
              { time: "04:00 PM", title: "Team Standup", duration: "30 min", color: "bg-[#7B3FF2]", cardBg: "bg-[#F3EEFF]/40 border-gray-100" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 relative group">
                <span className="w-16 text-right text-xs font-bold text-gray-500 flex-shrink-0">{item.time}</span>
                
                {/* Timeline Dot */}
                <div className={`w-2.5 h-2.5 rounded-full ${item.color} z-10 flex-shrink-0 ring-4 ring-white`}></div>

                <div className={`flex-1 p-3.5 rounded-xl border ${item.cardBg} transition-all`}>
                  <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                  <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {item.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Email Summary & Must Do Today (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Email Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 text-base">
                <Mail className="w-5 h-5 text-[#7B3FF2]" />
                Email Summary
              </h3>
              <Link to="/dashboard/email" className="text-[#7B3FF2] text-xs font-semibold hover:underline flex items-center gap-1">
                View all emails <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { avatar: "S", avatarBg: "bg-red-100 text-red-600", sender: "Sarah", subject: "Q3 Roadmap", text: "Need roadmap updates before 5 PM.", priority: "HIGH", priorityBg: "bg-red-100 text-red-600", time: "4:30 PM" },
                { avatar: "D", avatarBg: "bg-orange-100 text-orange-600", sender: "David Chen", subject: "Design Sync Notes", text: "New logo variations approved, prepare...", priority: "MEDIUM", priorityBg: "bg-orange-100 text-orange-600", time: "2:15 PM" },
                { avatar: "M", avatarBg: "bg-blue-100 text-blue-600", sender: "Marketing Team", subject: "Weekly Newsletter Draft", text: "Draft for newsletter is ready for review.", priority: "LOW", priorityBg: "bg-blue-100 text-blue-600", time: "10:20 AM" },
              ].map((email, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate('/dashboard/email')} 
                  className="p-3 bg-gray-50/60 hover:bg-[#F3EEFF]/30 rounded-xl border border-gray-100 transition-colors cursor-pointer flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-full ${email.avatarBg} flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5`}>
                    {email.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900">{email.sender}</h4>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${email.priorityBg}`}>
                        {email.priority}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 truncate">{email.subject}</p>
                    <p className="text-[11px] text-gray-500 truncate">{email.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">{email.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Must Do Today Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 text-base">
                <CheckSquare className="w-5 h-5 text-[#FF7A00]" />
                Must Do Today
              </h3>
            </div>

            <div className="space-y-3">
              {[
                { title: "Finalize Marketing Deck", priority: "HIGH", priorityBg: "bg-red-100 text-red-600" },
                { title: "Approve budget request", priority: "HIGH", priorityBg: "bg-red-100 text-red-600" },
                { title: "Review candidate profiles", priority: "MEDIUM", priorityBg: "bg-orange-100 text-orange-600" },
              ].map((task, idx) => (
                <div key={idx} onClick={() => navigate('/dashboard/tasks')} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7B3FF2] focus:ring-[#7B3FF2]" />
                    <span className="text-xs font-bold text-gray-800">{task.title}</span>
                  </label>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${task.priorityBg}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/dashboard/tasks')}
              className="mt-3 text-xs font-bold text-[#7B3FF2] hover:underline cursor-pointer"
            >
              +4 remaining tasks
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Analytics Shortcut */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2 text-base">
            <BarChart2 className="w-5 h-5 text-[#7B3FF2]" />
            Analytics Shortcut
          </h3>
          <Link to="/dashboard/analytics" className="text-[#7B3FF2] text-xs font-semibold hover:underline flex items-center gap-1">
            View detailed analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Clock className="w-5 h-5 text-[#7B3FF2]" />, iconBg: "bg-[#F3EEFF]", label: "Focus Time", value: "4.2h", change: "+8% from yesterday" },
            { icon: <CheckCircle className="w-5 h-5 text-[#7B3FF2]" />, iconBg: "bg-[#F3EEFF]", label: "Tasks Completed", value: "12", change: "+3 from yesterday" },
            { icon: <Mail className="w-5 h-5 text-[#7B3FF2]" />, iconBg: "bg-[#F3EEFF]", label: "Emails Cleared", value: "15", change: "+5 from yesterday" },
            { icon: <Zap className="w-5 h-5 text-[#7B3FF2]" />, iconBg: "bg-[#F3EEFF]", label: "Productivity Score", value: "86%", change: "+6% from yesterday" },
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
                <span className="text-[11px] font-semibold text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
