import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, Layers } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { DayCard } from './DayCard';
import type { Module } from '@/data/roadmap';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  module: Module;
  moduleProgress: { done: number; total: number };
  isComplete: (dayId: number) => boolean;
  defaultOpen?: boolean;
}

export function ModuleCard({
  module,
  moduleProgress,
  isComplete,
  defaultOpen = false,
}: ModuleCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const pct = moduleProgress.total > 0 ? (moduleProgress.done / moduleProgress.total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-[var(--radius-lg)] border overflow-hidden',
        module.comingSoon
          ? 'border-[var(--border-subtle)] opacity-50 pointer-events-none'
          : 'border-[var(--border)]'
      )}
    >
      {/* Module header */}
      <button
        onClick={() => !module.comingSoon && setOpen((o) => !o)}
        className={cn(
          'w-full flex items-start gap-4 p-5 text-left',
          'bg-[var(--bg-surface)] transition-colors',
          !module.comingSoon && 'hover:bg-[var(--bg-elevated)] cursor-pointer',
          open && !module.comingSoon && 'bg-[var(--bg-elevated)]'
        )}
        aria-expanded={open}
        aria-controls={`module-${module.id}-content`}
        id={`module-${module.id}-header`}
        disabled={module.comingSoon}
      >
        {/* Number badge */}
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center font-bold text-sm',
            module.comingSoon
              ? 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)]'
              : 'bg-[var(--accent-pale)] text-[var(--accent)] border border-[var(--accent-dim)]'
          )}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {module.comingSoon ? <Lock size={14} /> : module.number}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-base font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Module {module.number}: {module.title}
            </h2>
            {module.comingSoon ? (
              <Badge variant="locked">Coming Soon</Badge>
            ) : pct === 100 ? (
              <Badge variant="success">Complete</Badge>
            ) : pct > 0 ? (
              <Badge variant="accent">In Progress</Badge>
            ) : null}
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-1">{module.subtitle}</p>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Layers size={11} />
              {module.dayRange}
            </span>
            {!module.comingSoon && (
              <span>{moduleProgress.done}/{moduleProgress.total} days complete</span>
            )}
          </div>

          {!module.comingSoon && (
            <div className="mt-3 max-w-xs">
              <ProgressBar value={pct} size="sm" />
            </div>
          )}
        </div>

        {/* Chevron */}
        {!module.comingSoon && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown size={18} className="text-[var(--text-muted)]" />
          </motion.div>
        )}
      </button>

      {/* Description bar */}
      {!module.comingSoon && (
        <div className="px-5 py-3 bg-[var(--bg-base)] border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">{module.description}</p>
        </div>
      )}

      {/* Day list */}
      <AnimatePresence>
        {open && !module.comingSoon && (
          <motion.div
            id={`module-${module.id}-content`}
            role="region"
            aria-labelledby={`module-${module.id}-header`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-[var(--border)]"
          >
            <div className="p-4 space-y-2 bg-[var(--bg-base)]">
              {module.days.map((day, i) => (
                <DayCard
                  key={day.id}
                  day={day}
                  moduleId={module.id}
                  isComplete={isComplete(day.id)}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
