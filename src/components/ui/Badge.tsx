import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'solid' | 'outline' | 'locked' | 'success' | 'bracket';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-950 border-zinc-800 text-zinc-300 shadow-sm',
  solid: 'bg-white border-white text-black font-semibold shadow-[0_0_10px_rgba(255,255,255,0.2)]',
  outline: 'bg-transparent border-zinc-700 text-zinc-200',
  locked: 'bg-zinc-950 border-zinc-900 text-zinc-600',
  success: 'bg-zinc-900 border-white/40 text-white font-medium shadow-[0_0_10px_rgba(255,255,255,0.1)]',
  bracket: 'bg-black border-zinc-800 text-zinc-300 font-mono tracking-widest',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[4px] border tracking-wider uppercase font-mono font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
