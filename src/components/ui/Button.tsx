import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'bracket';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#111111] text-white border border-[#111111] hover:bg-[#333333] dark:bg-white dark:text-[#080808] dark:border-white dark:hover:bg-[#E5E5E5] font-mono font-semibold shadow-xs transition-all duration-200',
  secondary:
    'bg-white text-[#111111] border border-[#E5E5E5] hover:bg-[#F7F7F7] hover:border-[#111111] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:bg-[#181818] dark:hover:border-white font-mono font-medium transition-all duration-200',
  outline:
    'bg-transparent text-[#111111] border border-[#E5E5E5] hover:bg-[#F7F7F7] hover:border-[#111111] dark:text-white dark:border-[#2A2A2A] dark:hover:bg-[#181818] dark:hover:border-white font-mono font-medium transition-all duration-200',
  ghost:
    'bg-transparent text-[#555555] border border-transparent hover:bg-[#F7F7F7] hover:text-[#111111] dark:text-[#B5B5B5] dark:hover:bg-[#181818] dark:hover:text-white font-mono font-medium transition-all duration-200',
  bracket:
    'bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5] hover:border-[#111111] hover:bg-white dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white font-mono font-semibold tracking-wider transition-all duration-200',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-[4px]',
  md: 'px-4 py-2 text-sm gap-2 rounded-[6px]',
  lg: 'px-6 py-2.5 text-sm sm:text-base gap-2.5 rounded-[6px]',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -1 }}
      whileTap={{ scale: 0.98, translateY: 1 }}
      className={cn(
        'inline-flex items-center justify-center cursor-pointer transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-[#111111] dark:focus-visible:outline-white focus-visible:outline-offset-2',
        'disabled:opacity-40 disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
