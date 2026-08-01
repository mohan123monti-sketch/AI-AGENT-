import { motion } from 'motion/react';
import { 
  Calendar, ChevronLeft, ChevronRight, Clock, 
  RefreshCw, Check, MoreHorizontal
} from 'lucide-react';

export default function Planner() {
  const schedule = [
    { time: "08:00 AM", title: "Morning Routine & Email Review", type: "routine", duration: "1h", color: "bg-gray-100 border-gray-200" },
    { time: "09:00 AM", title: "Daily Sync with Engineering", type: "meeting", duration: "30 min", color: "bg-blue-50 border-blue-200" },
    { time: "09:30 AM", title: "Deep Focus: Q3 Marketing Deck", type: "focus", duration: "2h", color: "bg-[#F3EEFF] border-[#7B3FF2]/20" },
    { time: "11:30 AM", title: "Quick Break", type: "break", duration: "30 min", color: "bg-green-50 border-green-200" },
    { time: "12:00 PM", title: "Lunch", type: "break", duration: "1h", color: "bg-green-50 border-green-200" },
    { time: "01:00 PM", title: "Client Review: Acme Corp", type: "meeting", duration: "1h", color: "bg-blue-50 border-blue-200" },
    { time: "02:00 PM", title: "Review PRs & Code", type: "task", duration: "1.5h", color: "bg-[#FFF3E8] border-[#FF7A00]/20" },
    { time: "03:30 PM", title: "Wrap up & Planning", type: "routine", duration: "30 min", color: "bg-gray-100 border-gray-200" },
  ];

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">AI Daily Planner</h1>
          <p className="text-gray-500 text-sm mt-1">Your schedule is optimized for maximum deep work today.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium px-2">Today, Oct 12</span>
            <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="flex items-center gap-2 bg-[#7B3FF2] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#5A2DD8] transition-all shadow-sm">
            <RefreshCw className="w-4 h-4" />
            Re-optimize
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div className="w-3 h-3 rounded bg-[#7B3FF2]/20 border border-[#7B3FF2]/40"></div>
              Focus Blocks (2h)
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
              Meetings (1.5h)
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div className="w-3 h-3 rounded bg-[#FF7A00]/10 border border-[#FF7A00]/20"></div>
              Tasks (1.5h)
            </div>
          </div>
          <div className="text-sm font-medium text-[#7B3FF2]">85% Efficiency Rating</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 relative">
          {/* Time scale line */}
          <div className="absolute left-16 top-6 bottom-6 w-px bg-gray-100"></div>
          
          <div className="space-y-4">
            {schedule.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="flex items-start gap-6 relative"
              >
                <div className="w-16 text-right pt-3">
                  <span className="text-xs font-semibold text-gray-500">{item.time}</span>
                </div>
                
                {/* Timeline node */}
                <div className="absolute left-16 w-3 h-3 rounded-full bg-white border-2 border-gray-300 transform -translate-x-1.5 mt-3.5 z-10"></div>
                
                <div className={`flex-1 rounded-xl border p-4 shadow-sm ${item.color} group hover:shadow-md transition-all`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        {item.type === 'focus' && (
                          <span className="bg-[#7B3FF2] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Focus</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.duration}</span>
                        {item.type === 'meeting' && <span>Zoom Room</span>}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-white text-gray-400 hover:text-green-600 rounded-lg shadow-sm border border-gray-100 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-white text-gray-400 hover:text-gray-700 rounded-lg shadow-sm border border-gray-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
