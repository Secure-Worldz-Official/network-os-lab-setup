import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, RotateCcw, LogOut } from 'lucide-react';

export type DangerActionType = 'sign_out' | 'reset_progress' | 'delete_account';

interface DangerConfirmModalProps {
  isOpen: boolean;
  type: DangerActionType | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DangerConfirmModal({
  isOpen,
  type,
  onClose,
  onConfirm
}: DangerConfirmModalProps) {
  const [deleteInput, setDeleteInput] = useState('');

  if (!isOpen || !type) return null;

  const isDeleteAccount = type === 'delete_account';
  const isDeleteDisabled = isDeleteAccount && deleteInput.trim() !== 'DELETE';

  const handleClose = () => {
    setDeleteInput('');
    onClose();
  };

  const handleExecute = () => {
    if (isDeleteDisabled) return;
    onConfirm();
    setDeleteInput('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md rounded-md bg-white dark:bg-[#141414] border border-rose-500/40 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-rose-500/20 bg-rose-500/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-rose-600 text-white flex items-center justify-center">
                {type === 'sign_out' && <LogOut size={15} />}
                {type === 'reset_progress' && <RotateCcw size={15} />}
                {type === 'delete_account' && <Trash2 size={15} />}
              </div>
              <span className="font-heading font-extrabold text-sm text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                {type === 'sign_out' && 'CONFIRM SIGN OUT'}
                {type === 'reset_progress' && 'RESET LEARNING PROGRESS?'}
                {type === 'delete_account' && 'PERMANENTLY DELETE ACCOUNT?'}
              </span>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded text-rose-600/70 hover:text-rose-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs text-[#111111] dark:text-white">
            {type === 'sign_out' && (
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                Are you sure you want to end your current session? You will be redirected to the CyberPath landing portal.
              </p>
            )}

            {type === 'reset_progress' && (
              <div className="space-y-3">
                <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                  This will reset your learning progress, completed tasks, room progress and related learning statistics. Your account profile will remain intact.
                </p>
                <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-[11px] font-mono">
                  ⚠ IRREVERSIBLE ACTION: XP, level milestones, streaks, and room marks will be wiped.
                </div>
              </div>
            )}

            {type === 'delete_account' && (
              <div className="space-y-3">
                <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                  This is a permanent destructive action. All certifications, lab history, streaks, telemetry, and credentials will be permanently erased from this device.
                </p>

                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">
                    TYPE <code className="bg-rose-500/20 px-1 py-0.5 rounded text-rose-700 dark:text-rose-300">DELETE</code> TO CONFIRM:
                  </label>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-rose-500/40 rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-rose-600 font-mono font-bold"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="btn-cyber-secondary text-xs py-2 px-4 flex-1"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleExecute}
                disabled={isDeleteDisabled}
                className="btn-cyber-primary text-xs py-2 px-4 flex-1 bg-rose-600 hover:bg-rose-700 text-white border-rose-600 hover:border-rose-700 disabled:opacity-40 disabled:pointer-events-none"
              >
                {type === 'sign_out' && 'SIGN OUT'}
                {type === 'reset_progress' && 'RESET PROGRESS'}
                {type === 'delete_account' && 'DELETE ACCOUNT'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
