import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useProgress } from '@/hooks/useProgress';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const progress = useProgress();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-[#fafafa]">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 h-full">
        <Sidebar progress={progress} />
      </div>

      {/* Mobile Drawer Backdrop + Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full max-w-[85vw]">
            <Sidebar
              progress={progress}
              mobile
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} progress={progress} />
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
