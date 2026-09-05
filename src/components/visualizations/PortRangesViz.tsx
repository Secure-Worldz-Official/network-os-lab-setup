import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Lock, Radio } from 'lucide-react';

interface PresetPort {
  port: number;
  name: string;
  category: 'System (0-1023)' | 'Registered (1024-49151)' | 'Dynamic (49152-65535)';
  protocol: 'TCP' | 'UDP' | 'TCP/UDP';
  status: 'Encrypted' | 'Plaintext' | 'Core Infra';
  description: string;
  command: string;
}

const PRESET_PORTS: PresetPort[] = [
  {
    port: 22,
    name: 'SSH (Secure Shell)',
    category: 'System (0-1023)',
    protocol: 'TCP',
    status: 'Encrypted',
    description: 'Encrypted remote terminal access and SFTP file transfer.',
    command: 'ssh user@10.10.20.15 -p 22'
  },
  {
    port: 53,
    name: 'DNS (Domain Name System)',
    category: 'System (0-1023)',
    protocol: 'UDP',
    status: 'Core Infra',
    description: 'Resolves human domain names (example.com) to IPv4/IPv6 addresses.',
    command: 'dig @8.8.8.8 example.com +short'
  },
  {
    port: 80,
    name: 'HTTP (Web Traffic)',
    category: 'System (0-1023)',
    protocol: 'TCP',
    status: 'Plaintext',
    description: 'Unencrypted web HTTP traffic. Transmits credentials in plaintext.',
    command: 'curl -v http://10.10.20.15'
  },
  {
    port: 443,
    name: 'HTTPS (HTTP over TLS)',
    category: 'System (0-1023)',
    protocol: 'TCP',
    status: 'Encrypted',
    description: 'Encrypted web application traffic using TLS 1.3 certificates.',
    command: 'curl -v https://10.10.20.15'
  },
  {
    port: 3306,
    name: 'MySQL Database',
    category: 'Registered (1024-49151)',
    protocol: 'TCP',
    status: 'Encrypted',
    description: 'Relational database management system listener socket.',
    command: 'mysql -u root -p -h 10.10.20.15 -P 3306'
  },
  {
    port: 3389,
    name: 'RDP (Remote Desktop)',
    category: 'Registered (1024-49151)',
    protocol: 'TCP',
    status: 'Encrypted',
    description: 'Windows Remote Desktop Graphical User Interface access.',
    command: 'xfreerdp /v:10.10.20.15 /u:Administrator'
  }
];

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

type AnimMode = 'idle' | 'handshake' | 'dns';

export function PortRangesViz() {
  const [selectedPort, setSelectedPort] = useState<PresetPort>(PRESET_PORTS[0]);
  const [activeProto, setActiveProto] = useState<'TCP' | 'UDP'>('TCP');
  const [animMode, setAnimMode] = useState<AnimMode>('idle');
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [dnsStep, setDnsStep] = useState(0);
  const rafRef = useRef<number>(0);

  const runHandshake = () => {
    setAnimMode('handshake');
    setHandshakeStep(0);
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const step = Math.floor(elapsed / 600);
      setHandshakeStep(Math.min(step, 3));
      if (step < 3) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setAnimMode('idle'), 1000);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const runDns = () => {
    setAnimMode('dns');
    setDnsStep(0);
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const step = Math.floor(elapsed / 500);
      setDnsStep(Math.min(step, 3));
      if (step < 3) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setAnimMode('idle'), 1000);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div className="space-y-5 font-mono select-none w-full">
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase shrink-0">
            COMMON PORTS:
          </span>
          {PRESET_PORTS.map((p) => {
            const isActive = selectedPort.port === p.port;
            return (
              <button
                key={p.port}
                id={`port-preset-${p.port}`}
                type="button"
                onClick={() => setSelectedPort(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {p.port}
              </button>
            );
          })}
        </div>

        <div className="flex gap-1.5 shrink-0">
          {(['TCP', 'UDP'] as const).map((proto) => (
            <button
              key={proto}
              id={`port-proto-${proto.toLowerCase()}`}
              type="button"
              onClick={() => setActiveProto(proto)}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border ${
                activeProto === proto
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                  : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A]'
              }`}
            >
              {proto}
            </button>
          ))}
          <button
            id="port-run-handshake"
            type="button"
            onClick={runHandshake}
            disabled={animMode !== 'idle'}
            className="px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border bg-white dark:bg-[#1C1C1C] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white disabled:opacity-40"
          >
            HANDSHAKE
          </button>
          <button
            id="port-run-dns"
            type="button"
            onClick={runDns}
            disabled={animMode !== 'idle'}
            className="px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border bg-white dark:bg-[#1C1C1C] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white disabled:opacity-40"
          >
            DNS LOOKUP
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[300px] shadow-sm">
        <svg viewBox="0 0 600 280" aria-label="Network port ranges timeline" className="w-full max-h-[300px]">
          <line x1="25" y1="45" x2="575" y2="45" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="25" y="32" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">0</text>
          <text x="575" y="32" fontSize="10" fontFamily="monospace" fill="var(--text-muted)" textAnchor="end">65535</text>

          {(() => {
            let posX = 25;
            if (selectedPort.port <= 1023) {
              posX = 25 + (selectedPort.port / 1023) * 165;
            } else if (selectedPort.port <= 49151) {
              posX = 205 + ((selectedPort.port - 1024) / 48127) * 190;
            } else {
              posX = 410 + ((selectedPort.port - 49152) / 16383) * 165;
            }
            return (
              <motion.g
                animate={{ opacity: [0, 1] }}
                transition={trans}
                transform={`translate(${Math.min(Math.max(posX, 28), 570)}, 22)`}
              >
                <line x1="0" y1="0" x2="0" y2="34" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                <circle cx="0" cy="23" r="6" fill="var(--text-primary)" />
              </motion.g>
            );
          })()}

          {animMode === 'handshake' && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={trans}
            >
              <rect x="100" y="80" width="400" height="150" rx="10" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="300" y="105" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-muted)" fontWeight="800">TCP 3-WAY HANDSHAKE</text>

              {handshakeStep >= 0 && (
                <motion.g initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={trans}>
                  <rect x="140" y="120" width="80" height="35" rx="6" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
                  <text x="180" y="142" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="700">CLIENT</text>
                </motion.g>
              )}
              {handshakeStep >= 1 && (
                <motion.g initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={trans}>
                  <rect x="380" y="120" width="80" height="35" rx="6" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
                  <text x="420" y="142" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="700">SERVER</text>
                </motion.g>
              )}

              {handshakeStep >= 0 && (
                <motion.text
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  x="300" y="145" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                >
                  SYN → Seq=100
                </motion.text>
              )}
              {handshakeStep >= 1 && (
                <motion.text
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  x="300" y="165" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                >
                  SYN-ACK ← Seq=300 Ack=101
                </motion.text>
              )}
              {handshakeStep >= 2 && (
                <motion.text
                  animate={{ opacity: [0, 1] }}
                  transition={trans}
                  x="300" y="185" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                >
                  ACK → Ack=301 [ESTABLISHED]
                </motion.text>
              )}
              {handshakeStep >= 3 && (
                <motion.text
                  animate={{ opacity: [0, 1] }}
                  transition={trans}
                  x="300" y="205" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)" fontWeight="700"
                >
                  Connection State: ESTABLISHED
                </motion.text>
              )}
            </motion.g>
          )}

          {animMode === 'dns' && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={trans}
            >
              <rect x="100" y="80" width="400" height="150" rx="10" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="1.5" />
              <text x="300" y="105" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-muted)" fontWeight="800">DNS RESOLUTION SEQUENCE</text>

              {dnsStep >= 0 && (
                <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={trans}>
                  <circle cx="180" cy="150" r="25" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
                  <text x="180" y="155" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800">CLIENT</text>
                </motion.g>
              )}
              {dnsStep >= 1 && (
                <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={trans}>
                  <circle cx="300" cy="130" r="25" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
                  <text x="300" y="135" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800">DNS</text>
                </motion.g>
              )}
              {dnsStep >= 2 && (
                <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={trans}>
                  <circle cx="420" cy="150" r="25" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
                  <text x="420" y="155" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800">AUTH</text>
                </motion.g>
              )}

              {dnsStep >= 0 && (
                <motion.path
                  d="M 205 150 L 275 140"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="1.5"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  strokeDasharray="4 4"
                />
              )}
              {dnsStep >= 1 && (
                <motion.path
                  d="M 325 135 L 395 150"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="1.5"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  strokeDasharray="4 4"
                />
              )}

              {dnsStep >= 2 && (
                <motion.text
                  animate={{ opacity: [0, 1] }}
                  transition={trans}
                  x="300" y="195" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                >
                  example.com → 93.184.216.34
                </motion.text>
              )}
            </motion.g>
          )}

          {animMode === 'idle' && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={trans}
            >
              <text x="300" y="160" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-muted)" fontWeight="600">
                Select a port and run HANDSHAKE or DNS LOOKUP
              </text>
            </motion.g>
          )}
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={trans}
        className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs font-mono"
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            {selectedPort.status === 'Encrypted' ? <Lock size={16} /> : <Radio size={16} />}
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              PORT {selectedPort.port} — {selectedPort.name}
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white uppercase">
            {selectedPort.category}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
          {selectedPort.description}
        </p>

        <div className="p-3.5 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <Terminal size={14} className="text-[#888888] shrink-0" />
            <code className="text-[#111111] dark:text-white font-mono text-xs truncate font-bold">
              {selectedPort.command}
            </code>
          </div>
          <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase shrink-0">
            {selectedPort.protocol} SOCKET
          </span>
        </div>
      </motion.div>
    </div>
  );
}
