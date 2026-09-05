import { Check, LockKeyhole, Play, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Day, Module } from '@/data/roadmap';
import { curriculumRoadmap } from '@/data/curriculum';
import { useProgress } from '@/hooks/useProgress';

type PathEntry = { module: Module; day: Day };
type NodeState = 'locked' | 'current' | 'completed';
const POSITIONS = [50, 25, 75, 25, 75, 50] as const;
const NODE_GAP = 178;

function connectorPath(x1: number, y1: number, x2: number, y2: number) {
  const middleY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${middleY}, ${x2} ${middleY}, ${x2} ${y2}`;
}

export function LearnPage() {
  const progress = useProgress();
  const entries: PathEntry[] = curriculumRoadmap.flatMap((module) => module.days.map((day) => ({ module, day })));
  const pathHeight = Math.max(420, (entries.length - 1) * NODE_GAP + 190);
  const stateFor = (index: number): NodeState => {
    const entry = entries[index];
    if (progress.isComplete(entry.module.id, entry.day.id)) return 'completed';
    if (index === 0) return 'current';
    const previous = entries[index - 1];
    return progress.isComplete(previous.module.id, previous.day.id) ? 'current' : 'locked';
  };

  return <main className="max-w-5xl mx-auto space-y-8 pb-12 font-mono select-none">
    <header className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
      <div className="flex items-center gap-2 text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-[0.18em]"><Route size={14} className="text-[#111111] dark:text-white" /> Sequential curriculum</div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight mt-2">Learning Path</h1>
      <p className="text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-2xl mt-2">Select the play control on an available stage to enter it. Each stage unlocks only after the preceding learning stage is completed.</p>
    </header>
    <section className="rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D] shadow-xs overflow-hidden" aria-label="Sequential learning path">
      <div className="px-5 py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] flex items-center justify-between gap-3"><div><p className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">Certification roadmap</p><p className="text-[11px] text-[#888888] dark:text-[#777777] mt-1">{entries.length} ordered learning stages</p></div><span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] dark:text-[#777777]">Module 01</span></div>
      <div className="relative overflow-x-hidden" style={{ height: pathHeight }}>
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full" viewBox={`0 0 100 ${pathHeight}`} preserveAspectRatio="none">{entries.slice(0, -1).map((entry, index) => { const from = stateFor(index); const to = stateFor(index + 1); const y1 = 75 + index * NODE_GAP; const y2 = 75 + (index + 1) * NODE_GAP; const completed = from === 'completed' && to !== 'locked'; return <path key={`${entry.module.id}-${entry.day.id}`} d={connectorPath(POSITIONS[index % POSITIONS.length], y1 + 29, POSITIONS[(index + 1) % POSITIONS.length], y2 - 29)} fill="none" stroke={completed ? 'var(--text-primary)' : 'var(--border-bright)'} strokeWidth={completed ? 0.8 : 0.55} strokeDasharray={completed ? undefined : '2 2'} />; })}</svg>
        <ol className="relative h-full m-0 p-0 list-none">{entries.map((entry, index) => { const state = stateFor(index); const locked = state === 'locked'; const completed = state === 'completed'; const x = POSITIONS[index % POSITIONS.length]; const y = 75 + index * NODE_GAP; const labelPosition = x > 50 ? 'right-full top-1/2 -translate-y-1/2 mr-5 text-right' : x < 50 ? 'left-full top-1/2 -translate-y-1/2 ml-5 text-left' : 'left-1/2 top-full mt-4 -translate-x-1/2 text-center'; const labelWidth = x === 50 ? 'w-56' : 'w-52'; const to = `/roadmap/${entry.module.id}/${entry.day.slug}`; return <li key={`${entry.module.id}-${entry.day.id}`} className="absolute" style={{ left: `${x}%`, top: y, transform: 'translate(-50%, -50%)' }}><div className={`relative w-[58px] h-[58px] rounded-full flex items-center justify-center border-2 shadow-sm ${state === 'current' ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white learning-active-node' : completed ? 'bg-white dark:bg-[#141414] text-[#111111] dark:text-white border-[#111111] dark:border-white' : 'bg-[#F0F0F0] dark:bg-[#181818] text-[#888888] dark:text-[#777777] border-[#E5E5E5] dark:border-[#2A2A2A] opacity-70'}`}>{locked ? <LockKeyhole size={19} strokeWidth={1.8} /> : <Link to={to} aria-label={`${completed ? 'Review' : 'Open'} Day ${entry.day.id}: ${entry.day.title}`} className="w-full h-full rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAFA] dark:focus-visible:ring-offset-[#0D0D0D]"><Play size={17} fill="currentColor" /></Link>}{completed && <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#080808] border border-white dark:border-[#141414] flex items-center justify-center"><Check size={12} strokeWidth={3} /></span>}</div><span className={`absolute ${labelPosition} ${labelWidth} pointer-events-none`}><span className="block text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-[0.14em]">Module {String(entry.module.number).padStart(2, '0')} · Day {String(entry.day.id).padStart(2, '0')} · {completed ? 'Completed' : locked ? 'Locked' : 'Current'}</span><span className={`block mt-1 text-xs sm:text-sm font-extrabold font-heading uppercase leading-tight ${locked ? 'text-[#888888] dark:text-[#777777]' : 'text-[#111111] dark:text-white'}`}>{entry.day.title}</span></span></li>; })}</ol>
      </div>
    </section>
  </main>;
}
