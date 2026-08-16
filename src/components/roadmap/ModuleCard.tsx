import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, Terminal } from 'lucide-react';
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
    <div
      className={cn(
        'rounded-xl border transition-all duration-200 overflow-hidden',
        module.comingSoon
          ? 'bg-[#0f0f12]/50 border-zinc-800/50 opacity-60'
          : 'bg-[#111113] border-zinc-800 hover:border-zinc-700'
      )}
    >
      {/* Module Header Bar */}
      <button
        type="button"
        onClick={() => !module.comingSoon && setOpen((o) => !o)}
        className={cn(
          'w-full flex items-start gap-4 p-5 sm:p-6 text-left transition-colors',
          !module.comingSoon && 'cursor-pointer hover:bg-zinc-900/40',
          open && !module.comingSoon && 'bg-zinc-900/30'
        )}
        aria-expanded={open}
        aria-controls={`module-${module.id}-days`}
        id={`module-${module.id}-header`}
        disabled={module.comingSoon}
      >
        {/* Module Number / Status Icon */}
        <div
          className={cn(
            'flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center font-mono font-bold text-sm border',
            module.comingSoon
              ? 'bg-zinc-900 text-zinc-600 border-zinc-800'
              : 'bg-zinc-900 text-white border-zinc-700'
          )}
        >
          {module.comingSoon ? (
            <Lock size={16} />
          ) : (
            <span>M{module.number}</span>
          )}
        </div>

        {/* Module Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <h2 className="text-base sm:text-lg font-bold text-white font-heading tracking-tight">
              Module {module.number}: {module.title}
            </h2>
            {module.comingSoon ? (
              <Badge variant="locked">Coming Soon</Badge>
            ) : pct === 100 ? (
              <Badge variant="solid">Completed</Badge>
            ) : pct > 0 ? (
              <Badge variant="outline">In Progress</Badge>
            ) : (
              <Badge variant="default">Not Started</Badge>
            )}
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-medium mb-1.5">
            {module.subtitle}
          </p>

          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1">
              <Terminal size={12} />
              {module.dayRange}
            </span>
            {!module.comingSoon && (
              <span>· {moduleProgress.done} of {moduleProgress.total} days checked</span>
            )}
          </div>

          {!module.comingSoon && (
            <div className="mt-3.5 max-w-sm">
              <ProgressBar value={pct} size="sm" />
            </div>
          )}
        </div>

        {/* Expand/Collapse Toggle */}
        {!module.comingSoon && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1 text-zinc-400"
          >
            <ChevronDown size={18} />
          </motion.div>
        )}
      </button>

      {/* Module Overview Description */}
      {!module.comingSoon && (
        <div className="px-5 sm:px-6 py-3 bg-[#0a0a0c] border-t border-zinc-800/80">
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {module.description}
          </p>
        </div>
      )}

      {/* Days Accordion List */}
      <AnimatePresence>
        {open && !module.comingSoon && (
          <motion.div
            id={`module-${module.id}-days`}
            role="region"
            aria-labelledby={`module-${module.id}-header`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-zinc-800"
          >
            <div className="p-4 sm:p-5 space-y-2.5 bg-[#09090b]">
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
    </div>
  );
}
