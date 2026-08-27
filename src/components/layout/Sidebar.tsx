import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Compass,
  Trophy,
  Activity,
  Settings,
  User,
  Terminal,
  X,
  Target
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';
import { useCyberPath } from '@/context/CyberPathContext';

interface SidebarProps {
  progress?: any;
  mobile?: boolean;
  onClose?: () => void;
}

const primaryNavItems = [
  { num: '01', to: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard, aliases: ['/'] },
  { num: '02', to: '/learn', label: 'LEARN', icon: Compass, aliases: ['/paths', '/roadmap'] },
  { num: '03', to: '/labs', label: 'LABS', icon: Terminal, aliases: ['/rooms'] },
  { num: '04', to: '/challenges', label: 'CHALLENGES', icon: Target, aliases: ['/practice'] },
  { num: '05', to: '/progress', label: 'PROGRESS', icon: Activity, aliases: [] },
  { num: '06', to: '/achievements', label: 'ACHIEVEMENTS', icon: Trophy, aliases: [] },
];

const secondaryNavItems = [
  { to: '/profile', label: 'PROFILE', icon: User },
  { to: '/settings', label: 'SETTINGS', icon: Settings },
];

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const location = useLocation();
  const { 
    xp, 
    level, 
    levelName, 
    streak, 
    completedRooms,
    activeLab
  } = useCyberPath();

  const isItemActive = (to: string, aliases: string[] = []) => {
    if (to === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    if (location.pathname.startsWith(to)) return true;
    return aliases.some(alias => location.pathname.startsWith(alias));
  };

  return (
    <motion.aside
      initial={mobile ? { x: -320 } : false}
      animate={{ x: 0 }}
      exit={{ x: -320 }}
      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="w-full h-full flex flex-col bg-[#F7F7F7] dark:bg-[#101010] text-[#111111] dark:text-white select-none overflow-hidden border-r border-[#E5E5E5] dark:border-[#2A2A2A] font-mono"
    >
      {/* Sidebar Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] shrink-0 bg-white dark:bg-[#141414]">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] font-bold group-hover:bg-[#333333] dark:group-hover:bg-[#E5E5E5] transition-all">
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm text-[#111111] dark:text-white tracking-widest leading-none">
              CYBERPATH
            </span>
            <span className="text-[9px] text-[#888888] dark:text-[#777777] tracking-widest uppercase mt-1">
              SECURITY TRAINING PLATFORM
            </span>
          </div>
        </Link>
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E5E5] dark:hover:bg-[#202020] transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Primary Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <div>
          <p className="px-3 mb-2 text-[9px] uppercase tracking-widest text-[#888888] dark:text-[#777777] font-bold">
            // MAIN DESTINATIONS
          </p>
          <nav className="space-y-1">
            {primaryNavItems.map(({ num, to, label, icon: Icon, aliases }) => {
              const isActive = isItemActive(to, aliases);

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono transition-all duration-150 rounded-[4px] border',
                    isActive
                      ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white shadow-sm'
                      : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] hover:bg-[#FAFAFA] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white dark:hover:bg-[#181818]'
                  )}
                >
                  <span className={cn('text-[10px] font-mono', isActive ? 'text-white/70 dark:text-black/70' : 'text-[#888888] dark:text-[#777777]')}>
                    {num}
                  </span>
                  <Icon size={14} className="shrink-0" />
                  <span className="truncate tracking-wider uppercase text-[11px] font-heading">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary Account / Preferences Navigation */}
        <div>
          <p className="px-3 mb-2 text-[9px] uppercase tracking-widest text-[#888888] dark:text-[#777777] font-bold">
            // OPERATIVE SYSTEM
          </p>
          <nav className="space-y-1">
            {secondaryNavItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname.startsWith(to);

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2 text-xs font-mono transition-all duration-150 rounded-[4px] border',
                    isActive
                      ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white shadow-sm'
                      : 'bg-transparent text-[#666666] border-transparent hover:border-[#E5E5E5] hover:bg-white dark:text-[#999999] dark:border-transparent dark:hover:border-[#2A2A2A] dark:hover:bg-[#141414] dark:hover:text-white'
                  )}
                >
                  <Icon size={14} className="shrink-0" />
                  <span className="truncate tracking-wider uppercase text-[11px] font-heading">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Active Lab Quick Widget (Contextual Action, NOT a top destination) */}
        {activeLab && (
          <div className="p-3 rounded-md bg-white dark:bg-[#141414] border border-[#111111] dark:border-white space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#111111] dark:text-white">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE LAB NODE
              </span>
              <span className="text-[#666666] dark:text-[#B5B5B5] font-mono">{activeLab.targetIp}</span>
            </div>
            <p className="text-[11px] font-bold text-[#111111] dark:text-white truncate font-heading uppercase">
              {activeLab.roomTitle}
            </p>
            <Link
              to={`/labs/${activeLab.roomId}`}
              onClick={onClose}
              className="block w-full text-center py-1.5 bg-[#111111] dark:bg-white text-white dark:text-black text-[10px] rounded font-bold hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors uppercase tracking-wider"
            >
              RESUME LAB →
            </Link>
          </div>
        )}
      </div>

      {/* Gamification Stats Footer */}
      <div className="px-4 py-3.5 border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] flex flex-col gap-2.5 shrink-0">
        <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
          <div className="p-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div className="text-[#888888] dark:text-[#777777] text-[8px] uppercase">LEVEL</div>
            <div className="font-bold text-[#111111] dark:text-white">LVL {level}</div>
          </div>
          <div className="p-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div className="text-[#888888] dark:text-[#777777] text-[8px] uppercase">XP</div>
            <div className="font-bold text-[#111111] dark:text-white">{xp}</div>
          </div>
          <div className="p-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <div className="text-[#888888] dark:text-[#777777] text-[8px] uppercase">STREAK</div>
            <div className="font-bold text-[#111111] dark:text-white">{streak}D</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#666666] dark:text-[#B5B5B5] uppercase text-[9px] font-bold">{levelName}</span>
            <span className="text-[#111111] dark:text-white font-bold">{completedRooms.length} LABS</span>
          </div>
          <ProgressBar value={(xp % 1000) / 10} size="sm" />
        </div>
      </div>
    </motion.aside>
  );
}
