import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  Sparkles, LayoutDashboard, CheckSquare, Calendar, 
  Mail, Bell, BarChart2, FileText, 
  Settings as SettingsIcon, LogOut, X
} from 'lucide-react';
import GlobalAiDrawer from '../components/GlobalAiDrawer';

export default function DashboardLayout() {
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", end: true },
    { to: "/dashboard/tasks", icon: <CheckSquare className="w-5 h-5" />, label: "Tasks" },
    { to: "/dashboard/planner", icon: <Calendar className="w-5 h-5" />, label: "Daily Planner" },
    { to: "/dashboard/email", icon: <Mail className="w-5 h-5" />, label: "Email Assistant" },
    { to: "/dashboard/reminders", icon: <Bell className="w-5 h-5" />, label: "Reminders" },
    { to: "/dashboard/analytics", icon: <BarChart2 className="w-5 h-5" />, label: "Analytics" },
    { to: "/dashboard/notes", icon: <FileText className="w-5 h-5" />, label: "Notes" },
  ];

  const notifications = [
    { id: 1, title: "Upcoming Deadline", desc: "Q3 Marketing Deck due today at 5:00 PM", time: "10 mins ago", type: "urgent" },
    { id: 2, title: "Carried Forward Task", desc: "Security Audit carried forward to today", time: "1 hour ago", type: "task" },
    { id: 3, title: "Unread Email Action Required", desc: "Sarah Jenkins requested budget update", time: "2 hours ago", type: "email" },
    { id: 4, title: "Planner Update", desc: "AI optimized 3 focus blocks for your morning schedule", time: "3 hours ago", type: "ai" },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FC] font-sans overflow-hidden selection:bg-[#7B3FF2]/20 selection:text-[#7B3FF2]">
      {/* Sidebar - Dark theme */}
      <aside className="w-64 bg-[#111111] text-[#B8B8C7] flex flex-col h-full flex-shrink-0 relative z-20 shadow-2xl">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-2 text-white">
            <Sparkles className="w-6 h-6 text-[#7B3FF2]" />
            <span className="font-heading font-bold text-xl tracking-tight">PlanAI</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm
                  ${isActive 
                    ? 'bg-[#7B3FF2]/10 text-white font-semibold' 
                    : 'hover:bg-white/5 hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={isActive ? "text-[#7B3FF2]" : "text-gray-400"}>
                      {item.icon}
                    </div>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/5 space-y-1">
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm w-full text-left
              ${isActive ? 'bg-[#7B3FF2]/10 text-white font-semibold' : 'hover:bg-white/5 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <SettingsIcon className={isActive ? "w-5 h-5 text-[#7B3FF2]" : "w-5 h-5 text-gray-400"} />
                Settings
              </>
            )}
          </NavLink>
          <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm hover:bg-white/5 hover:text-red-400 w-full text-left">
            <LogOut className="w-5 h-5 text-gray-400" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#F8F9FC] relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-8 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF7A00] rounded-full border-2 border-white"></span>
              </button>

              {/* Notifications Dropdown Panel */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <h4 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#7B3FF2]" /> Notifications
                    </h4>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-gray-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 bg-gray-50 hover:bg-[#F3EEFF]/40 rounded-xl border border-gray-100 transition-colors text-xs">
                        <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-gray-600 leading-snug">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <Link to="/dashboard/settings" className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7B3FF2] to-[#FF7A00] p-[2px] cursor-pointer">
              <div className="w-full h-full rounded-full border-2 border-white bg-gray-900 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=PlanAI&backgroundColor=b6e3f4`} alt="User" className="w-full h-full object-cover" />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

        {/* FLOATING BOTTOM-RIGHT AI ASSISTANT WIDGET (Visible on all pages) */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-auto">
          {/* Floating Glowing Button */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7B3FF2] via-[#632BD8] to-[#FF7A00] text-white flex items-center justify-center shadow-[0_0_25px_rgba(123,63,242,0.6)] hover:shadow-[0_0_35px_rgba(123,63,242,0.9)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/30"
            title="Ask AI Assistant"
          >
            <Sparkles className="w-7 h-7 text-white fill-white/20" />
          </button>
        </div>
      </div>

      {/* Global Sliding AI Assistant Panel */}
      <GlobalAiDrawer isOpen={isAiDrawerOpen} onClose={() => setIsAiDrawerOpen(false)} />
    </div>
  );
}
