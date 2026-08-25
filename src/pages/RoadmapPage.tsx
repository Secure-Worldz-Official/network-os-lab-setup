import { motion } from 'framer-motion';
import { Compass, CheckCircle2 } from 'lucide-react';
import { ModuleCard } from '@/components/roadmap/ModuleCard';
import { useProgress } from '@/hooks/useProgress';
import { roadmap } from '@/data/roadmap';

export function RoadmapPage() {
  const progress = useProgress();
  const overall = progress.overallProgress();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8 select-none font-mono">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white">
            <Compass size={13} className="text-[#111111] dark:text-white" />
            <span>Curriculum Roadmap</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#555555] dark:text-[#B5B5B5] bg-[#F7F7F7] dark:bg-[#141414] px-3 py-1 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <CheckCircle2 size={13} className="text-[#111111] dark:text-white" />
            <span>Total Completed: {overall.done}/{overall.total}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
          Cybersecurity Learning Path
        </h1>

        <p className="text-sm sm:text-base text-[#555555] dark:text-[#B5B5B5] leading-relaxed max-w-2xl font-sans">
          Progress sequentially through the modules. Module 1 delivers the essential networking,
          OS, and virtual lab foundation required for all subsequent offensive and defensive modules.
        </p>
      </motion.div>

      {/* Module List Accordions */}
      <div className="space-y-4 pt-1">
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
