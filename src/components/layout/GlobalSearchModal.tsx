import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Terminal, 
  Compass, 
  Target, 
  Trophy, 
  ArrowRight,
  LayoutDashboard,
  BarChart2,
  User,
  Settings,
  Wifi,
  Activity
} from 'lucide-react';
import { learningPaths, rooms, challenges, badges } from '@/data/cyberpathData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Platform' | 'Learn' | 'Labs' | 'Challenges' | 'Achievements';
  to: string;
  icon: any;
  meta?: string;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus on mount
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items
  const allItems: SearchItem[] = [
    // Platform Destinations
    { id: 'p-dash', title: 'Dashboard', subtitle: 'Platform overview and active learning progress', category: 'Platform', to: '/dashboard', icon: LayoutDashboard },
    { id: 'p-learn', title: 'Learn & Curriculum', subtitle: 'Structured cybersecurity career pathways and modules', category: 'Platform', to: '/learn', icon: Compass },
    { id: 'p-labs', title: 'Practical Labs', subtitle: 'Interactive Linux terminals, web vulnerabilities & CTF targets', category: 'Platform', to: '/labs', icon: Terminal },
    { id: 'p-chal', title: 'Tactical Challenges', subtitle: 'CTF security challenges and theory missions', category: 'Platform', to: '/challenges', icon: Target },
    { id: 'p-prog', title: 'Progress & Analytics', subtitle: 'Detailed completion metrics, skill matrix & activity feed', category: 'Platform', to: '/progress', icon: Activity },
    { id: 'p-ach', title: 'Achievements & Badges', subtitle: 'Clearance credentials and unlocked milestones', category: 'Platform', to: '/achievements', icon: Trophy },
    { id: 'p-lead', title: 'Leaderboard', subtitle: 'Global operative scores and rankings', category: 'Platform', to: '/leaderboard', icon: BarChart2 },
    { id: 'p-prof', title: 'User Profile', subtitle: 'Operative profile, rank, and stats', category: 'Platform', to: '/profile', icon: User },
    { id: 'p-sett', title: 'Settings', subtitle: 'Theme, notifications, accessibility, security & preferences', category: 'Platform', to: '/settings', icon: Settings },
    { id: 'p-vpn', title: 'Lab Connectivity & VPN', subtitle: 'Connect to isolated target lab networks', category: 'Platform', to: '/vpn', icon: Wifi },

    // Learning Paths
    ...learningPaths.map((lp) => ({
      id: `lp-${lp.id}`,
      title: lp.title,
      subtitle: `${lp.difficulty} • ${lp.estimatedTime} • ${lp.skills.join(', ')}`,
      category: 'Learn' as const,
      to: '/learn',
      icon: Compass,
      meta: `+${lp.xpReward} XP`
    })),

    // Practical Labs
    ...rooms.map((r) => ({
      id: `room-${r.id}`,
      title: r.title,
      subtitle: `${r.category} • ${r.difficulty} • ${r.duration} • ${r.description}`,
      category: 'Labs' as const,
      to: `/labs/${r.id}`,
      icon: Terminal,
      meta: `+${r.xp} XP`
    })),

    // Challenges
    ...challenges.map((c) => ({
      id: `chal-${c.id}`,
      title: c.title,
      subtitle: `${c.category} • ${c.difficulty} • ${c.description}`,
      category: 'Challenges' as const,
      to: '/challenges',
      icon: Target,
      meta: `+${c.xp} XP`
    })),

    // Badges
    ...badges.map((b) => ({
      id: `badge-${b.id}`,
      title: b.title,
      subtitle: `${b.description}`,
      category: 'Achievements' as const,
      to: '/achievements',
      icon: Trophy,
      meta: `+${b.xpReward} XP`
    }))
  ];

  const filteredItems = query.trim() === ''
    ? allItems.slice(0, 10)
    : allItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }).slice(0, 15);

  const handleSelect = (item: SearchItem) => {
    navigate(item.to);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 select-none font-mono">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#121212] border border-[#111111] dark:border-white shadow-2xl rounded-md overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#161616]">
              <Search size={16} className="text-[#888888] dark:text-[#777777] shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type to search paths, labs, challenges, pages..."
                className="w-full bg-transparent text-sm text-[#111111] dark:text-white outline-none placeholder-[#888888] dark:placeholder-[#666666] font-mono"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white mr-2"
                >
                  CLEAR
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white rounded"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results List */}
            <div ref={listRef} className="overflow-y-auto p-2 space-y-1 max-h-96">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-xs text-[#888888] dark:text-[#777777]">NO RESULTS FOUND FOR "{query.toUpperCase()}"</p>
                  <p className="text-[11px] text-[#555555] dark:text-[#B5B5B5] font-sans">
                    Try searching for "nmap", "linux", "sql", "dashboard", or "settings".
                  </p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-[4px] border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white'
                          : 'bg-white dark:bg-[#141414] text-[#111111] dark:text-white border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-1.5 rounded border shrink-0 ${
                          isSelected 
                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black border-transparent' 
                            : 'bg-[#F7F7F7] dark:bg-[#181818] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white'
                        }`}>
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-heading truncate uppercase">
                              {item.title}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isSelected
                                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                                : 'bg-[#F0F0F0] dark:bg-[#202020] text-[#777777] dark:text-[#999999]'
                            }`}>
                              {item.category}
                            </span>
                          </div>
                          <p className={`text-[11px] font-sans truncate ${
                            isSelected ? 'text-white/80 dark:text-black/80' : 'text-[#666666] dark:text-[#999999]'
                          }`}>
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.meta && (
                          <span className={`text-[10px] font-bold ${
                            isSelected ? 'text-white dark:text-black' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {item.meta}
                          </span>
                        )}
                        <ArrowRight size={13} className={isSelected ? 'opacity-100' : 'opacity-40'} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-4 py-2 bg-[#FAFAFA] dark:bg-[#161616] border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-[10px] text-[#888888] dark:text-[#777777]">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333] rounded font-bold">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333] rounded font-bold">↓</kbd> TO NAVIGATE</span>
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333] rounded font-bold">ENTER</kbd> TO SELECT</span>
                <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333] rounded font-bold">ESC</kbd> TO CLOSE</span>
              </div>
              <span className="font-bold">CYBERPATH OMNIBAR</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
