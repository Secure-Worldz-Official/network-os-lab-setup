import { motion } from 'framer-motion';
import {
  BookOpen,
  FlaskConical,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
  Circle,
  Terminal,
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import type { Day } from '@/data/roadmap';

interface DayDetailProps {
  day: Day;
  moduleId: string;
  isComplete: boolean;
  onToggle: () => void;
  moduleProgress: { done: number; total: number };
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: { transition: { staggerChildren: 0.07 } },
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
    <motion.article
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10"
    >
      {/* Day header */}
      <motion.div variants={fadeUp} className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="section-label">Day {day.id}</span>
          <Badge variant={isComplete ? 'success' : 'muted'}>
            {isComplete ? (
              <>
                <CheckCircle2 size={10} />
                Complete
              </>
            ) : (
              <>
                <Circle size={10} />
                In Progress
              </>
            )}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
          {day.title}
        </h1>

        <ProgressBar
          value={pct}
          size="sm"
          label="Module 1 progress"
          showLabel
          className="max-w-xs"
        />
      </motion.div>

      <div className="divider" />

      {/* What You'll Learn */}
      <motion.section variants={fadeUp} aria-labelledby={`learn-${day.id}`}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-900/50 flex items-center justify-center">
            <BookOpen size={15} className="text-blue-400" />
          </div>
          <h2 id={`learn-${day.id}`} className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            What You'll Learn
          </h2>
        </div>
        <ul className="space-y-3">
          {day.learn.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              className="flex gap-3 text-[var(--text-secondary)] leading-relaxed"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* What You'll Do */}
      <motion.section variants={fadeUp} aria-labelledby={`do-${day.id}`}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-900/50 flex items-center justify-center">
            <FlaskConical size={15} className="text-amber-400" />
          </div>
          <h2 id={`do-${day.id}`} className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            What You'll Do
          </h2>
        </div>
        <ol className="space-y-3">
          {day.doLab.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              className="flex gap-3 text-[var(--text-secondary)] leading-relaxed"
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'var(--accent-pale)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-dim)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {i + 1}
              </span>
              <span className="mt-0.5">{item}</span>
            </motion.li>
          ))}
        </ol>
      </motion.section>

      {/* Worked Example */}
      <motion.section
        variants={fadeUp}
        className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden"
        aria-labelledby={`example-${day.id}`}
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-pale)] border border-[var(--accent-dim)] flex items-center justify-center">
            <Lightbulb size={15} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className="section-label">Worked Example</p>
            <h2
              id={`example-${day.id}`}
              className="text-base font-semibold text-[var(--text-primary)] mt-0.5"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {day.example.title}
            </h2>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="prose-content text-[var(--text-secondary)] leading-relaxed text-sm space-y-3">
            {day.example.prose.split('\n\n').map((para, i) => {
              if (para.startsWith('**') && para.includes('|')) {
                // Table-like content — render as prose for now
                return (
                  <p key={i} className="whitespace-pre-wrap font-mono text-xs text-[var(--text-secondary)]">
                    {para}
                  </p>
                );
              }
              // Bold text replacement
              const parts = para.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="whitespace-pre-wrap">
                  {parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong
                        key={j}
                        className="text-[var(--text-primary)] font-semibold"
                      >
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
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={12} className="text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)] font-mono">terminal</span>
              </div>
              <pre className="code-block text-xs">{day.example.code}</pre>
            </div>
          )}
        </div>
      </motion.section>

      {/* Resources */}
      <motion.section variants={fadeUp} aria-labelledby={`resources-${day.id}`}>
        <h2
          id={`resources-${day.id}`}
          className="text-lg font-semibold text-[var(--text-primary)] mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Resources
        </h2>
        <div className="grid gap-2">
          {day.resources.map((res, i) => (
            <motion.a
              key={i}
              variants={fadeUp}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link group"
              id={`resource-${day.id}-${i}`}
            >
              <ExternalLink
                size={14}
                className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-medium text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate">
                  {res.title}
                </p>
                {res.description && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{res.description}</p>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Mark complete */}
      <motion.div
        variants={fadeUp}
        className="sticky bottom-4 mt-6"
      >
        <div
          className={`rounded-[var(--radius-md)] border p-4 flex items-center justify-between gap-4 transition-all duration-300 ${
            isComplete
              ? 'bg-emerald-950/30 border-emerald-800'
              : 'bg-[var(--bg-surface)] border-[var(--border)]'
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {isComplete ? '✓ Day complete!' : 'Mark this day as complete'}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {isComplete
                ? 'Your progress has been saved.'
                : 'Check off when you\'ve finished the lab tasks.'}
            </p>
          </div>
          <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold transition-all duration-200 cursor-pointer border ${
              isComplete
                ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                : 'bg-[var(--accent)] border-[var(--accent)] text-white hover:bg-red-500 shadow-[0_0_16px_var(--accent-glow)]'
            }`}
            id={`mark-complete-day-${day.id}`}
            aria-pressed={isComplete}
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={15} />
                Completed
              </>
            ) : (
              <>
                <Circle size={15} />
                Mark Complete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.article>
  );
}
