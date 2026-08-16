import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import { ModuleCard } from '@/components/roadmap/ModuleCard';
import { useProgress } from '@/hooks/useProgress';
import { roadmap } from '@/data/roadmap';

export function RoadmapPage() {
  const progress = useProgress();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-pale)] border border-[var(--accent-dim)] flex items-center justify-center">
            <Map size={15} className="text-[var(--accent)]" />
          </div>
          <span className="section-label">Learning Roadmap</span>
        </div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Cybersecurity Roadmap
        </h1>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xl">
          A structured path from zero to job-ready. Each module builds on the last —
          complete Module 1 before moving forward. Click any module to expand its day list.
        </p>
      </motion.div>

      {/* Module cards */}
      <div className="space-y-4">
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
