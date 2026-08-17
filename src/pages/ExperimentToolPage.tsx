import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  SquareCode,
  Network,
  Globe2,
  Calculator,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { roadmap } from '@/data/roadmap';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

type LabStatus = 'idle' | 'running' | 'success' | 'error';

interface LabResult {
  status: LabStatus;
  output: string;
  error?: string;
}

const toolIcons: Record<string, typeof Calculator> = {
  Calculator,
  SquareCode,
  Network,
  Globe2,
};

export function ExperimentToolPage() {
  const { moduleId, toolId } = useParams<{ moduleId: string; toolId: string }>();
  const module = roadmap.find((m) => m.id === moduleId);

  if (!module || module.comingSoon || !toolId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-zinc-400 text-sm">Tool not found or module is not yet available.</p>
        <Link to="/labs" className="text-xs text-zinc-500 hover:text-white mt-2 inline-block">
          ← Back to Experiment Lab hub
        </Link>
      </div>
    );
  }

  const tool = module.tools?.find((t) => t.id === toolId);
  const ToolIcon = tool ? toolIcons[tool.icon] || Calculator : Calculator;

  const renderLab = () => {
    switch (toolId) {
      case 'subnet':
        return <SubnetCalculatorLab />;
      case 'http':
        return <HttpTesterLab />;
      case 'network':
        return <NetworkInspectorLab />;
      case 'dns':
        return <DnsResolverLab />;
      default:
        return (
          <div className="text-sm text-zinc-400">
            Tool "{toolId}" is not implemented yet.
          </div>
        );
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div variants={fadeUp}>
        <Link
          to={`/labs/${moduleId}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back to {module.title} Labs
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <ToolIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{tool?.name || toolId}</h1>
            <p className="text-sm text-zinc-400 mt-0.5">{tool?.description || 'Interactive tool'}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {renderLab()}
      </motion.div>
    </motion.div>
  );
}

/* ──────────────── LAB 1: Subnet Calculator ──────────────── */
function SubnetCalculatorLab() {
  const [ip, setIp] = useState('192.168.1.0');
  const [prefix, setPrefix] = useState('24');
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    setResult({ status: 'running', output: '' });
    setCopied(false);
    try {
      const ipNum = ipToNum(ip);
      const prefixLen = Math.min(32, Math.max(0, parseInt(prefix, 10) || 0));
      const mask = prefixLen === 0 ? 0 : 0xFFFFFFFF << (32 - prefixLen);
      const network = ipNum & mask;
      const broadcast = network | (~mask >>> 0);
      const firstUsable = prefixLen >= 31 ? network : network + 1;
      const lastUsable = prefixLen >= 31 ? broadcast : broadcast - 1;
      const totalHosts = prefixLen >= 31 ? (prefixLen === 32 ? 1 : 2) : (broadcast - network - 1);

      const output = [
        `Input:    ${ip}/${prefixLen}`,
        `Mask:     ${numToIp(mask)} (/${prefixLen})`,
        `Network:  ${numToIp(network >>> 0)}`,
        `Broadcast: ${numToIp(broadcast >>> 0)}`,
        `Usable:   ${numToIp(firstUsable >>> 0)} — ${numToIp(lastUsable >>> 0)}`,
        `Hosts:    ${totalHosts.toLocaleString()}`,
        `Class:    ${getIpClass(network >>> 0)}`,
        `Type:     ${isPrivate(network >>> 0) ? 'Private (RFC 1918)' : 'Public'}`,
        '',
        `Binary mask:  ${maskToString(mask)}`,
        `Wildcard:     ${numToIp((~mask) >>> 0)}`,
      ].join('\n');

      setResult({ status: 'success', output });
    } catch (e: unknown) {
      setResult({ status: 'error', output: '', error: e instanceof Error ? e.message : String(e) });
    }
  }, [ip, prefix]);

  const copy = () => {
    if (result.output) {
      navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Calculator size={15} className="text-zinc-400" />
          Subnet Calculator
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Enter an IPv4 address and CIDR prefix. Calculates network address, broadcast, usable range, and host count using real bitwise operations.</p>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">IP Address</label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.168.1.0"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">CIDR Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="24"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={run} disabled={result.status === 'running'} className="gap-2">
          {result.status === 'running' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {result.status === 'running' ? 'Calculating...' : 'Run Calculation'}
        </Button>

        {(result.status === 'success' || result.status === 'error') && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                {result.status === 'success' ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={13} className="text-red-400" />
                )}
                <span className="text-[11px] font-mono text-zinc-400">
                  {result.status === 'success' ? 'Result' : 'Error'}
                </span>
              </div>
              {result.status === 'success' && (
                <button onClick={copy} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
                  {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                </button>
              )}
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-x-auto">
              {result.status === 'error' ? `Error: ${result.error}` : result.output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────── LAB 2: HTTP Request Tester ──────────────── */
function HttpTesterLab() {
  const [url, setUrl] = useState('https://httpbin.org/get');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('Content-Type: application/json\nAccept: application/json');
  const [body, setBody] = useState('');
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });
  const [timing, setTiming] = useState<number | null>(null);

  const run = useCallback(async () => {
    setResult({ status: 'running', output: '' });
    setTiming(null);
    const start = performance.now();
    try {
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

      const res = await fetch(url, opts);
      const elapsed = performance.now() - start;
      setTiming(Math.round(elapsed));

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

      const output = [
        '> REQUEST',
        `${method} ${new URL(url).pathname + new URL(url).search} HTTP/1.1`,
        `Host: ${new URL(url).host}`,
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
    } catch (e: unknown) {
      const elapsed = performance.now() - start;
      setTiming(Math.round(elapsed));
      const msg = e instanceof Error ? e.message : String(e);
      setResult({
        status: 'error',
        output: '',
        error: `Request failed after ${Math.round(elapsed)}ms\n\n${msg}\n\nTip: The target may block CORS. Try a CORS-friendly endpoint or disable CORS in your browser for local testing.`,
      });
    }
  }, [url, method, headers, body]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <SquareCode size={15} className="text-zinc-400" />
          HTTP Request Tester
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Execute real HTTP requests from the browser. Uses native fetch — output is 100% live.</p>
      </div>

      <div className="p-5 space-y-4">
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
            rows={3}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-y"
          />
        </div>

        {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Request Body (JSON)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder='{"key": "value"}'
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-y"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={run} disabled={result.status === 'running'} className="gap-2">
            {result.status === 'running' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {result.status === 'running' ? 'Running...' : 'Send Request'}
          </Button>
          {timing !== null && result.status !== 'running' && (
            <span className="text-xs font-mono text-zinc-500">{timing}ms</span>
          )}
        </div>

        {(result.status === 'success' || result.status === 'error') && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
              {result.status === 'success' ? (
                <CheckCircle2 size={13} className="text-emerald-400" />
              ) : (
                <AlertCircle size={13} className="text-red-400" />
              )}
              <span className="text-[11px] font-mono text-zinc-400">
                {result.status === 'success' ? 'Response' : 'Error'}
              </span>
              {result.status === 'error' && (
                <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors ml-auto">
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-x-auto max-h-[500px] overflow-y-auto">
              {result.status === 'error' ? result.error : result.output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────── LAB 3: Network Inspector ──────────────── */
function NetworkInspectorLab() {
  const [info, setInfo] = useState<string>('Click "Inspect" to gather real browser network data.');
  const [status, setStatus] = useState<LabStatus>('idle');
  const [error, setError] = useState<string>('');

  const run = useCallback(async () => {
    setStatus('running');
    setError('');
    const lines: string[] = [];

    try {
      lines.push('=== Browser & Environment ===');
      lines.push(`User Agent:       ${navigator.userAgent}`);
      lines.push(`Platform:         ${navigator.platform}`);
      lines.push(`Language:         ${navigator.language}`);
      lines.push(`Cookies Enabled:  ${navigator.cookieEnabled}`);
      lines.push(`Do Not Track:     ${navigator.doNotTrack || 'unset'}`);
      lines.push('');

      lines.push('=== Network Information API ===');
      const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection;
      if (conn) {
        lines.push(`Effective Type:   ${conn.effectiveType || 'unknown'}`);
        lines.push(`Downlink:         ${conn.downlink ?? 'unknown'} Mbps`);
        lines.push(`RTT:              ${conn.rtt ?? 'unknown'} ms`);
        lines.push(`Save Data:        ${conn.saveData ? 'yes' : 'no'}`);
      } else {
        lines.push('Network Information API not supported in this browser.');
      }
      lines.push('');

      lines.push('=== RTCPeerConnection (Local Candidates) ===');
      const pc = new RTCPeerConnection({ iceServers: [] });
      const candidates: string[] = [];
      pc.onicecandidate = (e) => {
        if (e.candidate && e.candidate.candidate) {
          candidates.push(e.candidate.candidate);
        }
      };

      pc.createDataChannel('inspector');
      try {
        await pc.createOffer();
        await pc.setLocalDescription(await pc.createOffer());
      } catch {
        // some browsers require transceivers for gathering
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      pc.close();

      if (candidates.length > 0) {
        lines.push(`Found ${candidates.length} ICE candidate(s):`);
        candidates.forEach((c) => lines.push(`  ${c}`));
        const hostCandidates = candidates.filter((c) => c.includes('host'));
        if (hostCandidates.length > 0) {
          lines.push('');
          lines.push('Host candidates (local IPs):');
          hostCandidates.forEach((c) => {
            const match = c.match(/ (\d+\.\d+\.\d+\.\d+) /);
            lines.push(`  ${match ? match[1] : c}`);
          });
        }
      } else {
        lines.push('No local candidates gathered. Browser may restrict ICE gathering without media transceivers.');
      }
      lines.push('');

      lines.push('=== Connection State ===');
      lines.push(`Online:           ${navigator.onLine ? 'yes' : 'no'}`);

      setStatus('success');
      setInfo(lines.join('\n'));
    } catch (e: unknown) {
      setStatus('error');
      setError(e instanceof Error ? e.message : String(e));
      setInfo(lines.join('\n'));
    }
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Network size={15} className="text-zinc-400" />
          Network Inspector
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Reads real browser APIs: Network Information, RTCPeerConnection, and online status. No external calls.</p>
      </div>

      <div className="p-5 space-y-4">
        <Button variant="primary" size="sm" onClick={run} disabled={status === 'running'} className="gap-2">
          {status === 'running' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {status === 'running' ? 'Inspecting...' : 'Run Inspection'}
        </Button>

        {(status === 'success' || status === 'error') && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
              {status === 'success' ? (
                <CheckCircle2 size={13} className="text-emerald-400" />
              ) : (
                <AlertCircle size={13} className="text-red-400" />
              )}
              <span className="text-[11px] font-mono text-zinc-400">
                {status === 'success' ? 'Live Output' : 'Error'}
              </span>
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-x-auto">
              {status === 'error' ? `${error}\n\n${info}` : info}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────── LAB 4: DNS Resolver ──────────────── */
function DnsResolverLab() {
  const [domain, setDomain] = useState('example.com');
  const [type, setType] = useState<'A' | 'AAAA' | 'MX' | 'TXT' | 'ANY'>('A');
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });

  const run = useCallback(async () => {
    setResult({ status: 'running', output: '' });
    try {
      const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
      const res = await fetch(url, {
        headers: { Accept: 'application/dns-json' },
      });
      const data = await res.json();
      const lines: string[] = [
        `Query:     ${domain} (${type})`,
        `Status:    ${data.Status} (${data.Status === 0 ? 'NOERROR' : 'ERROR'})`,
        `RD:        ${data.RD ? 'recursion desired' : 'no recursion'}`,
        `RA:        ${data.RA ? 'recursion available' : 'no recursion'}`,
        `AD:        ${data.AD ? 'authentic data' : 'not authenticated'}`,
        `TC:        ${data.TC ? 'truncated' : 'complete'}`,
        '',
      ];

      if (data.Answer && data.Answer.length > 0) {
        lines.push('=== Answers ===');
        data.Answer.forEach((a: { name: string; type: number; TTL: number; data: string }) => {
          const typeName = dnsTypeName(a.type);
          lines.push(`${a.name}  ${typeName}  TTL=${a.TTL}  ${a.data}`);
        });
        lines.push('');
      }

      if (data.Authority && data.Authority.length > 0) {
        lines.push('=== Authority ===');
        data.Authority.forEach((a: { name: string; type: number; TTL: number; data: string }) => {
          lines.push(`${a.name}  ${dnsTypeName(a.type)}  TTL=${a.TTL}  ${a.data}`);
        });
        lines.push('');
      }

      if (data.Additional && data.Additional.length > 0) {
        lines.push('=== Additional ===');
        data.Additional.forEach((a: { name: string; type: number; TTL: number; data: string }) => {
          lines.push(`${a.name}  ${dnsTypeName(a.type)}  TTL=${a.TTL}  ${a.data}`);
        });
      }

      if ((!data.Answer || data.Answer.length === 0) && (!data.Authority || data.Authority.length === 0)) {
        lines.push('No records returned. The domain may not exist or the record type may not be configured.');
      }

      setResult({ status: 'success', output: lines.join('\n') });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setResult({
        status: 'error',
        output: '',
        error: `DNS-over-HTTPS query failed.\n\n${msg}\n\nPossible causes:\n- Cloudflare DoH endpoint blocked by network\n- Invalid domain format\n- Browser privacy settings blocking mixed content\n\nEndpoint used: https://cloudflare-dns.com/dns-query`,
      });
    }
  }, [domain, type]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Globe2 size={15} className="text-zinc-400" />
          DNS Resolver
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Queries real DNS records via Cloudflare DNS-over-HTTPS (1.1.1.1). Results are live.</p>
      </div>

      <div className="p-5 space-y-4">
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

        {(result.status === 'success' || result.status === 'error') && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
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
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────── Helpers ──────────────── */
function ipToNum(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + (parseInt(oct, 10) || 0), 0) >>> 0;
}

function numToIp(num: number): string {
  return [
    (num >>> 24) & 0xFF,
    (num >>> 16) & 0xFF,
    (num >>> 8) & 0xFF,
    num & 0xFF,
  ].join('.');
}

function maskToString(mask: number): string {
  const bits = Array.from({ length: 32 }, (_, i) => ((mask >>> (31 - i)) & 1) === 1 ? '1' : '0');
  const groups = [];
  for (let i = 0; i < 32; i += 8) {
    groups.push(bits.slice(i, i + 8).join(''));
  }
  return groups.join('.');
}

function getIpClass(num: number): string {
  const first = (num >>> 24) & 0xFF;
  if (first <= 127) return 'A';
  if (first <= 191) return 'B';
  if (first <= 223) return 'C';
  if (first <= 239) return 'D (Multicast)';
  return 'E (Reserved)';
}

function isPrivate(num: number): boolean {
  const first = (num >>> 24) & 0xFF;
  const second = (num >>> 16) & 0xFF;
  if (first === 10) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  return false;
}

const DNS_TYPE_NAMES: Record<number, string> = {
  1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR', 15: 'MX',
  16: 'TXT', 28: 'AAAA', 33: 'SRV', 41: 'OPT',
};

function dnsTypeName(type: number): string {
  return DNS_TYPE_NAMES[type] || `TYPE${type}`;
}
