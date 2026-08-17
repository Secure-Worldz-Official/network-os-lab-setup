import { motion, type Variants } from 'framer-motion';
import { CheckCircle2, Circle, Lightbulb } from 'lucide-react';
import { useTask } from './TaskContext';
import { getTasksForLab } from '@/data/tasks';
import { useState } from 'react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export function TaskPanel({ labId }: { labId: string }) {
  const { isTaskCompleted, getLabProgress } = useTask();
  const [showHint, setShowHint] = useState<string | null>(null);
  const tasks = getTasksForLab(labId);
  const progress = getLabProgress(labId);
  const allDone = progress.completed === progress.total && progress.total > 0;

  if (tasks.length === 0) return null;

  return (
    <motion.div variants={fadeUp} className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800/70 bg-zinc-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Tasks</span>
          <span className="text-[10px] font-mono text-zinc-500">
            {progress.completed}/{progress.total}
          </span>
        </div>
        {allDone && (
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">All Complete</span>
        )}
      </div>

      <div className="divide-y divide-zinc-800/60">
        {tasks.map((task) => {
          const done = isTaskCompleted(task.id);
          const showHintForThis = showHint === task.id;

          return (
            <div
              key={task.id}
              className={`px-4 py-3 transition-colors ${done ? 'bg-zinc-950/30' : 'bg-zinc-900/20'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {done ? (
                    <CheckCircle2 size={15} className="text-emerald-400" />
                  ) : (
                    <Circle size={15} className="text-zinc-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${done ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                    {task.description}
                  </p>
                  {showHintForThis && !done && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-zinc-500 mt-1.5 flex items-start gap-1.5"
                    >
                      <Lightbulb size={11} className="mt-0.5 shrink-0 text-zinc-600" />
                      {task.hint}
                    </motion.p>
                  )}
                </div>
                {!done && (
                  <button
                    onClick={() => setShowHint((prev) => (prev === task.id ? null : task.id))}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer shrink-0"
                    aria-label="Toggle hint"
                  >
                    <Lightbulb size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
