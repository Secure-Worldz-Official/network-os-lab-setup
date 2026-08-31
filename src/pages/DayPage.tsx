import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { DayDetail } from '@/components/roadmap/DayDetail';
import { Button } from '@/components/ui/Button';
import { useProgress } from '@/hooks/useProgress';
import { roadmap } from '@/data/roadmap';

export function DayPage() {
  const { moduleId, daySlug } = useParams<{ moduleId: string; daySlug: string }>();
  const navigate   = useNavigate();
  const progress   = useProgress();

  const module = roadmap.find((m) => m.id === moduleId);
  const day    = module?.days.find((d) => d.slug === daySlug);

  if (!module || !day) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 select-none font-mono">
        <div className="w-12 h-12 rounded-full bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center mx-auto text-[#111111] dark:text-white">
          <AlertCircle size={24} />
        </div>
        <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-heading">
          Day Not Found
        </h1>
        <p className="text-sm text-[#555555] dark:text-[#B5B5B5] font-sans">
          The requested day does not exist or has not yet been unlocked.
        </p>
        <div className="pt-2">
          <Button variant="outline" size="md" onClick={() => navigate('/roadmap')}>
            <ArrowLeft size={15} />
            <span>Return to Roadmap</span>
          </Button>
        </div>
      </div>
    );
  }

  const dayIndex = module.days.findIndex((d) => d.id === day.id);
  const prevDay  = module.days[dayIndex - 1];
  const nextDay  = module.days[dayIndex + 1];
  const mp       = progress.moduleProgress(module.id);

  // ─── ROUTE GUARD: Sequential Lock ─────────────────────────────────────────
  // Day 1 is always accessible. Day N requires Day N-1 to be completed.
  const isLocked = dayIndex > 0 && !progress.isComplete(module.id, module.days[dayIndex - 1].id);

  if (isLocked) {
    // Find the highest day the user can actually access
    let lastAccessibleSlug = module.days[0].slug;
    for (let i = 1; i < module.days.length; i++) {
      if (progress.isComplete(module.id, module.days[i - 1].id)) {
        lastAccessibleSlug = module.days[i].slug;
      } else {
        break;
      }
    }

    // Show a brief locked indicator before redirecting
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5 select-none font-mono">
        <div className="w-14 h-14 rounded-full bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center mx-auto">
          <Lock size={22} className="text-[#888888] dark:text-[#777777]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
            LESSON LOCKED
          </h1>
          <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans max-w-sm mx-auto">
            Complete <strong className="text-[#111111] dark:text-white">Day {dayIndex} — {module.days[dayIndex - 1].title}</strong> to unlock this lesson.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Navigate to={`/roadmap/${moduleId}/${lastAccessibleSlug}`} replace />
        </div>
      </div>
    );
  }
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${moduleId}-${daySlug}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="pb-24 sm:pb-28 select-none font-mono"
      >
        {/* Day Content */}
        <DayDetail
          day={day}
          moduleId={module.id}
          isComplete={progress.isComplete(module.id, day.id)}
          onToggle={() => progress.toggle(module.id, day.id)}
          moduleProgress={mp}
        />

        {/* Prev / Next Bottom Navigation */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="h-px bg-[#E5E5E5] dark:bg-[#2A2A2A] mb-5" />
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-3">
            {prevDay ? (
              <Link
                to={`/roadmap/${module.id}/${prevDay.slug}`}
                id={`nav-prev-day-${prevDay.id}`}
                className="group flex items-center gap-3 p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] dark:hover:border-white transition-all flex-1 card-lift"
              >
                <ChevronLeft size={16} className="text-[#888888] group-hover:text-[#111111] dark:group-hover:text-white transition-colors shrink-0" />
                <div className="min-w-0 text-left">
                  <span className="block text-[9px] font-mono uppercase text-[#888888] dark:text-[#777777] tracking-widest font-bold">Previous</span>
                  <span className="block text-xs font-bold text-[#111111] dark:text-white truncate uppercase font-heading">
                    Day 0{prevDay.id}: {prevDay.title}
                  </span>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextDay ? (
              // Show lock state if next day is locked
              progress.isComplete(module.id, day.id) ? (
                <Link
                  to={`/roadmap/${module.id}/${nextDay.slug}`}
                  id={`nav-next-day-${nextDay.id}`}
                  className="group flex items-center justify-end gap-3 p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] dark:hover:border-white transition-all flex-1 card-lift text-right"
                >
                  <div className="min-w-0">
                    <span className="block text-[9px] font-mono uppercase text-[#888888] dark:text-[#777777] tracking-widest font-bold">Next</span>
                    <span className="block text-xs font-bold text-[#111111] dark:text-white truncate uppercase font-heading">
                      Day 0{nextDay.id}: {nextDay.title}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-[#888888] group-hover:text-[#111111] dark:group-hover:text-white transition-colors shrink-0" />
                </Link>
              ) : (
                <div className="flex items-center justify-end gap-3 p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#0D0D0D] flex-1 opacity-60 cursor-not-allowed text-right">
                  <div className="min-w-0">
                    <span className="block text-[9px] font-mono uppercase text-[#888888] dark:text-[#777777] tracking-widest font-bold">Next (Locked)</span>
                    <span className="block text-xs font-bold text-[#888888] dark:text-[#555555] truncate uppercase font-heading">
                      Day 0{nextDay.id}: {nextDay.title}
                    </span>
                  </div>
                  <Lock size={14} className="text-[#888888] dark:text-[#555555] shrink-0" />
                </div>
              )
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
