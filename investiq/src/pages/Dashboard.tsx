import { TrendingUp, Wallet, Flame, Trophy, LayoutDashboard, TrendingDown, Search, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { BreakingNews } from "../components/BreakingNews";

const calculateChange = (avg: number, current: number) => {
  const change = ((current - avg) / avg) * 100;
  return change.toFixed(1);
};

export const Dashboard = () => {
  const { totalValue, buyingPower, holdings } = usePortfolio();

  return (
    <div className="space-y-6 pb-20">
      <header className="px-4 py-8 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-b-[3rem] border-b border-white/5 space-y-4 text-center">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Total Empire Value</p>
          <h1 className="text-6xl font-black tracking-tight font-display italic text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </h1>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transform rotate-[-1deg]">
            <TrendingUp size={12} strokeWidth={3} />
            <span>+4.25%</span>
          </div>
          <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl font-black text-[10px] uppercase tracking-widest text-zinc-400 transform rotate-[1deg]">
            Today
          </div>
        </div>
      </header>

      {/* Breaking News Section */}
      <div className="px-4">
        <BreakingNews />
      </div>

      {/* Shortcuts */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Quick Shortcuts</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: TrendingUp, label: 'Market', color: 'text-emerald-400', path: '/market' },
            { icon: Search, label: 'Search', color: 'text-blue-400', path: '/market' },
            { icon: Trophy, label: 'Leagues', color: 'text-amber-400', path: '/compete' },
            { icon: Sparkles, label: 'AI Help', color: 'text-purple-400', path: '/ai-mentor' },
          ].map((s) => (
            <Link 
              key={s.label} 
              to={s.path}
              className="flex flex-col items-center gap-2 group cursor-pointer active:scale-90 transition-all"
            >
              <div className={cn("w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center", s.color)}>
                <s.icon size={20} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>
      
      <div className="grid grid-cols-2 gap-4 px-4">
        <div id="dashboard-cash" className="game-card group border-emerald-500/20">
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">CASH</p>
              <p className="text-2xl font-black font-display tracking-tight">${buyingPower.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
        
        <div className="game-card group border-amber-500/20">
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">STREAK</p>
              <p className="text-2xl font-black font-display tracking-tight text-amber-500 italic">5D</p>
            </div>
          </div>
        </div>
      </div>

      <section className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Market Pulse</h2>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-full border border-zinc-800">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
          {[
            { ticker: 'S&P 500', price: '5,123', change: '+1.2%', marketId: 'S&P 500' },
            { ticker: 'NASDAQ', price: '16,274', change: '+0.8%', marketId: 'NASDAQ' },
            { ticker: 'DOW 30', price: '38,904', change: '-0.2%', marketId: 'DOW' },
          ].map((index) => (
            <div 
              key={index.ticker} 
              className="min-w-[140px] p-5 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-1.5 shadow-sm active:scale-95 transition-all"
            >
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">{index.ticker}</p>
              <p className="text-lg font-black font-display leading-none">{index.price}</p>
              <p className={cn("text-[10px] font-black font-mono tracking-tighter", index.change.startsWith('+') ? "text-emerald-400" : "text-rose-400")}>
                {index.change}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 space-y-4 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight uppercase italic font-display">Your Squad</h2>
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[8px] font-black text-zinc-500 uppercase tracking-widest">{holdings.length} Assets</span>
        </div>
        
        {holdings.length === 0 ? (
          <div className="p-10 text-center bg-zinc-900/40 border-2 border-dashed border-zinc-800 rounded-[2.5rem] space-y-6">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl mx-auto flex items-center justify-center text-zinc-600">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <p className="font-black text-zinc-400 uppercase tracking-widest text-xs mb-2">Portfolio Empty</p>
              <p className="text-zinc-600 text-[10px] uppercase font-bold max-w-[180px] mx-auto leading-relaxed">Enter the arena and start trading your first assets.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {holdings.map((stock) => (
              <div 
                key={stock.ticker} 
                className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-3xl active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-emerald-400 font-display text-xl italic uppercase border-b-2 border-black">
                    {stock.ticker[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight font-display italic uppercase leading-none">{stock.ticker}</h3>
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">{stock.shares} SHARES</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-black text-xl font-display leading-none">
                    ${(stock.shares * stock.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <div className={cn(
                    "font-black text-[9px] uppercase tracking-tighter font-mono",
                    stock.currentPrice >= stock.averagePrice ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {stock.currentPrice >= stock.averagePrice ? '+' : ''}{calculateChange(stock.averagePrice, stock.currentPrice)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
