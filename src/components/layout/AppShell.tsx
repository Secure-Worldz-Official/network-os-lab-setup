import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useProgress } from '@/hooks/useProgress';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const progress = useProgress();

  const isLanding = location.pathname === '/' || location.pathname === '/landing';

  if (isLanding) {
    return (
      <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-white text-[#111111] grid-pattern">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#111111]">
      {/* Desktop Command Center Sidebar */}
      <aside className="hidden lg:flex w-72 xl:w-80 shrink-0 h-full flex-col bg-[#F7F7F7] border-r border-[#E5E5E5] z-20">
        <Sidebar progress={progress} />
      </aside>

      {/* Mobile Navigation Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-80 max-w-[85vw] bg-[#F7F7F7] border-r border-[#E5E5E5]">
            <Sidebar
              progress={progress}
              mobile
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Command Center Container */}
      <div className="flex-1 min-w-0 h-full min-h-0 flex flex-col overflow-hidden bg-white grid-pattern relative">
        <TopBar onMenuClick={() => setSidebarOpen(true)} progress={progress} />

        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
