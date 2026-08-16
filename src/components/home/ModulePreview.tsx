import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Terminal } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { roadmap } from '@/data/roadmap';
import type { useProgress } from '@/hooks/useProgress';

type ProgressAPI = ReturnType<typeof useProgress>;

interface ModulePreviewProps {
  progress: ProgressAPI;
}

export function ModulePreview({ progress }: ModulePreviewProps) {
  return (
    <section className="py-14 sm:py-20 bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Curriculum Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading tracking-tight mt-1">
              Roadmap Structure
            </h2>
          </div>
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <span>Explore All 3 Modules</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-4">
          {roadmap.map((module, i) => {
            const mp = progress.moduleProgress(module.id);
            const pct = mp.total > 0 ? (mp.done / mp.total) * 100 : 0;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`rounded-xl border p-5 sm:p-6 transition-all ${
                  module.comingSoon
                    ? 'bg-[#0f0f12]/40 border-zinc-850 opacity-60'
                    : 'bg-[#111113] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 ${
                        module.comingSoon
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-600'
                          : 'bg-zinc-900 border-zinc-700 text-white'
                      }`}
                    >
                      {module.comingSoon ? <Lock size={15} /> : `0${module.number}`}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-bold text-white font-heading tracking-tight">
                          Module {module.number}: {module.title}
                        </h3>
                        {module.comingSoon ? (
                          <Badge variant="locked">Coming Soon</Badge>
                        ) : pct === 100 ? (
                          <Badge variant="solid">Complete</Badge>
                        ) : pct > 0 ? (
                          <Badge variant="outline">{Math.round(pct)}% Done</Badge>
                        ) : (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-400">
                        {module.subtitle}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Terminal size={12} />
                          {module.dayRange}
                        </span>
                        {!module.comingSoon && (
                          <span>· {mp.done}/{mp.total} days completed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between items-center gap-3 sm:min-w-[180px]">
                    {!module.comingSoon ? (
                      <>
                        <ProgressBar value={pct} size="sm" className="max-w-[160px]" />
                        <Link
                          to="/roadmap"
                          className="inline-flex items-center gap-1 text-xs font-mono font-medium text-white hover:text-zinc-300 transition-colors"
                        >
                          <span>Open Module</span>
                          <ArrowRight size={13} />
                        </Link>
                      </>
                    ) : (
                      <span className="text-xs font-mono text-zinc-500">
                        In Development
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
