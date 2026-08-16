import { motion } from 'framer-motion';
import { Compass, CheckCircle2 } from 'lucide-react';
import { ModuleCard } from '@/components/roadmap/ModuleCard';
import { useProgress } from '@/hooks/useProgress';
import { roadmap } from '@/data/roadmap';

export function RoadmapPage() {
  const progress = useProgress();
  const overall = progress.overallProgress();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <Compass size={13} className="text-zinc-400" />
            <span>Curriculum Roadmap</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-md border border-zinc-800">
            <CheckCircle2 size={13} className="text-white" />
            <span>Total Completed: {overall.done}/{overall.total}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
          Cybersecurity Learning Path
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
          Progress sequentially through the modules. Module 1 delivers the essential networking,
          OS, and virtual lab foundation required for all subsequent offensive and defensive modules.
        </p>
      </motion.div>

      {/* Module List Accordions */}
      <div className="space-y-4 pt-2">
        {roadmap.map((module, i) => (
          <ModuleCard
            key={module.id}
            module={module}
            moduleProgress={progress.moduleProgress(module.id)}
            isComplete={(dayId: number) => progress.isComplete(module.id, dayId)}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
