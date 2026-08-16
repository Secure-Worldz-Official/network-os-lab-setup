import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Map,
  Home,
  X,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
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
  { to: '/', label: 'Home', icon: Home },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
];

export function Sidebar({ progress, mobile, onClose }: SidebarProps) {
  const location = useLocation();
  const overall = progress.overallProgress();
  const overallPct = overall.total > 0 ? (overall.done / overall.total) * 100 : 0;

  return (
    <motion.aside
      initial={mobile ? { x: -300 } : false}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        'flex flex-col h-full bg-[var(--bg-surface)] border-r border-[var(--border)]',
        mobile ? 'w-72' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-pale)] border border-[var(--accent-dim)] flex items-center justify-center">
            <Shield size={16} className="text-[var(--accent)]" />
          </div>
          <span
            className="font-[family-name:var(--font-heading)] font-bold text-sm tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Cyber<span className="text-[var(--accent)]">Path</span>
          </span>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Overall progress */}
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--text-muted)]">Overall Progress</span>
          <span className="text-xs font-bold text-[var(--accent)]">
            {overall.done}/{overall.total}
          </span>
        </div>
        <ProgressBar value={overallPct} size="sm" />
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">
          {overall.done === 0
            ? 'Start Day 1 to begin'
            : `${overall.done} day${overall.done !== 1 ? 's' : ''} completed`}
        </p>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-3 border-b border-[var(--border)]" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={cn('nav-item mb-0.5', isActive && 'active')}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="section-label px-2 mb-3">Modules</p>
        <div className="space-y-1">
          {roadmap.map((module) => {
            const mp = progress.moduleProgress(module.id);
            const isActive = location.pathname.includes(module.id);

            return (
              <div key={module.id}>
                <div
                  className={cn(
                    'px-2 py-2 rounded-[var(--radius-sm)] transition-colors',
                    isActive ? 'bg-[var(--accent-pale)]' : 'hover:bg-[var(--bg-elevated)]',
                    module.comingSoon && 'opacity-40'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {module.comingSoon ? (
                        <Lock size={12} className="text-[var(--text-muted)] flex-shrink-0" />
                      ) : (
                        <span
                          className="w-4 h-4 rounded text-xs font-bold flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'var(--accent-pale)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-dim)',
                            fontSize: '10px',
                          }}
                        >
                          {module.number}
                        </span>
                      )}
                      <span className="text-xs font-medium text-[var(--text-secondary)] truncate">
                        {module.title}
                      </span>
                    </div>
                    {!module.comingSoon && (
                      <span className="text-xs text-[var(--text-muted)] flex-shrink-0 ml-1">
                        {mp.done}/{mp.total}
                      </span>
                    )}
                  </div>

                  {/* Day list */}
                  {!module.comingSoon && (
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-2 space-y-0.5"
                        >
                          {module.days.map((day) => {
                            const done = progress.isComplete(module.id, day.id);
                            const dayPath = `/roadmap/${module.id}/${day.slug}`;
                            const isDayActive = location.pathname === dayPath;

                            return (
                              <Link
                                key={day.id}
                                to={dayPath}
                                onClick={onClose}
                                className={cn(
                                  'flex items-center gap-2 px-2 py-1 rounded text-xs transition-colors group',
                                  isDayActive
                                    ? 'bg-[var(--accent-pale)] text-[var(--text-primary)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                                )}
                              >
                                {done ? (
                                  <CheckCircle2
                                    size={11}
                                    className="text-[var(--accent)] flex-shrink-0"
                                  />
                                ) : (
                                  <Circle size={11} className="flex-shrink-0 opacity-40" />
                                )}
                                <span className="truncate">Day {day.id} · {day.title}</span>
                                {isDayActive && (
                                  <ChevronRight size={10} className="ml-auto flex-shrink-0 text-[var(--accent)]" />
                                )}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)]">
          Module 1 · {roadmap[0].dayRange}
        </p>
      </div>
    </motion.aside>
  );
}
