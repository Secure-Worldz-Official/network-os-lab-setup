import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Lock, ChevronRight, Play } from 'lucide-react';
import type { Module } from '@/data/roadmap';
import { cn } from '@/lib/utils';

interface ModuleLessonPathProps {
  module: Module;
  isComplete: (dayId: number) => boolean;
}

export function ModuleLessonPath({ module, isComplete }: ModuleLessonPathProps) {
  return (
    <div className="relative pl-3 pr-2 py-4 select-none font-mono">
      <div className="space-y-4">
        {module.days.map((day, idx) => {
          const completed = isComplete(day.id);
          const prevCompleted = idx === 0 || isComplete(module.days[idx - 1].id);
          const locked = idx > 0 && !prevCompleted;
          const current = !completed && prevCompleted;

          const to = `/roadmap/${module.id}/${day.slug}`;
          const isLast = idx === module.days.length - 1;

          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="relative flex items-start gap-4"
            >
              {/* Connector Line to Next Item */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-[19px] top-[38px] bottom-[-16px] w-[2px] z-0 transition-colors duration-300',
                    completed ? 'bg-[#111111] dark:bg-white' : 'bg-[#E5E5E5] dark:bg-[#2A2A2A]'
                  )}
                />
              )}

              {/* Node Circle */}
              <div className="relative z-10 shrink-0">
                <div
                  className={cn(
                    'w-[40px] h-[40px] rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all duration-200',
                    completed && 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-[#080808]',
                    current && 'bg-white dark:bg-[#141414] border-[#111111] dark:border-white text-[#111111] dark:text-white shadow-[0_0_0_4px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_4px_rgba(255,255,255,0.1)] animate-pulse',
                    locked && 'bg-[#FAFAFA] dark:bg-[#101010] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#888888] dark:text-[#666666]'
                  )}
                >
                  {completed ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : current ? (
                    <Play size={14} className="fill-current ml-0.5" />
                  ) : locked ? (
                    <Lock size={14} />
                  ) : (
                    <span>{day.id < 10 ? `0${day.id}` : day.id}</span>
                  )}
                </div>
              </div>

              {/* Node Card */}
              <div className="flex-1 min-w-0 pt-0.5">
                {locked ? (
                  <div className="p-3 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#0D0D0D] opacity-60 cursor-not-allowed">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#888888] dark:text-[#666666] font-heading uppercase truncate">
                        Day {day.id < 10 ? `0${day.id}` : day.id}: {day.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#888888] dark:text-[#666666] uppercase shrink-0">
                        [ Locked ]
                      </span>
                    </div>
                    <p className="text-[11px] text-[#888888] dark:text-[#666666] mt-1 font-sans line-clamp-1">
                      Complete Day {day.id - 1} to unlock this lesson.
                    </p>
                  </div>
                ) : (
                  <Link
                    to={to}
                    className={cn(
                      'group block p-3.5 rounded-lg border transition-all duration-150 card-lift',
                      completed
                        ? 'bg-[#F7F7F7] dark:bg-[#181818] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                        : 'bg-white dark:bg-[#141414] border-[#111111] dark:border-white shadow-xs'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-mono text-[#888888] dark:text-[#777777] uppercase shrink-0">
                          DAY 0{day.id}
                        </span>
                        <h4 className="text-xs font-bold text-[#111111] dark:text-white font-heading uppercase truncate">
                          {day.title}
                        </h4>
                      </div>
                      <ChevronRight size={14} className="text-[#888888] dark:text-[#777777] group-hover:text-[#111111] dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] text-[#555555] dark:text-[#B5B5B5] mt-1 font-sans line-clamp-1">
                      {day.learn[0]}
                    </p>
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
