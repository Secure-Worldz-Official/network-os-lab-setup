import { useState, useCallback, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Calculator, Play, Loader2, AlertCircle, CheckCircle2, Copy, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import type { LabResult } from './labUtils';

const LAB_ID = 'subnet';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const bitContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.012, delayChildren: 0.05 } },
};

const bitCell: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

const resultStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
};

const resultLine: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export function SubnetCalculatorLab() {
  const { verifyAndComplete } = useTask();
  const [ip, setIp] = useState('192.168.1.0');
  const [prefix, setPrefix] = useState('24');
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });
  const [copied, setCopied] = useState(false);
  const [selectedBits, setSelectedBits] = useState<Set<number>>(new Set());
  const [animStage, setAnimStage] = useState<'idle' | 'validating' | 'bits' | 'mask' | 'results'>('idle');

  const computed = useMemo(() => {
    try {
      const ipNum = ipToNum(ip);
      const prefixLen = Math.min(32, Math.max(0, parseInt(prefix, 10) || 0));
      const mask = prefixLen === 0 ? 0 : 0xFFFFFFFF << (32 - prefixLen);
      const network = ipNum & mask;
      const broadcast = network | (~mask >>> 0);
      const firstUsable = prefixLen >= 31 ? network : network + 1;
      const lastUsable = prefixLen >= 31 ? broadcast : broadcast - 1;
      const totalHosts = prefixLen >= 31 ? (prefixLen === 32 ? 1 : 2) : (broadcast - network - 1);
      return {
        ipNum,
        prefixLen,
        mask,
        network: network >>> 0,
        broadcast: broadcast >>> 0,
        firstUsable: firstUsable >>> 0,
        lastUsable: lastUsable >>> 0,
        totalHosts,
        ipBits: Array.from({ length: 32 }, (_, i) => ((ipNum >>> (31 - i)) & 1)),
        valid: true,
      };
    } catch {
      return {
        ipNum: 0,
        prefixLen: 0,
        mask: 0,
        network: 0,
        broadcast: 0,
        firstUsable: 0,
        lastUsable: 0,
        totalHosts: 0,
        ipBits: Array(32).fill(0),
        valid: false,
      };
    }
  }, [ip, prefix]);

  const correctBitsValid = computed.valid && selectedBits.size === computed.prefixLen && Array.from(selectedBits).every((i) => i < computed.prefixLen);

  const toggleBit = useCallback((index: number) => {
    if (animStage !== 'idle') return;
    setSelectedBits((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, [animStage]);

  const run = useCallback(() => {
    if (!computed.valid || !correctBitsValid) return;
    const { prefixLen, mask, network, broadcast, firstUsable, lastUsable, totalHosts } = computed;
    setResult({ status: 'running', output: '' });
    setCopied(false);
    setAnimStage('bits');

    setTimeout(() => setAnimStage('mask'), 500);
    setTimeout(() => {
      const output = [
        `Input:    ${ip}/${prefixLen}`,
        `Mask:     ${numToIp(mask)} (/${prefixLen})`,
        `Network:  ${numToIp(network)}`,
        `Broadcast: ${numToIp(broadcast)}`,
        `Usable:   ${numToIp(firstUsable)} — ${numToIp(lastUsable)}`,
        `Hosts:    ${totalHosts.toLocaleString()}`,
        `Class:    ${getIpClass(network)}`,
        `Type:     ${isPrivate(network) ? 'Private (RFC 1918)' : 'Public'}`,
        '',
        `Binary mask:  ${maskToString(mask)}`,
        `Wildcard:     ${numToIp((~mask) >>> 0)}`,
      ].join('\n');

      setResult({ status: 'success', output });
      setAnimStage('results');
      verifyAndComplete(LAB_ID, output);
    }, 1200);
  }, [ip, prefix, computed, correctBitsValid, verifyAndComplete]);

  const copy = () => {
    if (result.output) {
      navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const reset = () => {
    setResult({ status: 'idle', output: '' });
    setAnimStage('idle');
    setCopied(false);
    setSelectedBits(new Set());
  };

  const showVisualization = computed.valid && (animStage !== 'idle' || result.status !== 'idle');

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="font-mono">
      <div className="rounded border border-zinc-800 bg-black overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wider font-heading">
            <Calculator size={15} className="text-white" />
            SUBNET CALCULATOR LAB
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Select the correct number of network bits on the grid, then reveal real subnet calculations.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">IP ADDRESS</label>
              <input
                type="text"
                value={ip}
                onChange={(e) => { setIp(e.target.value); reset(); }}
                placeholder="192.168.1.0"
                className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider">CIDR PREFIX</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => { setPrefix(e.target.value); reset(); }}
                placeholder="24"
                className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-xs text-white font-mono placeholder-zinc-700 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={run} disabled={!computed.valid || !correctBitsValid || animStage !== 'idle'} className="gap-2 uppercase text-xs">
              {animStage !== 'idle' ? <Loader2 size={14} className="animate-spin text-black" /> : <Play size={14} />}
              {animStage !== 'idle' ? 'EXPLORING...' : '[ REVEAL RESULTS ]'}
            </Button>
            {showVisualization && (
              <button onClick={reset} className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer uppercase font-mono">[ RESET ]</button>
            )}
          </div>

          {computed.valid && (
            <div className="rounded border border-zinc-800 bg-[#080808] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                  SELECT EXACTLY {computed.prefixLen} NETWORK BITS (LEFT TO RIGHT)
                </span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-white font-bold"><span className="w-2 h-2 rounded-full bg-white" /> NETWORK ({selectedBits.size}/{computed.prefixLen})</span>
                  <span className="flex items-center gap-1 text-zinc-500"><span className="w-2 h-2 rounded-full bg-zinc-700" /> HOST</span>
                </div>
              </div>

              <motion.div variants={bitContainer} initial="hidden" animate={animStage === 'bits' || animStage === 'mask' || animStage === 'results' ? 'show' : 'hidden'} className="flex flex-wrap gap-1">
                {computed.ipBits.map((bit, i) => {
                  const isSelected = selectedBits.has(i);
                  const isNetwork = i < computed.prefixLen;
                  return (
                    <motion.button
                      key={i}
                      variants={bitCell}
                      onClick={() => toggleBit(i)}
                      disabled={animStage !== 'idle'}
                      className={`w-7 h-9 rounded flex items-center justify-center text-[10px] font-mono font-bold border transition-all duration-200 cursor-pointer disabled:cursor-default ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                          : isNetwork && animStage !== 'idle'
                          ? 'bg-zinc-900 text-white border-zinc-700'
                          : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500'
                      }`}
                    >
                      {bit}
                    </motion.button>
                  );
                })}
              </motion.div>

              {selectedBits.size > 0 && correctBitsValid && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-white font-bold">
                  <CheckCircle2 size={14} />
                  ✓ Correct! {selectedBits.size} network bits selected. You can reveal results.
                </motion.div>
              )}

              {selectedBits.size > 0 && !correctBitsValid && animStage === 'idle' && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-zinc-400">
                  <MousePointerClick size={14} />
                  {selectedBits.size < computed.prefixLen
                    ? `Select ${computed.prefixLen - selectedBits.size} more bit(s)`
                    : `Too many bits selected — deselect ${selectedBits.size - computed.prefixLen}`}
                </motion.div>
              )}

              {(animStage === 'mask' || animStage === 'results') && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <span className="text-zinc-500">MASK:</span>
                  <span className="text-white font-bold">{numToIp(computed.mask)}</span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-white font-bold">/{computed.prefixLen}</span>
                  <span className="text-zinc-500 ml-2">({computed.prefixLen} NETWORK + {32 - computed.prefixLen} HOST)</span>
                </motion.div>
              )}
            </div>
          )}

          {showVisualization && computed.valid && (
            <motion.div variants={resultStagger} initial="hidden" animate="show" className="rounded border border-zinc-800 bg-[#080808] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-white" />
                  <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">CALCULATED RESULTS</span>
                </div>
                {result.status === 'success' && (
                  <button onClick={copy} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    {copied ? <CheckCircle2 size={13} className="text-white" /> : <Copy size={13} />}
                  </button>
                )}
              </div>
              <div className="p-4 space-y-2">
                {[
                  { label: 'NETWORK', value: numToIp(computed.network), color: 'text-white font-bold' },
                  { label: 'BROADCAST', value: numToIp(computed.broadcast), color: 'text-zinc-300' },
                  { label: 'RANGE', value: `${numToIp(computed.firstUsable)} — ${numToIp(computed.lastUsable)}`, color: 'text-white' },
                  { label: 'HOSTS', value: computed.totalHosts.toLocaleString(), color: 'text-zinc-300' },
                  { label: 'CLASS', value: getIpClass(computed.network), color: 'text-zinc-300' },
                  { label: 'TYPE', value: isPrivate(computed.network) ? 'PRIVATE (RFC 1918)' : 'PUBLIC', color: 'text-white' },
                ].map((item) => (
                  <motion.div key={item.label} variants={resultLine} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono w-28 uppercase">{item.label}</span>
                    <span className={`font-mono ${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {result.status === 'error' && (
            <div className="rounded border border-zinc-800 bg-black overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-950">
                <AlertCircle size={13} className="text-white" />
                <span className="text-[11px] font-mono text-white">ERROR</span>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap">
                {result.error}
              </pre>
            </div>
          )}
        </div>
        <TaskPanel labId={LAB_ID} />
      </div>
    </motion.div>
  );
}

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
  const groups: string[] = [];
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
