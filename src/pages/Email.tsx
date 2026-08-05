import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Search, Archive, Filter, Check, Clock, Bell, Plus, 
  Send, X, MoreVertical, FileText, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import { emailApi, getUnderConstructionMessage } from '../lib/api';

interface EmailItem {
  id: number;
  sender: string;
  emailAddr: string;
  initial: string;
  avatarBg: string;
  subject: string;
  time: string;
  fullTime: string;
  preview: string;
  summary: string;
  body: string;
  actionItems: string[];
  followUpItem?: string;
  deadline?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionRequired: boolean;
  archived: boolean;
  read: boolean;
  suggestedReply: string;
}

export default function Email() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'High Priority'>('All');
  const [selectedEmailId, setSelectedEmailId] = useState<number>(1);
  const [showArchived, setShowArchived] = useState(false);
  
  // Interactive States
  const [addedTasks, setAddedTasks] = useState<{ [key: string]: boolean }>({});
  const [reminderSet, setReminderSet] = useState<{ [key: number]: boolean }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modals
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'under-construction' | 'error' | 'loaded'>('idle');

  const [isOriginalEmailOpen, setIsOriginalEmailOpen] = useState(false);
  const [isGenerateReplyOpen, setIsGenerateReplyOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'Professional' | 'Casual' | 'Concise'>('Professional');
  const [replyText, setReplyText] = useState('');

  const EMAIL_STORAGE_KEY = 'planai_user_emails';

  const [emails, setEmails] = useState<EmailItem[]>(() => {
    try {
      const saved = localStorage.getItem(EMAIL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist local emails
  useEffect(() => {
    localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(emails));
  }, [emails]);

  // ── Load real emails from the workflow on mount ──────────────────────────
  const handleFetchEmails = async () => {
    setIsLoadingEmails(true);
    const res = await emailApi.fetchEmails(100);
    setIsLoadingEmails(false);

    if (res.underConstruction) {
      setApiStatus('under-construction');
      showToast('Webhook under construction — check WEBHOOK_URL in .env');
      return;
    }

    if (res.success && res.data) {
      setApiStatus('loaded');
      const payload = res.data as { emails?: EmailItem[]; data?: EmailItem[]; result?: EmailItem[] } | EmailItem[];
      const fetchedList = Array.isArray(payload) 
        ? payload 
        : (payload.emails || payload.data || payload.result || []);
      
      if (fetchedList.length > 0) {
        setEmails(fetchedList);
        showToast(`Fetched ${fetchedList.length} emails via AI workflow!`);
      } else {
        showToast('Webhook triggered! Check Agent Builder canvas output.');
      }
    } else {
      setApiStatus('error');
      showToast(res.error || 'Failed to fetch emails from webhook');
    }
  };

  useEffect(() => {
    handleFetchEmails();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleArchive = async (id: number) => {
    const target = emails.find(e => e.id === id);
    const newArchived = !target?.archived;
    // Optimistic update
    setEmails(prev => prev.map(e => e.id === id ? { ...e, archived: newArchived } : e));
    showToast(target?.archived ? 'Email unarchived' : 'Email moved to archive');
    // Sync to backend (best-effort — silent fail if under construction)
    await emailApi.archiveEmail(id, newArchived);
  };

  const handleAddTask = (key: string, title: string) => {
    setAddedTasks(prev => ({ ...prev, [key]: true }));
    showToast(`Task added: "${title.slice(0, 30)}..."`);
  };

  const handleAddAllTasks = (email: EmailItem) => {
    const newTasks: { [key: string]: boolean } = { ...addedTasks };
    email.actionItems.forEach((_, idx) => {
      newTasks[`${email.id}-${idx}`] = true;
    });
    setAddedTasks(newTasks);
    showToast(`All ${email.actionItems.length} action items added to Tasks!`);
  };

  const handleSetReminder = (id: number) => {
    setReminderSet(prev => ({ ...prev, [id]: true }));
    showToast("Follow-up reminder set successfully!");
  };

  const handleOpenGenerateReply = async (email: EmailItem) => {
    setReplyText(email.suggestedReply);
    setIsGenerateReplyOpen(true);
    // Pre-generate reply from the workflow (Mistral LLM node)
    const res = await emailApi.generateReply({
      emailId: email.id,
      to: email.emailAddr,
      subject: `Re: ${email.subject}`,
      tone: selectedTone,
      replyText: email.suggestedReply,
      send: false,
    });
    if (res.success && res.data) {
      const payload = res.data as { reply?: string; text?: string; output?: string };
      const generated = payload.reply || payload.text || payload.output;
      if (generated) setReplyText(generated);
    }
  };

  const handleSendReply = async () => {
    setIsGenerateReplyOpen(false);
    // Actually send via Gmail through the workflow (Mistral → Gmail Send node)
    if (activeEmail) {
      await emailApi.generateReply({
        emailId: activeEmail.id,
        to: activeEmail.emailAddr,
        subject: `Re: ${activeEmail.subject}`,
        tone: selectedTone,
        replyText,
        send: true,
      });
    }
    showToast('Smart reply sent successfully!');
  };

  // Filtering
  const filteredEmails = emails.filter(e => {
    if (e.archived !== showArchived) return false;
    
    // Tab filter
    if (activeTab === 'Unread' && e.read) return false;
    if (activeTab === 'High Priority' && e.priority !== 'HIGH') return false;

    // Search filter
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.sender.toLowerCase().includes(term) ||
      e.subject.toLowerCase().includes(term) ||
      e.summary.toLowerCase().includes(term)
    );
  });

  const unreadCount = emails.filter(e => !e.read && !e.archived).length;
  const highPriorityCount = emails.filter(e => e.priority === 'HIGH' && !e.archived).length;
  const allCount = emails.filter(e => !e.archived).length;

  const activeEmail = emails.find(e => e.id === selectedEmailId) || filteredEmails[0] || emails[0];

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">

      {/* Under Construction / API Status Banner */}
      {apiStatus === 'under-construction' && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {getUnderConstructionMessage('Email workflow')} — showing demo data.
          </span>
        </div>
      )}
      {isLoadingEmails && (
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-xl text-xs font-medium text-[#7B3FF2]">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          Fetching & summarizing your emails via AI...
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-8 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Email Assistant</h1>
          <p className="text-gray-500 text-xs mt-1">
            AI summaries, action items, follow-ups, and smart replies — powered by Agent Builder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleFetchEmails}
            disabled={isLoadingEmails}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white transition-all cursor-pointer shadow-md shadow-[#7B3FF2]/20 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoadingEmails ? 'animate-spin' : ''}`} />
            {isLoadingEmails ? 'Fetching Emails...' : 'Sync & Fetch Emails (AI)'}
          </button>

          <button 
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
              showArchived 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            {showArchived ? 'View Inbox' : 'View Archive'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Inbox List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col h-[700px]">
          
          {/* Search bar & Filter button */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search inbox..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#7B3FF2]/40 transition-all"
              />
            </div>
            <button 
              className="p-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Filter"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border-b border-gray-100 mb-3 space-x-6">
            <button
              onClick={() => setActiveTab('All')}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'All' ? 'text-[#7B3FF2]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              All ({allCount})
              {activeTab === 'All' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B3FF2] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('Unread')}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'Unread' ? 'text-[#7B3FF2]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Unread ({unreadCount})
              {activeTab === 'Unread' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B3FF2] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('High Priority')}
              className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'High Priority' ? 'text-[#7B3FF2]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              High Priority ({highPriorityCount})
              {activeTab === 'High Priority' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B3FF2] rounded-full" />
              )}
            </button>
          </div>

          {/* Email Item Cards List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredEmails.map((email) => {
              const isSelected = activeEmail?.id === email.id;

              return (
                <div
                  key={email.id}
                  onClick={() => {
                    setSelectedEmailId(email.id);
                    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
                  }}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer relative border ${
                    isSelected 
                      ? 'bg-white border-2 border-[#7B3FF2] shadow-sm' 
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
                  }`}
                >
                  {/* Top Row: Avatar, Sender, Time */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${email.avatarBg}`}>
                        {email.initial}
                      </div>
                      <h4 className="font-bold text-xs text-gray-900">{email.sender}</h4>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{email.time}</span>
                  </div>

                  {/* Middle Row: Subject & Priority Tag */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h5 className="font-bold text-xs text-gray-900 truncate max-w-[200px]">
                      {email.subject}
                    </h5>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      email.priority === 'HIGH' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : email.priority === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-purple-50 text-purple-600 border-purple-100'
                    }`}>
                      {email.priority}
                    </span>
                  </div>

                  {/* Bottom Row: Preview & Unread Indicator */}
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-400 truncate max-w-[260px]">
                      {email.preview}
                    </p>
                    {!email.read && (
                      <span className="w-2 h-2 rounded-full bg-[#7B3FF2] shrink-0"></span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredEmails.length === 0 && (
              <div className="py-16 text-center text-xs text-gray-400 font-medium">
                No emails found matching your filters.
              </div>
            )}
          </div>

          {/* List Footer */}
          <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400 font-medium px-1">
            Showing 1 to {filteredEmails.length} of {emails.length} emails
          </div>
        </div>

        {/* Right Column: AI Detail & Workspace Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-[700px] overflow-y-auto">
          {activeEmail ? (
            <div className="space-y-5">
              
              {/* Email Detail Top Title Bar */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-heading font-bold text-gray-900">
                      {activeEmail.subject}
                    </h2>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                      activeEmail.priority === 'HIGH' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {activeEmail.priority} PRIORITY
                    </span>

                    {activeEmail.actionRequired && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 uppercase">
                        ACTION REQUIRED
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 font-medium space-y-0.5">
                    <div>From: <span className="text-gray-700 font-semibold">{activeEmail.sender}</span> ({activeEmail.emailAddr})</div>
                    <div>To: <span className="text-gray-700 font-semibold">You</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium">{activeEmail.fullTime}</span>
                  
                  <button 
                    onClick={() => handleToggleArchive(activeEmail.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </button>

                  <button className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 1. AI SUMMARY SECTION */}
              <div className="bg-gradient-to-r from-[#FAF6FF] to-[#FFF5F3] border border-purple-100 rounded-2xl p-5 shadow-xs relative">
                <div className="flex items-center gap-1.5 text-[#7B3FF2] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 fill-[#7B3FF2]/20" />
                  AI SUMMARY
                </div>
                
                <p className="text-xs text-gray-800 font-medium leading-relaxed">
                  {activeEmail.summary}
                </p>

                {activeEmail.deadline && (
                  <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50/80 border border-orange-200/80 text-[#FF7A00] text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline: {activeEmail.deadline}
                  </div>
                )}
              </div>

              {/* 2. EXTRACTED ACTION ITEMS */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  EXTRACTED ACTION ITEMS
                </h4>

                <div className="space-y-2.5">
                  {activeEmail.actionItems.map((item, idx) => {
                    const taskKey = `${activeEmail.id}-${idx}`;
                    const isDone = addedTasks[taskKey];

                    return (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50/70 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isDone || false}
                            onChange={() => handleAddTask(taskKey, item)}
                            className="w-4 h-4 rounded text-[#7B3FF2] focus:ring-[#7B3FF2] border-gray-300 cursor-pointer"
                          />
                          <span className={`text-xs font-medium ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {item}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddTask(taskKey, item)}
                          disabled={isDone}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                            isDone
                              ? 'bg-green-50 text-green-600 border border-green-200'
                              : 'bg-[#F3EEFF] text-[#7B3FF2] hover:bg-[#7B3FF2] hover:text-white border border-[#7B3FF2]/20'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {isDone ? 'Added to Tasks' : 'Add to Tasks'}
                        </button>
                      </div>
                    );
                  })}

                  <button 
                    onClick={() => handleAddAllTasks(activeEmail)}
                    className="text-xs font-bold text-[#7B3FF2] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    + Add all to Tasks
                  </button>
                </div>
              </div>

              {/* 3. SUGGESTED FOLLOW-UP */}
              {activeEmail.followUpItem && (
                <div className="bg-[#F4F8FF] border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-1">
                      <Bell className="w-3.5 h-3.5" />
                      SUGGESTED FOLLOW-UP
                    </div>
                    <p className="text-xs text-gray-800 font-medium">
                      {activeEmail.followUpItem}
                    </p>
                  </div>

                  <button 
                    onClick={() => handleSetReminder(activeEmail.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 border ${
                      reminderSet[activeEmail.id]
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 shadow-xs'
                    }`}
                  >
                    {reminderSet[activeEmail.id] ? '✓ Reminder Set' : '+ Set Reminder'}
                  </button>
                </div>
              )}

              {/* 4. BOTTOM ACTION BUTTONS */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button 
                  onClick={() => setIsOriginalEmailOpen(true)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  View Original Email
                </button>

                <button 
                  onClick={() => handleOpenGenerateReply(activeEmail)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7B3FF2] to-[#632BD8] text-white hover:opacity-95 font-bold text-xs shadow-md shadow-[#7B3FF2]/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-white/20" />
                  Generate Reply
                </button>
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-gray-400 text-xs font-medium">
              Select an email from the inbox list to view AI summaries and action items.
            </div>
          )}
        </div>

      </div>

      {/* VIEW ORIGINAL EMAIL MODAL */}
      <AnimatePresence>
        {isOriginalEmailOpen && activeEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#7B3FF2]" />
                  Original Email
                </h3>
                <button onClick={() => setIsOriginalEmailOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div><span className="font-bold text-gray-700">Subject:</span> {activeEmail.subject}</div>
                <div><span className="font-bold text-gray-700">From:</span> {activeEmail.sender} &lt;{activeEmail.emailAddr}&gt;</div>
                <div><span className="font-bold text-gray-700">Date:</span> {activeEmail.fullTime}</div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                {activeEmail.body}
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setIsOriginalEmailOpen(false)}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GENERATE REPLY MODAL */}
      <AnimatePresence>
        {isGenerateReplyOpen && activeEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7B3FF2]" />
                  AI Smart Reply
                </h3>
                <button onClick={() => setIsGenerateReplyOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tone Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Select Tone:</label>
                <div className="flex gap-2">
                  {(['Professional', 'Casual', 'Concise'] as const).map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedTone === tone
                          ? 'bg-[#7B3FF2] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Reply Textarea */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Generated Response:</label>
                <textarea 
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#7B3FF2]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setReplyText(activeEmail.suggestedReply)}
                  className="text-xs text-[#7B3FF2] font-bold hover:underline cursor-pointer"
                >
                  Regenerate
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGenerateReplyOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="px-5 py-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
