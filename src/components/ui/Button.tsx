import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-black border border-white hover:bg-zinc-100 hover:border-zinc-100 font-semibold shadow-[0_0_24px_rgba(255,255,255,0.12),0_1px_2px_0_rgba(0,0,0,0.3)]',
  secondary:
    'bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 font-medium shadow-[0_1px_2px_0_rgba(0,0,0,0.3)]',
  outline:
    'bg-transparent text-zinc-200 border border-zinc-700 hover:bg-zinc-900/60 hover:border-zinc-500 font-medium shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]',
  ghost:
    'bg-transparent text-zinc-400 border border-transparent hover:bg-zinc-900/60 hover:text-zinc-100 font-medium',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
  md: 'px-4 py-2 text-sm gap-2 rounded-md',
  lg: 'px-6 py-2.5 text-sm sm:text-base gap-2.5 rounded-lg',
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
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        'inline-flex items-center justify-center cursor-pointer transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
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
