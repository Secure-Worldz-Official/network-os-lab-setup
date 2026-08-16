import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { DayDetail } from '@/components/roadmap/DayDetail';
import { useProgress } from '@/hooks/useProgress';
import { roadmap } from '@/data/roadmap';

export function DayPage() {
  const { moduleId, daySlug } = useParams<{ moduleId: string; daySlug: string }>();
  const navigate = useNavigate();
  const progress = useProgress();

  const module = roadmap.find((m) => m.id === moduleId);
  const day = module?.days.find((d) => d.slug === daySlug);

  if (!module || !day) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <AlertTriangle size={40} className="text-[var(--accent)] mb-4" />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Day not found
        </h1>
        <p className="text-[var(--text-muted)] mb-6 text-sm">
          This day doesn't exist yet. Check the roadmap for available content.
        </p>
        <Link
          to="/roadmap"
          className="flex items-center gap-2 text-sm text-[var(--accent)] hover:text-red-400 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Roadmap
        </Link>
      </div>
    );
  }

  const dayIndex = module.days.findIndex((d) => d.id === day.id);
  const prevDay = module.days[dayIndex - 1];
  const nextDay = module.days[dayIndex + 1];
  const mp = progress.moduleProgress(module.id);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${moduleId}-${daySlug}`}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.25 }}
      >
        {/* Breadcrumb */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Link to="/" className="hover:text-[var(--text-secondary)] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/roadmap" className="hover:text-[var(--text-secondary)] transition-colors">Roadmap</Link>
            <ChevronRight size={12} />
            <span className="text-[var(--text-secondary)]">Module {module.number}</span>
            <ChevronRight size={12} />
            <span className="text-[var(--text-primary)]">Day {day.id}</span>
          </nav>
        </div>

        <DayDetail
          day={day}
          moduleId={module.id}
          isComplete={progress.isComplete(module.id, day.id)}
          onToggle={() => progress.toggle(module.id, day.id)}
          moduleProgress={mp}
        />

        {/* Day navigation */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="divider" />
          <div className="flex items-center justify-between gap-4">
            {prevDay ? (
              <Link
                to={`/roadmap/${module.id}/${prevDay.slug}`}
                id={`nav-prev-day-${prevDay.id}`}
                className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent-dim)] hover:bg-[var(--bg-elevated)] transition-all group max-w-[48%]"
              >
                <ChevronLeft size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-[var(--text-muted)]">Previous</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                    Day {prevDay.id} · {prevDay.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextDay ? (
              <Link
                to={`/roadmap/${module.id}/${nextDay.slug}`}
                id={`nav-next-day-${nextDay.id}`}
                className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent-dim)] hover:bg-[var(--bg-elevated)] transition-all group max-w-[48%] ml-auto text-right"
              >
                <div className="min-w-0">
                  <p className="text-xs text-[var(--text-muted)]">Next</p>
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                    Day {nextDay.id} · {nextDay.title}
                  </p>
                </div>
                <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0" />
              </Link>
            ) : (
              <button
                onClick={() => navigate('/roadmap')}
                className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] border border-[var(--accent-dim)] bg-[var(--accent-pale)] hover:bg-[var(--bg-elevated)] transition-all ml-auto text-sm font-medium text-[var(--accent)] cursor-pointer"
                id="nav-module-complete"
              >
                Module complete!
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
