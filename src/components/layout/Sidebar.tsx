import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Compass,
  Trophy,
  BarChart2,
  Settings,
  User,
  Flame,
  Terminal,
  X,
  Target,
  Wifi
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';
import { useCyberPath } from '@/context/CyberPathContext';

interface SidebarProps {
  progress?: any;
  mobile?: boolean;
  onClose?: () => void;
}

const navItems = [
  { num: '01', to: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { num: '02', to: '/paths', label: 'LEARNING PATHS', icon: Compass },
  { num: '03', to: '/rooms', label: 'ROOMS & LABS', icon: Terminal },
  { num: '04', to: '/practice', label: 'PRACTICE', icon: Flame },
  { num: '05', to: '/roadmap', label: 'CHALLENGES', icon: Target },
  { num: '06', to: '/achievements', label: 'ACHIEVEMENTS', icon: Trophy },
  { num: '07', to: '/leaderboard', label: 'LEADERBOARD', icon: BarChart2 },
  { num: '08', to: '/profile', label: 'PROFILE', icon: User },
  { num: '09', to: '/vpn', label: 'LAB CONNECTIVITY', icon: Wifi },
  { num: '10', to: '/settings', label: 'SETTINGS', icon: Settings },
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

  return (
    <motion.aside
      initial={mobile ? { x: -320 } : false}
      animate={{ x: 0 }}
      exit={{ x: -320 }}
      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="w-full h-full flex flex-col bg-[#F7F7F7] text-[#111111] select-none overflow-hidden border-r border-[#E5E5E5] font-mono"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] shrink-0 bg-white">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded bg-[#111111] flex items-center justify-center text-white font-bold group-hover:bg-[#333333] transition-all">
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm text-[#111111] tracking-widest leading-none">
              CYBERPATH
            </span>
            <span className="text-[9px] text-[#888888] tracking-widest uppercase mt-1">
              SECURITY TRAINING PLATFORM
            </span>
          </div>
        </Link>
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-[#666666] hover:text-[#111111] hover:bg-[#E5E5E5] transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Primary Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[9px] uppercase tracking-widest text-[#888888]">
          // PLATFORM NAVIGATION
        </p>
        <nav className="space-y-1">
          {navItems.map(({ num, to, label, icon: Icon }) => {
            const isActive = to === '/dashboard' 
              ? location.pathname === '/dashboard' 
              : location.pathname.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono transition-all duration-150 rounded-[4px] border',
                  isActive
                    ? 'bg-[#111111] text-white font-bold border-[#111111] shadow-sm'
                    : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] hover:bg-[#FAFAFA]'
                )}
              >
                <span className={cn('text-[10px] font-mono', isActive ? 'text-white/70' : 'text-[#888888]')}>
                  {num}
                </span>
                <Icon size={14} className="shrink-0" />
                <span className="truncate tracking-wider uppercase text-[11px]">{label}</span>
              </Link>
            );
          })}
        </nav>

        {activeLab && (
          <div className="mt-4 p-3 rounded bg-white border border-[#111111] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#111111]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE LAB
              </span>
              <span className="text-[#666666]">{activeLab.targetIp}</span>
            </div>
            <p className="text-[10px] text-[#555555] truncate font-sans">
              {activeLab.roomTitle}
            </p>
            <Link
              to={`/rooms/${activeLab.roomId}`}
              onClick={onClose}
              className="block w-full text-center py-1 bg-[#111111] text-white text-[10px] rounded font-bold hover:bg-[#333333]"
            >
              RESUME LAB →
            </Link>
          </div>
        )}
      </div>

      {/* Gamification Stats Footer */}
      <div className="px-4 py-4 border-t border-[#E5E5E5] bg-white flex flex-col gap-3 shrink-0">
        <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] border-b border-[#E5E5E5] pb-3">
          <div className="p-1 rounded bg-[#F7F7F7] border border-[#E5E5E5]">
            <div className="text-[#888888] text-[8px] uppercase">LEVEL</div>
            <div className="font-bold text-[#111111]">LVL {level}</div>
          </div>
          <div className="p-1 rounded bg-[#F7F7F7] border border-[#E5E5E5]">
            <div className="text-[#888888] text-[8px] uppercase">XP</div>
            <div className="font-bold text-[#111111]">{xp}</div>
          </div>
          <div className="p-1 rounded bg-[#F7F7F7] border border-[#E5E5E5]">
            <div className="text-[#888888] text-[8px] uppercase">STREAK</div>
            <div className="font-bold text-[#111111]">{streak}D</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#666666] uppercase text-[9px] font-bold">{levelName}</span>
            <span className="text-[#111111] font-bold">{completedRooms.length} ROOMS</span>
          </div>
          <ProgressBar value={(xp % 1000) / 10} size="sm" />
        </div>
      </div>
    </motion.aside>
  );
}
