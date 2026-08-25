import { useState, useCallback } from 'react';
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
  const [resStatus, setResStatus] = useState<number | null>(null);
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

  const [retrieveChoice, setRetrieveChoice] = useState('');
  const [submitChoice, setSubmitChoice] = useState('');
  const [statusChoice, setStatusChoice] = useState('');
  const [retrieveCorrect, setRetrieveCorrect] = useState<boolean | null>(null);
  const [submitCorrect, setSubmitCorrect] = useState<boolean | null>(null);
  const [statusCorrect, setStatusCorrect] = useState<boolean | null>(null);

  const run = useCallback(async () => {
    setResult({ status: 'running', output: '' });
    setTiming(null);
    setResStatus(null);
    setJourney('dns');
    setJourneyData({});
    setRetrieveChoice('');
    setSubmitChoice('');
    setStatusChoice('');
    setRetrieveCorrect(null);
    setSubmitCorrect(null);
    setStatusCorrect(null);

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
      setResStatus(res.status);

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
        error: `Request failed after ${Math.round(elapsed)}ms\n\n${msg}\n\nTip: The target may block CORS.`,
      });
      verifyAndComplete(LAB_ID, '', `Request failed after ${Math.round(elapsed)}ms\n\n${msg}`, Math.round(elapsed));
    }
  }, [url, method, headers, body, verifyAndComplete]);

  const validateRetrieve = () => {
    setRetrieveCorrect(retrieveChoice === 'GET');
  };

  const validateSubmit = () => {
    setSubmitCorrect(submitChoice === 'POST' || submitChoice === 'PUT');
  };

  const validateStatus = () => {
    if (resStatus === null) return;
    const meaningMap: Record<number, string> = {
      200: 'OK',
      404: 'Not Found',
      500: 'Server Error',
      301: 'Moved Permanently',
      403: 'Forbidden',
      401: 'Unauthorized',
    };
    const correct = meaningMap[resStatus] || 'Unknown';
    setStatusCorrect(statusChoice === correct);
  };

  const stages = [
    { id: 'dns', label: 'DNS Lookup', icon: Globe },
    { id: 'tcp', label: 'TCP Handshake', icon: Send },
    { id: 'tls', label: 'TLS Handshake', icon: Lock },
    { id: 'sending', label: 'Sending Request', icon: Send },
    { id: 'processing', label: 'Server Processing', icon: Server },
    { id: 'receiving', label: 'Receiving Response', icon: Globe },
  ];

  const stageOrder: JourneyStage[] = ['dns', 'tcp', 'tls', 'sending', 'processing', 'receiving', 'done'];
  const currentStageIndex = stageOrder.indexOf(journey);

  const getStatusMeaning = (status: number): string => {
    const map: Record<number, string> = {
      200: 'OK',
      404: 'Not Found',
      500: 'Server Error',
      301: 'Moved Permanently',
      403: 'Forbidden',
      401: 'Unauthorized',
    };
    return map[status] || 'Unknown';
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="font-mono">
      <div className="rounded border border-zinc-800 bg-black overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wider font-heading">
            <SquareCode size={15} className="text-white" />
            HTTP / HTTPS NETWORK STACK JOURNEY
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Watch your request travel through DNS, TCP, TLS, and back — animated step by step with real data.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">URL TARGET</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://httpbin.org/get"
                className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">METHOD</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono focus:outline-none focus:border-white cursor-pointer"
              >
                {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider">HEADERS (ONE PER LINE: KEY: VALUE)</label>
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-white resize-y"
            />
          </div>

          {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">REQUEST BODY (JSON)</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder='{"key": "value"}'
                className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-white resize-y"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={run} disabled={result.status === 'running'} className="gap-2 uppercase text-xs">
              {result.status === 'running' ? <Loader2 size={14} className="animate-spin text-black" /> : <Play size={14} />}
              {result.status === 'running' ? 'RUNNING...' : '[ SEND REQUEST ]'}
            </Button>
            {timing !== null && result.status !== 'running' && (
              <span className="text-xs font-mono text-white font-bold">{timing}MS</span>
            )}
          </div>

          {/* Journey Visualization */}
          {(result.status === 'running' || result.status === 'success' || journey !== 'idle') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded border border-zinc-800 bg-[#080808] p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
                <span>STACK STAGE PROGRESS</span>
                <span className={journey === 'done' ? 'text-white font-bold' : 'text-zinc-500'}>
                  {journey === 'done' ? 'COMPLETE' : 'IN PROGRESS'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1">
                {stages.map((stage, idx) => {
                  const isActive = idx <= currentStageIndex && journey !== 'idle';
                  const Icon = stage.icon;
                  return (
                    <div key={stage.id} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-white text-black font-bold border-white'
                            : 'bg-black border-zinc-800 text-zinc-600'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <span className={`text-[9px] text-center leading-tight ${isActive ? 'text-white font-bold' : 'text-zinc-600'}`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {journeyData.requestHeaders && journey === 'done' && (
                <motion.div variants={stageVariants} className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded border border-zinc-800 bg-black p-3 space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">REQUEST TRANSMITTED</span>
                      <div className="text-[11px] font-mono text-zinc-300 space-y-0.5">
                        <div><span className="text-zinc-500">Method:</span> {method}</div>
                        <div><span className="text-zinc-500">Host:</span> {journeyData.host}</div>
                      </div>
                    </div>
                    <div className="rounded border border-zinc-800 bg-black p-3 space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">RESPONSE RECEIVED</span>
                      <div className="text-[11px] font-mono text-zinc-300 space-y-0.5">
                        {journeyData.status && <div className="text-white font-bold">{journeyData.status}</div>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Challenge Section */}
          {(result.status === 'success' || result.status === 'error') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded border border-zinc-800 bg-[#080808] p-5 space-y-5">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
                HTTP METHOD CHALLENGE
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded border border-zinc-800 bg-black p-4 space-y-3">
                  <div className="text-xs font-bold text-white uppercase">Scenario 1: Retrieve Data</div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Which HTTP method retrieves resource data without side effects?
                  </p>
                  <select
                    value={retrieveChoice}
                    onChange={(e) => { setRetrieveChoice(e.target.value); setRetrieveCorrect(null); }}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono focus:outline-none focus:border-white cursor-pointer"
                  >
                    <option value="">Select method...</option>
                    {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <Button variant="secondary" size="sm" onClick={validateRetrieve} disabled={!retrieveChoice} className="w-full uppercase text-xs">
                    [ CHECK ANSWER ]
                  </Button>
                  {retrieveCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[11px] p-2.5 rounded border ${retrieveCorrect ? 'border-white bg-zinc-950 text-white font-bold' : 'border-zinc-700 bg-zinc-950 text-zinc-400'}`}
                    >
                      {retrieveCorrect ? '✓ Correct. GET is safe and idempotent.' : 'Incorrect. GET is safe and idempotent.'}
                    </motion.div>
                  )}
                </div>

                <div className="rounded border border-zinc-800 bg-black p-4 space-y-3">
                  <div className="text-xs font-bold text-white uppercase">Scenario 2: Submit Form Data</div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Which method submits body data for server processing?
                  </p>
                  <select
                    value={submitChoice}
                    onChange={(e) => { setSubmitChoice(e.target.value); setSubmitCorrect(null); }}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono focus:outline-none focus:border-white cursor-pointer"
                  >
                    <option value="">Select method...</option>
                    {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <Button variant="secondary" size="sm" onClick={validateSubmit} disabled={!submitChoice} className="w-full uppercase text-xs">
                    [ CHECK ANSWER ]
                  </Button>
                  {submitCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[11px] p-2.5 rounded border ${submitCorrect ? 'border-white bg-zinc-950 text-white font-bold' : 'border-zinc-700 bg-zinc-950 text-zinc-400'}`}
                    >
                      {submitCorrect ? '✓ Correct. POST or PUT carries a payload.' : 'Incorrect. POST or PUT carries a payload.'}
                    </motion.div>
                  )}
                </div>
              </div>

              {resStatus !== null && (
                <div className="rounded border border-zinc-800 bg-black p-4 space-y-3">
                  <div className="text-xs font-bold text-white uppercase">
                    Status Code {resStatus} Meaning
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['OK', 'Not Found', 'Server Error', 'Moved Permanently', 'Forbidden', 'Unauthorized'].map((meaning) => (
                      <button
                        key={meaning}
                        onClick={() => { setStatusChoice(meaning); setStatusCorrect(null); }}
                        className={`px-3 py-2 rounded border text-xs font-mono transition-colors cursor-pointer ${
                          statusChoice === meaning
                            ? 'bg-white text-black font-bold border-white'
                            : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-500'
                        }`}
                      >
                        {meaning}
                      </button>
                    ))}
                  </div>
                  <Button variant="secondary" size="sm" onClick={validateStatus} disabled={!statusChoice} className="w-full uppercase text-xs">
                    [ CHECK STATUS MEANING ]
                  </Button>
                  {statusCorrect !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[11px] p-2.5 rounded border ${statusCorrect ? 'border-white bg-zinc-950 text-white font-bold' : 'border-zinc-700 bg-zinc-950 text-zinc-400'}`}
                    >
                      {statusCorrect ? `✓ Correct. ${resStatus} means ${getStatusMeaning(resStatus)}.` : `Incorrect. ${resStatus} means ${getStatusMeaning(resStatus)}.`}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {(result.status === 'success' || result.status === 'error') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded border border-zinc-800 bg-black overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-950">
                {result.status === 'success' ? (
                  <CheckCircle2 size={13} className="text-white" />
                ) : (
                  <AlertCircle size={13} className="text-white" />
                )}
                <span className="text-[11px] font-mono text-white font-bold uppercase">
                  {result.status === 'success' ? 'FULL HTTP OUTPUT' : 'ERROR OUTPUT'}
                </span>
                {result.status === 'error' && (
                  <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors ml-auto">
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
