import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  tcpState: string;
}> = {
  syn: {
    label: '1. SYN (Synchronize)',
    sublabel: 'Client → Server',
    dir: 'right',
    desc: 'Client initiates connection with ISN=100. Server receives SYN and transitions to SYN-RCVD.',
    flags: { syn: true, ack: false, fin: false, psh: false },
    seq: 100, ackNum: 0, win: 64240,
    tcpState: 'SYN-SENT → SYN-RCVD'
  },
  'syn-ack': {
    label: '2. SYN-ACK',
    sublabel: 'Server → Client',
    dir: 'left',
    desc: 'Server acknowledges client ISN (Ack=101) and sends its own ISN (Seq=300).',
    flags: { syn: true, ack: true, fin: false, psh: false },
    seq: 300, ackNum: 101, win: 65535,
    tcpState: 'SYN-RCVD'
  },
  ack: {
    label: '3. ACK (Established)',
    sublabel: 'Client → Server',
    dir: 'right',
    desc: 'Client acknowledges server ISN (Ack=301). Connection state becomes ESTABLISHED.',
    flags: { syn: false, ack: true, fin: false, psh: false },
    seq: 101, ackNum: 301, win: 64240,
    tcpState: 'ESTABLISHED'
  },
  data: {
    label: '4. DATA Payload Stream',
    sublabel: 'Client → Server',
    dir: 'right',
    desc: 'Application data packets stream across the established socket with PSH flag.',
    flags: { syn: false, ack: true, fin: false, psh: true },
    seq: 101, ackNum: 301, win: 64240,
    tcpState: 'ESTABLISHED'
  },
  fin: {
    label: '5. FIN-ACK Teardown',
    sublabel: 'Server → Client',
    dir: 'left',
    desc: 'Graceful connection termination via FIN flag. Both sides confirm close.',
    flags: { syn: false, ack: true, fin: true, psh: false },
    seq: 301, ackNum: 520, win: 65535,
    tcpState: 'FIN-WAIT-1 → CLOSED'
  }
};

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

export function TcpHandshakeViz() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [tcpState, setTcpState] = useState('CLOSED');
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
      setTcpState(detail.tcpState);

      if (t >= 1) {
        startTime = null;
        setPhaseIndex((prev) => (prev + 1) % PHASES.length);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, phaseIndex, detail.tcpState]);

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
    setTcpState('CLOSED');
  };

  const clientX = 110;
  const serverX = 490;
  const lineY = 140;

  const easeProgress = 1 - Math.pow(1 - progress, 3);
  let packetX = clientX;
  if (detail.dir === 'right') {
    packetX = clientX + easeProgress * (serverX - clientX - 40);
  } else {
    packetX = serverX - easeProgress * (serverX - clientX - 40);
  }

  return (
    <div className="space-y-5 font-mono select-none w-full">
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
                  setTcpState(PHASE_DETAILS[p].tcpState);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border shrink-0 ${
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
          <button id="tcp-btn-prev" type="button" onClick={handlePrev} className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors duration-300 cursor-pointer">
            <ChevronLeft size={16} />
          </button>
          <button id="tcp-btn-play-pause" type="button" onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors duration-300 cursor-pointer">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button id="tcp-btn-next" type="button" onClick={handleNext} className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors duration-300 cursor-pointer">
            <ChevronRight size={16} />
          </button>
          <button id="tcp-btn-reset" type="button" onClick={handleReset} className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#888888] hover:text-[#111111] dark:hover:text-white transition-colors duration-300 cursor-pointer">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[340px] shadow-sm">
        <svg viewBox="0 0 600 280" aria-label="TCP three-way handshake state diagram" className="w-full max-h-[340px]">
          <motion.rect x="30" y="90" width="160" height="90" rx="12" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="110" y="125" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">CLIENT HOST</text>
          <text x="110" y="145" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">192.168.1.10</text>
          <text x="110" y="163" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">PORT: 54321</text>

          <motion.rect x="410" y="90" width="160" height="90" rx="12" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="490" y="125" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">TARGET SERVER</text>
          <text x="490" y="145" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">10.10.20.15</text>
          <text x="490" y="163" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">PORT: 80 (HTTP)</text>

          <line x1={clientX + 80} y1={lineY} x2={serverX - 80} y2={lineY} stroke="var(--border)" strokeWidth="2" strokeDasharray="6 4" />

          <motion.g animate={{ x: packetX - clientX }} transition={{ duration: 0.1 }}>
            <motion.rect
              x={packetX - 22} y={lineY - 13}
              width="44" height="24" rx="5"
              fill="var(--text-primary)" opacity="0.95"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <text x={packetX} y={lineY + 4} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--bg-base)" fontWeight="900">
              {detail.label.split(' ')[1]}
            </text>
          </motion.g>

          <motion.path
            d={detail.dir === 'right' ? 'M 250 135 L 350 135 L 342 129 M 350 135 L 342 141' : 'M 350 135 L 250 135 L 258 129 M 250 135 L 258 141'}
            stroke="var(--text-primary)"
            strokeWidth="2.5"
            strokeOpacity="0.6"
            fill="none"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          <motion.text
            x="300" y="240" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-secondary)" fontWeight="600"
            key={phase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={trans}
          >
            {detail.desc}
          </motion.text>

          <motion.g
            key={`state-${phaseIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={trans}
          >
            <rect x="220" y="250" width="160" height="20" rx="5" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="1.5" />
            <text x="300" y="264" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800">
              TCP STATE: {tcpState}
            </text>
          </motion.g>
        </svg>
      </div>

      <motion.div
        key={phaseIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={trans}
        className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Activity size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              TCP HEADER INSPECTOR — {detail.label}
            </span>
          </div>
          <span className="text-xs font-bold text-[#555555] dark:text-[#888888] font-mono">
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
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${detail.flags.syn ? 'bg-[#333333] text-white dark:bg-white dark:text-black' : 'bg-[#F0F0F0] dark:bg-[#222222] text-[#888888] dark:text-[#555555]'}`}>SYN</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${detail.flags.ack ? 'bg-[#333333] text-white dark:bg-white dark:text-black' : 'bg-[#F0F0F0] dark:bg-[#222222] text-[#888888] dark:text-[#555555]'}`}>ACK</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${detail.flags.fin ? 'bg-[#555555] text-white' : 'bg-[#F0F0F0] dark:bg-[#222222] text-[#888888] dark:text-[#555555]'}`}>FIN</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${detail.flags.psh ? 'bg-[#777777] text-white' : 'bg-[#F0F0F0] dark:bg-[#222222] text-[#888888] dark:text-[#555555]'}`}>PSH</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
