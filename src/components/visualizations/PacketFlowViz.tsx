import { useEffect, useRef, useState } from 'react';

interface Node {
  label: string;
  sublabel?: string;
  x: number;
  y: number;
}

interface PacketFlowVizProps {
  nodes?: Node[];
  caption?: string;
  showWall?: boolean;
}

const DEFAULT_NODES: Node[] = [
  { label: 'YOUR DEVICE', sublabel: '192.168.1.2', x: 40,  y: 90 },
  { label: 'ROUTER',      sublabel: 'NAT Gateway',  x: 230, y: 90 },
  { label: 'INTERNET',    sublabel: 'Global WAN',   x: 420, y: 90 },
];

/**
 * PacketFlowViz — generic animated left-to-right packet flow.
 * Configurable nodes. Packet dot travels between nodes in a loop.
 * Used for Day 3 (network path), Day 8 (lab isolation), and any networking topic.
 */
export function PacketFlowViz({ nodes = DEFAULT_NODES, showWall = false }: PacketFlowVizProps) {
  const [packetPos, setPacketPos] = useState({ x: nodes[0].x + 75, y: nodes[0].y + 35 });
  const [activeSeg, setActiveSeg] = useState(0);
  const rafRef  = useRef<number>(0);
  const segRef  = useRef(0);

  useEffect(() => {
    let segStart: number | null = null;
    const SEG_DUR = 1000; // ms per segment

    const tick = (ts: number) => {
      if (segStart === null) segStart = ts;
      const elapsed = ts - segStart;
      const t = Math.min(elapsed / SEG_DUR, 1);

      const seg = segRef.current % (nodes.length - 1);
      const from = nodes[seg];
      const to   = nodes[seg + 1];

      const x = (from.x + 75) + t * ((to.x - 10) - (from.x + 75));
      const y = from.y + 35;
      setPacketPos({ x, y });

      if (t >= 1) {
        segStart = null;
        segRef.current++;
        setActiveSeg(segRef.current % (nodes.length - 1));
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [nodes]);

  const H = 260;
  const W = 600;

  return (
    <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[300px] shadow-sm select-none font-mono">
      <svg viewBox={`0 0 ${W} ${H}`} aria-label="Network packet flow animation" className="w-full max-h-[300px]">
        <defs>
          <marker id="pf-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--text-muted)" />
          </marker>
        </defs>

        {/* Connection lines */}
        {nodes.slice(0, -1).map((from, i) => {
          const to = nodes[i + 1];
          const isActive = activeSeg === i;
          return (
            <line key={i}
              x1={from.x + 140} y1={from.y + 35}
              x2={to.x - 10}    y2={to.y + 35}
              stroke={isActive ? 'var(--text-primary)' : 'var(--border-bright)'}
              strokeWidth={isActive ? '2.5' : '1.5'}
              strokeDasharray={isActive ? 'none' : '5 4'}
              markerEnd="url(#pf-arrow)"
              style={{ transition: 'stroke 0.3s ease' }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <rect x={node.x} y={node.y} width="145" height="70" rx="10"
              fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2"
              style={{ transition: 'stroke 0.3s ease' }}
            />
            <text x={node.x + 72} y={node.y + 32} textAnchor="middle" fontSize="12"
              fontFamily="monospace" fill="var(--text-primary)" fontWeight="800">{node.label}</text>
            {node.sublabel && (
              <text x={node.x + 72} y={node.y + 50} textAnchor="middle" fontSize="10"
                fontFamily="monospace" fill="var(--text-muted)">{node.sublabel}</text>
            )}
            <circle cx={node.x + 16} cy={node.y + 16} r="4" fill="var(--text-primary)" opacity="0.6" />
          </g>
        ))}

        {/* Optional wall barrier */}
        {showWall && (
          <g>
            <line x1="300" y1="30" x2="300" y2="230" stroke="var(--border-bright)" strokeWidth="2.5" strokeDasharray="8 4" />
            <text x="305" y="25" fontSize="10" fontFamily="monospace" fill="var(--text-muted)" fontWeight="800">FIREWALL</text>
          </g>
        )}

        {/* Animated packet — professional data capsule (no flying balls) */}
        <g>
          <rect
            x={packetPos.x - 18} y={packetPos.y - 12}
            width="36" height="22" rx="4"
            fill="var(--text-primary)" opacity="0.95"
          />
          <text x={packetPos.x} y={packetPos.y + 3} textAnchor="middle" fontSize="9"
            fontFamily="monospace" fill="var(--bg-base)" fontWeight="800">PKT</text>
        </g>
      </svg>
    </div>
  );
}
