import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Day } from '@/data/roadmap';
import { cn } from '@/lib/utils';

interface DayCardProps {
  day: Day;
  moduleId: string;
  isComplete: boolean;
  index: number;
}

export function DayCard({ day, moduleId, isComplete, index }: DayCardProps) {
  const to = `/roadmap/${moduleId}/${day.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={to}
        id={`day-card-${moduleId}-${day.id}`}
        className={cn(
          'group flex items-center gap-4 p-4 rounded-[var(--radius-md)]',
          'border transition-all duration-200',
          'hover:border-[var(--accent-dim)] hover:bg-[var(--bg-elevated)]',
          isComplete
            ? 'bg-emerald-950/20 border-emerald-900/50'
            : 'bg-[var(--bg-surface)] border-[var(--border)]'
        )}
      >
        {/* Check icon */}
        <div className="flex-shrink-0">
          {isComplete ? (
            <CheckCircle2 size={20} className="text-emerald-500" />
          ) : (
            <Circle size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-dim)] transition-colors" />
          )}
        </div>

        {/* Day number pill */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-sm font-bold"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {day.id}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-white transition-colors truncate" style={{ fontFamily: 'var(--font-heading)' }}>
              {day.title}
            </p>
            {isComplete && <Badge variant="success">Done</Badge>}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
            {day.learn[0]}
          </p>
        </div>

        {/* Meta + arrow */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Clock size={11} />
            <span>{day.resources.length} refs</span>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </Link>
    </motion.div>
  );
}
