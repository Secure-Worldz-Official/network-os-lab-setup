import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, ShieldCheck } from 'lucide-react';
import { useTask } from './TaskContext';

export function CelebrationPopup() {
  const { showCelebration, currentCelebrationTask, dismissCelebration } = useTask();

  return (
    <AnimatePresence>
      {showCelebration && currentCelebrationTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={dismissCelebration}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 350 }}
            className="relative max-w-md w-full rounded-lg border border-zinc-800 bg-[#050505] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-zinc-800 via-white to-zinc-800" />

            <div className="p-6 sm:p-8 text-center space-y-5 font-mono">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 15, stiffness: 200 }}
                className="mx-auto w-14 h-14 rounded-full bg-zinc-900 border border-white/60 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <Trophy size={26} className="text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">
                  MISSION ACCOMPLISHED // STATUS: VERIFIED
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight font-heading">
                  TASK COMPLETE
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {currentCelebrationTask.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-white/40 bg-zinc-900 text-white font-bold text-sm tracking-wider shadow-[0_0_12px_rgba(255,255,255,0.15)]"
              >
                <ShieldCheck size={14} className="text-white" />
                <span>+250 XP GAINED</span>
              </motion.div>

              <div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={dismissCelebration}
                  className="w-full btn-cyber-primary text-xs uppercase"
                >
                  <X size={13} />
                  CONTINUE MISSION
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
