import { Link } from 'react-router-dom';
import { Menu, Shield, Flame } from 'lucide-react';
import type { useProgress } from '@/hooks/useProgress';

type ProgressAPI = ReturnType<typeof useProgress>;

interface TopBarProps {
  onMenuClick: () => void;
  progress: ProgressAPI;
}

export function TopBar({ onMenuClick, progress }: TopBarProps) {
  const overall = progress.overallProgress();

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--border)] z-30">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
        aria-label="Open navigation menu"
        id="mobile-menu-button"
      >
        <Menu size={20} />
      </button>

      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-[var(--accent-pale)] border border-[var(--accent-dim)] flex items-center justify-center">
          <Shield size={13} className="text-[var(--accent)]" />
        </div>
        <span className="font-[family-name:var(--font-heading)] font-bold text-sm text-[var(--text-primary)]">
          Cyber<span className="text-[var(--accent)]">Path</span>
        </span>
      </Link>

      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
        <Flame size={13} className={overall.done > 0 ? 'text-[var(--accent)]' : 'opacity-30'} />
        <span className="font-medium">
          {overall.done}/{overall.total}
        </span>
      </div>
    </header>
  );
}
