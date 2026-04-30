import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles, BookOpen, Rocket, ArrowRight, ShieldCheck, BarChart3, Mail, AlertCircle, Lock, Loader2, Chrome, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTutorial } from "../context/TutorialContext";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export const Home = () => {
  const navigate = useNavigate();
  const { startTutorial } = useTutorial();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/market');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/market');
    } catch (err: any) {
      setError(err.message || "Google sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = (skip = false) => {
    localStorage.setItem('investiq_guest_mode', 'true');
    navigate('/market');
    if (!skip) {
      setTimeout(() => {
        startTutorial();
      }, 500);
    } else {
      localStorage.setItem('tutorialCompleted', 'true');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-slow-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>
      <nav className="relative z-10 px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-emerald-500 text-black flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:rotate-12 transition-transform duration-500"><TrendingUp size={24} strokeWidth={3} /></div>
          <span className="text-2xl font-black italic tracking-tighter uppercase font-display leading-none">InvestIQ</span>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/')} className={cn("text-[10px] font-black uppercase tracking-[0.3em] transition-all", isLogin ? "text-emerald-500 border-b-2 border-emerald-500 pb-1" : "text-zinc-500 hover:text-white")}>Login</button>
          <button onClick={() => navigate('/signup')} className={cn("text-[10px] font-black uppercase tracking-[0.3em] transition-all", !isLogin ? "text-emerald-500 border-b-2 border-emerald-500 pb-1" : "text-zinc-500 hover:text-white")}>Sign Up</button>
        </div>
      </nav>
      <section className="relative z-10 pt-10 pb-24 px-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-4xl font-black tracking-tight uppercase italic leading-none">{isLogin ? "Welcome" : "Register"}</h2>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] font-mono">{isLogin ? "Initialize_Protocol" : "New_Identity_Sync"}</p>
              {!isLogin && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2"><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight italic">Unlock <span className="text-white px-1 bg-emerald-500/20 rounded">Persistent AI Memory</span> & <span className="text-white px-1 bg-emerald-500/20 rounded">Global Rankings</span></p></motion.div>}
            </div>
            <AnimatePresence mode="wait">
              <motion.form key={isLogin ? 'login' : 'signup'} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="group"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-4 mb-2 block font-mono italic">Terminal_ID</label><div className="relative"><Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} /><input type="email" required placeholder="ID_000@protocol.ia" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-800" /></div></div>
                  <div className="group"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-4 mb-2 block font-mono italic">Secure_Phrase</label><div className="relative"><Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} /><input type="password" required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-800" /></div></div>
                </div>
                {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex flex-col gap-2 text-rose-500"><div className="flex items-center gap-4"><AlertCircle size={20} className="shrink-0" /><p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Auth_Protocol_Failure</p></div>{error.includes("auth/operation-not-allowed") ? <p className="text-[9px] text-rose-400 font-bold leading-relaxed ml-9">ATTENTION: Email/Password auth is disabled in Firebase Console. Enable it to synchronize ID.</p> : <p className="text-[9px] text-rose-400 font-bold leading-relaxed ml-9 italic">{error}</p>}</motion.div>}
                <button type="submit" disabled={loading} className="w-full py-6 bg-emerald-500 text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all font-display text-sm uppercase tracking-[0.2em] italic active:scale-[0.98] disabled:opacity-50 shadow-[0_20px_40px_rgba(16,185,129,0.15)] overflow-hidden relative group"><div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" /><span className="relative z-10">{loading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? "Execute_Sync" : "Confirm_Identity")}</span>{!loading && <ArrowRight size={18} className="relative z-10" />}</button>
              </motion.form>
            </AnimatePresence>
            <div className="mt-8 space-y-4"><div className="flex items-center gap-4 w-full"><div className="flex-1 h-[1px] bg-white/5" /><span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest font-mono italic">Secure_Social_Gateway</span><div className="flex-1 h-[1px] bg-white/5" /></div><div className="grid grid-cols-2 gap-4"><button id="google-login-btn" onClick={handleGoogleSignIn} disabled={loading} className="flex items-center justify-center gap-3 py-4 bg-white text-black border border-white rounded-2xl hover:bg-zinc-200 transition-all group active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"><Chrome size={18} className="text-blue-600 group-hover:scale-110 transition-transform" /><span className="text-[10px] font-black uppercase tracking-widest">Login with Google</span></button><button onClick={() => setError("Game Center sync is available on iOS native devices. Use Google for Web.")} className="flex items-center justify-center gap-3 py-4 bg-zinc-950/50 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group active:scale-95 opacity-50 cursor-help"><Trophy size={18} className="text-amber-400 group-hover:rotate-12 transition-transform" /><span className="text-[10px] font-black uppercase tracking-widest">Game Center</span></button></div></div>
            <div className="mt-10 pt-10 border-t border-white/5 space-y-6"><div className="flex flex-col items-center gap-4"><button onClick={() => navigate('/signup')} className="text-[9px] font-black text-zinc-600 hover:text-emerald-500 uppercase tracking-[0.3em] transition-colors italic">Need a New Protocol ID? Register →</button><div className="flex items-center gap-4 w-full"><div className="flex-1 h-[1px] bg-white/5" /><span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest font-mono">Bypass_Module</span><div className="flex-1 h-[1px] bg-white/5" /></div><button onClick={() => handleGuestLogin(false)} className="w-full py-5 border border-white/5 bg-white/[0.02] text-zinc-400 font-bold rounded-2xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 group active:scale-95">ENTER AS GUEST (EXPLORER MODE)<Sparkles size={16} className="text-emerald-500 group-hover:scale-125 transition-transform" /></button></div></div>
          </motion.div>
          <button onClick={() => handleGuestLogin(true)} className="w-full text-center mt-6 text-[9px] font-black text-zinc-800 hover:text-zinc-600 uppercase tracking-[0.3em] transition-colors italic">Direct Market Access (Skip Tutorial)</button>
        </div>
      </section>
      <section className="px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard icon={<TrendingUp className="text-emerald-400" />} title="Real-Time Data" description="Trade top 100 stocks and bonds with live market movements." />
        <FeatureCard icon={<Sparkles className="text-blue-400" />} title="AI Mentor" description="Get real-time explanations for every price swing using AI." />
        <FeatureCard icon={<BookOpen className="text-amber-400" />} title="Gamified Learning" description="Duolingo-style lessons that turn you into a pro investor." />
      </section>
      <section className="px-6 py-12 border-t border-zinc-900"><div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"><Stat label="Active Traders" value="12.5K+" /><Stat label="Lessons Completed" value="450K+" /><Stat label="Assets Tracked" value="100+" /><Stat label="AI Insights" value="1M+" /></div></section>
      <section className="p-12 text-center bg-zinc-900/50 border-t border-zinc-800"><h2 className="text-3xl font-bold mb-6">Ready to build your fortune?</h2><Link to="/market" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all">EXPLORE THE MARKET<ArrowRight size={20} /></Link></section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4 hover:border-emerald-500/30 transition-all group"><div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div><h3 className="text-xl font-bold">{title}</h3><p className="text-zinc-400 text-sm leading-relaxed">{description}</p></div>
);

const Stat = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1"><p className="text-3xl font-black text-white">{value}</p><p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</p></div>
);
