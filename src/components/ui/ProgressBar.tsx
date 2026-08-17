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
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
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
    <div className={cn('w-full min-w-0 space-y-2', className)}>
      {(showLabel || label) && (
        <div className="flex items-start justify-between gap-3">
          {label && (
            <span className="min-w-0 text-xs leading-5 font-mono text-zinc-400 tracking-tight">{label}</span>
          )}
          {showLabel && (
            <span className="shrink-0 pt-0.5 text-xs font-mono font-medium text-white">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-zinc-900/80 border border-zinc-800/60 rounded-full overflow-hidden p-[1px]',
          heights[size]
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-white relative overflow-hidden"
          initial={animated ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
