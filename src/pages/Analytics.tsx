import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  BarChart2, TrendingUp, Clock, CheckCircle, Download, Calendar, Sparkles, AlertCircle, FileText, Zap, Award
} from 'lucide-react';

const weeklyData = [
  { name: 'Mon', focus: 4.5, meetings: 2, tasks: 6 },
  { name: 'Tue', focus: 3.5, meetings: 3, tasks: 5 },
  { name: 'Wed', focus: 5.5, meetings: 1, tasks: 8 },
  { name: 'Thu', focus: 2.0, meetings: 4, tasks: 4 },
  { name: 'Fri', focus: 4.0, meetings: 2, tasks: 7 },
  { name: 'Sat', focus: 1.5, meetings: 0, tasks: 2 },
  { name: 'Sun', focus: 0.5, meetings: 0, tasks: 1 },
];

const categoryPieData = [
  { name: 'Marketing', value: 35, color: '#7B3FF2' },
  { name: 'Engineering', value: 25, color: '#FF7A00' },
  { name: 'Finance', value: 20, color: '#3B82F6' },
  { name: 'HR & Ops', value: 20, color: '#10B981' },
];

const heatmapHours = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'];
const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const heatmapValues = [
  [85, 95, 40, 75, 60],
  [70, 80, 50, 90, 65],
  [90, 100, 60, 85, 70],
  [60, 75, 85, 50, 40],
  [80, 90, 45, 70, 55],
];

export default function Analytics() {
  const [exported, setExported] = useState(false);

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
          <p className="text-gray-500 text-sm mt-1">Detailed performance tracking, completion trends, focus time, and carry-forward analytics.</p>
        </div>

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
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Task Completion Rate", value: "85%", unit: "", change: "33 of 39 tasks completed", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-100" },
          { label: "Daily Productivity", value: "92", unit: "/100", change: "+4% vs yesterday", icon: <TrendingUp className="w-5 h-5" />, color: "text-[#7B3FF2]", bg: "bg-[#7B3FF2]/10" },
          { label: "Weekly Productivity", value: "4.5", unit: "/5.0", change: "Top 5% user average", icon: <Award className="w-5 h-5" />, color: "text-[#FF7A00]", bg: "bg-[#FF7A00]/10" },
          { label: "Monthly Productivity", value: "142h", unit: "total", change: "August 2026", icon: <FileText className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Completed Tasks", value: "33", unit: "", change: "This week", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600", bg: "bg-green-100" },
          { label: "Pending Tasks", value: "6", unit: "", change: "In active pipeline", icon: <Clock className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Carry Forward Tasks", value: "2", unit: "overdue", change: "Auto-migrated", icon: <AlertCircle className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-100" },
          { label: "Focus Time", value: "21.5", unit: "h", change: "Deep work blocks", icon: <Zap className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-100" },
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

      {/* Progress Rings & High-Performance Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Progress Ring 1 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="relative w-28 h-28 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="#F3EEFF" strokeWidth="10" fill="transparent" />
              <circle cx="56" cy="56" r="48" stroke="#7B3FF2" strokeWidth="10" strokeDasharray={300} strokeDashoffset={45} strokeLinecap="round" fill="transparent" />
            </svg>
            <span className="absolute font-heading font-bold text-xl text-gray-900">85%</span>
          </div>
          <h4 className="font-bold text-sm text-gray-900">Completion Trends Progress</h4>
          <p className="text-xs text-gray-500 mt-1">Completion rate target: 80%</p>
        </div>

        {/* Progress Ring 2 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="relative w-28 h-28 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="#FFF3E8" strokeWidth="10" fill="transparent" />
              <circle cx="56" cy="56" r="48" stroke="#FF7A00" strokeWidth="10" strokeDasharray={300} strokeDashoffset={65} strokeLinecap="round" fill="transparent" />
            </svg>
            <span className="absolute font-heading font-bold text-xl text-gray-900">78%</span>
          </div>
          <h4 className="font-bold text-sm text-gray-900">Focus Efficiency Ring</h4>
          <p className="text-xs text-gray-500 mt-1">Focus goal: 25h / week</p>
        </div>

        {/* Peak Hours & Highlights */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
          <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7B3FF2]" /> Productivity Highlights
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
              <span className="font-semibold text-gray-600">Most Productive Day:</span>
              <span className="font-bold text-[#7B3FF2] bg-[#F3EEFF] px-2 py-0.5 rounded">Wednesday</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
              <span className="font-semibold text-gray-600">Most Productive Hour:</span>
              <span className="font-bold text-[#FF7A00] bg-[#FFF3E8] px-2 py-0.5 rounded">10:00 AM - 11:30 AM</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
              <span className="font-semibold text-gray-600">Avg Completion Time:</span>
              <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">42 mins / task</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart - Weekly Time Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-gray-900 text-base">Weekly Time Distribution</h3>
            <span className="text-xs font-semibold text-gray-400">Focus vs Meetings</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)' }} />
                <Bar dataKey="focus" name="Focus Hours" fill="#7B3FF2" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="meetings" name="Meeting Hours" fill="#FF7A00" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Line Chart - Daily Task Completion Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-gray-900 text-base">Daily Task Completion Trend</h3>
            <span className="text-xs font-semibold text-[#7B3FF2]">Tasks Completed / Day</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)' }} />
                <Line type="monotone" dataKey="tasks" name="Completed Tasks" stroke="#7B3FF2" strokeWidth={3} dot={{ r: 5, fill: '#7B3FF2', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Pie Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 flex flex-col"
        >
          <h3 className="font-heading font-bold text-gray-900 text-base mb-4">Task Breakdown by Category</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Focus Heatmap */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-gray-900 text-base">Weekly Focus Intensity Heatmap</h3>
            <span className="text-xs font-semibold text-gray-400">Peak Hours Matrix</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-6 gap-2 mb-2 text-center text-xs font-bold text-gray-400">
              <span>Time</span>
              {heatmapDays.map(d => <span key={d}>{d}</span>)}
            </div>

            {heatmapHours.map((hour, rIdx) => (
              <div key={hour} className="grid grid-cols-6 gap-2 items-center text-center my-1">
                <span className="text-xs font-semibold text-gray-500">{hour}</span>
                {heatmapValues[rIdx].map((val, cIdx) => (
                  <div
                    key={cIdx}
                    className={`h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      val >= 90 ? 'bg-[#7B3FF2] text-white shadow-xs' :
                      val >= 75 ? 'bg-[#7B3FF2]/70 text-white' :
                      val >= 60 ? 'bg-[#7B3FF2]/40 text-gray-900' :
                      val >= 40 ? 'bg-[#F3EEFF] text-gray-700' : 'bg-gray-100 text-gray-400'
                    }`}
                    title={`${heatmapDays[cIdx]} at ${hour}: ${val}% Focus Efficiency`}
                  >
                    {val}%
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Productivity Insights */}
      <div className="bg-gradient-to-r from-[#7B3FF2] to-[#FF7A00] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold mb-1">AI Productivity Insights</h3>
            <p className="text-sm text-white/90 leading-relaxed max-w-3xl">
              Your highest deep-work efficiency occurs between <span className="font-bold underline">10:00 AM and 12:30 PM on Wednesdays</span>. 
              Scheduling major deliverables during this block increases your task output by 28%. We recommend declining recurring morning meetings on Wednesdays to preserve peak flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
