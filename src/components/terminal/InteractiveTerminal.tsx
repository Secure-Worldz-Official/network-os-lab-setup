import { useState, useRef, useEffect } from 'react';
import { TerminalProvider } from '@/lib/labServices';
import { Terminal as TermIcon, Play, RefreshCw, Copy, Check } from 'lucide-react';

interface InteractiveTerminalProps {
  targetIp?: string;
  onCommandRun?: (cmd: string, output: string) => void;
  initialMessage?: string;
}

interface HistoryItem {
  id: string;
  command: string;
  output: string;
  isError?: boolean;
}

export function InteractiveTerminal({ targetIp = '10.10.20.15', onCommandRun, initialMessage }: InteractiveTerminalProps) {
  const [history, setHistory] = useState<HistoryItem[]>(() => [
    {
      id: 'init-1',
      command: '# SYSTEM SESSION INITIALIZED',
      output: initialMessage || `Connected to CyberPath Virtual Lab Container. Target IP: ${targetIp}\nType 'help' or 'nmap ${targetIp}' to begin host inspection.`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCurrentCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const executeCurrentCommand = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    // Track command history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInputVal('');

    const res = TerminalProvider.executeCommand(trimmed, targetIp);

    if (res.output === '__CLEAR__') {
      setHistory([]);
      return;
    }

    const newItem: HistoryItem = {
      id: `item-${Date.now()}`,
      command: trimmed,
      output: res.output,
      isError: res.error
    };

    setHistory(prev => [...prev, newItem]);

    if (onCommandRun) {
      onCommandRun(trimmed, res.output);
    }
  };

  const copyConsoleOutput = () => {
    const text = history.map(h => `$ ${h.command}\n${h.output}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTerminal = () => {
    setHistory([
      {
        id: 'init-reset',
        command: '# TERMINAL RESET',
        output: `Cleared terminal buffer. Ready for input.`
      }
    ]);
  };

  return (
    <div className="w-full rounded-md border border-[#222222] bg-[#050505] font-mono text-xs shadow-2xl overflow-hidden flex flex-col h-[380px] sm:h-[440px]">
      {/* Dark Console Top Window Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#111111] border-b border-[#222222] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-[10px] text-zinc-400 font-bold tracking-wider uppercase">
            <TermIcon size={12} className="text-emerald-400" />
            <span>CYBERPATH LAB TERMINAL</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            onClick={copyConsoleOutput}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
            title="Copy Output"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span className="hidden sm:inline">{copied ? 'COPIED' : 'COPY'}</span>
          </button>
          <button
            onClick={resetTerminal}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
            title="Clear Console"
          >
            <RefreshCw size={12} />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#050505] text-[#00FF66] font-mono text-xs leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-emerald-400 font-bold">cyberpath@lab:~$</span>
                <span className="font-semibold text-white">{item.command}</span>
              </div>
            )}
            {item.output && (
              <pre className={`whitespace-pre-wrap font-mono text-[11px] ${
                item.isError ? 'text-rose-400' : 'text-zinc-300'
              }`}>
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {/* Input Prompt Row */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold shrink-0">cyberpath@lab:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white border-none outline-none font-mono text-xs p-0 focus:ring-0"
            placeholder="type command (e.g. nmap 10.10.20.15, cat flag.txt, help)..."
            autoFocus
          />
          <button
            onClick={executeCurrentCommand}
            className="p-1 text-emerald-400 hover:text-white transition-colors"
          >
            <Play size={12} />
          </button>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
