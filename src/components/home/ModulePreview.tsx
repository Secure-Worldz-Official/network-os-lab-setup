import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
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
    <section className="px-6 sm:px-8 py-12" aria-label="Module overview">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="section-label block mb-2">The Curriculum</span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            What you'll cover
          </h2>
        </div>

        <div className="space-y-3">
          {roadmap.map((module, i) => {
            const mp = progress.moduleProgress(module.id);
            const pct = mp.total > 0 ? (mp.done / mp.total) * 100 : 0;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={module.comingSoon ? 'card-locked' : 'card'}
              >
                <div className="p-5 flex items-start gap-4">
                  {/* Number */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-sm font-bold"
                    style={{
                      background: module.comingSoon ? 'var(--bg-elevated)' : 'var(--accent-pale)',
                      border: `1px solid ${module.comingSoon ? 'var(--border)' : 'var(--accent-dim)'}`,
                      color: module.comingSoon ? 'var(--text-muted)' : 'var(--accent)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {module.comingSoon ? <Lock size={14} /> : module.number}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Module {module.number}: {module.title}
                      </h3>
                      {module.comingSoon ? (
                        <Badge variant="locked">Coming Soon</Badge>
                      ) : pct > 0 ? (
                        <Badge variant="accent">{Math.round(pct)}% done</Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">{module.subtitle}</p>
                    <p className="text-xs text-[var(--text-muted)]">{module.dayRange}</p>

                    {!module.comingSoon && (
                      <ProgressBar value={pct} size="sm" className="mt-3 max-w-[200px]" />
                    )}
                  </div>

                  {/* CTA */}
                  {!module.comingSoon && (
                    <Link
                      to="/roadmap"
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:text-red-400 transition-colors"
                      id={`module-preview-cta-${module.id}`}
                    >
                      View
                      <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
