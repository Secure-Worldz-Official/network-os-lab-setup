import { useState } from 'react';
import { useCyberPath } from '@/context/CyberPathContext';
import { challenges, type Challenge } from '@/data/cyberpathData';
import { CheckCircle, Eye, EyeOff, Target, RotateCcw, Search } from 'lucide-react';

type ChallengeCategory = 'All' | 'Linux' | 'Networking' | 'Web Security' | 'Cryptography' | 'Forensics' | 'OSINT' | 'Programming' | 'Defensive Security';
type StatusFilter = 'All' | 'Available' | 'Completed';

export function ChallengesPage() {
  const { completeChallenge, isChallengeCompleted } = useCyberPath();
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { success: boolean; message: string }>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const filteredChallenges = challenges.filter((c) => {
    const solved = isChallengeCompleted(c.id);
    
    // Category match
    const categoryMatch = selectedCategory === 'All' || c.category === selectedCategory;
    
    // Status match
    let statusMatch = true;
    if (statusFilter === 'Available') statusMatch = !solved;
    if (statusFilter === 'Completed') statusMatch = solved;

    // Search match
    const searchMatch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && statusMatch && searchMatch;
  });

  const handleSubmit = (challenge: Challenge) => {
    const attempt = inputs[challenge.id] || '';
    const res = completeChallenge(challenge.id, attempt);
    setFeedback((prev) => ({
      ...prev,
      [challenge.id]: res
    }));
  };

  const toggleHint = (id: string) => {
    setShowHints(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setStatusFilter('All');
    setSearchTerm('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono pb-8">
      {/* Header (Rule 16, 25) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest flex items-center gap-1.5">
            <Target size={13} className="text-[#111111] dark:text-white" />
            <span>TACTICAL CAPTURE THE FLAG MISSIONS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
            CHALLENGES
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] max-w-xl leading-relaxed font-sans">
            Solve byte-sized capture-the-flag missions to hone your technical skills and test security concepts under realistic constraints.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-[#888888] dark:text-[#777777]" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-9 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white placeholder-[#888888] dark:placeholder-[#666666] font-mono"
          />
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="space-y-3">
        {/* Status Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex gap-1.5">
            {(['All', 'Available', 'Completed'] as StatusFilter[]).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer border uppercase tracking-wider font-bold ${
                  statusFilter === st
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white'
                    : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#666666] dark:text-[#999999] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {st === 'All' ? `ALL (${challenges.length})` : st.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-[#888888] dark:text-[#777777] font-bold">
            SHOWING {filteredChallenges.length} OF {challenges.length} MISSIONS
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 flex-wrap">
          {([
            'All', 'Linux', 'Networking', 'Web Security', 'Cryptography', 'Forensics', 'OSINT', 'Programming', 'Defensive Security'
          ] as ChallengeCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer border uppercase ${
                selectedCategory === cat
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white font-bold'
                  : 'bg-[#F7F7F7] dark:bg-[#181818] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#777777] dark:text-[#999999] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List or Empty State */}
      {filteredChallenges.length === 0 ? (
        <div className="p-12 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F7F7F7] dark:bg-[#181818] flex items-center justify-center mx-auto text-[#888888] dark:text-[#777777]">
            <Target size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#111111] dark:text-white uppercase font-heading">
              NO CHALLENGES FOUND
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#999999] font-sans max-w-sm mx-auto">
              No tactical missions match your selected filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="btn-cyber-secondary text-xs py-1.5 px-4"
          >
            <RotateCcw size={12} />
            <span>RESET FILTERS</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChallenges.map((challenge, idx) => {
            const solved = isChallengeCompleted(challenge.id);
            const currentFeedback = feedback[challenge.id];
            const missionNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <div 
                key={challenge.id}
                className={`p-6 rounded-md border flex flex-col md:flex-row gap-6 items-start justify-between transition-all ${
                  solved
                    ? 'bg-[#FAFAFA] dark:bg-[#101010] border-[#E5E5E5] dark:border-[#2A2A2A]'
                    : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white shadow-xs'
                }`}
              >
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
                    <span className="text-xs text-[#111111] dark:text-white font-bold tracking-widest">
                      MISSION {missionNum}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777]">{challenge.category}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#181818] text-[#111111] dark:text-white font-bold uppercase">
                      {challenge.difficulty}
                    </span>
                    <span className="text-[10px] text-[#111111] dark:text-white font-bold">
                      +{challenge.xp} XP
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                      solved 
                        ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white' 
                        : 'bg-[#F7F7F7] dark:bg-[#181818] text-[#888888] dark:text-[#777777] border-[#E5E5E5] dark:border-[#2A2A2A]'
                    }`}>
                      {solved ? '✓ SOLVED' : 'AVAILABLE'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-[#111111] dark:text-white font-heading tracking-wide uppercase flex items-center gap-2">
                      {challenge.title}
                      {solved && <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </h3>
                    <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed max-w-2xl">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Hint Toggle */}
                  {challenge.hint && (
                    <div>
                      <button
                        onClick={() => toggleHint(challenge.id)}
                        className="text-[10px] text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                      >
                        {showHints[challenge.id] ? <EyeOff size={11} /> : <Eye size={11} />}
                        <span>{showHints[challenge.id] ? '[ HIDE HINT ]' : '[ VIEW HINT ]'}</span>
                      </button>
                      {showHints[challenge.id] && (
                        <div className="mt-2 p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#181818] text-xs text-[#555555] dark:text-[#B5B5B5] max-w-md font-mono">
                          {challenge.hint}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Submission Form (Rule 16, 21, 22) */}
                <div className="w-full md:w-72 shrink-0 flex flex-col gap-3 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-[#E5E5E5] dark:border-[#2A2A2A] self-stretch justify-center">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter flag / answer..."
                      value={inputs[challenge.id] || ''}
                      disabled={solved}
                      onChange={(e) => setInputs(prev => ({ ...prev, [challenge.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !solved) handleSubmit(challenge);
                      }}
                      className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white disabled:opacity-60 placeholder-[#888888] dark:placeholder-[#666666] font-mono"
                    />
                    <button
                      disabled={solved}
                      onClick={() => handleSubmit(challenge)}
                      className={solved ? 'w-full btn-cyber-secondary text-xs py-2' : 'w-full btn-cyber-primary text-xs py-2'}
                    >
                      {solved ? '✓ MISSION SOLVED' : 'SUBMIT ANSWER →'}
                    </button>
                  </div>

                  {currentFeedback && (
                    <div className={`p-2.5 rounded border text-xs font-mono font-bold ${
                      currentFeedback.success 
                        ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                        : 'border-rose-600 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                    }`}>
                      {currentFeedback.message}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
