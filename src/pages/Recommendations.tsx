import { motion } from 'motion/react';
import { Lightbulb, Sparkles, TrendingUp, Battery, Clock, Users } from 'lucide-react';

export default function Recommendations() {
  return (
    <div className="max-w-4xl mx-auto h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
          AI Recommendations
          <Sparkles className="w-5 h-5 text-[#FF7A00]" />
        </h1>
        <p className="text-gray-500 text-sm mt-1">Personalized insights to improve your work habits and well-being.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Optimize Work Hours", desc: "You complete tasks 30% faster between 8 AM and 11 AM. Try scheduling deep work then.", icon: <Clock className="w-6 h-6 text-blue-500" /> },
          { title: "Break Time Alert", desc: "You've been working for 2.5 hours straight. A 15-minute break will boost afternoon energy.", icon: <Battery className="w-6 h-6 text-green-500" /> },
          { title: "Meeting Overload", desc: "You have 15 hours of meetings this week. Consider declining non-essential syncs.", icon: <Users className="w-6 h-6 text-red-500" /> },
          { title: "Focus Improvement", desc: "Your focus score is up 12% this week! Keep up the Pomodoro technique.", icon: <TrendingUp className="w-6 h-6 text-[#7B3FF2]" /> },
        ].map((rec, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#7B3FF2] to-[#FF7A00]"></div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                {/* Fallback to simple icon since not all are imported */}
                <Sparkles className="w-6 h-6 text-[#7B3FF2]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="text-xs font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5">Dismiss</button>
              <button className="text-xs font-medium text-white bg-[#7B3FF2] rounded-lg px-3 py-1.5 hover:bg-[#5A2DD8]">Apply Suggestion</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
