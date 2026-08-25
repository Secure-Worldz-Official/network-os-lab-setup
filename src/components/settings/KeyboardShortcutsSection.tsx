import { useState } from 'react';
import { Keyboard, Search } from 'lucide-react';
import { PLATFORM_SHORTCUTS } from '@/hooks/useKeyboardShortcuts';

export function KeyboardShortcutsSection() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<'All' | 'Navigation' | 'Actions' | 'Terminal'>('All');

  const filtered = PLATFORM_SHORTCUTS.filter((s) => {
    const matchesCat = selectedCat === 'All' || s.category === selectedCat;
    const matchesSearch =
      s.combo.toLowerCase().includes(search.toLowerCase()) ||
      s.label.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* Shortcuts Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Keyboard size={14} />
              COMMAND HOTKEYS & KEYBOARD SHORTCUTS
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans">
              Navigate throughout CyberPath rapidly using multi-key navigation chords and terminal shortcuts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2.5 text-[#888888] dark:text-[#777777]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search shortcuts..."
                className="bg-[#FAFAFA] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded pl-8 pr-3 py-1.5 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono w-44"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {(['All', 'Navigation', 'Actions', 'Terminal'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 text-[10px] font-bold rounded border uppercase transition-all ${
                selectedCat === cat
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                  : 'bg-[#FAFAFA] dark:bg-[#181818] text-[#666666] dark:text-[#B5B5B5] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#CCCCCC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Shortcuts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {filtered.map((item) => (
            <div
              key={item.combo}
              className="p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between gap-4"
            >
              <div className="space-y-0.5 truncate">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#111111] dark:text-white">
                    {item.label}
                  </span>
                  <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-[#EEEEEE] dark:bg-[#202020] text-[#777777] uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans truncate">
                  {item.description}
                </p>
              </div>

              <kbd className="px-2.5 py-1.5 rounded bg-white dark:bg-[#181818] border border-[#CCCCCC] dark:border-[#333333] text-[11px] font-mono font-bold shadow-xs text-[#111111] dark:text-white shrink-0 tracking-wider">
                {item.combo}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
