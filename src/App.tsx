import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { DayPage } from '@/pages/DayPage';
import { ExperimentLabHubPage } from '@/pages/ExperimentLabHubPage';
import { ExperimentLabPage } from '@/pages/ExperimentLabPage';
import { ExperimentToolPage } from '@/pages/ExperimentToolPage';
import { TaskProvider } from '@/components/task/TaskContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { CelebrationPopup } from '@/components/task/CelebrationPopup';

// CyberPath platform pages
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LearningPathsPage } from '@/pages/LearningPathsPage';
import { RoomsPage } from '@/pages/RoomsPage';
import { RoomDetailPage } from '@/pages/RoomDetailPage';
import { PracticePage } from '@/pages/PracticePage';
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
              {/* CyberPath routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/paths" element={<LearningPathsPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/vpn" element={<VpnPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Preserved legacy routes */}
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/roadmap/:moduleId/:daySlug" element={<DayPage />} />
              <Route path="/labs" element={<ExperimentLabHubPage />} />
              <Route path="/labs/:moduleId" element={<ExperimentLabPage />} />
              <Route path="/labs/:moduleId/:toolId" element={<ExperimentToolPage />} />
            </Routes>
          </AnimatePresence>
        </AppShell>
        <CelebrationPopup />
      </SettingsProvider>
    </TaskProvider>
  );
}
