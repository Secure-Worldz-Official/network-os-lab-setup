import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { PLATFORM_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const categories = ['Navigation', 'Actions', 'Terminal'] as const;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl rounded-md bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#101010]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center">
                <Keyboard size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-sm text-[#111111] dark:text-white uppercase tracking-wider">
                  KEYBOARD SHORTCUTS CHEAT SHEET
                </span>
                <span className="text-[9px] text-[#888888] dark:text-[#777777] uppercase tracking-widest">
                  PRESS ANYTIME ACROSS THE PLATFORM
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#111111] dark:text-white">
            {categories.map((cat) => {
              const list = PLATFORM_SHORTCUTS.filter((s) => s.category === cat);
              return (
                <div key={cat} className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">
                    // {cat.toUpperCase()} SHORTCUTS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {list.map((item) => (
                      <div
                        key={item.combo}
                        className="p-2.5 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between gap-3"
                      >
                        <div className="flex flex-col truncate">
                          <span className="font-bold text-[11px] text-[#111111] dark:text-white truncate">
                            {item.label}
                          </span>
                          <span className="text-[9px] text-[#666666] dark:text-[#888888] truncate font-sans">
                            {item.description}
                          </span>
                        </div>
                        <kbd className="px-2 py-1 rounded bg-white dark:bg-[#181818] border border-[#CCCCCC] dark:border-[#333333] text-[10px] font-mono font-bold shadow-xs text-[#111111] dark:text-white shrink-0">
                          {item.combo}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#101010] flex justify-between items-center text-[10px] text-[#888888] dark:text-[#777777]">
            <span>Press <kbd className="font-bold bg-white dark:bg-black px-1.5 py-0.5 rounded border border-[#CCC] dark:border-[#333]">Esc</kbd> or click outside to dismiss</span>
            <button onClick={onClose} className="btn-cyber-primary text-xs py-1.5 px-4">
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
