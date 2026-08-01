import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  Sparkles, LayoutDashboard, CheckSquare, Calendar, 
  Mail, Users, Bell, BarChart2, Lightbulb, FileText, 
  Settings, LogOut, Search, User 
} from 'lucide-react';

export default function DashboardLayout() {
  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", end: true },
    { to: "/dashboard/assistant", icon: <Sparkles className="w-5 h-5" />, label: "AI Assistant" },
    { to: "/dashboard/tasks", icon: <CheckSquare className="w-5 h-5" />, label: "Tasks" },
    { to: "/dashboard/planner", icon: <Calendar className="w-5 h-5" />, label: "Daily Planner" },
    { to: "/dashboard/email", icon: <Mail className="w-5 h-5" />, label: "Email Assistant" },
    { to: "/dashboard/meetings", icon: <Users className="w-5 h-5" />, label: "Meeting Scheduler" },
    { to: "/dashboard/reminders", icon: <Bell className="w-5 h-5" />, label: "Reminders" },
    { to: "/dashboard/analytics", icon: <BarChart2 className="w-5 h-5" />, label: "Analytics" },
    { to: "/dashboard/recommendations", icon: <Lightbulb className="w-5 h-5" />, label: "Recommendations" },
    { to: "/dashboard/notes", icon: <FileText className="w-5 h-5" />, label: "Notes" },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FC] font-sans overflow-hidden selection:bg-[#7B3FF2]/20 selection:text-[#7B3FF2]">
      {/* Sidebar - Dark theme as requested "Sidebar: #111111" */}
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
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm hover:bg-white/5 hover:text-white w-full text-left">
            <Settings className="w-5 h-5 text-gray-400" />
            Settings
          </button>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm hover:bg-white/5 hover:text-red-400 w-full text-left">
            <LogOut className="w-5 h-5 text-gray-400" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-[#F8F9FC]">
        {/* Top Navigation */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
          <div className="flex-1 max-w-xl relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tasks, meetings, notes..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#7B3FF2]/20 focus:bg-white transition-all text-sm"
            />
          </div>
          
          <div className="flex items-center gap-4 ml-8">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7B3FF2]/20 bg-[#F3EEFF] text-[#7B3FF2] text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI Active
            </div>
            
            <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF7A00] rounded-full border-2 border-white"></span>
            </button>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7B3FF2] to-[#FF7A00] p-[2px] cursor-pointer">
              <div className="w-full h-full rounded-full border-2 border-white bg-gray-900 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=PlanAI&backgroundColor=b6e3f4`} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
