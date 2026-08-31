import { useState } from 'react';
import { KeyRound, ShieldCheck, Lock } from 'lucide-react';

export function HashCrackingViz() {
  const [algo, setAlgo] = useState<'MD5' | 'SHA256' | 'BCRYPT'>('SHA256');
  const [withSalt, setWithSalt] = useState<boolean>(true);
  const passCandidate = 'password123';

  const HASH_TABLE: Record<string, string> = {
    'MD5-unsalted': '482c811da5d5b4bc6c497ffa98491e38',
    'SHA256-unsalted': 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    'SHA256-salted': 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3' + '[Salt: $9x!]',
    'BCRYPT-salted': '$2b$12$e8./P7ZqW1Wk7gXQk... [Adaptive Work Factor: 12]'
  };

  const key = `${algo}-${withSalt ? 'salted' : 'unsalted'}`;
  const hashResult = HASH_TABLE[key] || HASH_TABLE['SHA256-unsalted'];

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Algorithm Selector Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['MD5', 'SHA256', 'BCRYPT'] as const).map((a) => {
            const isActive = algo === a;
            return (
              <button
                key={a}
                id={`hash-algo-${a.toLowerCase()}`}
                type="button"
                onClick={() => setAlgo(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>

        <button
          id="hash-toggle-salt"
          type="button"
          onClick={() => setWithSalt(!withSalt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
            withSalt
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-rose-600 text-white border-rose-600 shadow-sm'
          }`}
        >
          {withSalt ? <ShieldCheck size={14} /> : <Lock size={14} />}
          {withSalt ? 'CRYPTOGRAPHIC SALT (ACTIVE)' : 'NO SALT (RAINBOW TABLE VULNERABLE)'}
        </button>
      </div>

      {/* SVG Hash Flow Diagram Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[260px] shadow-sm">
        <svg viewBox="0 0 540 220" aria-label="Cryptographic Hashing Flow" className="w-full max-h-[260px]">
          {/* Plaintext Input Node */}
          <rect x="20" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="90" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">PLAINTEXT</text>
          <text x="90" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">"{passCandidate}"</text>

          {/* Hashing Function Node */}
          <rect x="200" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="270" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">{algo}</text>
          <text x="270" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">{withSalt ? '+ Salt Byte' : '1-Way Digest'}</text>

          {/* Cipher Digest Node */}
          <rect x="380" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="450" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">HASH DIGEST</text>
          <text x="450" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">Immutable String</text>

          {/* Status Message */}
          <text x="270" y="180" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={withSalt && algo === 'BCRYPT' ? '#10b981' : '#f59e0b'} fontWeight="900">
            {algo === 'BCRYPT'
              ? '✓ BCRYPT ADAPTIVE WORK FACTOR RESISTS GPU BRUTE-FORCE CRACKING'
              : withSalt
              ? '✓ UNIQUE PER-USER SALT PREVENTS PRE-COMPUTED RAINBOW TABLE LOOKUPS'
              : '⚠ UNSALTED DIGEST VULNERABLE TO INSTANT RAINBOW TABLE REVERSAL'}
          </text>
        </svg>
      </div>

      {/* Hash Inspector Panel */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <KeyRound size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              GENERATED HASH DIGEST
            </span>
          </div>
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase font-mono">
            ALGORITHM: {algo}
          </span>
        </div>

        <code className="block p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs sm:text-sm font-mono text-emerald-600 dark:text-emerald-400 break-all leading-relaxed font-bold">
          {hashResult}
        </code>
      </div>
    </div>
  );
}
