import { useState, useEffect } from 'react';
import { Layers, Play, Pause, ArrowDown, ArrowUp } from 'lucide-react';

interface OsiLayerInfo {
  num: number;
  name: string;
  pdu: string;
  desc: string;
  protocols: string[];
  securityControls: string;
}

const OSI_LAYERS: OsiLayerInfo[] = [
  { num: 7, name: 'APPLICATION', pdu: 'Data', desc: 'Provides network services directly to end-user applications.', protocols: ['HTTP/HTTPS', 'DNS', 'SSH', 'FTP', 'SMTP'], securityControls: 'WAF (Web Application Firewall), Input Sanitization' },
  { num: 6, name: 'PRESENTATION', pdu: 'Data', desc: 'Translates, encrypts, and compresses data formats.', protocols: ['TLS 1.3', 'SSL', 'JPEG', 'ASCII'], securityControls: 'TLS Encryption, Payload Serialization Audits' },
  { num: 5, name: 'SESSION', pdu: 'Data', desc: 'Establishes, maintains, and terminates authentication sessions.', protocols: ['NetBIOS', 'RPC', 'PPTP', 'SOCKS'], securityControls: 'Session Token Expiration, Cookie HttpOnly Flags' },
  { num: 4, name: 'TRANSPORT', pdu: 'Segment / Datagram', desc: 'Manages end-to-end connection reliability and port addressing.', protocols: ['TCP', 'UDP'], securityControls: 'Stateful Firewall Inspection, Port Scanning Controls' },
  { num: 3, name: 'NETWORK', pdu: 'Packet', desc: 'Handles logical IP address routing across network subnets.', protocols: ['IPv4', 'IPv6', 'ICMP', 'IPsec'], securityControls: 'IP Sec Gateways, ACL Routers, Anti-Spoofing' },
  { num: 2, name: 'DATA LINK', pdu: 'Frame', desc: 'Transfers frames between adjacent nodes using physical MAC addresses.', protocols: ['Ethernet', 'Wi-Fi 802.11', 'ARP', 'VLAN'], securityControls: 'MAC Filtering, Dynamic ARP Inspection, Port Security' },
  { num: 1, name: 'PHYSICAL', pdu: 'Bit Stream', desc: 'Transmits raw electrical, optical, or radio signals.', protocols: ['Ethernet Cables', 'Fiber Optics', 'Radio Waves'], securityControls: 'Physical Cable Shields, Faraday Rooms, Air-Gapping' }
];

export function OsiLayerViz() {
  const [selectedLayerNum, setSelectedLayerNum] = useState<number>(7);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const selectedLayer = OSI_LAYERS.find((l) => l.num === selectedLayerNum) || OSI_LAYERS[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSelectedLayerNum((prev) => {
        if (direction === 'down') {
          return prev === 1 ? 7 : prev - 1;
        } else {
          return prev === 7 ? 1 : prev + 1;
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, direction]);

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Interactive Controls Toolbar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase shrink-0">
            SELECT LAYER:
          </span>
          {OSI_LAYERS.map((l) => {
            const isActive = selectedLayerNum === l.num;
            return (
              <button
                key={l.num}
                id={`osi-layer-btn-${l.num}`}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedLayerNum(l.num);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                L{l.num}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="osi-toggle-direction"
            type="button"
            onClick={() => setDirection(direction === 'down' ? 'up' : 'down')}
            className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors flex items-center gap-1 text-xs font-bold uppercase cursor-pointer"
            title="Toggle Encapsulation / Decapsulation direction"
          >
            {direction === 'down' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
            <span className="hidden sm:inline">{direction === 'down' ? 'ENCAP ↓' : 'DECAP ↑'}</span>
          </button>
          <button
            id="osi-toggle-play"
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors cursor-pointer"
            title={isPlaying ? 'Pause auto-descent' : 'Play auto-descent'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {/* SVG Layer Stack Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[350px] shadow-sm">
        <svg viewBox="0 0 540 340" aria-label="OSI 7-layer model stack" className="w-full max-h-[350px]">
          {OSI_LAYERS.map((layer, idx) => {
            const y = 12 + idx * 45;
            const isSelected = layer.num === selectedLayerNum;
            return (
              <g
                key={layer.num}
                className="cursor-pointer"
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedLayerNum(layer.num);
                }}
              >
                {/* Layer Number Badge */}
                <rect
                  x="15" y={y} width="44" height="38" rx="8"
                  fill="var(--bg-subtle)"
                  stroke={isSelected ? 'currentColor' : 'var(--border)'}
                  strokeWidth={isSelected ? '2.5' : '1'}
                />
                <text x="37" y={y + 24} textAnchor="middle" fontSize="13" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">
                  L{layer.num}
                </text>

                {/* Layer Title Bar */}
                <rect
                  x="68" y={y} width="240" height="38" rx="8"
                  fill={isSelected ? 'var(--bg-card)' : 'var(--bg-card)'}
                  stroke={isSelected ? 'currentColor' : 'var(--border)'}
                  strokeWidth={isSelected ? '2.5' : '1'}
                />
                <text x="84" y={y + 24} fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight={isSelected ? '900' : '700'}>
                  {layer.name}
                </text>

                {/* Layer PDU / Protocol Bar */}
                <rect
                  x="316" y={y} width="210" height="38" rx="8"
                  fill="var(--bg-surface)"
                  stroke={isSelected ? 'currentColor' : 'var(--border-subtle)'}
                  strokeWidth={isSelected ? '2' : '1'}
                />
                <text x="330" y={y + 24} fontSize="11" fontFamily="monospace" fill="var(--text-secondary)">
                  PDU: {layer.pdu}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Layer Detail Inspector */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Layers size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              LAYER {selectedLayer.num}: {selectedLayer.name} — ({selectedLayer.pdu})
            </span>
          </div>
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase font-mono">
            {direction === 'down' ? 'ENCAPSULATING ↓' : 'DECAPSULATING ↑'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
          {selectedLayer.desc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">COMMON PROTOCOLS</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedLayer.protocols.map((p, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-[#222222] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-bold font-mono text-[#111111] dark:text-white">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">SECURITY CONTROLS</span>
            <p className="text-xs font-sans text-[#111111] dark:text-white leading-relaxed">
              {selectedLayer.securityControls}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
