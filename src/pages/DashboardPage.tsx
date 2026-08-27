import { Link } from 'react-router-dom';
import { useCyberPath } from '@/context/CyberPathContext';
import { rooms, learningPaths, badges } from '@/data/cyberpathData';
import { 
  Shield, 
  Terminal, 
  Activity, 
  ArrowRight,
  Trophy
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function DashboardPage() {
  const { 
    username, 
    xp, 
    level, 
    levelName, 
    streak, 
    completedRooms, 
    completedTasks,
    completedChallenges,
    unlockedBadges,
    activeLab,
    recentActivity
  } = useCyberPath();

  // Find user's active/current path and current room/task
  const currentPath = learningPaths[0];
  const activeRoomId = activeLab?.roomId || 'nmap-fundamentals';
  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];
  const currentTasksDone = currentRoom.tasks.filter(t => completedTasks.has(t.id)).length;
  const currentTaskProgressPct = currentRoom.tasks.length > 0 
    ? Math.round((currentTasksDone / currentRoom.tasks.length) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono pb-8">
      
      {/* 1. Command Center Header (Rule 7, 9, 25) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest mb-1.5">
            <Shield size={13} className="text-[#111111] dark:text-white" />
            <span>CYBERPATH COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase leading-none">
            WELCOME BACK, {username.toUpperCase()}.
          </h1>
          <p className="text-xs text-[#666666] dark:text-[#999999] font-sans mt-1.5">
            Track your training progress, resume your active virtual labs, and complete tactical CTF missions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/labs" className="btn-cyber-secondary text-xs py-2 px-4">
            <Terminal size={14} />
            <span>EXPLORE LABS</span>
          </Link>
        </div>
      </div>

      {/* 2. Current Learning Hero (Rule 7, 8, 9, 10, 11) - Clear Primary Action Hierarchy */}
      <div className="p-6 sm:p-7 rounded-md border border-[#111111] dark:border-white bg-white dark:bg-[#141414] space-y-5 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest block">
              // CURRENT LEARNING PATH: {currentPath.title.toUpperCase()}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
              CURRENT LEARNING
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/learn"
              className="btn-cyber-ghost text-xs py-2 px-3 hidden sm:inline-flex"
            >
              VIEW ALL PATHS
            </Link>
            {/* ONE OBVIOUS PRIMARY CTA (Rule 2 & 8) */}
            <Link
              to={`/labs/${currentRoom.id}`}
              className="btn-cyber-primary text-xs py-2.5 px-6 shrink-0"
              id="dashboard-continue-learning-cta"
            >
              <span>CONTINUE LEARNING →</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-3 col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777]">ACTIVE MODULE:</span>
              <span className="text-xs font-bold text-[#111111] dark:text-white font-heading uppercase">{currentRoom.title}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white uppercase">
                {currentRoom.difficulty}
              </span>
            </div>

            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
              {currentRoom.description}
            </p>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777]">TASK COMPLETION</span>
                <span>0{currentTasksDone} / 0{currentRoom.tasks.length} TASKS ({currentTaskProgressPct}%)</span>
              </div>
              <ProgressBar value={currentTaskProgressPct} size="md" />
            </div>
          </div>

          <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">TARGET LAB ENVIRONMENT</span>
              <p className="font-bold text-[#111111] dark:text-white text-sm">10.10.20.15</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                ● VPN PRIVATE ACCESS READY
              </span>
            </div>

            <div className="text-[11px] text-[#555555] dark:text-[#B5B5B5] space-y-1 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
              <div className="flex justify-between">
                <span>ESTIMATED TIME:</span>
                <span className="font-bold text-[#111111] dark:text-white">{currentRoom.duration.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>TASK REWARD:</span>
                <span className="font-bold text-[#111111] dark:text-white">+{currentRoom.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Lab Status or Empty State (Rule 9 & 29) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#111111] dark:text-white" />
            <h2 className="text-xs font-bold text-[#111111] dark:text-white font-heading uppercase tracking-wide">
              ACTIVE VIRTUAL LAB SESSION
            </h2>
          </div>
        </div>

        {activeLab ? (
          <div className="p-5 rounded-md border border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#141414] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-[#111111] dark:text-white font-heading uppercase">
                  {activeLab.roomTitle}
                </span>
                <span className="text-[10px] text-[#888888] dark:text-[#777777] font-mono">
                  ({activeLab.targetIp})
                </span>
              </div>
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans">
                Target instance is running. You can execute commands, query open ports, or analyze live web traffic.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={`/labs/${activeLab.roomId}`}
                className="btn-cyber-primary text-xs py-2 px-5"
              >
                <span>RESUME LAB →</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] text-center space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EFEFEF] dark:bg-[#1E1E1E] flex items-center justify-center mx-auto text-[#666666] dark:text-[#999999]">
              <Terminal size={16} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[#111111] dark:text-white uppercase font-heading">
                NO ACTIVE LAB RUNNING
              </h3>
              <p className="text-xs text-[#666666] dark:text-[#999999] font-sans max-w-sm mx-auto">
                You don't have an active lab instance right now. Choose a practical room to initialize a target machine.
              </p>
            </div>
            <Link to="/labs" className="inline-block pt-1">
              <button className="btn-cyber-secondary text-xs py-1.5 px-4">
                <span>EXPLORE ALL LABS →</span>
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* 4. Overall Progress Summary Grid (Rule 9 & 17 - Summary on Dashboard, Detail on /progress) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#111111] dark:text-white" />
            <h2 className="text-xs font-bold text-[#111111] dark:text-white font-heading uppercase tracking-wide">
              TRAINING PROGRESS OVERVIEW
            </h2>
          </div>
          <Link to="/progress" className="text-[11px] font-bold text-[#111111] dark:text-white hover:underline flex items-center gap-1">
            <span>VIEW FULL PROGRESS</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">OPERATIVE LEVEL</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white font-heading">LVL {level}</p>
            <span className="text-[10px] text-[#666666] dark:text-[#B5B5B5] truncate block">{levelName}</span>
          </div>

          <div className="p-4 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">TOTAL XP SCORE</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white font-heading">{xp.toLocaleString()}</p>
            <span className="text-[10px] text-[#666666] dark:text-[#B5B5B5] block">Clearance Rank #1</span>
          </div>

          <div className="p-4 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">DAILY STREAK</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white font-heading">{streak} DAYS</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">● Daily Active</span>
          </div>

          <div className="p-4 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">LABS SOLVED</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white font-heading">{completedRooms.length} / {rooms.length}</p>
            <span className="text-[10px] text-[#666666] dark:text-[#B5B5B5] block">{Math.round((completedRooms.length / rooms.length) * 100)}% Complete</span>
          </div>

          <div className="p-4 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">CTF CHALLENGES</span>
            <p className="text-lg font-extrabold text-[#111111] dark:text-white font-heading">{completedChallenges.length} SOLVED</p>
            <span className="text-[10px] text-[#666666] dark:text-[#B5B5B5] block">{unlockedBadges.length} Badges Earned</span>
          </div>
        </div>
      </div>

      {/* 5. Featured Practical Labs (Rule 9 & 13) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[#111111] dark:text-white" />
            <h2 className="text-sm font-bold text-[#111111] dark:text-white font-heading uppercase tracking-wide">
              FEATURED PRACTICAL LABS
            </h2>
          </div>
          <Link to="/labs" className="text-xs font-bold text-[#111111] dark:text-white hover:underline flex items-center gap-1">
            <span>VIEW ALL LABS ({rooms.length})</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {rooms.slice(0, 3).map((room) => {
            const isDone = completedRooms.includes(room.id);
            const doneTasksCount = room.tasks.filter(t => completedTasks.has(t.id)).length;

            return (
              <div key={room.id} className="cyber-card p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase">{room.category}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white uppercase">
                      {room.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#111111] dark:text-white font-heading uppercase leading-tight">
                    {room.title}
                  </h3>

                  <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <div className="flex justify-between text-[11px] text-[#666666] dark:text-[#B5B5B5]">
                    <span>TASKS: {doneTasksCount}/{room.tasks.length}</span>
                    <span className="font-bold text-[#111111] dark:text-white">+{room.xp} XP</span>
                  </div>

                  <Link
                    to={`/labs/${room.id}`}
                    className={isDone ? "block w-full text-center btn-cyber-secondary text-xs py-2" : "block w-full text-center btn-cyber-primary text-xs py-2"}
                  >
                    {isDone ? 'RE-VISIT LAB →' : 'START LAB →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Recent Security Activity & Achievements Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Activity Feed */}
        <div className="p-5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
            <h3 className="text-xs font-bold text-[#111111] dark:text-white font-heading uppercase tracking-wide flex items-center gap-2">
              <Activity size={13} />
              RECENT AUDITOR ACTIVITIES
            </h3>
            <Link to="/progress" className="text-[10px] text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white">
              ALL ACTIVITIES →
            </Link>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {recentActivity.slice(0, 4).map((act) => (
              <div key={act.id} className="text-xs border-b border-[#F0F0F0] dark:border-[#1E1E1E] pb-2 space-y-0.5">
                <p className="font-sans text-[#111111] dark:text-white font-medium truncate">{act.text}</p>
                <span className="text-[9px] text-[#888888] dark:text-[#777777] font-mono">
                  {new Date(act.timestamp).toLocaleDateString()} AT {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Clearance Credentials */}
        <div className="p-5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
            <h3 className="text-xs font-bold text-[#111111] dark:text-white font-heading uppercase tracking-wide flex items-center gap-2">
              <Trophy size={13} />
              CLEARANCE ACHIEVEMENTS ({unlockedBadges.length}/{badges.length})
            </h3>
            <Link to="/achievements" className="text-[10px] text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white">
              VIEW BADGES →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {badges.slice(0, 3).map((badge) => {
              const unlocked = unlockedBadges.includes(badge.id);
              return (
                <div 
                  key={badge.id} 
                  className={`p-3 rounded border text-center space-y-1.5 ${
                    unlocked 
                      ? 'bg-[#FAFAFA] dark:bg-[#181818] border-[#111111] dark:border-white' 
                      : 'bg-[#F7F7F7] dark:bg-[#101010] border-[#E5E5E5] dark:border-[#2A2A2A] opacity-60'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs ${
                    unlocked ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'bg-[#E5E5E5] dark:bg-[#202020] text-[#888888]'
                  }`}>
                    <Trophy size={12} />
                  </div>
                  <p className="text-[9px] font-bold text-[#111111] dark:text-white truncate uppercase">{badge.title}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
