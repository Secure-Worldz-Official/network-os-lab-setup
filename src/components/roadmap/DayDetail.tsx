import { motion } from 'framer-motion';
import {
  BookOpen,
  Terminal,
  FileCode,
  ExternalLink,
  CheckCircle2,
  Circle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Day } from '@/data/roadmap';

interface DayDetailProps {
  day: Day;
  moduleId: string;
  isComplete: boolean;
  onToggle: () => void;
  moduleProgress: { done: number; total: number };
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function DayDetail({
  day,
  moduleId: _moduleId,
  isComplete,
  onToggle,
  moduleProgress,
}: DayDetailProps) {
  const pct = moduleProgress.total > 0 ? (moduleProgress.done / moduleProgress.total) * 100 : 0;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Day Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-400">
              Module 1 · Foundations
            </span>
            <Badge variant={isComplete ? 'solid' : 'outline'}>
              {isComplete ? 'Day Complete' : 'In Progress'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Layers size={13} />
            <span>Day {day.id} of 9</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
          Day {day.id}: {day.title}
        </h1>

        <div className="max-w-md pt-1">
          <ProgressBar
            value={pct}
            size="sm"
            label={`Module 1 Progress (${moduleProgress.done}/${moduleProgress.total} completed)`}
            showLabel
          />
        </div>
      </motion.div>

      <div className="h-[1px] bg-zinc-800" />

      {/* Concept Breakdown: What You'll Learn */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-4"
        aria-labelledby={`learn-heading-${day.id}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <BookOpen size={16} />
          </div>
          <h2
            id={`learn-heading-${day.id}`}
            className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight"
          >
            What You'll Learn
          </h2>
        </div>

        <div className="grid gap-3 pt-1">
          {day.learn.map((concept, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-lg bg-[#111113] border border-zinc-800 text-sm text-zinc-300 leading-relaxed"
            >
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono text-zinc-300 flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="flex-1">{concept}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Lab Tasks: What You'll Do */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-4"
        aria-labelledby={`do-heading-${day.id}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <Terminal size={16} />
          </div>
          <h2
            id={`do-heading-${day.id}`}
            className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight"
          >
            What You'll Do (Hands-on Lab)
          </h2>
        </div>

        <div className="space-y-3 pt-1">
          {day.doLab.map((task, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-lg bg-[#111113] border border-zinc-800 text-sm text-zinc-200 leading-relaxed"
            >
              <span className="flex-shrink-0 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-xs font-bold text-white">
                STEP {idx + 1}
              </span>
              <p className="flex-1 text-zinc-300">{task}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Worked Example */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="rounded-xl border border-zinc-800 bg-[#111113] overflow-hidden"
        aria-labelledby={`example-heading-${day.id}`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Technical Reference
              </span>
              <h2
                id={`example-heading-${day.id}`}
                className="text-base font-bold text-white font-heading"
              >
                {day.example.title}
              </h2>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="text-sm text-zinc-300 leading-relaxed space-y-3.5 font-normal">
            {day.example.prose.split('\n\n').map((para, i) => {
              const parts = para.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="whitespace-pre-wrap">
                  {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={j} className="text-white font-semibold">
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              );
            })}
          </div>

          {day.example.code && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                <div className="flex items-center gap-1.5">
                  <FileCode size={13} />
                  <span>terminal output / script execution</span>
                </div>
                <span>bash / cli</span>
              </div>
              <pre className="code-block text-xs">{day.example.code}</pre>
            </div>
          )}
        </div>
      </motion.section>

      {/* Verified External Resources */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-4"
        aria-labelledby={`resources-heading-${day.id}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <BookOpen size={16} />
          </div>
          <h2
            id={`resources-heading-${day.id}`}
            className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight"
          >
            Official Docs & Specifications
          </h2>
        </div>

        <div className="grid gap-3 pt-1">
          {day.resources.map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#111113] border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/60 transition-colors"
              id={`resource-link-${day.id}-${i}`}
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                    {res.title}
                  </span>
                </div>
                {res.description && (
                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {res.description}
                  </p>
                )}
              </div>
              <ExternalLink
                size={16}
                className="text-zinc-500 group-hover:text-white transition-colors flex-shrink-0 mt-0.5 sm:mt-0"
              />
            </a>
          ))}
        </div>
      </motion.section>

      {/* Bottom Sticky Complete Checkbox Bar */}
      <div className="sticky bottom-6 z-20 pt-4">
        <div
          className={`p-4 sm:p-5 rounded-xl border backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
            isComplete
              ? 'bg-zinc-900/95 border-zinc-600 text-white'
              : 'bg-[#111113]/95 border-zinc-800 text-zinc-200'
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-heading text-white">
                {isComplete ? '✓ Day 0' + day.id + ' Completed' : 'Ready to mark complete?'}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {isComplete
                ? 'Your progress is stored locally in your browser.'
                : 'Check this off once you have completed the readings and hands-on lab steps.'}
            </p>
          </div>

          <Button
            variant={isComplete ? 'secondary' : 'primary'}
            size="md"
            onClick={onToggle}
            id={`mark-complete-toggle-${day.id}`}
            aria-pressed={isComplete}
            className="w-full sm:w-auto"
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={16} className="text-white" />
                Completed (Click to Reset)
              </>
            ) : (
              <>
                <Circle size={16} />
                Mark Day {day.id} as Done
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
