import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'accent' | 'success' | 'locked' | 'muted' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)]',
  accent: 'bg-[var(--accent-pale)] border-[var(--accent-dim)] text-red-400',
  success: 'bg-emerald-950/50 border-emerald-800 text-emerald-400',
  locked: 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50',
  muted: 'bg-transparent border-[var(--border-subtle)] text-[var(--text-muted)]',
  outline: 'bg-transparent border-[var(--border)] text-[var(--text-secondary)]',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border leading-none',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
