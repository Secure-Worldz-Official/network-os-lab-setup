import { useSettings } from '@/context/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export function ToastNotification() {
  const { toast, hideToast } = useSettings();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-md bg-[#111111] dark:bg-[#FFFFFF] text-white dark:text-[#111111] border border-[#333333] dark:border-[#E5E5E5] shadow-2xl font-mono text-xs select-none max-w-md"
        >
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-white dark:text-[#111111] shrink-0" />}
          {toast.type === 'info' && <Info size={16} className="text-zinc-400 dark:text-zinc-600 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle size={16} className="text-amber-400 dark:text-amber-600 shrink-0" />}

          <span className="font-bold tracking-wide flex-1">{toast.message}</span>

          <button
            onClick={hideToast}
            className="p-1 rounded hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
