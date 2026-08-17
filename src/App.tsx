import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { DayPage } from '@/pages/DayPage';
import { ExperimentLabHubPage } from '@/pages/ExperimentLabHubPage';
import { ExperimentLabPage } from '@/pages/ExperimentLabPage';
import { ExperimentToolPage } from '@/pages/ExperimentToolPage';

export default function App() {
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/roadmap/:moduleId/:daySlug" element={<DayPage />} />
          <Route path="/labs" element={<ExperimentLabHubPage />} />
          <Route path="/labs/:moduleId" element={<ExperimentLabPage />} />
          <Route path="/labs/:moduleId/:toolId" element={<ExperimentToolPage />} />
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}
