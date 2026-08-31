import { Link } from 'react-router-dom';
import { useCyberPath } from '@/context/CyberPathContext';
import { useProgress } from '@/hooks/useProgress';
import { rooms } from '@/data/cyberpathData';
import { roadmap } from '@/data/roadmap';
import { Compass, Terminal, Shield, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function DashboardPage() {
  const { username, xp, level, levelName, completedRooms, activeLab } = useCyberPath();
  const progress = useProgress();
  const overall = progress.overallProgress();
  const overallPct = overall.total > 0 ? Math.round((overall.done / overall.total) * 100) : 0;

  // Find the user's next incomplete lesson from Learning Lab
  let pendingLesson: { module: typeof roadmap[0]; day: typeof roadmap[0]['days'][0] } | null = null;
  for (const mod of roadmap) {
    for (const d of mod.days) {
      if (!progress.isComplete(mod.id, d.id)) {
        pendingLesson = { module: mod, day: d };
        break;
      }
    }
    if (pendingLesson) break;
  }

  // Find user's pending / next experiment from Experiment Lab
  const activeRoom = activeLab ? rooms.find((r) => r.id === activeLab.roomId) : null;
  const pendingExperiment = activeRoom || rooms.find((r) => !completedRooms.includes(r.id)) || rooms[0];

  return (
    <div className="max-w-5xl mx-auto space-y-10 select-none font-mono pb-16">
      {/* ─── SECTION 1: PERSONALIZED WELCOME & PROGRESS SUMMARY ─── */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest">
              <Shield size={14} className="text-[#111111] dark:text-white" />
              <span>OPERATIVE OVERVIEW // COMMAND DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase leading-tight">
              WELCOME BACK, {username.toUpperCase()}.
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-2xl leading-relaxed">
              Clearance Level {level} — {levelName}. Review your active learning path and launch practical experiment targets.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <div className="p-3.5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] text-right space-y-0.5">
              <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">ACCUMULATED XP</span>
              <span className="text-lg font-extrabold text-[#111111] dark:text-white font-heading">{xp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Real Overall Progress Summary Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs font-bold text-[#111111] dark:text-white">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] font-mono">
              CURRICULUM OVERALL COMPLETION
            </span>
            <span>{overall.done} / {overall.total} LESSONS COMPLETED ({overallPct}%)</span>
          </div>
          <ProgressBar value={overallPct} size="md" />
        </div>
      </div>

      {/* ─── SECTION 2: PENDING FROM LEARNING LAB ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <Compass size={18} className="text-[#111111] dark:text-white" />
            <h2 className="text-base font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-wide">
              PENDING FROM LEARNING LAB
            </h2>
          </div>
          <Link
            to="/learn"
            className="text-xs font-bold text-[#111111] dark:text-white hover:underline flex items-center gap-1.5 font-mono"
          >
            <span>VIEW ALL LESSONS</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {pendingLesson ? (
          <div className="p-6 sm:p-7 rounded-2xl border border-[#111111] dark:border-white bg-white dark:bg-[#141414] space-y-5 shadow-xs transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white uppercase font-mono">
                    MODULE 0{pendingLesson.module.number}
                  </span>
                  <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] font-mono uppercase">
                    DAY 0{pendingLesson.day.id}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
                  {pendingLesson.day.title}
                </h3>
              </div>

              <Link
                to={`/roadmap/${pendingLesson.module.id}/${pendingLesson.day.slug}`}
                className="btn-cyber-primary text-xs py-3 px-6 shrink-0 flex items-center gap-2"
                id="dashboard-resume-learning-cta"
              >
                <Play size={14} className="fill-current" />
                <span>RESUME LESSON →</span>
              </Link>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                {pendingLesson.day.learn[0]}
              </p>

              <div className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-2 font-mono text-xs">
                <span className="text-[10px] font-bold uppercase text-[#888888] dark:text-[#777777] block">
                  KEY OBJECTIVE:
                </span>
                <p className="text-[#111111] dark:text-white font-sans text-xs">
                  {pendingLesson.day.doLab[0] || 'Complete interactive visual demonstration and confirm technical concepts.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] text-center space-y-3">
            <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-[#111111] dark:text-white uppercase font-heading">
              ALL LEARNING LAB LESSONS COMPLETED
            </h3>
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans">
              You have completed all current curriculum modules!
            </p>
          </div>
        )}
      </div>

      {/* ─── SECTION 3: PENDING FROM EXPERIMENT LAB ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <Terminal size={18} className="text-[#111111] dark:text-white" />
            <h2 className="text-base font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-wide">
              PENDING FROM EXPERIMENT LAB
            </h2>
          </div>
          <Link
            to="/labs"
            className="text-xs font-bold text-[#111111] dark:text-white hover:underline flex items-center gap-1.5 font-mono"
          >
            <span>EXPLORE ALL EXPERIMENTS</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {pendingExperiment ? (
          <div className="p-6 sm:p-7 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-xs transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                    {activeLab ? '● ACTIVE SESSION' : 'READY TO START'}
                  </span>
                  <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] font-mono uppercase">
                    {pendingExperiment.category}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
                  {pendingExperiment.title}
                </h3>
              </div>

              <Link
                to={`/labs/${pendingExperiment.id}`}
                className="btn-cyber-primary text-xs py-3 px-6 shrink-0 flex items-center gap-2"
                id="dashboard-resume-experiment-cta"
              >
                <Terminal size={14} />
                <span>{activeLab ? 'RESUME EXPERIMENT →' : 'LAUNCH EXPERIMENT →'}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              <div className="col-span-2 space-y-2">
                <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                  {pendingExperiment.description}
                </p>
                <div className="flex items-center gap-3 pt-2 text-[11px] text-[#888888] dark:text-[#777777]">
                  <span>DIFFICULTY: <strong className="text-[#111111] dark:text-white">{pendingExperiment.difficulty.toUpperCase()}</strong></span>
                  <span>·</span>
                  <span>ESTIMATED: <strong className="text-[#111111] dark:text-white">{pendingExperiment.duration.toUpperCase()}</strong></span>
                  <span>·</span>
                  <span>REWARD: <strong className="text-[#111111] dark:text-white">+{pendingExperiment.xp} XP</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">TARGET ENVIRONMENT</span>
                  <p className="font-extrabold text-[#111111] dark:text-white text-sm">10.10.20.15</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                    ● PRIVATE SUBNET READY
                  </span>
                </div>
                <div className="text-[10px] text-[#888888] dark:text-[#777777] pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                  Tasks: {pendingExperiment.tasks.filter(() => completedRooms.includes(pendingExperiment.id)).length} / {pendingExperiment.tasks.length} Completed
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] text-center space-y-3">
            <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-[#111111] dark:text-white uppercase font-heading">
              ALL EXPERIMENTS SOLVED
            </h3>
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans">
              You have completed all available practical lab experiments!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
