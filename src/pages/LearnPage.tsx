import { Link } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { useCyberPath } from '@/context/CyberPathContext';
import { CandyCrushPath } from '@/components/lesson/CandyCrushPath';
import { Compass, Layers, Clock, Award } from 'lucide-react';
import { learningPaths, rooms } from '@/data/cyberpathData';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function LearnPage() {
  const { completedRooms } = useCyberPath();
  const progress = useProgress();
  const overall = progress.overallProgress();
  const overallPct = overall.total > 0 ? Math.round((overall.done / overall.total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12 select-none font-mono pb-16">
      {/* ─── PAGE HEADER ─── */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest">
          <Compass size={14} className="text-[#111111] dark:text-white" />
          <span>CYBERPATH // LEARNING LAB</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
              LEARNING LAB CURRICULUM
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-2xl leading-relaxed mt-1">
              Progress through our continuous level roadmap. Each lesson pairs concise theory with a fully interactive visual explainer.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-right space-y-1">
              <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777] block">ROADMAP PROGRESS</span>
              <span className="text-sm font-extrabold text-[#111111] dark:text-white font-heading">
                {overall.done} / {overall.total} LESSONS ({overallPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CANDY CRUSH STYLE VERTICAL SCROLL LEVEL PATH (STRICT REQUIREMENT 5) ─── */}
      <section className="bg-[#FAFAFA]/50 dark:bg-[#0D0D0D]/50 border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-4 sm:p-8">
        <CandyCrushPath
          isComplete={(moduleId, dayId) => progress.isComplete(moduleId, dayId)}
        />
      </section>

      {/* ─── CAREER LEARNING TRACKS (PRESERVED CONTENT) ─── */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#111111] dark:text-white" />
            <h2 className="text-sm font-bold text-[#111111] dark:text-white uppercase font-heading tracking-wider">
              SPECIALIZED CAREER PATHWAYS
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {learningPaths.map((path) => {
            const pathRooms = rooms.filter((r) => path.roomIds.includes(r.id));
            const completedPathRooms = pathRooms.filter((r) => completedRooms.includes(r.id)).length;
            const pathProgressPct = pathRooms.length > 0 ? Math.round((completedPathRooms / pathRooms.length) * 100) : 0;
            const firstUnfinishedRoom = pathRooms.find((r) => !completedRooms.includes(r.id)) || pathRooms[0];

            return (
              <div
                key={path.id}
                className="p-6 sm:p-7 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-xs card-lift"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white uppercase">
                        {path.difficulty}
                      </span>
                      <span className="text-[10px] text-[#888888] dark:text-[#777777] font-bold flex items-center gap-1">
                        <Clock size={11} /> {path.estimatedTime}
                      </span>
                      <span className="text-[10px] text-[#111111] dark:text-white font-bold flex items-center gap-1">
                        <Award size={11} /> +{path.xpReward} XP
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
                      {path.title}
                    </h3>
                  </div>

                  <Link
                    to={`/labs/${firstUnfinishedRoom?.id || 'nmap-fundamentals'}`}
                    className="btn-cyber-primary text-xs py-2.5 px-6 shrink-0"
                  >
                    <span>{pathProgressPct > 0 ? 'CONTINUE PATH →' : 'START PATH →'}</span>
                  </Link>
                </div>

                <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                  {path.description}
                </p>

                <div className="space-y-1 max-w-md">
                  <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                    <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777]">TRACK COMPLETION</span>
                    <span>{completedPathRooms} / {pathRooms.length} LABS ({pathProgressPct}%)</span>
                  </div>
                  <ProgressBar value={pathProgressPct} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
