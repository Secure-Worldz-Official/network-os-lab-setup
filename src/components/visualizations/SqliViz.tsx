import { useState } from 'react';
import { Database, ShieldAlert, ShieldCheck, Play } from 'lucide-react';

export function SqliViz() {
  const [mode, setMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [payload, setPayload] = useState<string>("admin' OR '1'='1");
  const [step, setStep] = useState<number>(1);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const runExecution = () => {
    setIsExecuting(true);
    setStep(1);
    setTimeout(() => setStep(2), 600);
    setTimeout(() => setStep(3), 1200);
    setTimeout(() => setIsExecuting(false), 1800);
  };

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Mode Selector & Input Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="sqli-mode-vulnerable"
            type="button"
            onClick={() => {
              setMode('vulnerable');
              setStep(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
              mode === 'vulnerable'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A]'
            }`}
          >
            <ShieldAlert size={14} />
            VULNERABLE QUERY
          </button>
          <button
            id="sqli-mode-secure"
            type="button"
            onClick={() => {
              setMode('secure');
              setStep(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
              mode === 'secure'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A]'
            }`}
          >
            <ShieldCheck size={14} />
            PARAMETERIZED DEFENSE
          </button>
        </div>

        <button
          id="sqli-btn-run"
          type="button"
          onClick={runExecution}
          disabled={isExecuting}
          className="px-4 py-2 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black font-bold text-xs uppercase flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          <Play size={14} />
          EXECUTE INJECTION
        </button>
      </div>

      {/* Payload Tester Bar */}
      <div className="p-4 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] space-y-2.5">
        <label className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase block">
          INPUT PAYLOAD PROBE:
        </label>
        <div className="flex gap-2.5">
          <input
            id="sqli-payload-input"
            type="text"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-mono text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-bold"
          />
          <button
            id="sqli-preset-bypass"
            type="button"
            onClick={() => setPayload("admin' OR '1'='1")}
            className="px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-bold text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white cursor-pointer"
          >
            AUTH BYPASS
          </button>
        </div>
      </div>

      {/* Query Execution Flow Diagram Canvas */}
      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[260px] shadow-sm">
        <svg viewBox="0 0 540 220" aria-label="SQL Injection flow" className="w-full max-h-[260px]">
          {/* User Input Node */}
          <rect x="20" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="90" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">USER INPUT</text>
          <text x="90" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">{payload.slice(0, 14)}...</text>

          {/* Connection 1 */}
          <line x1="160" y1="87" x2="200" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.5" />

          {/* Backend Query Compiler Node */}
          <rect x="200" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke={mode === 'vulnerable' ? 'var(--text-primary)' : 'var(--border-bright)'} strokeWidth="2" />
          <text x="270" y="80" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">
            {mode === 'vulnerable' ? 'STRING CONCAT' : 'PREPARED STMT'}
          </text>
          <text x="270" y="98" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">
            {mode === 'vulnerable' ? 'Unescaped String' : 'Bound Parameter'}
          </text>

          {/* Connection 2 */}
          <line x1="340" y1="87" x2="380" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.5" />

          {/* Database Engine Node */}
          <rect x="380" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" />
          <text x="450" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">DATABASE</text>
          <text x="450" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">MySQL Engine</text>

          {/* Execution Highlight Status */}
          <text x="270" y="180" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={mode === 'vulnerable' ? '#f43f5e' : '#10b981'} fontWeight="900">
            {mode === 'vulnerable' ? '⚠ AST EVALUATES TRUE → AUTHENTICATION BYPASSED' : '✓ PAYLOAD TREATED AS LITERAL STRING VALUE (SAFE)'}
          </text>
        </svg>
      </div>

      {/* SQL Query Inspector Box */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <Database size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              GENERATED SQL QUERY (STEP 0{step})
            </span>
          </div>
          <span className={`text-xs font-bold uppercase font-mono ${mode === 'vulnerable' ? 'text-rose-500' : 'text-emerald-500'}`}>
            {mode === 'vulnerable' ? 'VULNERABLE' : 'SECURE'}
          </span>
        </div>

        <code className="block p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs sm:text-sm font-mono text-[#111111] dark:text-white leading-relaxed font-bold">
          {mode === 'vulnerable'
            ? `SELECT * FROM users WHERE username = '${payload}' AND password = '***';`
            : `SELECT * FROM users WHERE username = ? AND password = ?  -- Param 1: "${payload}"`}
        </code>
      </div>
    </div>
  );
}
