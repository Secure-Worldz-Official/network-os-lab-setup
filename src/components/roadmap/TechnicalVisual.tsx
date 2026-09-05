import { CiaTriadViz } from '@/components/visualizations/CiaTriadViz';
import { VmBoundaryViz } from '@/components/visualizations/VmBoundaryViz';
import { PacketFlowViz } from '@/components/visualizations/PacketFlowViz';
import { OsiLayerViz } from '@/components/visualizations/OsiLayerViz';
import { SubnetViz } from '@/components/visualizations/SubnetViz';
import { PortRangesViz } from '@/components/visualizations/PortRangesViz';
import { PacketCaptureViz } from '@/components/visualizations/PacketCaptureViz';
import { ReviewLoopViz } from '@/components/visualizations/ReviewLoopViz';
import { TcpHandshakeViz } from '@/components/visualizations/TcpHandshakeViz';
import { SqliViz } from '@/components/visualizations/SqliViz';
import { XssViz } from '@/components/visualizations/XssViz';
import { HashCrackingViz } from '@/components/visualizations/HashCrackingViz';
import { PrivEscViz } from '@/components/visualizations/PrivEscViz';
import { FirewallSocViz } from '@/components/visualizations/FirewallSocViz';
import type { Day } from '@/data/roadmap';

const CAPTIONS: Record<number, string> = {
  1: 'The CIA triad frames every security decision around Confidentiality, Integrity, and Availability.',
  2: 'VirtualBox keeps Kali Linux isolated from your host OS while providing controlled access to updates.',
  3: 'A local device sends traffic to the router, which translates addresses and routes it to the internet.',
  4: 'Every network request travels through the 7 OSI layers — from application data down to physical signals.',
  5: 'A /24 network divides into four equal /26 blocks, each with 62 usable host addresses.',
  6: 'Port numbers identify the destination service before the application receives the connection.',
  7: 'Wireshark captures packets in real time — select a row to inspect headers, flags, and raw bytes.',
  8: 'The host-only adapter connects Kali and target VMs while keeping the practice network off the public internet.',
  9: 'Review one command from each lesson, confirm the output, and return to references when needed.',
};

const LAB_NODES_DAY8 = [
  { label: 'KALI VM', sublabel: '192.168.56.101', x: 40, y: 90, type: 'host' as const },
  { label: 'HOST-ONLY', sublabel: 'vboxnet0', x: 230, y: 90, type: 'router' as const },
  { label: 'TARGET VM', sublabel: '192.168.56.102', x: 420, y: 90, type: 'host' as const },
];

export interface TechnicalVisualProps {
  day?: Day;
  topic?: 'sqli' | 'xss' | 'hash' | 'privesc' | 'soc' | 'nmap' | 'burp' | 'cia' | 'subnet' | 'osi';
}

/**
 * TechnicalVisual — renders topic-specific, interactive visualization components.
 * Supports both Day objects and direct topic identifiers for rooms & modules.
 */
export function TechnicalVisual({ day, topic }: TechnicalVisualProps) {
  const caption = day ? CAPTIONS[day.id] : undefined;

  const renderViz = () => {
    if (topic) {
      switch (topic) {
        case 'sqli': return <SqliViz />;
        case 'xss': return <XssViz />;
        case 'hash': return <HashCrackingViz />;
        case 'privesc': return <PrivEscViz />;
        case 'soc': return <FirewallSocViz />;
        case 'nmap': return <PortRangesViz />;
        case 'burp': return <PacketCaptureViz />;
        case 'cia': return <CiaTriadViz />;
        case 'subnet': return <SubnetViz />;
        case 'osi': return <OsiLayerViz />;
        default: return <TcpHandshakeViz />;
      }
    }

    if (day) {
      switch (day.id) {
        case 1: return <CiaTriadViz />;
        case 2: return <VmBoundaryViz />;
        case 3: return <PacketFlowViz />;
        case 4: return <OsiLayerViz />;
        case 5: return <SubnetViz />;
        case 6: return <PortRangesViz />;
        case 7: return <PacketCaptureViz />;
        case 8: return <PacketFlowViz nodes={LAB_NODES_DAY8} showWall={false} />;
        case 9: return <ReviewLoopViz />;
        default: return <TcpHandshakeViz />;
      }
    }

    return <TcpHandshakeViz />;
  };

  return (
    <figure style={{ margin: '1rem 0', width: '100%' }}>
      <div style={{ width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'transparent' }}>
        {renderViz()}
      </div>
      {caption && (
        <figcaption style={{ marginTop: '0.625rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
