import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

export function FirewallSocViz() {
  const [rules, setRules] = useState<FirewallRule[]>(DEFAULT_RULES);
  const [selectedRuleId, setSelectedRuleId] = useState<number>(4);
  const [evalStep, setEvalStep] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const selectedRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  const runEvaluation = () => {
    setIsEvaluating(true);
    setEvalStep(0);
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const step = Math.floor(elapsed / 500);
      setEvalStep(Math.min(step, 3));
      if (step < 3) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setIsEvaluating(false), 1000);
      }
    };
    requestAnimationFrame(tick);
  };

  const toggleRuleAction = (id: number) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, action: r.action === 'ALLOW' ? 'DROP' : 'ALLOW' } : r
      )
    );
  };

  return (
    <div className="space-y-5 font-mono select-none w-full">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {r.port.split(' ')[0]}
              </button>
            );
          })}
        </div>

        <button
          id="fw-btn-evaluate"
          type="button"
          onClick={runEvaluation}
          disabled={isEvaluating}
          className="px-3 py-1.5 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black font-bold text-xs uppercase transition-all duration-300 cursor-pointer border border-[#111111] dark:border-white disabled:opacity-40"
        >
          EVALUATE PACKET
        </button>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[320px] shadow-sm">
        <svg viewBox="0 0 540 260" aria-label="Firewall rule evaluation and packet filtering" className="w-full max-h-[320px]">
          <motion.rect x="20" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="90" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">UNTRUSTED WAN</text>
          <text x="90" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">Inbound Packets</text>

          <motion.line x1="160" y1="87" x2="200" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -10] }} transition={{ duration: 1, repeat: Infinity }} />

          <motion.rect x="200" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="270" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">FIREWALL ENGINE</text>
          <text x="270" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">Rule Matrix Check</text>

          <AnimatePresence>
            {isEvaluating && (
              <motion.g
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={trans}
              >
                <rect x="210" y="130" width="120" height="30" rx="5" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="1" />
                <motion.text
                  x="270" y="150" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="var(--text-primary)" fontWeight="700"
                  key={`eval-${evalStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={trans}
                >
                  {evalStep === 0 && 'CHECKING SRC IP...'}
                  {evalStep === 1 && `MATCH: PORT ${selectedRule.port}`}
                  {evalStep === 2 && 'APPLYING ACTION...'}
                  {evalStep === 3 && `RESULT: ${selectedRule.action}`}
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>

          <motion.line x1="340" y1="87" x2="380" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} />

          <motion.rect
            x="380" y="50" width="140" height="75" rx="10"
            fill="var(--bg-card)"
            stroke={selectedRule.action === 'ALLOW' ? 'var(--text-primary)' : 'currentColor'}
            strokeWidth={selectedRule.action === 'ALLOW' ? 2 : 2.5}
            animate={{ stroke: selectedRule.action === 'ALLOW' ? 'var(--text-primary)' : 'currentColor', strokeWidth: selectedRule.action === 'ALLOW' ? 2 : 2.5 }}
            transition={trans}
          />
          <text x="450" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">PROTECTED LAN</text>
          <motion.text
            x="450" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)"
            key={`lan-${selectedRule.action}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            {selectedRule.action === 'ALLOW' ? 'PACKET FORWARDED' : 'PACKET DROPPED'}
          </motion.text>

          <AnimatePresence>
            {selectedRule.action === 'DROP' && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={trans}
              >
                <motion.text
                  x="270" y="190" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  DROPPED — LOGGED IN SIEM AUDIT
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>

          {selectedRule.action === 'ALLOW' && (
            <motion.text
              x="270" y="190" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              FORWARDED TO INTERNAL HOST
            </motion.text>
          )}
        </svg>
      </div>

      <motion.div
        key={selectedRule.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={trans}
        className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs font-mono"
      >
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
            className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all duration-300 cursor-pointer border ${
              selectedRule.action === 'ALLOW'
                ? 'bg-[#333333] text-white border-[#333333] dark:bg-[#555555] dark:border-[#555555]'
                : 'bg-[#333333] text-white border-[#333333] dark:bg-[#555555] dark:border-[#555555]'
            }`}
          >
            TOGGLE: {selectedRule.action}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
          {selectedRule.reason}
        </p>
      </motion.div>
    </div>
  );
}
