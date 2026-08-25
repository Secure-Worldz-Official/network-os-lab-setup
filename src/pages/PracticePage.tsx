import { useState } from 'react';
import { useCyberPath } from '@/context/CyberPathContext';
import { challenges, type Challenge } from '@/data/cyberpathData';
import { CheckCircle, Eye, EyeOff, Target } from 'lucide-react';

type ChallengeCategory = 'All' | 'Linux' | 'Networking' | 'Web Security' | 'Cryptography' | 'Forensics' | 'OSINT' | 'Programming' | 'Defensive Security';

export function PracticePage() {
  const { completeChallenge, isChallengeCompleted } = useCyberPath();
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory>('All');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { success: boolean; message: string }>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const filteredChallenges = challenges.filter((c) => {
    return selectedCategory === 'All' || c.category === selectedCategory;
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6 space-y-1">
        <div className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest flex items-center gap-1.5">
          <Target size={14} className="text-[#111111] dark:text-white" />
          <span>TACTICAL CAPTURE THE FLAG MISSIONS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
          SECURITY MISSIONS & CHALLENGES
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] max-w-2xl leading-relaxed font-sans">
          Solve byte-sized capture-the-flag missions to hone your technical and theoretical security knowledge.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3 flex-wrap">
        {([
          'All', 'Linux', 'Networking', 'Web Security', 'Cryptography', 'Forensics', 'OSINT', 'Programming', 'Defensive Security'
        ] as ChallengeCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer border uppercase tracking-wider ${
              selectedCategory === cat
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white font-bold'
                : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#555555] dark:text-[#B5B5B5] hover:text-[#111111] dark:hover:text-white hover:border-[#111111] dark:hover:border-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Missions List */}
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
                  : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
              }`}
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
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
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    solved ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white' : 'bg-[#F7F7F7] dark:bg-[#181818] text-[#888888] dark:text-[#777777] border-[#E5E5E5] dark:border-[#2A2A2A]'
                  }`}>
                    {solved ? '✓ COMPLETED' : 'ACTIVE'}
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
              </div>

              {/* Input Form */}
              <div className="w-full md:w-72 shrink-0 flex flex-col gap-3 pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-[#E5E5E5] dark:border-[#2A2A2A] self-stretch justify-center">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="ENTER ANSWER..."
                    value={inputs[challenge.id] || ''}
                    disabled={solved}
                    onChange={(e) => setInputs(prev => ({ ...prev, [challenge.id]: e.target.value }))}
                    className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white disabled:opacity-60 placeholder-[#888888] dark:placeholder-[#666666] font-mono"
                  />
                  <button
                    disabled={solved}
                    onClick={() => handleSubmit(challenge)}
                    className={solved ? 'w-full btn-cyber-secondary text-xs' : 'w-full btn-cyber-primary text-xs'}
                  >
                    {solved ? '✓ MISSION COMPLETE' : 'SUBMIT ANSWER →'}
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
    </div>
  );
}
