import { useSettings } from '@/context/SettingsContext';
import { Globe, Clock, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English (US & Global)', native: 'English', available: true },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', available: false },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', available: false },
  { code: 'es', name: 'Spanish', native: 'Español', available: false },
  { code: 'ja', name: 'Japanese', native: '日本語', available: false },
  { code: 'de', name: 'German', native: 'Deutsch', available: false }
];

const TIMEZONES = [
  { id: 'auto', label: 'Auto Detect (Browser System Timezone)' },
  { id: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { id: 'EST', label: 'EST / EDT (US Eastern Time - New York)' },
  { id: 'PST', label: 'PST / PDT (US Pacific Time - Los Angeles)' },
  { id: 'GMT', label: 'GMT / BST (Greenwich Mean Time - London)' },
  { id: 'IST', label: 'IST (India Standard Time - UTC+05:30)' },
  { id: 'JST', label: 'JST (Japan Standard Time - Tokyo)' }
];

export function LanguageRegionSection() {
  const { languageRegion, updateLanguageRegion } = useSettings();

  return (
    <div className="space-y-6 font-mono">
      {/* Language Selection Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="space-y-0.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Globe size={14} />
            PLATFORM LOCALIZATION & LANGUAGE ARCHITECTURE
          </h3>
          <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans">
            Choose your preferred interface language. Additional international cybersecurity curricula are in active preparation.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {LANGUAGES.map((lang) => {
            const isSelected = languageRegion.language === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                disabled={!lang.available}
                onClick={() => lang.available && updateLanguageRegion({ language: lang.code })}
                className={`p-3.5 rounded border text-left flex flex-col justify-between space-y-2 transition-all ${
                  isSelected
                    ? 'border-[#111111] dark:border-white bg-[#F7F7F7] dark:bg-[#181818] ring-1 ring-[#111111] dark:ring-white'
                    : lang.available
                    ? 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-transparent hover:border-[#CCCCCC]'
                    : 'border-[#EEEEEE] dark:border-[#222222] bg-[#FAFAFA] dark:bg-[#101010] opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[#111111] dark:text-white">
                    {lang.name}
                  </span>
                  {lang.available ? (
                    isSelected && <Check size={12} className="text-[#111111] dark:text-white stroke-[3]" />
                  ) : (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
                      Coming Soon
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#888888] dark:text-[#777777] font-mono">
                  {lang.native}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date, Timezone & Clock Preferences */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Clock size={14} />
          TIMEZONE, DATE & TELEMETRY FORMATTING
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Timezone */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
              OPERATIONAL TIMEZONE
            </label>
            <select
              value={languageRegion.timeZone}
              onChange={(e) => updateLanguageRegion({ timeZone: e.target.value })}
              className="w-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs font-mono font-bold text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.id} value={tz.id}>{tz.label}</option>
              ))}
            </select>
          </div>

          {/* Date Format */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
              DATE FORMAT
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => updateLanguageRegion({ dateFormat: fmt })}
                  className={`py-2 text-[9px] font-bold rounded border uppercase transition-all ${
                    languageRegion.dateFormat === fmt
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                      : 'bg-[#FAFAFA] dark:bg-[#181818] text-[#555555] dark:text-[#B5B5B5] border-[#E5E5E5] dark:border-[#2A2A2A]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Clock Format */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
              CLOCK SYSTEM
            </label>
            <div className="grid grid-cols-2 gap-1">
              {(['12h', '24h'] as const).map((clk) => (
                <button
                  key={clk}
                  type="button"
                  onClick={() => updateLanguageRegion({ clockFormat: clk })}
                  className={`py-2 text-[10px] font-bold rounded border uppercase transition-all ${
                    languageRegion.clockFormat === clk
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                      : 'bg-[#FAFAFA] dark:bg-[#181818] text-[#555555] dark:text-[#B5B5B5] border-[#E5E5E5] dark:border-[#2A2A2A]'
                  }`}
                >
                  {clk === '12h' ? '12-HOUR (AM/PM)' : '24-HOUR (MILITARY)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
