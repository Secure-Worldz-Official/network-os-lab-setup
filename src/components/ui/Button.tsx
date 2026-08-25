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
    'bg-black text-white border border-white hover:bg-white hover:text-black hover:border-white font-mono font-semibold shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200',
  secondary:
    'bg-black/60 text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-400 font-mono font-medium transition-all duration-200',
  outline:
    'bg-transparent text-zinc-300 border border-zinc-700 hover:bg-zinc-900 hover:text-white hover:border-white font-mono font-medium transition-all duration-200',
  ghost:
    'bg-transparent text-zinc-400 border border-transparent hover:bg-zinc-900/80 hover:text-white font-mono font-medium transition-all duration-200',
  bracket:
    'bg-zinc-950 text-white border border-zinc-700 hover:border-white hover:bg-zinc-900 font-mono font-semibold tracking-wider transition-all duration-200 shadow-[0_0_10px_rgba(0,0,0,0.8)]',
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
