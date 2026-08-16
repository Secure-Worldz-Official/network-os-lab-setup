import { motion } from 'framer-motion';
import { Flame, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { useProgress } from '@/hooks/useProgress';

type ProgressAPI = ReturnType<typeof useProgress>;

interface OverallProgressProps {
  progress: ProgressAPI;
}

export function OverallProgress({ progress }: OverallProgressProps) {
  const overall = progress.overallProgress();
  const pct = overall.total > 0 ? (overall.done / overall.total) * 100 : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-6 sm:px-8 py-10 border-t border-b border-[var(--border)]"
      aria-label="Overall course progress"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame
                size={16}
                className={overall.done > 0 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}
              />
              <span className="section-label">Your Progress</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {overall.done === 0
                ? 'Ready to begin?'
                : overall.done === overall.total
                ? 'Module 1 complete!'
                : `${overall.done} of ${overall.total} days done`}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <p className="text-3xl font-bold text-[var(--accent)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {Math.round(pct)}%
              </p>
              <p className="text-xs text-[var(--text-muted)]">Module 1</p>
            </div>
          </div>
        </div>

        <ProgressBar value={pct} size="lg" animated />

        {/* Day dots */}
        <div className="flex gap-1.5 mt-4 flex-wrap">
          {Array.from({ length: overall.total }, (_, i) => {
            const dayId = i + 1;
            const done = progress.isComplete('module-1', dayId);
            return (
              <motion.div
                key={dayId}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                title={`Day ${dayId}`}
                className={`w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)]'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {done ? <CheckCircle2 size={14} /> : dayId}
              </motion.div>
            );
          })}
        </div>

        {overall.done === 0 && (
          <p className="text-sm text-[var(--text-muted)] mt-3">
            Complete each day and mark it done — your progress saves automatically.
          </p>
        )}
      </div>
    </motion.section>
  );
}
