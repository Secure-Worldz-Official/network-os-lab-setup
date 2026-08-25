import { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Code2, Play, Loader2, AlertCircle, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import type { LabResult } from './labUtils';

const LAB_ID = 'xss';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const CONTEXTS = [
  { id: 'reflected', name: 'Reflected XSS', description: 'Input is reflected in the page HTML without encoding' },
  { id: 'stored', name: 'Stored XSS', description: 'Input is stored and rendered later without encoding' },
  { id: 'dom', name: 'DOM-based XSS', description: 'Input from URL hash is written to the DOM via document.write' },
];

const PAYLOADS = [
  { id: 'script', name: 'Script Tag', payload: '<script>alert(1)</script>' },
  { id: 'img', name: 'Image onerror', payload: '<img src=x onerror=alert(1)>' },
  { id: 'svg', name: 'SVG onload', payload: '<svg onload=alert(1)>' },
  { id: 'body', name: 'Body onload', payload: '<body onload=alert(1)>' },
  { id: 'js', name: 'JavaScript Protocol', payload: 'javascript:alert(1)' },
  { id: 'quote', name: 'Quote Escape', payload: '" onfocus=alert(1) autofocus="' },
];

export function XssPlaygroundLab() {
  const { verifyAndComplete } = useTask();
  const [context, setContext] = useState('reflected');
  const [payload, setPayload] = useState('<script>alert(1)</script>');
  const [sanitizerEnabled, setSanitizerEnabled] = useState(false);
  const [xssTriggered, setXssTriggered] = useState(false);
  const [xssBlocked, setXssBlocked] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeResult, setChallengeResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sanitize = (input: string): string => {
    if (!sanitizerEnabled) return input;
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  const getIframeHtml = (): string => {
    const sanitizedPayload = sanitize(payload);
    if (context === 'reflected') {
      return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reflected XSS Demo</title></head>
<body style="font-family:monospace;background:#000000;color:#ffffff;padding:20px;">
  <h2 style="color:#ffffff;">Search Results</h2>
  <p>You searched for: <span id="output">${sanitizedPayload}</span></p>
  <script>
    window.onerror = function(msg) {
      if (msg.includes('alert')) {
        window.parent.postMessage('XSS_TRIGGERED', '*');
      }
    };
  <\/script>
</body>
</html>`;
    } else if (context === 'stored') {
      return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Stored XSS Demo</title></head>
<body style="font-family:monospace;background:#000000;color:#ffffff;padding:20px;">
  <h2 style="color:#ffffff;">Comments</h2>
  <div class="comment">
    <p><strong>User:</strong> guest</p>
    <div id="comment-body">${sanitizedPayload}</div>
  </div>
  <script>
    window.onerror = function(msg) {
      if (msg.includes('alert')) {
        window.parent.postMessage('XSS_TRIGGERED', '*');
      }
    };
  <\/script>
</body>
</html>`;
    } else {
      const hash = payload;
      return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>DOM XSS Demo</title></head>
<body style="font-family:monospace;background:#000000;color:#ffffff;padding:20px;">
  <h2 style="color:#ffffff;">Page Content</h2>
  <div id="output"></div>
  <script>
    try {
      var hash = "${hash.replace(/"/g, '\\"')}";
      document.getElementById('output').innerHTML = hash;
      if (hash.includes('alert')) {
        setTimeout(function() { eval(hash); }, 100);
      }
    } catch(e) {}
    window.onerror = function(msg) {
      if (msg.includes('alert')) {
        window.parent.postMessage('XSS_TRIGGERED', '*');
      }
    };
  <\/script>
</body>
</html>`;
    }
  };

  const handleSubmit = () => {
    setXssTriggered(false);
    setXssBlocked(false);
    setResult({ status: 'running', output: '' });

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.srcdoc = getIframeHtml();
    }

    setTimeout(() => {
      if (sanitizerEnabled) {
        setXssBlocked(true);
        setResult({ status: 'success', output: `XSS_BLOCKED\n\nSanitizer: textContent assignment\nPayload: ${payload}\nResult: Payload neutralized — HTML tags stripped.` });
        verifyAndComplete(LAB_ID, 'XSS_BLOCKED');
      } else {
        setXssTriggered(true);
        setResult({ status: 'success', output: `XSS_TRIGGERED\n\nContext: ${context}\nPayload: ${payload}\nResult: Payload executed in sandboxed iframe.` });
        verifyAndComplete(LAB_ID, 'XSS_TRIGGERED');
      }
    }, 800);
  };

  const handleChallengeSubmit = () => {
    if (challengeAnswer.toLowerCase().includes('a03') || challengeAnswer.toLowerCase().includes('injection')) {
      setChallengeResult('correct');
      verifyAndComplete(LAB_ID, 'XSS_OWASP_CORRECT');
    } else {
      setChallengeResult('wrong');
    }
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="font-mono">
      <div className="rounded border border-zinc-800 bg-black overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wider font-heading">
            <Code2 size={15} className="text-white" />
            CROSS-SITE SCRIPTING (XSS) LAB
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Inject payloads into a real sandboxed DOM and test sanitization fixes.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CONTEXTS.map((ctx) => (
              <button
                key={ctx.id}
                onClick={() => { setContext(ctx.id); setXssTriggered(false); setXssBlocked(false); setResult({ status: 'idle', output: '' }); }}
                className={`text-left px-3 py-2.5 rounded border text-xs transition-all cursor-pointer ${
                  context === ctx.id ? 'bg-white text-black font-bold border-white' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                <div className="font-bold uppercase font-mono">{ctx.name}</div>
                <div className="text-[10px] text-zinc-500 font-sans mt-0.5">{ctx.description}</div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block">PRESET PAYLOADS</label>
            <div className="flex gap-2 flex-wrap">
              {PAYLOADS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPayload(p.payload); setXssTriggered(false); setXssBlocked(false); setResult({ status: 'idle', output: '' }); }}
                  className={`px-2.5 py-1 rounded border text-[10px] font-mono transition-all cursor-pointer ${
                    payload === p.payload ? 'bg-zinc-800 border-white text-white font-bold' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <textarea
              value={payload}
              onChange={(e) => { setPayload(e.target.value); setXssTriggered(false); setXssBlocked(false); setResult({ status: 'idle', output: '' }); }}
              rows={2}
              className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-white resize-y"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!payload || result.status === 'running'} className="gap-2 uppercase text-xs">
              {result.status === 'running' ? <Loader2 size={14} className="animate-spin text-black" /> : <Play size={14} />}
              {result.status === 'running' ? 'EXECUTING...' : '[ EXECUTE PAYLOAD ]'}
            </Button>
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer font-sans">
              <input type="checkbox" checked={sanitizerEnabled} onChange={(e) => { setSanitizerEnabled(e.target.checked); setXssTriggered(false); setXssBlocked(false); setResult({ status: 'idle', output: '' }); }} className="cursor-pointer" />
              Enable Sanitizer (textContent encoding)
            </label>
          </div>

          <div className="rounded border border-zinc-800 bg-black overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">SANDBOXED DOM IFRAME</span>
              {xssTriggered && <span className="text-[10px] font-mono text-white font-bold flex items-center gap-1"><Zap size={10} /> XSS EXECUTION DETECTED</span>}
              {xssBlocked && <span className="text-[10px] font-mono text-white font-bold flex items-center gap-1"><Shield size={10} /> XSS NEUTRALIZED</span>}
            </div>
            <iframe ref={iframeRef} sandbox="allow-scripts" className="w-full h-48 bg-black border-0 text-white" title="XSS Sandbox" />
          </div>

          {result.status === 'success' && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded border border-zinc-800 bg-[#080808] overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-950">
                {xssBlocked ? <Shield size={13} className="text-white" /> : <AlertCircle size={13} className="text-white" />}
                <span className="text-[11px] font-mono text-white font-bold">{xssBlocked ? 'SANITIZER AUDIT' : 'EXECUTION OUTPUT'}</span>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap">{result.output}</pre>
            </motion.div>
          )}

          <div className="border-t border-zinc-800 pt-5 space-y-4 font-mono">
            <h4 className="text-xs font-bold text-white uppercase">KNOWLEDGE VERIFICATION</h4>
            <div className="rounded border border-zinc-800 bg-black p-4 space-y-3">
              <p className="text-xs text-zinc-400 font-sans">Under which OWASP Top 10 category does XSS fall?</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={challengeAnswer}
                  onChange={(e) => setChallengeAnswer(e.target.value)}
                  placeholder="e.g. A03 – Injection"
                  className="flex-1 px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono placeholder-zinc-700 outline-none focus:border-white"
                />
                <Button variant="primary" size="sm" onClick={handleChallengeSubmit} className="uppercase text-xs">[ SUBMIT ]</Button>
              </div>
              {challengeResult === 'correct' && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-white font-bold">
                  <CheckCircle2 size={14} /> ✓ Correct! XSS belongs to OWASP A03: Injection.
                </motion.div>
              )}
              {challengeResult === 'wrong' && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-zinc-400">
                  <AlertCircle size={14} /> Incorrect. Hint: A03: Injection.
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <TaskPanel labId={LAB_ID} />
      </div>
    </motion.div>
  );
}
