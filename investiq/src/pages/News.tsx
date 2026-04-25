import { useState, useEffect } from "react";
import { Newspaper, Sparkles, Loader2, TrendingUp, TrendingDown, ArrowRight, Globe, BarChart3, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";


interface NewsItem {
  title: string;
  summary: string;
  elaboration: string;
  sentiment: 'up' | 'down' | 'neutral';
  source: string;
  sourceUrl: string;
  category: string;
}

export const News = () => {
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNews([
          { 
            title: "Fed Signals Rate Pause", 
            summary: "Market neutral as the Fed keeps rates steady to fight sticky inflation.", 
            elaboration: "While the pause was expected, the 'higher for longer' rhetoric is keeping investors on edge. This suggests that borrowing costs won't drop anytime soon.",
            sentiment: 'neutral',
            source: "CNBC",
            sourceUrl: "https://www.cnbc.com",
            category: "Economy"
          },
          { 
            title: "AI Chip Demand Surges", 
            summary: "NASDAQ up as AI chip demand reaches fever pitch.", 
            elaboration: "NVIDIA and AMD are seeing record orders as every tech giant races to build out AI infrastructure. This is driving a massive rotation into tech stocks.",
            sentiment: 'up',
            source: "Bloomberg",
            sourceUrl: "https://www.bloomberg.com",
            category: "Tech"
          }
        ]);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setNews([
          { 
            title: "Fed Signals Rate Pause", 
            summary: "Market neutral as the Fed keeps rates steady to fight sticky inflation.", 
            elaboration: "While the pause was expected, the 'higher for longer' rhetoric is keeping investors on edge. This suggests that borrowing costs won't drop anytime soon.",
            sentiment: 'neutral',
            source: "CNBC",
            sourceUrl: "https://www.cnbc.com",
            category: "Economy"
          },
          { 
            title: "AI Chip Demand Surges", 
            summary: "NASDAQ up as AI chip demand reaches fever pitch.", 
            elaboration: "NVIDIA and AMD are seeing record orders as every tech giant races to build out AI infrastructure. This is driving a massive rotation into tech stocks.",
            sentiment: 'up',
            source: "Bloomberg",
            sourceUrl: "https://www.bloomberg.com",
            category: "Tech"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <header className="px-4 pt-8 space-y-2">
        <h1 className="text-4xl font-black tracking-tight uppercase italic font-display">Market News</h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Live Intelligence</p>
      </header>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Scanning the Net...</p>
        </div>
      ) : (
        <div className="px-4 space-y-6">
          {news?.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={i}
              className="game-card space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-emerald-500">
                      <Newspaper size={16} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tight">{item.source}</p>
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Global • {i + 2}m ago</p>
                   </div>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  item.sentiment === 'up' ? "bg-emerald-500/10 text-emerald-500" : 
                  item.sentiment === 'down' ? "bg-rose-500/10 text-rose-500" : "bg-zinc-800 text-zinc-400"
                )}>
                  {item.sentiment}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight font-display italic uppercase leading-none">{item.title}</h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {item.category && (
                <div className="flex gap-2">
                   <span className="px-2 py-0.5 bg-zinc-800 rounded text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                     #{item.category}
                   </span>
                </div>
              )}

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                 <button className="flex items-center gap-2 text-zinc-600 hover:text-emerald-500 transition-colors">
                    <BarChart3 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Analyze</span>
                 </button>
                 <a 
                   href={item.sourceUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400"
                 >
                    <ArrowRight size={16} />
                 </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
