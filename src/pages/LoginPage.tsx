import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, BarChart2, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex font-sans selection:bg-[#7B3FF2] selection:text-white bg-[#0D0D12]">
      {/* Left Side - Dark Gradient & Benefits */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-to-br from-[#151520] to-[#0D0D12] p-12 relative overflow-hidden border-r border-[rgba(255,255,255,0.05)]">
        {/* Abstract shapes */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7B3FF2] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF7A00] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-20 text-white">
            <Sparkles className="w-6 h-6 text-[#7B3FF2]" />
            <span className="font-heading font-bold text-xl tracking-tight">PlanAI</span>
          </Link>
          
          <div className="max-w-md">
            <h1 className="text-4xl font-heading font-bold text-white mb-8 leading-tight">
              Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FF2] to-[#FF7A00]">PlanAI</span>
            </h1>
            
            <div className="space-y-6">
              {[
                { icon: <Calendar className="w-5 h-5" />, text: "AI Scheduling" },
                { icon: <CheckCircle2 className="w-5 h-5" />, text: "Smart Prioritization" },
                { icon: <BarChart2 className="w-5 h-5" />, text: "Analytics" },
                { icon: <Lightbulb className="w-5 h-5" />, text: "AI Recommendations" },
                { icon: <Sparkles className="w-5 h-5" />, text: "Productivity Assistant" }
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-center gap-4 text-[#B8B8C7]"
                >
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#7B3FF2]">
                    {item.icon}
                  </div>
                  <span className="text-lg font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (Light Card essentially, but on dark bg, wait design says "White login card") */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white relative">
        <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-black">
          <Sparkles className="w-6 h-6 text-[#7B3FF2]" />
          <span className="font-heading font-bold text-xl tracking-tight">PlanAI</span>
        </Link>
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Log in to your account</h2>
            <p className="text-gray-500">Welcome back! Please enter your details.</p>
          </div>
          
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:border-[#7B3FF2] transition-colors"
                defaultValue="demo@planai.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:border-[#7B3FF2] transition-colors"
                defaultValue="password"
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7B3FF2] focus:ring-[#7B3FF2]" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="font-medium text-[#7B3FF2] hover:text-[#5A2DD8] transition-colors">Forgot password?</a>
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#FF8F1F] text-white font-semibold transition-all shadow-[0_4px_14px_rgba(255,122,0,0.2)] hover:shadow-[0_6px_20px_rgba(255,122,0,0.3)]"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 flex items-center justify-between">
            <hr className="w-full border-gray-200" />
            <span className="p-2 text-gray-400 text-sm mb-1">OR</span>
            <hr className="w-full border-gray-200" />
          </div>
          
          <div className="mt-6 space-y-3">
            <button className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            <button className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 21 21">
                <path d="M10 0H0v10h10V0zM21 0H11v10h10V0zM10 11H0v10h10V11zM21 11H11v10h10V11z" fill="#00a4ef"/>
              </svg>
              Sign in with Microsoft
            </button>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <a href="#" className="font-semibold text-[#7B3FF2] hover:text-[#5A2DD8]">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
