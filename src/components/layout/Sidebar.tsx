import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Compass,
  Home,
  X,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
  Layers,
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { roadmap } from '@/data/roadmap';
import { cn } from '@/lib/utils';
import type { useProgress } from '@/hooks/useProgress';

type ProgressAPI = ReturnType<typeof useProgress>;

interface SidebarProps {
  progress: ProgressAPI;
  mobile?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/', label: 'Overview', icon: Home },
  { to: '/roadmap', label: 'Curriculum', icon: Compass },
];

export function Sidebar({ progress, mobile, onClose }: SidebarProps) {
  const location = useLocation();
  const overall = progress.overallProgress();
  const overallPct = overall.total > 0 ? (overall.done / overall.total) * 100 : 0;

  return (
    <motion.aside
      initial={mobile ? { x: -320 } : false}
      animate={{ x: 0 }}
      exit={{ x: -320 }}
      transition={{ type: 'spring', damping: 28, stiffness: 240 }}
      className="w-full h-full flex flex-col bg-[#0c0c0e] text-[#fafafa] select-none overflow-hidden"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 shrink-0 bg-gradient-to-b from-zinc-900/40 to-transparent">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={onClose}
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white group-hover:border-zinc-500 transition-colors">
            <Shield size={16} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm text-white tracking-tight leading-tight">
              CYBER<span className="text-zinc-400 font-normal">PATH</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
              Security Roadmap
            </span>
          </div>
        </Link>
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Progress Box */}
      <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-950/60 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="min-w-0 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Roadmap Progress
          </span>
          <span className="shrink-0 text-xs font-mono font-semibold text-white">
            {overall.done}/{overall.total} DAYS
          </span>
        </div>
        <ProgressBar value={overallPct} size="sm" />
        <div className="flex items-start justify-between gap-3 mt-2 text-[11px] text-zinc-500 font-mono">
          <span className="min-w-0">{Math.round(overallPct)}% Completed</span>
          <span className="shrink-0">Module 1 Active</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <p className="px-2 mb-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          Navigation
        </p>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent'
                )}
              >
                <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Modules List (Scrollable Area) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
        <div className="flex items-center justify-between px-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Curriculum
          </p>
          <span className="text-[10px] font-mono text-zinc-500">3 Modules</span>
        </div>

        <div className="space-y-2.5">
          {roadmap.map((module) => {
            const mp = progress.moduleProgress(module.id);
            const isModuleRoute = location.pathname.includes(module.id);

            return (
              <div
                key={module.id}
                className={cn(
                  'rounded-xl border transition-colors overflow-hidden',
                  module.comingSoon
                    ? 'border-zinc-850 bg-zinc-950/30 opacity-60'
                    : isModuleRoute
                    ? 'border-zinc-700 bg-zinc-900/60 shadow-[0_0_12px_rgba(255,255,255,0.03)]'
                    : 'border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-750 hover:bg-zinc-900/40'
                )}
              >
                <div className="p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'w-6 h-6 rounded flex items-center justify-center text-[11px] font-mono font-bold shrink-0',
                          module.comingSoon
                            ? 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                            : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        )}
                      >
                        {module.comingSoon ? <Lock size={12} /> : module.number}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-200 truncate">
                          {module.title}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-500 truncate">
                          {module.dayRange}
                        </p>
                      </div>
                    </div>

                    {!module.comingSoon && (
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                        {mp.done}/{mp.total}
                      </span>
                    )}
                  </div>

                  {/* Day list */}
                  {!module.comingSoon && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/70 space-y-1">
                      {module.days.map((day) => {
                        const isDone = progress.isComplete(module.id, day.id);
                        const dayPath = `/roadmap/${module.id}/${day.slug}`;
                        const isDayActive = location.pathname === dayPath;

                        return (
                          <Link
                             key={day.id}
                             to={dayPath}
                             onClick={onClose}
                             className={cn(
                               'group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-150',
                               isDayActive
                                 ? 'bg-white text-zinc-950 font-semibold shadow-[0_0_8px_rgba(255,255,255,0.15)]'
                                 : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80'
                             )}
                           >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="shrink-0">
                                {isDone ? (
                                  <CheckCircle2
                                    size={13}
                                    className={isDayActive ? 'text-zinc-950' : 'text-zinc-100'}
                                  />
                                ) : (
                                  <Circle
                                    size={13}
                                    className={isDayActive ? 'text-zinc-950/50' : 'text-zinc-600'}
                                  />
                                )}
                              </div>
                              <span className="min-w-0 truncate text-[11px] leading-tight">
                                D0{day.id}: {day.title}
                              </span>
                            </div>
                            {isDayActive && (
                              <ChevronRight size={13} className="text-zinc-950 shrink-0" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3.5 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={13} className="text-zinc-400" />
          <span>v1.0 Foundations</span>
        </div>
        <span>Monochrome</span>
      </div>
    </motion.aside>
  );
}
