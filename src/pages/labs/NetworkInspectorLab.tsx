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
        // expected fallback
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
    { phase: 'browser' as ScanPhase, label: 'Browser', icon: Monitor, data: browserData },
    { phase: 'network' as ScanPhase, label: 'Network', icon: Wifi, data: networkData },
    { phase: 'local' as ScanPhase, label: 'Local IP', icon: Globe, data: localCandidates },
    { phase: 'connection' as ScanPhase, label: 'Connection', icon: Radio, data: connectionStatus },
  ];

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className="font-mono">
      <div className="rounded border border-zinc-800 bg-black overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wider font-heading">
            <Network size={15} className="text-white" />
            LIVE NETWORK ENVIRONMENT INSPECTOR
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Scan your browser's real network environment with animated sensor panels.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <Button variant="primary" size="sm" onClick={run} disabled={status === 'running'} className="gap-2 uppercase text-xs">
            {status === 'running' ? <Loader2 size={14} className="animate-spin text-black" /> : <Play size={14} />}
            {status === 'running' ? 'SCANNING...' : '[ RUN NETWORK SCAN ]'}
          </Button>

          {(status === 'running' || status === 'success' || scanPhase !== 'idle') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {panels.map((panel) => {
                  const isActive = scanPhase === panel.phase || scanPhase === 'done';
                  const Icon = panel.icon;
                  return (
                    <div
                      key={panel.phase}
                      className={`rounded border p-4 space-y-2 transition-all ${
                        isActive
                          ? 'border-white bg-[#080808] font-bold'
                          : 'border-zinc-850 bg-black opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                        <Icon size={14} className="text-white" />
                        <span className="text-[10px] uppercase tracking-wider text-white">{panel.label}</span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        {panel.phase === 'browser' && browserData && (
                          <>
                            <div className="text-white truncate" title={browserData.ua}>{browserData.ua?.slice(0, 40)}...</div>
                            <div className="text-zinc-400">{browserData.platform} · {browserData.language}</div>
                            <div className="text-zinc-500">Cookies: {browserData.cookies} · DNT: {browserData.dnt}</div>
                          </>
                        )}
                        {panel.phase === 'network' && networkData && (
                          <>
                            <div className="text-white font-bold">
                              TYPE: {networkData.effectiveType}
                            </div>
                            <div className="text-zinc-400">
                              {networkData.downlink >= 0 ? `${networkData.downlink} Mbps` : '—'}
                              {networkData.rtt >= 0 ? ` · ${networkData.rtt}ms` : ''}
                            </div>
                          </>
                        )}
                        {panel.phase === 'local' && (
                          <>
                            {localCandidates.length > 0 ? (
                              localCandidates.slice(0, 2).map((c, i) => {
                                const match = c.match(/ (\d+\.\d+\.\d+\.\d+) /);
                                return (
                                  <div key={i} className="text-white font-bold">
                                    {match ? match[1] : c.slice(0, 30)}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-zinc-500">SCANNING...</div>
                            )}
                          </>
                        )}
                        {panel.phase === 'connection' && (
                          <div className="text-white font-bold">
                            STATUS: {connectionStatus || 'SCANNING...'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {(status === 'success' || status === 'error') && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded border border-zinc-800 bg-[#080808] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-950">
                {status === 'success' ? (
                  <CheckCircle2 size={13} className="text-white" />
                ) : (
                  <AlertCircle size={13} className="text-white" />
                )}
                <span className="text-[11px] font-mono text-white font-bold uppercase">
                  {status === 'success' ? 'SCAN LOG OUTPUT' : 'ERROR LOG'}
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-x-auto">
                {status === 'error' ? `${error}\n\n${info}` : info}
              </pre>
            </motion.div>
          )}

          {status === 'success' && challenge && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded border border-zinc-800 bg-black overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-white" />
                  KNOWLEDGE VERIFICATION QUESTION
                </h4>
              </div>
              <div className="p-4 space-y-3 font-mono">
                <div className="text-xs text-white">
                  {challenge.text}
                </div>
                {challengeResult === 'fail' && (
                  <div className="text-xs text-zinc-400 bg-black border border-zinc-800 rounded p-2">
                    Incorrect. Answer is: <span className="text-white font-bold">{challenge.answer}</span>
                  </div>
                )}
                {challengeResult === 'pass' && (
                  <div className="text-xs text-white bg-zinc-950 border border-white rounded p-2 font-bold">
                    ✓ Correct answer verified!
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={challengeInput}
                    onChange={(e) => setChallengeInput(e.target.value)}
                    placeholder="Type answer..."
                    className="flex-1 rounded border border-zinc-800 bg-black px-3 py-2 text-xs text-white outline-none focus:border-white font-mono"
                    disabled={challengeResult === 'pass'}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitChallenge}
                    disabled={!challengeInput.trim() || challengeResult === 'pass'}
                    className="uppercase text-xs"
                  >
                    [ SUBMIT ]
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewChallenge}
                    className="uppercase text-xs"
                  >
                    [ NEW QUESTION ]
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
