import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { roadmap } from '@/data/roadmap';
import type { useProgress } from '@/hooks/useProgress';

type ProgressAPI = ReturnType<typeof useProgress>;

interface OverallProgressProps {
  progress: ProgressAPI;
}

export function OverallProgress({ progress }: OverallProgressProps) {
  const overall = progress.overallProgress();
  const pct = overall.total > 0 ? (overall.done / overall.total) * 100 : 0;
  const mod1 = roadmap[0];

  return (
    <section className="border-b border-zinc-800/80 bg-[#0c0c0e] py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-800/80 bg-[#111113] p-5 sm:p-7 space-y-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.3),0_8px_24px_-8px_rgba(0,0,0,0.4)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Persistent Local Tracker
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight">
                Roadmap Completion Status
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                {overall.done === 0
                  ? 'No days checked off yet. Work through Day 01 to begin tracking.'
                  : `${overall.done} of ${overall.total} days completed in Module 1.`}
              </p>
            </div>

            <div className="flex items-baseline gap-2 self-start sm:self-auto bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 font-mono shrink-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {Math.round(pct)}%
              </span>
              <span className="text-xs text-zinc-500 uppercase">Complete</span>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar value={pct} size="md" />

          {/* Interactive Day Check Matrix */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Module 1 Days (1 - 9)</span>
              <span className="text-zinc-500">Click a day to study</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
               {mod1.days.map((day) => {
                 const done = progress.isComplete(mod1.id, day.id);
                 return (
                   <Link
                     key={day.id}
                     to={`/roadmap/${mod1.id}/${day.slug}`}
                     className={`group relative flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-150 ${
                       done
                         ? 'bg-white text-zinc-950 border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                         : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 hover:bg-zinc-900'
                     }`}
                   >
                    <div className="flex items-center justify-center mb-1">
                      {done ? (
                        <CheckCircle2 size={15} className="text-zinc-950" />
                      ) : (
                        <Circle size={15} className="text-zinc-600 group-hover:text-zinc-400" />
                      )}
                    </div>
                    <span className="font-mono text-xs font-semibold">
                      D{day.id < 10 ? `0${day.id}` : day.id}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-zinc-800/80 text-xs font-mono text-zinc-500">
            {/* <span>Progress automatically syncs with localStorage</span> */}
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
            >
              <span>Full Curriculum View</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
