import { useState } from 'react';
import { useCyberPath } from '@/context/CyberPathContext';
import { badges } from '@/data/cyberpathData';
import { Trophy, Globe, Terminal, Flame, Sparkles, CheckCircle, Bug, Lock } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

const iconMap: Record<string, any> = {
  Trophy,
  Globe,
  Terminal,
  Flame,
  Sparkles,
  CheckCircle,
  Bug
};

type BadgeFilter = 'All' | 'Unlocked' | 'Locked';

export function AchievementsPage() {
  const { unlockedBadges } = useCyberPath();
  const [filter, setFilter] = useState<BadgeFilter>('All');

  const unlockedCount = unlockedBadges.length;
  const totalCount = badges.length;
  const progressPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const filteredBadges = badges.filter((b) => {
    const isUnlocked = unlockedBadges.includes(b.id);
    if (filter === 'Unlocked') return isUnlocked;
    if (filter === 'Locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono pb-8">
      {/* Header (Rule 18, 25) */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6 space-y-2">
        <div className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest flex items-center gap-1.5">
          <Trophy size={13} className="text-[#111111] dark:text-white" />
          <span>CLEARANCE CREDENTIALS & BADGES</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
          ACHIEVEMENTS
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] max-w-2xl leading-relaxed font-sans">
          Unlock collectible cybersecurity credentials by completing practical labs, solving tactical CTF challenges, maintaining streaks, and mastering security domains.
        </p>

        {/* Global Achievements Progress Bar */}
        <div className="pt-3 max-w-md space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-[#111111] dark:text-white">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777]">UNLOCKED CREDENTIALS</span>
            <span>{unlockedCount} / {totalCount} ({progressPct}%)</span>
          </div>
          <ProgressBar value={progressPct} size="sm" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
        {(['All', 'Unlocked', 'Locked'] as BadgeFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer border uppercase tracking-wider font-bold ${
              filter === f
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white'
                : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#666666] dark:text-[#999999] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            {f === 'All' ? `ALL BADGES (${badges.length})` : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const IconComp = iconMap[badge.icon] || Trophy;

          return (
            <div 
              key={badge.id}
              className={`p-6 rounded-md border flex flex-col items-center text-center space-y-4 transition-all ${
                isUnlocked 
                  ? 'bg-white dark:bg-[#141414] border-[#111111] dark:border-white shadow-sm' 
                  : 'bg-[#FAFAFA] dark:bg-[#101010] border-[#E5E5E5] dark:border-[#2A2A2A] opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                isUnlocked 
                  ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-[#080808]' 
                  : 'bg-[#F7F7F7] dark:bg-[#181818] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#888888] dark:text-[#777777]'
              }`}>
                {isUnlocked ? <IconComp size={24} /> : <Lock size={20} />}
              </div>

              {/* Title & description */}
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold tracking-wide uppercase font-heading text-[#111111] dark:text-white">
                  {badge.title}
                </h3>
                <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans max-w-[220px] mx-auto">
                  {badge.description}
                </p>
              </div>

              {/* Status Tag */}
              <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A] w-full text-[10px] font-mono">
                {isUnlocked ? (
                  <span className="text-[#111111] dark:text-white font-extrabold tracking-widest uppercase">
                    ✓ UNLOCKED (+{badge.xpReward} XP)
                  </span>
                ) : (
                  <span className="text-[#888888] dark:text-[#777777] tracking-widest uppercase font-bold">
                    LOCKED (+{badge.xpReward} XP)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
