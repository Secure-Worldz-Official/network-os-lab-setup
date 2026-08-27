import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { DayPage } from '@/pages/DayPage';
import { ExperimentLabPage } from '@/pages/ExperimentLabPage';
import { ExperimentToolPage } from '@/pages/ExperimentToolPage';
import { TaskProvider } from '@/components/task/TaskContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { CelebrationPopup } from '@/components/task/CelebrationPopup';

// CyberPath Core Platform Pages
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LearnPage } from '@/pages/LearnPage';
import { LabsPage } from '@/pages/LabsPage';
import { RoomDetailPage } from '@/pages/RoomDetailPage';
import { ChallengesPage } from '@/pages/ChallengesPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { VpnPage } from '@/pages/VpnPage';

export default function App() {
  return (
    <TaskProvider>
      <SettingsProvider>
        <AppShell>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Landing & Dashboard */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* 02. Learn Section */}
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/paths" element={<Navigate to="/learn" replace />} />

              {/* 03. Labs Section */}
              <Route path="/labs" element={<LabsPage />} />
              <Route path="/rooms" element={<Navigate to="/labs" replace />} />
              <Route path="/labs/:roomId" element={<RoomDetailPage />} />
              <Route path="/rooms/:roomId" element={<RoomDetailPage />} />

              {/* 04. Challenges Section */}
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/practice" element={<Navigate to="/challenges" replace />} />

              {/* 05. Dedicated Progress Section */}
              <Route path="/progress" element={<ProgressPage />} />

              {/* 06. Achievements */}
              <Route path="/achievements" element={<AchievementsPage />} />

              {/* User / Preferences Routes */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/vpn" element={<VpnPage />} />

              {/* Curriculum & Interactive Tools Sub-routes */}
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/roadmap/:moduleId/:daySlug" element={<DayPage />} />
              <Route path="/labs/module/:moduleId" element={<ExperimentLabPage />} />
              <Route path="/labs/module/:moduleId/:toolId" element={<ExperimentToolPage />} />

              {/* Catch-all fallback to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </AppShell>
        <CelebrationPopup />
      </SettingsProvider>
    </TaskProvider>
  );
}
