import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, User, Bot, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import { chatWithAI, getAiCreditStatus } from "../services/api";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const getErrorMessage = (error: any) => {
  const localCode = error?.code || error?.message;
  if (localCode === "DAILY_AI_LIMIT_REACHED") {
    return "You’ve used all 10 AI mentor credits for today on this device. Come back tomorrow for a fresh reset.";
  }

  const apiError = error?.response?.data?.error;
  const apiDetails = error?.response?.data?.details || "";
  const message = `${apiError || ""} ${apiDetails}`.trim();

  if (/credits are depleted/i.test(message)) {
    return "The AI mentor is connected, but the Google AI Studio credits for this API key are depleted. Top up billing or swap in a funded key in Netlify.";
  }

  if (/API key/i.test(message) || /401|403|INVALID_ARGUMENT/i.test(message)) {
    return "The AI mentor key looks invalid or unauthorized. Re-check the Netlify GEMINI_API_KEY value.";
  }

  if (apiError) {
    return `AI mentor error: ${apiError}`;
  }

  return "My bad, something went wrong. Try again in a sec!";
};

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey — I’m your Market Mentor. Ask me a specific question about a stock, a market move, or a finance concept and I’ll break it down clearly." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [creditStatus, setCreditStatus] = useState(getAiCreditStatus());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const refreshCredits = () => setCreditStatus(getAiCreditStatus());

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, { role: 'user', content: userMessage }]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: getErrorMessage(error) }]);
    } finally {
      refreshCredits();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black">
      <header className="p-4 border-b border-zinc-800 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles size={20} />
            <h1 className="font-black uppercase tracking-widest text-sm">Market Mentor AI</h1>
          </div>
          <div className="px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black uppercase tracking-widest text-emerald-400 whitespace-nowrap">
            {creditStatus.remaining}/{creditStatus.limit} today
          </div>
        </div>
      </header>

      <div className="px-4 pt-3">
        <p className="text-[11px] text-zinc-500 font-medium">
          10 AI credits per day on this device. Ask specific questions like “Why is NVDA up today?” or “Explain options in simple terms.”
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-emerald-500 text-black" : "bg-zinc-800 text-emerald-400"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-100" 
                : "bg-zinc-900 border border-zinc-800 text-zinc-300"
            )}>
              <Markdown components={{
                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline" />,
                p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />
              }}>
                {msg.content}
              </Markdown>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 mr-auto"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 italic text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Mentor is thinking...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-zinc-800 bg-black/50 backdrop-blur-md">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Ask a specific investing question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || creditStatus.remaining <= 0}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
