import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Shield, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import type { LabResult } from './labUtils';

const LAB_ID = 'attack-vector';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const KILL_CHAIN_PHASES = [
  { id: 'recon', label: 'Reconnaissance', desc: 'Gather target intelligence' },
  { id: 'weapon', label: 'Weaponization', desc: 'Create exploit payload' },
  { id: 'delivery', label: 'Delivery', desc: 'Transmit weapon to target' },
  { id: 'exploit', label: 'Exploitation', desc: 'Trigger vulnerability' },
  { id: 'install', label: 'Installation', desc: 'Install malware/backdoor' },
  { id: 'c2', label: 'Command & Control', desc: 'Establish C2 channel' },
  { id: 'actions', label: 'Actions on Objectives', desc: 'Achieve attack goals' },
];

const SCENARIOS = [
  {
    id: 'scenario-1',
    description: 'An employee receives an email with a malicious PDF attachment from an unknown sender. Upon opening, the PDF exploits a vulnerability in the document reader and installs a remote access trojan.',
    correctVector: 'Phishing',
    killChain: ['recon', 'weapon', 'delivery', 'exploit', 'install', 'c2', 'actions'],
    cvss: '7.8 (High)',
    cwe: 'CWE-502 (Deserialization of Untrusted Data)',
    software: 'Adobe Acrobat Reader, Microsoft Office',
    mitigations: 'Email filtering, sandboxing attachments, patching document readers, user awareness training.',
  },
  {
    id: 'scenario-2',
    description: 'A publicly exposed Microsoft Exchange Server running an unpatched version is discovered by threat actors. They exploit CVE-2021-26857 (SSRF) to gain access and deploy webshells for persistent access.',
    correctVector: 'Supply Chain',
    killChain: ['recon', 'weapon', 'delivery', 'exploit', 'install', 'c2', 'actions'],
    cvss: '9.8 (Critical)',
    cwe: 'CWE-918 (Server-Side Request Forgery)',
    software: 'Microsoft Exchange Server 2010/2013/2016/2019',
    mitigations: 'Apply security patches, disable Exchange HTTP endpoints, implement network segmentation, monitor for webshell indicators.',
  },
  {
    id: 'scenario-3',
    description: 'A disgruntled system administrator with legitimate privileged access exports a database of customer records and sells it to a competitor. No external exploitation occurs.',
    correctVector: 'Insider Threat',
    killChain: ['actions'],
    cvss: '5.5 (Medium)',
    cwe: 'CWE-1220 (Insufficient Granularity of Access Control)',
    software: 'Internal database systems',
    mitigations: 'Least privilege access, DLP solutions, privileged access management (PAM), user behavior analytics (UBA).',
  },
  {
    id: 'scenario-4',
    description: 'A compromised software update from a trusted vendor is distributed to thousands of customers. The update contains a backdoored binary that establishes persistence and exfiltrates data.',
    correctVector: 'Supply Chain',
    killChain: ['recon', 'weapon', 'delivery', 'exploit', 'install', 'c2', 'actions'],
    cvss: '9.1 (Critical)',
    cwe: 'CWE-1104 (Use of Unmaintained Third Party Components)',
    software: 'SolarWinds Orion, software build pipelines',
    mitigations: 'Code signing verification, reproducible builds, supply chain security (SLSA), dependency scanning.',
  },
];

const VECTOR_OPTIONS = ['Phishing', 'Drive-by Download', 'Supply Chain', 'Insider Threat', 'Watering Hole'];

export function AttackVectorLab() {
  const { verifyAndComplete } = useTask();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedVector, setSelectedVector] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [animStage, setAnimStage] = useState<'idle' | 'analyzing' | 'classified'>('idle');
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });

  const currentScenario = SCENARIOS[scenarioIndex];

  const handleAnalyze = () => {
    if (!selectedVector) return;
    setAnimStage('analyzing');
    setShowResult(false);
    setResult({ status: 'running', output: '' });
    setTimeout(() => {
      const correct = selectedVector === currentScenario.correctVector;
      const output = [
        `Scenario:         ${currentScenario.id}`,
        `Description:      ${currentScenario.description.slice(0, 80)}...`,
        `Selected Vector:  ${selectedVector}`,
        `Correct Vector:   ${currentScenario.correctVector}`,
        `Result:           ${correct ? 'CORRECT' : 'INCORRECT'}`,
        ``,
        `CVSS Score:       ${currentScenario.cvss}`,
        `CWE:              ${currentScenario.cwe}`,
        `Affected:         ${currentScenario.software}`,
        `Mitigations:      ${currentScenario.mitigations}`,
        ``,
        `Kill Chain Phases:`,
        ...currentScenario.killChain.map((phaseId, i) => {
          const phase = KILL_CHAIN_PHASES.find((p) => p.id === phaseId);
          return `  ${i + 1}. ${phase?.label || phaseId}: ${phase?.desc || ''}`;
        }),
      ].join('\n');
      setResult({ status: 'success', output });
      setAnimStage('classified');
      setShowResult(true);
      verifyAndComplete(LAB_ID, output);
    }, 1500);
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Shield size={15} className="text-zinc-400" />
            Attack Vector Analyzer
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Map real attack scenarios to kill chain phases, CVSS scores, and mitigations.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Attack Scenario</span>
              <span className="text-[10px] font-mono text-zinc-500">Scenario {scenarioIndex + 1} of {SCENARIOS.length}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{currentScenario.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
              <div className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500">CVSS:</span> <span className="text-zinc-300">{currentScenario.cvss}</span>
              </div>
              <div className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-500">CWE:</span> <span className="text-zinc-300">{currentScenario.cwe.split(' ')[0]}</span>
              </div>
              <div className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 col-span-2">
                <span className="text-zinc-500">Vector:</span> <span className="text-cyan-300">{currentScenario.correctVector}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Select Attack Vector</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {VECTOR_OPTIONS.map((vector) => (
                <button
                  key={vector}
                  onClick={() => { setSelectedVector(vector); setShowResult(false); setAnimStage('idle'); }}
                  className={`px-3 py-2 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
                    selectedVector === vector
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {vector}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={handleAnalyze} disabled={!selectedVector || animStage === 'analyzing'} className="gap-2">
              {animStage === 'analyzing' ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
              {animStage === 'analyzing' ? 'Analyzing...' : 'Analyze Vector'}
            </Button>
            {showResult && (
              <button onClick={() => { setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length); setSelectedVector(''); setShowResult(false); setAnimStage('idle'); setResult({ status: 'idle', output: '' }); }} className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer">Next Scenario →</button>
            )}
          </div>

          {animStage === 'analyzing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex items-center justify-center gap-2 py-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Shield size={20} className="text-cyan-400" />
                </motion.div>
                <span className="text-sm text-zinc-400">Mapping kill chain phases...</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                {KILL_CHAIN_PHASES.map((phase, idx) => {
                  const isActive = currentScenario.killChain.includes(phase.id);
                  return (
                    <div key={phase.id} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.4 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[10px] font-mono ${
                          isActive ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                        }`}
                      >
                        {idx + 1}
                      </motion.div>
                      <span className={`text-[8px] font-mono text-center leading-tight ${isActive ? 'text-zinc-300' : 'text-zinc-600'}`}>{phase.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {showResult && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Analysis Complete</span>
                </div>
                <div className="text-sm text-zinc-200 font-semibold">Correct Vector: {currentScenario.correctVector}</div>
                <div className="text-xs text-zinc-400">CVSS: {currentScenario.cvss} | CWE: {currentScenario.cwe}</div>
                <div className="text-xs text-zinc-500">Affected: {currentScenario.software}</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-amber-400" />
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Recommended Mitigations</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{currentScenario.mitigations}</p>
              </div>
            </motion.div>
          )}

          {result.status === 'success' && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-400">Full Output</span>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap">{result.output}</pre>
            </motion.div>
          )}
        </div>
        <TaskPanel labId={LAB_ID} />
      </div>
    </motion.div>
  );
}
