import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Lock, Mail, AlertCircle, Loader2, ArrowRight, UserPlus, Chrome, Trophy } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match protocol security checks");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      navigate('/market');
    } catch (err: any) {
      setError(err.message || "Registration sequence failed");
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

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden flex flex-col">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 px-6 py-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-emerald-500 text-black flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:rotate-12 transition-transform duration-500">
            <TrendingUp size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase font-display leading-none text-white">InvestIQ</span>
        </div>
        <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-emerald-500 transition-colors">Return to Login</Link>
      </nav>

      <main className="flex-1 relative z-10 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />
            
            <div className="text-center space-y-3 mb-10">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-500 mb-4">
                <UserPlus size={32} />
              </div>
              <h2 className="text-4xl font-black tracking-tight uppercase italic leading-none">Identity Sync</h2>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] font-mono">Create_New_User_Record</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-4 mb-2 block font-mono">Email_Protocol</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      type="email"
                      required
                      placeholder="user@network.ia"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-800"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-4 mb-2 block font-mono">Access_Key</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-800"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-4 mb-2 block font-mono">Verify_Key</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-zinc-800"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex flex-col gap-2 text-rose-500"
                >
                  <div className="flex items-center gap-4">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Auth_Protocol_Failure</p>
                  </div>
                  {error.includes("auth/operation-not-allowed") ? (
                    <p className="text-[9px] text-rose-400 font-bold leading-relaxed ml-9">
                      ATTENTION: Email/Password auth is disabled in Firebase Console. Enable it to finalize record.
                    </p>
                  ) : (
                    <p className="text-[9px] text-rose-400 font-bold leading-relaxed ml-9 italic">{error}</p>
                  )}
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-emerald-500 text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all font-display text-sm uppercase tracking-[0.2em] italic active:scale-[0.98] disabled:opacity-50 shadow-[0_20px_40px_rgba(16,185,129,0.15)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">{loading ? <Loader2 className="animate-spin" size={24} /> : "Finalize_Record"}</span>
                {!loading && <ArrowRight size={18} className="relative z-10" />}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-[1px] bg-white/5" />
                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest font-mono italic">Secure_Social_Gateway</span>
                <div className="flex-1 h-[1px] bg-white/5" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 py-4 bg-zinc-950/50 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group active:scale-95 disabled:opacity-50"
                >
                  <Chrome size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                </button>
                <button 
                  onClick={() => setError("Game Center sync is available on iOS native devices. Use Google for Web.")}
                  className="flex items-center justify-center gap-3 py-4 bg-zinc-950/50 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group active:scale-95 opacity-50 cursor-help"
                >
                  <Trophy size={18} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Game Center</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
               <Link to="/" className="text-[9px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.3em] transition-colors">
                 Already have an ID? Sync Logic ←
               </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 p-10 flex justify-center border-t border-white/5">
        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] font-mono">Network_Secure_Registration_Active</p>
      </footer>
    </div>
  );
};
