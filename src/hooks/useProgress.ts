import { useState, useCallback, useEffect } from 'react';
import { roadmap } from '@/data/roadmap';
import { formatDayId, parseProgress } from '@/lib/utils';

const STORAGE_KEY = 'cyber-roadmap-progress';

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    return parseProgress(localStorage.getItem(STORAGE_KEY));
  });

  // Persist to localStorage whenever completed changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed]);

  const toggle = useCallback((moduleId: string, dayId: number) => {
    const key = formatDayId(moduleId, dayId);
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (moduleId: string, dayId: number) => {
      return completed.has(formatDayId(moduleId, dayId));
    },
    [completed]
  );

  const moduleProgress = useCallback(
    (moduleId: string) => {
      const module = roadmap.find((m) => m.id === moduleId);
      if (!module || module.days.length === 0) return { done: 0, total: 0 };
      const done = module.days.filter((d) =>
        completed.has(formatDayId(moduleId, d.id))
      ).length;
      return { done, total: module.days.length };
    },
    [completed]
  );

  const overallProgress = useCallback(() => {
    const allDays = roadmap.flatMap((m) =>
      m.days.map((d) => formatDayId(m.id, d.id))
    );
    const done = allDays.filter((id) => completed.has(id)).length;
    return { done, total: allDays.length };
  }, [completed]);

  const completedCount = completed.size;

  return { completed, toggle, isComplete, moduleProgress, overallProgress, completedCount };
}
