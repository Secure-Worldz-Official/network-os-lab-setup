import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShieldAlert, ShieldCheck, Play } from 'lucide-react';

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

export function SqliViz() {
  const [mode, setMode] = useState<'vulnerable' | 'secure'>('vulnerable');
  const [payload, setPayload] = useState<string>("admin' OR '1'='1");
  const [step, setStep] = useState<number>(1);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [showUnion, setShowUnion] = useState(false);
  const [detectionAlert, setDetectionAlert] = useState(false);

  const runExecution = () => {
    setIsExecuting(true);
    setStep(1);
    setShowUnion(false);
    setDetectionAlert(false);

    setTimeout(() => {
      setStep(2);
      if (mode === 'vulnerable') setShowUnion(true);
    }, 600);
    setTimeout(() => {
      setStep(3);
      if (mode === 'vulnerable') setDetectionAlert(true);
    }, 1200);
    setTimeout(() => {
      setIsExecuting(false);
    }, 1800);
  };

  return (
    <div className="space-y-5 font-mono select-none w-full">
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="sqli-mode-vulnerable"
            type="button"
            onClick={() => { setMode('vulnerable'); setStep(1); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border flex items-center gap-1.5 ${
              mode === 'vulnerable'
                ? 'bg-[#333333] text-white border-[#333333] shadow-sm dark:bg-[#555555] dark:border-[#555555]'
                : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A]'
            }`}
          >
            <ShieldAlert size={14} />
            VULNERABLE QUERY
          </button>
          <button
            id="sqli-mode-secure"
            type="button"
            onClick={() => { setMode('secure'); setStep(1); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border flex items-center gap-1.5 ${
              mode === 'secure'
                ? 'bg-[#333333] text-white border-[#333333] shadow-sm dark:bg-[#555555] dark:border-[#555555]'
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
          className="px-4 py-2 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black font-bold text-xs uppercase flex items-center gap-1.5 hover:opacity-90 transition-opacity duration-300 cursor-pointer disabled:opacity-50"
        >
          <Play size={14} />
          EXECUTE INJECTION
        </button>
      </div>

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
            className="px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-bold text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors duration-300 cursor-pointer"
          >
            AUTH BYPASS
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[280px] shadow-sm">
        <svg viewBox="0 0 540 240" aria-label="SQL Injection flow with query construction" className="w-full max-h-[280px]">
          <motion.rect x="20" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="90" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">USER INPUT</text>
          <motion.text
            x="90" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)"
            key={`payload-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            {payload.slice(0, 14)}...
          </motion.text>

          <motion.line x1="160" y1="87" x2="200" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.4"
            animate={{ strokeDashoffset: [0, -10] }} transition={{ duration: 1, repeat: Infinity }} strokeDasharray="4 4" />

          <motion.rect
            x="200" y="50" width="140" height="75" rx="10"
            fill="var(--bg-card)"
            stroke={mode === 'vulnerable' ? 'currentColor' : 'var(--border-bright)'}
            strokeWidth="2"
            animate={{ stroke: mode === 'vulnerable' ? 'currentColor' : 'var(--border-bright)', strokeWidth: 2 }}
            transition={trans}
          />
          <motion.text
            x="270" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900"
            key={`mode-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            {mode === 'vulnerable' ? 'STRING CONCAT' : 'PREPARED STMT'}
          </motion.text>
          <text x="270" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">
            {mode === 'vulnerable' ? 'Unescaped String' : 'Bound Parameter'}
          </text>

          <AnimatePresence>
            {showUnion && (
              <motion.g
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={trans}
              >
                <motion.text
                  x="270" y="138" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  UNION SELECT * FROM users --
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>

          <motion.line x1="340" y1="87" x2="380" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.4"
            animate={{ strokeDashoffset: [0, -10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} strokeDasharray="4 4" />

          <motion.rect x="380" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="450" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">DATABASE</text>
          <text x="450" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">MySQL Engine</text>

          <AnimatePresence>
            {detectionAlert && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={trans}
              >
                <rect x="200" y="160" width="320" height="40" rx="8" fill="var(--bg-surface)" stroke={mode === 'vulnerable' ? 'currentColor' : 'var(--border)'} strokeWidth="1.5" />
                <motion.text
                  x="270" y="185" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={mode === 'vulnerable' ? 'currentColor' : 'var(--text-secondary)'} fontWeight="900"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {mode === 'vulnerable' ? 'WARNING: AST EVALUATES TRUE → AUTH BYPASSED' : 'SAFE: PAYLOAD TREATED AS LITERAL STRING'}
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${step}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={trans}
          className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
            <div className="flex items-center gap-2.5">
              <Database size={16} />
              <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
                GENERATED SQL QUERY (STEP 0{step})
              </span>
            </div>
            <span className={`text-xs font-bold uppercase font-mono ${mode === 'vulnerable' ? 'text-[#555555]' : 'text-[#333333] dark:text-[#B5B5B5]'}`}>
              {mode === 'vulnerable' ? 'VULNERABLE' : 'SECURE'}
            </span>
          </div>

          <motion.code
            className="block p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs sm:text-sm font-mono text-[#111111] dark:text-white leading-relaxed font-bold"
            key={`code-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            {mode === 'vulnerable'
              ? `SELECT * FROM users WHERE username = '${payload}' AND password = '***';`
              : `SELECT * FROM users WHERE username = ? AND password = ?  -- Param 1: "${payload}"`}
          </motion.code>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
