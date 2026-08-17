import { useState, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Globe2, Play, Loader2, AlertCircle, CheckCircle2, Globe, Shield, Server } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import { type LabResult } from './labUtils';

const LAB_ID = 'dns';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const chainNode: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

const stageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const resultItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

type ResolutionStage = 'idle' | 'querying' | 'processing' | 'answers' | 'authority' | 'additional' | 'done';

const RESOLVER_ICONS = [
  { id: 'browser', label: 'Browser', icon: Globe, color: 'text-cyan-300' },
  { id: 'resolver', label: 'DoH Resolver', icon: Shield, color: 'text-emerald-300' },
  { id: 'response', label: 'Response', icon: Server, color: 'text-amber-300' },
];

export function DnsResolverLab() {
  const { verifyAndComplete } = useTask();
  const [domain, setDomain] = useState('example.com');
  const [type, setType] = useState<'A' | 'AAAA' | 'MX' | 'TXT' | 'ANY'>('A');
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });
  const [stage, setStage] = useState<ResolutionStage>('idle');
  const [dnsData, setDnsData] = useState<{
    status?: number;
    statusText?: string;
    flags?: { rd?: boolean; ra?: boolean; ad?: boolean; tc?: boolean };
    answers?: { name: string; type: number; ttl: number; data: string }[];
    authority?: { name: string; type: number; ttl: number; data: string }[];
    additional?: { name: string; type: number; ttl: number; data: string }[];
  }>({});

  const [c1Selected, setC1Selected] = useState<string>('');
  const [c1Submitted, setC1Submitted] = useState(false);
  const [c1Correct, setC1Correct] = useState<boolean | null>(null);

  const [c2Input, setC2Input] = useState('');
  const [c2Submitted, setC2Submitted] = useState(false);
  const [c2Correct, setC2Correct] = useState<boolean | null>(null);

  const run = useCallback(async () => {
    setResult({ status: 'running', output: '' });
    setDnsData({});
    setStage('querying');
    setC1Selected('');
    setC1Submitted(false);
    setC1Correct(null);
    setC2Input('');
    setC2Submitted(false);
    setC2Correct(null);

    try {
      await new Promise((r) => setTimeout(r, 500));
      setStage('processing');

      const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
      const res = await fetch(url, {
        headers: { Accept: 'application/dns-json' },
      });
      const data = await res.json();

      await new Promise((r) => setTimeout(r, 400));
      setStage('answers');

      const answers = (data.Answer || []).map((a: { name: string; type: number; TTL: number; data: string }) => ({
        name: a.name,
        type: a.type,
        ttl: a.TTL,
        data: a.data,
      }));
      setDnsData((prev) => ({ ...prev, answers }));

      await new Promise((r) => setTimeout(r, 300));
      setStage('authority');

      const authority = (data.Authority || []).map((a: { name: string; type: number; TTL: number; data: string }) => ({
        name: a.name,
        type: a.type,
        ttl: a.TTL,
        data: a.data,
      }));
      setDnsData((prev) => ({ ...prev, authority }));

      await new Promise((r) => setTimeout(r, 300));
      setStage('additional');

      const additional = (data.Additional || []).map((a: { name: string; type: number; TTL: number; data: string }) => ({
        name: a.name,
        type: a.type,
        ttl: a.TTL,
        data: a.data,
      }));
      setDnsData((prev) => ({ ...prev, additional, status: data.Status, statusText: data.Status === 0 ? 'NOERROR' : 'ERROR', flags: { rd: data.RD, ra: data.RA, ad: data.AD, tc: data.TC } }));

      await new Promise((r) => setTimeout(r, 200));
      setStage('done');

      const lines = [
        `Query:     ${domain} (${type})`,
        `Status:    ${data.Status} (${data.Status === 0 ? 'NOERROR' : 'ERROR'})`,
        `RD:        ${data.RD ? 'recursion desired' : 'no recursion'}`,
        `RA:        ${data.RA ? 'recursion available' : 'no recursion'}`,
        `AD:        ${data.AD ? 'authentic data' : 'not authenticated'}`,
        `TC:        ${data.TC ? 'truncated' : 'complete'}`,
        '',
        ...(answers.length > 0 ? ['=== Answers ===', ...answers.map((a: { name: string; type: number; ttl: number; data: string }) => `${a.name}  ${dnsTypeName(a.type)}  TTL=${a.ttl}  ${a.data}`), ''] : []),
        ...(authority.length > 0 ? ['=== Authority ===', ...authority.map((a: { name: string; type: number; ttl: number; data: string }) => `${a.name}  ${dnsTypeName(a.type)}  TTL=${a.ttl}  ${a.data}`), ''] : []),
        ...(additional.length > 0 ? ['=== Additional ===', ...additional.map((a: { name: string; type: number; ttl: number; data: string }) => `${a.name}  ${dnsTypeName(a.type)}  TTL=${a.ttl}  ${a.data}`)] : []),
        ...(answers.length === 0 && authority.length === 0 ? ['No records returned. The domain may not exist or the record type may not be configured.'] : []),
      ];

      const output = lines.join('\n');
      setResult({ status: 'success', output });
      verifyAndComplete(LAB_ID, output);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStage('done');
      setResult({
        status: 'error',
        output: '',
        error: `DNS-over-HTTPS query failed.\n\n${msg}\n\nPossible causes:\n- Cloudflare DoH endpoint blocked by network\n- Invalid domain format\n- Browser privacy settings blocking mixed content\n\nEndpoint used: https://cloudflare-dns.com/dns-query`,
      });
      verifyAndComplete(LAB_ID, '', `DNS-over-HTTPS query failed.\n\n${msg}`);
    }
  }, [domain, type, verifyAndComplete]);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Globe2 size={15} className="text-zinc-400" />
            DNS Resolution Chain Visualizer
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Watch DNS resolution happen step-by-step with real Cloudflare DoH responses.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Record Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 font-mono focus:outline-none focus:border-zinc-600 transition-colors cursor-pointer"
              >
                {(['A', 'AAAA', 'MX', 'TXT', 'ANY'] as const).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={run} disabled={result.status === 'running'} className="gap-2">
            {result.status === 'running' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {result.status === 'running' ? 'Resolving...' : 'Resolve DNS'}
          </Button>

          {/* Resolution Chain Visualization */}
          {(result.status === 'running' || result.status === 'success' || stage !== 'idle') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <span>Resolution Chain</span>
                <span className={stage === 'done' ? 'text-emerald-400' : 'text-zinc-500'}>
                  {stage === 'done' ? 'Complete' : stage === 'idle' ? 'Ready' : 'Resolving...'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                {RESOLVER_ICONS.map((node, idx) => {
                  const isActive = stage !== 'idle';
                  const isPassed = ['querying', 'processing', 'answers', 'authority', 'additional', 'done'].includes(stage) && idx < 2;
                  const isCurrent = idx === 1 && ['processing', 'answers', 'authority', 'additional'].includes(stage);
                  return (
                    <div key={node.id} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        variants={chainNode}
                        animate={isActive ? { scale: isCurrent ? [1, 1.1, 1] : 1 } : { scale: 1 }}
                        transition={isCurrent ? { repeat: Infinity, duration: 1.5 } : {}}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300 ${
                          isPassed
                            ? `${node.color.replace('text-', 'border-').replace('-300', '-500/50')} bg-zinc-900`
                            : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                        }`}
                      >
                        <node.icon size={18} className={isPassed ? node.color : 'text-zinc-600'} />
                      </motion.div>
                      <span className={`text-[9px] font-mono text-center leading-tight ${isPassed ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {node.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status & Flags */}
              {dnsData.status !== undefined && (
                <motion.div variants={stageVariants} className="space-y-2 pt-2 border-t border-zinc-800/60">
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <div className={dnsData.status === 0 ? 'text-emerald-300' : 'text-red-300'}>
                      Status: {dnsData.statusText} ({dnsData.status})
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                      {dnsData.flags?.rd && <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">RD</span>}
                      {dnsData.flags?.ra && <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">RA</span>}
                      {dnsData.flags?.ad && <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">AD</span>}
                      {dnsData.flags?.tc && <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">TC</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* DNS Records */}
              {(dnsData.answers?.length || dnsData.authority?.length || dnsData.additional?.length) && (
                <motion.div variants={stageVariants} className="space-y-2 pt-2 border-t border-zinc-800/60">
                  {dnsData.answers && dnsData.answers.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Answers ({dnsData.answers.length})</span>
                      {dnsData.answers.map((record, i) => (
                        <motion.div
                          key={i}
                          variants={resultItem}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-2 text-xs font-mono bg-zinc-900/50 rounded px-2 py-1.5"
                        >
                          <span className="text-zinc-400 truncate flex-1">{record.name}</span>
                          <span className="text-cyan-300">{dnsTypeName(record.type)}</span>
                          <span className="text-zinc-500">TTL={record.ttl}</span>
                          <span className="text-emerald-300 truncate max-w-[120px]">{record.data}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Challenges */}
          {stage === 'done' && result.status === 'success' && dnsData.answers && dnsData.answers.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-4">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Hands-on Challenges
              </div>

              {/* Challenge 1 */}
              <div className="space-y-2">
                <p className="text-xs text-zinc-300 font-mono">1. Which record type provides an IPv4 address?</p>
                <div className="flex flex-wrap gap-2">
                  {['A', 'AAAA', 'MX', 'TXT'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setC1Selected(opt); setC1Submitted(false); setC1Correct(null); }}
                      className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
                        c1Selected === opt
                          ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                      } ${c1Submitted ? 'opacity-70' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const isACorrect = (type === 'A' && dnsData.answers?.some((a) => a.type === 1)) ?? false;
                      setC1Correct(c1Selected === 'A' && isACorrect);
                      setC1Submitted(true);
                    }}
                    disabled={!c1Selected || c1Submitted}
                    className="px-3 py-1.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                  {c1Submitted && c1Correct !== null && (
                    <span className={`text-xs font-mono flex items-center gap-1 ${c1Correct ? 'text-emerald-400' : 'text-red-400'}`}>
                      {c1Correct ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {c1Correct ? 'Correct! A records store IPv4 addresses.' : 'Incorrect. A records provide IPv4 addresses.'}
                    </span>
                  )}
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="space-y-2">
                <p className="text-xs text-zinc-300 font-mono">2. What is the IP address returned for {domain}?</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={c2Input}
                    onChange={(e) => { setC2Input(e.target.value); setC2Submitted(false); setC2Correct(null); }}
                    placeholder="e.g. 93.184.216.34"
                    className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                  <button
                    onClick={() => {
                      const expectedIP = dnsData.answers?.[0]?.data;
                      setC2Correct(expectedIP !== undefined && c2Input.trim() === expectedIP);
                      setC2Submitted(true);
                    }}
                    disabled={!c2Input || c2Submitted}
                    className="px-3 py-1.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
                {c2Submitted && c2Correct !== null && (
                  <p className={`text-xs font-mono flex items-center gap-1 ${c2Correct ? 'text-emerald-400' : 'text-red-400'}`}>
                    {c2Correct ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {c2Correct
                      ? `Correct! ${dnsData.answers?.[0]?.data}`
                      : `Incorrect. The IP is ${dnsData.answers?.[0]?.data}`}
                  </p>
                )}
              </div>
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
                  {result.status === 'success' ? 'DNS Response' : 'Error'}
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-x-auto">
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

const DNS_TYPE_NAMES: Record<number, string> = {
  1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR', 15: 'MX',
  16: 'TXT', 28: 'AAAA', 33: 'SRV', 41: 'OPT',
};

function dnsTypeName(type: number): string {
  return DNS_TYPE_NAMES[type] || `TYPE${type}`;
}
