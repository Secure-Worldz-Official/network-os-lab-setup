import { Link } from 'react-router-dom';
import { useCyberPath } from '@/context/CyberPathContext';
import { rooms, learningPaths } from '@/data/cyberpathData';
import { Shield, Terminal } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function DashboardPage() {
  const { 
    username, 
    xp, 
    level, 
    levelName, 
    streak, 
    completedRooms, 
    completedTasks,
    activeLab
  } = useCyberPath();

  const currentPath = learningPaths[0];
  const featuredRoom = rooms.find(r => r.id === 'nmap-fundamentals') || rooms[0];
  const featuredTasksDone = featuredRoom.tasks.filter(t => completedTasks.has(t.id)).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono">
      
      {/* Platform Command Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#888888] uppercase tracking-widest mb-1">
            <Shield size={14} className="text-[#111111]" />
            <span>CYBERPATH SECURITY TRAINING PLATFORM</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-heading tracking-tight uppercase leading-none">
            WELCOME BACK,<br />
            {username.toUpperCase()}.
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/rooms" className="btn-cyber-primary text-xs py-2.5 px-4">
            <Terminal size={14} />
            <span>BROWSE ALL LABS</span>
          </Link>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-4 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#888888] tracking-widest block">CURRENT LEVEL</span>
          <p className="text-lg font-extrabold text-[#111111] font-heading">LVL {level}</p>
          <span className="text-[10px] text-[#666666] truncate block">{levelName}</span>
        </div>

        <div className="p-4 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#888888] tracking-widest block">TOTAL XP</span>
          <p className="text-lg font-extrabold text-[#111111] font-heading">{xp.toLocaleString()}</p>
          <span className="text-[10px] text-[#666666] block">Rank #1 Active</span>
        </div>

        <div className="p-4 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#888888] tracking-widest block">STREAK</span>
          <p className="text-lg font-extrabold text-[#111111] font-heading">{streak} DAYS</p>
          <span className="text-[10px] text-emerald-700 font-bold block">● Daily Active</span>
        </div>

        <div className="p-4 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#888888] tracking-widest block">ROOMS SOLVED</span>
          <p className="text-lg font-extrabold text-[#111111] font-heading">{completedRooms.length} / {rooms.length}</p>
          <span className="text-[10px] text-[#666666] block">{Math.round((completedRooms.length / rooms.length) * 100)}% Complete</span>
        </div>

        <div className="p-4 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#888888] tracking-widest block">ACTIVE LABS</span>
          <p className="text-lg font-extrabold text-[#111111] font-heading">{activeLab ? '1 ONLINE' : '0 ACTIVE'}</p>
          <span className="text-[10px] text-[#666666] block">{activeLab ? activeLab.targetIp : 'Ready to Start'}</span>
        </div>

        <div className="p-4 rounded-md border border-[#E5E5E5] bg-[#FAFAFA] space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#888888] tracking-widest block">PATH TRACK</span>
          <p className="text-xs font-extrabold text-[#111111] font-heading truncate">FOUNDATIONS</p>
          <span className="text-[10px] text-[#666666] block">4 Modules</span>
        </div>
      </div>

      {/* Large Continue Learning Hero Module */}
      <div className="p-6 sm:p-8 rounded-md border border-[#111111] bg-white space-y-5 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest block">
              // CURRENT LEARNING PATH: {currentPath.title.toUpperCase()}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] font-heading uppercase tracking-tight">
              CONTINUE LEARNING
            </h2>
          </div>

          <Link
            to={`/rooms/${featuredRoom.id}`}
            className="btn-cyber-primary text-xs py-3 px-6 shrink-0"
          >
            <span>CONTINUE LAB →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="space-y-2 col-span-2">
            <span className="text-[10px] uppercase font-bold text-[#888888]">CURRENT ACTIVE ROOM</span>
            <h3 className="text-lg font-bold text-[#111111] uppercase font-heading">
              "{featuredRoom.title}"
            </h3>
            <p className="text-xs text-[#555555] font-sans leading-relaxed">
              {featuredRoom.description}
            </p>
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs font-bold text-[#111111]">
                <span>TASK PROGRESS</span>
                <span>0{featuredTasksDone} / 0{featuredRoom.tasks.length} TASKS</span>
              </div>
              <ProgressBar value={Math.round((featuredTasksDone / featuredRoom.tasks.length) * 100)} size="md" />
            </div>
          </div>

          <div className="p-4 rounded border border-[#E5E5E5] bg-[#FAFAFA] space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#888888] block">TARGET LAB NODE</span>
              <p className="font-bold text-[#111111] text-sm mt-1">10.10.20.15</p>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">● VPN PRIVATE ACCESS READY</span>
            </div>

            <div className="text-[11px] text-[#555555] space-y-1 pt-2 border-t border-[#E5E5E5]">
              <div className="flex justify-between">
                <span>DIFFICULTY:</span>
                <span className="font-bold text-[#111111]">{featuredRoom.difficulty.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>REWARD:</span>
                <span className="font-bold text-[#111111]">+{featuredRoom.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Practical Rooms Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <h2 className="text-lg font-bold text-[#111111] font-heading uppercase tracking-wide">
            AVAILABLE PRACTICAL ROOMS ({rooms.length})
          </h2>
          <Link to="/rooms" className="text-xs font-bold text-[#111111] hover:underline">
            VIEW ALL ROOMS →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {rooms.slice(0, 6).map((room) => {
            const isDone = completedRooms.includes(room.id);
            const doneTasksCount = room.tasks.filter(t => completedTasks.has(t.id)).length;

            return (
              <div key={room.id} className="cyber-card p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#888888] uppercase">{room.category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7F7F7] border border-[#E5E5E5]">
                      {room.difficulty.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#111111] font-heading uppercase leading-tight">
                    {room.title}
                  </h3>

                  <p className="text-xs text-[#555555] font-sans line-clamp-2">
                    {room.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E5E5E5]">
                  <div className="flex justify-between text-[11px] text-[#666666]">
                    <span>TASKS: {doneTasksCount}/{room.tasks.length}</span>
                    <span className="font-bold text-[#111111]">+{room.xp} XP</span>
                  </div>

                  <Link
                    to={`/rooms/${room.id}`}
                    className="block w-full text-center btn-cyber-primary text-xs py-2"
                  >
                    {isDone ? 'RE-VISIT ROOM →' : 'START ROOM →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
