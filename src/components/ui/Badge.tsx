import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'solid' | 'outline' | 'locked' | 'success' | 'bracket';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[#F7F7F7] border-[#E5E5E5] text-[#111111] dark:bg-[#181818] dark:border-[#2A2A2A] dark:text-white shadow-xs',
  solid: 'bg-[#111111] border-[#111111] text-white dark:bg-white dark:border-white dark:text-[#080808] font-semibold shadow-xs',
  outline: 'bg-transparent border-[#E5E5E5] text-[#555555] dark:border-[#2A2A2A] dark:text-[#B5B5B5]',
  locked: 'bg-[#F5F5F5] border-[#E5E5E5] text-[#999999] dark:bg-[#121212] dark:border-[#202020] dark:text-[#555555]',
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium',
  bracket: 'bg-[#FAFAFA] border-[#E5E5E5] text-[#111111] dark:bg-[#141414] dark:border-[#2A2A2A] dark:text-white font-mono tracking-widest',
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
