import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Sparkles, Loader2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const BreakingNews = () => {
  const [news, setNews] = useState<{ title: string; summary: string; sentiment: 'up' | 'down' | 'neutral' }[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const prompt = `Provide a rundown of the top 2 major market-moving news events from the last 7 days. 
        For each event, provide:
        1. A short, punchy title.
        2. A 1-sentence summary of WHAT happened and WHY it triggered the market.
        3. The overall market sentiment (up, down, or neutral).
        
        Format the response as a JSON array of objects with keys: title, summary, sentiment.
        Tone: Gen-Z financial expert, direct, no fluff.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const data = JSON.parse(response.text);
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setNews([
          { title: "Fed Holds Rates", summary: "Market neutral as the Fed keeps rates steady to fight sticky inflation.", sentiment: 'neutral' },
          { title: "Tech AI Boom", summary: "NASDAQ up as AI chip demand reaches fever pitch.", sentiment: 'up' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400">
          <Newspaper size={18} />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Market Intelligence</h2>
        </div>
        <Link 
          to="/news" 
          className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors"
        >
          View The Wire <ArrowRight size={12} />
        </Link>
      </div>

      {isLoading ? (
        <div className="h-24 bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500" size={20} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news?.map((item, i) => (
            <Link
              to="/news"
              key={i}
              className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2 relative overflow-hidden group hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <p className="font-black text-sm tracking-tight group-hover:text-emerald-400 transition-colors">{item.title}</p>
                {item.sentiment === 'up' && <TrendingUp size={14} className="text-emerald-400" />}
                {item.sentiment === 'down' && <TrendingDown size={14} className="text-rose-400" />}
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-medium line-clamp-2">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
