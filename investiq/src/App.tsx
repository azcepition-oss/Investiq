import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { LayoutDashboard, TrendingUp, BookOpen, User, Search, BarChart3, MessageSquare, Sparkles, Trophy, Newspaper, Wallet, Plus, Bell } from "lucide-react";
import { cn } from "./lib/utils";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { TutorialProvider, useTutorial } from "./context/TutorialContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TutorialOverlay } from "./components/TutorialOverlay";
import { useState, useRef, useEffect } from "react";

import { Dashboard } from "./pages/Dashboard";
import { Market } from "./pages/Market";
import { Learning } from "./pages/Learning";
import { AssetDetail } from "./pages/AssetDetail";
import { Home } from "./pages/Home";
import { Compare } from "./pages/Compare";
import { AIChat } from "./pages/AIChat";
import { Compete } from "./pages/Compete";
import { PublicProfile } from "./pages/PublicProfile";
import { News } from "./pages/News";
import { SignUp } from "./pages/SignUp";

const TABS = [
  { id: 'news', icon: Newspaper, label: 'News', component: News },
  { id: 'portfolio', icon: LayoutDashboard, label: 'Dashboard', component: Dashboard },
  { id: 'market', icon: TrendingUp, label: 'Market', component: Market },
  { id: 'compete', icon: Trophy, label: 'Leagues', component: Compete },
  { id: 'learning', icon: BookOpen, label: 'Learn', component: Learning },
];

const ResourceBar = () => {
  const { totalValue, buyingPower } = usePortfolio();
  
  return (
    <div id="resource-bar" className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 h-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          IQ
        </div>
        <div>
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] leading-none mb-1">Status</p>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-black text-white uppercase italic leading-none">Novice II</p>
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => alert("Daily login reward: $500 added to your buying power!")}
          className="resource-capsule group"
        >
          <div className="w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Wallet size={12} fill="currentColor" />
          </div>
          <span className="text-xs font-black text-white tracking-tight">${Math.floor(buyingPower/1000)}k</span>
          <Plus size={10} className="text-zinc-500 group-hover:text-white transition-colors" />
        </button>
        
        <button 
          onClick={() => alert("Notification Center: No new signals today. Stay sharp!")}
          className="w-10 h-10 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bell size={18} className="relative z-10" />
        </button>
      </div>
    </div>
  );
};

const MainTabbedInterface = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const pathToIndex: Record<string, number> = {
    '/news': 0,
    '/portfolio': 1,
    '/market': 2,
    '/compete': 3,
    '/learning': 4,
  };

  const [activeTab, setActiveTab] = useState(pathToIndex[location.pathname] ?? 2);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isActive: isTutorialActive, currentStep, nextStep, steps } = useTutorial();

  useEffect(() => {
    const index = pathToIndex[location.pathname];
    if (index !== undefined && index !== activeTab) {
      setActiveTab(index);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isTutorialActive && steps[currentStep]?.tabIndex !== undefined) {
      handleTabChange(steps[currentStep].tabIndex!);
    }
  }, [currentStep, isTutorialActive]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    const paths = ['/news', '/portfolio', '/market', '/compete', '/learning'];
    navigate(paths[index]);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black flex flex-col">
      <ResourceBar />
      <div className="flex-1 relative mt-20 mb-24 overflow-hidden">
        <motion.div
          animate={{ x: `-${activeTab * 100}%` }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex h-full w-full"
          drag="x"
          dragConstraints={{ left: -(TABS.length - 1) * window.innerWidth, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x + velocity.x;
            if (swipe < -100 && activeTab < TABS.length - 1) {
              setActiveTab(activeTab + 1);
            } else if (swipe > 100 && activeTab > 0) {
              setActiveTab(activeTab - 1);
            }
          }}
        >
          {TABS.map((tab, idx) => (
            <div key={tab.id} className="min-w-full h-full p-2 overflow-y-auto custom-scrollbar">
              <tab.component />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-24 nav-blur z-50 flex items-center px-4">
        <div className="flex-1 max-w-lg mx-auto flex justify-between items-center h-16 bg-zinc-900 border border-white/5 rounded-3xl px-2 shadow-2xl">
          {TABS.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => handleTabChange(idx)}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-500",
                  isActive ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={cn(
                  "relative z-10 transition-transform duration-300",
                  isActive ? "scale-110 -translate-y-0.5" : ""
                )}>
                  <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "relative z-10 text-[8px] font-black uppercase tracking-[0.1em]",
                  isActive ? "opacity-100" : "opacity-40"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/' || location.pathname === '/signup';
  const isGuestMode = typeof window !== 'undefined' && localStorage.getItem('investiq_guest_mode') === 'true';
  
  useEffect(() => {
    if (!loading && !user && !isGuestMode && !isLanding) {
      navigate('/');
    }
  }, [user, loading, isGuestMode, isLanding, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Sparkles size={48} className="text-emerald-500 animate-pulse" />
      </div>
    );
  }

  const isSubpage = location.pathname.startsWith('/asset/') || 
                    location.pathname.startsWith('/profile/') ||
                    location.pathname === '/ai-mentor' ||
                    location.pathname === '/compare';

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/portfolio" element={<MainTabbedInterface />} />
          <Route path="/market" element={<MainTabbedInterface />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/compete" element={<MainTabbedInterface />} />
          <Route path="/asset/:ticker" element={<AssetDetail />} />
          <Route path="/learning" element={<MainTabbedInterface />} />
          <Route path="/news" element={<MainTabbedInterface />} />
          <Route path="/ai-mentor" element={<AIChat />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="*" element={<MainTabbedInterface />} />
        </Routes>
      </AnimatePresence>
      {!isLanding && !isSubpage && (
        <Link 
          to="/ai-mentor"
          id="ai-mentor-btn"
          className="fixed bottom-28 right-6 w-14 h-14 bg-emerald-400 text-black rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.4),0_0_20px_rgba(52,211,153,0.3)] hover:scale-110 transition-all z-[60]"
        >
          <Sparkles size={24} fill="currentColor" />
        </Link>
      )}
      <TutorialOverlay />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <PortfolioProvider>
          <TutorialProvider>
            <AppContent />
          </TutorialProvider>
        </PortfolioProvider>
      </AuthProvider>
    </Router>
  );
}
