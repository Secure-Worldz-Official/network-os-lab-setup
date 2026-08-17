import { useState, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Network, Play, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import { type LabResult } from './labUtils';

const LAB_ID = 'network';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export function NetworkInspectorLab() {
  const { verifyAndComplete } = useTask();
  const [info, setInfo] = useState<string>('Click "Inspect" to gather real browser network data.');
  const [status, setStatus] = useState<LabResult['status']>('idle');
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
      verifyAndComplete(LAB_ID, lines.join('\n'));
    } catch (e: unknown) {
      setStatus('error');
      setError(e instanceof Error ? e.message : String(e));
      setInfo(lines.join('\n'));
      verifyAndComplete(LAB_ID, lines.join('\n'), e instanceof Error ? e.message : String(e));
    }
  }, [verifyAndComplete]);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
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
        <TaskPanel labId={LAB_ID} />
      </div>
    </motion.div>
  );
}
