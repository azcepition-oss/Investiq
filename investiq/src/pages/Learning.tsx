import { useState } from "react";
import { BookOpen, CheckCircle2, ArrowRight, X, Trophy, Sparkles } from "lucide-react";
import { LESSONS, Lesson } from "../constants";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const Learning = () => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleNext = () => {
    if (activeLesson && currentStep < activeLesson.content.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowFeedback(false);
    } else {
      setActiveLesson(null);
      setCurrentStep(0);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedOption(option);
    const step = activeLesson?.content[currentStep];
    if (step?.type === 'quiz') {
      const correct = option === step.correctAnswer;
      setIsCorrect(correct);
      setShowFeedback(true);
    }
  };

  if (activeLesson) {
    const step = activeLesson.content[currentStep];
    const progress = ((currentStep + 1) / activeLesson.content.length) * 100;

    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col">
        {/* Header / Progress */}
        <div className="p-6 flex items-center gap-4">
          <button onClick={() => setActiveLesson(null)} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
            <Sparkles size={16} />
            <span>{currentStep + 1}/{activeLesson.content.length}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-8"
            >
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-black tracking-tight text-white">{step.title}</h2>
                <p className="text-zinc-400 text-lg leading-relaxed">{step.text}</p>
              </div>

              {step.type === 'quiz' && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center mb-4">
                    {step.question}
                  </p>
                  {step.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      disabled={showFeedback}
                      className={cn(
                        "w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group",
                        selectedOption === option 
                          ? isCorrect 
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                            : "bg-rose-500/20 border-rose-500 text-rose-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      )}
                    >
                      {option}
                      {selectedOption === option && (
                        isCorrect ? <CheckCircle2 size={20} /> : <X size={20} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer / Action */}
        <div className={cn(
          "p-8 border-t transition-colors duration-500",
          showFeedback 
            ? isCorrect ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
            : "bg-black border-zinc-900"
        )}>
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="hidden sm:block">
              {showFeedback && (
                <p className={cn("font-black text-xl", isCorrect ? "text-emerald-400" : "text-rose-400")}>
                  {isCorrect ? "AMAZING! 🎉" : "NOT QUITE... 🧐"}
                </p>
              )}
            </div>
            <button
              onClick={handleNext}
              disabled={step.type === 'quiz' && !showFeedback}
              className={cn(
                "w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all",
                (step.type === 'info' || showFeedback)
                  ? isCorrect === false ? "bg-rose-500 text-white" : "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              )}
            >
              {currentStep === activeLesson.content.length - 1 ? "FINISH" : "CONTINUE"}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <section className="px-4 pt-8 space-y-2">
        <h1 className="text-4xl font-black tracking-tight uppercase italic font-display">Learn</h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">The Path to Legend</p>
      </section>

      {/* Daily Quest Card */}
      <section className="px-4">
        <div className="game-card bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 p-6 space-y-4 text-black relative overflow-hidden shadow-[0_15px_30px_rgba(16,185,129,0.3)]">
          <div className="absolute top-[-20%] right-[-10%] p-4 opacity-15 rotate-12">
            <Trophy size={160} fill="black" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} fill="currentColor" />
              <h3 className="text-2xl font-black tracking-tight italic uppercase">Daily Quest</h3>
            </div>
            <p className="font-black text-xs opacity-90 uppercase tracking-tight max-w-[200px]">Finish 3 Lessons to unlock "Market Master" status!</p>
            <div className="mt-6 space-y-2">
              <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden border border-black/10">
                <div className="w-1/3 h-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-full transition-all duration-1000" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black/60">1/3 Completed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 space-y-10 py-6 relative">
        {/* Connection Line */}
        <div className="absolute left-10 top-0 bottom-0 w-1.5 bg-zinc-900 z-0" />
        
        {LESSONS.map((lesson, i) => (
          <div key={lesson.id} className="relative z-10 flex items-start gap-6">
            {/* Lock/Icon Circle */}
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-black z-10 shrink-0",
              i === 0 ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-600"
            )}>
              {i === 0 ? <BookOpen size={20} fill="currentColor" /> : <Trophy size={20} />}
            </div>

            <button
              id={i === 0 ? "first-lesson-card" : undefined}
              onClick={() => {
                setActiveLesson(lesson);
                setCurrentStep(0);
                setShowFeedback(false);
              }}
              className={cn(
                "game-card flex-1 text-left group transition-all active:scale-95",
                i === 0 ? "border-emerald-500/30" : "opacity-60 grayscale-[0.5]"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-black tracking-tight font-display italic uppercase mb-1">{lesson.title}</h3>
                {i === 0 && <span className="bg-emerald-400 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase">Active</span>}
              </div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-4">{lesson.content.length} Challenges</p>
              
              <div className="flex items-center justify-between">
                 <p className="text-[10px] text-zinc-400 font-bold max-w-[150px] leading-tight line-clamp-2">
                   {lesson.description}
                 </p>
                 <div className={cn(
                   "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-inner",
                   i === 0 ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-600"
                 )}>
                   <ArrowRight size={18} />
                 </div>
              </div>
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};
