import { motion } from 'motion/react';
import { Bell, MapPin, Clock, Zap } from 'lucide-react';

export default function Reminders() {
  return (
    <div className="max-w-4xl mx-auto h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Intelligent Reminders</h1>
        <p className="text-gray-500 text-sm mt-1">Context-aware alerts based on urgency, location, and your habits.</p>
      </div>

      <div className="space-y-4">
        {[
          { title: "Review Contract before Acme meeting", type: "Contextual", icon: <Zap className="w-5 h-5 text-yellow-500" />, time: "In 30 mins" },
          { title: "Pick up dry cleaning", type: "Location-based", icon: <MapPin className="w-5 h-5 text-blue-500" />, time: "When leaving office" },
          { title: "Submit Expense Report", type: "Deadline", icon: <Clock className="w-5 h-5 text-red-500" />, time: "Tomorrow, 5 PM" },
        ].map((reminder, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#7B3FF2]/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                {reminder.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                <div className="text-xs font-medium text-gray-500 mt-1">{reminder.type} • {reminder.time}</div>
              </div>
            </div>
            <button className="text-[#7B3FF2] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-[#F3EEFF] px-3 py-1.5 rounded-lg">
              Edit
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
