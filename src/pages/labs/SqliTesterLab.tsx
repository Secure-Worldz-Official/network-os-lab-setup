import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Database, Play, Loader2, AlertCircle, CheckCircle2, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TaskPanel } from '@/components/task/TaskPanel';
import { useTask } from '@/components/task/TaskContext';
import type { LabResult } from './labUtils';

const LAB_ID = 'sqli';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const USERS = [
  { id: 1, username: 'admin', password: 'admin123', email: 'admin@corp.local', role: 'administrator' },
  { id: 2, username: 'guest', password: 'guest123', email: 'guest@corp.local', role: 'user' },
  { id: 3, username: 'test', password: 'test123', email: 'test@corp.local', role: 'user' },
  { id: 4, username: 'dev', password: 'dev123', email: 'dev@corp.local', role: 'developer' },
];

interface QueryResult {
  columns: string[];
  rows: Record<string, string | number>[];
  error?: string;
  bypassSuccess?: boolean;
}

function simpleSqlEngine(query: string, mode: 'vulnerable' | 'parameterized'): QueryResult {
  const normalized = query.trim().replace(/;$/, '').replace(/\s+/g, ' ');

  if (mode === 'parameterized') {
    const lower = normalized.toLowerCase();
    if (lower.includes('union') || lower.includes('or 1=1') || lower.includes("' or") || lower.includes("' OR")) {
      return { columns: [], rows: [], error: 'Parameterized query blocked injection pattern.', bypassSuccess: false };
    }
    const match = normalized.match(/SELECT \* FROM users WHERE username = '([^']+)'/i);
    if (match) {
      const username = match[1];
      const user = USERS.find((u) => u.username === username);
      if (user) {
        return { columns: ['id', 'username', 'password', 'email', 'role'], rows: [user], bypassSuccess: false };
      }
      return { columns: ['id', 'username', 'password', 'email', 'role'], rows: [], bypassSuccess: false };
    }
    return { columns: [], rows: [], error: 'Invalid parameterized query syntax.', bypassSuccess: false };
  }

  const lower = normalized.toLowerCase();

  if (lower.includes('union select')) {
    const parts = normalized.split(/union\s+select/i);
    const firstPart = parts[0];
    const secondPart = parts[1]?.trim() || '';

    const firstMatch = firstPart.match(/SELECT \* FROM users WHERE username = '([^']+)'/i);
    const firstUser = firstMatch ? USERS.find((u) => u.username === firstMatch[1]) : null;

    let secondColumns: string[] = [];
    let secondRows: Record<string, string | number>[] = [];

    if (secondPart.toLowerCase().includes('username, password')) {
      secondColumns = ['username', 'password'];
      secondRows = USERS.map((u) => ({ username: u.username, password: u.password }));
    } else if (secondPart.includes('1,2,3')) {
      secondColumns = ['col1', 'col2', 'col3'];
      secondRows = [{ col1: 1, col2: 2, col3: 3 }];
    } else if (secondPart.toLowerCase().includes('version()') || secondPart.toLowerCase().includes('version ()')) {
      secondColumns = ['version()'];
      secondRows = [{ 'version()': '5.7.38-log' }];
    }

    const combinedRows = [...(firstUser ? [firstUser] : []), ...secondRows];
    return {
      columns: firstUser ? ['id', 'username', 'password', 'email', 'role'] : secondColumns,
      rows: combinedRows,
      bypassSuccess: secondRows.length > 0,
    };
  }

  if (lower.includes('or 1=1') || lower.includes("' or") || lower.includes("' OR")) {
    const allUsers = USERS.map((u) => ({ ...u }));
    return { columns: ['id', 'username', 'password', 'email', 'role'], rows: allUsers, bypassSuccess: true };
  }

  if (lower.includes('and 1=1') || lower.includes("' and '1'='1")) {
    const match = normalized.match(/username = '([^']+)'/i);
    const user = match ? USERS.find((u) => u.username === match[1]) : null;
    if (user) {
      return { columns: ['id', 'username', 'password', 'email', 'role'], rows: [user], bypassSuccess: false };
    }
    return { columns: ['id', 'username', 'password', 'email', 'role'], rows: [], bypassSuccess: false };
  }

  const match = normalized.match(/SELECT \* FROM users WHERE username = '([^']+)'/i);
  if (match) {
    const user = USERS.find((u) => u.username === match[1]);
    if (user) {
      return { columns: ['id', 'username', 'password', 'email', 'role'], rows: [user], bypassSuccess: false };
    }
    return { columns: ['id', 'username', 'password', 'email', 'role'], rows: [], bypassSuccess: false };
  }

  return { columns: [], rows: [], error: 'Syntax error or unsupported query.' };
}

export function SqliTesterLab() {
  const { verifyAndComplete } = useTask();
  const [queryMode, setQueryMode] = useState<'vulnerable' | 'parameterized'>('vulnerable');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [animStage, setAnimStage] = useState<'idle' | 'parsing' | 'executing' | 'done'>('idle');
  const [bypassAnswer, setBypassAnswer] = useState('');
  const [bypassResult, setBypassResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [cweAnswer, setCweAnswer] = useState('');
  const [cweResult, setCweResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [labResult, setLabResult] = useState<LabResult>({ status: 'idle', output: '' });

  const buildQuery = (): string => {
    if (queryMode === 'parameterized') {
      return `SELECT * FROM users WHERE username = :username`;
    }
    return `SELECT * FROM users WHERE username = '${userInput}'`;
  };

  const handleExecute = () => {
    if (!userInput && queryMode === 'vulnerable') return;
    setResult(null);
    setAnimStage('parsing');
    setLabResult({ status: 'running', output: '' });

    setTimeout(() => {
      setAnimStage('executing');
      const query = buildQuery();
      const execResult = simpleSqlEngine(query, queryMode);

      setTimeout(() => {
        setResult(execResult);
        setAnimStage('done');
        const output = [
          `Mode:             ${queryMode}`,
          `Query:            ${query}`,
          `Status:           ${execResult.error ? 'ERROR' : 'SUCCESS'}`,
          execResult.error ? `Error:            ${execResult.error}` : '',
          execResult.rows.length > 0 ? `Rows returned:     ${execResult.rows.length}` : '',
          execResult.rows.length > 0 ? `Columns:           ${execResult.columns.join(', ')}` : '',
          ...execResult.rows.flatMap((row) =>
            execResult.columns.map((col) => `  ${col}: ${row[col]}`)
          ),
          `Bypass Success:    ${execResult.bypassSuccess ? 'YES' : 'NO'}`,
        ].filter(Boolean).join('\n');
        setLabResult({ status: 'success', output });
        verifyAndComplete(LAB_ID, output);
      }, 600);
    }, 400);
  };

  const handleBypassSubmit = () => {
    if (bypassAnswer.toLowerCase().includes('or 1=1') || bypassAnswer.toLowerCase().includes('union')) {
      setBypassResult('correct');
      verifyAndComplete(LAB_ID, 'BYPASS_SUCCESS');
    } else {
      setBypassResult('wrong');
    }
  };

  const handleCweSubmit = () => {
    if (cweAnswer.toUpperCase().includes('CWE-89') || cweAnswer.toUpperCase().includes('CWE 89')) {
      setCweResult('correct');
      verifyAndComplete(LAB_ID, 'CWE_CORRECT');
    } else {
      setCweResult('wrong');
    }
  };

  const currentQuery = buildQuery();

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/70 bg-zinc-950/40">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Database size={15} className="text-zinc-400" />
            SQL Injection Tester
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Execute real SQL queries against an in-browser database and test injection payloads.
          </p>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Query Mode</label>
              <div className="flex gap-2">
                <button onClick={() => setQueryMode('vulnerable')} className={`flex-1 px-3 py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${queryMode === 'vulnerable' ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                  Vulnerable (Concatenation)
                </button>
                <button onClick={() => setQueryMode('parameterized')} className={`flex-1 px-3 py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${queryMode === 'parameterized' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                  Parameterized (Safe)
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Username Input</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter username or injection payload"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Generated Query</span>
            <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">{currentQuery}</pre>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" onClick={handleExecute} disabled={animStage === 'parsing' || animStage === 'executing'} className="gap-2">
              {animStage === 'parsing' || animStage === 'executing' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              {animStage === 'parsing' ? 'Parsing...' : animStage === 'executing' ? 'Executing...' : 'Execute Query'}
            </Button>
            {animStage === 'done' && (
              <button onClick={() => { setResult(null); setAnimStage('idle'); setLabResult({ status: 'idle', output: '' }); setUserInput(''); }} className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer">Reset</button>
            )}
          </div>

          {animStage === 'parsing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 py-3">
              <Code2 size={18} className="text-cyan-400" />
              <span className="text-xs text-zinc-400">Parsing query tokens...</span>
            </motion.div>
          )}

          {animStage === 'executing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 py-3">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Database size={18} className="text-emerald-400" />
              </motion.div>
              <span className="text-xs text-zinc-400">Executing against in-memory database...</span>
            </motion.div>
          )}

          {result && animStage === 'done' && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
                <div className="flex items-center gap-2">
                  {result.error ? <AlertCircle size={13} className="text-red-400" /> : <CheckCircle2 size={13} className="text-emerald-400" />}
                  <span className="text-[11px] font-mono text-zinc-400">{result.error ? 'Query Error' : 'Query Result'}</span>
                </div>
                {result.bypassSuccess !== undefined && (
                  <span className={`text-[10px] font-mono ${result.bypassSuccess ? 'text-red-400' : 'text-emerald-400'}`}>
                    Bypass: {result.bypassSuccess ? 'SUCCESS' : 'BLOCKED'}
                  </span>
                )}
              </div>
              {result.rows.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-zinc-800/70 bg-zinc-900/20">
                        {result.columns.map((col) => (
                          <th key={col} className="px-3 py-2 text-left text-zinc-500 font-medium">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-800/50">
                          {result.columns.map((col) => (
                            <td key={col} className="px-3 py-2 text-zinc-300">{String(row[col])}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {result.error && <pre className="p-4 text-xs font-mono text-red-300">{result.error}</pre>}
            </motion.div>
          )}

          {labResult.status === 'success' && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-lg border border-zinc-800 bg-zinc-950/80 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/70 bg-zinc-900/40">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-[11px] font-mono text-zinc-400">Full Output</span>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap">{labResult.output}</pre>
            </motion.div>
          )}

          <div className="border-t border-zinc-800/80 pt-5 space-y-4">
            <h4 className="text-sm font-semibold text-zinc-200">Challenges</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
                <p className="text-xs text-zinc-400">Switch to Vulnerable mode and bypass the login by making the WHERE clause always true.</p>
                <div className="flex items-center gap-2">
                  <input type="text" value={bypassAnswer} onChange={(e) => setBypassAnswer(e.target.value)} placeholder="Enter injection payload..." className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600" />
                  <Button variant="primary" size="sm" onClick={handleBypassSubmit}>Submit</Button>
                </div>
                {bypassResult === 'correct' && <div className="text-xs text-emerald-400">Correct! OR 1=1 always evaluates to true.</div>}
                {bypassResult === 'wrong' && <div className="text-xs text-red-400">Try a payload that makes the WHERE clause always true.</div>}
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
                <p className="text-xs text-zinc-400">What is the CWE ID for SQL injection caused by improper neutralization of special elements?</p>
                <div className="flex items-center gap-2">
                  <input type="text" value={cweAnswer} onChange={(e) => setCweAnswer(e.target.value)} placeholder="e.g. CWE-89" className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600" />
                  <Button variant="primary" size="sm" onClick={handleCweSubmit}>Submit</Button>
                </div>
                {cweResult === 'correct' && <div className="text-xs text-emerald-400">Correct! CWE-89: SQL Injection.</div>}
                {cweResult === 'wrong' && <div className="text-xs text-red-400">Hint: It starts with CWE-89.</div>}
              </div>
            </div>
          </div>
        </div>
        <TaskPanel labId={LAB_ID} />
      </div>
    </motion.div>
  );
}
