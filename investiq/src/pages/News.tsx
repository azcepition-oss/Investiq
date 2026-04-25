import { useState, useEffect } from "react";
import { Newspaper, Sparkles, Loader2, TrendingUp, TrendingDown, ArrowRight, Globe, BarChart3, Clock, X, ExternalLink, Share2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  impactScore?: number;
}

export const News = () => {
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNews([
          { 
            title: "Fed Signals Strategic Resilience", 
            summary: "Powell indicates a cautious but firm stance on target rates amidst inflation volatility.", 
            elaboration: "The Federal Reserve's latest communications suggest a 'wait and see' approach that has the bond market recalibrating. Fixed income yields are seeing increased sensitivity as traders speculate on the first trim of the cycle. Investors should watch the 10-year yield closely as a proxy for broad market risk appetite.\n\nThe consensus remains that while the path is bumpy, the structural integrity of the labor market provides a buffer against a hard landing. However, any surprise in CPI prints could force a pivot that the market isn't fully priced for yet.",
            sentiment: 'neutral',
            source: "Financial Times",
            sourceUrl: "https://www.ft.com",
            category: "Economy",
            impactScore: 8
          },
          { 
            title: "Semiconductor Vertical Integration", 
            summary: "Leading GPU designers announce new proprietary interconnect standards.", 
            elaboration: "The move toward proprietary vertical stacks is seen as a way to lock in ecosystem dominance. By controlling the interconnect, leaders are making it harder for generic competitors to gain traction in hyperscale data centers.\n\nThis trend is bifurcating the market into 'platform owners' and 'component sellers.' Valuation multiples for vertically integrated players are reaching record premiums as they capture more of the AI value chain.",
            sentiment: 'up',
            source: "Bloomberg",
            sourceUrl: "https://www.bloomberg.com",
            category: "Tech",
            impactScore: 9
          },
          { 
            title: "Global Liquidity Index Hits 12-Month High", 
            summary: "Central bank balance sheets expand as regional stability measures take effect.", 
            elaboration: "Increased liquidity is providing a tailwind for risk assets across the board. Historically, peaks in global liquidity correlate strongly with mid-cycle rallies in equities and commodities.\n\nThe challenge for the second half will be the withdrawal of these support measures as credit conditions stabilize. For now, the 'wall of worry' is being climbed by a surplus of capital looking for yield in high-quality growth segments.",
            sentiment: 'up',
            source: "CNBC",
            sourceUrl: "https://www.cnbc.com",
            category: "Investment",
            impactScore: 7
          }
        ]);
      } catch (error: any) {
        console.warn("Failed to initialize news feed, using safe fallback...", error);
        setNews([
          { 
            title: "Fed Signals Strategic Resilience", 
            summary: "Powell indicates a cautious but firm stance on target rates amidst inflation volatility.", 
            elaboration: "The Federal Reserve's latest communications suggest a 'wait and see' approach that has the bond market recalibrating. Fixed income yields are seeing increased sensitivity as traders speculate on the first trim of the cycle. Investors should watch the 10-year yield closely as a proxy for broad market risk appetite.\n\nThe consensus remains that while the path is bumpy, the structural integrity of the labor market provides a buffer against a hard landing. However, any surprise in CPI prints could force a pivot that the market isn't fully priced for yet.",
            sentiment: 'neutral',
            source: "Financial Times",
            sourceUrl: "https://www.ft.com",
            category: "Economy",
            impactScore: 8
          },
          { 
            title: "Semiconductor Vertical Integration", 
            summary: "Leading GPU designers announce new proprietary interconnect standards.", 
            elaboration: "The move toward proprietary vertical stacks is seen as a way to lock in ecosystem dominance. By controlling the interconnect, leaders are making it harder for generic competitors to gain traction in hyperscale data centers.\n\nThis trend is bifurcating the market into 'platform owners' and 'component sellers.' Valuation multiples for vertically integrated players are reaching record premiums as they capture more of the AI value chain.",
            sentiment: 'up',
            source: "Bloomberg",
            sourceUrl: "https://www.bloomberg.com",
            category: "Tech",
            impactScore: 9
          },
          { 
            title: "Global Liquidity Index Hits 12-Month High", 
            summary: "Central bank balance sheets expand as regional stability measures take effect.", 
            elaboration: "Increased liquidity is providing a tailwind for risk assets across the board. Historically, peaks in global liquidity correlate strongly with mid-cycle rallies in equities and commodities.\n\nThe challenge for the second half will be the withdrawal of these support measures as credit conditions stabilize. For now, the 'wall of worry' is being climbed by a surplus of capital looking for yield in high-quality growth segments.",
            sentiment: 'up',
            source: "CNBC",
            sourceUrl: "https://www.cnbc.com",
            category: "Investment",
            impactScore: 7
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="space-y-12 pb-32">
      <header className="px-6 pt-12 space-y-4">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
             <h1 className="text-5xl font-black tracking-tighter uppercase italic font-display leading-none text-white">The Wire</h1>
             <div className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 font-mono">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                Live Intelligence Stream
             </div>
           </div>
           <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-400">
              <Info size={20} />
           </div>
        </div>
      </header>

      {isLoading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse rounded-full" />
            <div className="w-20 h-20 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin relative z-10" />
            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 animate-pulse" size={24} />
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse font-mono">Decrypting Global Intel...</p>
        </div>
      ) : (
        <div className="px-6 grid grid-cols-1 gap-6">
          {news?.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              onClick={() => setSelectedNews(item)}
              className="premium-card bg-zinc-950/50 border-white/5 p-6 cursor-pointer hover:border-emerald-500/30 transition-all group active:scale-[0.98] relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 p-4 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700 text-white">
                <Globe size={160} />
              </div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner group-hover:border-emerald-500/20 transition-colors">
                      <Newspaper size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-wider font-mono italic">{item.source}</p>
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">
                        Live Analysis
                      </p>
                   </div>
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] font-mono shadow-sm",
                  item.sentiment === 'up' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                  item.sentiment === 'down' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-zinc-800 text-zinc-400 border border-white/5"
                )}>
                  {item.sentiment}
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-black tracking-tight font-display italic uppercase leading-[1.1] text-white group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-3 group-hover:text-zinc-300 transition-colors">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-8 relative z-10">
                <div className="flex gap-3">
                  <div className="px-3 py-1 glass-panel border-white/5 bg-white/5 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono">
                    #{item.category}
                  </div>
                  {item.impactScore && (
                    <div className="px-3 py-1 glass-panel border-amber-500/10 bg-amber-500/5 rounded-lg text-[9px] font-black text-amber-500 uppercase tracking-widest font-mono italic">
                      SCORE: {item.impactScore}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] font-mono group-hover:translate-x-1 transition-transform">
                   <span>Unlock Intel</span>
                   <ArrowRight size={14} className="text-emerald-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opaacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opaacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950 relative z-20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] font-mono italic">Sector Intel Summary</p>
                    <p className="text-white font-black text-sm uppercase tracking-[0.1em] font-mono mt-1">{selectedNews.source}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-[0.3em] font-mono">LIVE_FEED</span>
                    <span className="px-4 py-1.5 bg-zinc-900 border border-white/5 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] font-mono">#{selectedNews.category}</span>
                  </div>
                  <h2 className="text-5xl font-black italic uppercase leading-[0.9] tracking-tighter text-white font-display">
                    {selectedNews.title}
                  </h2>
                </div>

                <div className="p-8 glass-panel border-emerald-500/20 bg-emerald-500/5 rounded-[3rem] space-y-4 shadow-inner">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <Info size={18} className="text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] font-mono italic">Primary Intelligence Brief</p>
                  </div>
                  <p className="text-xl font-medium text-white italic leading-relaxed tracking-tight">
                    "{selectedNews.summary}"
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <BarChart3 size={20} className="text-emerald-500" />
                    <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] font-mono leading-none">Macro Protocol & Deep Logic</p>
                  </div>
                  <div className="text-zinc-400 text-lg leading-relaxed font-medium space-y-6 italic">
                    {selectedNews.elaboration.split('\n\n').map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pb-6">
                   <div className="p-6 bg-zinc-900 border border-white/5 rounded-[2.5rem] shadow-inner">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2 font-mono italic">Target Sentiment</p>
                      <p className={cn(
                        "text-3xl font-black uppercase font-display italic tracking-tight",
                        selectedNews.sentiment === 'up' ? "text-emerald-400" :
                        selectedNews.sentiment === 'down' ? "text-rose-400" : "text-zinc-500"
                      )}>{selectedNews.sentiment}</p>
                   </div>
                   <div className="p-6 bg-zinc-900 border border-white/5 rounded-[2.5rem] shadow-inner">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2 font-mono italic">Market Impact</p>
                      <p className="text-3xl font-black text-amber-500 font-display italic tracking-tight">LEVEL_{selectedNews.impactScore}/10</p>
                    </div>
                </div>
              </div>

              <div className="p-10 bg-zinc-900/50 border-t border-white/5 flex flex-col gap-4 relative z-20">
                <a 
                  href={selectedNews.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-6 interactive-button button-primary shadow-emerald-500/20 text-sm"
                >
                  Retrieve Original Article <ExternalLink size={18} strokeWidth={3} />
                </a>
                <button className="w-full py-4 text-zinc-600 hover:text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all font-mono italic">
                  <Share2 size={16} /> Broadcast Intel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
