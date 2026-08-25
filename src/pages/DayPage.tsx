import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { DayDetail } from '@/components/roadmap/DayDetail';
import { Button } from '@/components/ui/Button';
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
  const prevDay = module.days[dayIndex - 1];
  const nextDay = module.days[dayIndex + 1];
  const mp = progress.moduleProgress(module.id);

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
        {/* Breadcrumb Navigation Bar */}
        <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white/80 dark:bg-[#080808]/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#666666] dark:text-[#B5B5B5] flex-wrap">
              <Link to="/" className="hover:text-[#111111] dark:hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="text-[#888888] dark:text-[#666666] shrink-0" />
              <Link to="/roadmap" className="hover:text-[#111111] dark:hover:text-white transition-colors">
                Roadmap
              </Link>
              <ChevronRight size={12} className="text-[#888888] dark:text-[#666666] shrink-0" />
              <span>Module 1</span>
              <ChevronRight size={12} className="text-[#888888] dark:text-[#666666] shrink-0" />
              <span className="text-[#111111] dark:text-white font-semibold">Day 0{day.id}</span>
            </nav>
          </div>
        </div>

        {/* Day Content */}
        <DayDetail
          day={day}
          moduleId={module.id}
          isComplete={progress.isComplete(module.id, day.id)}
          onToggle={() => progress.toggle(module.id, day.id)}
          moduleProgress={mp}
        />

        {/* Prev / Next Bottom Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="h-[1px] bg-[#E5E5E5] dark:bg-[#2A2A2A] mb-6" />
          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-3.5 sm:gap-4">
             {prevDay ? (
               <Link
                 to={`/roadmap/${module.id}/${prevDay.slug}`}
                 id={`nav-prev-day-${prevDay.id}`}
                 className="group flex items-center gap-3.5 p-4 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] dark:hover:border-white hover:bg-[#FAFAFA] dark:hover:bg-[#181818] transition-all flex-1 shadow-xs"
               >
                <ChevronLeft size={18} className="text-[#888888] dark:text-[#777777] group-hover:text-[#111111] dark:group-hover:text-white transition-colors shrink-0" />
                <div className="min-w-0 text-left">
                  <span className="block text-[10px] font-mono uppercase text-[#888888] dark:text-[#777777]">
                    Previous Day
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-[#111111] dark:text-white truncate">
                    Day 0{prevDay.id}: {prevDay.title}
                  </span>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextDay && (
              <Link
                to={`/roadmap/${module.id}/${nextDay.slug}`}
                id={`nav-next-day-${nextDay.id}`}
                className="group flex items-center justify-end gap-3.5 p-4 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] dark:hover:border-white hover:bg-[#FAFAFA] dark:hover:bg-[#181818] transition-all flex-1 shadow-xs text-right"
              >
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono uppercase text-[#888888] dark:text-[#777777]">
                    Next Day
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-[#111111] dark:text-white truncate">
                    Day 0{nextDay.id}: {nextDay.title}
                  </span>
                </div>
                <ChevronRight size={18} className="text-[#888888] dark:text-[#777777] group-hover:text-[#111111] dark:group-hover:text-white transition-colors shrink-0" />
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
