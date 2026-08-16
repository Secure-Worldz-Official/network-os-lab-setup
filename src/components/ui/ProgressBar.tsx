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

const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' };

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
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold text-[var(--accent)] ml-auto">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn('progress-track w-full', heights[size])}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn('h-full rounded-full bg-[var(--accent)] relative', {
            'after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-2 after:h-2 after:rounded-full after:bg-red-400 after:shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]':
              clamped > 0 && size !== 'sm',
          })}
          initial={animated ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}
