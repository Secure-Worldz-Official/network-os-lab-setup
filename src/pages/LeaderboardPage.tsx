import { useState } from 'react';
import { useCyberPath } from '@/context/CyberPathContext';
import { BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeFilter = 'Global' | 'Weekly' | 'Monthly' | 'Friends';

export function LeaderboardPage() {
  const { getLeaderboard } = useCyberPath();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Global');

  const ranking = getLeaderboard();

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest flex items-center gap-1.5">
            <BarChart2 size={14} className="text-[#111111] dark:text-white" />
            <span>GLOBAL OPERATIVE STANDINGS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
            LEADERBOARD TERMINAL
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] max-w-xl leading-relaxed font-sans">
            Track user rankings globally. Complete practical rooms and submit flags to earn XP and ascend the leaderboard.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-1 border border-[#E5E5E5] dark:border-[#2A2A2A] p-1 rounded bg-[#F7F7F7] dark:bg-[#141414] shrink-0 self-start sm:self-auto">
          {(['Global', 'Weekly', 'Monthly', 'Friends'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={cn(
                "px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer uppercase tracking-wider font-bold",
                timeFilter === filter 
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808]' 
                  : 'text-[#555555] dark:text-[#B5B5B5] hover:text-[#111111] dark:hover:text-white'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Ranking Table */}
      <div className="rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] shadow-sm overflow-hidden font-mono">
        <div className="flex items-center justify-between px-4 py-3 bg-[#F7F7F7] dark:bg-[#181818] border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <BarChart2 size={14} className="text-[#111111] dark:text-white" />
            <span className="text-[10px] font-extrabold tracking-widest text-[#111111] dark:text-white uppercase">
              RANKING_DB // OPERATIVE_SCORES
            </span>
          </div>
          <span className="text-[10px] text-[#888888] dark:text-[#777777] font-bold uppercase">
            ACTIVE USERS: {ranking.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-[#888888] dark:text-[#777777] text-[10px] uppercase font-bold tracking-widest">
                <th className="py-3 px-6 text-center w-16">RANK</th>
                <th className="py-3 px-6">USER IDENTITY</th>
                <th className="py-3 px-6 text-center">LEVEL</th>
                <th className="py-3 px-6 text-right">XP SCORE</th>
                <th className="py-3 px-6 text-center hidden sm:table-cell">ROOMS</th>
                <th className="py-3 px-6 text-center hidden sm:table-cell">BADGES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A]">
              {ranking.map((user) => {
                const rankStr = user.rank < 10 ? `0${user.rank}` : `${user.rank}`;

                return (
                  <tr 
                    key={user.username}
                    className={cn(
                      "transition-all font-mono",
                      user.isCurrentUser 
                        ? 'bg-[#111111] text-white dark:bg-white dark:text-[#080808] font-bold' 
                        : 'text-[#111111] dark:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#181818]'
                    )}
                  >
                    <td className="py-4 px-6 text-center font-extrabold">{rankStr}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          user.isCurrentUser ? 'bg-white dark:bg-black' : 'bg-[#111111] dark:bg-white'
                        )} />
                        <span className="tracking-wider uppercase font-bold">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold">{user.level}</td>
                    <td className="py-4 px-6 text-right font-extrabold">
                      {user.xp.toLocaleString()} XP
                    </td>
                    <td className="py-4 px-6 text-center hidden sm:table-cell font-bold">
                      {user.roomsCompleted}
                    </td>
                    <td className="py-4 px-6 text-center hidden sm:table-cell font-bold">
                      {user.badgesCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
