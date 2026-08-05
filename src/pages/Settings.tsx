import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Bell, Shield, Sparkles, Sliders, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account settings and AI assistant preferences.</p>
        </div>

        {saved && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium border border-green-200">
            <Check className="w-4 h-4" /> Preferences saved!
          </motion.div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sub-nav */}
        <div className="w-full md:w-64 space-y-1">
          {[
            { id: 'profile', label: 'Profile Settings', icon: <UserIcon className="w-4 h-4" /> },
            { id: 'ai', label: 'AI Preferences', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Privacy', icon: <Shield className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left ${
                activeTab === tab.id
                  ? 'bg-[#7B3FF2] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 border-b border-gray-100 pb-4">Personal Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7B3FF2] to-[#FF7A00] p-0.5">
                  <div className="w-full h-full rounded-full border-2 border-white bg-gray-900 overflow-hidden">
                    <img 
                      src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=PlanAI"} 
                      alt={user?.name || "User Avatar"} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <div>
                  <button className="text-xs font-semibold text-[#7B3FF2] bg-[#F3EEFF] px-3 py-2 rounded-lg hover:bg-[#7B3FF2] hover:text-white transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:border-[#7B3FF2] text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:border-[#7B3FF2] text-sm" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button onClick={handleSave} className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#FF8F1F] transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 border-b border-gray-100 pb-4">AI Automation & Assistance</h3>
              <div className="space-y-4">
                {[
                  { title: "Smart Scheduling Suggestions", desc: "Allow AI to automatically suggest deep work blocks." },
                  { title: "Email Auto-Summarization", desc: "Automatically generate concise summaries for inbox emails." },
                  { title: "Priority Auto-Ranking", desc: "Re-order task lists using machine learning urgency scores." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B3FF2]"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button onClick={handleSave} className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#FF8F1F] transition-colors shadow-sm">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 border-b border-gray-100 pb-4">Notification Channels</h3>
              <div className="space-y-4">
                {[
                  { title: "Email Digest", desc: "Receive a daily morning summary of tasks and upcoming meetings." },
                  { title: "Desktop Reminders", desc: "Get real-time push alerts before scheduled focus blocks." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#7B3FF2] rounded border-gray-300 focus:ring-[#7B3FF2]" />
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button onClick={handleSave} className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#FF8F1F] transition-colors shadow-sm">
                  Save Notifications
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 border-b border-gray-100 pb-4">Password & Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20" />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button onClick={handleSave} className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#FF8F1F] transition-colors shadow-sm">
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
