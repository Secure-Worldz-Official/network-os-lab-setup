import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Lock, Play, Sparkles } from 'lucide-react';
import { roadmap, type Module, type Day } from '@/data/roadmap';
import { cn } from '@/lib/utils';

interface CandyCrushPathProps {
  isComplete: (moduleId: string, dayId: number) => boolean;
}

interface PathNode {
  globalIndex: number;
  module: Module;
  day: Day;
  completed: boolean;
  unlocked: boolean;
  current: boolean;
  xPercent: number; // Horizontal position % (e.g., 20%, 50%, 80%)
}

export function CandyCrushPath({ isComplete }: CandyCrushPathProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Flatten all lessons across modules into a single continuous sequential path
  const nodes: PathNode[] = [];
  let indexCounter = 0;

  roadmap.forEach((module) => {
    module.days.forEach((day) => {
      const globalIndex = indexCounter++;
      const completed = isComplete(module.id, day.id);

      // Determine unlock state: Day 1 (globalIndex 0) is unlocked by default.
      // Otherwise, unlocked if previous day in sequence is completed.
      let unlocked = globalIndex === 0;
      if (globalIndex > 0) {
        const prevNode = nodes[globalIndex - 1];
        unlocked = prevNode ? prevNode.completed : false;
      }

      // Current node is the first unlocked but incomplete node
      const current = unlocked && !completed;

      // Calculate winding horizontal X percentage
      // Mobile: subtle oscillation (38% -> 50% -> 62% -> 50%) to prevent horizontal scroll clipping
      // Desktop: wider oscillation (25% -> 50% -> 75% -> 50%)
      const positionCycle = globalIndex % 4;
      let xPercent = 50;
      if (positionCycle === 0) xPercent = isMobile ? 38 : 25;
      else if (positionCycle === 1) xPercent = 50;
      else if (positionCycle === 2) xPercent = isMobile ? 62 : 75;
      else if (positionCycle === 3) xPercent = 50;

      nodes.push({
        globalIndex,
        module,
        day,
        completed,
        unlocked,
        current,
        xPercent,
      });
    });
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8 sm:py-12 px-2 sm:px-4 select-none font-mono min-h-[900px] overflow-hidden">
      {/* SECTION HEADER */}
      <div className="text-center space-y-3 mb-12 sm:mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#080808] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          <Sparkles size={13} />
          <span>LEARNING LAB // SEQUENTIAL LEVEL MAP</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
          CONTINUOUS CURRICULUM LEVEL PATH
        </h2>
        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-lg mx-auto leading-relaxed">
          Scroll down through the winding lesson roadmap. Complete each lesson's interactive visualization to unlock the next level.
        </p>
      </div>

      {/* WINDING PATH CONTAINER */}
      <div className="relative w-full overflow-hidden">
        {/* SVG CONNECTING PATH LINE */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          style={{ minHeight: `${nodes.length * 150}px` }}
        >
          {nodes.map((node, i) => {
            if (i === nodes.length - 1) return null;
            const nextNode = nodes[i + 1];

            const startY = i * 150 + 40;
            const endY = (i + 1) * 150 + 40;

            const startX = `${node.xPercent}%`;
            const endX = `${nextNode.xPercent}%`;

            // SVG path between two consecutive nodes
            return (
              <line
                key={`line-${i}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={node.completed ? 'var(--emerald-500, #10B981)' : '#E5E5E5'}
                className={cn(
                  'transition-colors duration-300',
                  node.completed ? 'stroke-[#111111] dark:stroke-white' : 'dark:stroke-[#2A2A2A]'
                )}
                strokeWidth={node.completed ? 4 : 3}
                strokeDasharray={node.completed ? undefined : '6 6'}
              />
            );
          })}
        </svg>

        {/* NODES STACK */}
        <div className="relative z-10 space-y-[70px]">
          {nodes.map((node) => {
            const to = `/roadmap/${node.module.id}/${node.day.slug}`;

            return (
              <div
                key={`${node.module.id}-${node.day.id}`}
                className="relative flex flex-col items-center justify-center min-h-[80px]"
                style={{
                  transform: `translateX(${(node.xPercent - 50) * (isMobile ? 1.2 : 2.5)}px)`
                }}
              >
                {/* NODE BUTTON WRAPPER */}
                <div className="relative flex flex-col items-center group">
                  {/* Floating Tooltip / Module Tag */}
                  <div className="absolute -top-7 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#888888] dark:text-[#777777] whitespace-nowrap font-mono bg-white dark:bg-[#080808] px-2 py-0.5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs">
                    LEVEL 0{node.globalIndex + 1} · DAY {node.day.id}
                  </div>

                  {/* CIRCULAR LEVEL NODE BUTTON */}
                  {node.unlocked ? (
                    <Link
                      to={to}
                      className={cn(
                        'relative w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center font-mono text-xs sm:text-base font-extrabold transition-all duration-300 shadow-md card-lift cursor-pointer shrink-0',
                        node.completed
                          ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-[#080808] shadow-emerald-500/20'
                          : node.current
                          ? 'bg-white dark:bg-[#141414] border-[#111111] dark:border-white text-[#111111] dark:text-white ring-4 ring-[#111111]/20 dark:ring-white/20 animate-pulse scale-105'
                          : 'bg-white dark:bg-[#101010] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white'
                      )}
                    >
                      {node.completed ? (
                        <Check size={22} strokeWidth={3} />
                      ) : node.current ? (
                        <Play size={20} className="fill-current ml-0.5" />
                      ) : (
                        <span>0{node.day.id}</span>
                      )}

                      {/* Active Indicator Badge */}
                      {/* {node.current && (
                        <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider animate-bounce">
                          PLAY
                        </span>
                      )} */}
                    </Link>
                  ) : (
                    /* LOCKED NODE BUTTON */
                    <div
                      className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#101010] text-[#888888] dark:text-[#666666] flex items-center justify-center font-mono text-xs sm:text-sm font-bold opacity-75 cursor-not-allowed shrink-0"
                      title={`Complete Level 0${node.globalIndex} to unlock`}
                    >
                      <Lock size={18} />
                      <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-[#E5E5E5] dark:bg-[#202020] text-[#666666] dark:text-[#888888] text-[8px] sm:text-[9px] font-bold uppercase">
                        LOCKED
                      </span>
                    </div>
                  )}

                  {/* LEVEL CARD FLYOUT / PREVIEW */}
                  <div
                    className={cn(
                      'mt-3 w-56 sm:w-72 p-3 sm:p-4 rounded-xl border transition-all duration-200 text-center space-y-1.5 sm:space-y-2 bg-white dark:bg-[#141414] shadow-sm',
                      node.completed
                        ? 'border-[#E5E5E5] dark:border-[#2A2A2A]'
                        : node.current
                        ? 'border-[#111111] dark:border-white shadow-md'
                        : 'border-[#E5E5E5] dark:border-[#2A2A2A] opacity-60'
                    )}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[8px] sm:text-[9px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-wider block">
                        MODULE 0{node.module.number}: {node.module.title}
                      </span>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#111111] dark:text-white font-heading uppercase truncate">
                        {node.day.title}
                      </h3>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-[#555555] dark:text-[#B5B5B5] font-sans line-clamp-1">
                      {node.day.learn[0]}
                    </p>

                    {node.unlocked ? (
                      <Link
                        to={to}
                        className={cn(
                          'block w-full py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold font-mono uppercase tracking-wider transition-all mt-2 text-center',
                          node.completed
                            ? 'bg-[#F0F0F0] dark:bg-[#1E1E1E] text-[#111111] dark:text-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-[#080808]'
                            : 'bg-[#111111] text-white dark:bg-white dark:text-[#080808] font-extrabold shadow-sm hover:scale-[1.02]'
                        )}
                      >
                        <span className={cn(
                          "inline-block font-extrabold",
                          node.completed ? "text-[#111111] dark:text-white" : "text-white dark:text-[#080808]"
                        )}>
                          {node.completed ? 'REVIEW LESSON' : 'START LESSON →'}
                        </span>
                      </Link>
                    ) : (
                      <div className="text-[9px] sm:text-[10px] font-mono text-[#888888] dark:text-[#666666] pt-1">
                        🔒 Complete previous lesson to unlock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
