import { useState } from "react";
import { BookOpen, ArrowRight, Trophy, Sparkles, Brain, Loader2, CheckCircle2 } from "lucide-react";
import { LESSONS } from "../constants";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { useLearning } from "../context/LearningContext";

export const Learning = () => {
  const { startLesson, completedLessonIds } = useLearning();
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");

  const handleGenerateLesson = async () => {
    if (topic.length < 3) return;
    setIsGenerating(true);
    try {
      const normalizedTopic = topic.trim();
      const generatedLesson = {
        id: `gen-${Date.now()}`,
        title: `Mastering ${normalizedTopic}`,
        description: `Deep dive into ${normalizedTopic} mechanics.`,
        content: [
          {
            type: "info",
            title: "Protocol Overview",
            text: `${normalizedTopic} matters because it changes how investors understand risk, reward, and decision-making under pressure. Start by defining the core concept, where it shows up in markets, and what a beginner usually gets wrong.`
          },
          {
            type: "quiz",
            title: "Tactical Check",
            text: "Test your understanding.",
            question: `Which mindset is best when learning ${normalizedTopic}?`,
            options: [
              "Memorize random terms without context",
              `Understand how ${normalizedTopic} affects decisions and outcomes`,
              "Ignore practical examples"
            ],
            correctAnswer: `Understand how ${normalizedTopic} affects decisions and outcomes`
          },
          {
            type: "info",
            title: "Advanced Logic",
            text: `Once you understand the basics of ${normalizedTopic}, the next step is connecting it to real market behavior, incentives, and trade-offs. Strong investors do not just know the definition — they know when the concept matters and when it does not.`
          }
        ]
      };
      startLesson(generatedLesson);
    } catch (error) {
      console.error("Failed to generate lesson:", error);
      alert("Lesson generation failed. Please try a different sector.");
    } finally {
      setIsGenerating(false);
      setTopic("");
    }
  };

  // Find the first lesson that isn't completed to highlight it
  const currentLessonIndex = LESSONS.findIndex(l => !completedLessonIds.includes(l.id));
  const activeIndex = currentLessonIndex === -1 ? LESSONS.length : currentLessonIndex;

  const totalLessons = LESSONS.length;
  const progressPercent = (completedLessonIds.length / totalLessons) * 100;

  return (
    <div className="space-y-12 pb-32">
      <section className="px-6 pt-12 space-y-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic font-display leading-none text-white">Knowledge Hub</h1>
        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] font-mono italic">Sector Mastery Protocols</p>
      </section>

      {/* AI Lesson Generator */}
      <section className="px-6">
        <div className="premium-card bg-zinc-950 border-purple-500/20 p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 p-4 opacity-[0.03] text-purple-500 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Brain size={300} />
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-[1.5rem] flex items-center justify-center text-purple-400 shadow-inner">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter font-display text-white">Neural Synthesizer</h3>
              <p className="text-[10px] font-black text-purple-500/60 uppercase tracking-[0.4em] font-mono">Custom Intelligence Generation</p>
            </div>
          </div>

          <div className="relative z-10">
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="DESIGNATE TARGET SECTOR (E.G. OPTIONS_ARBITRAGE)"
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-6 px-7 text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-purple-500/50 transition-all pr-20 font-mono placeholder:text-zinc-800 shadow-inner"
            />
            <button
              onClick={handleGenerateLesson}
              disabled={isGenerating || topic.length < 3}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                topic.length >= 3 ? "bg-purple-500 text-white shadow-2xl shadow-purple-500/40 hover:bg-purple-400" : "bg-zinc-800 text-zinc-600"
              )}
            >
              {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} strokeWidth={3} />}
            </button>
          </div>
          
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] text-center font-mono italic relative z-10">Syncing with Deep-Learning Neural Nodes</p>
        </div>
      </section>

      {/* Progress Card */}
      <section className="px-6">
        <div className="premium-card bg-gradient-to-br from-emerald-500 to-emerald-600 border-none p-10 space-y-8 text-black relative overflow-hidden shadow-[0_30px_60px_rgba(16,185,129,0.2)] group">
          <div className="absolute top-[-30%] right-[-15%] p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Trophy size={300} fill="black" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center border border-black/10">
                   <CheckCircle2 size={24} />
                </div>
                <h3 className="text-4xl font-black tracking-tighter italic uppercase font-display leading-none">Operational Status</h3>
              </div>
              <p className="font-black text-[11px] opacity-60 uppercase tracking-[0.2em] max-w-sm italic font-mono">
                {completedLessonIds.length === totalLessons 
                  ? "Sector domination complete. You are a verified Market Legend." 
                  : `Complete all operational modules to achieve Elite Sector status.`}
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="w-full h-4 bg-black/10 rounded-full overflow-hidden p-1 border border-black/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-black rounded-full"
                  transition={{ type: "spring", damping: 20, stiffness: 50 }}
                />
              </div>
              <div className="flex justify-between items-end">
                 <p className="text-[12px] font-black uppercase tracking-[0.4em] text-black">
                    {completedLessonIds.length} / {totalLessons} <span className="opacity-40 italic">MOD_DEPOYED</span>
                 </p>
                 <p className="text-3xl font-black italic font-display">{Math.round(progressPercent)}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 space-y-16 py-12 relative overflow-hidden">
        {/* Connection Line */}
        <div className="absolute left-[3.5rem] top-0 bottom-0 w-2.5 bg-zinc-950 shadow-inner z-0 rounded-full" />
        
        {LESSONS.map((lesson, i) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isCurrent = i === activeIndex;
          const isLocked = i > activeIndex;

          return (
            <motion.div 
              key={lesson.id} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative z-10 flex items-start gap-10 group"
            >
              {/* Status Circle */}
              <div className={cn(
                "w-16 h-16 rounded-[1.75rem] flex items-center justify-center shadow-2xl border-4 border-black z-10 shrink-0 transition-all duration-700 relative",
                isCompleted ? "bg-emerald-500 text-black rotate-0" : 
                isCurrent ? "bg-purple-600 text-white animate-pulse shadow-[0_0_30px_rgba(147,51,234,0.4)]" : 
                "bg-zinc-900 text-zinc-700 grayscale"
              )}>
                {isCompleted ? <CheckCircle2 size={32} strokeWidth={3} /> : 
                 isCurrent ? <BookOpen size={28} /> : 
                 <Trophy size={28} />}
                
                {isCurrent && (
                  <div className="absolute -inset-2 border-2 border-purple-500/50 rounded-[2rem] animate-ping" />
                )}
              </div>

              <button
                disabled={isLocked && !isCompleted}
                onClick={() => startLesson(lesson)}
                className={cn(
                  "premium-card flex-1 text-left group transition-all relative p-10 hover:border-emerald-500/30",
                  isCurrent ? "bg-zinc-900 border-purple-500 shadow-[0_20px_50px_rgba(147,51,234,0.1)]" : 
                  isCompleted ? "bg-zinc-950/50 border-emerald-500/20" : 
                  "bg-zinc-950/20 border-white/5 opacity-40 grayscale"
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-4 -right-2 bg-purple-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] font-mono italic shadow-2xl skew-x-[-12deg]">
                    ACTIVE MISSION
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter font-display italic uppercase leading-none text-white group-hover:text-emerald-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono italic">{lesson.content.length} DATA_GATES</p>
                      {isCompleted && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg">
                           <Sparkles size={10} className="text-emerald-400" />
                           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono">SYNCS_COMPLETE</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                   <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-md italic border-l-2 border-zinc-900 pl-4 group-hover:text-zinc-300 transition-colors">
                     {lesson.description}
                   </p>
                   <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner shrink-0 group-hover:scale-110",
                     isCompleted ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                     isCurrent ? "bg-purple-600 text-white" : 
                     "bg-zinc-900 text-zinc-700"
                   )}>
                     <ArrowRight size={24} strokeWidth={3} />
                   </div>
                </div>
                
                {isLocked && !isCompleted && (
                   <div className="absolute inset-0 bg-black/60 rounded-[3rem] flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="px-6 py-3 bg-black/80 border border-white/5 rounded-full flex items-center gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 font-mono italic">Sector Encrypted</p>
                      </div>
                   </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
};
