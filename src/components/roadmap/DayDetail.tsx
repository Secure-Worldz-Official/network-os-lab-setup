import { useState } from 'react';
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
  Copy,
  Check,
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TechnicalVisual } from './TechnicalVisual';
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
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function renderInlineMarkup(value: string) {
  return value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export function DayDetail({
  day,
  moduleId: _moduleId,
  isComplete,
  onToggle,
  moduleProgress,
}: DayDetailProps) {
  const [copied, setCopied] = useState(false);
  const pct = moduleProgress.total > 0 ? (moduleProgress.done / moduleProgress.total) * 100 : 0;

  const handleCopyCode = () => {
    if (day.example.code) {
      navigator.clipboard.writeText(day.example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="w-full min-w-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
      {/* ─── 1. Day Header ───────────────────────────────────────────── */}
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
            <span>Day 0{day.id} of 09</span>
          </div>
        </div>

        <h1 className="doc-page-title text-white">
          Day 0{day.id}: {day.title}
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

      <div className="h-[1px] bg-zinc-800/80" />

      {/* ─── 2. Concept Breakdown: What You'll Learn ────────────────── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-w-0 space-y-4"
        aria-labelledby={`learn-heading-${day.id}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
            <BookOpen size={16} />
          </div>
          <h2
            id={`learn-heading-${day.id}`}
            className="min-w-0 doc-section-title text-white"
          >
            What You'll Learn
          </h2>
        </div>

        <div className="grid gap-3 pt-1">
          {day.learn.map((concept, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[#111113] border border-zinc-800/80 text-sm text-zinc-300 leading-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] hover:border-zinc-700 hover:bg-[#151518] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-mono font-semibold text-zinc-300 shrink-0">
                {idx + 1}
              </div>
              <p className="min-w-0 flex-1 text-zinc-300">{concept}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── 3. Lab Tasks: What You'll Do ────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-w-0 space-y-4"
        aria-labelledby={`do-heading-${day.id}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
            <Terminal size={16} />
          </div>
          <h2
            id={`do-heading-${day.id}`}
            className="min-w-0 doc-section-title text-white"
          >
            What You'll Do (Hands-on Lab)
          </h2>
        </div>

        <div className="space-y-3 pt-1">
          {day.doLab.map((task, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-[#111113] border border-zinc-800/80 text-sm text-zinc-200 leading-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] hover:border-zinc-700 hover:bg-[#151518] transition-colors"
            >
              <span className="shrink-0 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 font-mono text-xs font-bold text-white">
                STEP {idx + 1}
              </span>
              <p className="min-w-0 flex-1 text-zinc-300">{task}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── 4. Technical Reference / Worked Example ─────────────────── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-w-0 rounded-xl border border-zinc-800/80 bg-[#111113] overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.3),0_8px_24px_-8px_rgba(0,0,0,0.4)] space-y-0"
        aria-labelledby={`example-heading-${day.id}`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/70">
          <div className="flex min-w-0 items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Technical Reference
              </span>
              <h2
                id={`example-heading-${day.id}`}
                className="doc-subheading text-white"
              >
                {day.example.title}
              </h2>
            </div>
          </div>
        </div>

        <div className="min-w-0 p-5 sm:p-6 space-y-6">
          <div className="doc-prose min-w-0 text-zinc-300 space-y-4 font-normal">
            {day.example.prose.split('\n\n').map((para, i) => {
              return (
                <p key={i} className="whitespace-pre-wrap">
                  {renderInlineMarkup(para)}
                </p>
              );
            })}
          </div>

          <TechnicalVisual day={day} />

          {day.example.code && (
            <div className="space-y-2 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400 px-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <FileCode size={13} />
                  <span>terminal output / script execution</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded"
                >
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="code-block max-w-full text-xs">{day.example.code}</pre>
            </div>
          )}
        </div>
      </motion.section>

      {/* ─── 5. Official Resources ───────────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-w-0 space-y-4"
        aria-labelledby={`resources-heading-${day.id}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
            <BookOpen size={16} />
          </div>
          <h2
            id={`resources-heading-${day.id}`}
            className="min-w-0 doc-section-title text-white"
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
              className="group flex items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-[#111113] border border-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-900/60 transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]"
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
                className="text-zinc-500 group-hover:text-white transition-colors shrink-0 mt-0.5 sm:mt-0"
              />
            </a>
          ))}
        </div>
      </motion.section>

      {/* ─── 6. Completion Milestone Banner (Clean Normal Flow) ───────── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="pt-2"
      >
        <div
          className={`p-5 sm:p-7 rounded-xl border transition-all duration-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 ${
            isComplete
              ? 'bg-[#151518] border-zinc-600/80 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_12px_40px_-12px_rgba(0,0,0,0.5)]'
              : 'bg-[#111113] border-zinc-800/80 text-zinc-200 shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-heading text-white">
                {isComplete ? '✓ Day 0' + day.id + ' Completed' : 'Mark Day 0' + day.id + ' Complete'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
              {isComplete
                ? 'Great job! Your progress is stored locally in your browser.'
                : 'Finished the readings and lab tasks? Check off this day to update your progress.'}
            </p>
          </div>

          <Button
            variant={isComplete ? 'secondary' : 'primary'}
            size="lg"
            onClick={onToggle}
            id={`mark-complete-toggle-${day.id}`}
            aria-pressed={isComplete}
            className="w-full sm:w-auto shrink-0"
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={16} className="text-white" />
                <span>Completed (Reset)</span>
              </>
            ) : (
              <>
                <Circle size={16} />
                <span>Mark as Done</span>
              </>
            )}
          </Button>
        </div>
      </motion.section>
    </article>
  );
}
