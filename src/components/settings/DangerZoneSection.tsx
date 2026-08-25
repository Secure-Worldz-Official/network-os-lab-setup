import { useState } from 'react';
import { useCyberPath } from '@/context/CyberPathContext';
import { useSettings } from '@/context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, LogOut, RotateCcw, Trash2 } from 'lucide-react';
import { DangerConfirmModal, type DangerActionType } from './DangerConfirmModal';

export function DangerZoneSection() {
  const { resetAllProgress } = useCyberPath();
  const { showToast } = useSettings();
  const navigate = useNavigate();

  const [activeModalType, setActiveModalType] = useState<DangerActionType | null>(null);

  const handleConfirmAction = () => {
    if (activeModalType === 'sign_out') {
      showToast('SIGNED OUT OF SESSION');
      setActiveModalType(null);
      navigate('/landing');
    } else if (activeModalType === 'reset_progress') {
      resetAllProgress();
      showToast('ALL LEARNING PROGRESS HAS BEEN WIPED', 'warning');
      setActiveModalType(null);
    } else if (activeModalType === 'delete_account') {
      resetAllProgress();
      localStorage.clear();
      showToast('ACCOUNT DELETED SUCCESSFULLY', 'warning');
      setActiveModalType(null);
      navigate('/landing');
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Danger Zone Container */}
      <div className="p-6 rounded-md border border-rose-500/40 bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-rose-500/20 pb-3">
          <div className="w-7 h-7 rounded bg-rose-600 text-white flex items-center justify-center">
            <AlertTriangle size={15} />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider font-mono">
              RESTRICTED DANGER ZONE
            </h3>
            <p className="text-[11px] text-[#666666] dark:text-[#888888] font-sans">
              Destructive actions regarding authentication sessions, progress caches, and account records.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {/* Sign Out */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-[#111111] dark:text-white uppercase text-[11px] block">
                TERMINATE CURRENT SESSION (SIGN OUT)
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Sign out of the current operative browser workspace and return to the main landing portal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModalType('sign_out')}
              className="btn-cyber-secondary text-xs py-2 px-4 shrink-0 text-[#111111] dark:text-white"
            >
              <LogOut size={13} />
              <span>SIGN OUT</span>
            </button>
          </div>

          {/* Reset Learning Progress */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[11px] block">
                RESET EDUCATIONAL PROGRESS & XP
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Wipe all completed room tasks, flags, unlocked badges, streaks, and accumulated experience points.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModalType('reset_progress')}
              className="btn-cyber-secondary text-xs py-2 px-4 shrink-0 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:border-amber-500"
            >
              <RotateCcw size={13} />
              <span>RESET PROGRESS</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-4 rounded bg-rose-500/5 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[11px] block">
                PERMANENTLY DELETE OPERATIVE ACCOUNT
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Irrevocably erase all profile credentials, certifications, telemetry logs, and custom preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModalType('delete_account')}
              className="btn-cyber-primary text-xs py-2 px-4 shrink-0 bg-rose-600 hover:bg-rose-700 text-white border-rose-600 hover:border-rose-700"
            >
              <Trash2 size={13} />
              <span>DELETE ACCOUNT</span>
            </button>
          </div>
        </div>
      </div>

      <DangerConfirmModal
        isOpen={activeModalType !== null}
        type={activeModalType}
        onClose={() => setActiveModalType(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
