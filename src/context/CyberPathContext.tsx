import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { 
  rooms, 
  challenges, 
  defaultLeaderboard, 
  dailyMissions,
  type LeaderboardEntry
} from '@/data/cyberpathData';
import { MOCK_TARGET_MACHINES, VPNProvider, TaskValidator, type TargetMachine } from '@/lib/labServices';
import { parseProgress, formatDayId } from '@/lib/utils';
import { curriculumRoadmap } from '@/data/curriculum';

export interface Activity {
  id: string;
  text: string;
  type: 'room_completed' | 'challenge_solved' | 'badge_unlocked' | 'day_completed' | 'quiz_completed' | 'daily_mission';
  timestamp: string;
}

export interface ActiveLabState {
  roomId: string;
  roomTitle: string;
  taskId: string;
  status: 'INITIALIZING' | 'RUNNING' | 'PAUSED' | 'EXPIRED';
  targetIp: string;
  targetMachine: TargetMachine;
  timeRemainingSeconds: number;
  vpnConnected: boolean;
}

interface CyberPathContextValue {
  // User Stats
  username: string;
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  streakDays: Record<string, boolean>;
  completedDays: Set<string>;
  completedRooms: string[];
  completedChallenges: string[];
  completedTasks: Set<string>;
  unlockedBadges: string[];
  recentActivity: Activity[];
  dailyMissionCompleted: boolean;
  dailyMissionIndex: number;
  skills: {
    networking: number;
    linux: number;
    webSecurity: number;
    python: number;
  };
  
  // Active Lab Lifecycle
  activeLab: ActiveLabState | null;
  startLab: (roomId: string, taskId?: string) => void;
  stopLab: () => void;
  resetLab: () => void;
  togglePauseLab: () => void;
  
  // VPN Status
  vpnStatus: { connected: boolean; network: string; ip: string };
  toggleVpn: () => void;
  downloadVpnConfig: () => void;

  // Actions
  setUsername: (name: string) => void;
  addXp: (amount: number, reason: string, activityType: Activity['type']) => void;
  deductXp: (amount: number, reason: string) => void;
  completeDay: (moduleId: string, dayId: number) => void;
  toggleDay: (moduleId: string, dayId: number) => void;
  isDayCompleted: (moduleId: string, dayId: number) => boolean;
  completeRoom: (roomId: string) => void;
  isRoomCompleted: (roomId: string) => boolean;
  completeChallenge: (challengeId: string, answerAttempt: string) => { success: boolean; message: string };
  isChallengeCompleted: (challengeId: string) => boolean;
  completeTask: (taskId: string) => void;
  isTaskCompleted: (taskId: string) => boolean;
  submitTaskAnswer: (roomId: string, taskId: string, answerAttempt: string, expectedAnswer: string) => { success: boolean; message: string };
  completeDailyMission: (answerAttempt: string) => { success: boolean; message: string };
  resetAllProgress: () => void;
  
  // Quiz
  completedQuizzes: string[];
  completeQuiz: (quizId: string, xpReward: number) => void;
  isQuizCompleted: (quizId: string) => boolean;

  // Leaderboard
  getLeaderboard: () => LeaderboardEntry[];

  // Legacy Task API Compatibility
  totalCompletedTasks: number;
  totalTasksCount: number;
  getLabProgress: (labId: string) => { completed: number; total: number };
  showCelebration: boolean;
  currentCelebrationTask: any;
  dismissCelebration: () => void;
  verifyAndComplete: (labId: string, output: string, error?: string, timing?: number | null) => void;
}

const CyberPathContext = createContext<CyberPathContextValue | null>(null);

const LEVEL_NAMES = [
  'Script Kiddie',       // Lvl 1: 0-999
  'Cyber Rookie',        // Lvl 2: 1000-1999
  'Security Explorer',   // Lvl 3: 2000-2999
  'Network Hunter',      // Lvl 4: 3000-3999
  'Web Defender',        // Lvl 5: 4000-4999
  'Penetration Tester',  // Lvl 6: 5000-5999
  'Security Analyst',    // Lvl 7: 6000-6999
  'Cyber Specialist',    // Lvl 8: 7000-7999
  'Security Expert',     // Lvl 9: 8000-8999
  'Cyber Guardian'       // Lvl 10+: 9000+
];

export function CyberPathProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string>(() => {
    return localStorage.getItem('cyberpath-username') || 'Cyber Explorer';
  });
  const [xp, setXp] = useState<number>(() => {
    return parseInt(localStorage.getItem('cyberpath-xp') || '0', 10);
  });
  const [streak, setStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem('cyberpath-streak') || '1', 10);
  });
  const [streakDays] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('cyberpath-streak-days');
    return saved ? JSON.parse(saved) : { Mon: true, Tue: true, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false };
  });
  const [completedDays, setCompletedDays] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('cyber-roadmap-progress');
    return parseProgress(saved);
  });
  const [completedRooms, setCompletedRooms] = useState<string[]>(() => {
    const saved = localStorage.getItem('cyberpath-completed-rooms');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('cyberpath-completed-challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('cyberpath-completed-tasks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('cyberpath-badges');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(() => {
    const saved = localStorage.getItem('cyberpath-completed-quizzes');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('cyberpath-activity');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'act-init', text: 'Started your CyberPath security training', type: 'day_completed', timestamp: new Date().toISOString() }
    ];
  });
  const [dailyMissionCompleted, setDailyMissionCompleted] = useState<boolean>(() => {
    const savedDate = localStorage.getItem('cyberpath-daily-mission-date');
    const today = new Date().toISOString().split('T')[0];
    return savedDate === today;
  });

  const [activeLab, setActiveLab] = useState<ActiveLabState | null>(null);
  const [vpnStatus, setVpnStatus] = useState(() => VPNProvider.getStatus());

  const dailyMissionIndex = new Date().getDate() % dailyMissions.length;

  useEffect(() => { localStorage.setItem('cyberpath-username', username); }, [username]);
  useEffect(() => { localStorage.setItem('cyberpath-xp', xp.toString()); }, [xp]);
  useEffect(() => { localStorage.setItem('cyberpath-streak', streak.toString()); }, [streak]);
  useEffect(() => { localStorage.setItem('cyber-roadmap-progress', JSON.stringify([...completedDays])); }, [completedDays]);
  useEffect(() => { localStorage.setItem('cyberpath-completed-rooms', JSON.stringify(completedRooms)); }, [completedRooms]);
  useEffect(() => { localStorage.setItem('cyberpath-completed-challenges', JSON.stringify(completedChallenges)); }, [completedChallenges]);
  useEffect(() => { localStorage.setItem('cyberpath-completed-tasks', JSON.stringify([...completedTasks])); }, [completedTasks]);

  useEffect(() => {
    if (!activeLab || activeLab.status !== 'RUNNING') return;
    const interval = setInterval(() => {
      setActiveLab((prev) => {
        if (!prev || prev.status !== 'RUNNING') return prev;
        if (prev.timeRemainingSeconds <= 1) {
          return { ...prev, status: 'EXPIRED', timeRemainingSeconds: 0 };
        }
        return { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeLab?.status]);

  const level = Math.min(10, Math.floor(xp / 1000) + 1);
  const levelName = LEVEL_NAMES[level - 1] || LEVEL_NAMES[0];

  const skills = React.useMemo(() => {
    const totalTasks = 20;
    const doneTasks = completedTasks.size;
    const pct = Math.min(100, Math.round((doneTasks / totalTasks) * 100));
    return {
      networking: Math.min(100, pct + 20),
      linux: Math.min(100, pct + 15),
      webSecurity: Math.min(100, pct + 10),
      python: Math.min(100, pct + 5)
    };
  }, [completedTasks]);

  const setUsername = useCallback((name: string) => {
    if (name.trim()) setUsernameState(name.trim());
  }, []);

  const logActivity = useCallback((text: string, type: Activity['type']) => {
    setRecentActivity((prev) => [
      { id: `act-${Date.now()}`, text, type, timestamp: new Date().toISOString() },
      ...prev
    ].slice(0, 15));
  }, []);

  const addXp = useCallback((amount: number, reason: string, activityType: Activity['type']) => {
    setXp((prev) => prev + amount);
    logActivity(`${reason} (+${amount} XP)`, activityType);
  }, [logActivity]);

  const deductXp = useCallback((amount: number, reason: string) => {
    setXp((prev) => Math.max(0, prev - amount));
    logActivity(`${reason} (-${amount} XP)`, 'day_completed');
  }, [logActivity]);

  const startLab = useCallback((roomId: string, taskId: string = 'task-1') => {
    const room = rooms.find(r => r.id === roomId);
    const mockMachine = MOCK_TARGET_MACHINES[roomId] || MOCK_TARGET_MACHINES['default'];

    setActiveLab({
      roomId,
      roomTitle: room ? room.title : roomId,
      taskId,
      status: 'INITIALIZING',
      targetIp: mockMachine.ip,
      targetMachine: { ...mockMachine, status: 'RUNNING' },
      timeRemainingSeconds: 3600,
      vpnConnected: true
    });

    setTimeout(() => {
      setActiveLab((prev) => (prev ? { ...prev, status: 'RUNNING' } : null));
      logActivity(`Initialized virtual lab for ${room ? room.title : roomId}`, 'day_completed');
    }, 1200);
  }, [logActivity]);

  const stopLab = useCallback(() => {
    setActiveLab(null);
    logActivity('Stopped virtual lab session', 'day_completed');
  }, [logActivity]);

  const resetLab = useCallback(() => {
    if (!activeLab) return;
    setActiveLab({
      ...activeLab,
      status: 'INITIALIZING',
      timeRemainingSeconds: 3600
    });
    setTimeout(() => {
      setActiveLab((prev) => (prev ? { ...prev, status: 'RUNNING' } : null));
      logActivity('Reset target machine state', 'day_completed');
    }, 1000);
  }, [activeLab, logActivity]);

  const togglePauseLab = useCallback(() => {
    setActiveLab((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: prev.status === 'RUNNING' ? 'PAUSED' : 'RUNNING'
      };
    });
  }, []);

  const toggleVpn = useCallback(() => {
    const connected = VPNProvider.toggleConnection();
    setVpnStatus(VPNProvider.getStatus());
    logActivity(`VPN connection ${connected ? 'established' : 'disconnected'}`, 'day_completed');
  }, [logActivity]);

  const downloadVpnConfig = useCallback(() => {
    const configStr = VPNProvider.generateConfigFile(username);
    const blob = new Blob([configStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpath_${username}_lab.ovpn`;
    a.click();
    URL.revokeObjectURL(url);
    logActivity('Downloaded VPN configuration file', 'day_completed');
  }, [username, logActivity]);

  const completeTask = useCallback((taskId: string) => {
    setCompletedTasks((prev) => {
      if (prev.has(taskId)) return prev;
      const next = new Set(prev);
      next.add(taskId);
      addXp(50, `Completed Task ${taskId}`, 'day_completed');
      return next;
    });
  }, [addXp]);

  const completeRoom = useCallback((roomId: string) => {
    setCompletedRooms((prev) => {
      if (prev.includes(roomId)) return prev;
      const room = rooms.find(r => r.id === roomId);
      const reward = room ? room.xp : 250;
      setTimeout(() => {
        addXp(reward, `Completed Room: ${room ? room.title : roomId}`, 'room_completed');
      }, 100);
      return [...prev, roomId];
    });
  }, [addXp]);

  const submitTaskAnswer = useCallback((roomId: string, taskId: string, answerAttempt: string, expectedAnswer: string) => {
    const res = TaskValidator.validate(answerAttempt, expectedAnswer);
    if (res.success) {
      completeTask(taskId);
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        const remainingTasks = room.tasks.filter(t => t.id !== taskId && !completedTasks.has(t.id));
        if (remainingTasks.length === 0) completeRoom(roomId);
      }
    }
    return res;
  }, [completeTask, completedTasks, completeRoom]);

  const isTaskCompleted = useCallback((taskId: string) => completedTasks.has(taskId), [completedTasks]);
  const isRoomCompleted = useCallback((roomId: string) => completedRooms.includes(roomId), [completedRooms]);

  const completeDay = useCallback((moduleId: string, dayId: number) => {
    const key = `${moduleId}:${dayId}`;
    setCompletedDays((prev) => new Set(prev).add(key));
  }, []);

  const toggleDay = useCallback((moduleId: string, dayId: number) => {
    const key = `${moduleId}:${dayId}`;
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const isDayCompleted = useCallback((moduleId: string, dayId: number) => {
    return completedDays.has(`${moduleId}:${dayId}`);
  }, [completedDays]);

  const completeChallenge = useCallback((challengeId: string, answerAttempt: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return { success: false, message: 'Challenge not found' };
    if (completedChallenges.includes(challengeId)) return { success: true, message: 'Already completed' };

    if (answerAttempt.trim().toLowerCase() === challenge.answer.trim().toLowerCase()) {
      setCompletedChallenges((prev) => [...prev, challengeId]);
      addXp(challenge.xp, `Solved Challenge: ${challenge.title}`, 'challenge_solved');
      return { success: true, message: 'Correct answer! XP awarded.' };
    }
    return { success: false, message: 'Incorrect answer. Try again!' };
  }, [completedChallenges, addXp]);

  const isChallengeCompleted = useCallback((challengeId: string) => completedChallenges.includes(challengeId), [completedChallenges]);

  const completeDailyMission = useCallback((answerAttempt: string) => {
    if (dailyMissionCompleted) return { success: true, message: 'Already completed today\'s mission.' };
    const mission = dailyMissions[dailyMissionIndex];
    if (answerAttempt.trim().toLowerCase() === mission.answer.trim().toLowerCase()) {
      setDailyMissionCompleted(true);
      localStorage.setItem('cyberpath-daily-mission-date', new Date().toISOString().split('T')[0]);
      addXp(mission.xp, 'Solved Daily Mission', 'daily_mission');
      return { success: true, message: `Correct! ${mission.explanation}` };
    }
    return { success: false, message: 'Incorrect answer.' };
  }, [dailyMissionCompleted, dailyMissionIndex, addXp]);

  const completeQuiz = useCallback((quizId: string, xpReward: number) => {
    setCompletedQuizzes((prev) => {
      if (prev.includes(quizId)) return prev;
      addXp(xpReward, `Completed Certification for ${quizId}`, 'quiz_completed');
      return [...prev, quizId];
    });
  }, [addXp]);

  const isQuizCompleted = useCallback((quizId: string) => completedQuizzes.includes(quizId), [completedQuizzes]);

  const getLeaderboard = useCallback(() => {
    const entries = defaultLeaderboard.map((e) => ({ ...e }));
    const userEntry = {
      rank: 1,
      username,
      level,
      xp,
      roomsCompleted: completedRooms.length,
      badgesCount: unlockedBadges.length,
      isCurrentUser: true
    };
    entries.push(userEntry);
    entries.sort((a, b) => b.xp - a.xp);
    return entries.map((e, index) => ({ ...e, rank: index + 1 }));
  }, [username, level, xp, completedRooms, unlockedBadges]);

  const resetAllProgress = useCallback(() => {
    localStorage.clear();
    setUsernameState('Cyber Explorer');
    setXp(0);
    setStreak(1);
    setCompletedDays(new Set());
    setCompletedRooms([]);
    setCompletedChallenges([]);
    setCompletedTasks(new Set());
    setUnlockedBadges([]);
    setCompletedQuizzes([]);
    setActiveLab(null);
  }, []);

  // Legacy Task API stubs
  const getLabProgress = useCallback((_labId: string) => {
    return { completed: completedTasks.size, total: 10 };
  }, [completedTasks]);

  const verifyAndComplete = useCallback((_labId: string, _output: string) => {
    completeTask('task-1');
  }, [completeTask]);

  return (
    <CyberPathContext.Provider
      value={{
        username,
        xp,
        level,
        levelName,
        streak,
        streakDays,
        completedDays,
        completedRooms,
        completedChallenges,
        completedTasks,
        unlockedBadges,
        recentActivity,
        dailyMissionCompleted,
        dailyMissionIndex,
        skills,
        activeLab,
        startLab,
        stopLab,
        resetLab,
        togglePauseLab,
        vpnStatus,
        toggleVpn,
        downloadVpnConfig,
        setUsername,
        addXp,
        deductXp,
        completeDay,
        toggleDay,
        isDayCompleted,
        completeRoom,
        isRoomCompleted,
        completeChallenge,
        isChallengeCompleted,
        completeTask,
        isTaskCompleted,
        submitTaskAnswer,
        completeDailyMission,
        resetAllProgress,
        completedQuizzes,
        completeQuiz,
        isQuizCompleted,
        getLeaderboard,
        totalCompletedTasks: completedTasks.size,
        totalTasksCount: 20,
        getLabProgress,
        showCelebration: false,
        currentCelebrationTask: null,
        dismissCelebration: () => {},
        verifyAndComplete
      }}
    >
      {children}
    </CyberPathContext.Provider>
  );
}

export function useCyberPath() {
  const ctx = useContext(CyberPathContext);
  if (!ctx) throw new Error('useCyberPath must be used within CyberPathProvider');
  return ctx;
}

export function useProgress() {
  const { completedDays, toggleDay, isDayCompleted } = useCyberPath();
  
  const moduleProgress = useCallback((moduleId: string) => {
    const module = curriculumRoadmap.find((m) => m.id === moduleId);
    if (!module || module.days.length === 0) return { done: 0, total: 0 };
    const done = module.days.filter((d) => completedDays.has(formatDayId(moduleId, d.id))).length;
    return { done, total: module.days.length };
  }, [completedDays]);

  const overallProgress = useCallback(() => {
    const allDays = curriculumRoadmap.flatMap((m) => m.days.map((d) => formatDayId(m.id, d.id)));
    const done = allDays.filter((id) => completedDays.has(id)).length;
    return { done, total: allDays.length };
  }, [completedDays]);

  return {
    completed: completedDays,
    toggle: toggleDay,
    isComplete: isDayCompleted,
    moduleProgress,
    overallProgress,
    completedCount: completedDays.size
  };
}

export function useTask() {
  const { 
    completedTasks, 
    totalCompletedTasks, 
    totalTasksCount, 
    completeTask, 
    isTaskCompleted, 
    getLabProgress, 
    showCelebration, 
    currentCelebrationTask, 
    dismissCelebration, 
    verifyAndComplete 
  } = useCyberPath();

  return {
    completedTasks,
    totalCompleted: totalCompletedTasks,
    totalTasks: totalTasksCount,
    completeTask,
    isTaskCompleted,
    getLabProgress,
    showCelebration,
    currentCelebrationTask,
    dismissCelebration,
    verifyAndComplete
  };
}
