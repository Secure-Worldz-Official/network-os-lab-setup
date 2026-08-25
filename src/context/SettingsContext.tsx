import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useCyberPath } from './CyberPathContext';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export interface AccountSettings {
  username: string;
  displayName: string;
  email: string;
  bio: string;
  country: string;
  avatar: string;
  joinedDate: string;
}

export interface AppearanceSettings {
  theme: ThemeMode;
  interfaceDensity: 'compact' | 'normal' | 'comfortable';
  codeLigatures: boolean;
  sidebarCollapsed: boolean;
  breadcrumbs: boolean;
  highContrast: boolean;
}

export interface NotificationSettings {
  dailyReminder: boolean;
  streakReminder: boolean;
  roomCompletion: boolean;
  achievementUnlocked: boolean;
  levelUp: boolean;
  challengeUpdates: boolean;
  newPaths: boolean;
  labExpiration: boolean;
  securityAlerts: boolean;
  emailFrequency: 'immediate' | 'daily' | 'weekly';
}

export interface LearningSettings {
  learningReminders: boolean;
  autoContinue: boolean;
  showTaskHints: boolean;
  confirmHintXp: boolean;
  defaultPath: string;
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  showCompletedTasks: boolean;
  streakProtection: boolean;
}

export interface LabTerminalSettings {
  autoStartLab: boolean;
  labTimerWarnings: boolean;
  autoResetExpired: boolean;
  terminalFontSize: '12px' | '14px' | '16px' | '18px';
  terminalFontFamily: 'JetBrains Mono' | 'Fira Code' | 'Source Code Pro' | 'Courier New' | 'SF Mono';
  terminalLineSpacing: 'compact' | 'normal' | 'comfortable';
  terminalCursor: 'block' | 'line' | 'underline';
  terminalSound: boolean;
  commandHistory: boolean;
  lineWrapping: boolean;
  confirmLabReset: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityLog {
  id: string;
  title: string;
  detail: string;
  ip: string;
  timestamp: string;
}

export interface PrivacySecuritySettings {
  profileVisibility: 'public' | 'private' | 'restricted';
  showOnlineStatus: boolean;
  showActivity: boolean;
  showXp: boolean;
  showAchievements: boolean;
  showLeaderboard: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string;
  twoFactorRecoveryCodes: string[];
  activeSessions: ActiveSession[];
  securityLogs: SecurityLog[];
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largerText: boolean;
  focusIndicators: boolean;
  keyboardNavigation: boolean;
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
}

export interface LanguageRegionSettings {
  language: string;
  timeZone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  clockFormat: '12h' | '24h';
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface SettingsContextValue {
  // Theme
  theme: ThemeMode;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: ThemeMode) => void;

  // Categories Settings
  account: AccountSettings;
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  learning: LearningSettings;
  labTerminal: LabTerminalSettings;
  privacy: PrivacySecuritySettings;
  accessibility: AccessibilitySettings;
  languageRegion: LanguageRegionSettings;

  // Updaters (Live / Draft)
  updateAccount: (data: Partial<AccountSettings>) => void;
  updateAppearance: (data: Partial<AppearanceSettings>) => void;
  updateNotifications: (data: Partial<NotificationSettings>) => void;
  updateLearning: (data: Partial<LearningSettings>) => void;
  updateLabTerminal: (data: Partial<LabTerminalSettings>) => void;
  updatePrivacy: (data: Partial<PrivacySecuritySettings>) => void;
  updateAccessibility: (data: Partial<AccessibilitySettings>) => void;
  updateLanguageRegion: (data: Partial<LanguageRegionSettings>) => void;

  // 2FA Actions
  enable2FA: (code?: string) => { success: boolean; message: string };
  disable2FA: () => void;
  signOutOtherSessions: () => void;

  // Navigation & Category Tab
  activeCategory: string;
  setActiveCategory: (catId: string) => void;

  // Save State Management
  isDirty: boolean;
  saveAll: () => void;
  discardAll: () => void;

  // Toasts
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  hideToast: () => void;

  // Data Actions
  exportUserData: () => void;
  downloadProgressReport: () => void;
  importUserData: (jsonString: string) => { success: boolean; message: string };
  getStorageUsage: () => { usedKb: number; itemsCount: number };
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const DEFAULT_ACCOUNT: AccountSettings = {
  username: 'Cyber Explorer',
  displayName: 'Alex Mercer (SecOps)',
  email: 'alex.mercer@cyberpath.dev',
  bio: 'Penetration tester and network security researcher. Exploring offensive security and defensive blue teaming.',
  country: 'United States (US)',
  avatar: 'shield',
  joinedDate: 'January 14, 2026'
};

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'light',
  interfaceDensity: 'normal',
  codeLigatures: true,
  sidebarCollapsed: false,
  breadcrumbs: true,
  highContrast: false
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  dailyReminder: true,
  streakReminder: true,
  roomCompletion: true,
  achievementUnlocked: true,
  levelUp: true,
  challengeUpdates: false,
  newPaths: true,
  labExpiration: true,
  securityAlerts: true,
  emailFrequency: 'daily'
};

const DEFAULT_LEARNING: LearningSettings = {
  learningReminders: true,
  autoContinue: false,
  showTaskHints: true,
  confirmHintXp: true,
  defaultPath: 'cybersecurity-foundations',
  difficulty: 'all',
  showCompletedTasks: true,
  streakProtection: true
};

const DEFAULT_LAB_TERMINAL: LabTerminalSettings = {
  autoStartLab: false,
  labTimerWarnings: true,
  autoResetExpired: true,
  terminalFontSize: '14px',
  terminalFontFamily: 'JetBrains Mono',
  terminalLineSpacing: 'normal',
  terminalCursor: 'block',
  terminalSound: false,
  commandHistory: true,
  lineWrapping: true,
  confirmLabReset: true
};

const DEFAULT_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-current',
    device: 'Windows Workstation (x64)',
    browser: 'Google Chrome 124.0',
    ip: '192.168.1.45 (Local Subnet)',
    lastActive: 'Active now (Current session)',
    isCurrent: true
  },
  {
    id: 'sess-laptop',
    device: 'MacBook Pro 16 (Apple M3)',
    browser: 'Safari 17.4',
    ip: '10.8.0.24 (CyberPath VPN)',
    lastActive: 'Yesterday at 18:42',
    isCurrent: false
  },
  {
    id: 'sess-linux',
    device: 'Debian Kali Linux 2024.1',
    browser: 'Firefox Developer Edition',
    ip: '10.10.14.2 (Lab VPN Gateway)',
    lastActive: '3 days ago',
    isCurrent: false
  }
];

const DEFAULT_SECURITY_LOGS: SecurityLog[] = [
  {
    id: 'log-1',
    title: 'Successful Authentication',
    detail: 'Logged in from Windows Workstation via Secure Session',
    ip: '192.168.1.45',
    timestamp: 'Today at 21:15'
  },
  {
    id: 'log-2',
    title: 'VPN OpenVPN Key Generated',
    detail: 'Downloaded profile cyberpath_lab.ovpn',
    ip: '10.8.0.24',
    timestamp: 'Yesterday at 18:44'
  },
  {
    id: 'log-3',
    title: 'Password Verified',
    detail: 'Security credentials re-authenticated',
    ip: '192.168.1.45',
    timestamp: '3 days ago'
  }
];

const DEFAULT_PRIVACY: PrivacySecuritySettings = {
  profileVisibility: 'public',
  showOnlineStatus: true,
  showActivity: true,
  showXp: true,
  showAchievements: true,
  showLeaderboard: true,
  twoFactorEnabled: false,
  twoFactorSecret: 'CYBER-PATH-7X89-KL23-99QP',
  twoFactorRecoveryCodes: [
    'CP-8921-4401',
    'CP-3319-9022',
    'CP-7128-4491',
    'CP-5520-1928',
    'CP-6612-8831',
    'CP-9014-2278'
  ],
  activeSessions: DEFAULT_ACTIVE_SESSIONS,
  securityLogs: DEFAULT_SECURITY_LOGS
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  reduceMotion: false,
  highContrast: false,
  largerText: false,
  focusIndicators: true,
  keyboardNavigation: true,
  colorBlindMode: 'none'
};

const DEFAULT_LANGUAGE_REGION: LanguageRegionSettings = {
  language: 'en',
  timeZone: 'auto',
  dateFormat: 'DD/MM/YYYY',
  clockFormat: '24h'
};

function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { username, setUsername: setGlobalUsername, xp, level, levelName, streak, completedRooms, completedChallenges, unlockedBadges, completedDays } = useCyberPath();

  // Active Category in Settings Page
  const [activeCategory, setActiveCategory] = useState<string>('01-account');

  // Theme State
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('cyberpath-theme');
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved as ThemeMode;
    return 'light';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    const saved = localStorage.getItem('cyberpath-theme') as ThemeMode;
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    return getSystemTheme();
  });

  // Settings Data States
  const [account, setAccount] = useState<AccountSettings>(() => {
    const saved = localStorage.getItem('cyberpath-settings-account');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { ...DEFAULT_ACCOUNT, username: username || DEFAULT_ACCOUNT.username };
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    const saved = localStorage.getItem('cyberpath-settings-appearance');
    if (saved) {
      try { return { ...DEFAULT_APPEARANCE, ...JSON.parse(saved), theme }; } catch { /* ignore */ }
    }
    return { ...DEFAULT_APPEARANCE, theme };
  });

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('cyberpath-settings-notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [learning, setLearning] = useState<LearningSettings>(() => {
    const saved = localStorage.getItem('cyberpath-settings-learning');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_LEARNING;
  });

  const [labTerminal, setLabTerminal] = useState<LabTerminalSettings>(() => {
    const saved = localStorage.getItem('cyberpath-settings-lab-terminal');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_LAB_TERMINAL;
  });

  const [privacy, setPrivacy] = useState<PrivacySecuritySettings>(() => {
    const saved = localStorage.getItem('cyberpath-settings-privacy');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_PRIVACY;
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('cyberpath-settings-accessibility');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_ACCESSIBILITY;
  });

  const [languageRegion, setLanguageRegion] = useState<LanguageRegionSettings>(() => {
    const saved = localStorage.getItem('cyberpath-settings-lang-region');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_LANGUAGE_REGION;
  });

  // Track Unsaved Changes
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Toast Notification
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Apply Theme to DOM immediately
  const applyThemeToDOM = useCallback((effTheme: EffectiveTheme) => {
    const root = document.documentElement;
    if (effTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, []);

  // Set Theme Handler
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('cyberpath-theme', newTheme);
    setAppearance((prev) => ({ ...prev, theme: newTheme }));

    let resolved: EffectiveTheme = 'light';
    if (newTheme === 'dark') resolved = 'dark';
    else if (newTheme === 'light') resolved = 'light';
    else resolved = getSystemTheme();

    setEffectiveTheme(resolved);
    applyThemeToDOM(resolved);
    showToast(`THEME SWITCHED TO ${newTheme.toUpperCase()}`);
  }, [applyThemeToDOM, showToast]);

  // Listen to OS scheme changes if in 'system' mode
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const resolved: EffectiveTheme = e.matches ? 'dark' : 'light';
        setEffectiveTheme(resolved);
        applyThemeToDOM(resolved);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme, applyThemeToDOM]);

  // Initial Theme DOM sync
  useEffect(() => {
    applyThemeToDOM(effectiveTheme);
  }, [effectiveTheme, applyThemeToDOM]);

  // Sync Accessibility Modifiers to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (accessibility.reduceMotion) root.setAttribute('data-reduce-motion', 'true');
    else root.removeAttribute('data-reduce-motion');

    if (accessibility.highContrast) root.setAttribute('data-high-contrast', 'true');
    else root.removeAttribute('data-high-contrast');

    if (accessibility.largerText) root.setAttribute('data-larger-text', 'true');
    else root.removeAttribute('data-larger-text');

    if (accessibility.focusIndicators) root.classList.add('enhanced-focus');
    else root.classList.remove('enhanced-focus');
  }, [accessibility]);

  // Sync Username with Global Context if changed
  useEffect(() => {
    if (username && username !== account.username) {
      setAccount((prev) => ({ ...prev, username }));
    }
  }, [username]);

  // Updaters with dirty tracking
  const updateAccount = useCallback((data: Partial<AccountSettings>) => {
    setAccount((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  }, []);

  const updateAppearance = useCallback((data: Partial<AppearanceSettings>) => {
    setAppearance((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  }, []);

  const updateNotifications = useCallback((data: Partial<NotificationSettings>) => {
    setNotifications((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  }, []);

  const updateLearning = useCallback((data: Partial<LearningSettings>) => {
    setLearning((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  }, []);

  const updateLabTerminal = useCallback((data: Partial<LabTerminalSettings>) => {
    setLabTerminal((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  }, []);

  const updatePrivacy = useCallback((data: Partial<PrivacySecuritySettings>) => {
    setPrivacy((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  }, []);

  const updateAccessibility = useCallback((data: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...data }));
    // Accessibility changes apply immediately for instant accessibility
    localStorage.setItem('cyberpath-settings-accessibility', JSON.stringify({ ...accessibility, ...data }));
    showToast('ACCESSIBILITY PREFERENCES APPLIED');
  }, [accessibility, showToast]);

  const updateLanguageRegion = useCallback((data: Partial<LanguageRegionSettings>) => {
    setLanguageRegion((prev) => ({ ...prev, ...data }));
    setIsDirty(true);
  }, []);

  // 2FA Actions
  const enable2FA = useCallback((_code?: string) => {
    setPrivacy((prev) => ({ ...prev, twoFactorEnabled: true }));
    localStorage.setItem('cyberpath-settings-privacy', JSON.stringify({ ...privacy, twoFactorEnabled: true }));
    showToast('TWO-FACTOR AUTHENTICATION ACTIVATED (DEMO MODE)');
    return { success: true, message: '2FA verification confirmed.' };
  }, [privacy, showToast]);

  const disable2FA = useCallback(() => {
    setPrivacy((prev) => ({ ...prev, twoFactorEnabled: false }));
    localStorage.setItem('cyberpath-settings-privacy', JSON.stringify({ ...privacy, twoFactorEnabled: false }));
    showToast('TWO-FACTOR AUTHENTICATION DISABLED', 'info');
  }, [privacy, showToast]);

  const signOutOtherSessions = useCallback(() => {
    setPrivacy((prev) => ({
      ...prev,
      activeSessions: prev.activeSessions.filter((s) => s.isCurrent)
    }));
    showToast('ALL OTHER ACTIVE SESSIONS SIGNED OUT');
  }, [showToast]);

  // Save All Changes
  const saveAll = useCallback(() => {
    if (account.username.trim()) {
      setGlobalUsername(account.username.trim());
    }
    localStorage.setItem('cyberpath-settings-account', JSON.stringify(account));
    localStorage.setItem('cyberpath-settings-appearance', JSON.stringify(appearance));
    localStorage.setItem('cyberpath-settings-notifications', JSON.stringify(notifications));
    localStorage.setItem('cyberpath-settings-learning', JSON.stringify(learning));
    localStorage.setItem('cyberpath-settings-lab-terminal', JSON.stringify(labTerminal));
    localStorage.setItem('cyberpath-settings-privacy', JSON.stringify(privacy));
    localStorage.setItem('cyberpath-settings-accessibility', JSON.stringify(accessibility));
    localStorage.setItem('cyberpath-settings-lang-region', JSON.stringify(languageRegion));

    setIsDirty(false);
    showToast('✓ ALL SETTINGS SAVED TO LOCAL PROFILE');
  }, [account, appearance, notifications, learning, labTerminal, privacy, accessibility, languageRegion, setGlobalUsername, showToast]);

  // Discard Changes
  const discardAll = useCallback(() => {
    const savedAcc = localStorage.getItem('cyberpath-settings-account');
    if (savedAcc) setAccount(JSON.parse(savedAcc));
    else setAccount(DEFAULT_ACCOUNT);

    const savedNotif = localStorage.getItem('cyberpath-settings-notifications');
    if (savedNotif) setNotifications(JSON.parse(savedNotif));
    else setNotifications(DEFAULT_NOTIFICATIONS);

    const savedLearn = localStorage.getItem('cyberpath-settings-learning');
    if (savedLearn) setLearning(JSON.parse(savedLearn));
    else setLearning(DEFAULT_LEARNING);

    const savedLab = localStorage.getItem('cyberpath-settings-lab-terminal');
    if (savedLab) setLabTerminal(JSON.parse(savedLab));
    else setLabTerminal(DEFAULT_LAB_TERMINAL);

    const savedPriv = localStorage.getItem('cyberpath-settings-privacy');
    if (savedPriv) setPrivacy(JSON.parse(savedPriv));
    else setPrivacy(DEFAULT_PRIVACY);

    const savedLang = localStorage.getItem('cyberpath-settings-lang-region');
    if (savedLang) setLanguageRegion(JSON.parse(savedLang));
    else setLanguageRegion(DEFAULT_LANGUAGE_REGION);

    setIsDirty(false);
    showToast('UNSAVED CHANGES DISCARDED', 'info');
  }, [showToast]);

  // Data Export & Storage Actions
  const exportUserData = useCallback(() => {
    const payload = {
      exportDate: new Date().toISOString(),
      platform: 'CyberPath Security Training Platform',
      version: '1.0.0',
      user: {
        username: account.username,
        displayName: account.displayName,
        email: account.email,
        bio: account.bio,
        country: account.country,
        joinedDate: account.joinedDate,
        xp,
        level,
        levelName,
        streak,
        completedRooms,
        completedChallenges,
        unlockedBadges,
        completedDaysCount: completedDays.size
      },
      settings: {
        theme,
        appearance,
        notifications,
        learning,
        labTerminal,
        privacy: { ...privacy, twoFactorRecoveryCodes: ['[REDACTED_FOR_EXPORT]'] },
        accessibility,
        languageRegion
      }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpath_backup_${account.username.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('USER DATA EXPORTED AS JSON');
  }, [account, xp, level, levelName, streak, completedRooms, completedChallenges, unlockedBadges, completedDays, theme, appearance, notifications, learning, labTerminal, privacy, accessibility, languageRegion, showToast]);

  const downloadProgressReport = useCallback(() => {
    const lines = [
      '=========================================================================',
      '                      CYBERPATH SECURITY TRAINING REPORT                 ',
      '=========================================================================',
      `Generated: ${new Date().toUTCString()}`,
      `Platform: CyberPath Security Training Environment v1.0.0`,
      '-------------------------------------------------------------------------',
      `Operative: ${account.username.toUpperCase()}`,
      `Display Name: ${account.displayName}`,
      `Rank & Title: ${levelName.toUpperCase()} (Level ${level})`,
      `Total XP: ${xp.toLocaleString()} XP`,
      `Active Streak: ${streak} Days`,
      '-------------------------------------------------------------------------',
      'PRACTICAL TRAINING MILESTONES:',
      `- Completed Practical Rooms: ${completedRooms.length} rooms solved`,
      `- Completed Security Challenges: ${completedChallenges.length} challenges solved`,
      `- Unlocked Clearance Badges: ${unlockedBadges.length} badges earned`,
      `- Curriculum Modules Mastered: ${completedDays.size} modules`,
      '-------------------------------------------------------------------------',
      'SECURITY DIRECTIVES:',
      'Learn. Practice. Solve. Secure.',
      '========================================================================='
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpath_progress_report_${account.username.toLowerCase().replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('PROGRESS REPORT DOWNLOADED');
  }, [account, levelName, level, xp, streak, completedRooms, completedChallenges, unlockedBadges, completedDays, showToast]);

  const importUserData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !data.user) {
        return { success: false, message: 'Invalid CyberPath backup structure.' };
      }
      if (data.user.username) setAccount((prev) => ({ ...prev, ...data.user }));
      if (data.settings?.appearance) setAppearance(data.settings.appearance);
      if (data.settings?.notifications) setNotifications(data.settings.notifications);
      if (data.settings?.learning) setLearning(data.settings.learning);
      if (data.settings?.labTerminal) setLabTerminal(data.settings.labTerminal);
      if (data.settings?.languageRegion) setLanguageRegion(data.settings.languageRegion);
      showToast('BACKUP DATA IMPORTED SUCCESSFULLY');
      return { success: true, message: 'Data restored successfully.' };
    } catch {
      return { success: false, message: 'JSON parsing error.' };
    }
  }, [showToast]);

  const getStorageUsage = useCallback(() => {
    let total = 0;
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cyber')) {
        const val = localStorage.getItem(key) || '';
        total += (key.length + val.length) * 2;
        count++;
      }
    }
    return {
      usedKb: Math.max(1, Math.round(total / 1024)),
      itemsCount: count
    };
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        theme,
        effectiveTheme,
        setTheme,
        account,
        appearance,
        notifications,
        learning,
        labTerminal,
        privacy,
        accessibility,
        languageRegion,
        updateAccount,
        updateAppearance,
        updateNotifications,
        updateLearning,
        updateLabTerminal,
        updatePrivacy,
        updateAccessibility,
        updateLanguageRegion,
        enable2FA,
        disable2FA,
        signOutOtherSessions,
        activeCategory,
        setActiveCategory,
        isDirty,
        saveAll,
        discardAll,
        toast,
        showToast,
        hideToast,
        exportUserData,
        downloadProgressReport,
        importUserData,
        getStorageUsage
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
