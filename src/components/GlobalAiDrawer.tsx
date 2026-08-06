import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, X, Send, Mic, MicOff, Lightbulb, Clock, CheckCircle2, 
  AlertCircle, ArrowRight, Zap, RefreshCw, Bot, MessageSquare
} from 'lucide-react';
import { chatApi } from '../lib/api';
import { hasUserData, generateUserRecommendations } from '../lib/userData';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function GlobalAiDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hi! I'm PlanAI Assistant 👋\nHow can I help improve your productivity today?",
      time: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations'>('recommendations');

  const userHasData = hasUserData();
  const recommendations = userHasData ? generateUserRecommendations() : [];

  const suggestedPrompts = [
    "Analyze my day",
    "Show unread emails",
    "Prioritize my tasks",
    "Create focus block"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setActiveTab('chat');
    setIsTyping(true);

    // Build history for the agent (last 10 messages)
    const history = messages.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: m.text,
    }));

    // Call the workflow agent
    const res = await chatApi.sendMessage(text, history);

    let responseText: string;

    if (res.underConstruction || !res.success) {
      // Fallback local responses while webhook is under construction
      responseText = "I've analyzed your schedule! You have 3 high-priority tasks remaining today. Would you like me to block 2 hours for deep work?";
      if (text.toLowerCase().includes('email')) {
        responseText = "You have 3 unread emails. Sarah requested updates on the Q3 roadmap by 5 PM. I can help generate a reply!";
      } else if (text.toLowerCase().includes('task') || text.toLowerCase().includes('prioritize')) {
        responseText = "I've automatically prioritized your tasks: 1. Finalize Q3 Deck, 2. Budget Approval, 3. Review Candidates. Overdue tasks have been carried forward.";
      }
      if (res.underConstruction) {
        responseText += '\n\n🚧 (Workflow under construction — this is a demo response)';
      }
    } else {
      const payload = res.data as { reply?: string; text?: string; output?: string; message?: string };
      responseText = payload?.reply || payload?.text || payload?.output || payload?.message
        || "I've processed your request. Check your dashboard for updates!";
    }

    const aiMsg: Message = {
      id: Date.now() + 1,
      sender: 'ai',
      text: responseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage("Analyze my remaining tasks for today");
      }, 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
          />

          {/* Sliding Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white text-gray-900 z-50 shadow-2xl flex flex-col border-l border-gray-100 font-sans"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#111111] to-[#1A1A24] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7B3FF2] to-[#FF7A00] p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#111111] rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#FF7A00] animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base flex items-center gap-1.5">
                    PlanAI Assistant
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  </h3>
                  <p className="text-xs text-gray-400">Your AI Productivity Coach</p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2">
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'recommendations'
                    ? 'bg-white text-[#7B3FF2] shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Lightbulb className="w-4 h-4" /> AI Recommendations
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-white text-[#7B3FF2] shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Chat Assistant
              </button>
            </div>

            {/* Main Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === 'recommendations' ? (
                /* AI Recommendations Tab */
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-[#7B3FF2] to-[#5A2DD8] text-white rounded-2xl shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-5 h-5 text-[#FF7A00]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white/90">Coach Greeting</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      Hi! I'm PlanAI Assistant 👋<br/>How can I help improve your productivity today?
                    </p>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
                    Live Productivity Insights ({recommendations.length})
                  </h4>

                  {recommendations.length === 0 ? (
                    <div className="p-6 bg-purple-50/60 border border-purple-100 rounded-2xl text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7B3FF2] mx-auto flex items-center justify-center">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <h5 className="font-bold text-sm text-gray-900">No Recommendations Available</h5>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Add tasks, schedule calendar events, or connect your email to receive personalized AI productivity insights.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recommendations.map((rec) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={rec.id}
                          className={`p-4 rounded-2xl border ${rec.color} transition-all hover:shadow-sm`}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <h5 className="font-bold text-xs">{rec.title}</h5>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 border border-current">
                              {rec.tag}
                            </span>
                          </div>
                          <p className="text-xs font-medium leading-relaxed">{rec.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Interactive Chat Tab */
                <div className="space-y-4 flex flex-col h-full">
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                            msg.sender === 'user'
                              ? 'bg-[#7B3FF2] text-white rounded-br-none shadow-sm'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200/60'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-2xl w-fit">
                        <Sparkles className="w-4 h-4 text-[#7B3FF2] animate-spin" />
                        PlanAI is thinking...
                      </div>
                    )}
                  </div>

                  {/* Suggested Prompts */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Suggested Prompts</span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-xs bg-gray-50 hover:bg-[#F3EEFF] text-gray-700 hover:text-[#7B3FF2] px-2.5 py-1 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & Input Footer */}
            <div className="p-4 border-t border-gray-100 bg-white space-y-3">
              {/* Voice Listening indicator */}
              {isListening && (
                <div className="flex items-center justify-between p-2.5 bg-purple-50 text-[#7B3FF2] border border-purple-200 rounded-xl text-xs font-semibold animate-pulse">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#FF7A00]" />
                    Listening to voice command...
                  </div>
                  <button onClick={toggleVoice} className="text-gray-500 hover:text-gray-800 text-xs">Cancel</button>
                </div>
              )}

              {/* Chat Input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-red-50 text-red-600 border-red-300'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input 
                  type="text" 
                  placeholder="Ask PlanAI anything..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:border-[#7B3FF2]"
                />

                <button 
                  type="submit"
                  className="p-2.5 bg-[#FF7A00] hover:bg-[#FF8F1F] text-white rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
