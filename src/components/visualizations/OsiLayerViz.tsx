import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Play, Pause, ArrowDown, ArrowUp } from 'lucide-react';

interface OsiLayerInfo {
  num: number;
  name: string;
  pdu: string;
  desc: string;
  protocols: string[];
  securityControls: string;
  headerSize: number;
}

const OSI_LAYERS: OsiLayerInfo[] = [
  { num: 7, name: 'APPLICATION', pdu: 'Data', desc: 'Provides network services directly to end-user applications (HTTP, DNS, SSH).', protocols: ['HTTP/HTTPS', 'DNS', 'SSH', 'FTP', 'SMTP'], securityControls: 'WAF, Input Sanitization', headerSize: 0 },
  { num: 6, name: 'PRESENTATION', pdu: 'Data', desc: 'Translates, encrypts, and compresses data formats using TLS 1.3.', protocols: ['TLS 1.3', 'SSL', 'JPEG', 'ASCII'], securityControls: 'TLS Encryption, Payload Serialization Audits', headerSize: 20 },
  { num: 5, name: 'SESSION', pdu: 'Data', desc: 'Establishes, maintains, and terminates authentication sessions.', protocols: ['NetBIOS', 'RPC', 'PPTP', 'SOCKS'], securityControls: 'Session Token Expiration, HttpOnly Flags', headerSize: 16 },
  { num: 4, name: 'TRANSPORT', pdu: 'Segment', desc: 'Manages end-to-end connection reliability via TCP with port addressing.', protocols: ['TCP', 'UDP'], securityControls: 'Stateful Firewall Inspection, Port Scanning Controls', headerSize: 24 },
  { num: 3, name: 'NETWORK', pdu: 'Packet', desc: 'Handles logical IP address routing across network subnets via IPv4/IPv6.', protocols: ['IPv4', 'IPv6', 'ICMP', 'IPsec'], securityControls: 'IP Sec Gateways, ACL Routers, Anti-Spoofing', headerSize: 24 },
  { num: 2, name: 'DATA LINK', pdu: 'Frame', desc: 'Transfers frames between adjacent nodes using physical MAC addresses.', protocols: ['Ethernet', 'Wi-Fi 802.11', 'ARP', 'VLAN'], securityControls: 'MAC Filtering, Dynamic ARP Inspection, Port Security', headerSize: 18 },
  { num: 1, name: 'PHYSICAL', pdu: 'Bits', desc: 'Transmits raw electrical, optical, or radio signals over physical medium.', protocols: ['Ethernet Cables', 'Fiber Optics', 'Radio Waves'], securityControls: 'Physical Cable Shields, Faraday Rooms, Air-Gapping', headerSize: 0 }
];

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

export function OsiLayerViz() {
  const [selectedLayerNum, setSelectedLayerNum] = useState<number>(7);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [packetProgress, setPacketProgress] = useState(0);
  const [packetVisible, setPacketVisible] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const animRef = useRef<number>(0);

  const selectedLayer = OSI_LAYERS.find((l) => l.num === selectedLayerNum) || OSI_LAYERS[0];

  const runPacketAnimation = () => {
    setPacketVisible(true);
    setPacketProgress(0);
    setHeaders([]);

    const DURATION = 2500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      setPacketProgress(t);

      if (direction === 'down') {
        const totalLayers = 7;
        const currentLayerIdx = Math.floor(t * totalLayers);
        const newHeaders: string[] = [];
        for (let i = 0; i <= Math.min(currentLayerIdx, 6); i++) {
          if (OSI_LAYERS[i].headerSize > 0) {
            newHeaders.push(`${OSI_LAYERS[i].name}_HDR`);
          }
        }
        setHeaders(newHeaders);
      }

      if (t >= 1) {
        setPacketVisible(false);
      } else {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  };

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
      runPacketAnimation();
    }, 2200);
    return () => clearInterval(interval);
  }, [isPlaying, direction]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const getPacketY = () => {
    const svgTop = 12;
    const svgBottom = 320;
    const range = svgBottom - svgTop;
    if (direction === 'down') {
      return svgTop + packetProgress * range;
    } else {
      return svgBottom - packetProgress * range;
    }
  };

  const getPacketX = () => {
    const svgCenterX = 490;
    const isRight = direction === 'down';
    const offset = (isRight ? 1 : -1) * 50;
    return svgCenterX + offset + Math.sin(packetProgress * Math.PI) * 40;
  };

  return (
    <div className="space-y-5 font-mono select-none w-full">
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
                onClick={() => { setIsPlaying(false); setSelectedLayerNum(l.num); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer border shrink-0 ${
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
            className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors duration-300 flex items-center gap-1 text-xs font-bold uppercase cursor-pointer"
          >
            {direction === 'down' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
            <span className="hidden sm:inline">{direction === 'down' ? 'ENCAP' : 'DECAP'}</span>
          </button>
          <button
            id="osi-toggle-play"
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors duration-300 cursor-pointer"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[400px] shadow-sm">
        <svg viewBox="0 0 540 400" aria-label="OSI 7-layer model with packet encapsulation" className="w-full max-h-[400px]">
          {OSI_LAYERS.map((layer, idx) => {
            const y = 12 + idx * 45;
            const isSelected = layer.num === selectedLayerNum;
            return (
              <motion.g
                key={layer.num}
                animate={{ opacity: isSelected ? 1 : 0.55 }}
                transition={trans}
                style={{ cursor: 'pointer' }}
                onClick={() => { setIsPlaying(false); setSelectedLayerNum(layer.num); }}
              >
                <motion.rect
                  x="15" y={y} width="44" height="38" rx="8"
                  fill="var(--bg-subtle)"
                  stroke={isSelected ? 'currentColor' : 'var(--border)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  animate={{ stroke: isSelected ? 'currentColor' : 'var(--border)', strokeWidth: isSelected ? 2.5 : 1 }}
                  transition={trans}
                />
                <text x="37" y={y + 24} textAnchor="middle" fontSize="13" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">
                  L{layer.num}
                </text>

                <motion.rect
                  x="68" y={y} width="240" height="38" rx="8"
                  fill={isSelected ? 'var(--bg-card)' : 'var(--bg-card)'}
                  stroke={isSelected ? 'currentColor' : 'var(--border)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  animate={{ stroke: isSelected ? 'currentColor' : 'var(--border)', strokeWidth: isSelected ? 2.5 : 1 }}
                  transition={trans}
                />
                <text x="84" y={y + 24} fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight={isSelected ? 900 : 700}>
                  {layer.name}
                </text>

                <motion.rect
                  x="316" y={y} width="210" height="38" rx="8"
                  fill="var(--bg-surface)"
                  stroke={isSelected ? 'currentColor' : 'var(--border-subtle)'}
                  strokeWidth={isSelected ? 2 : 1}
                  animate={{ stroke: isSelected ? 'currentColor' : 'var(--border-subtle)', strokeWidth: isSelected ? 2 : 1 }}
                  transition={trans}
                />
                <text x="330" y={y + 24} fontSize="11" fontFamily="monospace" fill="var(--text-secondary)">
                  PDU: {layer.pdu}
                </text>

                {layer.headerSize > 0 && (
                  <motion.text
                    x="535" y={y + 24}
                    textAnchor="end"
                    fontSize="9"
                    fontFamily="monospace"
                    fill="var(--text-muted)"
                    fontWeight="600"
                  >
                    +{layer.headerSize}B HDR
                  </motion.text>
                )}
              </motion.g>
            );
          })}

          <AnimatePresence>
            {packetVisible && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={trans}
              >
                <motion.rect
                  animate={{
                    x: getPacketX(),
                    y: getPacketY()
                  }}
                  transition={{ duration: 2.5, ease: easeOut }}
                  x={getPacketX()} y={getPacketY()}
                  width="44" height="22" rx="5"
                  fill="var(--text-primary)" opacity="0.9"
                />
                <motion.text
                  animate={{
                    x: getPacketX(),
                    y: getPacketY()
                  }}
                  transition={{ duration: 2.5, ease: easeOut }}
                  x={getPacketX() + 22} y={getPacketY() + 14}
                  textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--bg-base)" fontWeight="800"
                >
                  PKT
                </motion.text>

                {headers.length > 0 && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={trans}
                  >
                    <rect x="420" y={getPacketY() - 8} width="100" height="38" rx="5"
                      fill="var(--bg-surface)" stroke="var(--border-bright)" strokeWidth="1.5" />
                    <text x="470" y={getPacketY() + 2} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text-muted)" fontWeight="700">HEADERS</text>
                    {headers.slice(-2).map((h, i) => (
                      <text key={i} x="470" y={getPacketY() + 16 + i * 10} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="var(--text-secondary)">
                        {h}
                      </text>
                    ))}
                  </motion.g>
                )}
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.g
              key={`osi-legend-${direction}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={trans}
            >
              <rect x="150" y="370" width="240" height="20" rx="4" fill="var(--bg-subtle)" stroke="var(--border)" strokeWidth="1" />
              <text x="270" y="384" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)" fontWeight="700">
                {direction === 'down' ? '▼ ENCAPSULATION: Headers added per layer' : '▲ DECAPSULATION: Headers stripped per layer'}
              </text>
            </motion.g>
          </AnimatePresence>
        </svg>
      </div>

      <motion.div
        key={selectedLayerNum}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={trans}
        className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs"
      >
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
            <span className="text-[10px] uppercase font-bold text-[#555555] dark:text-[#888888] block">SECURITY CONTROLS</span>
            <p className="text-xs font-sans text-[#111111] dark:text-white leading-relaxed">
              {selectedLayer.securityControls}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
