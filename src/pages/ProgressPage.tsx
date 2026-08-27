import { useCyberPath } from '@/context/CyberPathContext';
import { rooms, learningPaths, challenges, badges } from '@/data/cyberpathData';
import { 
  Activity, 
  Award, 
  Flame, 
  Compass, 
  Terminal, 
  Target, 
  CheckCircle2, 
  Cpu,
  BarChart2
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function ProgressPage() {
  const {
    xp,
    level,
    levelName,
    streak,
    streakDays,
    completedRooms,
    completedChallenges,
    completedTasks,
    unlockedBadges,
    skills,
    recentActivity
  } = useCyberPath();

  const totalTasks = rooms.reduce((acc, r) => acc + r.tasks.length, 0);
  const totalCompletedTasksCount = completedTasks.size;
  const overallTaskPct = totalTasks > 0 ? Math.round((totalCompletedTasksCount / totalTasks) * 100) : 0;
  const overallRoomPct = rooms.length > 0 ? Math.round((completedRooms.length / rooms.length) * 100) : 0;
  const overallChallengePct = challenges.length > 0 ? Math.round((completedChallenges.length / challenges.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono pb-8">
      {/* Header (Rule 17, 25) */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6 space-y-1">
        <div className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest flex items-center gap-1.5">
          <Activity size={13} className="text-[#111111] dark:text-white" />
          <span>CENTRALIZED OPERATIVE ANALYTICS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
          PROGRESS & METRICS
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] max-w-2xl leading-relaxed font-sans">
          Complete centralized overview of your cybersecurity learning journey, path completions, lab verifications, and skill matrix.
        </p>
      </div>

      {/* 1. Primary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-2">
          <div className="flex items-center justify-between text-[#888888] dark:text-[#777777]">
            <span className="text-[10px] font-bold uppercase">LEVEL & RANK</span>
            <Award size={14} />
          </div>
          <p className="text-2xl font-extrabold text-[#111111] dark:text-white font-heading">LVL 0{level}</p>
          <span className="text-[10px] text-[#666666] dark:text-[#999999] block font-bold uppercase">{levelName}</span>
        </div>

        <div className="p-5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-2">
          <div className="flex items-center justify-between text-[#888888] dark:text-[#777777]">
            <span className="text-[10px] font-bold uppercase">TOTAL XP</span>
            <BarChart2 size={14} />
          </div>
          <p className="text-2xl font-extrabold text-[#111111] dark:text-white font-heading">{xp.toLocaleString()}</p>
          <span className="text-[10px] text-[#666666] dark:text-[#999999] block">Next Rank: {((level) * 1000).toLocaleString()} XP</span>
        </div>

        <div className="p-5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-2">
          <div className="flex items-center justify-between text-[#888888] dark:text-[#777777]">
            <span className="text-[10px] font-bold uppercase">DAILY STREAK</span>
            <Flame size={14} />
          </div>
          <p className="text-2xl font-extrabold text-[#111111] dark:text-white font-heading">0{streak} DAYS</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">● Active Operative</span>
        </div>

        <div className="p-5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-2">
          <div className="flex items-center justify-between text-[#888888] dark:text-[#777777]">
            <span className="text-[10px] font-bold uppercase">TOTAL TASKS</span>
            <CheckCircle2 size={14} />
          </div>
          <p className="text-2xl font-extrabold text-[#111111] dark:text-white font-heading">{totalCompletedTasksCount} / {totalTasks}</p>
          <span className="text-[10px] text-[#666666] dark:text-[#999999] block">{overallTaskPct}% Verified</span>
        </div>
      </div>

      {/* 2. Platform Completion Meters (Learning Paths, Labs, Challenges, Credentials) */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-6 shadow-sm">
        <h2 className="text-sm font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-wide border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          GLOBAL PLATFORM COMPLETION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Labs Progress */}
          <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111111] dark:text-white uppercase flex items-center gap-1.5">
                <Terminal size={14} /> PRACTICAL LABS
              </span>
              <span className="text-xs font-bold text-[#111111] dark:text-white">{overallRoomPct}%</span>
            </div>
            <ProgressBar value={overallRoomPct} size="md" />
            <div className="flex justify-between text-[10px] text-[#666666] dark:text-[#999999] font-mono">
              <span>Completed: {completedRooms.length}</span>
              <span>Total: {rooms.length} Labs</span>
            </div>
          </div>

          {/* Challenges Progress */}
          <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111111] dark:text-white uppercase flex items-center gap-1.5">
                <Target size={14} /> CTF CHALLENGES
              </span>
              <span className="text-xs font-bold text-[#111111] dark:text-white">{overallChallengePct}%</span>
            </div>
            <ProgressBar value={overallChallengePct} size="md" />
            <div className="flex justify-between text-[10px] text-[#666666] dark:text-[#999999] font-mono">
              <span>Solved: {completedChallenges.length}</span>
              <span>Total: {challenges.length} Missions</span>
            </div>
          </div>

          {/* Badges Progress */}
          <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111111] dark:text-white uppercase flex items-center gap-1.5">
                <Award size={14} /> CLEARANCE BADGES
              </span>
              <span className="text-xs font-bold text-[#111111] dark:text-white">
                {Math.round((unlockedBadges.length / badges.length) * 100)}%
              </span>
            </div>
            <ProgressBar value={Math.round((unlockedBadges.length / badges.length) * 100)} size="md" />
            <div className="flex justify-between text-[10px] text-[#666666] dark:text-[#999999] font-mono">
              <span>Unlocked: {unlockedBadges.length}</span>
              <span>Total: {badges.length} Badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Learning Paths Progress Breakdown */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <h2 className="text-sm font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-wide border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3 flex items-center gap-2">
          <Compass size={15} />
          CAREER LEARNING PATHS BREAKDOWN
        </h2>

        <div className="space-y-4">
          {learningPaths.map((path) => {
            const pathRooms = rooms.filter(r => path.roomIds.includes(r.id));
            const pathDoneCount = pathRooms.filter(r => completedRooms.includes(r.id)).length;
            const pathPct = pathRooms.length > 0 ? Math.round((pathDoneCount / pathRooms.length) * 100) : 0;

            return (
              <div key={path.id} className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-[#111111] dark:text-white uppercase font-heading">
                      {path.title}
                    </h3>
                    <span className="text-[10px] text-[#888888] dark:text-[#777777] font-mono">
                      {path.difficulty} • {path.estimatedTime} • +{path.xpReward} XP
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#111111] dark:text-white font-mono">
                    {pathDoneCount} / {pathRooms.length} Modules ({pathPct}%)
                  </span>
                </div>
                <ProgressBar value={pathPct} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Skills Radar & Streak Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Security Skill Mastery Matrix */}
        <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
            <Cpu size={14} className="text-[#111111] dark:text-white" />
            SECURITY SKILLS MATRIX
          </h3>

          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                <span>NETWORKING & PROTOCOLS</span>
                <span>{skills.networking}%</span>
              </div>
              <ProgressBar value={skills.networking} size="sm" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                <span>LINUX ADMINISTRATION</span>
                <span>{skills.linux}%</span>
              </div>
              <ProgressBar value={skills.linux} size="sm" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                <span>WEB VULNERABILITIES & PENTESTING</span>
                <span>{skills.webSecurity}%</span>
              </div>
              <ProgressBar value={skills.webSecurity} size="sm" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                <span>SECURITY AUTOMATION & DEFENSE</span>
                <span>{skills.python}%</span>
              </div>
              <ProgressBar value={skills.python} size="sm" />
            </div>
          </div>
        </div>

        {/* Active Streak Calendar */}
        <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
            <Flame size={14} className="text-[#111111] dark:text-white" />
            WEEKLY STREAK ACTIVITY
          </h3>

          <div className="space-y-3 pt-1">
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
              Solve at least one task or challenge daily to maintain your active operative streak.
            </p>

            <div className="grid grid-cols-7 gap-1.5 bg-[#F7F7F7] dark:bg-[#181818] p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A]">
              {Object.entries(streakDays).map(([day, checked]) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] text-[#888888] dark:text-[#777777] font-bold">{day}</span>
                  <div className={`w-6 h-6 rounded border flex items-center justify-center text-xs font-bold ${
                    checked 
                      ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-black' 
                      : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-transparent'
                  }`}>
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Complete Auditor Activities Feed */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Activity size={14} className="text-[#111111] dark:text-white" />
          FULL AUDITOR ACTIVITIES LOG ({recentActivity.length})
        </h3>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {recentActivity.map((act) => (
            <div key={act.id} className="text-xs border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2.5 flex items-center justify-between gap-4">
              <p className="font-sans text-[#111111] dark:text-white font-medium">{act.text}</p>
              <span className="text-[10px] text-[#888888] dark:text-[#777777] font-mono shrink-0">
                {new Date(act.timestamp).toLocaleDateString()} {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
