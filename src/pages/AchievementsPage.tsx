import { useCyberPath } from '@/context/CyberPathContext';
import { badges } from '@/data/cyberpathData';
import { Trophy, Globe, Terminal, Flame, Sparkles, CheckCircle, Bug, Lock } from 'lucide-react';

const iconMap: Record<string, any> = {
  Trophy,
  Globe,
  Terminal,
  Flame,
  Sparkles,
  CheckCircle,
  Bug
};

export function AchievementsPage() {
  const { unlockedBadges } = useCyberPath();

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6 space-y-1">
        <div className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest flex items-center gap-1.5">
          <Trophy size={14} className="text-[#111111] dark:text-white" />
          <span>CLEARANCE CREDENTIALS & BADGES</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
          ACHIEVEMENTS
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] max-w-2xl leading-relaxed font-sans">
          Unlock collectible cybersecurity credentials by completing practical rooms, CTF tasks, daily missions, and advancing ranks.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {badges.map((badge) => {
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
                <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans max-w-[200px] mx-auto">
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
                    LOCKED
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
