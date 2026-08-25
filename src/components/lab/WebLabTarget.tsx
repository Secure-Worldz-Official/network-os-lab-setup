import { useState } from 'react';
import { Globe, Lock, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

interface WebLabTargetProps {
  targetIp?: string;
  initialUrl?: string;
  onFlagSubmit?: (flag: string) => void;
}

export function WebLabTarget({ targetIp = '10.10.30.8', initialUrl = 'http://lab-target.local', onFlagSubmit }: WebLabTargetProps) {
  const [url] = useState(initialUrl);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [xssPayload, setXssPayload] = useState('');
  const [logs, setLogs] = useState<string[]>([
    'HTTP/1.1 200 OK',
    'Server: nginx/1.18.0 (Ubuntu)',
    'Content-Type: text/html; charset=UTF-8',
    'X-Container-ID: cpath-target-web-01'
  ]);

  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>({
    type: 'info',
    text: 'Web application target active. Perform vulnerability inspection below.'
  });

  const handleSqlFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    setLogs(prev => [`POST ${url}/login - 200 OK`, `Payload: user=${cleanUser}`, ...prev]);

    if (cleanUser.includes("'") || cleanUser.toLowerCase().includes('or 1=1') || cleanUser.toLowerCase().includes("or '1'='1")) {
      const flag = 'CP{SQLI_UNION_BYPASS_COMPLETE}';
      setMessage({
        type: 'success',
        text: `AUTHENTICATION BYPASS SUCCESSFUL! Flag captured: ${flag}`
      });
      if (onFlagSubmit) onFlagSubmit(flag);
    } else if (cleanUser === 'admin' && password === 'cyberpath123') {
      setMessage({
        type: 'success',
        text: 'LOGGED IN AS ADMIN! Welcome to backend portal.'
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Invalid credentials. Database query executed: SELECT * FROM users WHERE user=\'' + cleanUser + '\''
      });
    }
  };

  const handleXssFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLogs(prev => [`POST ${url}/comment - 200 OK`, `Input Payload: ${xssPayload}`, ...prev]);

    if (xssPayload.toLowerCase().includes('<script>') || xssPayload.toLowerCase().includes('alert(')) {
      const flag = 'CP{DOM_XSS_PAYLOAD_SUCCESS}';
      setMessage({
        type: 'success',
        text: `XSS EXECUTION TRIGGERED IN DOM! Flag captured: ${flag}`
      });
      if (onFlagSubmit) onFlagSubmit(flag);
    } else {
      setMessage({
        type: 'error',
        text: 'Input sanitized. Script execution did not trigger in browser DOM.'
      });
    }
  };

  return (
    <div className="w-full rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] font-mono text-xs shadow-sm overflow-hidden flex flex-col">
      {/* Browser Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F7F7] dark:bg-[#101010] border-b border-[#E5E5E5] dark:border-[#2A2A2A] shrink-0 select-none">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
        </div>

        <div className="flex-1 flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded text-[11px] text-[#111111] dark:text-white">
          <Lock size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">{url} ({targetIp})</span>
        </div>

        <button 
          onClick={() => setMessage({ type: 'info', text: 'Refreshed simulated target DOM container.' })}
          className="p-1 rounded text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E5E5] dark:hover:bg-[#202020]"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Target Application Body */}
      <div className="p-5 space-y-5 bg-[#FAFAFA] dark:bg-[#101010]">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-[#111111] dark:text-white" />
            <h3 className="font-heading font-bold text-sm text-[#111111] dark:text-white uppercase tracking-wide">
              TARGET WEB APPLICATION PORTAL
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded">
            ● ONLINE (ISOLATED LAB)
          </span>
        </div>

        {message && (
          <div className={`p-3 rounded border text-xs leading-relaxed font-mono ${
            message.type === 'success' 
              ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold' 
              : message.type === 'error'
              ? 'border-rose-600 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold'
              : 'border-[#CCCCCC] dark:border-[#333333] bg-white dark:bg-[#181818] text-[#111111] dark:text-white'
          }`}>
            {message.text}
          </div>
        )}

        {/* Section 1: SQL Injection Demo Login Form */}
        <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3">
          <h4 className="font-bold text-xs text-[#111111] dark:text-white uppercase flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-[#111111] dark:text-white" />
            AUTHENTICATION PORTAL AUDIT (SQL INJECTION TEST)
          </h4>
          <form onSubmit={handleSqlFormSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#666666] dark:text-[#B5B5B5] mb-1">
                  USERNAME / PAYLOAD
                </label>
                <input
                  type="text"
                  placeholder="admin' OR '1'='1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-1.5 text-xs text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#666666] dark:text-[#B5B5B5] mb-1">
                  PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-1.5 text-xs text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white outline-none font-mono"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-cyber-primary text-xs py-1.5 px-4"
            >
              [ SUBMIT AUTHENTICATION REQUEST ]
            </button>
          </form>
        </div>

        {/* Section 2: XSS Test Input */}
        <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3">
          <h4 className="font-bold text-xs text-[#111111] dark:text-white uppercase flex items-center gap-1.5">
            <CheckCircle size={14} className="text-[#111111] dark:text-white" />
            DOM INPUT COMMENT BOX (XSS PAYLOAD TEST)
          </h4>
          <form onSubmit={handleXssFormSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#666666] dark:text-[#B5B5B5] mb-1">
                COMMENT PAYLOAD
              </label>
              <input
                type="text"
                placeholder="<script>alert(1)</script>"
                value={xssPayload}
                onChange={(e) => setXssPayload(e.target.value)}
                className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-1.5 text-xs text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="btn-cyber-primary text-xs py-1.5 px-4"
            >
              [ POST COMMENT TO DOM ]
            </button>
          </form>
        </div>

        {/* Dark Technical Server Logs */}
        <div className="rounded border border-[#222222] bg-[#050505] p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block border-b border-zinc-800 pb-1 mb-2">
            HTTP SERVER CONTAINER LOGS
          </span>
          {logs.map((log, i) => (
            <p key={i} className="text-[11px] text-[#00FF66] font-mono leading-relaxed truncate">
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
