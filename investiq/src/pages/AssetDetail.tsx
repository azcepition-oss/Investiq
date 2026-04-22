import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Sparkles, Loader2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import Markdown from "react-markdown";
import { getMarketData, getAIExplanation } from "../services/api";
import { MarketData } from "../types";
import { TOP_STOCKS, TOP_BONDS } from "../constants";
import { cn } from "../lib/utils";
import { usePortfolio } from "../context/PortfolioContext";

export const AssetDetail = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const { buyStock, sellStock, holdings, buyingPower } = usePortfolio();
  
  const [data, setData] = useState<MarketData | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState("Explain price action");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [sharesToTrade, setSharesToTrade] = useState(1);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  const assetInfo = [...TOP_STOCKS, ...TOP_BONDS].find(a => a.ticker === ticker);
  const stockName = assetInfo?.name || ticker || "this asset";
  const userHolding = holdings.find(h => h.ticker === ticker);

  useEffect(() => {
    if (ticker) {
      getMarketData(ticker).then(setData);
    }
  }, [ticker]);

  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (!data) return;
    
    if (sharesToTrade <= 0) {
      setTradeMessage("❌ Please enter a valid amount of shares!");
      setTimeout(() => setTradeMessage(null), 3000);
      return;
    }
    
    if (type === 'BUY') {
      const cost = data.price * sharesToTrade;
      if (buyingPower < cost) {
        setTradeMessage("❌ Not enough buying power!");
        setTimeout(() => setTradeMessage(null), 3000);
        return;
      }
      buyStock(data.ticker, stockName, sharesToTrade, data.price);
      setTradeMessage(`✅ Successfully bought ${sharesToTrade} shares of ${stockName}!`);
    } else {
      if (!userHolding || userHolding.shares < sharesToTrade) {
        setTradeMessage("❌ Not enough shares to sell!");
        setTimeout(() => setTradeMessage(null), 3000);
        return;
      }
      sellStock(data.ticker, sharesToTrade, data.price);
      setTradeMessage(`✅ Successfully sold ${sharesToTrade} shares of ${stockName}!`);
    }
    
    setTimeout(() => setTradeMessage(null), 3000);
  };

  const handleAskAI = async () => {
    if (!data) return;
    setIsAiLoading(true);
    try {
      const explanation = await getAIExplanation({
        ticker: data.ticker,
        stockName: stockName,
        priceChange: data.change,
        newsSummaries: "The company is seeing strong demand for its latest products, but faces some regulatory headwinds in international markets.",
        question: aiQuestion
      });
      setAiExplanation(explanation);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!data) return <div className="p-6 flex items-center justify-center h-screen"><Loader2 className="animate-spin text-emerald-500" /></div>;

  const chartData = Array.from({ length: 20 }, (_, i) => ({
    value: data.price + (Math.random() - 0.5) * 5
  }));

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-32 max-w-4xl mx-auto">
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-colors border border-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Live Execution</span>
          </div>
        </div>

        <header className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-5xl font-black tracking-tighter font-display italic uppercase">{data.ticker}</h1>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Rank #4</span>
            </div>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.3em]">{stockName}</p>
            {userHolding && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full w-fit">
                <Sparkles size={10} className="text-emerald-500" />
                <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                  Position: {userHolding.shares} shares
                </p>
              </div>
            )}
          </div>
          <div className="text-right space-y-2">
            <p className="text-4xl font-black font-display tracking-tight leading-none">${data.price.toFixed(2)}</p>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] tracking-tight",
              data.change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            )}>
              {data.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{Math.abs(data.change).toFixed(2)}%</span>
            </div>
          </div>
        </header>

        <div className="h-72 w-full bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800/80 p-6 relative group overflow-hidden shadow-2xl">
          <div className="absolute top-6 left-6 z-10">
            <div className="flex gap-2">
              {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                <button key={tf} className={cn(
                  "px-3 py-1 rounded-lg text-[9px] font-black transition-all",
                  tf === '1D' ? "bg-emerald-500 text-black shadow-lg" : "text-zinc-600 hover:text-white"
                )}>
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={data.change >= 0 ? "#10b981" : "#f43f5e"} 
                strokeWidth={4} 
                dot={false} 
                animationDuration={1500}
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '12px' }}
                cursor={{ stroke: '#27272a', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Market Cap', value: data.marketCap },
            { label: 'Volume 24H', value: data.volume },
            { label: 'P/E Ratio', value: '34.2' },
            { label: 'Dividend', value: '1.2%' },
          ].map((stat, i) => (
            <div key={i} className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl group hover:border-zinc-700 transition-colors">
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
              <p className="font-black text-lg font-display italic leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* AI Asset Expert Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border-2 border-zinc-800 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] text-emerald-500">
            <Sparkles size={200} />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Sparkles size={20} className="text-black" />
            </div>
            <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-emerald-400">Gen-Z AI Mentor</h3>
          </div>
          
          {aiExplanation ? (
            <div className="space-y-6 relative z-10">
              <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800 mb-4">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">Your Question</p>
                <p className="text-zinc-300 font-bold text-sm italic leading-snug">"{aiQuestion}"</p>
              </div>
              <div className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:font-medium prose-p:italic">
                <Markdown>
                  {aiExplanation}
                </Markdown>
              </div>
              <button 
                onClick={() => setAiExplanation(null)}
                className="group flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/20"
              >
                Ask something else
                <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-md">
                Confused by the charts? Ask your AI mentor anything about {stockName}'s moves.
              </p>
              
              <div className="relative group">
                <input 
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Is this stock cooked? Explain why..."
                  className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-[1.5rem] py-5 pl-6 pr-24 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                />
                <button 
                  onClick={() => setAiQuestion("Explain price action")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[8px] font-black text-zinc-500 uppercase tracking-widest hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
                >
                  Preset
                </button>
              </div>

              <button 
                onClick={handleAskAI}
                disabled={isAiLoading || !aiQuestion.trim()}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-black font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(16,185,129,0.3)] active:scale-95"
              >
                {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} fill="currentColor" />}
                <span className="uppercase tracking-[0.2em] text-[11px]">{isAiLoading ? 'Analyzing Market...' : 'Analyze Asset'}</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Trade Controls */}
        <div className="fixed bottom-0 left-0 right-0 p-6 md:relative md:p-0 bg-black/90 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-zinc-800 md:border-none z-40">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between p-5 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] shadow-xl">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Position Size</span>
                <p className="text-zinc-300 text-xs font-bold uppercase tracking-widest">Shares</p>
              </div>
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setSharesToTrade(Math.max(1, sharesToTrade - 1))}
                  className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl font-black hover:bg-zinc-700 active:scale-90 transition-all border border-zinc-700 shadow-lg"
                >
                  -
                </button>
                <input 
                  type="number"
                  value={sharesToTrade || ''}
                  onChange={(e) => setSharesToTrade(e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="text-4xl font-black w-24 text-center bg-transparent border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-display italic"
                />
                <button 
                  onClick={() => setSharesToTrade(sharesToTrade + 1)}
                  className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl font-black hover:bg-zinc-700 active:scale-90 transition-all border border-zinc-700 shadow-lg"
                >
                  +
                </button>
              </div>
            </div>

            <AnimatePresence>
              {tradeMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black text-center uppercase tracking-widest shadow-xl"
                >
                  {tradeMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4">
              <button 
                onClick={() => handleTrade('SELL')}
                className="flex-1 py-6 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black rounded-2xl hover:bg-zinc-800 hover:text-white transition-all uppercase tracking-[0.2em] text-[11px]"
              >
                Dump Shares
              </button>
              <button 
                onClick={() => handleTrade('BUY')}
                className="flex-1 py-6 bg-emerald-500 text-black font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_15px_40px_rgba(16,185,129,0.3)] min-w-[180px] uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-95"
              >
                Execute Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
