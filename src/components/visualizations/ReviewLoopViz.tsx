import { useState, useEffect } from 'react';
import { Play, Pause, Terminal, CheckCircle2 } from 'lucide-react';

interface StepDetail {
  id: number;
  label: string;
  title: string;
  desc: string;
  command: string;
  expectedOutput: string;
}

const REVIEW_STEPS: StepDetail[] = [
  {
    id: 1,
    label: 'CONFIGURE',
    title: 'Lab Environment & Network Verification',
    desc: 'Verify VirtualBox host-only adapter settings and network interface binding on Kali Linux.',
    command: 'ip addr show eth0',
    expectedOutput: 'inet 192.168.56.101/24 brd 192.168.56.255 scope global eth0'
  },
  {
    id: 2,
    label: 'INSPECT',
    title: 'Socket States & Active Listening Ports',
    desc: 'Audit active TCP listening ports and associate process IDs using socket statistics.',
    command: 'sudo ss -tulpn | grep LISTEN',
    expectedOutput: 'tcp LISTEN 0 128 0.0.0.0:22 (sshd) | tcp LISTEN 0 80 0.0.0.0:80 (nginx)'
  },
  {
    id: 3,
    label: 'CAPTURE',
    title: 'Live Packet Sniffing & Display Filtering',
    desc: 'Initiate Wireshark packet capture and filter unencrypted HTTP and DNS queries.',
    command: 'tshark -i eth0 -f "tcp port 80" -c 5',
    expectedOutput: 'GET / HTTP/1.1 -> Host: example.com [200 OK]'
  },
  {
    id: 4,
    label: 'ISOLATE',
    title: 'Host-Only Lab Target Communication',
    desc: 'Confirm zero external internet routing on vulnerable target VM while preserving local ICMP probes.',
    command: 'ping -c 2 192.168.56.102 && ping -c 2 8.8.8.8',
    expectedOutput: '192.168.56.102: 0% packet loss | 8.8.8.8: Network unreachable (Isolated ✓)'
  }
];

export function ReviewLoopViz() {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const step = REVIEW_STEPS[activeStepIdx];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % REVIEW_STEPS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Step Selector & Play Control Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          {REVIEW_STEPS.map((s, idx) => {
            const isActive = activeStepIdx === idx;
            return (
              <button
                key={s.id}
                id={`review-step-${s.id}`}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStepIdx(idx);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                0{s.id}. {s.label}
              </button>
            );
          })}
        </div>

        <button
          id="review-toggle-play"
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          title={isPlaying ? 'Pause Cycle' : 'Play Cycle'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span className="hidden sm:inline text-xs font-bold uppercase">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>
      </div>

      {/* Circular Flow SVG Loop Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[300px] shadow-sm">
        <svg viewBox="0 0 540 280" aria-label="Foundation review cycle loop" className="w-full max-h-[300px]">
          {/* Connecting Track Circle */}
          <ellipse cx="270" cy="140" rx="190" ry="90" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 6" />

          {/* Core Hub */}
          <circle cx="270" cy="140" r="40" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="270" y="136" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">DAY 09</text>
          <text x="270" y="152" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">RECAP</text>

          {/* 4 Step Nodes placed along the ellipse */}
          {REVIEW_STEPS.map((s, idx) => {
            const isActive = activeStepIdx === idx;
            const angles = [Math.PI * 1.5, 0, Math.PI * 0.5, Math.PI];
            const angle = angles[idx];
            const nodeX = 270 + Math.cos(angle) * 190;
            const nodeY = 140 + Math.sin(angle) * 90;

            return (
              <g
                key={s.id}
                className="cursor-pointer"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStepIdx(idx);
                }}
              >
                <rect
                  x={nodeX - 65}
                  y={nodeY - 22}
                  width="130"
                  height="44"
                  rx="8"
                  fill="var(--bg-card)"
                  stroke={isActive ? 'currentColor' : 'var(--border)'}
                  strokeWidth={isActive ? '3' : '1.5'}
                />
                <text x={nodeX} y={nodeY - 4} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)" fontWeight="800">
                  STEP 0{s.id}
                </text>
                <text x={nodeX} y={nodeY + 12} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-primary)" fontWeight={isActive ? '900' : '600'}>
                  {s.label}
                </text>
                {isActive && <rect x={nodeX - 20} y={nodeY + 20} width="40" height="4" rx="2" fill="currentColor" opacity="0.9" />}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Step Terminal Inspector */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              CHECKPOINT 0{step.id}: {step.title}
            </span>
          </div>
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase font-mono">VERIFIED</span>
        </div>

        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
          {step.desc}
        </p>

        <div className="p-3.5 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#888888]">
            <Terminal size={14} />
            <span className="text-[10px] font-bold uppercase">COMMAND PROBE</span>
          </div>
          <code className="block text-[#111111] dark:text-white font-bold text-xs bg-white dark:bg-black p-2.5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A]">
            $ {step.command}
          </code>
          <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 block pt-1 font-mono">
            EXPECTED OUTPUT: {step.expectedOutput}
          </span>
        </div>
      </div>
    </div>
  );
}
