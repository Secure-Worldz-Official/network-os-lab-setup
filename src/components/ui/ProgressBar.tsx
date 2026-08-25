import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const heights = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  size = 'md',
  showLabel = false,
  label,
  className,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full min-w-0 space-y-1.5 font-mono', className)}>
      {(showLabel || label) && (
        <div className="flex items-start justify-between gap-3">
          {label && (
            <span className="min-w-0 text-xs text-[#666666] dark:text-[#B5B5B5] tracking-tight">{label}</span>
          )}
          {showLabel && (
            <span className="shrink-0 text-xs font-bold text-[#111111] dark:text-white">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[#EEEEEE] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-full overflow-hidden p-[1px]',
          heights[size]
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-[#111111] dark:bg-white relative overflow-hidden"
          initial={animated ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
