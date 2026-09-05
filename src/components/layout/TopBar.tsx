import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass, Terminal, Sun, Moon, Settings, User, Cpu } from 'lucide-react';
import { useCyberPath } from '@/context/CyberPathContext';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';

export function TopBar() {
  const { activeLab } = useCyberPath();
  const { effectiveTheme, setTheme } = useSettings();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, aliases: ['/'] },
    { label: 'Learning Lab', to: '/learn', icon: Compass, aliases: ['/roadmap', '/paths'] },
    { label: 'Experiment Lab', to: '/labs', icon: Terminal, aliases: ['/rooms'] },
  ];

  const isNavActive = (to: string, aliases: string[]) => {
    if (to === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    if (location.pathname === to || location.pathname.startsWith(to)) return true;
    return aliases.some((alias) => location.pathname.startsWith(alias));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-2 sm:px-6 lg:px-8 py-2.5 bg-white/95 dark:bg-[#080808]/95 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#2A2A2A] shrink-0 select-none font-mono transition-colors duration-200 gap-1 sm:gap-2">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-xs tracking-tighter shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Cpu size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col hidden md:flex">
            <span className="font-heading font-extrabold text-xs sm:text-sm tracking-wider text-[#111111] dark:text-white uppercase leading-none">
              NETWORKING OS LAB
            </span>
            <span className="text-[8px] text-[#888888] dark:text-[#777777] tracking-widest uppercase font-mono">
              SECURITY PLATFORM
            </span>
          </div>
        </Link>
      </div>

      {/* TOP-CENTER NAVIGATION (STRICT 3 ITEMS: Dashboard, Learning Lab, Experiment Lab) */}
      <nav aria-label="Main Navigation" className="flex items-center justify-center min-w-0">
        <div className="p-0.5 sm:p-1 rounded-full bg-[#F2F2F2] dark:bg-[#141414] border border-[#E0E0E0] dark:border-[#262626] flex items-center gap-0.5 sm:gap-1 shadow-inner">
          {navItems.map((item) => {
            const active = isNavActive(item.to, item.aliases);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-200 ease-out select-none shrink-0 cursor-pointer',
                  active
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#080808] font-extrabold shadow-xs'
                    : 'text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                )}
              >
                <Icon
                  size={13}
                  className={cn(
                    'shrink-0 transition-transform duration-200',
                    active ? 'scale-110 text-white dark:text-[#080808]' : 'text-current'
                  )}
                />
                <span
                  className={cn(
                    'hidden sm:inline font-heading tracking-wide uppercase text-[10px] sm:text-xs whitespace-nowrap',
                    active ? 'text-white dark:text-[#080808] font-extrabold' : 'text-current'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Right Controls: Active Lab Indicator, Theme Toggle, Settings, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Active Lab Pill */}
        {activeLab && (
          <Link
            to={`/labs/${activeLab.roomId}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] sm:text-[11px] font-mono text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
            title="Active lab session in progress"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold hidden lg:inline">LAB RUNNING</span>
          </Link>
        )}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-full bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
          title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {effectiveTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Settings */}
        <Link
          to="/settings"
          className="p-1.5 sm:p-2 rounded-full bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all hidden sm:inline-flex"
          title="Settings"
        >
          <Settings size={14} />
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className="p-1.5 sm:p-2 rounded-full bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          title="Profile"
        >
          <User size={14} />
        </Link>
      </div>
    </header>
  );
}
