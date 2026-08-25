import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useProgress } from '@/hooks/useProgress';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ShortcutsModal } from '@/components/settings/ShortcutsModal';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const location = useLocation();
  const progress = useProgress();

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
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#080808] text-[#111111] dark:text-white transition-colors duration-250">
      {/* Desktop Command Center Sidebar */}
      <aside className="hidden lg:flex w-72 xl:w-80 shrink-0 h-full flex-col bg-[#F7F7F7] dark:bg-[#101010] border-r border-[#E5E5E5] dark:border-[#2A2A2A] z-20">
        <Sidebar progress={progress} />
      </aside>

      {/* Mobile Navigation Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-80 max-w-[85vw] bg-[#F7F7F7] dark:bg-[#101010] border-r border-[#E5E5E5] dark:border-[#2A2A2A]">
            <Sidebar
              progress={progress}
              mobile
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Command Center Container */}
      <div className="flex-1 min-w-0 h-full min-h-0 flex flex-col overflow-hidden bg-white dark:bg-[#080808] grid-pattern relative">
        <TopBar onMenuClick={() => setSidebarOpen(true)} progress={progress} />

        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8" id="main-content">
          {children}
        </main>
      </div>

      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
}
