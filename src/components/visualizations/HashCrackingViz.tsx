import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Lock } from 'lucide-react';

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

const HASH_TABLE: Record<string, string> = {
  'MD5-unsalted': '482c811da5d5b4bc6c497ffa98491e38',
  'SHA256-unsalted': 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
  'SHA256-salted': 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3[Salt: $9x!]',
  'BCRYPT-salted': '$2b$12$e8./P7ZqW1Wk7gXQk...[Adaptive Work Factor: 12]'
};

export function HashCrackingViz() {
  const [algo, setAlgo] = useState<'MD5' | 'SHA256' | 'BCRYPT'>('SHA256');
  const [withSalt, setWithSalt] = useState<boolean>(true);
  const [crackStatus, setCrackStatus] = useState<'idle' | 'dict_lookup' | 'rainbow' | 'secure'>('idle');
  const [lookupProgress, setLookupProgress] = useState(0);
  const [dictAttempts, setDictAttempts] = useState<string[]>([]);
  const passCandidate = 'password123';

  const runCrackAttempt = () => {
    setCrackStatus('dict_lookup');
    setLookupProgress(0);
    setDictAttempts([]);

    const attempts = ['password', 'password123', 'admin123', 'letmein', 'welcome', 'monkey123'];
    const startTime = performance.now();
    const duration = 2000;

    let attemptIdx = 0;
    const interval = setInterval(() => {
      if (attemptIdx < attempts.length) {
        setDictAttempts(prev => [...prev, attempts[attemptIdx]]);
        attemptIdx++;
      }
    }, 200);

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      setLookupProgress(t);

      if (t >= 1) {
        clearInterval(interval);
        if (!withSalt && algo !== 'BCRYPT') {
          setCrackStatus('rainbow');
        } else {
          setCrackStatus('secure');
        }
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  const key = `${algo}-${withSalt ? 'salted' : 'unsalted'}`;
  const hashResult = HASH_TABLE[key] || HASH_TABLE['SHA256-unsalted'];

  return (
    <div className="space-y-5 font-mono select-none w-full">
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['MD5', 'SHA256', 'BCRYPT'] as const).map((a) => {
            const isActive = algo === a;
            return (
              <button
                key={a}
                id={`hash-algo-${a.toLowerCase()}`}
                type="button"
                onClick={() => { setAlgo(a); setCrackStatus('idle'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border ${
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
          onClick={() => { setWithSalt(!withSalt); setCrackStatus('idle'); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border flex items-center gap-1.5 ${
            withSalt
              ? 'bg-[#333333] text-white border-[#333333] shadow-sm dark:bg-[#555555] dark:border-[#555555]'
              : 'bg-[#333333] text-white border-[#333333] shadow-sm dark:bg-[#555555] dark:border-[#555555]'
          }`}
        >
          <Lock size={14} />
          {withSalt ? 'SALT ACTIVE' : 'NO SALT (VULNERABLE)'}
        </button>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[300px] shadow-sm">
        <svg viewBox="0 0 540 240" aria-label="Cryptographic hashing and cracking flow" className="w-full max-h-[300px]">
          <motion.rect x="20" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="90" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">PLAINTEXT</text>
          <text x="90" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">"{passCandidate}"</text>

          <motion.line x1="160" y1="87" x2="200" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -10] }} transition={{ duration: 1, repeat: Infinity }} />

          <motion.rect x="200" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="270" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">{algo}</text>
          <motion.text
            x="270" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)"
            key={`salt-${withSalt}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            {withSalt ? '+ Salt Byte' : '1-Way Digest'}
          </motion.text>

          <motion.line x1="340" y1="87" x2="380" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} />

          <motion.rect x="380" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="450" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">HASH DIGEST</text>
          <text x="450" y="100" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">Immutable String</text>

          <AnimatePresence>
            {crackStatus === 'dict_lookup' && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={trans}
              >
                <rect x="60" y="160" width="420" height="60" rx="8" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="1.5" />
                <text x="270" y="180" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)" fontWeight="800">DICTIONARY LOOKUP ATTEMPT</text>
                <motion.text
                  x="270" y="205" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {dictAttempts.length > 0 ? `Trying: ${dictAttempts[dictAttempts.length - 1]}...` : 'Initializing dictionary...'}
                </motion.text>
                <motion.rect
                  x="100" y="210" width="340" height="3" rx="1.5"
                  fill="var(--text-primary)" opacity="0.3"
                  animate={{ scaleX: [0, lookupProgress] }}
                  style={{ transformOrigin: 'left' }}
                  transition={{ duration: 0.1 }}
                />
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {crackStatus === 'rainbow' && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={trans}
              >
                <rect x="60" y="160" width="420" height="50" rx="8" fill="var(--bg-card)" stroke="currentColor" strokeWidth="1.5" />
                <motion.text
                  x="270" y="185" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  RAINBOW TABLE MATCH FOUND
                </motion.text>
                <text x="270" y="203" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">Hash reversed in 0.003s</text>
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {crackStatus === 'secure' && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={trans}
              >
                <rect x="60" y="160" width="420" height="50" rx="8" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
                <motion.text
                  x="270" y="182" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {algo === 'BCRYPT' ? 'ADAPTIVE WORK FACTOR RESISTS GPU ATTACKS' : 'SALTED HASH PREVENTS RAINBOW TABLE REVERSAL'}
                </motion.text>
                <text x="270" y="203" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">No match found in dictionary</text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <div className="flex items-center justify-between gap-2">
        <motion.button
          id="hash-btn-crack"
          type="button"
          onClick={runCrackAttempt}
          disabled={crackStatus !== 'idle'}
          className="px-4 py-2 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black font-bold text-xs uppercase transition-all duration-300 cursor-pointer border border-[#111111] dark:border-white disabled:opacity-40"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ATTEMPT CRACK
        </motion.button>
        <span className="text-xs font-mono text-[#888888] dark:text-[#777777]">
          {crackStatus === 'idle' ? 'Ready to attempt hash cracking' : crackStatus === 'dict_lookup' ? 'Dictionary lookup in progress...' : crackStatus === 'rainbow' ? 'Rainbow table match found' : 'Hash is secure against cracking'}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={trans}
        className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-xs"
      >
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

        <motion.code
          className="block p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs sm:text-sm font-mono text-[#333333] dark:text-[#B5B5B5] break-all leading-relaxed font-bold"
          key={`hash-${key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={trans}
        >
          {hashResult}
        </motion.code>
      </motion.div>
    </div>
  );
}
