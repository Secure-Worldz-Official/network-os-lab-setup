import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCyberPath } from '@/context/CyberPathContext';
import { rooms } from '@/data/cyberpathData';
import { Search, Award, Clock, BookOpen, Terminal, RotateCcw } from 'lucide-react';

type StatusFilter = 'All' | 'Available' | 'Active' | 'Completed';
type CategoryFilter = 'All' | 'Linux' | 'Networking' | 'Web Security' | 'Threat & Defense' | 'Forensics';

export function LabsPage() {
  const navigate = useNavigate();
  const { completedRooms, completedTasks, activeLab } = useCyberPath();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');

  const filteredLabs = rooms.filter((room) => {
    const roomTasks = room.tasks;
    const completedCount = roomTasks.filter((t) => completedTasks.has(t.id)).length;
    const isDone = completedRooms.includes(room.id) || completedCount === roomTasks.length;
    const isActive = activeLab?.roomId === room.id;

    // Search query
    const matchesSearch = 
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Category filter
    const matchesCategory = 
      categoryFilter === 'All' || 
      room.category === categoryFilter;

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'Available') {
      matchesStatus = !isDone && completedCount === 0;
    } else if (statusFilter === 'Active') {
      matchesStatus = isActive || (completedCount > 0 && !isDone);
    } else if (statusFilter === 'Completed') {
      matchesStatus = isDone;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCategoryFilter('All');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 select-none font-mono pb-8">
      {/* Page Header (Rule 13, 25) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
        <div className="space-y-1">
          <div className="text-[10px] text-[#888888] dark:text-[#777777] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Terminal size={13} className="text-[#111111] dark:text-white" />
            <span>PRACTICAL CYBERSECURITY ENVIRONMENTS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
            PRACTICAL LABS
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-xl leading-relaxed">
            Hands-on cybersecurity laboratories. Learn techniques, start target instances, run terminal commands, and capture flags.
          </p>
        </div>

        {/* Real-Time Search */}
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-[#888888] dark:text-[#777777]" />
          <input
            type="text"
            placeholder="Search labs, skills, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-9 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white placeholder-[#888888] dark:placeholder-[#666666] font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-[10px] text-[#888888] hover:text-[#111111] dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Control Bar: Status Tabs + Category Pills */}
      <div className="space-y-3">
        {/* Status Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex gap-1.5 flex-wrap">
            {(['All', 'Available', 'Active', 'Completed'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer border uppercase tracking-wider font-bold ${
                  statusFilter === status
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white'
                    : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#666666] dark:text-[#999999] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {status === 'All' ? `ALL LABS (${rooms.length})` : status.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-[#888888] dark:text-[#777777] font-bold">
            SHOWING {filteredLabs.length} OF {rooms.length} LABS
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {(['All', 'Linux', 'Networking', 'Web Security', 'Threat & Defense', 'Forensics'] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer border uppercase ${
                categoryFilter === cat
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white font-bold'
                  : 'bg-[#F7F7F7] dark:bg-[#181818] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#777777] dark:text-[#999999] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Labs Grid or Empty State (Rule 29) */}
      {filteredLabs.length === 0 ? (
        <div className="p-12 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F7F7F7] dark:bg-[#181818] flex items-center justify-center mx-auto text-[#888888] dark:text-[#777777]">
            <Terminal size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#111111] dark:text-white uppercase font-heading">
              NO LABS MATCH YOUR FILTER
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#999999] font-sans max-w-sm mx-auto">
              No practical laboratories were found with the selected category or status criteria.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="btn-cyber-secondary text-xs py-1.5 px-4"
          >
            <RotateCcw size={12} />
            <span>RESET ALL FILTERS</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((room) => {
            const roomTasks = room.tasks;
            const completedCount = roomTasks.filter((t) => completedTasks.has(t.id)).length;
            const isDone = completedRooms.includes(room.id) || completedCount === roomTasks.length;
            const isRunning = activeLab?.roomId === room.id;

            return (
              <div
                key={room.id}
                className={`cyber-card p-6 flex flex-col justify-between ${
                  isRunning ? 'border-[#111111] dark:border-white shadow-md' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888] dark:text-[#777777]">
                      {room.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border font-bold uppercase ${
                      isRunning
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                        : isDone 
                        ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white' 
                        : completedCount > 0
                        ? 'bg-[#F7F7F7] dark:bg-[#181818] text-[#111111] dark:text-white border-[#111111] dark:border-white'
                        : 'bg-[#F7F7F7] dark:bg-[#181818] text-[#888888] dark:text-[#777777] border-[#E5E5E5] dark:border-[#2A2A2A]'
                    }`}>
                      {isRunning ? '● RUNNING' : isDone ? '✓ COMPLETED' : completedCount > 0 ? `IN PROGRESS (${completedCount}/${roomTasks.length})` : 'AVAILABLE'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-[#111111] dark:text-white font-heading tracking-wide uppercase leading-tight">
                      {room.title}
                    </h3>
                    <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans line-clamp-3 leading-relaxed">
                      {room.description}
                    </p>
                  </div>
                </div>

                {/* Footer Metadata & Single CTA (Rule 13, 22) */}
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
                          className="px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[9px] text-[#555555] dark:text-[#B5B5B5] uppercase font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate(`/labs/${room.id}`)}
                      className={
                        isRunning 
                          ? 'btn-cyber-primary text-xs py-2 px-3 bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700' 
                          : isDone 
                          ? 'btn-cyber-secondary text-xs py-2 px-3' 
                          : 'btn-cyber-primary text-xs py-2 px-3'
                      }
                    >
                      <span>
                        {isRunning ? 'RESUME LAB →' : isDone ? 'RE-VISIT LAB →' : 'START LAB →'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
