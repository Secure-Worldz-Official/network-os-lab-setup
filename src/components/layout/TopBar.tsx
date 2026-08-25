import { Link } from 'react-router-dom';
import { Menu, Shield, Award, Flame, User, Wifi, Settings, Sun, Moon } from 'lucide-react';
import { useCyberPath } from '@/context/CyberPathContext';
import { useSettings } from '@/context/SettingsContext';

interface TopBarProps {
  onMenuClick: () => void;
  progress?: any;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { xp, streak, activeLab } = useCyberPath();
  const { effectiveTheme, setTheme } = useSettings();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/95 dark:bg-[#101010]/95 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#2A2A2A] shrink-0 select-none font-mono transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded text-[#555555] dark:text-[#B5B5B5] hover:text-[#111111] dark:hover:text-white hover:bg-[#F0F0F0] dark:hover:bg-[#181818] transition-colors"
          aria-label="Toggle navigation menu"
          id="mobile-menu-button"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] font-bold group-hover:bg-[#333333] dark:group-hover:bg-[#E5E5E5] transition-colors">
            <Shield size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm text-[#111111] dark:text-white tracking-widest leading-none">
              CYBERPATH
            </span>
            <span className="text-[9px] text-[#888888] dark:text-[#777777] tracking-widest uppercase mt-0.5">
              SECURITY TRAINING PLATFORM
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        {activeLab && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">LAB ACTIVE</span>
            <span className="text-[#666666] dark:text-[#B5B5B5]">{activeLab.targetIp}</span>
          </div>
        )}

        <Link 
          to="/vpn"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors"
        >
          <Wifi size={12} className="text-emerald-600 dark:text-emerald-400" />
          <span>VPN CONNECTED</span>
        </Link>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white">
          <Award size={12} className="text-[#111111] dark:text-white" />
          <span className="font-bold">{xp.toLocaleString()} XP</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white">
          <Flame size={12} className="text-[#111111] dark:text-white" />
          <span className="font-bold">{streak}D STREAK</span>
        </div>

        {/* Quick Theme Toggle Icon */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {effectiveTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <Link 
          to="/settings" 
          className="p-1.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          aria-label="Platform Settings"
          title="Platform Settings"
        >
          <Settings size={15} />
        </Link>

        <Link 
          to="/profile" 
          className="p-1.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          aria-label="User Profile"
          title="User Profile"
        >
          <User size={15} />
        </Link>
      </div>
    </header>
  );
}
