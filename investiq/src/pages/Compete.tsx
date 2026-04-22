import { Trophy, Users, Plus, Search, Crown, ArrowLeft, Lock, Globe, DollarSign, ShieldCheck, MessageSquare, ArrowRight, TrendingUp, TrendingDown, Eye, CheckCircle2 } from "lucide-react";
import { MOCK_LEADERBOARD, MOCK_LEAGUES, TOP_LEAGUES, TOP_STOCKS } from "../constants";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Compete = () => {
  const { 
    deductFunds, 
    buyingPower, 
    holdings: userHoldings, 
    totalValue: userValue,
    activeLeagueId,
    setActiveLeagueId,
    tournamentStatus,
    startTournament,
    stopTournament,
    fastForwardTournament,
    buySimStock,
    sellSimStock,
    collectReward,
    setPlayerReady
  } = usePortfolio();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'leagues' | 'tournament'>('leagues');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [leagueSearch, setLeagueSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null); // For sim picker
  const [tradeAmount, setTradeAmount] = useState(1);
  const [assetSearch, setAssetSearch] = useState("");
  const [viewingHoldingsId, setViewingHoldingsId] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getPhaseTitle = () => {
    switch(tournamentStatus.phase) {
      case 'draft': return tournamentStatus.isReady ? 'Waiting for Others...' : 'Draft Initial Portfolio';
      case 'sim1': return 'Simulation Phase 1';
      case 'adjust': return tournamentStatus.isReady ? 'Waiting for Others...' : 'Mid-Tournament Adjustment';
      case 'sim2': return 'Simulation Final Phase';
      case 'end': return 'Tournament Finished';
      default: return 'Fast Sim Cup';
    }
  };

  const userRank = tournamentStatus.leaders.findIndex(l => l.id === 'me') + 1;
  const potentialReward = userRank === 1 ? 20000 : userRank === 2 ? 15000 : userRank === 3 ? 10000 : 0;

  const filteredAssets = useMemo(() => {
    return TOP_STOCKS.filter(a => 
      a.name.toLowerCase().includes(assetSearch.toLowerCase()) || 
      a.ticker.toLowerCase().includes(assetSearch.toLowerCase())
    );
  }, [assetSearch]);

  const mockChartData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      name: i,
      value: 400 + Math.random() * 200 + (i * 10)
    }));
  }, [selectedAsset]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, user: "AlphaTrader", text: "LFG! We're hitting #1 this week.", time: "2m ago" },
    { id: 2, user: "BullRun_04", text: "Just added more NVDA to the bag.", time: "1m ago" },
  ]);

  const activeLeague = MOCK_LEAGUES.find(l => l.id === activeLeagueId);
  const leagueMembers = [
    // Include the user if they've joined
    ...(activeLeagueId ? [{ 
      id: 'me', 
      name: 'You', 
      return: 5.2, // Mock return
      avatar: 'https://picsum.photos/seed/you/100/100',
      holdings: userHoldings.map(h => ({ ticker: h.ticker, shares: h.shares, change: 2.1 })) // Mock daily change
    }] : []),
    ...MOCK_LEADERBOARD
  ];

  const selectedUser = leagueMembers.find(m => m.id === selectedUserId);

  const handleCreateLeague = () => {
    if (activeLeagueId) {
      alert("You are already in a league! Leave your current league to create a new one.");
      return;
    }
    if (deductFunds(10000)) {
      alert("League created! $10,000 deducted from buying power.");
      setActiveLeagueId('l-custom'); // Mock custom league ID
      setShowCreateModal(false);
    } else {
      alert("Insufficient funds! You need $10,000 to create a league.");
    }
  };

  const handleJoinLeague = (league: any) => {
    if (activeLeagueId) {
      alert("You can only be in one league at a time!");
      return;
    }

    if (league.members >= 50) {
      alert("This league is full! (Max 50 members)");
      return;
    }

    if (league.type === 'Public') {
      setActiveLeagueId(league.id);
      alert(`Joined ${league.name}!`);
    } else {
      if (league.access === 'Pay') {
        if (deductFunds(league.entryFee)) {
          setActiveLeagueId(league.id);
          alert(`Paid $${league.entryFee} and joined ${league.name}!`);
        } else {
          alert("Insufficient funds for entry fee!");
        }
      } else if (league.access === 'Application') {
        alert("Application sent to league owner!");
      } else {
        alert("This league is invite-only.");
      }
    }
  };

  const handleLeaveLeague = () => {
    if (window.confirm("Are you sure you want to leave this league?")) {
      setActiveLeagueId(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { id: Date.now(), user: "You", text: chatMessage, time: "Just now" }]);
    setChatMessage("");
  };

  if (activeLeagueId && activeLeague) {
    return (
      <div className="space-y-6 pb-20">
        <header className="px-4 py-8 bg-zinc-900 rounded-b-[3rem] border-b border-white/5 space-y-4">
           <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  if (window.confirm("Leave this league?")) setActiveLeagueId(null);
                }} 
                className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-zinc-500"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight font-display italic uppercase leading-none">{activeLeague.name}</h1>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">League Hall</p>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm("Leave this league?")) setActiveLeagueId(null);
                }}
                className="game-button-zinc px-4 py-2 scale-75 text-[8px]"
              >
                Leave
              </button>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Weekly Growth</p>
                <p className={cn("text-xl font-black font-display", activeLeague.weeklyReturn >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {activeLeague.weeklyReturn >= 0 ? '+' : ''}{activeLeague.weeklyReturn}%
                </p>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Global Rank</p>
                <p className="text-xl font-black font-display text-white italic">#{activeLeague.rank}</p>
              </div>
           </div>

           <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between" id="league-trophies">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">League Level 8</p>
                  <p className="text-xs font-black text-white uppercase italic font-display">Clash Mode: Active</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-zinc-500 uppercase">Trophies</p>
                <p className="text-sm font-black text-amber-500">2,450</p>
              </div>
            </div>
        </header>

        <section className="px-4 space-y-4">
           <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Council Members</h2>
            <Link to="/ai-mentor" className="text-emerald-500 transition-colors">
              <MessageSquare size={20} />
            </Link>
           </div>
           <div className="grid grid-cols-1 gap-3">
             {leagueMembers.map((member) => (
                <button 
                  key={member.id} 
                  onClick={() => setSelectedUserId(member.id)}
                  className="game-card w-full flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={member.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-zinc-800" alt="" />
                      {member.id === 'me' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900 animate-pulse" />}
                    </div>
                    <div className="text-left">
                      <p className={cn("font-black text-base uppercase italic font-display", member.id === 'me' ? "text-emerald-400" : "text-zinc-100")}>{member.name}</p>
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                        {member.holdings?.length || 0} Assets Deployed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-lg font-black font-display italic", member.return >= 0 ? "text-emerald-400" : "text-rose-400")}>
                      {member.return >= 0 ? '+' : ''}{member.return}%
                    </p>
                    <Eye size={14} className="text-zinc-700 ml-auto" />
                  </div>
                </button>
             ))}
           </div>
        </section>

        {/* Floating Chat Button for Mobile Experience */}
        <div className="fixed bottom-28 left-6 right-6 pointer-events-none flex justify-center">
           <div className="bg-zinc-900 border-2 border-zinc-800 rounded-full p-1 pl-4 flex items-center gap-4 pointer-events-auto shadow-2xl">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Chat with League</p>
              <button className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-lg">
                <MessageSquare size={18} fill="currentColor" />
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <section className="px-4 pt-8 text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-emerald-400 relative">
          <Trophy size={40} className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-[2.5rem] animate-pulse" />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight uppercase italic font-display">Competitions</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Dominate the Global Arena</p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 max-w-[280px] mx-auto">
          <button 
            onClick={() => setActiveTab('leagues')}
            className={cn(
              "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'leagues' ? "bg-emerald-500 text-black" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Live Leagues
          </button>
          <button 
            onClick={() => setActiveTab('tournament')}
            className={cn(
              "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === 'tournament' ? "bg-amber-500 text-black" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Tournament Sim
          </button>
        </div>
      </section>

      {activeTab === 'tournament' ? (
        <section className="px-4 space-y-6">
          <div className="game-card bg-gradient-to-br from-zinc-900 to-amber-950 border-amber-500/20 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic uppercase font-display text-amber-500">
                  {getPhaseTitle()}
                </h2>
                {tournamentStatus.phase !== 'idle' && tournamentStatus.phase !== 'end' && (
                  <p className="text-[14px] font-black text-amber-500/80 uppercase tracking-widest font-mono">
                    Time Remaining: {formatTime(tournamentStatus.timeLeft)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-amber-500/30">
                {tournamentStatus.isActive ? (
                  <>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Live</span>
                  </>
                ) : (
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Status: {tournamentStatus.phase}</span>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {tournamentStatus.phase === 'idle' ? (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                    Test your strategy under pressure. 2 minutes to draft, 45 seconds to sim, then adjust and sim again. Win up to $20k!
                  </p>
                  <button 
                    onClick={startTournament}
                    className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:bg-amber-400 transition-all active:scale-95"
                  >
                    Start New Tournament Cup
                  </button>
                </div>
              ) : tournamentStatus.phase === 'end' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-4"
                >
                  <div>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Final Result</p>
                    <p className="text-3xl font-black font-display uppercase italic">Rank #{userRank}</p>
                  </div>
                  
                  {potentialReward > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">Reward Unlocked: ${potentialReward.toLocaleString()}</p>
                      <button 
                        onClick={() => collectReward(potentialReward)}
                        className="w-full py-3 bg-emerald-500 text-black font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg"
                      >
                        Claim Prize Money
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-rose-400 font-bold uppercase tracking-widest">Better luck next time!</p>
                      <button 
                        onClick={() => startTournament()}
                        className="w-full py-3 bg-zinc-800 text-white font-black rounded-xl text-[10px] uppercase tracking-widest"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-amber-500" />
                      <div>
                        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">Sim Buying Power</p>
                        <p className="text-lg font-black text-white font-mono">${tournamentStatus.budget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                    </div>
                  </div>

                  {(tournamentStatus.phase === 'draft' || tournamentStatus.phase === 'adjust') && (
                    <div className="space-y-4">
                      {tournamentStatus.isReady ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-6">
                           <div className="relative">
                             <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                               <Users size={32} />
                             </div>
                             <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-zinc-900">
                               <CheckCircle2 size={14} className="text-white" />
                             </div>
                           </div>
                           <div className="text-center space-y-1">
                             <p className="text-sm font-black text-white uppercase italic">Ready to Sim</p>
                             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                               Waiting for other players... ({tournamentStatus.readyPlayers.length}/{tournamentStatus.leaders.length})
                             </p>
                           </div>
                           <div className="flex -space-x-3">
                             {tournamentStatus.leaders.map((p, i) => (
                               <div key={p.id} className={cn(
                                 "w-10 h-10 rounded-full border-2 border-zinc-900 overflow-hidden relative grayscale",
                                 tournamentStatus.readyPlayers.includes(p.id) && "grayscale-0 border-emerald-500"
                               )}>
                                 <img src={p.avatar} alt="" className="w-full h-full object-cover" />
                                 {tournamentStatus.readyPlayers.includes(p.id) && (
                                   <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                     <CheckCircle2 size={12} className="text-emerald-500" />
                                   </div>
                                 )}
                               </div>
                             ))}
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-in fade-in duration-500">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                            <input 
                              type="text"
                              value={assetSearch}
                              onChange={(e) => setAssetSearch(e.target.value)}
                              placeholder="Search sim stocks..."
                              className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-amber-500/50"
                            />
                          </div>

                          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                            {filteredAssets.map(asset => {
                              const currentPrice = 100 + Math.random() * 900; // Simulated entry price
                              const isOwned = tournamentStatus.holdings.find(h => h.ticker === asset.ticker);
                              return (
                                <button 
                                  key={asset.ticker} 
                                  onClick={() => setSelectedAsset({ ...asset, price: currentPrice })}
                                  className={cn(
                                    "w-full flex items-center justify-between p-4 bg-black/30 rounded-2xl border transition-all",
                                    isOwned ? "border-amber-500/40 bg-amber-500/5" : "border-zinc-800 hover:border-zinc-700"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-black text-amber-500">{asset.ticker}</div>
                                    <div className="text-left">
                                      <p className="text-[10px] font-black text-zinc-200 uppercase tracking-widest leading-none">{asset.name}</p>
                                      {isOwned && <p className="text-[8px] font-black text-amber-500 uppercase mt-1">{isOwned.shares} Shares Owned</p>}
                                    </div>
                                  </div>
                                  <p className="text-sm font-black text-white font-mono italic">${currentPrice.toFixed(2)}</p>
                                </button>
                              );
                            })}
                          </div>

                          <button 
                            onClick={setPlayerReady}
                            className="w-full py-4 bg-emerald-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                          >
                            Finish Selection & Ready Up
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {(tournamentStatus.phase === 'sim1' || tournamentStatus.phase === 'sim2') && (
                    <div className="space-y-4 pt-2">
                       {/* Performance Graph */}
                       <div className="h-32 w-full bg-black/40 rounded-3xl border border-zinc-800 p-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Portfolio Performance</p>
                            <div className="flex items-center gap-1">
                              <TrendingUp size={10} className="text-emerald-500" />
                              <span className="text-[10px] font-black text-emerald-400 font-mono">Live</span>
                            </div>
                          </div>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={tournamentStatus.simHistory}>
                              <defs>
                                <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#10b981" 
                                fillOpacity={1} 
                                fill="url(#colorPerf)" 
                                strokeWidth={2}
                                isAnimationActive={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                       </div>

                       <div className="h-64 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                          {tournamentStatus.leaders.map((user, i) => (
                            <motion.div 
                              layout
                              key={user.id} 
                              onClick={() => setViewingHoldingsId(user.id)}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-2xl transition-all border cursor-pointer active:scale-95",
                                user.id === 'me' ? "border-amber-500/50 bg-amber-500/5" : "border-zinc-800/50 bg-black/20"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className={cn("text-lg font-black italic w-5", i === 0 ? "text-amber-500" : "text-zinc-700")}>{i+1}</span>
                                <img src={user.avatar} className="w-8 h-8 rounded-xl object-cover border border-zinc-700" alt="" />
                                <div>
                                  <p className={cn("font-black text-xs uppercase italic font-display", user.id === 'me' ? "text-amber-400" : "text-zinc-300")}>{user.name}</p>
                                  <p className="text-[8px] font-black text-zinc-600 uppercase">View Holdings</p>
                                </div>
                              </div>
                              <p className="text-sm font-black text-white font-mono italic">${user.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </motion.div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Trade Sim Modal (Stock Detail Page) */}
          <AnimatePresence>
            {selectedAsset && (
              <div className="fixed inset-0 z-[110] flex flex-col p-0">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  onClick={() => setSelectedAsset(null)} 
                  className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
                />
                <motion.div 
                  initial={{ y: "100%" }} 
                  animate={{ y: 0 }} 
                  exit={{ y: "100%" }} 
                  className="relative flex-1 bg-zinc-950 mt-12 rounded-t-[3.5rem] border-t-2 border-amber-500/30 overflow-y-auto pb-12"
                >
                  {/* Handle */}
                  <div className="flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1 bg-zinc-800 rounded-full" />
                  </div>

                  <div className="px-8 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <button onClick={() => setSelectedAsset(null)} className="flex items-center gap-2 text-zinc-500 mb-4 scale-90 -ml-2">
                           <ArrowLeft size={16} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Back to Market</span>
                        </button>
                        <h3 className="text-5xl font-black italic uppercase font-display text-amber-500 leading-none">{selectedAsset.ticker}</h3>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{selectedAsset.name}</p>
                      </div>
                      <div className="text-right pt-8">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Sim Price</p>
                        <p className={cn("text-3xl font-black font-mono leading-none", Math.random() > 0.5 ? "text-emerald-400" : "text-rose-400")}>
                          ${selectedAsset.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="h-48 w-full bg-zinc-900/50 rounded-3xl p-4 border border-zinc-800">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                          <div className="px-2 py-0.5 bg-amber-500 text-black text-[8px] font-black rounded uppercase">1D</div>
                          <div className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[8px] font-black rounded uppercase">1W</div>
                        </div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Live Volatility: High</p>
                      </div>
                      <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={mockChartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                          <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Your Holdings</p>
                          <p className="text-xl font-black text-white font-mono">
                            {tournamentStatus.holdings.find(h => h.ticker === selectedAsset.ticker)?.shares || 0}
                          </p>
                       </div>
                       <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                          <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Daily Range</p>
                          <p className="text-xl font-black text-zinc-400 font-mono italic">$892 - $945</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-black/60 p-6 rounded-[2.5rem] border border-zinc-800 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                          <button onClick={() => setTradeAmount(Math.max(1, tradeAmount - 1))} className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-black">-</button>
                          <div className="text-center">
                            <input 
                              type="number" 
                              value={tradeAmount}
                              onChange={(e) => setTradeAmount(parseInt(e.target.value) || 0)}
                              className="bg-transparent text-5xl font-black text-white text-center w-32 focus:outline-none font-display italic"
                            />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2">Enter Shares to Deploy</p>
                          </div>
                          <button onClick={() => setTradeAmount(tradeAmount + 1)} className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-black">+</button>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                           {[0.25, 0.5, 1].map((p) => (
                             <button 
                               key={p}
                               onClick={() => setTradeAmount(Math.floor((tournamentStatus.budget / selectedAsset.price) * p))}
                               className="py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[8px] font-black text-zinc-400 uppercase tracking-tighter hover:border-amber-500/50 hover:text-amber-500 transition-all"
                             >
                               {p === 1 ? 'MAX' : `${p * 100}%`}
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => {
                            buySimStock(selectedAsset.ticker, selectedAsset.name, tradeAmount, selectedAsset.price);
                            setSelectedAsset(null);
                          }}
                          className="flex-1 py-5 bg-amber-500 text-black font-black rounded-[2rem] text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/10 active:scale-95 transition-all"
                        >
                          Confirm Buy
                        </button>
                        <button 
                           onClick={() => {
                            sellSimStock(selectedAsset.ticker, tradeAmount, selectedAsset.price);
                            setSelectedAsset(null);
                          }}
                          className="flex-1 py-5 bg-zinc-800 text-white font-black rounded-[2rem] text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all border-b-4 border-black"
                        >
                          Liquidate
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
                      <p className="text-[10px] font-black text-zinc-600 uppercase leading-relaxed text-center italic">
                        "Deploy capital with extreme prejudice. Time is the only limited resource."
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Opponent Holdings Modal */}
          <AnimatePresence>
            {viewingHoldingsId && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingHoldingsId(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] space-y-6 shadow-2xl">
                   <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                      <img src={tournamentStatus.leaders.find(l => l.id === viewingHoldingsId)?.avatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-zinc-800" alt="" />
                      <div>
                        <h4 className="text-xl font-black italic uppercase font-display text-white">{tournamentStatus.leaders.find(l => l.id === viewingHoldingsId)?.name}</h4>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Sim Holdings</p>
                      </div>
                   </div>
                   
                   <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                      {(viewingHoldingsId === 'me' ? tournamentStatus.holdings : (tournamentStatus.playerHoldings[viewingHoldingsId] || [])).map(holding => (
                        <div key={holding.ticker} className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-zinc-800">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] font-black text-amber-500">{holding.ticker}</div>
                              <div>
                                <p className="text-[10px] font-black text-white uppercase">{holding.name}</p>
                                <p className="text-[8px] font-black text-zinc-600 uppercase">{holding.shares} Units</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-black text-white font-mono">${(holding.shares * holding.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                              <div className="flex items-center gap-1 justify-end">
                                {holding.currentPrice > holding.averagePrice ? <TrendingUp size={10} className="text-emerald-500" /> : <TrendingDown size={10} className="text-rose-500" />}
                                <p className={cn("text-[8px] font-black font-mono", holding.currentPrice > holding.averagePrice ? "text-emerald-500" : "text-rose-500")}>
                                  {(((holding.currentPrice / holding.averagePrice) - 1) * 100).toFixed(1)}%
                                </p>
                              </div>
                           </div>
                        </div>
                      ))}
                      {(viewingHoldingsId !== 'me' && (!tournamentStatus.playerHoldings[viewingHoldingsId] || tournamentStatus.playerHoldings[viewingHoldingsId].length === 0)) && (
                        <p className="text-center py-8 text-[10px] font-black text-zinc-700 uppercase tracking-widest">No assets deployed by this player.</p>
                      )}
                   </div>

                   <button onClick={() => setViewingHoldingsId(null)} className="w-full py-4 bg-zinc-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest">Close Intelligence</button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>
      ) : (
        <>
          <section className="px-4 text-center">
            <div className="flex flex-wrap justify-center gap-2">
               <button onClick={() => setShowCreateModal(true)} className="game-button-emerald scale-90">
                 Create League
               </button>
               <div className="resource-capsule mt-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">Season ends in 2d</span>
               </div>
            </div>
          </section>

          <section className="px-4 space-y-4">
             <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Champion Rankings</h2>
             <div className="space-y-3">
                {MOCK_LEADERBOARD.slice(0, 5).map((user, i) => (
                   <div key={user.id} className="game-card flex items-center justify-between border-zinc-800/50">
                      <div className="flex items-center gap-4">
                        <span className={cn("text-2xl font-black italic w-6 text-center", i === 0 ? "text-emerald-400" : "text-zinc-800")}>{i+1}</span>
                        <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-zinc-800" alt="" />
                        <div>
                           <p className="font-black text-lg tracking-tight font-display uppercase italic">{user.name}</p>
                           <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest italic">{user.id === '1' ? 'Legendary' : 'Master'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-emerald-400 italic">+{user.return}%</p>
                        <Trophy size={14} className={cn("ml-auto", i === 0 ? "text-amber-500" : "text-zinc-800")} fill={i === 0 ? "currentColor" : "none"} />
                      </div>
                   </div>
                ))}
             </div>
          </section>

          <section className="px-4 space-y-4 pb-20">
             <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Open Leagues</h2>
              <div className="relative group flex-1 ml-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                <input 
                  type="text" 
                  value={leagueSearch}
                  onChange={(e) => setLeagueSearch(e.target.value)}
                  placeholder="Filter leagues..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-[10px] font-bold focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
               {MOCK_LEAGUES.filter(l => l.name.toLowerCase().includes(leagueSearch.toLowerCase())).map((league) => (
                 <motion.div 
                   layout
                   key={league.id} 
                   className="game-card space-y-4 border-zinc-800"
                 >
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-emerald-500">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h3 className="font-black text-lg uppercase italic font-display">{league.name}</h3>
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{league.members}/50 Members</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white italic">#{league.rank}</p>
                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Global Rank</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-zinc-800 rounded-lg text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                           {league.type}
                        </div>
                        {league.entryFee > 0 && (
                          <div className="px-2 py-1 bg-amber-500/10 rounded-lg text-[8px] font-black text-amber-500 uppercase tracking-widest">
                             ${league.entryFee} Fee
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleJoinLeague(league)}
                        className="px-6 py-2 bg-zinc-800 text-white font-black rounded-xl text-[10px] uppercase tracking-widest active:bg-emerald-500 active:text-black transition-all border-b-2 border-black"
                      >
                        Join
                      </button>
                   </div>
                 </motion.div>
               ))}
             </div>
          </section>
        </>
      )}

      {/* Create League Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 shadow-2xl"
            >
              <div className="space-y-2">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Create New League</h2>
                <p className="text-zinc-500 text-sm font-medium">Establish your own investment circle and compete globally.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-800">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Creation Fee</p>
                    <p className="text-lg font-black text-rose-400">-$10,000</p>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    This fee is deducted from your buying power to verify your commitment as a League Commissioner.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">League Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Diamond Hands Elite"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 bg-zinc-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateLeague}
                  className="flex-2 py-4 bg-emerald-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  Confirm & Pay $10k
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
