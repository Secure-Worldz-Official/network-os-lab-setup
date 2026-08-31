import { useState, useRef, useEffect } from 'react';
import { TerminalProvider } from '@/lib/labServices';
import { Terminal as TermIcon, RefreshCw, Copy, Check } from 'lucide-react';

interface InteractiveTerminalProps {
  targetIp?: string;
  roomId?: string;
  roomTitle?: string;
  onCommandRun?: (cmd: string, output: string) => void;
  initialMessage?: string;
}

interface HistoryItem {
  id: string;
  command: string;
  output: string;
  isError?: boolean;
}

export function InteractiveTerminal({
  targetIp = '10.10.20.15',
  roomId = 'general',
  roomTitle,
  onCommandRun,
  initialMessage
}: InteractiveTerminalProps) {
  const promptUser = TerminalProvider.getPromptForRoom(roomId);

  const [history, setHistory] = useState<HistoryItem[]>(() => [
    {
      id: 'init-1',
      command: '# ISOLATED ENVIRONMENT CONTAINER INITIALIZED',
      output: initialMessage || `Connected to CyberPath ${roomTitle || 'Lab Target'} Container [${targetIp}].\nType 'help', 'nmap ${targetIp}', or run lab commands to inspect.`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, inputVal]);

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

    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInputVal('');

    const res = TerminalProvider.executeCommand(trimmed, targetIp, roomId);

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
    const text = history.map(h => `${promptUser} ${h.command}\n${h.output}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTerminal = () => {
    setHistory([
      {
        id: 'init-reset',
        command: '# TERMINAL RESET',
        output: `Cleared terminal buffer. Target session active [${targetIp}].`
      }
    ]);
    setInputVal('');
  };

  return (
    <div 
      className="w-full rounded-md border border-[#222222] bg-[#050505] font-mono text-xs shadow-2xl overflow-hidden flex flex-col h-[380px] sm:h-[440px] relative cursor-text select-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden HTML Input for focus and typing */}
      <input
        ref={inputRef}
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
        aria-label="Terminal input stream"
        autoFocus
      />

      {/* Console Window Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#111111] border-b border-[#222222] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-[10px] text-zinc-400 font-bold tracking-wider uppercase">
            <TermIcon size={12} className="text-emerald-400" />
            <span>CYBERPATH CONSOLE // {roomTitle?.toUpperCase() || roomId.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              copyConsoleOutput();
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer font-bold"
            title="Copy Console Output"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span className="hidden sm:inline">{copied ? 'COPIED' : 'COPY'}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetTerminal();
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer font-bold"
            title="Clear Console"
          >
            <RefreshCw size={12} />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#050505] text-[#00FF66] font-mono text-xs leading-relaxed select-text">
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-zinc-300 font-mono">
                <span className="text-emerald-400 font-bold shrink-0">{promptUser}</span>
                <span className="font-semibold text-white">{item.command}</span>
              </div>
            )}
            {item.output && (
              <pre className={`whitespace-pre-wrap font-mono text-[11px] leading-relaxed ${
                item.isError ? 'text-rose-400' : 'text-zinc-300'
              }`}>
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {/* Dynamic Room Prompt & Cursor */}
        <div className="flex items-center flex-wrap gap-1 text-zinc-300 font-mono text-xs leading-none pt-1">
          <span className="text-emerald-400 font-bold shrink-0">{promptUser}</span>
          <span className="text-white font-mono whitespace-pre">{inputVal}</span>
          <span
            className={`w-2 h-4 bg-emerald-400 inline-block align-middle ml-0.5 ${
              isFocused ? 'animate-pulse' : 'opacity-30'
            }`}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
