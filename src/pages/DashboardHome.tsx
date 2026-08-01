import { motion } from 'motion/react';
import { 
  CheckSquare, Calendar, Mail, 
  Clock, Bell, Plus, Play, MoreHorizontal, ArrowRight
} from 'lucide-react';

export default function DashboardHome() {
  const stats = [
    { label: "Productivity Score", value: "92%", change: "+4%", isPositive: true },
    { label: "Focus Hours", value: "14h", change: "+2h", isPositive: true },
    { label: "Task Completion", value: "24/28", change: "85%", isPositive: true }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Good morning, Alex!</h1>
          <p className="text-gray-500 text-sm mt-1">Here is your AI-optimized plan for today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Play className="w-4 h-4 text-[#7B3FF2]" />
            Start Focus Session
          </button>
          <button className="flex items-center gap-2 bg-[#FF7A00] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#FF8F1F] transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <div className="text-gray-500 text-sm font-medium mb-2">{stat.label}</div>
            <div className="flex items-end gap-3">
              <div className="text-3xl font-heading font-bold text-gray-900">{stat.value}</div>
              <div className={`text-xs font-medium mb-1 px-2 py-0.5 rounded-md ${stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Suggestions Card */}
          <div className="bg-gradient-to-br from-[#7B3FF2] to-[#5A2DD8] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <h3 className="font-medium text-sm text-white/90">AI Suggestion</h3>
              </div>
              <p className="text-lg font-medium leading-relaxed mb-4 max-w-lg">
                You have a solid 3-hour block before your next meeting. I recommend prioritizing the "Q3 Marketing Deck" to maximize your deep focus time.
              </p>
              <div className="flex gap-3">
                <button className="bg-white text-[#7B3FF2] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                  Accept Suggestion
                </button>
                <button className="bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
                  Ask AI to Reschedule
                </button>
              </div>
            </div>
          </div>

          {/* Today's Plan */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-lg text-gray-900">Today's Optimized Plan</h3>
              <button className="text-[#7B3FF2] text-sm font-medium hover:underline flex items-center gap-1">
                View full calendar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-6">
              {[
                { time: "09:00 AM", title: "Daily Sync with Engineering", type: "meeting", duration: "30 min", color: "bg-blue-500" },
                { time: "09:30 AM", title: "Deep Focus: Q3 Marketing Deck", type: "focus", duration: "2h", color: "bg-[#7B3FF2]" },
                { time: "11:30 AM", title: "Quick Break & Email Catchup", type: "break", duration: "30 min", color: "bg-gray-400" },
                { time: "12:00 PM", title: "Lunch", type: "break", duration: "1h", color: "bg-gray-400" },
                { time: "01:00 PM", title: "Client Review: Acme Corp", type: "meeting", duration: "1h", color: "bg-blue-500" },
                { time: "02:00 PM", title: "Review PRs & Code", type: "task", duration: "1.5h", color: "bg-[#FF7A00]" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-20 text-right pt-1">
                    <span className="text-sm font-medium text-gray-500">{item.time}</span>
                  </div>
                  <div className="relative flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${item.color}`}></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {item.duration}
                        </div>
                      </div>
                      <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Secondary Widgets */}
        <div className="space-y-6">
          {/* Recent Emails Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#7B3FF2]" />
                Inbox Summary
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-[#FFF3E8] rounded-xl border border-[#FF7A00]/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span>
                  <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider">Action Required</span>
                </div>
                <p className="text-sm text-gray-800 font-medium line-clamp-2">Sarah requested updates on the Q3 roadmap by EOD today.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">FYI</span>
                <p className="text-sm text-gray-700 line-clamp-2">Weekly design sync notes are available. No action needed.</p>
              </div>
              <button className="w-full py-2 text-sm font-medium text-[#7B3FF2] hover:bg-[#F3EEFF] rounded-lg transition-colors">
                View all emails
              </button>
            </div>
          </div>

          {/* Today's Top Priority Tasks */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-gray-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#FF7A00]" />
                Must Do Today
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { title: "Finalize Marketing Deck", priority: "High" },
                { title: "Approve budget request", priority: "High" },
                { title: "Review candidate profiles", priority: "Med" },
              ].map((task, i) => (
                <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#7B3FF2] focus:ring-[#7B3FF2] cursor-pointer" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {task.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
