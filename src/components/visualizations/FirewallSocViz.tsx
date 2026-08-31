import { useState } from 'react';
import { Activity } from 'lucide-react';

interface FirewallRule {
  id: number;
  proto: 'TCP' | 'UDP' | 'ICMP';
  port: string;
  action: 'ALLOW' | 'DROP';
  reason: string;
}

const DEFAULT_RULES: FirewallRule[] = [
  { id: 1, proto: 'TCP', port: '22 (SSH)', action: 'ALLOW', reason: 'Authorized Management Sockets' },
  { id: 2, proto: 'TCP', port: '80 (HTTP)', action: 'ALLOW', reason: 'Public Web Application Traffic' },
  { id: 3, proto: 'TCP', port: '443 (HTTPS)', action: 'ALLOW', reason: 'TLS Encrypted Web Traffic' },
  { id: 4, proto: 'TCP', port: '3306 (MySQL)', action: 'DROP', reason: 'Database Direct Exposure Blocked' },
  { id: 5, proto: 'ICMP', port: 'ANY (Ping)', action: 'DROP', reason: 'Reconnaissance Echo Request Dropped' }
];

export function FirewallSocViz() {
  const [rules, setRules] = useState<FirewallRule[]>(DEFAULT_RULES);
  const [selectedRuleId, setSelectedRuleId] = useState<number>(4);

  const toggleRuleAction = (id: number) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, action: r.action === 'ALLOW' ? 'DROP' : 'ALLOW' } : r
      )
    );
  };

  const selectedRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Rules Interactive Toolbar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase shrink-0">
            FIREWALL POLICIES:
          </span>
          {rules.map((r) => {
            const isSelected = selectedRuleId === r.id;
            return (
              <button
                key={r.id}
                id={`fw-rule-btn-${r.id}`}
                type="button"
                onClick={() => setSelectedRuleId(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {r.port.split(' ')[0]} ({r.action})
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Firewall Packet Filtering Flow Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[260px] shadow-sm">
        <svg viewBox="0 0 540 220" aria-label="Firewall Packet Filtering Flow" className="w-full max-h-[260px]">
          {/* External Internet Packets */}
          <rect x="20" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="90" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">UNTRUSTED WAN</text>
          <text x="90" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">Inbound Packets</text>

          {/* Stateful Firewall Inspection Engine */}
          <rect x="200" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="270" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">FIREWALL ENGINE</text>
          <text x="270" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">Rule Matrix Check</text>

          {/* Internal Protected LAN */}
          <rect x="380" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke={selectedRule.action === 'ALLOW' ? '#10b981' : '#f43f5e'} strokeWidth="2" />
          <text x="450" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">PROTECTED LAN</text>
          <text x="450" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">
            {selectedRule.action === 'ALLOW' ? 'PACKET FORWARDED' : 'PACKET DROPPED'}
          </text>

          {/* Status Message */}
          <text x="270" y="180" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={selectedRule.action === 'ALLOW' ? '#10b981' : '#f43f5e'} fontWeight="900">
            {selectedRule.action === 'ALLOW'
              ? `✓ INBOUND PORT ${selectedRule.port} ACCEPTED BY POLICY`
              : `⛔ INBOUND PORT ${selectedRule.port} DROPPED — LOGGED IN SIEM AUDIT`}
          </text>
        </svg>
      </div>

      {/* Selected Policy Inspector */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs font-mono">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <Activity size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              FIREWALL RULE #{selectedRule.id} — PORT {selectedRule.port}
            </span>
          </div>
          <button
            id={`fw-toggle-rule-${selectedRule.id}`}
            type="button"
            onClick={() => toggleRuleAction(selectedRule.id)}
            className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all cursor-pointer border ${
              selectedRule.action === 'ALLOW'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-rose-600 text-white border-rose-600'
            }`}
          >
            TOGGLE: {selectedRule.action}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
          {selectedRule.reason}
        </p>
      </div>
    </div>
  );
}
