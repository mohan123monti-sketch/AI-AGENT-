import { motion } from 'motion/react';
import { 
  CheckSquare, Plus, Filter, MoreHorizontal, 
  Clock, AlertCircle, ArrowUpRight
} from 'lucide-react';

export default function Tasks() {
  const columns = [
    {
      title: 'High Priority / Urgent',
      color: 'bg-red-50 border-red-100',
      textColor: 'text-red-700',
      tasks: [
        { id: 1, title: 'Finalize Q3 Marketing Deck', project: 'Marketing', deadline: 'Today, 5 PM', aiScore: 98 },
        { id: 2, title: 'Approve Budget Request', project: 'Finance', deadline: 'Today, 2 PM', aiScore: 95 },
      ]
    },
    {
      title: 'Medium Priority / Upcoming',
      color: 'bg-orange-50 border-orange-100',
      textColor: 'text-orange-700',
      tasks: [
        { id: 3, title: 'Review Candidate Profiles', project: 'HR', deadline: 'Tomorrow', aiScore: 75 },
        { id: 4, title: 'Draft Product Update Blog', project: 'Marketing', deadline: 'Wed, 10 AM', aiScore: 68 },
      ]
    },
    {
      title: 'Low Priority / Backlog',
      color: 'bg-gray-50 border-gray-100',
      textColor: 'text-gray-700',
      tasks: [
        { id: 5, title: 'Update internal wiki', project: 'Engineering', deadline: 'Next Week', aiScore: 32 },
        { id: 6, title: 'Research new CRM tools', project: 'Sales', deadline: 'No deadline', aiScore: 25 },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Smart Task Prioritization
            <div className="px-2 py-0.5 rounded-md bg-[#F3EEFF] text-[#7B3FF2] text-xs font-bold uppercase tracking-wider">AI Sorted</div>
          </h1>
          <p className="text-gray-500 text-sm mt-1">PlanAI has automatically ordered your tasks based on deadlines, importance, and workload.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-[#FF7A00] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#FF8F1F] transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {columns.map((col, idx) => (
            <div key={idx} className={`w-80 flex flex-col rounded-2xl border ${col.color} p-4`}>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className={`font-semibold text-sm ${col.textColor}`}>{col.title}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/50 ${col.textColor}`}>
                  {col.tasks.length}
                </span>
              </div>
              
              <div className="flex-1 space-y-3">
                {col.tasks.map((task, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={task.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#7B3FF2]/30 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#7B3FF2] focus:ring-[#7B3FF2]" />
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">{task.title}</h4>
                      </div>
                      <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                          {task.project}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <div className={`flex items-center gap-1 text-xs font-medium ${idx === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                          {idx === 0 ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {task.deadline}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs font-bold text-[#7B3FF2] bg-[#F3EEFF] px-1.5 py-0.5 rounded border border-[#7B3FF2]/20" title="AI Priority Score">
                          <ArrowUpRight className="w-3 h-3" />
                          {task.aiScore}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-colors">
                <Plus className="w-4 h-4" />
                Add task
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
