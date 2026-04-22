import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { LayoutDashboard, TrendingUp, BookOpen, User, Search, BarChart3, MessageSquare, Sparkles, Trophy, Newspaper, Wallet, Plus, Bell } from "lucide-react";
import { cn } from "./lib/utils";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { TutorialProvider, useTutorial } from "./context/TutorialContext";
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
    <div id="resource-bar" className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-black text-emerald-400 border-b-2 border-zinc-950">
          IQ
        </div>
        <div>
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Rank</p>
          <p className="text-xs font-black text-white italic leading-none">Novice II</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="resource-capsule">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black">
            <Wallet size={12} fill="currentColor" />
          </div>
          <span className="text-xs font-black text-emerald-400">${Math.floor(buyingPower/1000)}k</span>
          <button className="w-4 h-4 bg-zinc-800 rounded-md flex items-center justify-center hover:bg-zinc-700 transition-colors">
            <Plus size={10} />
          </button>
        </div>
        
        <button className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
          <Bell size={20} />
        </button>
      </div>
    </div>
  );
};

const MainTabbedInterface = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Map paths to tab indices
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

  // Sync tab with tutorial steps
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
      
      {/* Main Swipable Content */}
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

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-900 border-t-2 border-white/5 z-50 px-2 flex items-end pb-4">
        <div className="flex-1 flex justify-around items-center h-full relative">
          {/* Active indicator bar - could be more complex but let's keep it clean */}
          <div className="absolute inset-0 flex justify-around pointer-events-none">
            {TABS.map((_, idx) => (
              <div key={idx} className="flex-1 flex justify-center">
                {activeTab === idx && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="w-14 h-14 bg-emerald-500/10 rounded-2xl border-t-2 border-emerald-500/30 absolute bottom-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  />
                )}
              </div>
            ))}
          </div>

          {TABS.map((tab, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => handleTabChange(idx)}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 z-10",
                  isActive ? "text-emerald-400 scale-110 -translate-y-1" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all",
                  isActive ? "text-emerald-400" : "text-zinc-500"
                )}>
                  <tab.icon size={24} strokeWidth={isActive ? 3 : 2} />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-tighter",
                  isActive ? "opacity-100" : "opacity-60"
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
  const location = useLocation();
  const isLanding = location.pathname === '/';
  // Check if we are in a subpage (like asset details)
  const isSubpage = location.pathname.startsWith('/asset/') || 
                    location.pathname.startsWith('/profile/') ||
                    location.pathname === '/ai-mentor' ||
                    location.pathname === '/compare';

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          
          {/* Main App Experience */}
          <Route path="/portfolio" element={<MainTabbedInterface />} />
          <Route path="/market" element={<MainTabbedInterface />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/compete" element={<MainTabbedInterface />} />
          <Route path="/asset/:ticker" element={<AssetDetail />} />
          <Route path="/learning" element={<MainTabbedInterface />} />
          <Route path="/news" element={<MainTabbedInterface />} />
          <Route path="/ai-mentor" element={<AIChat />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          
          {/* Fallback */}
          <Route path="*" element={<MainTabbedInterface />} />
        </Routes>
      </AnimatePresence>
      
      {/* Universal Floating AI Mentor - Adjusted for Tabbed Interface */}
      {!isLanding && !isSubpage && (
        <Link 
          to="/ai-mentor"
          id="ai-mentor-btn"
          className="fixed bottom-28 right-6 w-14 h-14 bg-emerald-400 text-black rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.4),0_0_20px_rgba(52,211,153,0.3)] hover:scale-110 transition-all z-[60]"
        >
          <Sparkles size={24} fill="currentColor" />
        </Link>
      )}

      {/* Tutorial Overlay */}
      <TutorialOverlay />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <PortfolioProvider>
        <TutorialProvider>
          <AppContent />
        </TutorialProvider>
      </PortfolioProvider>
    </Router>
  );
}
