import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { AlertCircle, CheckCircle2, Mail, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import type { LabResult } from './labUtils';

const LAB_ID = 'social-eng';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const EMAILS = [
  {
    id: 'email-1',
    subject: 'Urgent: Your Account Will Be Suspended Within 24 Hours',
    from: 'security@yourbank-support.xyz',
    replyTo: 'noreply@yourbank-support.xyz',
    body: 'Dear Valued Customer,\n\nWe have detected unusual activity on your account. To prevent immediate suspension, you must verify your identity within 24 hours.\n\nClick here to verify: http://yourbank-secure.xyz/login\n\nFailure to act will result in permanent account closure.\n\nRegards,\nIT Security Team',
    indicators: [
      { id: 'urgency', type: 'Urgency', text: 'Within 24 hours', explanation: 'Creates time pressure to prevent careful thinking' },
      { id: 'authority', type: 'Authority Impersonation', text: 'security@yourbank-support.xyz', explanation: 'Spoofed sender domain mimicking legitimate bank' },
      { id: 'domain_similarity', type: 'Domain Similarity', text: 'yourbank-secure.xyz vs yourbank.com', explanation: 'Typosquatting with visual similarity' },
      { id: 'link', type: 'Suspicious URL', text: 'http://yourbank-secure.xyz/login', explanation: 'HTTP instead of HTTPS, fake domain' },
    ],
    urlEntropy: 4.12,
    domainDistance: 2,
    spoofing: 'SPF likely fail — domain does not match yourbank.com',
  },
  {
    id: 'email-2',
    subject: 'CEO Request: Urgent Wire Transfer Needed',
    from: 'ceo@company-corp.com',
    replyTo: 'ceo@company-corp.com',
    body: 'Hi,\n\nI am in a meeting and need you to process an urgent wire transfer of $45,000 to our new vendor. This is time-sensitive and confidential.\n\nPlease handle this immediately and keep it quiet.\n\nThanks,\nJohn',
    indicators: [
      { id: 'authority', type: 'Authority Impersonation', text: 'ceo@company-corp.com', explanation: 'Impersonating CEO with slight domain variation' },
      { id: 'urgency', type: 'Urgency', text: 'time-sensitive', explanation: 'Pressure to act quickly without verification' },
      { id: 'secrecy', type: 'Secrecy Request', text: 'keep it quiet', explanation: 'Request to bypass normal approval processes' },
      { id: 'financial', type: 'Financial Request', text: 'wire transfer of $45,000', explanation: 'Unusual financial request via email' },
    ],
    urlEntropy: 3.85,
    domainDistance: 3,
    spoofing: 'SPF softfail — domain similar but not identical to company.com',
  },
  {
    id: 'email-3',
    subject: 'Your Package Delivery Failed — Action Required',
    from: 'delivery@fedex-notify.com',
    replyTo: 'support@fedex-notify.com',
    body: 'We attempted to deliver your package but no one was home. Your package is being held at our facility.\n\nTo reschedule delivery, please confirm your address and payment details:\n\nhttps://fedex-tracking.xyz/confirm\n\nThis notice will expire in 48 hours.',
    indicators: [
      { id: 'curiosity', type: 'Curiosity Bait', text: 'Your package', explanation: 'Triggers curiosity about undelivered package' },
      { id: 'urgency', type: 'Urgency', text: 'expire in 48 hours', explanation: 'Time-limited action requirement' },
      { id: 'domain_similarity', type: 'Domain Similarity', text: 'fedex-notify.com vs fedex.com', explanation: 'Lookalike domain for FedEx' },
      { id: 'sensitive_info', type: 'Sensitive Info Request', text: 'payment details', explanation: 'Requesting financial information via email link' },
    ],
    urlEntropy: 3.95,
    domainDistance: 1,
    spoofing: 'SPF fail — fedex-notify.com is not authorized for FedEx',
  },
];

function shannonEntropy(str: string): number {
  const freq: Record<string, number> = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  const len = str.length;
  return -Object.values(freq).reduce((sum, f) => sum + (f / len) * Math.log2(f / len), 0);
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[a.length][b.length];
}

export function SocialEngineeringLab() {
  const { verifyAndComplete } = useTask();
  const [emailIndex, setEmailIndex] = useState(0);
  const [flaggedIndicators, setFlaggedIndicators] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<LabResult>({ status: 'idle', output: '' });

  const currentEmail = EMAILS[emailIndex];

  const toggleIndicator = (id: string) => {
    setFlaggedIndicators((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setShowResult(false);
  };

  const handleSubmit = () => {
    const correctIds = new Set(currentEmail.indicators.map((i) => i.id));
    const correctCount = Array.from(flaggedIndicators).filter((id) => correctIds.has(id)).length;
    const falsePositives = flaggedIndicators.size - correctCount;
    const missed = correctIds.size - correctCount;
    const output = [
      `Email:            ${currentEmail.id}`,
      `Subject:          ${currentEmail.subject}`,
      `From:             ${currentEmail.from}`,
      ``,
      `Correct Flags:    ${correctCount}/${correctIds.size}`,
      `False Positives:  ${falsePositives}`,
      `Missed:           ${missed}`,
      ``,
      `URL Entropy:      ${currentEmail.urlEntropy.toFixed(2)} bits (high entropy = randomly generated domain)`,
      `Domain Distance:  ${currentEmail.domainDistance} edits from brand domain`,
      `SPF Analysis:     ${currentEmail.spoofing}`,
      ``,
      `Flagged Indicators:`,
      ...Array.from(flaggedIndicators).map((id) => {
        const ind = currentEmail.indicators.find((i) => i.id === id);
        return ind ? `  [${ind.type}] ${ind.text}: ${ind.explanation}` : '';
      }),
    ].join('\n');
    setResult({ status: 'success', output });
    setShowResult(true);
    verifyAndComplete(LAB_ID, output);
  };

  const entropy = shannonEntropy(currentEmail.from.split('@')[1] || '');
  const domainDist = levenshtein(currentEmail.from.split('@')[1]?.split('.')[0] || '', 'fedex');

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Mail size={15} className="text-zinc-400" />
            Social Engineering Inspector
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Analyze real phishing emails. Flag every social engineering red flag you find.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Email Header</span>
              <span className="text-[10px] font-mono text-zinc-500">Email {emailIndex + 1} of {EMAILS.length}</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs"><span className="text-zinc-500">Subject:</span> <span className="text-zinc-300">{currentEmail.subject}</span></div>
              <div className="text-xs"><span className="text-zinc-500">From:</span> <span className="text-red-400">{currentEmail.from}</span></div>
              <div className="text-xs"><span className="text-zinc-500">Reply-To:</span> <span className="text-zinc-400">{currentEmail.replyTo}</span></div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Email Body</span>
            <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">{currentEmail.body}</pre>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Flag Red Flags (click to toggle)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentEmail.indicators.map((ind) => {
                const isFlagged = flaggedIndicators.has(ind.id);
                return (
                  <button
                    key={ind.id}
                    onClick={() => toggleIndicator(ind.id)}
                    className={`text-left px-3 py-2 rounded-lg border text-xs transition-all duration-200 cursor-pointer ${
                      isFlagged
                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-mono font-semibold">{ind.type}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{ind.explanation}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={handleSubmit} disabled={flaggedIndicators.size === 0} className="gap-2">
              <Shield size={14} />
              Submit Analysis
            </Button>
            {showResult && (
              <button onClick={() => { setEmailIndex((prev) => (prev + 1) % EMAILS.length); setFlaggedIndicators(new Set()); setShowResult(false); setResult({ status: 'idle', output: '' }); }} className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer">Next Email →</button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Globe size={12} className="text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">URL Entropy</span>
              </div>
              <div className={`text-sm font-mono font-semibold ${entropy > 3.5 ? 'text-red-400' : 'text-zinc-300'}`}>{entropy.toFixed(2)} bits</div>
              <div className="text-[10px] text-zinc-500">{entropy > 3.5 ? 'High — likely randomly generated' : 'Low — resembles real domain'}</div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle size={12} className="text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Domain Distance</span>
              </div>
              <div className={`text-sm font-mono font-semibold ${domainDist <= 2 ? 'text-red-400' : 'text-zinc-300'}`}>{domainDist} edits</div>
              <div className="text-[10px] text-zinc-500">{domainDist <= 2 ? 'Very similar to brand domain' : 'Moderate similarity'}</div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Shield size={12} className="text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">SPF Analysis</span>
              </div>
              <div className="text-sm font-mono font-semibold text-red-400">Likely Fail</div>
              <div className="text-[10px] text-zinc-500">{currentEmail.spoofing}</div>
            </div>
          </div>

          {showResult && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-400">Analysis Output</span>
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
