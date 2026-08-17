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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
        {/* Header */}
        <motion.div variants={fadeUp} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Experiment Lab
              </h1>
              <p className="text-sm text-zinc-400 mt-0.5">
                Interactive, live-execution playgrounds for every module
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl">
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
                    ? 'border-zinc-800 bg-zinc-950/40 opacity-70 cursor-not-allowed'
                    : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)]'
                )}
              >
                {module.comingSoon && (
                  <div className="absolute inset-0 rounded-xl bg-zinc-950/30 backdrop-blur-[1px] z-10" />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                        module.comingSoon ? 'bg-zinc-900 text-zinc-600 border border-zinc-800' : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                      )}
                    >
                      {module.comingSoon ? <Lock size={16} /> : <Icon size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">
                        {module.number}. {module.title}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">
                        {module.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mt-3 leading-relaxed line-clamp-3">
                  {module.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/70">
                  <span className="text-[10px] font-mono text-zinc-500">
                    {module.comingSoon ? 'Coming Soon' : `${module.days.length} Labs`}
                  </span>
                  {!module.comingSoon && (
                    <span className="text-xs text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
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
