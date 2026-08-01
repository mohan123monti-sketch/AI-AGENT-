import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Send, Mic, Paperclip, Image as ImageIcon, 
  MessageSquarePlus, History, Bookmark, Settings2,
  Calendar, CheckSquare, Mail, Bot
} from 'lucide-react';

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m PlanAI 👋 \n\nHow can I help improve your productivity today?',
      isInitial: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: inputValue, isInitial: false }]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I've analyzed your request. I've automatically updated your calendar and prioritized the relevant tasks. Would you like me to send a summary email to the team?", 
        isInitial: false 
      }]);
    }, 1000);
  };

  const suggestions = [
    { icon: <CheckSquare className="w-4 h-4" />, text: "Prioritize today's tasks" },
    { icon: <Calendar className="w-4 h-4" />, text: "Plan my day" },
    { icon: <Mail className="w-4 h-4" />, text: "Summarize recent emails" },
    { icon: <Bot className="w-4 h-4" />, text: "Analyze my productivity" },
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 bg-[#7B3FF2] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#5A2DD8] transition-colors shadow-sm">
            <MessageSquarePlus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
              <History className="w-3.5 h-3.5" /> Recent Chats
            </h3>
            <div className="space-y-1">
              {['Project roadmap planning', 'Weekly summary', 'Reschedule Friday'].map((chat, i) => (
                <button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg truncate transition-colors">
                  {chat}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5" /> Saved Prompts
            </h3>
            <div className="space-y-1">
              {['End of day report', 'Morning briefing'].map((prompt, i) => (
                <button key={i} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg truncate transition-colors">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-[#7B3FF2] text-white' : 'bg-[#FF7A00] text-white'}`}>
                  {msg.role === 'assistant' ? <Sparkles className="w-4 h-4" /> : 'A'}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[#F3EEFF] text-[#5A2DD8] rounded-tr-sm' : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  
                  {msg.isInitial && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {suggestions.map((suggestion, i) => (
                        <button 
                          key={i}
                          onClick={() => setInputValue(suggestion.text)}
                          className="flex items-center gap-2 text-left bg-white border border-gray-200 p-3 rounded-xl hover:border-[#7B3FF2] hover:shadow-sm transition-all text-sm text-gray-600"
                        >
                          <span className="text-[#7B3FF2]">{suggestion.icon}</span>
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-[#7B3FF2] focus-within:ring-1 focus-within:ring-[#7B3FF2]/20 transition-all">
            <div className="flex items-center gap-1 pb-1 px-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
            
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask PlanAI to schedule, prioritize, or summarize..."
              className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none py-3 px-2 focus:outline-none text-sm text-gray-800"
              rows={1}
            />
            
            <div className="flex items-center gap-1 pb-1 pr-1">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                  inputValue.trim() 
                    ? 'bg-[#FF7A00] text-white shadow-md hover:bg-[#FF8F1F]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            PlanAI can automatically update your calendar, tasks, and send emails on your behalf.
          </p>
        </div>
      </div>
    </div>
  );
}
