import { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Activity } from 'lucide-react';

type Phase = 'syn' | 'syn-ack' | 'ack' | 'data' | 'fin';

const PHASES: Phase[] = ['syn', 'syn-ack', 'ack', 'data', 'fin'];

const PHASE_DETAILS: Record<Phase, {
  label: string;
  sublabel: string;
  dir: 'right' | 'left';
  desc: string;
  flags: { syn: boolean; ack: boolean; fin: boolean; psh: boolean };
  seq: number;
  ackNum: number;
  win: number;
}> = {
  syn: {
    label: '1. SYN (Synchronize)',
    sublabel: 'Client → Server',
    dir: 'right',
    desc: 'Client initiates connection request with an Initial Sequence Number (ISN=100).',
    flags: { syn: true, ack: false, fin: false, psh: false },
    seq: 100,
    ackNum: 0,
    win: 64240
  },
  'syn-ack': {
    label: '2. SYN-ACK',
    sublabel: 'Server → Client',
    dir: 'left',
    desc: 'Server acknowledges client ISN (Ack=101) and sends its own ISN (Seq=300).',
    flags: { syn: true, ack: true, fin: false, psh: false },
    seq: 300,
    ackNum: 101,
    win: 65535
  },
  ack: {
    label: '3. ACK (Established)',
    sublabel: 'Client → Server',
    dir: 'right',
    desc: 'Client acknowledges server ISN (Ack=301). Connection state becomes ESTABLISHED.',
    flags: { syn: false, ack: true, fin: false, psh: false },
    seq: 101,
    ackNum: 301,
    win: 64240
  },
  data: {
    label: '4. DATA Payload Stream',
    sublabel: 'Client → Server',
    dir: 'right',
    desc: 'Application data packets stream across the established socket layer.',
    flags: { syn: false, ack: true, fin: false, psh: true },
    seq: 101,
    ackNum: 301,
    win: 64240
  },
  fin: {
    label: '5. FIN-ACK Teardown',
    sublabel: 'Server → Client',
    dir: 'left',
    desc: 'Server sends FIN flag to close socket connection gracefully.',
    flags: { syn: false, ack: true, fin: true, psh: false },
    seq: 301,
    ackNum: 520,
    win: 65535
  }
};

export function TcpHandshakeViz() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const phase = PHASES[phaseIndex];
  const detail = PHASE_DETAILS[phase];

  useEffect(() => {
    if (!isPlaying) return;

    let startTime: number | null = null;
    const DURATION = 1800;

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      setProgress(t);

      if (t >= 1) {
        startTime = null;
        setPhaseIndex((prev) => (prev + 1) % PHASES.length);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, phaseIndex]);

  const handleNext = () => {
    setIsPlaying(false);
    setProgress(1);
    setPhaseIndex((prev) => (prev + 1) % PHASES.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setProgress(1);
    setPhaseIndex((prev) => (prev - 1 + PHASES.length) % PHASES.length);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhaseIndex(0);
    setProgress(0);
  };

  const clientX = 110;
  const serverX = 490;
  const lineY = 140;

  let packetX = clientX;
  if (detail.dir === 'right') packetX = clientX + progress * (serverX - clientX - 40);
  else packetX = serverX - progress * (serverX - clientX - 40);

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Interactive Control Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {PHASES.map((p, idx) => {
            const isActive = phaseIndex === idx;
            return (
              <button
                key={p}
                id={`tcp-step-${p}`}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setPhaseIndex(idx);
                  setProgress(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                0{idx + 1}. {p.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="tcp-btn-prev"
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            id="tcp-btn-play-pause"
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Animation' : 'Play Animation'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            id="tcp-btn-next"
            type="button"
            onClick={handleNext}
            className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors cursor-pointer"
            title="Next Step"
          >
            <ChevronRight size={16} />
          </button>
          <button
            id="tcp-btn-reset"
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#888888] hover:text-[#111111] dark:hover:text-white transition-colors cursor-pointer"
            title="Reset to Step 1"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Large Centerpiece Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[340px] shadow-sm">
        <svg viewBox="0 0 600 280" aria-label="TCP three-way handshake animation" className="w-full max-h-[340px]">
          {/* Client Node */}
          <rect x="30" y="90" width="160" height="90" rx="12" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="110" y="125" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">CLIENT HOST</text>
          <text x="110" y="145" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">192.168.1.10</text>
          <text x="110" y="163" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">PORT: 54321</text>

          {/* Server Node */}
          <rect x="410" y="90" width="160" height="90" rx="12" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="490" y="125" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">TARGET SERVER</text>
          <text x="490" y="145" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">10.10.20.15</text>
          <text x="490" y="163" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">PORT: 80 (HTTP)</text>

          {/* Connection Line */}
          <line x1={clientX + 80} y1={lineY} x2={serverX - 80} y2={lineY} stroke="var(--border)" strokeWidth="2" strokeDasharray="6 4" />

          {/* Moving Packet — professional data capsule (no flying balls) */}
          <g>
            <rect
              x={packetX - 22} y={lineY - 13}
              width="44" height="24" rx="5"
              fill="var(--text-primary)" opacity="0.95"
            />
            <text x={packetX} y={lineY + 4} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--bg-base)" fontWeight="900">
              {detail.label.split(' ')[1]}
            </text>
          </g>

          {/* Direction Indicator Arrow */}
          <path
            d={detail.dir === 'right' ? 'M 250 135 L 350 135 L 342 129 M 350 135 L 342 141' : 'M 350 135 L 250 135 L 258 129 M 250 135 L 258 141'}
            stroke="var(--text-primary)"
            strokeWidth="2.5"
            strokeOpacity="0.6"
            fill="none"
          />

          {/* Phase Description */}
          <text x="300" y="240" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-secondary)" fontWeight="600">
            {detail.desc}
          </text>
        </svg>
      </div>

      {/* TCP Flag Inspector Panel */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Activity size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              TCP HEADER INSPECTOR — {detail.label}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            ● {detail.sublabel}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] block font-bold">SEQ NUMBER</span>
            <span className="font-extrabold text-sm text-[#111111] dark:text-white font-mono">{detail.seq}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] block font-bold">ACK NUMBER</span>
            <span className="font-extrabold text-sm text-[#111111] dark:text-white font-mono">{detail.ackNum}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] block font-bold">WINDOW SIZE</span>
            <span className="font-extrabold text-sm text-[#111111] dark:text-white font-mono">{detail.win}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] block font-bold mb-1">ACTIVE FLAGS</span>
            <div className="flex gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${detail.flags.syn ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>SYN</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${detail.flags.ack ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>ACK</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${detail.flags.fin ? 'bg-rose-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>FIN</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${detail.flags.psh ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>PSH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
