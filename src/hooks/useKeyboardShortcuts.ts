import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ShortcutDefinition {
  combo: string;
  label: string;
  description: string;
  category: 'Navigation' | 'Actions' | 'Terminal';
}

export const PLATFORM_SHORTCUTS: ShortcutDefinition[] = [
  { combo: 'G + D', label: 'Go to Dashboard', description: 'Quick jump to main overview dashboard', category: 'Navigation' },
  { combo: 'G + P', label: 'Go to Learning Paths', description: 'Browse career training paths', category: 'Navigation' },
  { combo: 'G + R', label: 'Go to Rooms & Labs', description: 'Explore practical hands-on rooms', category: 'Navigation' },
  { combo: 'G + X', label: 'Go to Practice', description: 'Open interactive training challenges', category: 'Navigation' },
  { combo: 'G + C', label: 'Go to Challenges Roadmap', description: 'Curriculum & module roadmaps', category: 'Navigation' },
  { combo: 'G + A', label: 'Go to Achievements', description: 'View badges and clearance awards', category: 'Navigation' },
  { combo: 'G + L', label: 'Go to Leaderboard', description: 'Inspect operative global standings', category: 'Navigation' },
  { combo: 'G + U', label: 'Go to Profile', description: 'View operative identity & skill stats', category: 'Navigation' },
  { combo: 'G + V', label: 'Go to Lab Connectivity', description: 'VPN tunnel configuration page', category: 'Navigation' },
  { combo: 'G + S', label: 'Go to Settings', description: 'Platform preferences & configuration', category: 'Navigation' },
  { combo: '?', label: 'Open Shortcuts Cheat Sheet', description: 'Display global keyboard commands', category: 'Actions' },
  { combo: 'Esc', label: 'Close Active Dialogs', description: 'Dismiss open modals or overlay menus', category: 'Actions' },
  { combo: 'Ctrl + L', label: 'Clear Terminal Buffer', description: 'Wipe interactive terminal screen', category: 'Terminal' },
  { combo: '↑ / ↓', label: 'Command History', description: 'Navigate previous terminal commands', category: 'Terminal' },
  { combo: 'Tab', label: 'Command Autocomplete', description: 'Autocomplete commands and options', category: 'Terminal' },
  { combo: 'Ctrl + C', label: 'Cancel Process', description: 'Interrupt running terminal foreground task', category: 'Terminal' }
];

export function useKeyboardShortcuts(onToggleHelpModal?: () => void) {
  const navigate = useNavigate();
  const [gPressed, setGPressed] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Avoid intercepting keystrokes inside form controls
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Help modal trigger
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onToggleHelpModal?.();
        return;
      }

      // 'G' sequence handler (G then Key)
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setGPressed(true);
        setTimeout(() => setGPressed(false), 1200);
        return;
      }

      if (gPressed) {
        const key = e.key.toLowerCase();
        let handled = false;

        switch (key) {
          case 'd':
            navigate('/dashboard');
            handled = true;
            break;
          case 'p':
            navigate('/paths');
            handled = true;
            break;
          case 'r':
            navigate('/rooms');
            handled = true;
            break;
          case 'x':
            navigate('/practice');
            handled = true;
            break;
          case 'c':
            navigate('/roadmap');
            handled = true;
            break;
          case 'a':
            navigate('/achievements');
            handled = true;
            break;
          case 'l':
            navigate('/leaderboard');
            handled = true;
            break;
          case 'u':
            navigate('/profile');
            handled = true;
            break;
          case 'v':
            navigate('/vpn');
            handled = true;
            break;
          case 's':
            navigate('/settings');
            handled = true;
            break;
          default:
            break;
        }

        if (handled) {
          e.preventDefault();
          setGPressed(false);
        }
      }
    },
    [gPressed, navigate, onToggleHelpModal]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { gPressed, shortcuts: PLATFORM_SHORTCUTS };
}
