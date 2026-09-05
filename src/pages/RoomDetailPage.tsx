import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberPath } from '@/context/CyberPathContext';
import { rooms, type RoomTask } from '@/data/cyberpathData';
import {
  ArrowLeft,
  Terminal as TermIcon,
  CheckCircle,
  ChevronRight,
  Info,
  Play,
  Square,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronLeft,
  Lock,
  Award,
  Sparkles
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { InteractiveTerminal } from '@/components/terminal/InteractiveTerminal';
import { WebLabTarget } from '@/components/lab/WebLabTarget';
import { TaskValidator } from '@/lib/labServices';
import { TechnicalVisual } from '@/components/roadmap/TechnicalVisual';
import { cn } from '@/lib/utils';

type ActiveTab = 'intro' | 'task' | 'quiz';

export function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();

  const {
    completedTasks,
    completeTask,
    completeRoom,
    completeQuiz,
    isQuizCompleted,
    activeLab,
    startLab,
    stopLab,
    resetLab,
    deductXp
  } = useCyberPath();

  const room = rooms.find((r) => r.id === roomId);

  const [activeTab, setActiveTab] = useState<ActiveTab>('intro');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [taskFeedback, setTaskFeedback] = useState<Record<string, { success: boolean; msg: string }>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  // Unlock animation and locked interaction toast state
  const [justUnlockedId, setJustUnlockedId] = useState<string | null>(null);
  const [lockedToast, setLockedToast] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<{ title: string; subtitle: string } | null>(null);

  // Quiz state
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState<Record<number, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto initialize lab session if not running
  useEffect(() => {
    if (room && (!activeLab || activeLab.roomId !== room.id)) {
      startLab(room.id);
    }
  }, [room?.id]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    };
  }, []);

  if (!room) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 font-mono select-none">
        <h2 className="text-xl font-bold text-[#111111] dark:text-white font-heading">LAB NOT FOUND</h2>
        <p className="text-xs text-[#666666] dark:text-[#999999] font-sans">
          The requested practical lab could not be located in the training catalog.
        </p>
        <Link to="/labs">
          <button className="btn-cyber-primary text-xs py-2 px-4">
            ← BACK TO ALL LABS
          </button>
        </Link>
      </div>
    );
  }

  const roomTasks = room.tasks;
  const introTaskId = `intro-${room.id}`;
  const isIntroCompleted = completedTasks.has(introTaskId) || roomTasks.some(t => completedTasks.has(t.id));

  // ─── SEQUENTIAL UNLOCK DETERMINATION (Rule 1, 2, 19, 35) ──────────────────────────
  // Check if a specific task index is unlocked
  const isTaskIndexUnlocked = (index: number): boolean => {
    if (index === 0) {
      return isIntroCompleted || true; // Task 1 is unlocked once intro is read or from start
    }
    const prevTask = roomTasks[index - 1];
    return Boolean(prevTask && completedTasks.has(prevTask.id));
  };

  // Check if final certification exam is unlocked (all room tasks complete)
  const isQuizUnlocked = useMemo(() => {
    return roomTasks.length > 0 && roomTasks.every(t => completedTasks.has(t.id));
  }, [roomTasks, completedTasks]);

  // Derived overall completion progress
  const completedRoomTasksCount = roomTasks.filter((t) => completedTasks.has(t.id)).length;
  const isExamDone = isQuizCompleted(room.id);

  // Total steps = Intro (1) + Tasks (N) + Exam (1)
  const totalSteps = 1 + roomTasks.length + 1;
  const completedStepsCount = (isIntroCompleted ? 1 : 0) + completedRoomTasksCount + (isExamDone ? 1 : 0);
  const progressPct = Math.round((completedStepsCount / totalSteps) * 100);

  // ─── DIRECT URL & STATE TAMPERING PROTECTION (Rule 18) ────────────────────────────
  useEffect(() => {
    if (activeTab === 'task') {
      if (!isTaskIndexUnlocked(selectedTaskIndex)) {
        // Clamp to highest available unlocked task
        let highestUnlocked = 0;
        for (let i = 0; i < roomTasks.length; i++) {
          if (isTaskIndexUnlocked(i)) highestUnlocked = i;
          else break;
        }
        setSelectedTaskIndex(highestUnlocked);
      }
    } else if (activeTab === 'quiz' && !isQuizUnlocked && !isExamDone) {
      setActiveTab('task');
      setSelectedTaskIndex(0);
    }
  }, [activeTab, selectedTaskIndex, isIntroCompleted, isQuizUnlocked, isExamDone]);

  // Show non-blocking locked message toast (Rule 4 & 25)
  const triggerLockedNotice = (requiredTaskName: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setLockedToast(`🔒 Locked: Complete ${requiredTaskName} to unlock.`);
    toastTimerRef.current = setTimeout(() => {
      setLockedToast(null);
    }, 2800);
  };

  // Show task completion feedback banner (Rule 9)
  const triggerSuccessBanner = (title: string, subtitle: string) => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setSuccessBanner({ title, subtitle });
    bannerTimerRef.current = setTimeout(() => {
      setSuccessBanner(null);
    }, 3200);
  };

  // Handle Completing Introduction
  const handleCompleteIntro = () => {
    completeTask(introTaskId);
    triggerSuccessBanner('Task 01 Completed', 'Task 02 is now unlocked.');

    // Unlock animation on task 0
    if (roomTasks.length > 0) {
      setJustUnlockedId(roomTasks[0].id);
      setTimeout(() => setJustUnlockedId(null), 1200);
      setTimeout(() => {
        setActiveTab('task');
        setSelectedTaskIndex(0);
      }, 500);
    }
  };

  // Handle Question Submission (Rule 6, 7, 10, 11)
  const handleTaskSubmit = (task: RoomTask, taskIdx: number) => {
    const userAns = answers[task.id] || '';
    const result = TaskValidator.validate(userAns, task.answer);

    setTaskFeedback(prev => ({
      ...prev,
      [task.id]: { success: result.success, msg: result.message }
    }));

    if (result.success) {
      // 1. Mark current task as COMPLETED
      completeTask(task.id);

      const isLastTask = taskIdx === roomTasks.length - 1;
      const nextTaskId = !isLastTask ? roomTasks[taskIdx + 1].id : 'quiz';

      // 2. Trigger micro-animation on next task
      setJustUnlockedId(nextTaskId);
      setTimeout(() => setJustUnlockedId(null), 1200);

      // 3. Trigger compact success banner
      triggerSuccessBanner(
        `✓ ${task.title} Completed (+${task.points} XP)`,
        isLastTask ? 'Final Certification Exam Unlocked!' : `Task 0${taskIdx + 3} Unlocked.`
      );

      // 4. Auto-select next task smoothly after brief delay (Rule 10)
      setTimeout(() => {
        if (!isLastTask) {
          setSelectedTaskIndex(taskIdx + 1);
        } else {
          setActiveTab('quiz');
        }
      }, 700);

      // 5. Complete room if all tasks and quiz are solved
      if (isLastTask && isExamDone) {
        setTimeout(() => completeRoom(room.id), 500);
      }
    }
  };

  const toggleHint = (taskId: string) => {
    if (!showHints[taskId]) {
      deductXp(10, 'Revealed Task Hint');
    }
    setShowHints(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Handle Final Exam Submission (Rule 20, 31)
  const handleQuizSubmit = () => {
    const q1 = quizSelectedAnswers[0];
    const q2 = quizSelectedAnswers[1];

    if (!q1 || !q2) {
      setQuizFeedback('Please answer all exam questions before submitting.');
      return;
    }

    if (q1 === 'b' && q2 === 'a') {
      setQuizFeedback('✓ Certification Verified! You have passed the examination.');
      setQuizSubmitted(true);
      completeQuiz(room.id, 250);
      completeRoom(room.id);
      triggerSuccessBanner('Certification Verified!', `Congratulations! +${room.xp} XP awarded.`);
    } else {
      setQuizFeedback('✕ Some answers were incorrect. Review the module tasks and try again.');
    }
  };

  const currentTask: RoomTask | undefined = roomTasks[selectedTaskIndex];
  const isLabActive = activeLab && activeLab.roomId === room.id;

  const renderTaskWorkspace = () => {
    if (!currentTask) return null;

    if (currentTask.isWebLab || room.isWebLab) {
      return (
        <WebLabTarget
          targetIp={activeLab?.targetIp || '10.10.20.15'}
          onFlagSubmit={(flag) => setAnswers(prev => ({ ...prev, [currentTask.id]: flag }))}
        />
      );
    }

    return (
      <InteractiveTerminal
        targetIp={activeLab?.targetIp || '10.10.20.15'}
        roomId={room.id}
        roomTitle={room.title}
        initialMessage={`Connected to CyberPath ${room.title} isolated container. Run CLI commands or type 'help' to inspect target ${activeLab?.targetIp || '10.10.20.15'}.`}
      />
    );
  };

  return (
    <div className="flex flex-col h-full w-full select-none font-mono text-xs space-y-4 pb-4">

      {/* ─── TOAST NOTIFICATIONS (Rule 9 & 25) ────────────────────────── */}
      <AnimatePresence>
        {lockedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded border border-[#111111] dark:border-white bg-[#111111] dark:bg-white text-white dark:text-black font-mono text-xs shadow-xl flex items-center gap-2 font-bold"
          >
            <Lock size={13} />
            <span>{lockedToast}</span>
          </motion.div>
        )}

        {successBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded border border-emerald-600 bg-white dark:bg-[#121212] text-[#111111] dark:text-white font-mono text-xs shadow-2xl flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <CheckCircle size={13} />
            </div>
            <div>
              <p className="font-extrabold uppercase font-heading">{successBanner.title}</p>
              <p className="text-[11px] text-[#666666] dark:text-[#999999] font-sans">{successBanner.subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 1. TOP BREADCRUMB & LAB CONTROLS BAR ────────────────────────── */}
      <div className="p-3.5 sm:p-4 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm shrink-0">

        {/* Left: Lab Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#111111] dark:text-white font-heading uppercase leading-none">
              {room.title}
            </h1>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white uppercase">
              {room.difficulty}
            </span>
          </div>
        </div>

        {/* Right: Grouped Lab Controls (Rule 15, 22, 23) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Target IP Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[10px] font-mono">
            <span className={`w-2 h-2 rounded-full ${isLabActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-[#888888] dark:text-[#777777]">TARGET:</span>
            <span className="font-bold text-[#111111] dark:text-white">{activeLab?.targetIp || '10.10.20.15'}</span>
          </div>

          {/* Session Timer Badge */}
          {activeLab && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[10px] font-mono">
              <span className="text-[#888888] dark:text-[#777777]">TIME:</span>
              <span className="font-bold text-[#111111] dark:text-white">{formatTimer(activeLab.timeRemainingSeconds)}</span>
            </div>
          )}

          {/* Lab Lifecycle Action Buttons */}
          {isLabActive ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={resetLab}
                title="Reset Target State"
                className="btn-cyber-secondary text-xs py-1 px-2.5 flex items-center gap-1"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">RESET</span>
              </button>
              <button
                type="button"
                onClick={stopLab}
                title="Terminate Lab Session"
                className="btn-cyber-danger text-xs py-1 px-2.5 flex items-center gap-1"
              >
                <Square size={12} />
                <span>STOP LAB</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => startLab(room.id)}
              className="btn-cyber-primary text-xs py-1.5 px-3.5 flex items-center gap-1"
            >
              <Play size={12} />
              <span>START LAB</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. MAIN LAB WORKSPACE LAYOUT ────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">

        {/* Left Column: SEQUENTIAL TASK LIST (Rule 3, 4, 5, 14, 16, 34) */}
        <div className="lg:col-span-4 xl:col-span-3 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#101010] p-3 flex flex-col justify-between overflow-y-auto space-y-3">

          <div className="space-y-3">
            {/* Progress Header */}
            <div className="space-y-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase">
                <span>LAB PROGRESSION</span>
                <span>{completedStepsCount}/{totalSteps} DONE ({progressPct}%)</span>
              </div>
              <ProgressBar value={progressPct} size="sm" />
            </div>

            {/* Task Progression Stack (Vertical Timeline) */}
            <div className="relative pl-1 space-y-2">

              {/* 01. INTRODUCTION */}
              {(() => {
                const isCurrent = activeTab === 'intro';
                return (
                  <div className="relative">
                    <div className={cn(
                      "absolute left-[15px] top-[32px] bottom-[-12px] w-[2px] z-0",
                      isIntroCompleted ? "bg-[#111111] dark:bg-white" : "bg-[#E5E5E5] dark:bg-[#2A2A2A]"
                    )} />
                    <button
                      type="button"
                      onClick={() => setActiveTab('intro')}
                      className={`relative z-10 w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-2.5 cursor-pointer font-mono ${isCurrent
                          ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white shadow-xs'
                          : isIntroCompleted
                            ? 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white'
                            : 'bg-white text-[#111111] border-[#111111] dark:bg-[#141414] dark:text-white dark:border-white font-bold'
                        }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold">01.</span>
                          <span className="truncate uppercase font-heading text-[11px]">INTRODUCTION</span>
                        </div>
                        <span className={`text-[9px] uppercase tracking-wider block ${isCurrent
                            ? 'text-white/70 dark:text-black/70'
                            : isIntroCompleted
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'text-[#888888] dark:text-[#777777]'
                          }`}>
                          {isIntroCompleted ? '✓ COMPLETED' : isCurrent ? '● CURRENT' : '○ AVAILABLE'}
                        </span>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {isIntroCompleted ? (
                          <CheckCircle size={14} className={isCurrent ? 'text-white dark:text-black' : 'text-emerald-600 dark:text-emerald-400'} />
                        ) : (
                          <Info size={14} className={isCurrent ? 'text-white dark:text-black' : 'text-[#888888]'} />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })()}

              {/* 02..0N SEQUENTIAL ROOM TASKS */}
              {roomTasks.map((task, index) => {
                const isDone = completedTasks.has(task.id);
                const isUnlocked = isTaskIndexUnlocked(index);
                const isCurrent = activeTab === 'task' && selectedTaskIndex === index;
                const isJustUnlocked = justUnlockedId === task.id;
                const prevTaskTitle = index === 0 ? 'Task 01' : `Task 0${index + 1}`;
                const isLastStep = index === roomTasks.length - 1;

                return (
                  <div key={task.id} className="relative">
                    {!isLastStep && (
                      <div className={cn(
                        "absolute left-[15px] top-[32px] bottom-[-12px] w-[2px] z-0",
                        isDone ? "bg-[#111111] dark:bg-white" : "bg-[#E5E5E5] dark:bg-[#2A2A2A]"
                      )} />
                    )}
                    <button
                      type="button"
                      disabled={!isUnlocked}
                      aria-disabled={!isUnlocked}
                      onClick={() => {
                        if (isUnlocked) {
                          setActiveTab('task');
                          setSelectedTaskIndex(index);
                        } else {
                          triggerLockedNotice(prevTaskTitle);
                        }
                      }}
                      className={`relative z-10 w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-2.5 font-mono ${isCurrent
                          ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white shadow-xs cursor-pointer'
                          : isDone
                            ? 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white cursor-pointer'
                            : isUnlocked
                              ? 'bg-white text-[#111111] border-[#111111] dark:bg-[#141414] dark:text-white dark:border-white hover:bg-[#FAFAFA] dark:hover:bg-[#181818] cursor-pointer'
                              : 'bg-[#FAFAFA] dark:bg-[#0D0D0D] text-[#888888] dark:text-[#555555] border-[#E5E5E5] dark:border-[#202020] cursor-not-allowed opacity-75'
                        } ${isJustUnlocked ? 'ring-2 ring-emerald-500 animate-pulse' : ''}`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold">
                            0{index + 2}.
                          </span>
                          <span className="truncate uppercase font-heading text-[11px]">
                            {task.title}
                          </span>
                        </div>

                        <span className={`text-[9px] uppercase tracking-wider block ${isCurrent
                            ? 'text-white/80 dark:text-[#080808]/80 font-bold'
                            : isDone
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : isUnlocked
                                ? 'text-[#111111] dark:text-white font-bold'
                                : 'text-[#888888] dark:text-[#666666]'
                          }`}>
                          {isDone
                            ? '✓ COMPLETED'
                            : isCurrent
                              ? '● CURRENT TASK'
                              : isUnlocked
                                ? '→ AVAILABLE'
                                : `🔒 COMPLETE ${prevTaskTitle.toUpperCase()}`}
                        </span>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {isDone ? (
                          <CheckCircle size={14} className={isCurrent ? 'text-white dark:text-black' : 'text-emerald-600 dark:text-emerald-400'} />
                        ) : isUnlocked ? (
                          <span className={`text-[10px] font-bold ${isCurrent ? 'text-white dark:text-black' : 'text-[#111111] dark:text-white'}`}>
                            {isCurrent ? '●' : '○'}
                          </span>
                        ) : (
                          <Lock size={13} className="text-[#888888] dark:text-[#555555]" />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* FINAL CERTIFICATION EXAM */}
              {(() => {
                const isCurrent = activeTab === 'quiz';
                const isJustUnlocked = justUnlockedId === 'quiz';

                return (
                  <div className="relative">
                    <button
                      type="button"
                      disabled={!isQuizUnlocked && !isExamDone}
                      aria-disabled={!isQuizUnlocked && !isExamDone}
                      onClick={() => {
                        if (isQuizUnlocked || isExamDone) {
                          setActiveTab('quiz');
                        } else {
                          triggerLockedNotice(`Task 0${roomTasks.length + 1}`);
                        }
                      }}
                      className={`relative z-10 w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-2.5 font-mono ${isCurrent
                          ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white shadow-xs cursor-pointer'
                          : isExamDone
                            ? 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white cursor-pointer'
                            : isQuizUnlocked
                              ? 'bg-white text-[#111111] border-[#111111] dark:bg-[#141414] dark:text-white dark:border-white cursor-pointer'
                              : 'bg-[#FAFAFA] dark:bg-[#0D0D0D] text-[#888888] dark:text-[#555555] border-[#E5E5E5] dark:border-[#202020] cursor-not-allowed opacity-75'
                        } ${isJustUnlocked ? 'ring-2 ring-emerald-500 animate-pulse' : ''}`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold">0{totalSteps}.</span>
                          <span className="truncate uppercase font-heading text-[11px]">CERTIFICATION EXAM</span>
                        </div>
                        <span className={`text-[9px] uppercase tracking-wider block ${isCurrent
                            ? 'text-white/70 dark:text-black/70'
                            : isExamDone
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : isQuizUnlocked
                                ? 'text-[#111111] dark:text-white font-bold'
                                : 'text-[#888888] dark:text-[#666666]'
                          }`}>
                          {isExamDone ? '✓ VERIFIED' : isCurrent ? '● IN PROGRESS' : isQuizUnlocked ? '→ UNLOCKED' : '🔒 LOCKED'}
                        </span>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {isExamDone ? (
                          <Award size={14} className={isCurrent ? 'text-white dark:text-black' : 'text-emerald-600 dark:text-emerald-400'} />
                        ) : isQuizUnlocked ? (
                          <Award size={14} className={isCurrent ? 'text-white dark:text-black' : 'text-[#111111] dark:text-white'} />
                        ) : (
                          <Lock size={13} className="text-[#888888] dark:text-[#555555]" />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* Return link */}
          <Link
            to="/labs"
            className="w-full text-center py-2 text-[11px] text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white font-bold uppercase border-t border-[#E5E5E5] dark:border-[#2A2A2A] pt-3 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={12} />
            <span>BACK TO ALL LABS</span>
          </Link>
        </div>

        {/* Right Column: ACTIVE TASK WORKSPACE (Rule 12, 14, 21, 31) */}
        <div className="lg:col-span-8 xl:col-span-9 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-6 shadow-sm">

          {/* Main Dynamic Content Area */}
          <div className="space-y-6 flex-1">

            {/* ─── TAB 01: INTRODUCTION ─── */}
            {activeTab === 'intro' && (
              <div className="space-y-5">
                <div className="space-y-1.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest">
                      TASK 01 // OVERVIEW & LEARNING OBJECTIVES
                    </span>
                    {isIntroCompleted && (
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                        ✓ COMPLETED
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-extrabold text-[#111111] dark:text-white uppercase font-heading">
                    {room.title}
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                  <p>{room.description}</p>

                  {/* Interactive Technical Demo */}
                  <div className="my-3">
                    <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase font-mono mb-1 block">
                      INTERACTIVE TECHNICAL ARCHITECTURE DEMO:
                    </span>
                    <TechnicalVisual
                      topic={
                        room.category === 'Web Security' ? 'sqli' :
                        room.category === 'Forensics' ? 'soc' :
                        room.category === 'Networking' ? 'nmap' : 'cia'
                      }
                    />
                  </div>

                  <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-2 font-mono text-xs text-[#111111] dark:text-white">
                    <span className="font-bold uppercase tracking-wider block">KEY OBJECTIVES COVERED:</span>
                    <ul className="list-disc pl-5 space-y-1 text-[#555555] dark:text-[#B5B5B5] font-sans text-xs">
                      <li>Understand target architecture and network interface topology.</li>
                      <li>Utilize interactive terminal tools to query ports, services, and vulnerabilities.</li>
                      <li>Analyze findings and submit specific challenge flags to sequentially unlock subsequent tasks.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCompleteIntro}
                    className="btn-cyber-primary text-xs py-2.5 px-6"
                  >
                    <span>{isIntroCompleted ? 'PROCEED TO TASK 02 →' : 'COMPLETE INTRODUCTION & START TASK 02 →'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─── TAB 02..N: SEQUENTIAL TASK WORKSPACE ─── */}
            {activeTab === 'task' && currentTask && (
              <div className="space-y-6">
                {/* Task Header */}
                <div className="space-y-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777]">
                      TASK 0{selectedTaskIndex + 2} OF 0{totalSteps}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 border border-emerald-500/20 rounded">
                      +{currentTask.points} XP
                    </span>
                    {completedTasks.has(currentTask.id) && (
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                        ✓ TASK VERIFIED
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-extrabold text-[#111111] dark:text-white uppercase font-heading">
                    {currentTask.title}
                  </h2>
                </div>

                {/* Instructions */}
                <div className="space-y-3 text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                  <p>{currentTask.description}</p>
                </div>

                {/* Live Target Container / Interactive Terminal Workspace (Rule 14 & 22) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[#888888] dark:text-[#777777] font-bold uppercase">
                    <span className="flex items-center gap-1.5">
                      <TermIcon size={12} className="text-[#111111] dark:text-white" />
                      LIVE TARGET WORKSPACE (TARGET: {activeLab?.targetIp || '10.10.20.15'})
                    </span>
                  </div>
                  <div className="min-h-[220px] rounded border border-[#111111] dark:border-[#333] overflow-hidden">
                    {renderTaskWorkspace()}
                  </div>
                </div>

                {/* Question & Answer Submission Area (Rule 6, 11, 21) */}
                <div className="p-4 sm:p-5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">
                      TASK OBJECTIVE // ANSWER SUBMISSION
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#111111] dark:text-white font-sans">
                      {currentTask.question}
                    </p>
                  </div>

                  {/* Progressive Hint Reveal */}
                  {currentTask.hint && (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleHint(currentTask.id)}
                        className="text-[10px] text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {showHints[currentTask.id] ? <EyeOff size={11} /> : <Eye size={11} />}
                        <span>{showHints[currentTask.id] ? '[ HIDE HINT ]' : '[ VIEW HINT (-10 XP) ]'}</span>
                      </button>
                      {showHints[currentTask.id] && (
                        <div className="mt-2 p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#121212] text-xs text-[#555555] dark:text-[#B5B5B5] font-mono">
                          {currentTask.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submission Form */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder={completedTasks.has(currentTask.id) ? "Task completed (Verified)" : "Enter answer / flag..."}
                      value={answers[currentTask.id] || ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [currentTask.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleTaskSubmit(currentTask, selectedTaskIndex);
                      }}
                      className="flex-1 bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleTaskSubmit(currentTask, selectedTaskIndex)}
                      className="btn-cyber-primary text-xs py-2 px-6 shrink-0"
                    >
                      <span>{completedTasks.has(currentTask.id) ? 'RE-SUBMIT →' : 'SUBMIT ANSWER →'}</span>
                    </button>
                  </div>

                  {/* Feedback Message */}
                  {taskFeedback[currentTask.id] && (
                    <div className={`p-3 rounded border text-xs font-mono font-bold ${taskFeedback[currentTask.id].success
                        ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-rose-600 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                      }`}>
                      {taskFeedback[currentTask.id].msg}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB: FINAL CERTIFICATION & COMPLETION (Rule 20, 31) ─── */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {isExamDone ? (
                  /* ─── PROFESSIONAL LAB COMPLETION SCREEN (Rule 31) ─── */
                  <div className="p-8 rounded-md border border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#141414] text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto shadow-md">
                      <Award size={32} />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">
                        // CLEARANCE CERTIFICATION ACHIEVED
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
                        LAB COMPLETED: {room.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-lg mx-auto leading-relaxed">
                        You have successfully audited the target infrastructure, verified all technical tasks, and passed the final certification exam.
                      </p>
                    </div>

                    {/* Verification Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left font-mono text-xs">
                      <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#181818] space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle size={14} />
                          <span>ALL TASKS DONE</span>
                        </div>
                        <span className="text-[10px] text-[#888888] dark:text-[#777777] block">{roomTasks.length}/{roomTasks.length} Solved</span>
                      </div>

                      <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#181818] space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle size={14} />
                          <span>CERTIFICATION</span>
                        </div>
                        <span className="text-[10px] text-[#888888] dark:text-[#777777] block">Exam Passed</span>
                      </div>

                      <div className="p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#181818] space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <Sparkles size={14} />
                          <span>XP REWARD</span>
                        </div>
                        <span className="text-[10px] text-[#888888] dark:text-[#777777] block">+{room.xp} XP Earned</span>
                      </div>
                    </div>

                    {/* Completion Action Hierarchy */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                      <Link to="/labs">
                        <button className="btn-cyber-primary text-xs py-2.5 px-6">
                          <span>RETURN TO ALL LABS →</span>
                        </button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('task');
                          setSelectedTaskIndex(0);
                        }}
                        className="btn-cyber-secondary text-xs py-2.5 px-5"
                      >
                        <span>REVIEW LAB TASKS</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ─── ACTIVE CERTIFICATION EXAM FORM ─── */
                  <div className="space-y-6">
                    <div className="space-y-1 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
                      <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">
                        FINAL EVALUATION // CERTIFICATION
                      </span>
                      <h2 className="text-xl font-extrabold text-[#111111] dark:text-white uppercase font-heading">
                        {room.title} CERTIFICATION EXAM
                      </h2>
                    </div>

                    <div className="space-y-5 text-xs text-[#111111] dark:text-white">
                      <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-3">
                        <p className="font-bold text-sm">
                          Question 01: What is the primary purpose of reconnaissance in a security evaluation?
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="q1"
                              value="a"
                              onChange={(e) => setQuizSelectedAnswers(prev => ({ ...prev, 0: e.target.value }))}
                            />
                            <span>A) Directly deploying exploit payloads against services</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="q1"
                              value="b"
                              onChange={(e) => setQuizSelectedAnswers(prev => ({ ...prev, 0: e.target.value }))}
                            />
                            <span>B) Gathering active host, port, and service metadata without triggering alerts</span>
                          </label>
                        </div>
                      </div>

                      <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] space-y-3">
                        <p className="font-bold text-sm">
                          Question 02: Which mechanism provides the strongest defense against SQL Injection?
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="q2"
                              value="a"
                              onChange={(e) => setQuizSelectedAnswers(prev => ({ ...prev, 1: e.target.value }))}
                            />
                            <span>A) Parameterized queries and prepared statements</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="q2"
                              value="b"
                              onChange={(e) => setQuizSelectedAnswers(prev => ({ ...prev, 1: e.target.value }))}
                            />
                            <span>B) Client-side HTML input length restrictions</span>
                          </label>
                        </div>
                      </div>

                      {quizFeedback && (
                        <div className={`p-3 rounded border text-xs font-mono font-bold ${quizSubmitted
                            ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'border-rose-600 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                          }`}>
                          {quizFeedback}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleQuizSubmit}
                        className="btn-cyber-primary text-xs py-2.5 px-6"
                      >
                        <span>SUBMIT FINAL EXAM →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ─── 3. BOTTOM STEPPER CONTROLS (Rule 12, 13, 37 - No Dead Ends) ─── */}
          <div className="flex items-center justify-between border-t border-[#E5E5E5] dark:border-[#2A2A2A] pt-4 shrink-0">

            {/* Previous Button (Rule 13) */}
            {activeTab === 'task' && selectedTaskIndex > 0 ? (
              <button
                type="button"
                onClick={() => setSelectedTaskIndex(prev => prev - 1)}
                className="btn-cyber-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <ChevronLeft size={13} />
                <span>PREVIOUS TASK</span>
              </button>
            ) : activeTab === 'task' ? (
              <button
                type="button"
                onClick={() => setActiveTab('intro')}
                className="btn-cyber-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <ChevronLeft size={13} />
                <span>01. INTRODUCTION</span>
              </button>
            ) : activeTab === 'quiz' && !isExamDone ? (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('task');
                  setSelectedTaskIndex(roomTasks.length - 1);
                }}
                className="btn-cyber-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <ChevronLeft size={13} />
                <span>TASK 0{roomTasks.length + 1}</span>
              </button>
            ) : (
              <div />
            )}

            {/* Next Button (Strictly Locked / Guarded by Sequential Rules 1, 6, 12) */}
            {activeTab === 'intro' ? (
              <button
                type="button"
                onClick={handleCompleteIntro}
                className="btn-cyber-primary text-xs py-1.5 px-4 flex items-center gap-1"
              >
                <span>TASK 02 →</span>
                <ChevronRight size={13} />
              </button>
            ) : activeTab === 'task' && selectedTaskIndex < roomTasks.length - 1 ? (
              isTaskIndexUnlocked(selectedTaskIndex + 1) ? (
                <button
                  type="button"
                  onClick={() => setSelectedTaskIndex(prev => prev + 1)}
                  className="btn-cyber-primary text-xs py-1.5 px-4 flex items-center gap-1"
                >
                  <span>NEXT TASK →</span>
                  <ChevronRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerLockedNotice(`Task 0${selectedTaskIndex + 2}`)}
                  className="btn-cyber-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 opacity-60 cursor-not-allowed"
                >
                  <Lock size={11} />
                  <span>COMPLETE CURRENT TASK TO ADVANCE</span>
                </button>
              )
            ) : activeTab === 'task' ? (
              isQuizUnlocked ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="btn-cyber-primary text-xs py-1.5 px-4 flex items-center gap-1"
                >
                  <span>CERTIFICATION EXAM →</span>
                  <ChevronRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerLockedNotice(`Task 0${roomTasks.length + 1}`)}
                  className="btn-cyber-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 opacity-60 cursor-not-allowed"
                >
                  <Lock size={11} />
                  <span>COMPLETE ALL TASKS TO UNLOCK EXAM</span>
                </button>
              )
            ) : (
              <Link
                to="/labs"
                className="btn-cyber-primary text-xs py-1.5 px-4 flex items-center gap-1"
              >
                <span>RETURN TO ALL LABS →</span>
              </Link>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
