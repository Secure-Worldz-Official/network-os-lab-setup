import { Link, useLocation } from 'react-router-dom';
import { Menu, Award, Flame, User, Wifi, Settings, Sun, Moon, Search, ChevronRight } from 'lucide-react';
import { useCyberPath } from '@/context/CyberPathContext';
import { useSettings } from '@/context/SettingsContext';

interface TopBarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  progress?: any;
}

export function TopBar({ onMenuClick, onSearchClick }: TopBarProps) {
  const { xp, streak, activeLab, vpnStatus } = useCyberPath();
  const { effectiveTheme, setTheme } = useSettings();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  // Helper to generate dynamic breadcrumb based on route
  const getBreadcrumbs = () => {
    const p = location.pathname;
    if (p === '/' || p === '/dashboard') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'DASHBOARD' }];
    if (p === '/learn' || p === '/paths') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'LEARN' }];
    if (p.startsWith('/roadmap')) return [{ label: 'LEARN', to: '/learn' }, { label: 'CURRICULUM' }];
    if (p === '/labs' || p === '/rooms') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'PRACTICAL LABS' }];
    if (p.startsWith('/labs/') || p.startsWith('/rooms/')) return [{ label: 'LABS', to: '/labs' }, { label: 'LAB WORKSPACE' }];
    if (p === '/challenges' || p === '/practice') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'CHALLENGES' }];
    if (p === '/progress') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'PROGRESS' }];
    if (p === '/achievements') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'ACHIEVEMENTS' }];
    if (p === '/leaderboard') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'LEADERBOARD' }];
    if (p === '/profile') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'OPERATIVE PROFILE' }];
    if (p === '/settings') return [{ label: 'CYBERPATH', to: '/dashboard' }, { label: 'SETTINGS' }];
    if (p === '/vpn') return [{ label: 'LABS', to: '/labs' }, { label: 'VPN CONNECTIVITY' }];
    return [{ label: 'CYBERPATH', to: '/dashboard' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-white/95 dark:bg-[#101010]/95 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#2A2A2A] shrink-0 select-none font-mono transition-colors duration-200">
      
      {/* Left Area: Mobile Menu & Dynamic Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1 rounded text-[#555555] dark:text-[#B5B5B5] hover:text-[#111111] dark:hover:text-white hover:bg-[#F0F0F0] dark:hover:bg-[#181818] transition-colors"
          aria-label="Toggle navigation menu"
          id="mobile-menu-button"
        >
          <Menu size={18} />
        </button>

        {/* Dynamic Context Breadcrumb */}
        <nav aria-label="Page hierarchy" className="hidden sm:flex items-center gap-1.5 text-xs text-[#888888] dark:text-[#777777]">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight size={11} className="text-[#CCCCCC] dark:text-[#444444]" />}
                {crumb.to && !isLast ? (
                  <Link to={crumb.to} className="hover:text-[#111111] dark:hover:text-white transition-colors font-bold uppercase tracking-wider text-[10px]">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`uppercase font-extrabold tracking-wider text-[10px] ${isLast ? 'text-[#111111] dark:text-white' : ''}`}>
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Center / Search Area */}
      <div className="flex-1 max-w-xs mx-3 hidden md:block">
        <button
          type="button"
          onClick={onSearchClick}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded text-xs text-[#888888] dark:text-[#777777] hover:border-[#111111] dark:hover:border-white transition-colors"
        >
          <span className="flex items-center gap-2 truncate">
            <Search size={13} />
            <span className="truncate">Search CyberPath...</span>
          </span>
          <kbd className="hidden lg:inline-block text-[9px] font-bold px-1.5 py-0.5 bg-white dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333] rounded">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Area: Stats, Lab Status, Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={onSearchClick}
          className="md:hidden p-1.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white"
          title="Search (Ctrl + K)"
        >
          <Search size={14} />
        </button>

        {/* Active Lab Indicator Pill */}
        {activeLab && (
          <Link
            to={`/labs/${activeLab.roomId}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#111111] dark:border-white text-[11px] font-mono text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            title="Click to resume active lab session"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold hidden sm:inline">LAB RUNNING</span>
            <span className="text-[10px] opacity-75">{activeLab.targetIp}</span>
          </Link>
        )}

        {/* VPN Status Pill */}
        <Link 
          to="/vpn"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors"
          title="Lab network connectivity status"
        >
          <Wifi size={12} className={vpnStatus.connected ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"} />
          <span className="text-[10px] font-bold uppercase">{vpnStatus.connected ? 'VPN ONLINE' : 'VPN OFFLINE'}</span>
        </Link>

        {/* XP Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white">
          <Award size={12} className="text-[#111111] dark:text-white" />
          <span className="font-bold text-[11px]">{xp.toLocaleString()} XP</span>
        </div>

        {/* Streak Badge */}
        <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white">
          <Flame size={12} className="text-[#111111] dark:text-white" />
          <span className="font-bold text-[11px]">{streak}D</span>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
          title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {effectiveTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Settings Quick Link */}
        <Link 
          to="/settings" 
          className="p-1.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          aria-label="Platform Settings"
          title="Platform Settings"
        >
          <Settings size={14} />
        </Link>

        {/* Profile Quick Link */}
        <Link 
          to="/profile" 
          className="p-1.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          aria-label="User Profile"
          title="User Profile"
        >
          <User size={14} />
        </Link>
      </div>
    </header>
  );
}
