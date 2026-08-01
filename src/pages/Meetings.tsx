import { motion } from 'motion/react';
import { Users, Calendar, Video, Clock } from 'lucide-react';

export default function Meetings() {
  return (
    <div className="max-w-5xl mx-auto h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Smart Meeting Scheduler</h1>
        <p className="text-gray-500 text-sm mt-1">PlanAI finds the best time for everyone without the back-and-forth.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="font-heading font-semibold text-lg mb-4">Upcoming Meetings</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="bg-white p-3 rounded-xl border border-gray-200 text-center min-w-[60px] shadow-sm">
                  <div className="text-xs font-bold text-red-500 uppercase">Oct</div>
                  <div className="text-xl font-bold text-gray-900">{12 + i}</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Product Strategy Sync</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 10:00 AM</span>
                    <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Zoom</span>
                  </div>
                  <div className="flex -space-x-2 mt-3">
                    {[1,2,3].map(j => (
                      <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-gray-300"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <h3 className="font-heading font-semibold text-lg mb-4">Schedule New Meeting</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200" placeholder="e.g. Weekly Sync" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200" placeholder="Add emails..." />
            </div>
            <button type="button" className="w-full bg-[#7B3FF2] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-[#5A2DD8] transition-colors">
              Find Best Time
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
