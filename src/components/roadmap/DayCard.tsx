import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ChevronRight, BookOpen } from 'lucide-react';
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
    >
      <Link
        to={to}
        id={`day-card-${moduleId}-${day.id}`}
        className={cn(
          'group flex items-center justify-between gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl border transition-all duration-150',
          isComplete
            ? 'bg-zinc-900/90 border-zinc-700 hover:border-zinc-500 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]'
            : 'bg-zinc-950/70 border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-650 shadow-[0_1px_2px_0_rgba(0,0,0,0.15)]'
        )}
      >
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          {/* Status icon */}
          <div className="shrink-0">
            {isComplete ? (
              <CheckCircle2 size={18} className="text-white" />
            ) : (
              <Circle size={18} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            )}
          </div>

          {/* Day number badge */}
          <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-zinc-300 group-hover:border-zinc-600 group-hover:text-white transition-colors">
            {day.id < 10 ? `0${day.id}` : day.id}
          </div>

          {/* Title and summary */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
                {day.title}
              </span>
              {isComplete && (
                <Badge variant="solid" size="sm">
                  Complete
                </Badge>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 line-clamp-1">
              {day.learn[0]}
            </p>
          </div>
        </div>

        {/* Action / Meta */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-colors">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono">
            <BookOpen size={12} />
            <span>{day.resources.length} sources</span>
          </div>
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform text-zinc-400 group-hover:text-white" />
        </div>
      </Link>
    </motion.div>
  );
}
