import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCyberPath } from '@/context/CyberPathContext';
import { rooms } from '@/data/cyberpathData';
import { Search, Award, Clock, BookOpen, Terminal } from 'lucide-react';

type CategoryFilter = 'All' | 'Linux' | 'Networking' | 'Web Security' | 'Threat & Defense' | 'Forensics';

export function RoomsPage() {
  const navigate = useNavigate();
  const { completedRooms, completedTasks } = useCyberPath();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = 
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = 
      categoryFilter === 'All' || 
      room.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 select-none font-mono">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
        <div className="space-y-1">
          <div className="text-[10px] text-[#888888] dark:text-[#777777] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Terminal size={14} className="text-[#111111] dark:text-white" />
            <span>PRACTICAL CYBERSECURITY LABS ({rooms.length})</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
            PRACTICAL ROOMS & VIRTUAL LABS
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-xl leading-relaxed">
            Hands-on cybersecurity laboratories. Learn techniques, start target instances, run terminal commands, and capture flags.
          </p>
        </div>

        {/* Global Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-3 text-[#888888] dark:text-[#777777]" />
          <input
            type="text"
            placeholder="SEARCH ROOMS, SKILLS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-9 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white placeholder-[#888888] dark:placeholder-[#666666] font-mono"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3 flex-wrap">
        {(['All', 'Linux', 'Networking', 'Web Security', 'Threat & Defense', 'Forensics'] as CategoryFilter[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer border uppercase tracking-wider ${
              categoryFilter === cat
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white font-bold'
                : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#555555] dark:text-[#B5B5B5] hover:text-[#111111] dark:hover:text-white hover:border-[#111111] dark:hover:border-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const roomTasks = room.tasks;
          const completedCount = roomTasks.filter((t) => completedTasks.has(t.id)).length;
          const isDone = completedRooms.includes(room.id) || completedCount === roomTasks.length;

          return (
            <div
              key={room.id}
              className="cyber-card p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] dark:text-[#777777]">{room.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                    isDone 
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white font-bold' 
                      : completedCount > 0
                      ? 'bg-[#F7F7F7] dark:bg-[#181818] text-[#111111] dark:text-white border-[#111111] dark:border-white font-bold'
                      : 'bg-[#F7F7F7] dark:bg-[#181818] text-[#888888] dark:text-[#777777] border-[#E5E5E5] dark:border-[#2A2A2A]'
                  }`}>
                    {isDone ? '✓ COMPLETED' : completedCount > 0 ? `IN PROGRESS (${completedCount}/${roomTasks.length})` : 'NOT STARTED'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-[#111111] dark:text-white font-heading tracking-wide uppercase leading-tight">
                    {room.title}
                  </h3>
                  <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans line-clamp-3 leading-relaxed">
                    {room.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div className="flex items-center justify-between text-[10px] text-[#666666] dark:text-[#B5B5B5]">
                  <span className="flex items-center gap-1 font-bold text-[#111111] dark:text-white">
                    <Clock size={12} /> {room.duration.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-[#111111] dark:text-white">
                    <BookOpen size={12} /> {roomTasks.length} TASKS
                  </span>
                  <span className="flex items-center gap-1 text-[#111111] dark:text-white font-bold">
                    <Award size={12} /> +{room.xp} XP
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {room.skills.slice(0, 2).map((skill) => (
                      <span 
                        key={skill}
                        className="px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[9px] text-[#555555] dark:text-[#B5B5B5] uppercase"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(`/rooms/${room.id}`)}
                    className="btn-cyber-primary text-xs py-2 px-3"
                  >
                    <span>START ROOM →</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
