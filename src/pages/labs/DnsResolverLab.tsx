import { useState, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Globe2, Play, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import { type LabResult } from './labUtils';

const LAB_ID = 'dns';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const DNS_TYPE_NAMES: Record<number, string> = {
  1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 12: 'PTR', 15: 'MX',
  16: 'TXT', 28: 'AAAA', 33: 'SRV', 41: 'OPT',
};

function dnsTypeName(type: number): string {
  return DNS_TYPE_NAMES[type] || `TYPE${type}`;
}

export function DnsResolverLab() {
  const { verifyAndComplete } = useTask();
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
      verifyAndComplete(LAB_ID, lines.join('\n'));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
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
        <TaskPanel labId={LAB_ID} />
      </div>
    </motion.div>
  );
}
