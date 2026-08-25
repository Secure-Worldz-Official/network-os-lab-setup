import { useSettings, type ThemeMode } from '@/context/SettingsContext';
import { Sun, Moon, Laptop, Palette, Layout, Check } from 'lucide-react';

export function AppearanceSection() {
  const { theme, effectiveTheme, setTheme, appearance, updateAppearance, accessibility, updateAccessibility } = useSettings();

  const themes: Array<{
    id: ThemeMode;
    title: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    previewBg: string;
    previewBorder: string;
    previewText: string;
    previewSub: string;
  }> = [
    {
      id: 'light',
      title: 'LIGHT MODE',
      label: 'White UI Canvas',
      description: 'High-contrast light background with jet-black typography and subtle borders.',
      icon: Sun,
      previewBg: '#FFFFFF',
      previewBorder: '#E5E5E5',
      previewText: '#111111',
      previewSub: '#F7F7F7'
    },
    {
      id: 'dark',
      title: 'DARK MODE',
      label: 'Black UI Canvas',
      description: 'Monochrome pure black stealth canvas with crisp white typography and refined borders.',
      icon: Moon,
      previewBg: '#080808',
      previewBorder: '#2A2A2A',
      previewText: '#FFFFFF',
      previewSub: '#141414'
    },
    {
      id: 'system',
      title: 'SYSTEM DEFAULT',
      label: 'Auto Match OS',
      description: 'Synchronizes CyberPath theme automatically with your operating system preference.',
      icon: Laptop,
      previewBg: effectiveTheme === 'dark' ? '#080808' : '#FFFFFF',
      previewBorder: effectiveTheme === 'dark' ? '#2A2A2A' : '#E5E5E5',
      previewText: effectiveTheme === 'dark' ? '#FFFFFF' : '#111111',
      previewSub: effectiveTheme === 'dark' ? '#141414' : '#F7F7F7'
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Theme Selection Cards */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Palette size={14} />
              PLATFORM THEME ENGINE
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans">
              Choose your visual interface canvas. Theme switches immediately and persists across sessions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="text-[#888888] dark:text-[#777777]">ACTIVE THEME:</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333333] text-[#111111] dark:text-white uppercase">
              {theme} ({effectiveTheme.toUpperCase()})
            </span>
          </div>
        </div>

        {/* 3 Theme Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-md border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 relative ${
                  isSelected
                    ? 'border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#181818] shadow-md ring-2 ring-[#111111] dark:ring-white'
                    : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] hover:border-[#111111] dark:hover:border-[#555555]'
                }`}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-[#111111] dark:bg-white text-white dark:text-black text-[9px] font-bold tracking-widest uppercase">
                    <Check size={10} className="stroke-[3]" />
                    ACTIVE
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                          : 'bg-[#F7F7F7] dark:bg-[#202020] text-[#111111] dark:text-white'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#111111] dark:text-white font-heading uppercase">
                        {t.title}
                      </h4>
                      <span className="text-[10px] text-[#888888] dark:text-[#777777] block font-mono">
                        {t.label}
                      </span>
                    </div>
                  </div>

                  {/* Visual Diagram Representation */}
                  <div
                    className="w-full h-24 rounded border p-2 flex flex-col justify-between select-none shadow-inner"
                    style={{
                      backgroundColor: t.previewBg,
                      borderColor: t.previewBorder,
                      color: t.previewText
                    }}
                  >
                    {/* Mock Nav Bar */}
                    <div
                      className="h-3 rounded flex items-center justify-between px-1.5 text-[7px] font-bold"
                      style={{ backgroundColor: t.previewSub, borderColor: t.previewBorder, borderWidth: 1 }}
                    >
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.previewText }} />
                        <span>CYBERPATH</span>
                      </div>
                      <div className="w-8 h-1 rounded" style={{ backgroundColor: t.previewBorder }} />
                    </div>

                    {/* Mock Content Columns */}
                    <div className="flex gap-1.5 flex-1 mt-1.5">
                      <div
                        className="w-1/3 rounded p-1 flex flex-col gap-1"
                        style={{ backgroundColor: t.previewSub, borderColor: t.previewBorder, borderWidth: 1 }}
                      >
                        <div className="w-full h-1 rounded" style={{ backgroundColor: t.previewText, opacity: 0.8 }} />
                        <div className="w-2/3 h-1 rounded" style={{ backgroundColor: t.previewBorder }} />
                      </div>
                      <div
                        className="w-2/3 rounded p-1 flex flex-col justify-between"
                        style={{ backgroundColor: t.previewBg, borderColor: t.previewBorder, borderWidth: 1 }}
                      >
                        <div className="space-y-1">
                          <div className="w-3/4 h-1.5 rounded" style={{ backgroundColor: t.previewText }} />
                          <div className="w-full h-1 rounded" style={{ backgroundColor: t.previewBorder }} />
                        </div>
                        <div
                          className="h-2 rounded flex items-center justify-center text-[6px] font-bold"
                          style={{
                            backgroundColor: t.previewText,
                            color: t.previewBg
                          }}
                        >
                          ACTION
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#666666] dark:text-[#B5B5B5] font-sans leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`w-full text-center py-1.5 text-[10px] font-bold rounded transition-all ${
                    isSelected
                      ? 'bg-[#111111] text-white dark:bg-white dark:text-black'
                      : 'bg-[#F7F7F7] dark:bg-[#181818] text-[#111111] dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                  }`}
                >
                  {isSelected ? '✓ CURRENT SELECTION' : `SWITCH TO ${t.id.toUpperCase()}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interface Layout & Customization Controls */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Layout size={14} />
          INTERFACE LAYOUT & DENSITY CONFIGURATION
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Density Preference */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
            <span className="font-bold text-[#111111] dark:text-white block uppercase text-[11px]">
              Interface Density
            </span>
            <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
              Adjust spacing and padding for high-information density or comfortable view.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['compact', 'normal', 'comfortable'] as const).map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => updateAppearance({ interfaceDensity: density })}
                  className={`py-1.5 text-[10px] font-bold rounded border uppercase transition-all ${
                    appearance.interfaceDensity === density
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                      : 'bg-white dark:bg-[#181818] text-[#555555] dark:text-[#B5B5B5] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#CCCCCC]'
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-[#111111] dark:text-white block uppercase text-[11px]">
                High-Contrast Mode
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Reinforces crisp stark borders and ultra-high text visibility for tactical audits.
              </p>
            </div>
            <input
              type="checkbox"
              checked={accessibility.highContrast}
              onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
              className="w-5 h-5 accent-black dark:accent-white cursor-pointer shrink-0"
            />
          </div>

          {/* Code Ligatures */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-[#111111] dark:text-white block uppercase text-[11px]">
                Monospace Font Ligatures
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Render programming symbol ligatures (e.g. <code>!=</code>, <code>=&gt;</code>, <code>===</code>) in terminal & labs.
              </p>
            </div>
            <input
              type="checkbox"
              checked={appearance.codeLigatures}
              onChange={(e) => updateAppearance({ codeLigatures: e.target.checked })}
              className="w-5 h-5 accent-black dark:accent-white cursor-pointer shrink-0"
            />
          </div>

          {/* Breadcrumb Navigation */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-[#111111] dark:text-white block uppercase text-[11px]">
                Show Breadcrumbs Bar
              </span>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Display module hierarchy and navigation breadcrumbs at the top of practical rooms.
              </p>
            </div>
            <input
              type="checkbox"
              checked={appearance.breadcrumbs}
              onChange={(e) => updateAppearance({ breadcrumbs: e.target.checked })}
              className="w-5 h-5 accent-black dark:accent-white cursor-pointer shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
