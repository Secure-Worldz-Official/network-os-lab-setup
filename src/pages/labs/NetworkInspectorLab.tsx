import { useState, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Network, Play, Loader2, AlertCircle, CheckCircle2, Monitor, Wifi, Globe, Radio } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import { type LabResult } from './labUtils';

const LAB_ID = 'network';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const pulseRing: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  show: {
    scale: [0.8, 1.4, 0.8],
    opacity: [0, 0.6, 0],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
};

const panelReveal: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
};

type ScanPhase = 'idle' | 'browser' | 'network' | 'local' | 'connection' | 'done';

interface BrowserData {
  ua: string;
  platform: string;
  language: string;
  cookies: string;
  dnt: string;
}

interface NetworkData {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface ChallengeQuestion {
  text: string;
  answer: string;
  hint?: string;
}

export function NetworkInspectorLab() {
  const { verifyAndComplete } = useTask();
  const [info, setInfo] = useState<string>('');
  const [status, setStatus] = useState<LabResult['status']>('idle');
  const [error, setError] = useState<string>('');
  const [scanPhase, setScanPhase] = useState<ScanPhase>('idle');
  const [browserData, setBrowserData] = useState<BrowserData | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [localCandidates, setLocalCandidates] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [challenge, setChallenge] = useState<ChallengeQuestion | null>(null);
  const [challengeInput, setChallengeInput] = useState<string>('');
  const [challengeResult, setChallengeResult] = useState<'pass' | 'fail' | null>(null);

  const generateChallenge = useCallback((browser: BrowserData, network: NetworkData, connection: string): ChallengeQuestion => {
    const pool: ChallengeQuestion[] = [];

    if (network.effectiveType && network.effectiveType !== 'N/A') {
      pool.push({ text: 'What is your effective connection type?', answer: network.effectiveType.toLowerCase(), hint: 'Check the Network Information API result' });
    }
    pool.push({ text: 'Are cookies enabled?', answer: browser.cookies.toLowerCase(), hint: 'Check the Browser panel' });
    pool.push({ text: 'What is your browser platform?', answer: browser.platform.toLowerCase(), hint: 'Check the Browser panel' });
    pool.push({ text: 'What is your browser language?', answer: browser.language.toLowerCase(), hint: 'Check the Browser panel' });
    if (connection) {
      pool.push({ text: 'Are you currently online?', answer: connection.toLowerCase(), hint: 'Check the Connection panel' });
    }
    pool.push({ text: 'Is Do Not Track enabled?', answer: browser.dnt.toLowerCase(), hint: 'Check the Browser panel' });

    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  }, []);

  const handleSubmitChallenge = useCallback(() => {
    if (!challenge) return;
    const normalized = challengeInput.trim().toLowerCase();
    if (normalized === challenge.answer.toLowerCase()) {
      setChallengeResult('pass');
    } else {
      setChallengeResult('fail');
    }
  }, [challenge, challengeInput]);

  const handleNewChallenge = useCallback(() => {
    if (!browserData || !networkData) return;
    const q = generateChallenge(browserData, networkData, connectionStatus);
    setChallenge(q);
    setChallengeInput('');
    setChallengeResult(null);
  }, [browserData, networkData, connectionStatus, generateChallenge]);

  const run = useCallback(async () => {
    setStatus('running');
    setError('');
    setInfo('');
    setBrowserData(null);
    setNetworkData(null);
    setLocalCandidates([]);
    setConnectionStatus('');
    setScanPhase('browser');
    setChallenge(null);
    setChallengeInput('');
    setChallengeResult(null);

    try {
      await new Promise((r) => setTimeout(r, 500));

      const browser: BrowserData = {
        ua: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookies: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
        dnt: navigator.doNotTrack === '1' ? 'Enabled' : 'Unset',
      };
      setBrowserData(browser);

      await new Promise((r) => setTimeout(r, 600));
      setScanPhase('network');

      await new Promise((r) => setTimeout(r, 500));
      const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number; rtt?: number; saveData?: boolean } }).connection;
      const network: NetworkData = {
        effectiveType: conn?.effectiveType || 'N/A',
        downlink: conn?.downlink ?? -1,
        rtt: conn?.rtt ?? -1,
        saveData: conn?.saveData ?? false,
      };
      setNetworkData(network);

      await new Promise((r) => setTimeout(r, 600));
      setScanPhase('local');

      const pc = new RTCPeerConnection({ iceServers: [] });
      const candidates: string[] = [];
      pc.onicecandidate = (e) => {
        if (e.candidate && e.candidate.candidate) {
          candidates.push(e.candidate.candidate);
          setLocalCandidates([...candidates]);
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

      await new Promise((r) => setTimeout(r, 400));
      setScanPhase('connection');

      await new Promise((r) => setTimeout(r, 400));
      const onlineStatus = navigator.onLine ? 'Online' : 'Offline';
      setConnectionStatus(onlineStatus);

      const lines = [
        ...(browser.ua ? [`User Agent:       ${browser.ua}`] : []),
        ...(browser.platform ? [`Platform:         ${browser.platform}`] : []),
        ...(browser.language ? [`Language:         ${browser.language}`] : []),
        ...(browser.cookies ? [`Cookies Enabled:  ${browser.cookies}`] : []),
        ...(browser.dnt ? [`Do Not Track:     ${browser.dnt}`] : []),
        '',
        '=== Network Information API ===',
        ...(network.effectiveType !== 'N/A' ? [`Effective Type:   ${network.effectiveType}`] : ['Network Information API not supported in this browser.']),
        ...(network.downlink >= 0 ? [`Downlink:         ${network.downlink} Mbps`] : []),
        ...(network.rtt >= 0 ? [`RTT:              ${network.rtt} ms`] : []),
        `Save Data:        ${network.saveData ? 'yes' : 'no'}`,
        '',
        '=== RTCPeerConnection (Local Candidates) ===',
        ...(candidates.length > 0 ? [`Found ${candidates.length} ICE candidate(s):`, ...candidates.slice(0, 5).map((c) => `  ${c}`)] : ['No local candidates gathered.']),
        '',
        '=== Connection State ===',
        `Online:           ${navigator.onLine ? 'yes' : 'no'}`,
      ];

      setInfo(lines.join('\n'));
      setStatus('success');
      setScanPhase('done');

      const q = generateChallenge(browser, network, onlineStatus);
      setChallenge(q);
      setChallengeInput('');
      setChallengeResult(null);

      verifyAndComplete(LAB_ID, lines.join('\n'));
    } catch (e: unknown) {
      setStatus('error');
      setError(e instanceof Error ? e.message : String(e));
      setScanPhase('done');
      verifyAndComplete(LAB_ID, '', e instanceof Error ? e.message : String(e));
    }
  }, [verifyAndComplete, generateChallenge]);

  const panels = [
    { phase: 'browser' as ScanPhase, label: 'Browser', icon: Monitor, data: browserData, color: 'text-blue-300' },
    { phase: 'network' as ScanPhase, label: 'Network', icon: Wifi, data: networkData, color: 'text-emerald-300' },
    { phase: 'local' as ScanPhase, label: 'Local IP', icon: Globe, data: localCandidates, color: 'text-amber-300' },
    { phase: 'connection' as ScanPhase, label: 'Connection', icon: Radio, data: connectionStatus, color: 'text-violet-300' },
  ];

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Network size={15} className="text-zinc-400" />
            Live Network Scanner
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Scan your browser's real network environment with animated sensor panels.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <Button variant="primary" size="sm" onClick={run} disabled={status === 'running'} className="gap-2">
            {status === 'running' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {status === 'running' ? 'Scanning...' : 'Run Scan'}
          </Button>

          {(status === 'running' || status === 'success' || scanPhase !== 'idle') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
              {status === 'running' && (
                <div className="relative flex items-center justify-center py-6">
                  <motion.div variants={pulseRing} initial="hidden" animate="show" className="absolute w-24 h-24 rounded-full border border-cyan-500/40" />
                  <motion.div variants={pulseRing} initial="hidden" animate="show" className="absolute w-32 h-32 rounded-full border border-cyan-500/30" style={{ animationDelay: '0.5s' }} />
                  <motion.div variants={pulseRing} initial="hidden" animate="show" className="absolute w-40 h-40 rounded-full border border-cyan-500/20" style={{ animationDelay: '1s' }} />
                  <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                    <Network size={20} className="text-cyan-400" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {panels.map((panel) => {
                  const isActive = scanPhase === panel.phase || scanPhase === 'done';
                  const Icon = panel.icon;
                  return (
                    <motion.div
                      key={panel.phase}
                      variants={panelReveal}
                      initial="hidden"
                      animate={isActive ? 'show' : 'hidden'}
                      transition={{ delay: isActive ? 0.1 : 0 }}
                      className={`rounded-lg border p-4 space-y-2 transition-colors ${
                        isActive
                          ? 'border-zinc-700 bg-zinc-900/50'
                          : 'border-zinc-800 bg-zinc-950/30 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={isActive ? panel.color : 'text-zinc-600'} />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">{panel.label}</span>
                        {isActive && scanPhase === panel.phase && (
                          <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-auto"
                          />
                        )}
                      </div>
                      <div className="text-xs font-mono space-y-0.5">
                        {panel.phase === 'browser' && browserData && (
                          <>
                            <div className="text-zinc-400 truncate" title={browserData.ua}>{browserData.ua?.slice(0, 40)}...</div>
                            <div className="text-zinc-500">{browserData.platform} · {browserData.language}</div>
                            <div className="text-zinc-500">Cookies: {browserData.cookies} · DNT: {browserData.dnt}</div>
                          </>
                        )}
                        {panel.phase === 'network' && networkData && (
                          <>
                            <div className={networkData.effectiveType !== 'N/A' ? 'text-emerald-300' : 'text-zinc-500'}>
                              Type: {networkData.effectiveType}
                            </div>
                            <div className="text-zinc-400">
                              {networkData.downlink >= 0 ? `${networkData.downlink} Mbps` : '—'}
                              {networkData.rtt >= 0 ? ` · ${networkData.rtt}ms` : ''}
                            </div>
                            <div className="text-zinc-500">Save Data: {networkData.saveData ? 'yes' : 'no'}</div>
                          </>
                        )}
                        {panel.phase === 'local' && (
                          <>
                            {localCandidates.length > 0 ? (
                              localCandidates.slice(0, 2).map((c, i) => {
                                const match = c.match(/ (\d+\.\d+\.\d+\.\d+) /);
                                return (
                                  <div key={i} className="text-amber-300">
                                    {match ? match[1] : c.slice(0, 30)}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-zinc-500">Scanning...</div>
                            )}
                          </>
                        )}
                        {panel.phase === 'connection' && (
                          <div className={connectionStatus === 'Online' ? 'text-emerald-300' : 'text-red-300'}>
                            {connectionStatus || 'Scanning...'}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {(status === 'success' || status === 'error') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
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
            </motion.div>
          )}

          {status === 'success' && challenge && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800/70 bg-zinc-900/40">
                <h4 className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-cyan-400" />
                  Hands-On Challenge
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Answer the question below using the scan results above.
                </p>
              </div>
              <div className="p-4 space-y-3">
                <div className="text-sm text-zinc-300">
                  {challenge.text}
                </div>
                {challengeResult === 'fail' && (
                  <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded px-3 py-2">
                    Incorrect. The correct answer is: <span className="font-mono text-red-300">{challenge.answer}</span>
                  </div>
                )}
                {challengeResult === 'pass' && (
                  <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded px-3 py-2">
                    Correct! Well done.
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={challengeInput}
                    onChange={(e) => setChallengeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitChallenge();
                      }
                    }}
                    placeholder="Type your answer..."
                    className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
                    disabled={challengeResult === 'pass'}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitChallenge}
                    disabled={!challengeInput.trim() || challengeResult === 'pass'}
                  >
                    Submit Answer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewChallenge}
                  >
                    New Challenge
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <TaskPanel labId={LAB_ID} />
      </div>
    </motion.div>
  );
}
