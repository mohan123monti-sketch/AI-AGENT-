import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { BarChart2, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const weeklyData = [
  { name: 'Mon', focus: 4, meetings: 2, tasks: 6 },
  { name: 'Tue', focus: 3, meetings: 3, tasks: 5 },
  { name: 'Wed', focus: 5, meetings: 1, tasks: 8 },
  { name: 'Thu', focus: 2, meetings: 4, tasks: 4 },
  { name: 'Fri', focus: 4, meetings: 2, tasks: 7 },
  { name: 'Sat', focus: 1, meetings: 0, tasks: 2 },
  { name: 'Sun', focus: 0, meetings: 0, tasks: 1 },
];

export default function Analytics() {
  return (
    <div className="max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Productivity Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Detailed insights into your work habits and efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Productivity Score", value: "92", unit: "/100", icon: <TrendingUp className="w-5 h-5" />, color: "text-[#7B3FF2]", bg: "bg-[#7B3FF2]/10" },
          { label: "Total Focus Hours", value: "19", unit: "h", icon: <Clock className="w-5 h-5" />, color: "text-[#FF7A00]", bg: "bg-[#FF7A00]/10" },
          { label: "Tasks Completed", value: "33", unit: "", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-500", bg: "bg-green-100" },
          { label: "Meeting Hours", value: "12", unit: "h", icon: <BarChart2 className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-100" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <div className="text-gray-500 text-sm font-medium mb-1">{stat.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-heading font-bold text-gray-900">{stat.value}</span>
              <span className="text-gray-400 font-medium">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h3 className="font-heading font-semibold text-gray-900 mb-6">Time Distribution (This Week)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="focus" name="Focus (hrs)" fill="#7B3FF2" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="meetings" name="Meetings (hrs)" fill="#FF7A00" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h3 className="font-heading font-semibold text-gray-900 mb-6">Productivity Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="tasks" name="Tasks Completed" stroke="#7B3FF2" strokeWidth={3} dot={{ r: 4, fill: '#7B3FF2', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
