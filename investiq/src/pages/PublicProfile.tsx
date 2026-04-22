import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Wallet, LayoutDashboard, Globe } from "lucide-react";
import { MOCK_LEADERBOARD } from "../constants";
import { cn } from "../lib/utils";

export const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const user = MOCK_LEADERBOARD.find(u => u.id === userId);

  if (!user) return <div className="p-6 text-center">User not found</div>;

  // Diversified mock holdings based on userId
  const getDiversifiedHoldings = (id: string) => {
    const portfolios: Record<string, any[]> = {
      '1': [
        { ticker: 'NVDA', shares: 150, value: 18675.00, change: +5.2 },
        { ticker: 'AMD', shares: 200, value: 34000.00, change: +3.1 },
        { ticker: 'MSFT', shares: 50, value: 21000.00, change: +1.2 },
      ],
      '2': [
        { ticker: 'TSLA', shares: 100, value: 17500.00, change: -2.4 },
        { ticker: 'AMZN', shares: 120, value: 22000.00, change: +0.5 },
        { ticker: 'META', shares: 60, value: 28000.00, change: +4.8 },
      ],
      '3': [
        { ticker: 'AAPL', shares: 300, value: 57000.00, change: +0.8 },
        { ticker: 'GOOGL', shares: 150, value: 22500.00, change: -0.3 },
        { ticker: 'NFLX', shares: 40, value: 24000.00, change: +1.5 },
      ],
      '4': [
        { ticker: 'TLT', shares: 500, value: 45000.00, change: -0.2 },
        { ticker: 'GLD', shares: 100, value: 23000.00, change: +0.1 },
        { ticker: 'V', shares: 80, value: 22000.00, change: +0.4 },
      ],
      '5': [
        { ticker: 'BTC', shares: 0.5, value: 32000.00, change: +8.2 },
        { ticker: 'ETH', shares: 5, value: 12500.00, change: +6.5 },
        { ticker: 'COIN', shares: 100, value: 21000.00, change: +12.4 },
      ],
    };
    return portfolios[id] || portfolios['1'];
  };

  const mockHoldings = getDiversifiedHoldings(userId || '1');

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen">
      <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft size={24} />
      </button>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-24 h-24 rounded-3xl object-cover border-4 border-zinc-900 shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">{user.name}</h1>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-500/20">
                Pro Trader
              </span>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                Joined Mar 2024
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl min-w-[120px]">
            <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">Weekly Return</p>
            <p className="text-xl font-black text-emerald-400">+{user.return}%</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl min-w-[120px]">
            <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">Global Rank</p>
            <p className="text-xl font-black text-white">#{user.id}</p>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight uppercase">Public Portfolio</h2>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">3 Assets</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {mockHoldings.map((stock) => (
            <div 
              key={stock.ticker} 
              className="flex items-center justify-between p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center font-black text-emerald-400">
                  {stock.ticker[0]}
                </div>
                <div>
                  <p className="font-black text-lg tracking-tight">{stock.ticker}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stock.shares} Shares</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-lg">${stock.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className={cn("flex items-center justify-end gap-1 text-[10px] font-black uppercase tracking-widest", stock.change >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                  <span>{Math.abs(stock.change)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-8 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-zinc-700">
          <Globe size={32} />
        </div>
        <div className="space-y-1">
          <p className="font-black text-lg uppercase tracking-tight">Strategy Insights</p>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            This user focuses on high-growth tech stocks and maintains a concentrated portfolio for maximum alpha.
          </p>
        </div>
      </section>
    </div>
  );
};
