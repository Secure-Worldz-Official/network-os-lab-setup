import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onStay: () => void;
  onDiscard: () => void;
  onSaveAndExit: () => void;
}

export function UnsavedChangesModal({
  isOpen,
  onStay,
  onDiscard,
  onSaveAndExit
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md rounded-md bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#101010]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
              <span className="font-heading font-extrabold text-sm text-[#111111] dark:text-white uppercase tracking-wider">
                UNSAVED PREFERENCES
              </span>
            </div>

            <button
              onClick={onStay}
              className="p-1 rounded text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
              You have modified settings that have not yet been written to your persistent profile. Leaving now without saving will reset those changes.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={onStay}
                className="btn-cyber-secondary text-xs py-2 px-3 flex-1 text-center"
              >
                STAY
              </button>
              <button
                onClick={onDiscard}
                className="btn-cyber-secondary text-xs py-2 px-3 flex-1 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:border-rose-500 text-center"
              >
                DISCARD
              </button>
              <button
                onClick={onSaveAndExit}
                className="btn-cyber-primary text-xs py-2 px-3 flex-1 text-center"
              >
                SAVE & EXIT
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
