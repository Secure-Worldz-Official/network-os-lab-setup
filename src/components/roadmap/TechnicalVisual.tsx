import type { Day } from '@/data/roadmap';

type VisualSpec = {
  label: string;
  caption: string;
  kind: 'flow' | 'stack' | 'subnets' | 'ports' | 'capture' | 'lab' | 'checklist';
  items: string[];
};

const visuals: Record<number, VisualSpec> = {
  1: {
    label: 'CIA triad model',
    caption: 'The CIA triad frames every security decision around confidentiality, integrity, and availability.',
    kind: 'flow',
    items: ['Confidentiality', 'Integrity', 'Availability'],
  },
  2: {
    label: 'Virtual machine boundary',
    caption: 'VirtualBox keeps the Kali virtual machine separate from the host operating system while providing controlled access to updates.',
    kind: 'flow',
    items: ['Host computer', 'VirtualBox', 'Kali VM'],
  },
  3: {
    label: 'Local network path',
    caption: 'A local device sends traffic to the router, which translates and routes it to the internet.',
    kind: 'flow',
    items: ['Your device', 'Router', 'Internet'],
  },
  4: {
    label: 'OSI layer stack',
    caption: 'Each request moves through the OSI layers, from application data down to physical signals.',
    kind: 'stack',
    items: ['7  Application', '6  Presentation', '5  Session', '4  Transport', '3  Network', '2  Data link', '1  Physical'],
  },
  5: {
    label: 'Subnet division',
    caption: 'A /24 network divides into four equal /26 blocks, each with 62 usable host addresses.',
    kind: 'subnets',
    items: ['.0 – .63', '.64 – .127', '.128 – .191', '.192 – .255'],
  },
  6: {
    label: 'Port ranges',
    caption: 'Port ranges identify the service category before the destination application receives a connection.',
    kind: 'ports',
    items: ['0 – 1023  System', '1024 – 49151  Registered', '49152 – 65535  Dynamic'],
  },
  7: {
    label: 'Packet capture view',
    caption: 'A packet capture lists traffic in time order, then exposes protocol details and raw bytes for the selected packet.',
    kind: 'capture',
    items: ['DNS query', 'TCP handshake', 'HTTP request'],
  },
  8: {
    label: 'Isolated practice lab',
    caption: 'The host-only adapter connects the Kali and target virtual machines while keeping the practice network off the public internet.',
    kind: 'lab',
    items: ['Kali VM', 'Host only network', 'Target VM'],
  },
  9: {
    label: 'Foundation review loop',
    caption: 'Review one command from each lesson, confirm the result, and return to the related reference when needed.',
    kind: 'checklist',
    items: ['Configure', 'Inspect', 'Capture', 'Isolate'],
  },
};

function FlowDiagram({ items, lab = false }: { items: string[]; lab?: boolean }) {
  return (
    <svg viewBox="0 0 720 230" role="img" aria-label={items.join(' to ')} className="reference-visual-svg">
      <defs>
        <marker id="diagram-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
        </marker>
      </defs>
      {items.map((item, index) => {
        const x = 36 + index * 232;
        return (
          <g key={item} className="reference-visual-node">
            <rect x={x} y={lab && index === 1 ? 42 : 78} width="184" height={lab && index === 1 ? 104 : 64} rx="12" />
            <text x={x + 92} y={lab && index === 1 ? 91 : 108} textAnchor="middle">{item}</text>
            {index < items.length - 1 && (
              <line x1={x + 184} y1="110" x2={x + 224} y2="110" markerEnd="url(#diagram-arrow)" className="reference-visual-arrow" />
            )}
          </g>
        );
      })}
      {lab && <text x="360" y="175" textAnchor="middle" className="reference-visual-note">Private practice traffic only</text>}
    </svg>
  );
}

function StackDiagram({ items }: { items: string[] }) {
  return (
    <svg viewBox="0 0 720 320" role="img" aria-label="OSI layer stack" className="reference-visual-svg">
      {items.map((item, index) => {
        const y = 14 + index * 42;
        return (
          <g key={item} className="reference-visual-node">
            <rect x="130" y={y} width="460" height="32" rx="7" />
            <text x="154" y={y + 21}>{item}</text>
          </g>
        );
      })}
      <path d="M618 26 V290" className="reference-visual-arrow" markerEnd="url(#diagram-arrow)" />
      <text x="636" y="166" className="reference-visual-note">Data flow</text>
    </svg>
  );
}

function SubnetDiagram({ items }: { items: string[] }) {
  return (
    <svg viewBox="0 0 720 250" role="img" aria-label="Four equal subnet blocks" className="reference-visual-svg">
      <text x="36" y="34" className="reference-visual-note">192.168.1.0/24</text>
      {items.map((item, index) => {
        const x = 36 + (index % 2) * 334;
        const y = 58 + Math.floor(index / 2) * 84;
        return (
          <g key={item} className="reference-visual-node">
            <rect x={x} y={y} width="310" height="58" rx="10" />
            <text x={x + 20} y={y + 25}>Subnet {index + 1}</text>
            <text x={x + 20} y={y + 44} className="reference-visual-note">{item}  ·  /26</text>
          </g>
        );
      })}
    </svg>
  );
}

function PortsDiagram({ items }: { items: string[] }) {
  return (
    <svg viewBox="0 0 720 230" role="img" aria-label="Network port ranges" className="reference-visual-svg">
      <line x1="52" y1="114" x2="668" y2="114" className="reference-visual-arrow" />
      {items.map((item, index) => {
        const x = 52 + index * 205;
        return (
          <g key={item} className="reference-visual-node">
            <rect x={x} y="82" width="190" height="64" rx="10" />
            <text x={x + 16} y="108">{item.split('  ')[0]}</text>
            <text x={x + 16} y="129" className="reference-visual-note">{item.split('  ')[1]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function CaptureDiagram({ items }: { items: string[] }) {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Packet capture interface" className="reference-visual-svg">
      <rect x="24" y="18" width="672" height="222" rx="12" className="reference-visual-panel" />
      <text x="48" y="52" className="reference-visual-note">No.   Time      Protocol   Info</text>
      {items.map((item, index) => {
        const y = 76 + index * 36;
        return (
          <g key={item}>
            <rect x="44" y={y - 20} width="632" height="28" rx="5" className="reference-visual-row" />
            <text x="58" y={y}>{`0${index + 1}`}</text>
            <text x="116" y={y}>{`0.${index + 12}4`}</text>
            <text x="220" y={y}>{item}</text>
            <text x="420" y={y} className="reference-visual-note">Inspect packet details</text>
          </g>
        );
      })}
      <text x="48" y="212" className="reference-visual-note">Selected packet details  ›  protocol fields  ›  raw bytes</text>
    </svg>
  );
}

function ChecklistDiagram({ items }: { items: string[] }) {
  return (
    <svg viewBox="0 0 720 230" role="img" aria-label="Foundation review checklist" className="reference-visual-svg">
      {items.map((item, index) => {
        const x = 52 + (index % 2) * 330;
        const y = 36 + Math.floor(index / 2) * 82;
        return (
          <g key={item} className="reference-visual-node">
            <rect x={x} y={y} width="290" height="56" rx="10" />
            <rect x={x + 18} y={y + 17} width="22" height="22" rx="5" className="reference-visual-check" />
            <path d={`M${x + 23} ${y + 28} l5 5 l8 -10`} className="reference-visual-checkmark" />
            <text x={x + 58} y={y + 35}>{item}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function TechnicalVisual({ day }: { day: Day }) {
  const visual = visuals[day.id];
  if (!visual) return null;

  return (
    <figure className="reference-visual">
      <div className="reference-visual-label">{visual.label}</div>
      {visual.kind === 'flow' && <FlowDiagram items={visual.items} />}
      {visual.kind === 'lab' && <FlowDiagram items={visual.items} lab />}
      {visual.kind === 'stack' && <StackDiagram items={visual.items} />}
      {visual.kind === 'subnets' && <SubnetDiagram items={visual.items} />}
      {visual.kind === 'ports' && <PortsDiagram items={visual.items} />}
      {visual.kind === 'capture' && <CaptureDiagram items={visual.items} />}
      {visual.kind === 'checklist' && <ChecklistDiagram items={visual.items} />}
      <figcaption>{visual.caption}</figcaption>
    </figure>
  );
}
