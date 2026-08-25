import { Link } from 'react-router-dom';
import { Menu, Shield, Award, Flame, User, Wifi } from 'lucide-react';
import { useCyberPath } from '@/context/CyberPathContext';

interface TopBarProps {
  onMenuClick: () => void;
  progress?: any;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { xp, streak, activeLab } = useCyberPath();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shrink-0 select-none font-mono">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded text-[#555555] hover:text-[#111111] hover:bg-[#F0F0F0] transition-colors"
          aria-label="Toggle navigation menu"
          id="mobile-menu-button"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded bg-[#111111] flex items-center justify-center text-white font-bold group-hover:bg-[#333333] transition-colors">
            <Shield size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm text-[#111111] tracking-widest leading-none">
              CYBERPATH
            </span>
            <span className="text-[9px] text-[#888888] tracking-widest uppercase mt-0.5">
              SECURITY TRAINING PLATFORM
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        {activeLab && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono text-[#111111]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">LAB ACTIVE</span>
            <span className="text-[#666666]">{activeLab.targetIp}</span>
          </div>
        )}

        <Link 
          to="/vpn"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono text-[#111111] hover:border-[#111111] transition-colors"
        >
          <Wifi size={12} className="text-emerald-600" />
          <span>VPN CONNECTED</span>
        </Link>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono text-[#111111]">
          <Award size={12} className="text-[#111111]" />
          <span className="font-bold">{xp.toLocaleString()} XP</span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-mono text-[#111111]">
          <Flame size={12} className="text-[#111111]" />
          <span className="font-bold">{streak}D STREAK</span>
        </div>

        <Link 
          to="/profile" 
          className="p-1.5 rounded bg-[#F7F7F7] border border-[#E5E5E5] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
          aria-label="User Profile"
        >
          <User size={16} />
        </Link>
      </div>
    </header>
  );
}
