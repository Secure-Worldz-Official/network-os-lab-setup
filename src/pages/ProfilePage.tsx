import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCyberPath } from '@/context/CyberPathContext';
import { badges as allBadges } from '@/data/cyberpathData';
import { Trophy, Award, Activity, Cpu, Settings, Edit3, Check, X } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function ProfilePage() {
  const {
    username,
    setUsername,
    xp,
    level,
    levelName,
    streak,
    unlockedBadges,
    completedRooms,
    completedChallenges,
    skills,
    recentActivity,
    getLeaderboard
  } = useCyberPath();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);

  const leaderboard = getLeaderboard();
  const userRank = leaderboard.find(e => e.isCurrentUser)?.rank || 1;

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono pb-8">
      
      {/* 1. OPERATIVE IDENTITY BANNER (Rule 19) */}
      <div className="p-6 sm:p-8 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] font-mono text-xl font-bold uppercase shrink-0">
            {username.slice(0, 2)}
          </div>

          <div className="space-y-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white dark:bg-[#101010] border border-[#111111] dark:border-white rounded px-2.5 py-1 text-sm text-[#111111] dark:text-white outline-none font-mono uppercase font-bold"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded bg-[#111111] dark:bg-white text-white dark:text-black hover:opacity-80"
                  title="Save Name"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => {
                    setTempName(username);
                    setIsEditingName(false);
                  }}
                  className="p-1.5 rounded bg-[#E5E5E5] dark:bg-[#202020] text-[#111111] dark:text-white"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl sm:text-3xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
                  {username}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white p-1"
                  title="Edit Call Sign"
                >
                  <Edit3 size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span className="text-[10px] text-[#111111] dark:text-white bg-white dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] px-2 py-0.5 rounded font-bold uppercase">
                GLOBAL RANK #{userRank}
              </span>
              <span className="text-[10px] text-white dark:text-black bg-[#111111] dark:bg-white px-2 py-0.5 rounded font-bold uppercase">
                {levelName}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Summary & Edit Settings CTA (Rule 19) */}
        <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-[#E5E5E5] dark:border-[#2A2A2A] pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
          <div className="flex gap-6 text-center">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase text-[#888888] dark:text-[#777777] font-bold block">LEVEL</span>
              <p className="text-2xl font-extrabold font-mono text-[#111111] dark:text-white">0{level}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase text-[#888888] dark:text-[#777777] font-bold block">TOTAL XP</span>
              <p className="text-2xl font-extrabold font-mono text-[#111111] dark:text-white">{xp.toLocaleString()}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase text-[#888888] dark:text-[#777777] font-bold block">STREAK</span>
              <p className="text-2xl font-extrabold font-mono text-[#111111] dark:text-white">0{streak}D</p>
            </div>
          </div>

          <Link to="/settings" className="w-full sm:w-auto">
            <button className="btn-cyber-secondary text-xs py-2 px-4 w-full sm:w-auto flex items-center justify-center gap-1.5">
              <Settings size={13} />
              <span>EDIT SETTINGS</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 2. PROFILE BODY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Skills & Verification Summary */}
        <div className="space-y-6">
          
          {/* Skill Matrix */}
          <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
              <Cpu size={14} className="text-[#111111] dark:text-white" />
              SECURITY SKILLS MATRIX
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                  <span>NETWORKING</span>
                  <span>{skills.networking}%</span>
                </div>
                <ProgressBar value={skills.networking} size="sm" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                  <span>LINUX CLI</span>
                  <span>{skills.linux}%</span>
                </div>
                <ProgressBar value={skills.linux} size="sm" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                  <span>WEB SECURITY</span>
                  <span>{skills.webSecurity}%</span>
                </div>
                <ProgressBar value={skills.webSecurity} size="sm" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                  <span>DEFENSIVE AUTOMATION</span>
                  <span>{skills.python}%</span>
                </div>
                <ProgressBar value={skills.python} size="sm" />
              </div>
            </div>
          </div>

          {/* Training Stats Card */}
          <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
              TRAINING SUMMARY
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#666666] dark:text-[#999999]">
                <span>Practical Labs Solved:</span>
                <span className="font-bold text-[#111111] dark:text-white">{completedRooms.length} Labs</span>
              </div>
              <div className="flex justify-between text-[#666666] dark:text-[#999999]">
                <span>CTF Missions Solved:</span>
                <span className="font-bold text-[#111111] dark:text-white">{completedChallenges.length} Solved</span>
              </div>
              <div className="flex justify-between text-[#666666] dark:text-[#999999]">
                <span>Credentials Earned:</span>
                <span className="font-bold text-[#111111] dark:text-white">{unlockedBadges.length} Badges</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Clearance Badges & Activities */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Earned Badges Showcase */}
          <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
              <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Award size={14} className="text-[#111111] dark:text-white" />
                EARNED CLEARANCE CREDENTIALS ({unlockedBadges.length})
              </h3>
              <Link to="/achievements" className="text-[10px] text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white font-bold">
                VIEW ALL →
              </Link>
            </div>

            {unlockedBadges.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-[#666666] dark:text-[#999999] font-sans">
                  No badges unlocked yet. Complete practical labs or challenges to claim your first badge.
                </p>
                <Link to="/labs" className="inline-block pt-1">
                  <button className="btn-cyber-secondary text-xs py-1.5 px-4">
                    START A LAB →
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {allBadges.map((badge) => {
                  const unlocked = unlockedBadges.includes(badge.id);
                  if (!unlocked) return null;

                  return (
                    <div 
                      key={badge.id}
                      className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] text-center flex flex-col items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-black">
                        <Trophy size={14} />
                      </div>
                      <span className="text-[10px] font-bold text-[#111111] dark:text-white truncate w-full block uppercase">{badge.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
              <Activity size={14} className="text-[#111111] dark:text-white" />
              RECENT AUDITOR ACTIVITIES FEED
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {recentActivity.map((act) => (
                <div key={act.id} className="text-xs text-[#111111] dark:text-white space-y-0.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
                  <p className="leading-normal font-sans text-[#111111] dark:text-white font-semibold">{act.text}</p>
                  <span className="text-[9px] text-[#888888] dark:text-[#777777] font-bold block">
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
