import { motion } from 'motion/react';
import { FileText, Mic, Share, Download, Search, Sparkles } from 'lucide-react';

export default function Notes() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Smart Notes & Minutes</h1>
          <p className="text-gray-500 text-sm mt-1">AI-generated summaries, decisions, and action items from your meetings.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF7A00] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#FF8F1F] transition-all shadow-sm">
          <Mic className="w-4 h-4" />
          Start Recording
        </button>
      </div>

      <div className="flex gap-6 h-full min-h-0">
        {/* Note List */}
        <div className="w-1/3 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search notes..." className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm border-none focus:ring-1 focus:ring-[#7B3FF2]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-4 border-b border-gray-100 cursor-pointer ${i === 1 ? 'bg-[#F3EEFF] border-l-2 border-l-[#7B3FF2]' : 'hover:bg-gray-50'}`}>
                <h4 className={`text-sm font-semibold mb-1 ${i === 1 ? 'text-[#7B3FF2]' : 'text-gray-900'}`}>Q3 Roadmap Sync</h4>
                <p className="text-xs text-gray-500 line-clamp-2">Discussed the upcoming features for Q3 and finalized the budget allocation for marketing.</p>
                <div className="text-[10px] text-gray-400 mt-2 font-medium">Oct 12, 10:00 AM</div>
              </div>
            ))}
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-900">Q3 Roadmap Sync</h2>
              <div className="text-sm text-gray-500 mt-1">Oct 12, 10:00 AM • 45 mins</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-lg"><Share className="w-4 h-4" /></button>
              <button className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-lg"><Download className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 prose max-w-none">
            <h3 className="flex items-center gap-2 text-[#7B3FF2] font-semibold text-sm uppercase tracking-wider mb-4"><Sparkles className="w-4 h-4" /> AI Summary</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-8">
              The team reviewed the progress for Q2 and aligned on the primary objectives for Q3. The core focus will be expanding the enterprise features, specifically single sign-on (SSO) and advanced analytics. Marketing budget was approved at $50k.
            </p>
            
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4 border-b pb-2">Key Decisions</h3>
            <ul className="text-sm text-gray-700 space-y-2 mb-8 list-disc pl-5">
              <li>Proceed with the Enterprise tier launch in August.</li>
              <li>Allocate $50k to Q3 marketing campaigns.</li>
              <li>Delay the mobile app redesign to Q4.</li>
            </ul>

            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4 border-b pb-2">Action Items</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <input type="checkbox" className="mt-0.5 rounded text-[#7B3FF2]" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Draft Enterprise tier announcement blog post</div>
                  <div className="text-xs text-gray-500 mt-1">Assignee: Marketing Team • Deadline: Next Friday</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <input type="checkbox" className="mt-0.5 rounded text-[#7B3FF2]" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Finalize technical requirements for SSO</div>
                  <div className="text-xs text-gray-500 mt-1">Assignee: Engineering Lead • Deadline: EOD Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
