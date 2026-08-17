import { Link } from 'react-router-dom';
import { Menu, Shield, CheckCircle2 } from 'lucide-react';
import type { useProgress } from '@/hooks/useProgress';

type ProgressAPI = ReturnType<typeof useProgress>;

interface TopBarProps {
  onMenuClick: () => void;
  progress: ProgressAPI;
}

export function TopBar({ onMenuClick, progress }: TopBarProps) {
  const overall = progress.overallProgress();

  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/80 shrink-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
          aria-label="Toggle navigation drawer"
          id="mobile-menu-button"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <Shield size={14} />
          </div>
          <span className="font-heading font-bold text-sm text-white tracking-tight">
            CYBER<span className="text-zinc-400 font-normal">PATH</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
          <CheckCircle2 size={12} className="text-white" />
          <span>{overall.done}/{overall.total}</span>
        </div>
      </div>
    </header>
  );
}
