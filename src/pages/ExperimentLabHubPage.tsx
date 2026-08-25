import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { FlaskConical, Lock, ArrowRight, Shield, Bug, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { roadmap } from '@/data/roadmap';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const moduleIcons: Record<string, typeof Shield> = {
  'module-1': Shield,
  'module-2': Bug,
  'module-3': Globe,
};

export function ExperimentLabHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 select-none font-mono">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
        {/* Header */}
        <motion.div variants={fadeUp} className="space-y-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808]">
              <FlaskConical size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white tracking-tight uppercase font-heading">
                Experiment Lab
              </h1>
              <p className="text-sm text-[#555555] dark:text-[#B5B5B5] mt-0.5 font-sans">
                Interactive, live-execution playgrounds for every module
              </p>
            </div>
          </div>
          <p className="text-sm text-[#555555] dark:text-[#B5B5B5] max-w-2xl font-sans">
            Each lab below is built around real module content. Inputs, controls, and outputs are
            wired to actual logic — no simulations, no fake results.
          </p>
        </motion.div>

        {/* Module Cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.map((module) => {
            const Icon = moduleIcons[module.id] || Shield;
            return (
              <Link
                key={module.id}
                to={module.comingSoon ? '#' : `/labs/${module.id}`}
                className={cn(
                  'group relative flex flex-col p-5 rounded-xl border transition-all duration-200',
                  module.comingSoon
                    ? 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#101010] opacity-70 cursor-not-allowed'
                    : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] dark:hover:border-white shadow-xs'
                )}
              >
                {module.comingSoon && (
                  <div className="absolute inset-0 rounded-xl bg-black/10 dark:bg-black/40 backdrop-blur-[1px] z-10" />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border',
                        module.comingSoon 
                          ? 'bg-[#F0F0F0] dark:bg-[#181818] text-[#888888] dark:text-[#666666] border-[#E5E5E5] dark:border-[#2A2A2A]' 
                          : 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white'
                      )}
                    >
                      {module.comingSoon ? <Lock size={16} /> : <Icon size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111111] dark:text-white">
                        {module.number}. {module.title}
                      </p>
                      <p className="text-[10px] font-mono text-[#888888] dark:text-[#777777] uppercase tracking-wider mt-0.5">
                        {module.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#555555] dark:text-[#B5B5B5] mt-3 leading-relaxed line-clamp-3 font-sans">
                  {module.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <span className="text-[10px] font-mono text-[#888888] dark:text-[#777777]">
                    {module.comingSoon ? 'Coming Soon' : `${module.days.length} Labs`}
                  </span>
                  {!module.comingSoon && (
                    <span className="text-xs text-[#111111] dark:text-white group-hover:underline transition-colors flex items-center gap-1">
                      Open Lab <ArrowRight size={13} />
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
