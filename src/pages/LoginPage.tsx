import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Calendar, BarChart2, Lightbulb, CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    login(email);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#7B3FF2] selection:text-white bg-[#0D0D12]">
      {/* Left Side - Dark Gradient & Benefits */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-to-br from-[#151520] to-[#0D0D12] p-12 relative overflow-hidden border-r border-[rgba(255,255,255,0.05)]">
        {/* Abstract shapes */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7B3FF2] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF7A00] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16 text-white">
            <Sparkles className="w-6 h-6 text-[#7B3FF2]" />
            <span className="font-heading font-bold text-xl tracking-tight">PlanAI</span>
          </Link>
          
          <div className="max-w-md">
            <h1 className="text-4xl font-heading font-bold text-white mb-8 leading-tight">
              Welcome Back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FF2] to-[#FF7A00]">PlanAI</span>
            </h1>
            
            <div className="space-y-5">
              {[
                { icon: <Calendar className="w-5 h-5" />, text: "AI Scheduling" },
                { icon: <CheckCircle2 className="w-5 h-5" />, text: "Smart Prioritization" },
                { icon: <Mail className="w-5 h-5" />, text: "Email Summarization" },
                { icon: <BarChart2 className="w-5 h-5" />, text: "Analytics" },
                { icon: <Lightbulb className="w-5 h-5" />, text: "AI Recommendations" },
                { icon: <Sparkles className="w-5 h-5" />, text: "Productivity Assistant" }
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
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

      {/* Right Side - Login Form */}
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

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:border-[#7B3FF2] transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B3FF2]/20 focus:border-[#7B3FF2] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7B3FF2] focus:ring-[#7B3FF2]" defaultChecked />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="font-medium text-[#7B3FF2] hover:text-[#5A2DD8] transition-colors">Forgot password?</a>
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#FF8F1F] text-white font-semibold transition-all shadow-[0_4px_14px_rgba(255,122,0,0.2)] hover:shadow-[0_6px_20px_rgba(255,122,0,0.3)] cursor-pointer"
            >
              Sign In
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="font-semibold text-[#7B3FF2] hover:text-[#5A2DD8]">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
