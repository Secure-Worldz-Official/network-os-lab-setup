import { useState } from 'react';
import { useCyberPath } from '@/context/CyberPathContext';
import { Shield, RefreshCw, Save, Trash2, Sliders, Check } from 'lucide-react';

export function SettingsPage() {
  const { username, setUsername, resetAllProgress } = useCyberPath();
  const [nameInput, setNameInput] = useState<string>(username);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleReset = () => {
    if (window.confirm('WARNING: Erase all XP, levels, streak status, completed rooms, challenges, and badges? This action cannot be undone.')) {
      resetAllProgress();
      setNameInput('Cyber Explorer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none font-mono">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-6 space-y-1">
        <div className="text-[10px] uppercase font-bold text-[#888888] tracking-widest flex items-center gap-1.5">
          <Sliders size={14} className="text-[#111111]" />
          <span>PLATFORM CONFIGURATION</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-heading tracking-tight uppercase">
          SETTINGS CONTROL PANEL
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] max-w-xl leading-relaxed font-sans">
          Configure profile metrics, customize interface behaviors, or reset local persistent progress storage.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-md border border-[#E5E5E5] bg-white space-y-4 shadow-sm">
          <h3 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
            <Sliders size={14} className="text-[#111111]" />
            OPERATIVE HANDLE CONFIGURATION
          </h3>

          <div className="space-y-3.5 max-w-md">
            <div className="space-y-2">
              <label className="text-[10px] text-[#888888] font-bold uppercase block">Handle / Username</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 bg-[#F7F7F7] border border-[#E5E5E5] rounded px-3 py-2 text-xs text-[#111111] outline-none focus:border-[#111111] font-mono"
                />
                <button onClick={handleSave} className="btn-cyber-primary text-xs py-2 px-4">
                  {saved ? <Check size={13} /> : <Save size={13} />}
                  <span>SAVE</span>
                </button>
              </div>
              {saved && (
                <span className="text-[10px] text-emerald-700 block font-bold">
                  ✓ PROFILE HANDLE UPDATED.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* System Theme Info */}
        <div className="p-6 rounded-md border border-[#E5E5E5] bg-white space-y-4 shadow-sm">
          <h3 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
            <Shield size={14} className="text-[#111111]" />
            CYBERPATH VISUAL IDENTITY
          </h3>

          <div className="space-y-2 text-xs text-[#555555] font-sans">
            <p>
              CYBERPATH visual identity: <strong>WHITE BACKGROUND + BLACK TEXT + LIGHT GRAY UI</strong>.
            </p>
            <div className="p-3 rounded border border-[#E5E5E5] bg-[#F7F7F7] font-mono text-[10px] text-[#111111] font-bold">
              COLOR_MODE: WHITE_CANVAS // BLACK_TYPOGRAPHY // DARK_TECHNICAL_TERMINALS
            </div>
          </div>
        </div>

        {/* Data resetting */}
        <div className="p-6 rounded-md border border-[#E5E5E5] bg-white space-y-4 shadow-sm">
          <h3 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
            <Trash2 size={14} className="text-[#111111]" />
            CLEAR STORAGE CACHE
          </h3>

          <p className="text-xs text-[#555555] font-sans leading-relaxed max-w-xl">
            Resetting clears the platform progress storage cache. All credentials, streaks, experience milestones, room marks, and challenges logs will be wiped out.
          </p>

          <button onClick={handleReset} className="btn-cyber-secondary text-xs py-2 px-4">
            <RefreshCw size={13} />
            <span>RESET ALL PROGRESS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
