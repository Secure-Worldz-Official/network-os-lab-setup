import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'solid' | 'outline' | 'locked' | 'success';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-900/80 border-zinc-800/80 text-zinc-300 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]',
  solid: 'bg-white border-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.15),0_1px_2px_0_rgba(0,0,0,0.3)]',
  outline: 'bg-transparent border-zinc-700/80 text-zinc-300 shadow-[0_1px_2px_0_rgba(0,0,0,0.15)]',
  locked: 'bg-zinc-950/80 border-zinc-800/80 text-zinc-500 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]',
  success: 'bg-zinc-900 border-zinc-700 text-zinc-100 font-medium shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
