import { useState, useCallback, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { SquareCode, Play, Loader2, AlertCircle, CheckCircle2, ExternalLink, Globe, Lock, Server, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import { type LabResult } from './labUtils';

const LAB_ID = 'http';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const stageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

type JourneyStage = 'idle' | 'dns' | 'tcp' | 'tls' | 'sending' | 'processing' | 'receiving' | 'done';

export function HttpTesterLab() {
  const { verifyAndComplete } = useTask();
  const [url, setUrl] = useState('https://httpbin.org/get');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('Content-Type: application/json\nAccept: application/json');
  const [body, setBody] = useState('');
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });
  const [timing, setTiming] = useState<number | null>(null);
  const [journey, setJourney] = useState<JourneyStage>('idle');
  const [journeyData, setJourneyData] = useState<{
    host?: string;
    ip?: string;
    status?: string;
    statusText?: string;
    responseHeaders?: string[];
    responseBody?: string;
    requestHeaders?: string[];
  }>({});

  const run = useCallback(async () => {
    setResult({ status: 'running', output: '' });
    setTiming(null);
    setJourney('dns');
    setJourneyData({});

    const start = performance.now();
    try {
      const parsedUrl = new URL(url);
      setJourneyData((prev) => ({ ...prev, host: parsedUrl.host }));

      await new Promise((r) => setTimeout(r, 400));
      setJourney('tcp');

      await new Promise((r) => setTimeout(r, 500));
      setJourney('tls');

      await new Promise((r) => setTimeout(r, 400));
      setJourney('sending');

      const headerLines = headers.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
      const headerObj: Record<string, string> = {};
      headerLines.forEach((line) => {
        const idx = line.indexOf(':');
        if (idx > 0) {
          headerObj[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        }
      });

      const opts: RequestInit = { method, headers: headerObj };
      if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
        opts.body = body;
      }

      setJourneyData((prev) => ({ ...prev, requestHeaders: Object.entries(headerObj).map(([k, v]) => `${k}: ${v}`) }));

      const res = await fetch(url, opts);
      const elapsed = performance.now() - start;
      setTiming(Math.round(elapsed));

      setJourney('processing');
      await new Promise((r) => setTimeout(r, 300));
      setJourney('receiving');

      const statusLine = `HTTP/${res.status === 200 ? '1.1' : '2.0'} ${res.status} ${res.statusText}`;
      const responseHeaders: string[] = [];
      res.headers.forEach((v, k) => responseHeaders.push(`${k}: ${v}`));

      let responseBody = '';
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        responseBody = JSON.stringify(json, null, 2);
      } else {
        responseBody = await res.text();
      }

      setJourneyData((prev) => ({
        ...prev,
        status: statusLine,
        responseHeaders,
        responseBody: responseBody.slice(0, 2000),
      }));

      await new Promise((r) => setTimeout(r, 300));
      setJourney('done');

      const output = [
        '> REQUEST',
        `${method} ${parsedUrl.pathname + parsedUrl.search} HTTP/1.1`,
        `Host: ${parsedUrl.host}`,
        ...headerLines.map((l) => `  ${l}`),
        method !== 'GET' && method !== 'HEAD' && body.trim() ? '' : undefined,
        method !== 'GET' && method !== 'HEAD' && body.trim() ? body : undefined,
        '',
        '< RESPONSE',
        statusLine,
        ...responseHeaders.map((h) => `  ${h}`),
        '',
        '< BODY',
        responseBody.slice(0, 4000),
      ].filter(Boolean).join('\n');

      setResult({ status: 'success', output });
      verifyAndComplete(LAB_ID, output, undefined, timing);
    } catch (e: unknown) {
      const elapsed = performance.now() - start;
      setTiming(Math.round(elapsed));
      const msg = e instanceof Error ? e.message : String(e);
      setJourney('done');
      setResult({
        status: 'error',
        output: '',
        error: `Request failed after ${Math.round(elapsed)}ms\n\n${msg}\n\nTip: The target may block CORS. Try a CORS-friendly endpoint or disable CORS in your browser for local testing.`,
      });
      verifyAndComplete(LAB_ID, '', `Request failed after ${Math.round(elapsed)}ms\n\n${msg}`, Math.round(elapsed));
    }
  }, [url, method, headers, body, verifyAndComplete]);

  const stages = [
    { id: 'dns', label: 'DNS Lookup', icon: Globe, desc: `Resolving ${journeyData.host || '...'}` },
    { id: 'tcp', label: 'TCP Handshake', icon: Send, desc: 'SYN → SYN-ACK → ACK' },
    { id: 'tls', label: 'TLS Handshake', icon: Lock, desc: 'Encryption established' },
    { id: 'sending', label: 'Sending Request', icon: Send, desc: `${method} request transmitted` },
    { id: 'processing', label: 'Server Processing', icon: Server, desc: 'Awaiting response...' },
    { id: 'receiving', label: 'Receiving Response', icon: Globe, desc: 'Response incoming' },
  ];

  const stageOrder: JourneyStage[] = ['dns', 'tcp', 'tls', 'sending', 'processing', 'receiving', 'done'];
  const currentStageIndex = stageOrder.indexOf(journey);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <SquareCode size={15} className="text-zinc-400" />
            Network Stack Journey Visualizer
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Watch your request travel through DNS, TCP, TLS, and back — animated step by step with real data.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://httpbin.org/get"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 font-mono focus:outline-none focus:border-zinc-600 transition-colors cursor-pointer"
              >
                {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Headers (one per line: Key: Value)</label>
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-y"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={run} disabled={result.status === 'running'} className="gap-2">
              {result.status === 'running' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {result.status === 'running' ? 'Running...' : 'Send Request'}
            </Button>
            {timing !== null && result.status !== 'running' && (
              <span className="text-xs font-mono text-zinc-500">{timing}ms</span>
            )}
          </div>

          {/* Journey Visualization */}
          {(result.status === 'running' || result.status === 'success' || journey !== 'idle') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <span>Request Journey</span>
                <span className={journey === 'done' ? 'text-emerald-400' : 'text-zinc-500'}>
                  {journey === 'done' ? 'Complete' : 'In Progress'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1">
                {stages.map((stage, idx) => {
                  const isActive = idx <= currentStageIndex && journey !== 'idle';
                  const isCurrent = idx === currentStageIndex && journey !== 'done' && journey !== 'idle';
                  return (
                    <div key={stage.id} className="flex-1 flex flex-col items-center gap-1.5">
                      <motion.div
                        animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={isCurrent ? { repeat: Infinity, duration: 1.5 } : {}}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors duration-300 ${
                          isActive
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                        }`}
                      >
                        <stage.icon size={14} />
                      </motion.div>
                      <span className={`text-[9px] font-mono text-center leading-tight ${isActive ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Live data panels */}
              {journeyData.requestHeaders && journey === 'done' && (
                <motion.div variants={stageVariants} className="space-y-2 pt-2 border-t border-zinc-800/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Request Sent</span>
                      <div className="text-[11px] font-mono text-zinc-300 space-y-0.5">
                        <div><span className="text-zinc-500">Method:</span> {method}</div>
                        <div><span className="text-zinc-500">Host:</span> {journeyData.host}</div>
                        {journeyData.requestHeaders?.slice(0, 3).map((h, i) => (
                          <div key={i} className="text-zinc-400 truncate">{h}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Response Received</span>
                      <div className="text-[11px] font-mono text-zinc-300 space-y-0.5">
                        {journeyData.status && <div className={journeyData.status.includes('200') ? 'text-emerald-300' : 'text-amber-300'}>{journeyData.status}</div>}
                        {journeyData.responseHeaders?.slice(0, 3).map((h, i) => (
                          <div key={i} className="text-zinc-400 truncate">{h}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {(result.status === 'success' || result.status === 'error') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
                {result.status === 'success' ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={13} className="text-red-400" />
                )}
                <span className="text-[11px] font-mono text-zinc-400">
                  {result.status === 'success' ? 'Full Output' : 'Error'}
                </span>
                {result.status === 'error' && (
                  <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors ml-auto">
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-x-auto max-h-[400px] overflow-y-auto">
                {result.status === 'error' ? result.error : result.output}
              </pre>
            </motion.div>
          )}
        </div>
        <TaskPanel labId={LAB_ID} />
      </div>
    </motion.div>
  );
}
