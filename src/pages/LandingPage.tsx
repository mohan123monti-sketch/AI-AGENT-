import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Calendar, Mail, 
  Clock, Bell, BarChart2, Lightbulb, 
  FileText, CheckCircle2 
} from 'lucide-react';

const features = [
  {
    icon: <CheckCircle2 className="w-6 h-6 text-[#7B3FF2]" />,
    title: "Smart Task Prioritization",
    description: "Automatically prioritize tasks based on deadlines, importance, workload, urgency, and user preferences."
  },
  {
    icon: <Calendar className="w-6 h-6 text-[#7B3FF2]" />,
    title: "AI Daily Planner",
    description: "Generate an optimized daily schedule by analyzing Calendar, Tasks, Meetings, Free time, and Energy level."
  },
  {
    icon: <Mail className="w-6 h-6 text-[#7B3FF2]" />,
    title: "Email Summarization & Action Items",
    description: "AI summarizes long emails and automatically extracts important points, action items, deadlines, and follow-up tasks."
  },
  {
    icon: <Clock className="w-6 h-6 text-[#7B3FF2]" />,
    title: "Smart Meeting Scheduler",
    description: "Automatically find common free slots, schedule meetings, avoid conflicts, and suggest best meeting time."
  },
  {
    icon: <Bell className="w-6 h-6 text-[#7B3FF2]" />,
    title: "Intelligent Reminder Agent",
    description: "Instead of fixed reminders, AI reminds users based on urgency, location, current activity, previous behavior, and deadlines."
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-[#7B3FF2]" />,
    title: "Productivity Analytics",
    description: "Analyze completed tasks, productivity score, meeting hours, focus hours, weekly reports, and monthly performance."
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-[#7B3FF2]" />,
    title: "Personalized Recommendations",
    description: "AI recommends best work hours, ideal break time, meeting schedule, focus sessions, and workload balancing."
  },
  {
    icon: <FileText className="w-6 h-6 text-[#7B3FF2]" />,
    title: "Smart Notes & Meeting Minutes",
    description: "Convert meeting transcripts and voice recordings into summaries, decisions, action items, and follow-ups."
  }
];

export default function LandingPage() {
  return (
    <div className="dark-theme min-h-screen font-sans selection:bg-[#7B3FF2] selection:text-white pb-20">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-card border-b border-[rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#7B3FF2]" />
            <span className="font-heading font-bold text-xl tracking-tight">PlanAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#B8B8C7]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-[#B8B8C7] transition-colors">Log in</Link>
            <Link to="/login" className="bg-[#7B3FF2] hover:bg-[#5A2DD8] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-[0_0_20px_rgba(123,63,242,0.3)] hover:shadow-[0_0_30px_rgba(123,63,242,0.5)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7B3FF2] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#FF7A00] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-sm font-medium text-[#B8B8C7] mb-8">
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              <span>Plan Smarter. Work Faster. Achieve More.</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-8">
              Your AI Productivity <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FF2] to-[#FF7A00]">Partner</span> for Smarter Workdays
            </h1>
            
            <p className="text-lg lg:text-xl text-[#B8B8C7] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              PlanAI intelligently prioritizes your work, plans your day, schedules meetings, summarizes emails, manages reminders, and helps you achieve maximum productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/login" className="w-full sm:w-auto bg-[#FF7A00] hover:bg-[#FF8F1F] text-white px-8 py-4 rounded-full text-base font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-2xl lg:max-w-none relative"
          >
            <div className="glass-card rounded-[24px] p-2 border border-[rgba(255,255,255,0.1)] shadow-2xl">
              <div className="bg-[#0D0D12] rounded-[20px] overflow-hidden border border-[rgba(255,255,255,0.05)]">
                {/* Mockup Top Bar */}
                <div className="h-12 border-b border-[rgba(255,255,255,0.05)] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                {/* Mockup Content */}
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 glass-card rounded-xl p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#7B3FF2]/20 flex items-center justify-center text-[#7B3FF2]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">AI Daily Overview</h4>
                      <p className="text-xs text-[#B8B8C7]">You have 3 high-priority tasks and 2 meetings scheduled. I've optimized your schedule to give you 4 hours of deep focus time this afternoon.</p>
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <h4 className="font-medium text-sm mb-3">Priority Tasks</h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.2)]"></div>
                          <div className="flex-1 h-2 bg-[rgba(255,255,255,0.1)] rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <h4 className="font-medium text-sm mb-3">Productivity Score</h4>
                    <div className="flex items-center justify-center h-16">
                      <div className="text-3xl font-heading font-bold text-[#FF7A00]">92%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-8 -top-8 glass-card p-4 rounded-xl flex items-center gap-3 border border-[rgba(255,255,255,0.1)] shadow-xl hidden md:flex"
            >
              <div className="bg-green-500/20 text-green-400 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium">Task auto-prioritized</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Everything you need to <span className="text-[#7B3FF2]">excel</span></h2>
            <p className="text-[#B8B8C7] text-lg max-w-2xl mx-auto">PlanAI replaces dozens of single-purpose apps with one cohesive, intelligent assistant designed to manage your entire workday.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:bg-[rgba(255,255,255,0.02)] transition-colors border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#7B3FF2]/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-sm text-[#B8B8C7] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-center mb-16">How PlanAI Works</h2>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7B3FF2] to-[#FF7A00] hidden md:block opacity-50 transform -translate-x-1/2"></div>
            
            {[
              { title: "Connect your calendar", desc: "Sync Google, Outlook, or Apple Calendar." },
              { title: "Add tasks", desc: "Dump your to-dos. PlanAI will sort them out." },
              { title: "AI analyzes your work", desc: "We scan priorities, deadlines, and meetings." },
              { title: "AI optimizes your productivity", desc: "A perfect schedule is generated for you." },
              { title: "Track your progress", desc: "Review daily insights and improve over time." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center justify-between mb-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-5/12 glass-card p-6 rounded-2xl border border-[rgba(255,255,255,0.05)] text-center md:text-left">
                  <div className="text-sm font-bold text-[#FF7A00] mb-2">STEP {idx + 1}</div>
                  <h3 className="font-heading font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-[#B8B8C7] text-sm">{step.desc}</p>
                </div>
                <div className="hidden md:flex w-10 h-10 rounded-full bg-[#0D0D12] border-2 border-[#7B3FF2] items-center justify-center z-10 font-bold">
                  {idx + 1}
                </div>
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-8 px-6 border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#7B3FF2]" />
            <span className="font-heading font-bold text-xl tracking-tight">PlanAI</span>
          </div>
          <div className="flex gap-8 text-sm text-[#B8B8C7]">
            <a href="#" className="hover:text-white transition-colors">Resources</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-[#B8B8C7] text-sm">&copy; {new Date().getFullYear()} PlanAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
