import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { allTasks, getTasksForLab, type Task } from '@/data/tasks';

interface TaskContextValue {
  completedTasks: Set<string>;
  totalCompleted: number;
  totalTasks: number;
  completeTask: (taskId: string) => void;
  isTaskCompleted: (taskId: string) => boolean;
  getLabProgress: (labId: string) => { completed: number; total: number };
  showCelebration: boolean;
  currentCelebrationTask: Task | null;
  dismissCelebration: () => void;
  verifyAndComplete: (labId: string, output: string, error?: string, timing?: number | null) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentCelebrationTask, setCurrentCelebrationTask] = useState<Task | null>(null);

  const completeTask = useCallback((taskId: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      next.add(taskId);
      return next;
    });
  }, []);

  const isTaskCompleted = useCallback((taskId: string) => {
    return completedTasks.has(taskId);
  }, [completedTasks]);

  const getLabProgress = useCallback(
    (labId: string) => {
      const tasks = getTasksForLab(labId);
      const completed = tasks.filter((t) => completedTasks.has(t.id)).length;
      return { completed, total: tasks.length };
    },
    [completedTasks]
  );

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    setCurrentCelebrationTask(null);
  }, []);

  const verifyAndComplete = useCallback(
    (labId: string, output: string, error?: string, timing?: number | null) => {
      const tasks = getTasksForLab(labId);
      tasks.forEach((task) => {
        if (!completedTasks.has(task.id)) {
          try {
            const passed = task.verify(output, error, timing);
            if (passed) {
              completeTask(task.id);
              setCurrentCelebrationTask(task);
              setShowCelebration(true);
            }
          } catch {
            // ignore verification errors
          }
        }
      });
    },
    [completedTasks, completeTask]
  );

  return (
    <TaskContext.Provider
      value={{
        completedTasks,
        totalCompleted: completedTasks.size,
        totalTasks: allTasks.length,
        completeTask,
        isTaskCompleted,
        getLabProgress,
        showCelebration,
        currentCelebrationTask,
        dismissCelebration,
        verifyAndComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be used within TaskProvider');
  return ctx;
}
