import { useState } from 'react';
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

export function PortRangesViz() {
  const [selectedPort, setSelectedPort] = useState<PresetPort>(PRESET_PORTS[0]);
  const [activeProto, setActiveProto] = useState<'TCP' | 'UDP'>('TCP');

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Protocol Toggle & Port Preset Bar */}
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {p.port} ({p.name.split(' ')[0]})
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
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border ${
                activeProto === proto
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                  : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A]'
              }`}
            >
              {proto}
            </button>
          ))}
        </div>
      </div>

      {/* Large SVG Range Timeline Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[240px] shadow-sm">
        <svg viewBox="0 0 600 180" aria-label="Network port ranges timeline" className="w-full max-h-[220px]">
          {/* Timeline Axis */}
          <line x1="25" y1="45" x2="575" y2="45" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="25" y="32" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">0</text>
          <text x="575" y="32" fontSize="10" fontFamily="monospace" fill="var(--text-muted)" textAnchor="end">65535</text>

          {/* Segment 1: Well Known (0 - 1023) */}
          <g transform="translate(25, 60)">
            <rect
              x="0" y="0" width="165" height="80" rx="10"
              fill="var(--bg-card)"
              stroke={selectedPort.port <= 1023 ? 'currentColor' : 'var(--border)'}
              strokeWidth={selectedPort.port <= 1023 ? '3' : '1.5'}
            />
            <text x="82" y="26" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">SYSTEM (0–1023)</text>
            <text x="82" y="44" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">System Services</text>
            <text x="82" y="62" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-secondary)">SSH, HTTP, HTTPS, DNS</text>
          </g>

          {/* Segment 2: Registered (1024 - 49151) */}
          <g transform="translate(205, 60)">
            <rect
              x="0" y="0" width="190" height="80" rx="10"
              fill="var(--bg-card)"
              stroke={selectedPort.port >= 1024 && selectedPort.port <= 49151 ? 'currentColor' : 'var(--border)'}
              strokeWidth={selectedPort.port >= 1024 && selectedPort.port <= 49151 ? '3' : '1.5'}
            />
            <text x="95" y="26" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">REGISTERED (1024–49151)</text>
            <text x="95" y="44" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">Vendor Applications</text>
            <text x="95" y="62" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-secondary)">MySQL:3306, RDP:3389</text>
          </g>

          {/* Segment 3: Dynamic / Ephemeral (49152 - 65535) */}
          <g transform="translate(410, 60)">
            <rect
              x="0" y="0" width="165" height="80" rx="10"
              fill="var(--bg-card)"
              stroke={selectedPort.port >= 49152 ? 'currentColor' : 'var(--border)'}
              strokeWidth={selectedPort.port >= 49152 ? '3' : '1.5'}
            />
            <text x="82" y="26" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">DYNAMIC (49152–65535)</text>
            <text x="82" y="44" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">Ephemeral Sockets</text>
            <text x="82" y="62" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-secondary)">Auto Outbound Ports</text>
          </g>

          {/* Active Port Indicator Marker */}
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
              <g transform={`translate(${Math.min(Math.max(posX, 28), 570)}, 22)`}>
                <line x1="0" y1="0" x2="0" y2="34" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                <circle cx="0" cy="23" r="6" fill="var(--text-primary)" />
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Selected Port Inspector Card */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs font-mono">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            {selectedPort.status === 'Encrypted' ? <Lock size={16} className="text-emerald-500" /> : <Radio size={16} className="text-amber-500" />}
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
      </div>
    </div>
  );
}
