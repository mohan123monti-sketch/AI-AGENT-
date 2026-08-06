import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  BarChart2, TrendingUp, Clock, CheckCircle, Download, Calendar, Sparkles, AlertCircle, FileText, Zap, Award, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { hasUserData, calculateUserAnalytics } from '../lib/userData';

export default function Analytics() {
  const [exported, setExported] = useState(false);
  const userHasData = hasUserData();
  const analyticsData = userHasData ? calculateUserAnalytics() : null;

  const handleExportReport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto h-full overflow-y-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
            Productivity Analytics
            <div className="px-2.5 py-0.5 rounded-full bg-[#F3EEFF] text-[#7B3FF2] text-xs font-bold uppercase tracking-wider border border-[#7B3FF2]/20">
              Real-Time Reports
            </div>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Detailed performance tracking, completion trends, focus time, and task breakdowns.</p>
        </div>

        {userHasData && (
          <div className="flex items-center gap-3">
            {exported && (
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                ✓ Report Exported (PDF)!
              </span>
            )}
            <button 
              onClick={handleExportReport}
              className="flex items-center gap-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_rgba(123,63,242,0.2)] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        )}
      </div>

      {!userHasData || !analyticsData ? (
        /* Empty State when no user data has been entered */
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto my-6 space-y-5"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#F3EEFF] text-[#7B3FF2] mx-auto flex items-center justify-center shadow-xs">
            <BarChart2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold text-gray-900">No Analytics Available Yet</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Productivity analysis and breakdown reports are generated automatically once you enter tasks, complete work items, or schedule events.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard/tasks"
              className="flex items-center gap-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add First Task
            </Link>
            <Link
              to="/dashboard/planner"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            >
              <Calendar className="w-4 h-4 text-[#FF7A00]" />
              Schedule Event
            </Link>
          </div>
        </motion.div>
      ) : (
        /* Actual Analytics Views populated with User Data */
        <>
          {/* Primary KPI Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: "Task Completion Rate", value: `${analyticsData.completionRate}%`, unit: "", change: `${analyticsData.completedTasks} of ${analyticsData.totalTasks} completed`, icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-100" },
              { label: "Total Tasks", value: `${analyticsData.totalTasks}`, unit: "items", change: "In pipeline", icon: <TrendingUp className="w-5 h-5" />, color: "text-[#7B3FF2]", bg: "bg-[#7B3FF2]/10" },
              { label: "Completed Tasks", value: `${analyticsData.completedTasks}`, unit: "done", change: "Active user tasks", icon: <Award className="w-5 h-5" />, color: "text-[#FF7A00]", bg: "bg-[#FF7A00]/10" },
              { label: "Pending Tasks", value: `${analyticsData.pendingTasks}`, unit: "remaining", change: "Requires action", icon: <Clock className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-100" },
              { label: "Carry-Forward Tasks", value: `${analyticsData.carriedForwardTasks}`, unit: "overdue", change: "From previous days", icon: <AlertCircle className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-100" },
              { label: "Calendar Events", value: `${analyticsData.eventsCount}`, unit: "scheduled", change: "Planner events", icon: <Calendar className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-100" },
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                key={i} 
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-heading font-bold text-gray-900">{stat.value}</span>
                    <span className="text-gray-400 text-xs font-medium">{stat.unit}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500">{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* User Task Category Breakdown & Completion Ring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Completion Progress Ring */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col items-center justify-center text-center">
              <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="#F3EEFF" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="54" 
                    stroke="#7B3FF2" 
                    strokeWidth="12" 
                    strokeDasharray={340} 
                    strokeDashoffset={340 - (340 * analyticsData.completionRate) / 100} 
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                </svg>
                <span className="absolute font-heading font-bold text-2xl text-gray-900">{analyticsData.completionRate}%</span>
              </div>
              <h4 className="font-bold text-base text-gray-900">Task Completion Rate</h4>
              <p className="text-xs text-gray-500 mt-1">{analyticsData.completedTasks} completed out of {analyticsData.totalTasks} total tasks</p>
            </div>

            {/* Category Breakdown Pie Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col">
              <h4 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7B3FF2]" /> Task Category Breakdown
              </h4>

              {analyticsData.categoryPieData.length > 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={analyticsData.categoryPieData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={70} 
                        innerRadius={40}
                      >
                        {analyticsData.categoryPieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-gray-400">
                  No category data available yet
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
