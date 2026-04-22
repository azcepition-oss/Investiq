import { motion } from "framer-motion";
import { TrendingUp, Sparkles, BookOpen, Rocket, ArrowRight, ShieldCheck, BarChart3, Mail, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTutorial } from "../context/TutorialContext";

export const Home = () => {
  const navigate = useNavigate();
  const { startTutorial } = useTutorial();

  const handleGuestLogin = () => {
    // Navigate and start tutorial
    navigate('/market');
    setTimeout(() => {
      startTutorial();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-6 flex flex-col items-center text-center space-y-8">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Rocket size={14} fill="currentColor" />
            The Future of Investing is Here
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none font-display italic">
            INVEST<span className="text-emerald-500">IQ</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-2xl max-w-xl mx-auto leading-tight font-medium">
            Master the markets with <span className="text-white font-bold">$100k fake cash</span>, real-time data, and an AI mentor that actually makes sense.
          </p>
        </motion.div>

        {/* Login Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border-2 border-zinc-800 p-10 rounded-[3rem] space-y-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight uppercase font-display italic">Welcome Back</h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Initialize Trading Session</p>
          </div>

          <div className="space-y-4">
            <button className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all font-display text-sm tracking-tight active:scale-95">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              LOGIN WITH GOOGLE
            </button>
            
            <button className="w-full py-5 bg-zinc-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-700 transition-all font-display text-sm tracking-tight active:scale-95 border border-zinc-700">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.74.82 0 1.99-.84 3.6-.69 1.69.07 2.94.71 3.63 1.73-3.41 2.05-2.87 6.41.44 7.74-.69 1.74-1.61 3.46-3.78 3.45zm-4.41-13.06c-.08-2.26 1.87-4.21 4.01-4.22.21 2.53-2.31 4.54-4.01 4.22z"/>
              </svg>
              LOGIN WITH APPLE
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800/50"></div>
              </div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-widest text-zinc-600">
                <span className="bg-[#0c0c0c] px-4">Secure Bypass</span>
              </div>
            </div>

            <button 
              onClick={handleGuestLogin}
              className="w-full py-5 border-2 border-dashed border-zinc-800 text-zinc-500 font-black rounded-2xl hover:border-emerald-500/50 hover:text-emerald-400 transition-all group font-display text-sm italic tracking-tight active:scale-95"
            >
              CONTINUE AS GUEST
            </button>
            
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-left">
              <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-amber-100/40 leading-relaxed uppercase tracking-widest">
                <span className="text-amber-500 font-black">Warning:</span> Guest data is stored locally. Link an account to save progress permanently.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<TrendingUp className="text-emerald-400" />}
          title="Real-Time Data"
          description="Trade top 100 stocks and bonds with live market movements."
        />
        <FeatureCard 
          icon={<Sparkles className="text-blue-400" />}
          title="AI Mentor"
          description="Get real-time explanations for every price swing using AI."
        />
        <FeatureCard 
          icon={<BookOpen className="text-amber-400" />}
          title="Gamified Learning"
          description="Duolingo-style lessons that turn you into a pro investor."
        />
      </section>

      {/* Social Proof / Stats */}
      <section className="px-6 py-12 border-t border-zinc-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat label="Active Traders" value="12.5K+" />
          <Stat label="Lessons Completed" value="450K+" />
          <Stat label="Assets Tracked" value="100+" />
          <Stat label="AI Insights" value="1M+" />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="p-12 text-center bg-zinc-900/50 border-t border-zinc-800">
        <h2 className="text-3xl font-bold mb-6">Ready to build your fortune?</h2>
        <Link 
          to="/market" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all"
        >
          EXPLORE THE MARKET
          <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4 hover:border-emerald-500/30 transition-all group">
    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const Stat = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <p className="text-3xl font-black text-white">{value}</p>
    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
  </div>
);
