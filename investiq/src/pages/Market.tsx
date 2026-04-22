import { useState, useEffect, useMemo } from "react";
import { Search, TrendingUp, BarChart3, ShieldCheck, Globe, ArrowLeft, Info, Activity, Zap, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { TOP_STOCKS, TOP_BONDS, MARKET_INDICES, INVESTOR_TIPS } from "../constants";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const Market = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const marketParam = searchParams.get('m');
  const [selectedMarket, setSelectedMarket] = useState<string | null>(marketParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(MARKET_INDICES[0]);

  const mockMarketData = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      time: `${i}:00`,
      value: (featuredIndex.ticker === 'SPY' ? 5200 : featuredIndex.ticker === 'QQQ' ? 18000 : 38000) + Math.random() * 200 - 100
    }));
  }, [featuredIndex]);

  useEffect(() => {
    if (marketParam) {
      setSelectedMarket(marketParam);
    } else {
      setSelectedMarket(null);
    }
  }, [marketParam]);

  const handleSelectMarket = (marketId: string | null) => {
    if (marketId) {
      setSearchParams({ m: marketId });
    } else {
      setSearchParams({});
    }
  };

  const markets = [
    { id: 'S&P 500', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'NASDAQ', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'DOW', icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'Bonds', icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const getAssetsForMarket = (marketId: string) => {
    if (marketId === 'Bonds') return TOP_BONDS;
    return TOP_STOCKS.filter(s => s.market === marketId);
  };

  if (selectedMarket) {
    const assets = getAssetsForMarket(selectedMarket).filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="p-6 space-y-6">
        <button 
          onClick={() => handleSelectMarket(null)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">Back to Markets</span>
        </button>

        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{selectedMarket}</h1>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Top 50</span>
          </div>
          <div className="relative" id="market-search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder={`Search in ${selectedMarket}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3">
          {assets.map((asset) => (
            <AssetCard 
              key={asset.ticker} 
              ticker={asset.ticker} 
              name={asset.name} 
              subtitle={'sector' in asset ? asset.sector : asset.type} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Global Search Bar */}
      <section className="px-4 pt-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search all 100+ assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-[1.5rem] py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500/50 transition-all font-bold text-sm"
          />
        </div>
        {searchQuery && (
          <div className="mt-4 space-y-3">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-2">Search Results</p>
            {TOP_STOCKS.concat(TOP_BONDS as any).filter(a => 
              a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              a.ticker.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5).map(asset => (
              <AssetCard 
                key={asset.ticker} 
                ticker={asset.ticker} 
                name={asset.name} 
                subtitle={(asset as any).sector || (asset as any).type} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Row */}
      <div className="px-4 pt-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
          {markets.map((m, idx) => (
            <button
              key={m.id}
              id={idx === 0 ? "market-category-0" : undefined}
              onClick={() => handleSelectMarket(m.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                selectedMarket === m.id ? "bg-emerald-500 text-black border-emerald-400" : "bg-zinc-900 text-zinc-400 border-zinc-800"
              )}
            >
              <m.icon size={14} />
              {m.id}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Featured Hero */}
      <section className="px-4">
        <div className="relative w-full aspect-[16/9] bg-zinc-900 rounded-[2.5rem] overflow-hidden border-2 border-zinc-800">
          <img 
            src="https://img.freepik.com/free-vector/golden-cryptocurrency-coin-vector-illustration_1308-178402.jpg?semt=ais_hybrid&w=740&q=80"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
            alt="Fear & Greed Index"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.3em] mb-1">Global Sentiment</p>
            <h3 className="text-3xl font-black italic font-display uppercase tracking-tighter text-white">Extreme Greed</h3>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div className="w-4/5 h-full bg-emerald-500" />
            </div>
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-2">Market Volatility: Normal</p>
          </div>
        </div>
      </section>

      {/* Indices Section */}
      <section className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Market Sector Indices</h2>
          <span className="text-[8px] font-black text-emerald-500 uppercase">Interactive Chart</span>
        </div>

        {/* Index Chart */}
        <div className="h-48 w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] p-4 relative overflow-hidden group">
          <div className="absolute top-4 left-4 z-10 flex flex-col">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Live Feed</span>
            <span className="text-lg font-black font-display italic uppercase text-white">{featuredIndex.ticker} Pulse</span>
          </div>
          <div className="absolute top-4 right-4 z-10 text-right">
             <p className="text-xl font-black font-display text-emerald-400">
               {featuredIndex.ticker === 'SPY' ? '5,123.42' : featuredIndex.ticker === 'QQQ' ? '18,274.15' : '38,904.04'}
             </p>
             <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">+1.24%</p>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockMarketData}>
               <defs>
                 <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Area 
                 type="monotone" 
                 dataKey="value" 
                 stroke="#10b981" 
                 fillOpacity={1} 
                 fill="url(#colorValue)" 
                 strokeWidth={3}
                 isAnimationActive={true}
               />
               <YAxis hide domain={['auto', 'auto']} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {MARKET_INDICES.map((index) => (
            <button 
              key={index.ticker} 
              onClick={() => setFeaturedIndex(index)}
              className={cn(
                "game-card w-full text-left flex items-center justify-between group",
                featuredIndex.ticker === index.ticker ? "border-emerald-500/40" : "border-zinc-800"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                  featuredIndex.ticker === index.ticker ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-500"
                )}>
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight font-display italic uppercase leading-none">{index.ticker}</h3>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">{index.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black font-display text-white">
                  {index.ticker === 'SPY' ? '+1.24%' : '+0.95%'}
                </p>
                <TrendingUp size={14} className="text-emerald-500 ml-auto" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Packs/Categories */}
      <section className="px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight uppercase italic font-display">Specialized Assets</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleSelectMarket('NASDAQ')}
            className="game-card bg-gradient-to-br from-zinc-900 to-emerald-950 border-emerald-500/20 p-5 space-y-3 text-left active:scale-95 transition-all"
          >
             <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
               <Zap size={20} />
             </div>
             <p className="font-black text-sm uppercase italic font-display">Top Tech</p>
             <p className="text-[8px] font-black text-zinc-500 uppercase leading-relaxed">NVDA, AAPL, MSFT & more.</p>
          </button>
          <button 
            onClick={() => handleSelectMarket('Bonds')}
            className="game-card bg-gradient-to-br from-zinc-900 to-amber-950 border-amber-500/20 p-5 space-y-3 text-left active:scale-95 transition-all"
          >
             <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
               <ShieldCheck size={20} />
             </div>
             <p className="font-black text-sm uppercase italic font-display">Safety Net</p>
             <p className="text-[8px] font-black text-zinc-500 uppercase leading-relaxed">Bonds & Dividend Kings.</p>
          </button>
        </div>
      </section>

      {/* Trending Assets Row */}
      <section className="px-4 space-y-4 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight uppercase italic font-display">Trending Now</h2>
          <span className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1">
            <TrendingUp size={10} />
            Hot Picks
          </span>
        </div>
        <div className="space-y-3">
          {TOP_STOCKS.slice(0, 5).map((asset) => (
            <AssetCard 
              key={asset.ticker} 
              ticker={asset.ticker} 
              name={asset.name} 
              subtitle={asset.sector} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const AssetCard = ({ ticker, name, subtitle }: { ticker: string, name: string, subtitle: string, key?: string }) => (
  <Link 
    to={`/asset/${ticker}`}
    className="flex items-center justify-between p-5 bg-zinc-900/40 border border-zinc-800 rounded-3xl hover:bg-zinc-900 hover:border-emerald-500/40 transition-all group active:scale-[0.98] shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-zinc-800 rounded-[1.25rem] flex items-center justify-center font-black text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-inner font-display italic text-xl">
        {ticker.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <h3 className="font-black text-lg tracking-tight font-display italic uppercase leading-none mb-1 group-hover:text-emerald-400 transition-colors">{ticker}</h3>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate max-w-[120px]">{name}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-1.5">{subtitle}</p>
      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg text-emerald-400 font-black text-[10px] tracking-tight">
        <Activity size={12} className="animate-pulse" />
        <span>LIVE</span>
      </div>
    </div>
  </Link>
);
