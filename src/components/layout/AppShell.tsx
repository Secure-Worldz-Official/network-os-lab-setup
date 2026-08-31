import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ShortcutsModal } from '@/components/settings/ShortcutsModal';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const location = useLocation();

  useKeyboardShortcuts(() => setShortcutsModalOpen((prev) => !prev));

  const isLanding = location.pathname === '/' || location.pathname === '/landing';

  if (isLanding) {
    return (
      <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-white dark:bg-[#080808] text-[#111111] dark:text-white grid-pattern transition-colors duration-250">
        {children}
        <ShortcutsModal
          isOpen={shortcutsModalOpen}
          onClose={() => setShortcutsModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white dark:bg-[#080808] text-[#111111] dark:text-white transition-colors duration-250">
      {/* Top-Center Navigation Bar */}
      <TopBar />

      {/* Main Content Area — 100% full width responsive layout */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8" id="main-content">
        {children}
      </main>

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
}
