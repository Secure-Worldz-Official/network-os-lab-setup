import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { useProgress } from '@/hooks/useProgress';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ShortcutsModal } from '@/components/settings/ShortcutsModal';
import { 
  LayoutDashboard, 
  Compass, 
  Terminal, 
  Target, 
  Activity 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

const mobileBottomNav = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, aliases: ['/'] },
  { to: '/learn', label: 'Learn', icon: Compass, aliases: ['/paths', '/roadmap'] },
  { to: '/labs', label: 'Labs', icon: Terminal, aliases: ['/rooms'] },
  { to: '/challenges', label: 'CTF', icon: Target, aliases: ['/practice'] },
  { to: '/progress', label: 'Progress', icon: Activity, aliases: [] },
];

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const location = useLocation();
  const progress = useProgress();

  useKeyboardShortcuts(() => setShortcutsModalOpen((prev) => !prev));

  // Global Ctrl + K listener for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isLanding = location.pathname === '/' || location.pathname === '/landing';

  if (isLanding) {
    return (
      <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-white dark:bg-[#080808] text-[#111111] dark:text-white grid-pattern transition-colors duration-250">
        {children}
        <GlobalSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
        <ShortcutsModal
          isOpen={shortcutsModalOpen}
          onClose={() => setShortcutsModalOpen(false)}
        />
      </div>
    );
  }

  const isBottomItemActive = (to: string, aliases: string[] = []) => {
    if (to === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    if (location.pathname.startsWith(to)) return true;
    return aliases.some(alias => location.pathname.startsWith(alias));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#080808] text-[#111111] dark:text-white transition-colors duration-250">
      
      {/* Desktop Command Center Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 h-full flex-col bg-[#F7F7F7] dark:bg-[#101010] border-r border-[#E5E5E5] dark:border-[#2A2A2A] z-20">
        <Sidebar progress={progress} />
      </aside>

      {/* Mobile Slide-Out Navigation Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-72 max-w-[85vw] bg-[#F7F7F7] dark:bg-[#101010] border-r border-[#E5E5E5] dark:border-[#2A2A2A]">
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
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)} 
          onSearchClick={() => setSearchModalOpen(true)}
          progress={progress} 
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-16 lg:pb-8" id="main-content">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar (Rule 35) */}
        <nav aria-label="Mobile Bottom Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#101010]/95 backdrop-blur-md border-t border-[#E5E5E5] dark:border-[#2A2A2A] px-2 py-1.5 flex items-center justify-around font-mono">
          {mobileBottomNav.map(({ to, label, icon: Icon, aliases }) => {
            const active = isBottomItemActive(to, aliases);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded text-[10px] font-bold transition-all',
                  active
                    ? 'text-[#111111] dark:text-white font-extrabold'
                    : 'text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white'
                )}
              >
                <Icon size={16} className={active ? 'scale-110 transition-transform' : ''} />
                <span className="mt-0.5 uppercase tracking-wider">{label}</span>
                {active && (
                  <span className="w-1 h-1 rounded-full bg-[#111111] dark:bg-white mt-0.5" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Global Omnibar Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </div>
  );
}
