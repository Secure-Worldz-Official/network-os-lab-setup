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
      {/* ── Desktop Persistent Sidebar ── */}
      <aside className="hidden lg:flex w-72 xl:w-80 shrink-0 h-full flex-col glass-sidebar">
        <Sidebar progress={progress} />
      </aside>

      {/* ── Mobile Drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative z-10 h-full w-80 max-w-[85vw] bg-[#0c0c0e] shadow-2xl border-r border-zinc-800 glass-sidebar">
            <Sidebar
              progress={progress}
              mobile
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Main Content Column ── */}
      <div className="flex-1 min-w-0 h-full min-h-0 flex flex-col overflow-hidden bg-gradient-to-b from-[#09090b] to-[#0a0a0c]">
        {/* Mobile top bar — ONLY visible on mobile screens */}
        <TopBar onMenuClick={() => setSidebarOpen(true)} progress={progress} />

        {/* Scrollable page content */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
