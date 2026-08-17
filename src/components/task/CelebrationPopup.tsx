import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, X } from 'lucide-react';
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={dismissCelebration}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative max-w-md w-full rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

            <div className="relative p-6 sm:p-8 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', damping: 15, stiffness: 200 }}
                className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
              >
                <Trophy size={28} className="text-emerald-400" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <h2 className="text-xl font-bold text-white tracking-tight">Task Complete</h2>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {currentCelebrationTask.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center justify-center gap-1.5 text-xs text-zinc-500"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>Great work! Keep experimenting.</span>
                <Sparkles size={14} className="text-amber-400" />
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                onClick={dismissCelebration}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors cursor-pointer"
              >
                <X size={13} />
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
