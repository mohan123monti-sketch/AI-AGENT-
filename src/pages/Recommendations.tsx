import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hasUserData, generateUserRecommendations } from '../lib/userData';

export default function Recommendations() {
  const [recs, setRecs] = useState(() => hasUserData() ? generateUserRecommendations() : []);

  useEffect(() => {
    const handleSync = () => {
      setRecs(hasUserData() ? generateUserRecommendations() : []);
    };
    handleSync();
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const userHasData = recs.length > 0;
  const recommendations = recs;

  return (
    <div className="max-w-4xl mx-auto h-full pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center gap-2">
          AI Recommendations
          <Sparkles className="w-5 h-5 text-[#FF7A00]" />
        </h1>
        <p className="text-gray-500 text-sm mt-1">Personalized insights dynamically generated from your active tasks and schedule.</p>
      </div>

      {!userHasData || recommendations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center max-w-xl mx-auto space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#F3EEFF] text-[#7B3FF2] mx-auto flex items-center justify-center">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-bold text-gray-900">No Recommendations Available Yet</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            AI recommendations are calculated based on your actual work items. Add tasks, schedule events, or sync your emails to generate personalized recommendations.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/dashboard/tasks"
              className="flex items-center gap-2 bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create First Task
            </Link>
            <Link
              to="/dashboard/planner"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Open Planner
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              key={rec.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#7B3FF2] to-[#FF7A00]"></div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full border ${rec.color}`}>
                    {rec.tag}
                  </span>
                  <Sparkles className="w-5 h-5 text-[#7B3FF2]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-base">{rec.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{rec.desc}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-50 flex justify-end gap-2">
                <Link
                  to="/dashboard/tasks"
                  className="text-xs font-semibold text-white bg-[#7B3FF2] rounded-lg px-4 py-2 hover:bg-[#5A2DD8] transition-colors"
                >
                  View Tasks
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
