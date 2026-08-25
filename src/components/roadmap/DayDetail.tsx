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
      return <strong key={index} className="text-[#111111] dark:text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="text-[#111111] dark:text-white bg-[#F0F0F0] dark:bg-[#181818] px-1 py-0.5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] font-mono text-xs">{part.slice(1, -1)}</code>;
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
    <article className="w-full min-w-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10 font-mono select-none">
      {/* 1. Day Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#888888] dark:text-[#777777]">
              MODULE 1 // FOUNDATIONS
            </span>
            <Badge variant={isComplete ? 'solid' : 'outline'}>
              {isComplete ? 'DAY COMPLETE' : 'IN PROGRESS'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#888888] dark:text-[#777777]">
            <Layers size={13} />
            <span>DAY 0{day.id} OF 09</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading uppercase">
          DAY 0{day.id}: {day.title}
        </h1>

        <div className="max-w-md pt-1">
          <ProgressBar
            value={pct}
            size="sm"
            label={`MODULE 1 PROGRESS (${moduleProgress.done}/${moduleProgress.total})`}
            showLabel
          />
        </div>
      </motion.div>

      {/* 2. What You'll Learn */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-w-0 space-y-4"
      >
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
          <div className="w-8 h-8 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] shrink-0">
            <BookOpen size={16} />
          </div>
          <h2 className="text-lg font-bold text-[#111111] dark:text-white uppercase font-heading">
            WHAT YOU'LL LEARN
          </h2>
        </div>

        <div className="grid gap-3 pt-1">
          {day.learn.map((concept, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 sm:p-5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans"
            >
              <div className="w-6 h-6 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-xs font-mono font-semibold text-white dark:text-[#080808] shrink-0">
                {idx + 1}
              </div>
              <p className="min-w-0 flex-1 text-[#555555] dark:text-[#B5B5B5]">{concept}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 3. Hands-on Lab Tasks */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-w-0 space-y-4"
      >
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
          <div className="w-8 h-8 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] shrink-0">
            <Terminal size={16} />
          </div>
          <h2 className="text-lg font-bold text-[#111111] dark:text-white uppercase font-heading">
            HANDS-ON LAB EXERCISES
          </h2>
        </div>

        <div className="space-y-3 pt-1">
          {day.doLab.map((task, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 sm:p-5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans"
            >
              <span className="shrink-0 px-2.5 py-1 rounded bg-[#111111] dark:bg-white font-mono text-xs font-bold text-white dark:text-[#080808]">
                STEP {idx + 1}
              </span>
              <p className="min-w-0 flex-1 text-[#555555] dark:text-[#B5B5B5]">{task}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 4. Technical Reference */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-w-0 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] overflow-hidden space-y-0 shadow-xs"
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#101010]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888] dark:text-[#777777] block">
                TECHNICAL SPECIFICATION
              </span>
              <h2 className="text-sm font-bold text-[#111111] dark:text-white uppercase font-heading">
                {day.example.title}
              </h2>
            </div>
          </div>
        </div>

        <div className="min-w-0 p-5 sm:p-6 space-y-6">
          <div className="doc-prose min-w-0 text-[#555555] dark:text-[#B5B5B5] space-y-4 font-sans text-xs sm:text-sm">
            {day.example.prose.split('\n\n').map((para, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {renderInlineMarkup(para)}
              </p>
            ))}
          </div>

          <TechnicalVisual day={day} />

          {day.example.code && (
            <div className="space-y-2 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#888888] dark:text-[#777777] px-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <FileCode size={13} className="text-[#111111] dark:text-white" />
                  <span>TERMINAL EXECUTION // OUTPUT</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#111111] dark:text-white hover:opacity-80 transition-colors cursor-pointer bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] px-2 py-0.5 rounded"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <pre className="code-block max-w-full text-xs">{day.example.code}</pre>
            </div>
          )}
        </div>
      </motion.section>

      {/* 5. Official Resources */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="min-w-0 space-y-4"
      >
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
          <div className="w-8 h-8 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] shrink-0">
            <BookOpen size={16} />
          </div>
          <h2 className="text-lg font-bold text-[#111111] dark:text-white uppercase font-heading">
            OFFICIAL DOCUMENTATION
          </h2>
        </div>

        <div className="grid gap-3 pt-1">
          {day.resources.map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] dark:hover:border-white transition-colors"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-[#111111] dark:text-white uppercase font-mono">
                    {res.title}
                  </span>
                </div>
                {res.description && (
                  <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans line-clamp-1">
                    {res.description}
                  </p>
                )}
              </div>
              <ExternalLink
                size={16}
                className="text-[#888888] dark:text-[#777777] group-hover:text-[#111111] dark:group-hover:text-white transition-colors shrink-0"
              />
            </a>
          ))}
        </div>
      </motion.section>

      {/* 6. Completion Banner */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="pt-2"
      >
        <div className="p-6 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-5 font-mono">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#111111] dark:text-white font-heading uppercase">
                {isComplete ? '✓ DAY 0' + day.id + ' COMPLETED' : 'MARK DAY 0' + day.id + ' COMPLETE'}
              </span>
            </div>
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans max-w-lg">
              {isComplete
                ? 'Great job! Your progress is stored locally in your browser.'
                : 'Finished the readings and lab tasks? Check off this day to update your progress.'}
            </p>
          </div>

          <Button
            variant={isComplete ? 'secondary' : 'primary'}
            size="lg"
            onClick={onToggle}
            className="w-full sm:w-auto shrink-0 uppercase text-xs"
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={16} className="text-[#111111] dark:text-white" />
                <span>[ RESET COMPLETION ]</span>
              </>
            ) : (
              <>
                <Circle size={16} />
                <span>[ MARK AS DONE ]</span>
              </>
            )}
          </Button>
        </div>
      </motion.section>
    </article>
  );
}
