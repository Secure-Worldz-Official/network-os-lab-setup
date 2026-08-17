import { useState, useCallback } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Globe, Loader2, AlertCircle, ShieldAlert, ShieldCheck, ShieldX, Search, FileCode, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';

const LAB_ID = 'headers';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const stageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

interface HeaderResult {
  name: string;
  present: boolean;
  value: string;
  status: 'pass' | 'warning' | 'fail';
  recommendation: string;
  owasp: string;
}

const SAMPLE_HEADERS: Record<string, string> = {
  'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.example.com; frame-ancestors 'self';",
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-frame-options': 'SAMEORIGIN',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'x-xss-protection': '1; mode=block',
  'cross-origin-embedder-policy': 'require-corp',
  'cross-origin-opener-policy': 'same-origin',
  'cache-control': 'public, max-age=3600',
  'server': 'nginx/1.24.0',
  'date': 'Mon, 17 Aug 2026 15:30:00 GMT',
};

function analyzeHeaders(headers: Record<string, string>): HeaderResult[] {
  const results: HeaderResult[] = [];

  const csp = headers['content-security-policy'] || headers['Content-Security-Policy'] || '';
  const cspValid = csp && /(script-src|style-src|default-src)/i.test(csp);
  results.push({
    name: 'Content-Security-Policy (CSP)',
    present: !!csp,
    value: csp.slice(0, 200) || 'Not set',
    status: cspValid ? 'pass' : csp ? 'warning' : 'fail',
    recommendation: csp
      ? cspValid
        ? 'Ensure script-src, style-src, and default-src directives are restrictive. Avoid unsafe-inline and unsafe-eval.'
        : 'CSP is present but may lack critical directives like script-src, style-src, or default-src.'
      : 'Implement a strict CSP with script-src, style-src, and default-src directives to mitigate XSS.',
    owasp: 'OWASP A03:2021-Injection / A05:2021-Security Misconfiguration',
  });

  const hsts = headers['strict-transport-security'] || headers['Strict-Transport-Security'] || '';
  const hstsValid = hsts && /max-age\s*=\s*([2-9]\d{7,}|[1-9]\d{8,})/i.test(hsts);
  results.push({
    name: 'Strict-Transport-Security (HSTS)',
    present: !!hsts,
    value: hsts || 'Not set',
    status: hstsValid ? 'pass' : hsts ? 'warning' : 'fail',
    recommendation: hsts
      ? hstsValid
        ? 'Enable includeSubDomains and preload for full coverage. Submit to Chrome preload list.'
        : 'HSTS max-age should be at least 31536000 seconds (1 year). Consider includeSubDomains.'
      : 'Add Strict-Transport-Security header with max-age >= 31536000 to enforce HTTPS.',
    owasp: 'OWASP A02:2021-Cryptographic Failures',
  });

  const xfo = headers['x-frame-options'] || headers['X-Frame-Options'] || '';
  const xfoValid = /^(DENY|SAMEORIGIN)$/i.test(xfo);
  results.push({
    name: 'X-Frame-Options (XFO)',
    present: !!xfo,
    value: xfo || 'Not set',
    status: xfoValid ? 'pass' : xfo ? 'warning' : 'fail',
    recommendation: xfo
      ? xfoValid
        ? 'Good. Consider CSP frame-ancestors as defense in depth.'
        : 'XFO should be DENY or SAMEORIGIN. ALLOW-FROM is deprecated.'
      : 'Add X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking.',
    owasp: 'OWASP A01:2021-Broken Access Control',
  });

  const xcto = headers['x-content-type-options'] || headers['X-Content-Type-Options'] || '';
  const xctoValid = /^nosniff$/i.test(xcto);
  results.push({
    name: 'X-Content-Type-Options (XCTO)',
    present: !!xcto,
    value: xcto || 'Not set',
    status: xctoValid ? 'pass' : xcto ? 'warning' : 'fail',
    recommendation: xcto
      ? xctoValid
        ? 'Good. Ensure all responses have correct Content-Type to avoid MIME-type confusion.'
        : 'XCTO must be exactly nosniff.'
      : 'Add X-Content-Type-Options: nosniff to prevent MIME-type sniffing attacks.',
    owasp: 'OWASP A05:2021-Security Misconfiguration',
  });

  const rp = headers['referrer-policy'] || headers['Referrer-Policy'] || '';
  const validRp = ['no-referrer', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin', 'no-referrer-when-downgrade', 'origin-when-cross-origin', 'unsafe-url'];
  const rpValid = validRp.some((v) => rp.toLowerCase() === v);
  results.push({
    name: 'Referrer-Policy',
    present: !!rp,
    value: rp || 'Not set',
    status: rpValid ? 'pass' : rp ? 'warning' : 'fail',
    recommendation: rp
      ? rpValid
        ? 'strict-origin-when-cross-origin is a good default. Adjust based on privacy requirements.'
        : 'Referrer-Policy should be a standard directive (e.g., strict-origin-when-cross-origin).'
      : 'Set Referrer-Policy to control how much referrer information is included with requests.',
    owasp: 'OWASP A02:2021-Cryptographic Failures',
  });

  const pp = headers['permissions-policy'] || headers['Permissions-Policy'] || '';
  results.push({
    name: 'Permissions-Policy',
    present: !!pp,
    value: pp || 'Not set',
    status: pp ? 'pass' : 'fail',
    recommendation: pp
      ? 'Restrict sensitive browser features (geolocation, microphone, camera, etc.) using Permissions-Policy.'
      : 'Add Permissions-Policy to disable unnecessary browser features and reduce attack surface.',
    owasp: 'OWASP A05:2021-Security Misconfiguration',
  });

  const xxss = headers['x-xss-protection'] || headers['X-XSS-Protection'] || '';
  results.push({
    name: 'X-XSS-Protection (legacy)',
    present: !!xxss,
    value: xxss || 'Not set',
    status: xxss ? 'warning' : 'fail',
    recommendation: xxss
      ? 'Legacy header for older browsers. Modern defense should rely on CSP. This header is deprecated.'
      : 'Deprecated header. Modern browsers ignore this — rely on CSP for XSS protection.',
    owasp: 'OWASP A03:2021-Injection',
  });

  const coep = headers['cross-origin-embedder-policy'] || headers['Cross-Origin-Embedder-Policy'] || '';
  const coepValid = /^(require-corp|credentialless)$/i.test(coep);
  results.push({
    name: 'Cross-Origin-Embedder-Policy (COEP)',
    present: !!coep,
    value: coep || 'Not set',
    status: coepValid ? 'pass' : coep ? 'warning' : 'fail',
    recommendation: coep
      ? coepValid
        ? 'Good. Consider credentialless if third-party resources cannot set CORP.'
        : 'COEP should be require-corp or credentialless.'
      : 'Add Cross-Origin-Embedder-Policy: require-corp to enable cross-origin isolation.',
    owasp: 'OWASP A05:2021-Security Misconfiguration',
  });

  const coop = headers['cross-origin-opener-policy'] || headers['Cross-Origin-Opener-Policy'] || '';
  const coopValid = /^(same-origin|same-origin-allow-popups|unsafe-none)$/i.test(coop);
  results.push({
    name: 'Cross-Origin-Opener-Policy (COOP)',
    present: !!coop,
    value: coop || 'Not set',
    status: coopValid ? 'pass' : coop ? 'warning' : 'fail',
    recommendation: coop
      ? coopValid
        ? 'same-origin is recommended for maximum isolation. Ensure COOP and COEP work together.'
        : 'COOP should be same-origin or same-origin-allow-popups for cross-origin isolation.'
      : 'Add Cross-Origin-Opener-Policy: same-origin to enable cross-origin isolation.',
    owasp: 'OWASP A05:2021-Security Misconfiguration',
  });

  return results;
}

export function HeaderAnalyzerLab() {
  const { verifyAndComplete } = useTask();
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<HeaderResult[]>([]);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);

  const [missingChecks, setMissingChecks] = useState<Record<string, boolean>>({});
  const [cspInput, setCspInput] = useState('');
  const [cspValid, setCspValid] = useState<boolean | null>(null);
  const [hstsInput, setHstsInput] = useState('');
  const [hstsValid, setHstsValid] = useState<boolean | null>(null);
  const [challenge1Done, setChallenge1Done] = useState(false);

  const fetchHeaders = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setRawHeaders([]);
    setMissingChecks({});
    setCspInput('');
    setCspValid(null);
    setHstsInput('');
    setHstsValid(null);
    setChallenge1Done(false);

    let headerObj: Record<string, string> = {};
    let usedFallback = false;

    try {
      const res = await fetch(url, { mode: 'cors' });
      res.headers.forEach((value, key) => {
        headerObj[key.toLowerCase()] = value;
      });
    } catch {
      headerObj = { ...SAMPLE_HEADERS };
      usedFallback = true;
    }

    const analysis = analyzeHeaders(headerObj);
    setResults(analysis);
    setRawHeaders(Object.entries(headerObj).map(([key, value]) => `${key}: ${value}`));
    setResults(analysis);

    const rawList: string[] = [];
    Object.entries(headerObj).forEach(([key, value]) => {
      rawList.push(`${key}: ${value}`);
    });
    setRawHeaders(rawList);

    if (usedFallback) {
      setError('CORS blocked the request. Using a realistic production sample header set for analysis.');
    }

    const output = [
      `Target: ${url}`,
      usedFallback ? 'Note: CORS blocked direct fetch. Showing sample production headers.' : '',
      '',
      '=== RAW RESPONSE HEADERS ===',
      ...rawList,
      '',
      '=== SECURITY HEADER ANALYSIS ===',
      ...analysis.map((r) => `[${r.status.toUpperCase()}] ${r.name}: ${r.present ? r.value : 'Missing'} | ${r.owasp}`),
    ].filter(Boolean).join('\n');

    verifyAndComplete(LAB_ID, output);
    setLoading(false);
  }, [url, verifyAndComplete]);

  const handleMissingToggle = (key: string) => {
    setMissingChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validateChallenge1 = () => {
    const missingFromResults: string[] = results.filter((r) => r.status === 'fail').map((r) => r.name);
    const selected: string[] = Object.entries(missingChecks)
      .filter((entry) => entry[1])
      .map((entry) => entry[0]);
    const allMissingSelected: boolean = missingFromResults.every((m) => selected.includes(m));
    setChallenge1Done(allMissingSelected && selected.length > 0);
  };

  const validateChallenge2 = () => {
    const valid: boolean = /(script-src|style-src|default-src)/i.test(cspInput);
    setCspValid(valid);
  };

  const validateChallenge3 = () => {
    const valid: boolean = /strict-transport-security|hsts/i.test(hstsInput.trim().toLowerCase());
    setHstsValid(valid);
  };

  const getStatusIcon = (status: HeaderResult['status']) => {
    switch (status) {
      case 'pass':
        return <ShieldCheck size={14} className="text-emerald-400" />;
      case 'warning':
        return <ShieldAlert size={14} className="text-amber-400" />;
      case 'fail':
        return <ShieldX size={14} className="text-red-400" />;
    }
  };

  const getStatusColor = (status: HeaderResult['status']) => {
    switch (status) {
      case 'pass':
        return 'border-emerald-800 bg-emerald-950/20 text-emerald-300';
      case 'warning':
        return 'border-amber-800 bg-amber-950/20 text-amber-300';
      case 'fail':
        return 'border-red-800 bg-red-950/20 text-red-300';
    }
  };

  const missingHeaders = results.filter((r) => r.status === 'fail');

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Globe size={15} className="text-zinc-400" />
            HTTP Header Security Analyzer
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Fetch real response headers and audit security configurations with live syntax validation.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Target URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
            <div className="space-y-1.5 flex items-end">
              <Button
                variant="primary"
                size="sm"
                onClick={fetchHeaders}
                disabled={loading || !url}
                className="w-full gap-2"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                {loading ? 'Scanning...' : 'Fetch & Analyze'}
              </Button>
            </div>
          </div>

          {loading && (
            <motion.div variants={stageVariants} className="flex items-center gap-3 p-4 rounded-lg border border-zinc-800 bg-zinc-950/60">
              <Loader2 size={18} className="animate-spin text-cyan-400" />
              <span className="text-xs font-mono text-zinc-400">Fetching headers and running security analysis...</span>
            </motion.div>
          )}

          {error && (
            <motion.div variants={stageVariants} className="flex items-start gap-2 p-3 rounded-lg border border-amber-800 bg-amber-950/20 text-amber-300">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span className="text-xs font-mono">{error}</span>
            </motion.div>
          )}

          {results.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Security Header Results</span>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck size={11} /> {results.filter((r) => r.status === 'pass').length}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <ShieldAlert size={11} /> {results.filter((r) => r.status === 'warning').length}
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <ShieldX size={11} /> {results.filter((r) => r.status === 'fail').length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.map((header) => (
                  <motion.div
                    key={header.name}
                    variants={stageVariants}
                    className={`rounded-lg border p-3 space-y-2 ${getStatusColor(header.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(header.status)}
                        <span className="text-[11px] font-mono font-semibold truncate">{header.name}</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-wider opacity-70">{header.status}</span>
                    </div>
                    <div className="text-[10px] font-mono break-all opacity-80 leading-relaxed">
                      {header.value}
                    </div>
                    <div className="text-[10px] opacity-70 leading-relaxed">
                      {header.recommendation}
                    </div>
                    <div className="text-[9px] font-mono opacity-50 pt-1 border-t border-current/20">
                      {header.owasp}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {results.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Header Security Challenges
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
                  <div className="text-xs font-mono text-zinc-300">Challenge 1: Identify missing security headers</div>
                  <p className="text-[11px] text-zinc-500">
                    From the analysis above, which headers are missing or misconfigured? Check all that apply.
                  </p>
                  {missingHeaders.length > 0 ? (
                    <div className="space-y-2">
                      {missingHeaders.map((header) => (
                        <label key={header.name} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={!!missingChecks[header.name]}
                            onChange={() => handleMissingToggle(header.name)}
                            className="rounded border-zinc-700 bg-zinc-950 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors">{header.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-emerald-400 font-mono">All headers are present. Great security posture!</p>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={validateChallenge1}
                    disabled={missingHeaders.length === 0}
                    className="w-full"
                  >
                    Check Answer
                  </Button>
                  {challenge1Done && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] font-mono p-2.5 rounded border border-emerald-800 bg-emerald-950/30 text-emerald-300"
                    >
                      Correct. Missing or misconfigured headers weaken the security posture and should be addressed.
                    </motion.div>
                  )}
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
                  <div className="text-xs font-mono text-zinc-300">Challenge 2: Provide the correct CSP directive</div>
                  <p className="text-[11px] text-zinc-500">
                    Type a CSP value that includes at least script-src, style-src, or default-src directives.
                  </p>
                  <input
                    type="text"
                    value={cspInput}
                    onChange={(e) => { setCspInput(e.target.value); setCspValid(null); }}
                    placeholder="default-src 'self'; script-src 'self'"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                  <Button variant="secondary" size="sm" onClick={validateChallenge2} disabled={!cspInput} className="w-full">
                    Validate CSP
                  </Button>
                  {cspValid !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[11px] font-mono p-2.5 rounded border ${cspValid ? 'border-emerald-800 bg-emerald-950/30 text-emerald-300' : 'border-red-800 bg-red-950/30 text-red-300'}`}
                    >
                      {cspValid ? (
                        <span>CSP syntax validated. Ensure directives are restrictive in production.</span>
                      ) : (
                        <span>CSP must include script-src, style-src, or default-src directives.</span>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
                <div className="text-xs font-mono text-zinc-300">Challenge 3: Identify HSTS</div>
                <p className="text-[11px] text-zinc-500">
                  Which header enforces HTTPS connections? Type the header name or abbreviation.
                </p>
                <input
                  type="text"
                  value={hstsInput}
                  onChange={(e) => { setHstsInput(e.target.value); setHstsValid(null); }}
                  placeholder="Strict-Transport-Security or HSTS"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                />
                <Button variant="secondary" size="sm" onClick={validateChallenge3} disabled={!hstsInput} className="w-full">
                  Validate Answer
                </Button>
                {hstsValid !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[11px] font-mono p-2.5 rounded border ${hstsValid ? 'border-emerald-800 bg-emerald-950/30 text-emerald-300' : 'border-red-800 bg-red-950/30 text-red-300'}`}
                  >
                    {hstsValid ? (
                      <span>Correct. Strict-Transport-Security (HSTS) tells browsers to only connect via HTTPS.</span>
                    ) : (
                      <span>Incorrect. The header that enforces HTTPS is Strict-Transport-Security (HSTS).</span>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {rawHeaders.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
                <FileCode size={13} className="text-zinc-400" />
                <span className="text-[11px] font-mono text-zinc-400">Live Header Breakdown</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Raw Response Headers</span>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {rawHeaders.map((h, i) => (
                      <div key={i} className="text-[11px] font-mono text-zinc-300 truncate px-2 py-1 rounded bg-zinc-900/50 border border-zinc-800/50">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Header-by-Header Analysis</span>
                  <div className="mt-2 space-y-2">
                    {results.map((r) => (
                      <div key={r.name} className="flex items-start gap-2 text-[11px] font-mono px-2 py-1.5 rounded bg-zinc-900/50 border border-zinc-800/50">
                        {getStatusIcon(r.status)}
                        <div className="flex-1 min-w-0">
                          <span className="text-zinc-300">{r.name}:</span>
                          <span className="text-zinc-500 ml-1">{r.present ? r.value : 'Missing'} — {r.status.toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={11} />
                    OWASP Top 10 Mapping
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.from(new Set(results.map((r) => r.owasp))).map((owasp) => (
                      <span key={owasp} className="text-[10px] font-mono px-2 py-1 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-400">
                        {owasp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <TaskPanel labId={LAB_ID} />
        </div>
      </div>
    </motion.div>
  );
}
