import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Terminal,
  FileCode,
  ExternalLink,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Layers
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
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
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function renderInlineMarkup(value: string) {
  return value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-[#111111] dark:text-white font-extrabold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="text-[#111111] dark:text-white bg-[#F0F0F0] dark:bg-[#181818] px-1.5 py-0.5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] font-mono text-xs font-bold">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function DayDetail({ day, moduleId: _moduleId, isComplete, onToggle, moduleProgress }: DayDetailProps) {
  const [copied, setCopied] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [completedSubtasks, setCompletedSubtasks] = useState<Record<number, boolean>>({});

  const pct = moduleProgress.total > 0 ? (moduleProgress.done / moduleProgress.total) * 100 : 0;

  const handleCopyCode = () => {
    if (day.example.code) {
      navigator.clipboard.writeText(day.example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleSubtask = (idx: number) => {
    setCompletedSubtasks(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const proseParagraphs = day.example.prose ? day.example.prose.split('\n\n') : [];

  return (
    <article className="w-full min-w-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-mono select-none">

      {/* ─── 1. LESSON HEADER (DISTRACTION-FREE & EXPANDED) ─────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#888888] dark:text-[#777777]">
                LESSON 0{day.id} OF 0{moduleProgress.total}
              </span>
              {isComplete && (
                <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                  <CheckCircle2 size={10} /> COMPLETED
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight leading-none">
              {day.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[10px] text-[#888888] dark:text-[#777777] font-bold uppercase">MODULE PROGRESS</span>
              <span className="text-xs font-bold text-[#111111] dark:text-white">{moduleProgress.done}/{moduleProgress.total} COMPLETED ({Math.round(pct)}%)</span>
            </div>
          </div>
        </div>
        <ProgressBar value={pct} size="sm" />
      </motion.div>

      {/* ─── TASK 01: VISUAL-FIRST INTERACTIVE DEMONSTRATION (70% FOCUS + CONTEXTUAL THEORY) ──────────────── */}
      <motion.section
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="p-6 sm:p-8 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#121212] space-y-6 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] shrink-0 font-extrabold text-xs shadow-xs">
              01
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest block">TASK 01 // VISUAL-FIRST LEARNING HUB</span>
              <h2 className="text-lg font-extrabold text-[#111111] dark:text-white uppercase font-heading">
                INTERACTIVE ANIMATED MECHANISM
              </h2>
            </div>
          </div>
          <Sparkles size={18} className="text-amber-500" />
        </div>

        {/* 70% CENTERPIECE ANIMATED VISUALIZATION CANVAS */}
        <div className="w-full bg-[#FAFAFA] dark:bg-[#0B0B0B] rounded-xl p-4 sm:p-6 border border-[#E5E5E5] dark:border-[#262626]">
          <div className="flex items-center justify-between mb-3 text-[10px] font-mono font-bold uppercase text-[#888888] dark:text-[#777777]">
            <span className="flex items-center gap-1.5 text-[#111111] dark:text-white">
              <Layers size={13} /> LIVE ARCHITECTURE CANVAS
            </span>
            <span>INTERACTIVE SIMULATOR</span>
          </div>
          <TechnicalVisual day={day} />
        </div>

        {/* 20% CONTEXTUAL THEORY (SPLIT INTO BITE-SIZED MICRO CARDS AROUND VISUAL) */}
        <div className="space-y-4 pt-2">
          <span className="text-[10px] font-extrabold text-[#888888] dark:text-[#777777] uppercase tracking-wider block">
            CORE CONCEPTUAL BREAKDOWN:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Theory Micro Card */}
            {proseParagraphs.length > 0 && (
              <div className="p-4 sm:p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F9F9F9] dark:bg-[#161616] space-y-2 font-sans text-xs sm:text-sm text-[#333333] dark:text-[#CCCCCC] leading-relaxed">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#111111] dark:text-white uppercase pb-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <BookOpen size={13} />
                  <span>THEORY ESSENTIALS</span>
                </div>
                {renderInlineMarkup(proseParagraphs[0])}
              </div>
            )}

            {/* Secondary Theory Micro Card */}
            {proseParagraphs.length > 1 ? (
              <div className="p-4 sm:p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F9F9F9] dark:bg-[#161616] space-y-2 font-sans text-xs sm:text-sm text-[#333333] dark:text-[#CCCCCC] leading-relaxed">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#111111] dark:text-white uppercase pb-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <HelpCircle size={13} />
                  <span>MECHANISM DEEP DIVE</span>
                </div>
                {renderInlineMarkup(proseParagraphs[1])}
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F9F9F9] dark:bg-[#161616] space-y-2 font-sans text-xs sm:text-sm text-[#333333] dark:text-[#CCCCCC] leading-relaxed">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#111111] dark:text-white uppercase pb-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <BookOpen size={13} />
                  <span>SECURITY IMPLICATIONS</span>
                </div>
                <p>Understand how security controls and protocols defend against packet interception, unauthorized access, and architectural bypasses.</p>
              </div>
            )}
          </div>

          {/* Key Concept Takeaways Grid */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-wider block">
              KEY TAKEAWAY OBJECTIVES:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {day.learn.map((concept, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-xs text-[#333333] dark:text-[#DDD] font-sans leading-relaxed shadow-xs"
                >
                  <span className="w-5 h-5 rounded-md bg-[#111111] dark:bg-white flex items-center justify-center text-[10px] font-mono font-extrabold text-white dark:text-[#080808] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="min-w-0 flex-1 font-medium">{concept}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── TASK 02: PRACTICAL LAB & COMMAND EXECUTION ───────────────── */}
      <motion.section
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="p-6 sm:p-8 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#121212] space-y-6 shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] shrink-0 font-extrabold text-xs shadow-xs">
              02
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest block">TASK 02 // PRACTICAL IMPLEMENTATION</span>
              <h2 className="text-lg font-extrabold text-[#111111] dark:text-white uppercase font-heading">
                HANDS-ON LAB EXERCISES & CLI COMMANDS
              </h2>
            </div>
          </div>
          <Terminal size={18} className="text-[#888888]" />
        </div>

        {/* Lab Step Checklist */}
        <div className="space-y-3">
          {day.doLab.map((task, idx) => {
            const isSubDone = completedSubtasks[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleSubtask(idx)}
                className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-xl border transition-all cursor-pointer select-none font-sans text-xs sm:text-sm ${
                  isSubDone
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                    : 'bg-[#FAFAFA] dark:bg-[#161616] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#333333] dark:text-[#DDD] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSubDone ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <Circle size={18} className="text-[#888888]" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#888888] dark:text-[#777777]">
                      EXERCISE STEP 0{idx + 1}
                    </span>
                    <span className="text-[9px] font-mono uppercase font-bold text-[#888888] dark:text-[#777777]">
                      {isSubDone ? '✓ VERIFIED' : 'CLICK TO MARK COMPLETED'}
                    </span>
                  </div>
                  <p className="leading-relaxed font-medium">{task}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Code Snippet / Terminal Command Reference */}
        {day.example.code && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#888888] dark:text-[#777777]">
              <div className="flex items-center gap-1.5 font-bold uppercase">
                <FileCode size={13} className="text-[#111111] dark:text-white" />
                <span>TERMINAL COMMAND REFERENCE · {day.example.title}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[10px] font-mono text-[#111111] dark:text-white hover:opacity-80 transition-colors cursor-pointer bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] px-2.5 py-1 rounded-md font-bold"
              >
                {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{copied ? 'COPIED' : 'COPY COMMAND'}</span>
              </button>
            </div>
            <pre className="p-5 rounded-xl border border-[#222] bg-[#050505] text-[#00FF66] font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed font-bold">
              {day.example.code}
            </pre>
          </div>
        )}

        {/* External Resources Dropdown */}
        {day.resources && day.resources.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setResourcesOpen(o => !o)}
              className="w-full flex items-center justify-between gap-3 py-3.5 px-4 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#161616] hover:border-[#111111] dark:hover:border-white transition-colors text-xs font-mono text-[#111111] dark:text-white"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={14} />
                <span className="font-bold uppercase tracking-wider">RECOMMENDED READING & DOCS</span>
                <span className="text-[10px] text-[#888888] dark:text-[#777777]">({day.resources.length} resources)</span>
              </div>
              {resourcesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {resourcesOpen && (
              <div className="mt-2 space-y-2">
                {day.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] dark:hover:border-white transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <span className="text-xs font-bold text-[#111111] dark:text-white uppercase font-mono block truncate">
                        {res.title}
                      </span>
                      {res.description && (
                        <p className="text-[10px] text-[#555555] dark:text-[#B5B5B5] font-sans">
                          {res.description}
                        </p>
                      )}
                    </div>
                    <ExternalLink size={14} className="text-[#888888] group-hover:text-[#111111] dark:group-hover:text-white transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.section>

      {/* ─── LESSON COMPLETION CTA ──────────────────────────────────── */}
      <motion.section
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="pt-2"
      >
        <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-5 font-mono shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <p className="text-base font-extrabold text-[#111111] dark:text-white font-heading uppercase">
                {isComplete ? `✓ LESSON 0${day.id} VERIFIED COMPLETE` : `COMPLETE LESSON 0${day.id}`}
              </p>
            </div>
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans max-w-lg leading-relaxed">
              {isComplete
                ? 'Great work mastering this lesson! Your progress is saved. Click below to un-toggle or proceed to the next module.'
                : 'Finished studying the interactive visual demo and practical steps? Mark complete to record your progress.'}
            </p>
          </div>

          <Button
            variant={isComplete ? 'secondary' : 'primary'}
            size="lg"
            onClick={onToggle}
            className="w-full sm:w-auto shrink-0 uppercase text-xs py-3 px-6 font-bold"
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={16} />
                <span>[ RESET COMPLETION ]</span>
              </>
            ) : (
              <>
                <Circle size={16} />
                <span>COMPLETE LESSON 0{day.id}</span>
                <ArrowRight size={14} />
              </>
            )}
          </Button>
        </div>
      </motion.section>

    </article>
  );
}
