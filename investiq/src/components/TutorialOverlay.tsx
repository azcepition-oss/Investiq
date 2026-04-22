import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from '../context/TutorialContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, X, MousePointer2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const TutorialOverlay = () => {
  const { isActive, currentStep, steps, nextStep, skipTutorial } = useTutorial();
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isActive) {
      const step = steps[currentStep];
      
      // If the step requires a specific path, navigate there
      if (step.path) {
        // Only navigate if we aren't already there (to avoid re-renders)
        // Note: Simple check, might need refine if query params are used
        if (window.location.pathname !== step.path) {
          navigate(step.path);
        }
      }

      // Wait for navigation and rendering before calculating rect
      const timer = setTimeout(() => {
        const element = document.getElementById(step.targetId);
        if (element) {
          setHighlightRect(element.getBoundingClientRect());
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, steps, navigate]);

  if (!isActive) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {/* Dark Blur Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      {/* Spotlight Effect */}
      {highlightRect && (
        <>
          <motion.div
            animate={{
              x: highlightRect.x - 8,
              y: highlightRect.y - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bg-white/10 border-2 border-emerald-400 rounded-2xl shadow-[0_0_50px_rgba(52,211,153,0.4)] pointer-events-auto"
          />
          {/* Simulated Cursor/Press */}
          <motion.div
            animate={{
              x: highlightRect.x + highlightRect.width / 2,
              y: highlightRect.y + highlightRect.height / 2,
              scale: [1, 0.8, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
            className="absolute z-[210] text-emerald-400"
          >
            <div className="relative">
               <MousePointer2 size={32} className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <motion.div 
                 animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
                 className="absolute top-0 right-0 w-8 h-8 border-2 border-emerald-400 rounded-full"
               />
            </div>
          </motion.div>
        </>
      )}

      {/* AI Avatar & Guidance Bubble */}
      <div className={cn(
        "absolute left-0 right-0 px-6 flex flex-col items-center justify-center transition-all duration-500",
        currentStepData.position === 'top' ? "top-20" : 
        currentStepData.position === 'bottom' ? "bottom-32" : "top-1/2 -translate-y-1/2"
      )}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative w-full max-w-sm pointer-events-auto"
        >
          {/* AI Avatar */}
          <div className="flex justify-center mb-[-24px] relative z-10">
            <div className="w-16 h-16 bg-zinc-900 border-2 border-emerald-400 rounded-full p-1 shadow-2xl">
              <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center text-black overflow-hidden relative">
                <img 
                   src="https://picsum.photos/seed/ai-guide/100/100" 
                   className="w-full h-full object-cover" 
                   alt="AI Guide" 
                />
                <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay" />
              </div>
            </div>
          </div>

          {/* Speech Bubble */}
          <div className="bg-zinc-900 border-2 border-emerald-500/30 rounded-[2.5rem] p-8 pt-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Sparkles size={100} className="text-emerald-400" />
             </div>
             
             <div className="space-y-4 text-center">
                <h3 className="text-xl font-black italic uppercase font-display text-emerald-400 tracking-tight">
                  {currentStepData.title}
                </h3>
                <p className="text-sm font-medium text-zinc-300 leading-relaxed">
                  {currentStepData.message}
                </p>
             </div>

             <div className="flex items-center gap-3 mt-8">
                <button 
                  onClick={skipTutorial}
                  className="flex-1 py-3 px-4 bg-zinc-800 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-zinc-300 transition-all"
                >
                  Skip
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-[2] py-4 px-6 bg-emerald-500 text-black rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)] active:scale-95 transition-all"
                >
                  {currentStep === steps.length - 1 ? 'Start Trading' : 'Next Step'}
                  <ArrowRight size={16} />
                </button>
             </div>

             <div className="flex justify-center gap-1 mt-6">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === currentStep ? "w-6 bg-emerald-500" : "w-2 bg-zinc-800"
                    )}
                  />
                ))}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
