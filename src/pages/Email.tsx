import { motion } from 'motion/react';
import { Mail, Sparkles, AlertCircle, Clock, Check } from 'lucide-react';

export default function Email() {
  const emails = [
    {
      id: 1,
      sender: "Sarah Jenkins",
      subject: "Q3 Roadmap Update Required",
      time: "10:30 AM",
      summary: "Sarah is asking for the final Q3 roadmap deck by EOD today. She also mentioned the budget review is pushed to tomorrow.",
      actionItems: ["Send Q3 roadmap by EOD", "Update calendar for budget review"],
      isUrgent: true,
      read: false
    },
    {
      id: 2,
      sender: "David Chen",
      subject: "Design Sync Notes",
      time: "09:15 AM",
      summary: "Notes from the morning sync. The new logo variations are approved. Next step is to prepare the brand guidelines doc.",
      actionItems: ["Review brand guidelines doc (Deadline: Friday)"],
      isUrgent: false,
      read: false
    },
    {
      id: 3,
      sender: "Marketing Team",
      subject: "Weekly Newsletter Draft",
      time: "Yesterday",
      summary: "Draft for this week's newsletter is ready for review. Minor copy changes needed in the intro section.",
      actionItems: ["Review and approve newsletter draft"],
      isUrgent: false,
      read: true
    }
  ];

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Email Summarizer
            <div className="px-2 py-0.5 rounded-md bg-[#FFF3E8] text-[#FF7A00] text-xs font-bold uppercase tracking-wider">AI Powered</div>
          </h1>
          <p className="text-gray-500 text-sm mt-1">PlanAI automatically extracts summaries and action items from your inbox.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-8">
        {emails.map((email, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={email.id} 
            className={`bg-white rounded-2xl border ${email.read ? 'border-gray-100' : 'border-[#7B3FF2]/20 shadow-[0_4px_20px_rgba(123,63,242,0.05)]'} p-6 relative overflow-hidden`}
          >
            {email.isUrgent && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Urgent
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${email.read ? 'bg-gray-100 text-gray-500' : 'bg-[#F3EEFF] text-[#7B3FF2]'}`}>
                  {email.sender.charAt(0)}
                </div>
                <div>
                  <h3 className={`text-base font-semibold ${email.read ? 'text-gray-700' : 'text-gray-900'}`}>{email.sender}</h3>
                  <p className="text-sm text-gray-500">{email.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {email.time}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
              <div className="flex items-center gap-2 mb-2 text-[#7B3FF2] text-sm font-semibold">
                <Sparkles className="w-4 h-4" /> AI Summary
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{email.summary}</p>
            </div>

            {email.actionItems.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Extracted Action Items</h4>
                <div className="space-y-2">
                  {email.actionItems.map((action, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-[#7B3FF2]/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7B3FF2] focus:ring-[#7B3FF2]" />
                        <span className="text-sm font-medium text-gray-800">{action}</span>
                      </div>
                      <button className="text-xs font-medium text-[#7B3FF2] bg-[#F3EEFF] px-2 py-1 rounded hover:bg-[#7B3FF2] hover:text-white transition-colors">
                        Add to Tasks
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex gap-2">
              <button className="text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                View Original Email
              </button>
              <button className="text-sm font-medium text-white bg-[#7B3FF2] px-4 py-2 rounded-lg hover:bg-[#5A2DD8] transition-colors flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Generate Reply
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
