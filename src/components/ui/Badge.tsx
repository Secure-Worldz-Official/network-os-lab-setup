import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'solid' | 'outline' | 'locked' | 'success';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-900 border-zinc-800 text-zinc-300',
  solid: 'bg-white border-white text-black font-semibold',
  outline: 'bg-transparent border-zinc-700 text-zinc-300',
  locked: 'bg-zinc-950/80 border-zinc-800 text-zinc-500',
  success: 'bg-zinc-900 border-zinc-700 text-zinc-100 font-medium',
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
