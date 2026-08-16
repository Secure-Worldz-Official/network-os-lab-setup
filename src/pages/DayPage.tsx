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
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-300">
          <AlertCircle size={24} />
        </div>
        <h1 className="text-2xl font-bold text-white font-heading">
          Day Not Found
        </h1>
        <p className="text-sm text-zinc-400">
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
        className="pb-16"
      >
        {/* Breadcrumb Navigation Bar */}
        <div className="border-b border-zinc-800/80 bg-[#0c0c0e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="text-zinc-600" />
              <Link to="/roadmap" className="hover:text-white transition-colors">
                Roadmap
              </Link>
              <ChevronRight size={12} className="text-zinc-600" />
              <span className="text-zinc-400">Module {module.number}</span>
              <ChevronRight size={12} className="text-zinc-600" />
              <span className="text-white font-semibold">Day 0{day.id}</span>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="h-[1px] bg-zinc-800 mb-6" />
          <div className="flex items-center justify-between gap-4">
            {prevDay ? (
              <Link
                to={`/roadmap/${module.id}/${prevDay.slug}`}
                id={`nav-prev-day-${prevDay.id}`}
                className="group flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-lg border border-zinc-800 bg-[#111113] hover:border-zinc-600 hover:bg-zinc-900 transition-all max-w-[48%]"
              >
                <ChevronLeft size={16} className="text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" />
                <div className="min-w-0 text-left">
                  <span className="block text-[10px] font-mono uppercase text-zinc-500">
                    Previous Day
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                    Day {prevDay.id}: {prevDay.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextDay ? (
              <Link
                to={`/roadmap/${module.id}/${nextDay.slug}`}
                id={`nav-next-day-${nextDay.id}`}
                className="group flex items-center justify-end gap-3 p-3 sm:px-4 sm:py-3 rounded-lg border border-zinc-800 bg-[#111113] hover:border-zinc-600 hover:bg-zinc-900 transition-all max-w-[48%] ml-auto text-right"
              >
                <div className="min-w-0 text-right">
                  <span className="block text-[10px] font-mono uppercase text-zinc-500">
                    Next Day
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                    Day {nextDay.id}: {nextDay.title}
                  </span>
                </div>
                <ChevronRight size={16} className="text-zinc-400 group-hover:text-white transition-colors flex-shrink-0" />
              </Link>
            ) : (
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/roadmap')}
                id="nav-module-complete-btn"
                className="ml-auto"
              >
                <span>Curriculum Overview</span>
                <ChevronRight size={15} />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
