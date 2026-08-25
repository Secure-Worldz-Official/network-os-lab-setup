import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Check, AlertCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { showToast } = useSettings();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      setError('Please enter your current password.');
      return;
    }
    if (newPass.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }

    setError('');
    showToast('PASSWORD UPDATED SUCCESSFULLY');
    onClose();
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

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
              <div className="w-7 h-7 rounded bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center">
                <Lock size={15} />
              </div>
              <span className="font-heading font-extrabold text-sm text-[#111111] dark:text-white uppercase tracking-wider">
                CHANGE SECURITY PASSWORD
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-[#111111] dark:text-white">
            {error && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-sans flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                CURRENT PASSWORD
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                NEW PASSWORD
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                CONFIRM NEW PASSWORD
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
              />
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-cyber-secondary text-xs py-2 px-4 flex-1"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="btn-cyber-primary text-xs py-2 px-4 flex-1"
              >
                <Check size={13} />
                <span>UPDATE</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
