import { useCyberPath } from '@/context/CyberPathContext';
import { badges as allBadges } from '@/data/cyberpathData';
import { Trophy, Flame, Award, Activity, Cpu } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function ProfilePage() {
  const {
    username,
    xp,
    level,
    levelName,
    streak,
    streakDays,
    unlockedBadges,
    skills,
    recentActivity,
    getLeaderboard
  } = useCyberPath();

  const leaderboard = getLeaderboard();
  const userRank = leaderboard.find(e => e.isCurrentUser)?.rank || 1;

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono">
      
      {/* USER SUMMARY BANNER */}
      <div className="p-6 sm:p-8 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-[#111111] flex items-center justify-center text-white font-mono text-xl font-bold uppercase">
            {username.slice(0, 2)}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#111111] font-heading tracking-tight uppercase">{username}</h1>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] text-[#111111] bg-white border border-[#E5E5E5] px-2 py-0.5 rounded font-bold uppercase">
                RANK #{userRank}
              </span>
              <span className="text-[10px] text-white bg-[#111111] px-2 py-0.5 rounded font-bold uppercase">
                {levelName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 text-center shrink-0 border-t sm:border-t-0 sm:border-l border-[#E5E5E5] pt-4 sm:pt-0 sm:pl-6">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase text-[#888888] font-bold block">LEVEL</span>
            <p className="text-2xl font-extrabold font-mono text-[#111111]">0{level}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase text-[#888888] font-bold block">TOTAL XP</span>
            <p className="text-2xl font-extrabold font-mono text-[#111111]">{xp.toLocaleString()}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase text-[#888888] font-bold block">STREAK</span>
            <p className="text-2xl font-extrabold font-mono text-[#111111]">0{streak}D</p>
          </div>
        </div>
      </div>

      {/* PROFILE BODY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column (Skills & Streak) */}
        <div className="space-y-6">
          
          {/* Skill Matrix */}
          <div className="p-6 rounded-md border border-[#E5E5E5] bg-white space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
              <Cpu size={14} className="text-[#111111]" />
              SECURITY SKILLS MAP
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#111111]">
                  <span>NETWORKING BASICS</span>
                  <span>{skills.networking}%</span>
                </div>
                <ProgressBar value={skills.networking} size="sm" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#111111]">
                  <span>LINUX ADMINISTRATION</span>
                  <span>{skills.linux}%</span>
                </div>
                <ProgressBar value={skills.linux} size="sm" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#111111]">
                  <span>WEB VULNERABILITIES</span>
                  <span>{skills.webSecurity}%</span>
                </div>
                <ProgressBar value={skills.webSecurity} size="sm" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#111111]">
                  <span>SECURITY AUTOMATION</span>
                  <span>{skills.python}%</span>
                </div>
                <ProgressBar value={skills.python} size="sm" />
              </div>
            </div>
          </div>

          {/* Streak details */}
          <div className="p-6 rounded-md border border-[#E5E5E5] bg-white space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
              <Flame size={14} className="text-[#111111]" />
              ACTIVE STREAK CALENDAR
            </h3>
            
            <div className="grid grid-cols-7 gap-1 bg-[#F7F7F7] p-3 rounded border border-[#E5E5E5]">
              {Object.entries(streakDays).map(([day, checked]) => (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-[#888888] font-bold">{day}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                    checked 
                      ? 'bg-[#111111] border-[#111111] text-white' 
                      : 'border-[#E5E5E5] bg-white text-transparent'
                  }`}>
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Badges & Activity) */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="p-6 rounded-md border border-[#E5E5E5] bg-white space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
              <Award size={14} className="text-[#111111]" />
              CLEARANCE BADGES ({unlockedBadges.length} UNLOCKED)
            </h3>

            {unlockedBadges.length === 0 ? (
              <p className="text-xs text-[#555555] font-sans leading-normal">
                No badges unlocked yet. Complete practical rooms or challenges to claim your first badge.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {allBadges.map((badge) => {
                  const unlocked = unlockedBadges.includes(badge.id);
                  if (!unlocked) return null;

                  return (
                    <div 
                      key={badge.id}
                      className="p-3 rounded border border-[#E5E5E5] bg-[#FAFAFA] text-center flex flex-col items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white">
                        <Trophy size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-[#111111] truncate w-full block uppercase">{badge.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-6 rounded-md border border-[#E5E5E5] bg-white space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
              <Activity size={14} className="text-[#111111]" />
              AUDITOR ACTIVITIES FEED
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {recentActivity.map((act) => (
                <div key={act.id} className="text-xs text-[#111111] space-y-0.5 border-b border-[#E5E5E5] pb-2">
                  <p className="leading-normal font-sans text-[#111111] font-semibold">{act.text}</p>
                  <span className="text-[9px] text-[#888888] font-bold block">
                    {new Date(act.timestamp).toLocaleDateString()} AT {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
