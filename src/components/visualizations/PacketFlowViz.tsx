import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
  label: string;
  sublabel: string;
  x: number;
  y: number;
  type: 'host' | 'router' | 'internet' | 'firewall';
}

interface PacketFlowVizProps {
  nodes?: Node[];
  caption?: string;
  showWall?: boolean;
}

const DEFAULT_NODES: Node[] = [
  { label: 'YOUR DEVICE', sublabel: '192.168.1.2', x: 40,  y: 90, type: 'host' },
  { label: 'ROUTER',      sublabel: 'NAT Gateway',  x: 230, y: 90, type: 'router' },
  { label: 'INTERNET',    sublabel: 'Global WAN',   x: 420, y: 90, type: 'internet' },
];

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

export function PacketFlowViz({ nodes = DEFAULT_NODES, showWall = false }: PacketFlowVizProps) {
  const [activeSeg, setActiveSeg] = useState(0);
  const [packetProgress, setPacketProgress] = useState(0);
  const [routingDecision, setRoutingDecision] = useState<string>('');
  const [showPacket, setShowPacket] = useState(false);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      setShowPacket(true);
      setPacketProgress(0);
      setRoutingDecision('');

      const DURATION = 1500;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / DURATION, 1);
        setPacketProgress(t);

        const seg = activeSeg;
        const to = nodes[seg + 1];
        void nodes[seg];

        if (t > 0.3 && t < 0.7) {
          if (to.type === 'router') {
            setRoutingDecision('ROUTING: NAT Translation');
          } else if (to.type === 'internet') {
            setRoutingDecision('ROUTING: Default Gateway → WAN');
          } else if (to.type === 'firewall') {
            setRoutingDecision('ROUTING: ACL Check');
          } else {
            setRoutingDecision('ROUTING: ARP Resolve → MAC');
          }
        }

        if (t >= 1) {
          setShowPacket(false);
          setRoutingDecision('');
          setActiveSeg((prev) => (prev + 1) % (nodes.length - 1));
        } else {
          animRef.current = requestAnimationFrame(tick);
        }
      };

      animRef.current = requestAnimationFrame(tick);
    };

    const interval = setInterval(animate, 2000);
    animate();

    return () => {
      clearInterval(interval);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [nodes, activeSeg]);

  const H = 260;
  const W = 600;

  const getPacketPos = () => {
    const from = nodes[activeSeg];
    const to = nodes[activeSeg + 1];
    if (!from || !to) return { x: 0, y: 0 };

    const x1 = from.x + 72;
    const y1 = from.y + 35;
    const x2 = to.x - 10;
    const y2 = to.y + 35;

    const t = packetProgress;
    const easedT = 1 - Math.pow(1 - t, 3);
    return {
      x: x1 + easedT * (x2 - x1),
      y: y1 + easedT * (y2 - y1)
    };
  };

  return (
    <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[300px] shadow-sm select-none font-mono">
      <svg viewBox={`0 0 ${W} ${H}`} aria-label="Network packet flow with routing" className="w-full max-h-[300px]">
        <defs>
          <marker id="pf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--text-muted)" />
          </marker>
        </defs>

        {nodes.slice(0, -1).map((from, i) => {
          const to = nodes[i + 1];
          const isActive = activeSeg === i;
          return (
            <motion.line
              key={i}
              x1={from.x + 72} y1={from.y + 35}
              x2={to.x - 10} y2={to.y + 35}
              stroke={isActive ? 'var(--text-primary)' : 'var(--border-bright)'}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeDasharray={isActive ? 'none' : '5 4'}
              markerEnd="url(#pf-arrow)"
              animate={{ stroke: isActive ? 'var(--text-primary)' : 'var(--border-bright)', strokeWidth: isActive ? 2.5 : 1.5 }}
              transition={trans}
            />
          );
        })}

        {nodes.map((node, i) => (
          <motion.g
            key={i}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            <rect x={node.x} y={node.y} width="145" height="70" rx="10"
              fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
            <text x={node.x + 72} y={node.y + 32} textAnchor="middle" fontSize="11"
              fontFamily="monospace" fill="var(--text-primary)" fontWeight="800">{node.label}</text>
            {node.sublabel && (
              <text x={node.x + 72} y={node.y + 50} textAnchor="middle" fontSize="10"
                fontFamily="monospace" fill="var(--text-muted)">{node.sublabel}</text>
            )}
            <circle cx={node.x + 16} cy={node.y + 16} r="4" fill="var(--text-primary)" opacity="0.6" />
          </motion.g>
        ))}

        {showWall && (
          <g>
            <line x1="300" y1="30" x2="300" y2="230" stroke="var(--border-bright)" strokeWidth="2.5" strokeDasharray="8 4" />
            <text x="305" y="25" fontSize="10" fontFamily="monospace" fill="var(--text-muted)" fontWeight="800">FIREWALL</text>
          </g>
        )}

        <AnimatePresence>
          {showPacket && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={trans}
            >
              {(() => {
                const pos = getPacketPos();
                return (
                  <>
                    <rect
                      x={pos.x - 18} y={pos.y - 12}
                      width="36" height="22" rx="4"
                      fill="var(--text-primary)" opacity="0.95"
                    />
                    <text x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize="9"
                      fontFamily="monospace" fill="var(--bg-base)" fontWeight="800">PKT</text>
                  </>
                );
              })()}
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {routingDecision && (
            <motion.g
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={trans}
            >
              <rect x="170" y="200" width="260" height="22" rx="5"
                fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="1.5" />
              <text x="300" y="215" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="700">
                {routingDecision}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
