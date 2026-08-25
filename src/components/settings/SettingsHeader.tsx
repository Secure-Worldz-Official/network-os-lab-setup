import { useSettings } from '@/context/SettingsContext';
import { Sliders, Save, RotateCcw, Check } from 'lucide-react';

export function SettingsHeader() {
  const { isDirty, saveAll, discardAll } = useSettings();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6 font-mono select-none">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest">
            <Sliders size={13} className="text-[#111111] dark:text-white" />
            <span>CONTROL CENTER</span>
          </div>

          <span className="text-[#CCCCCC] dark:text-[#333333]">|</span>

          {/* Status Indicator */}
          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              UNSAVED CHANGES
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Check size={11} className="stroke-[3]" />
              ALL CHANGES SAVED
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase leading-none">
          SETTINGS
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] dark:text-[#B5B5B5] max-w-2xl font-sans leading-relaxed">
          Manage your CyberPath experience, appearance, account, privacy and lab preferences.
        </p>
      </div>

      {/* Quick Action Buttons if dirty */}
      <div className="flex items-center gap-2.5 shrink-0">
        {isDirty && (
          <button
            onClick={discardAll}
            className="btn-cyber-secondary text-xs py-2 px-3.5"
            title="Discard pending unsaved changes"
          >
            <RotateCcw size={13} />
            <span>DISCARD</span>
          </button>
        )}

        <button
          onClick={saveAll}
          className="btn-cyber-primary text-xs py-2 px-4 shadow-sm"
          title="Save all configured preferences to storage"
        >
          <Save size={13} />
          <span>SAVE CHANGES</span>
        </button>
      </div>
    </div>
  );
}
