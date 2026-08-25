import {
  User,
  Palette,
  Bell,
  BookOpen,
  Terminal,
  ShieldCheck,
  Eye,
  Globe,
  Keyboard,
  HardDrive,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CategoryItem {
  id: string;
  num: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  isDanger?: boolean;
}

export const SETTINGS_CATEGORIES: CategoryItem[] = [
  { id: '01-account', num: '01', label: 'Account', icon: User },
  { id: '02-appearance', num: '02', label: 'Appearance', icon: Palette },
  { id: '03-notifications', num: '03', label: 'Notifications', icon: Bell },
  { id: '04-learning', num: '04', label: 'Learning', icon: BookOpen },
  { id: '05-lab-terminal', num: '05', label: 'Lab & Terminal', icon: Terminal },
  { id: '06-privacy-security', num: '06', label: 'Privacy & Security', icon: ShieldCheck },
  { id: '07-accessibility', num: '07', label: 'Accessibility', icon: Eye },
  { id: '08-language-region', num: '08', label: 'Language & Region', icon: Globe },
  { id: '09-keyboard-shortcuts', num: '09', label: 'Keyboard Shortcuts', icon: Keyboard },
  { id: '10-data-storage', num: '10', label: 'Data & Storage', icon: HardDrive },
  { id: '11-help-about', num: '11', label: 'Help & About', icon: HelpCircle },
  { id: '12-danger-zone', num: '12', label: 'Danger Zone', icon: AlertTriangle, isDanger: true }
];

interface SettingsNavProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function SettingsNav({ activeCategory, onSelectCategory }: SettingsNavProps) {
  return (
    <div className="w-full font-mono select-none">
      {/* Mobile Horizontal / Dropdown Selector */}
      <div className="block lg:hidden mb-6">
        <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-wider block mb-2">
          // SETTINGS CATEGORY SELECTOR
        </label>
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full bg-white dark:bg-[#141414] text-[#111111] dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-md px-3.5 py-2.5 text-xs font-mono font-bold outline-none focus:border-[#111111] dark:focus:border-white shadow-sm"
          >
            {SETTINGS_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.num} {cat.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Vertical Sidebar */}
      <div className="hidden lg:flex flex-col space-y-1.5 p-1.5 rounded-md bg-white dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-sm">
        <div className="px-3 py-2 text-[9px] uppercase tracking-widest font-bold text-[#888888] dark:text-[#777777] border-b border-[#E5E5E5] dark:border-[#2A2A2A] mb-1">
          CATEGORIES ({SETTINGS_CATEGORIES.length})
        </div>

        <div className="space-y-1">
          {SETTINGS_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono transition-all duration-150 text-left border',
                  isActive
                    ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white font-bold shadow-sm'
                    : cat.isDanger
                    ? 'text-rose-600 dark:text-rose-400 bg-transparent border-transparent hover:bg-rose-500/10 hover:border-rose-500/20'
                    : 'text-[#555555] dark:text-[#B5B5B5] bg-transparent border-transparent hover:bg-[#F7F7F7] dark:hover:bg-[#181818] hover:text-[#111111] dark:hover:text-white hover:border-[#E5E5E5] dark:hover:border-[#2A2A2A]'
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={cn(
                      'text-[10px] font-mono',
                      isActive
                        ? 'text-white/70 dark:text-black/70'
                        : 'text-[#888888] dark:text-[#777777]'
                    )}
                  >
                    {cat.num}
                  </span>
                  <Icon
                    size={14}
                    className={cn(
                      'shrink-0',
                      isActive ? 'text-white dark:text-black' : cat.isDanger ? 'text-rose-500' : 'text-[#666666] dark:text-[#999999]'
                    )}
                  />
                  <span className="truncate uppercase text-[11px] tracking-wider">{cat.label}</span>
                </div>

                {cat.isDanger && !isActive && (
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    DANGER
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
