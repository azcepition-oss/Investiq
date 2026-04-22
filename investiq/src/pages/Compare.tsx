import { useState, useEffect } from "react";
import { Search, Plus, X, TrendingUp, TrendingDown, ArrowLeft, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TOP_STOCKS, TOP_BONDS } from "../constants";
import { getMarketData } from "../services/api";
import { MarketData } from "../types";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

export const Compare = () => {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<MarketData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const allAssets = [...TOP_STOCKS, ...TOP_BONDS];
  const filteredAssets = allAssets.filter(a => 
    (a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.ticker.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !selectedTickers.includes(a.ticker)
  ).slice(0, 5);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        selectedTickers.map(ticker => getMarketData(ticker))
      );
      setComparisonData(data);
    };
    if (selectedTickers.length > 0) {
      fetchData();
    } else {
      setComparisonData([]);
    }
  }, [selectedTickers]);

  const addTicker = (ticker: string) => {
    if (selectedTickers.length >= 4) return;
    setSelectedTickers(prev => [...prev, ticker]);
    setSearchQuery("");
  };

  const removeTicker = (ticker: string) => {
    setSelectedTickers(prev => prev.filter(t => t !== ticker));
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-black">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Asset Comparison</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Stack 'em up and see who wins</p>
        </div>
      </header>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Search assets to compare (max 4)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          
          <AnimatePresence>
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden z-50 shadow-2xl"
              >
                {filteredAssets.map(asset => (
                  <button
                    key={asset.ticker}
                    onClick={() => addTicker(asset.ticker)}
                    className="w-full p-4 flex items-center justify-between hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-0"
                  >
                    <div className="text-left">
                      <p className="font-black">{asset.ticker}</p>
                      <p className="text-xs text-zinc-500">{asset.name}</p>
                    </div>
                    <Plus size={20} className="text-emerald-500" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTickers.map(ticker => (
            <div key={ticker} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-black">
              {ticker}
              <button onClick={() => removeTicker(ticker)} className="hover:text-white">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {comparisonData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparisonData.map((data, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={data.ticker}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 relative overflow-hidden group"
            >
              <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart3 size={120} />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tighter">{data.ticker}</h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest truncate">
                  {allAssets.find(a => a.ticker === data.ticker)?.name}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-2xl font-black">${data.price.toFixed(2)}</p>
                </div>
                
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">24h Change</p>
                  <div className={cn("flex items-center gap-1 font-black", data.change >= 0 ? "text-emerald-400" : "text-rose-400")}>
                    {data.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{Math.abs(data.change).toFixed(2)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                  <div>
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Market Cap</p>
                    <p className="text-xs font-bold">{data.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Volume</p>
                    <p className="text-xs font-bold">{data.volume}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
          <BarChart3 size={64} className="text-zinc-800" />
          <p className="text-zinc-500 font-medium">Select up to 4 assets to compare their performance side-by-side.</p>
        </div>
      )}
    </div>
  );
};
