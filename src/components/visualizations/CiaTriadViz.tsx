import { useState, useEffect, useRef } from 'react';
import { Shield, Lock, CheckCircle2, Server, Play, Pause } from 'lucide-react';

type Pillar = 'C' | 'I' | 'A';

const PILLAR_DETAILS: Record<Pillar, { title: string; subtitle: string; description: string; controls: string[]; attack: string }> = {
  C: {
    title: 'Confidentiality',
    subtitle: 'Data Privacy & Access Control',
    description: 'Ensures sensitive data is accessible only to authorized entities and kept private during transit and storage.',
    controls: ['AES-256 / TLS 1.3 Encryption', 'Multi-Factor Authentication (MFA)', 'Role-Based Access Control (RBAC)'],
    attack: 'Man-in-the-Middle (MitM) eavesdropping, unauthorized credential access'
  },
  I: {
    title: 'Integrity',
    subtitle: 'Data Accuracy & Anti-Tampering',
    description: 'Guarantees that information and system configurations cannot be illegally modified, altered, or corrupted.',
    controls: ['SHA-256 Cryptographic Checksums', 'Database Write-Ahead Audit Logs', 'Digital Certificates & Signatures'],
    attack: 'Unauthorized database record modification, packet payload injection'
  },
  A: {
    title: 'Availability',
    subtitle: 'System Reliability & Uptime',
    description: 'Ensures systems, applications, and networks remain responsive and operational whenever authorized users need them.',
    controls: ['Redundant BGP Load Balancing', 'DDoS Mitigation (Anycast Networks)', 'High Availability Failover Clusters'],
    attack: 'Distributed Denial of Service (DDoS), ransomware server encryption'
  }
};

export function CiaTriadViz() {
  const [activePillar, setActivePillar] = useState<Pillar>('C');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const nodes = svgRef.current?.querySelectorAll<SVGGElement>('.cia-node');
    const lines = svgRef.current?.querySelectorAll<SVGLineElement>('.cia-line');

    nodes?.forEach((n, i) => {
      n.style.opacity = '0';
      n.style.transform = 'scale(0.6)';
      n.style.transition = `opacity 0.4s ease ${i * 0.15}s, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 0.15}s`;
      requestAnimationFrame(() => {
        n.style.opacity = '1';
        n.style.transform = 'scale(1)';
      });
    });

    lines?.forEach((l, i) => {
      const len = (l.getTotalLength?.() ?? 160);
      l.style.strokeDasharray = `${len}`;
      l.style.strokeDashoffset = `${len}`;
      l.style.transition = `stroke-dashoffset 0.6s ease ${0.4 + i * 0.15}s`;
      requestAnimationFrame(() => {
        l.style.strokeDashoffset = '0';
      });
    });
  }, []);

  const detail = PILLAR_DETAILS[activePillar];

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Interactive Toolbar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 flex-wrap">
          {(['C', 'I', 'A'] as Pillar[]).map((p) => {
            const isActive = activePillar === p;
            const label = p === 'C' ? 'Confidentiality' : p === 'I' ? 'Integrity' : 'Availability';
            return (
              <button
                key={p}
                id={`cia-tab-${p.toLowerCase()}`}
                type="button"
                onClick={() => setActivePillar(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {p} — {label}
              </button>
            );
          })}
        </div>

        <button
          id="cia-toggle-rotate"
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className="p-2 rounded-lg text-xs bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white transition-colors flex items-center gap-1.5 text-[#555555] dark:text-[#B5B5B5] cursor-pointer"
          title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
        >
          {isRotating ? <Pause size={14} /> : <Play size={14} />}
          <span className="hidden sm:inline text-xs font-bold uppercase">{isRotating ? 'PAUSE' : 'PLAY'}</span>
        </button>
      </div>

      {/* Large Showcase SVG Diagram Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[380px] shadow-sm">
        <svg
          ref={svgRef}
          viewBox="0 0 540 360"
          aria-label="CIA Triad: Confidentiality, Integrity, Availability"
          className="w-full max-h-[360px]"
        >
          {/* Rotating dashed ring */}
          <circle
            cx="270"
            cy="210"
            r="135"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="2"
            strokeDasharray="8 8"
            style={{
              animation: isRotating ? 'spinSlow 10s linear infinite' : 'none',
              transformOrigin: '270px 210px'
            }}
          />

          {/* Connector lines */}
          <line className="cia-line" x1="270" y1="80" x2="135" y2="290" stroke="currentColor" strokeOpacity={activePillar === 'C' || activePillar === 'I' ? 0.7 : 0.2} strokeWidth={activePillar === 'C' || activePillar === 'I' ? 3 : 1.5} />
          <line className="cia-line" x1="270" y1="80" x2="405" y2="290" stroke="currentColor" strokeOpacity={activePillar === 'C' || activePillar === 'A' ? 0.7 : 0.2} strokeWidth={activePillar === 'C' || activePillar === 'A' ? 3 : 1.5} />
          <line className="cia-line" x1="135" y1="290" x2="405" y2="290" stroke="currentColor" strokeOpacity={activePillar === 'I' || activePillar === 'A' ? 0.7 : 0.2} strokeWidth={activePillar === 'I' || activePillar === 'A' ? 3 : 1.5} />

          {/* Center core */}
          <g className="cursor-pointer" onClick={() => setActivePillar('C')}>
            <circle cx="270" cy="210" r="36" fill="var(--bg-card)" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" />
            <text x="270" y="207" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="currentColor" opacity="0.8" fontWeight="800">CIA</text>
            <text x="270" y="222" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="currentColor" opacity="0.5" fontWeight="600">TRIAD</text>
          </g>

          {/* Node — Confidentiality (top) */}
          <g
            id="cia-node-c"
            className="cia-node cursor-pointer"
            onClick={() => setActivePillar('C')}
            style={{ transformOrigin: '270px 80px' }}
          >
            <rect
              x="190" y="42" width="160" height="66" rx="10"
              fill="var(--bg-card)"
              stroke={activePillar === 'C' ? 'currentColor' : 'var(--border-bright)'}
              strokeWidth={activePillar === 'C' ? '3' : '1.5'}
            />
            <text x="270" y="68" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">C</text>
            <text x="270" y="88" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-secondary)" fontWeight={activePillar === 'C' ? '800' : '500'}>CONFIDENTIALITY</text>
            {activePillar === 'C' && <rect x="262" y="48" width="16" height="5" rx="2" fill="currentColor" opacity="0.85" />}
          </g>

          {/* Node — Integrity (bottom-left) */}
          <g
            id="cia-node-i"
            className="cia-node cursor-pointer"
            onClick={() => setActivePillar('I')}
            style={{ transformOrigin: '135px 290px' }}
          >
            <rect
              x="55" y="257" width="160" height="66" rx="10"
              fill="var(--bg-card)"
              stroke={activePillar === 'I' ? 'currentColor' : 'var(--border-bright)'}
              strokeWidth={activePillar === 'I' ? '3' : '1.5'}
            />
            <text x="135" y="283" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">I</text>
            <text x="135" y="303" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-secondary)" fontWeight={activePillar === 'I' ? '800' : '500'}>INTEGRITY</text>
            {activePillar === 'I' && <rect x="127" y="258" width="16" height="5" rx="2" fill="currentColor" opacity="0.85" />}
          </g>

          {/* Node — Availability (bottom-right) */}
          <g
            id="cia-node-a"
            className="cia-node cursor-pointer"
            onClick={() => setActivePillar('A')}
            style={{ transformOrigin: '405px 290px' }}
          >
            <rect
              x="325" y="257" width="160" height="66" rx="10"
              fill="var(--bg-card)"
              stroke={activePillar === 'A' ? 'currentColor' : 'var(--border-bright)'}
              strokeWidth={activePillar === 'A' ? '3' : '1.5'}
            />
            <text x="405" y="283" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">A</text>
            <text x="405" y="303" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-secondary)" fontWeight={activePillar === 'A' ? '800' : '500'}>AVAILABILITY</text>
            {activePillar === 'A' && <rect x="397" y="258" width="16" height="5" rx="2" fill="currentColor" opacity="0.85" />}
          </g>
        </svg>
      </div>

      {/* Interactive Detail Inspector */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            {activePillar === 'C' ? <Lock size={16} /> : activePillar === 'I' ? <CheckCircle2 size={16} /> : <Server size={16} />}
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              {detail.title} — {detail.subtitle}
            </span>
          </div>
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase font-mono">PILLAR INSPECTOR</span>
        </div>

        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
          {detail.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
          <div className="p-3.5 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] flex items-center gap-1">
              <Shield size={12} /> ENFORCEMENT CONTROLS
            </span>
            <ul className="space-y-1.5 text-[#111111] dark:text-white font-sans text-xs">
              {detail.controls.map((c, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
            <span className="text-[10px] uppercase font-bold text-rose-500 flex items-center gap-1">
              ⚠ PRIMARY THREAT VECTOR
            </span>
            <p className="text-[#111111] dark:text-white font-sans leading-relaxed text-xs">
              {detail.attack}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
