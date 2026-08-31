import { useState } from 'react';
import { Cpu, ShieldCheck, Globe, Wifi, WifiOff } from 'lucide-react';

type NetMode = 'NAT' | 'HOST_ONLY' | 'BRIDGED';

interface ModeDetail {
  title: string;
  sublabel: string;
  internetAccess: boolean;
  lanVisibility: boolean;
  vmToVm: boolean;
  isolationLevel: 'High' | 'Medium' | 'Low';
  ipRange: string;
  description: string;
}

const NET_MODES: Record<NetMode, ModeDetail> = {
  NAT: {
    title: 'NAT (Network Address Translation)',
    sublabel: 'Default Internet Access',
    internetAccess: true,
    lanVisibility: false,
    vmToVm: false,
    isolationLevel: 'Medium',
    ipRange: '10.0.2.15 / 24',
    description: 'The VM accesses external internet through the Host OS router IP, but remains invisible to other devices on the LAN.'
  },
  HOST_ONLY: {
    title: 'Host-Only Network Adapter',
    sublabel: 'Strict Security Sandbox',
    internetAccess: false,
    lanVisibility: false,
    vmToVm: true,
    isolationLevel: 'High',
    ipRange: '192.168.56.101 / 24 (vboxnet0)',
    description: 'The VM communicates strictly with other VMs on the same virtual network switch and the host. Zero internet exposure.'
  },
  BRIDGED: {
    title: 'Bridged Network Adapter',
    sublabel: 'Full LAN Member',
    internetAccess: true,
    lanVisibility: true,
    vmToVm: true,
    isolationLevel: 'Low',
    ipRange: '192.168.1.105 / 24 (DHCP from Router)',
    description: 'The VM receives a dedicated IP address directly from your physical home router, appearing as a real physical machine.'
  }
};

export function VmBoundaryViz() {
  const [activeMode, setActiveMode] = useState<NetMode>('HOST_ONLY');
  const mode = NET_MODES[activeMode];

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Network Mode Selection Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase shrink-0">
            HYPERVISOR NETWORKING:
          </span>
          {(['NAT', 'HOST_ONLY', 'BRIDGED'] as NetMode[]).map((m) => {
            const isActive = activeMode === m;
            const label = m === 'NAT' ? 'NAT Mode' : m === 'HOST_ONLY' ? 'Host-Only (Isolated)' : 'Bridged Mode';
            return (
              <button
                key={m}
                id={`vm-mode-${m.toLowerCase()}`}
                type="button"
                onClick={() => setActiveMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Boundary SVG Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex justify-center items-center overflow-hidden min-h-[300px] shadow-sm">
        <svg viewBox="0 0 540 280" aria-label="Host OS to VirtualBox to Kali VM boundary" className="w-full max-h-[300px]">
          {/* Host OS Container */}
          <rect x="15" y="30" width="180" height="220" rx="12" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="2" />
          <text x="105" y="58" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="var(--text-muted)" fontWeight="900">HOST OS</text>
          <text x="105" y="74" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">Windows / macOS / Linux</text>
          <rect x="30" y="96" width="150" height="32" rx="6" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
          <text x="105" y="116" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-secondary)">PHYSICAL ADAPTER</text>

          {/* Hypervisor Boundary */}
          <rect x="210" y="20" width="315" height="240" rx="12" fill="none" stroke="var(--border-bright)" strokeWidth="2.5" strokeDasharray="8 5" />
          <text x="367" y="42" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)" fontWeight="900">VIRTUALBOX HYPERVISOR</text>

          {/* Kali Linux VM */}
          <rect x="228" y="55" width="280" height="190" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="368" y="82" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">KALI LINUX VM</text>
          <text x="368" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">{mode.ipRange}</text>

          {/* VM Apps */}
          <rect x="248" y="118" width="240" height="34" rx="6" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="1" />
          <text x="368" y="139" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-secondary)">
            {activeMode === 'HOST_ONLY' ? 'ISOLATED LAB TOOLS (NMAP/BURP)' : 'INTERNET PROBES (CURL/APT)'}
          </text>

          {/* Traffic Status Indicator */}
          <rect x="248" y="165" width="240" height="42" rx="6" fill="var(--bg-surface)" stroke={mode.internetAccess ? 'var(--text-primary)' : 'var(--border)'} strokeWidth="1.5" />
          <text x="368" y="184" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">
            {mode.internetAccess ? '🌐 WAN INTERNET ACCESS: ENABLED' : '🔒 INTERNET ACCESS: BLOCKED (ISOLATED)'}
          </text>
          <text x="368" y="198" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-muted)">
            {mode.vmToVm ? '✓ VM-to-VM Traffic Allowed' : '✗ Isolated from Other VMs'}
          </text>
        </svg>
      </div>

      {/* Mode Characteristics Inspector */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs font-mono">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <Cpu size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              {mode.title}
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase ${
            mode.isolationLevel === 'High'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
          }`}>
            ISOLATION: {mode.isolationLevel}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
          {mode.description}
        </p>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-center space-y-1">
            <span className="text-[#888888] dark:text-[#777777] block font-bold text-[10px]">INTERNET ROUTING</span>
            <span className="font-extrabold flex items-center justify-center gap-1.5 text-[#111111] dark:text-white text-xs">
              {mode.internetAccess ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-rose-500" />}
              {mode.internetAccess ? 'ACTIVE' : 'BLOCKED'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-center space-y-1">
            <span className="text-[#888888] dark:text-[#777777] block font-bold text-[10px]">LAN VISIBILITY</span>
            <span className="font-extrabold flex items-center justify-center gap-1.5 text-[#111111] dark:text-white text-xs">
              {mode.lanVisibility ? <Globe size={14} className="text-emerald-500" /> : <ShieldCheck size={14} className="text-emerald-500" />}
              {mode.lanVisibility ? 'VISIBLE' : 'HIDDEN'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-center space-y-1">
            <span className="text-[#888888] dark:text-[#777777] block font-bold text-[10px]">VM TO VM COMM</span>
            <span className="font-extrabold text-[#111111] dark:text-white text-xs">
              {mode.vmToVm ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
