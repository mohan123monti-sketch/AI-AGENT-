import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Sparkles, AlertCircle, Clock, Check, Search, Archive, Send, Filter,
  ChevronRight, ArrowLeft, Tag, Calendar, Bell
} from 'lucide-react';

interface EmailItem {
  id: number;
  sender: string;
  emailAddr: string;
  subject: string;
  time: string;
  summary: string;
  body: string;
  actionItems: string[];
  followUpItem?: string;
  deadline?: string;
  priority: 'High' | 'Medium' | 'Low';
  actionRequired: boolean;
  archived: boolean;
  read: boolean;
  suggestedReply: string;
}

export default function Email() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(1);
  const [showArchived, setShowArchived] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [addedTasks, setAddedTasks] = useState<{ [key: string]: boolean }>({});

  const [emails, setEmails] = useState<EmailItem[]>([
    {
      id: 1,
      sender: "Sarah Jenkins",
      emailAddr: "sarah.jenkins@company.com",
      subject: "Q3 Roadmap Update Required",
      time: "10:30 AM",
      summary: "Sarah is asking for the final Q3 roadmap deck by EOD today. She also mentioned the budget review is pushed to tomorrow.",
      body: "Hi Alex,\n\nI hope you're having a good morning! Could you please share the updated Q3 roadmap deck with the team before 5 PM today? Also, note that our scheduled budget review meeting has been moved to tomorrow at 2 PM.\n\nBest,\nSarah",
      actionItems: ["Send Q3 roadmap deck by EOD today (5 PM)", "Update calendar for budget review tomorrow at 2 PM"],
      followUpItem: "Follow up with Sarah if deck is delayed past 4:30 PM",
      deadline: "Today, 5:00 PM",
      priority: "High",
      actionRequired: true,
      archived: false,
      read: false,
      suggestedReply: "Hi Sarah,\n\nThanks for the update. I will finalize and send over the Q3 roadmap deck by 5 PM today, and I've noted the budget review shift to tomorrow at 2 PM.\n\nBest regards,\nAlex"
    },
    {
      id: 2,
      sender: "David Chen",
      emailAddr: "david.chen@design.co",
      subject: "Design Sync Notes & Guidelines",
      time: "09:15 AM",
      summary: "Notes from the morning sync. The new logo variations are approved. Next step is to prepare the brand guidelines doc.",
      body: "Hey Alex,\n\nGreat news from the morning sync — all 3 new logo variations have been approved by leadership! Now we need to put together the full brand guidelines document before Friday.\n\nThanks,\nDavid",
      actionItems: ["Review and prepare brand guidelines document (Deadline: Friday)"],
      followUpItem: "Confirm color assets with design lead by Thursday",
      deadline: "Friday, 5:00 PM",
      priority: "Medium",
      actionRequired: true,
      archived: false,
      read: false,
      suggestedReply: "Hi David,\n\nAwesome news! I will start working on the brand guidelines document today and ensure it's completed by Friday.\n\nThanks,\nAlex"
    },
    {
      id: 3,
      sender: "Marketing Team",
      emailAddr: "newsletter@company.com",
      subject: "Weekly Newsletter Draft Review",
      time: "Yesterday",
      summary: "Draft for this week's newsletter is ready for review. Minor copy changes needed in the intro section.",
      body: "Hello Team,\n\nThe newsletter draft for issue #42 is ready. Please review section 2 for copy clarity before we schedule dispatch on Thursday.\n\nRegards,\nMarketing",
      actionItems: ["Review section 2 copy in newsletter draft #42"],
      followUpItem: "Approve draft before Thursday morning dispatch",
      deadline: "Thursday morning",
      priority: "Low",
      actionRequired: false,
      archived: false,
      read: true,
      suggestedReply: "Thanks Marketing Team! I will take a look at section 2 of the draft and leave comments shortly."
    }
  ]);

  const handleArchive = (id: number) => {
    setEmails(emails.map(e => e.id === id ? { ...e, archived: !e.archived } : e));
  };

  const handleGenerateReply = (email: EmailItem) => {
    setIsGeneratingReply(true);
    setTimeout(() => {
      setReplyText(email.suggestedReply);
      setIsGeneratingReply(false);
    }, 400);
  };

  const handleAddTask = (actionKey: string) => {
    setAddedTasks(prev => ({ ...prev, [actionKey]: true }));
  };

  const unreadCount = emails.filter(e => !e.read && !e.archived).length;

  const filteredEmails = emails.filter(e => {
    if (e.archived !== showArchived) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.sender.toLowerCase().includes(term) ||
      e.subject.toLowerCase().includes(term) ||
      e.summary.toLowerCase().includes(term)
    );
  });

  const activeEmail = emails.find(e => e.id === selectedEmailId) || filteredEmails[0];

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Email Assistant
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">AI inbox summaries, extracted action items, follow-up alerts, and reply suggestions.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showArchived ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Archive className="w-4 h-4" />
            {showArchived ? 'Viewing Archive' : 'View Archive'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Left Column: Inbox List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col h-full overflow-hidden">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search emails by sender, subject, or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {showArchived ? 'Archived Messages' : 'Inbox Emails'} ({filteredEmails.length})
            </span>
          </div>

          {/* Email Item Cards */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredEmails.map((email) => {
              const isSelected = activeEmail?.id === email.id;

              return (
                <div
                  key={email.id}
                  onClick={() => {
                    setSelectedEmailId(email.id);
                    setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F3EEFF]/40 border-[#7B3FF2] shadow-sm'
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-[#7B3FF2] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {email.sender.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight flex items-center gap-1.5">
                          {email.sender}
                          {!email.read && <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span>}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate max-w-[170px]">{email.subject}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400">{email.time}</span>
                  </div>

                  <div className="mt-2 text-xs text-gray-600 bg-white/80 p-2.5 rounded-lg border border-gray-100">
                    <span className="font-semibold text-[#7B3FF2]">AI Summary: </span>
                    <span className="line-clamp-2">{email.summary}</span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        email.priority === 'High' ? 'bg-red-100 text-red-600' :
                        email.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {email.priority} Priority
                      </span>
                      {email.actionRequired && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                          Action Required
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(email.id);
                      }}
                      className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100 text-xs flex items-center gap-1 cursor-pointer"
                      title={email.archived ? "Unarchive" : "Archive"}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredEmails.length === 0 && (
              <div className="py-12 text-center text-xs text-gray-400 font-medium">
                No emails found matching your filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Email Details View */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full overflow-y-auto">
          {activeEmail ? (
            <div className="space-y-6">
              {/* Top Meta Bar */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-heading font-bold text-gray-900">{activeEmail.subject}</h2>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      activeEmail.priority === 'High' ? 'bg-red-100 text-red-600' :
                      activeEmail.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {activeEmail.priority}
                    </span>
                    {activeEmail.actionRequired && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">From: <span className="font-medium text-gray-800">{activeEmail.sender}</span> ({activeEmail.emailAddr})</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleArchive(activeEmail.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    {activeEmail.archived ? 'Unarchive' : 'Archive'}
                  </button>
                </div>
              </div>

              {/* AI Summary Box */}
              <div className="bg-gradient-to-r from-[#F3EEFF] to-[#FFF3E8] p-4 rounded-xl border border-[#7B3FF2]/20 relative">
                <div className="flex items-center gap-2 mb-2 text-[#7B3FF2] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#7B3FF2]" /> AI Summary
                </div>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {activeEmail.summary}
                </p>
                {activeEmail.deadline && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-white/80 border border-[#FF7A00]/30 px-2.5 py-1 rounded-md text-xs font-semibold text-[#FF7A00]">
                    <Clock className="w-3.5 h-3.5" /> Deadline: {activeEmail.deadline}
                  </div>
                )}
              </div>

              {/* Extracted Action Items */}
              {activeEmail.actionItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Extracted Action Items</h4>
                  {activeEmail.actionItems.map((action, idx) => {
                    const actionKey = `${activeEmail.id}-${idx}`;
                    const isAdded = addedTasks[actionKey];

                    return (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3">
                        <span className="text-xs font-semibold text-gray-800">{action}</span>
                        <button 
                          onClick={() => handleAddTask(actionKey)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            isAdded
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-[#7B3FF2] text-white hover:bg-[#5A2DD8]'
                          }`}
                        >
                          {isAdded ? '✓ Added to Tasks' : '+ Add to Tasks'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Follow-up Items */}
              {activeEmail.followUpItem && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-800 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Suggested Follow-up: {activeEmail.followUpItem}</span>
                </div>
              )}

              {/* Email Content Body */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Content</h4>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-line font-sans leading-relaxed">
                  {activeEmail.body}
                </div>
              </div>

              {/* AI Reply Generator */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#7B3FF2]" /> AI Reply Suggestions
                  </h4>
                  <button 
                    onClick={() => handleGenerateReply(activeEmail)}
                    className="text-xs font-semibold text-[#7B3FF2] bg-[#F3EEFF] hover:bg-[#7B3FF2] hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {isGeneratingReply ? 'Generating...' : 'Auto-Generate Reply'}
                  </button>
                </div>

                <textarea 
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Click 'Auto-Generate Reply' or type your response..."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:border-[#7B3FF2]"
                />

                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setReplyText('')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => {
                      alert('Reply sent successfully!');
                      setReplyText('');
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#FF7A00] hover:bg-[#FF8F1F] flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-gray-400 text-sm">
              Select an email from the inbox list to view details and AI summaries.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
