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
          'group flex items-center justify-between gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-xl border transition-all duration-150 font-mono',
          isComplete
            ? 'bg-[#F7F7F7] dark:bg-[#181818] border-[#111111] dark:border-white shadow-xs'
            : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A] hover:bg-[#FAFAFA] dark:hover:bg-[#181818] hover:border-[#111111] dark:hover:border-zinc-500 shadow-xs'
        )}
      >
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
          {/* Status icon */}
          <div className="shrink-0">
            {isComplete ? (
              <CheckCircle2 size={18} className="text-[#111111] dark:text-white" />
            ) : (
              <Circle size={18} className="text-[#888888] dark:text-[#666666] group-hover:text-[#111111] dark:group-hover:text-white transition-colors" />
            )}
          </div>

          {/* Day number badge */}
          <div className="shrink-0 w-8 h-8 rounded-lg bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center text-xs font-mono font-bold text-[#111111] dark:text-white group-hover:border-[#111111] dark:group-hover:border-white transition-colors">
            {day.id < 10 ? `0${day.id}` : day.id}
          </div>

          {/* Title and summary */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-[#111111] dark:text-white group-hover:text-[#111111] dark:group-hover:text-white transition-colors truncate">
                {day.title}
              </span>
              {isComplete && (
                <Badge variant="solid" size="sm">
                  Complete
                </Badge>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-[#555555] dark:text-[#B5B5B5] mt-0.5 line-clamp-1 font-sans">
              {day.learn[0]}
            </p>
          </div>
        </div>

        {/* Action / Meta */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-[#888888] dark:text-[#777777] group-hover:text-[#111111] dark:group-hover:text-white transition-colors">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono">
            <BookOpen size={12} />
            <span>{day.resources.length} sources</span>
          </div>
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform text-[#888888] dark:text-[#777777] group-hover:text-[#111111] dark:group-hover:text-white" />
        </div>
      </Link>
    </motion.div>
  );
}
