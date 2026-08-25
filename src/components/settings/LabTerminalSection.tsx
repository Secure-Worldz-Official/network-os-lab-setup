import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useCyberPath } from '@/context/CyberPathContext';
import { Link } from 'react-router-dom';
import { Terminal, Play, Square, RefreshCw, Check, Type, ExternalLink } from 'lucide-react';

export function LabTerminalSection() {
  const { labTerminal, updateLabTerminal } = useSettings();
  const { activeLab, stopLab, resetLab, startLab } = useCyberPath();

  const [previewCommand, setPreviewCommand] = useState('whoami');
  const [previewHistory, setPreviewHistory] = useState([
    { cmd: 'nmap -sV -p 22,80 10.10.20.15', out: 'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9p1\n80/tcp open  http    Apache httpd 2.4.52' },
    { cmd: 'whoami', out: 'cyberpath-root-oper' }
  ]);

  const handleRunPreviewCmd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewCommand.trim()) return;
    const cmd = previewCommand.trim();
    let out = `Executed: ${cmd}`;
    if (cmd === 'help') out = 'Available preview commands: help, whoami, id, uname -a, ifconfig, cat /etc/issue';
    else if (cmd === 'id') out = 'uid=0(root) gid=0(root) groups=0(root)';
    else if (cmd === 'uname -a') out = 'Linux cyberpath-target-03 5.15.0-generic #1 SMP x86_64 GNU/Linux';
    else if (cmd === 'ifconfig') out = 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 10.10.20.15  netmask 255.255.255.0';
    else if (cmd === 'clear') {
      setPreviewHistory([]);
      setPreviewCommand('');
      return;
    }

    setPreviewHistory((prev) => [...prev, { cmd, out }]);
    setPreviewCommand('');
  };

  const fontSizes = ['12px', '14px', '16px', '18px'] as const;
  const fonts = ['JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Courier New', 'SF Mono'] as const;
  const lineSpacings = ['compact', 'normal', 'comfortable'] as const;
  const cursors = ['block', 'line', 'underline'] as const;

  const toggles: Array<{
    key: keyof Omit<typeof labTerminal, 'terminalFontSize' | 'terminalFontFamily' | 'terminalLineSpacing' | 'terminalCursor'>;
    title: string;
    description: string;
  }> = [
    {
      key: 'autoStartLab',
      title: 'Auto-Start Lab Machine on Room Open',
      description: 'Automatically spin up the virtual target container when entering a practical room.'
    },
    {
      key: 'labTimerWarnings',
      title: 'Lab Timer Expiration Warnings',
      description: 'Display audible and visual countdown banner warnings when 5 minutes remain on active session.'
    },
    {
      key: 'autoResetExpired',
      title: 'Auto-Reset Expired Labs',
      description: 'Automatically teardown container state when lab timer finishes without extension.'
    },
    {
      key: 'terminalSound',
      title: 'Terminal Audio Feedback',
      description: 'Play subtle mechanical keystroke sounds and bell alerts on command completion.'
    },
    {
      key: 'commandHistory',
      title: 'Persistent Command History',
      description: 'Save command buffer history to recall previous commands using the Up/Down arrow keys.'
    },
    {
      key: 'lineWrapping',
      title: 'Terminal Line Wrapping',
      description: 'Wrap long command outputs and Nmap scan dumps to avoid horizontal scrollbars.'
    },
    {
      key: 'confirmLabReset',
      title: 'Confirm Lab Machine Reset',
      description: 'Prompt for confirmation before issuing machine reboot or state wipe commands.'
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Active Lab Sessions Widget */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Terminal size={14} />
          ACTIVE TARGET LAB SESSIONS
        </h3>

        {activeLab ? (
          <div className="p-4 rounded-md border border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#181818] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-extrabold text-sm text-[#111111] dark:text-white uppercase">
                  {activeLab.roomTitle}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase border border-emerald-500/20">
                  ● {activeLab.status}
                </span>
              </div>
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-mono">
                Target IP: <strong>{activeLab.targetIp}</strong> | Remaining Time: <strong>{Math.floor(activeLab.timeRemainingSeconds / 60)}:{(activeLab.timeRemainingSeconds % 60).toString().padStart(2, '0')}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                to={`/rooms/${activeLab.roomId}`}
                className="btn-cyber-primary text-xs py-2 px-3.5 flex-1 sm:flex-none"
              >
                <ExternalLink size={13} />
                <span>OPEN LAB</span>
              </Link>
              <button
                type="button"
                onClick={resetLab}
                className="btn-cyber-secondary text-xs py-2 px-3 flex-1 sm:flex-none"
                title="Reset target machine"
              >
                <RefreshCw size={13} />
                <span>RESET</span>
              </button>
              <button
                type="button"
                onClick={stopLab}
                className="btn-cyber-secondary text-xs py-2 px-3 flex-1 sm:flex-none text-rose-600 dark:text-rose-400 border-rose-500/30 hover:border-rose-500"
                title="Stop container"
              >
                <Square size={13} />
                <span>STOP</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#101010] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="font-bold text-[#111111] dark:text-white block">NO ACTIVE LAB INSTANCES RUNNING</span>
              <span className="text-[11px] text-[#666666] dark:text-[#888888] font-sans">
                Virtual targets spin up automatically when starting practical rooms or clicking the button below.
              </span>
            </div>
            <button
              type="button"
              onClick={() => startLab('nmap-fundamentals')}
              className="btn-cyber-primary text-xs py-2 px-4 shrink-0"
            >
              <Play size={13} />
              <span>SPAWN TEST LAB (NMAP-01)</span>
            </button>
          </div>
        )}
      </div>

      {/* Terminal Customization & Live Preview */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Type size={14} />
          TERMINAL APPEARANCE & LIVE PREVIEW
        </h3>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Font Size */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
              FONT SIZE
            </label>
            <div className="grid grid-cols-4 gap-1">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateLabTerminal({ terminalFontSize: size })}
                  className={`py-1.5 text-[10px] font-bold rounded border uppercase transition-all ${
                    labTerminal.terminalFontSize === size
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                      : 'bg-[#FAFAFA] dark:bg-[#181818] text-[#555555] dark:text-[#B5B5B5] border-[#E5E5E5] dark:border-[#2A2A2A]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
              MONOSPACE FONT
            </label>
            <select
              value={labTerminal.terminalFontFamily}
              onChange={(e) => updateLabTerminal({ terminalFontFamily: e.target.value as any })}
              className="w-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs font-mono font-bold text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Line Spacing */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
              LINE SPACING
            </label>
            <div className="grid grid-cols-3 gap-1">
              {lineSpacings.map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => updateLabTerminal({ terminalLineSpacing: sp })}
                  className={`py-1.5 text-[9px] font-bold rounded border uppercase transition-all ${
                    labTerminal.terminalLineSpacing === sp
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                      : 'bg-[#FAFAFA] dark:bg-[#181818] text-[#555555] dark:text-[#B5B5B5] border-[#E5E5E5] dark:border-[#2A2A2A]'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Cursor Style */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
              CURSOR STYLE
            </label>
            <div className="grid grid-cols-3 gap-1">
              {cursors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateLabTerminal({ terminalCursor: c })}
                  className={`py-1.5 text-[9px] font-bold rounded border uppercase transition-all ${
                    labTerminal.terminalCursor === c
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                      : 'bg-[#FAFAFA] dark:bg-[#181818] text-[#555555] dark:text-[#B5B5B5] border-[#E5E5E5] dark:border-[#2A2A2A]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interactive Terminal Preview */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-wider block">
            LIVE INTERACTIVE PREVIEW
          </span>

          <div
            className="rounded-md border border-[#222222] bg-[#050505] text-[#00FF66] shadow-2xl overflow-hidden"
            style={{
              fontFamily: labTerminal.terminalFontFamily,
              fontSize: labTerminal.terminalFontSize,
              lineHeight:
                labTerminal.terminalLineSpacing === 'compact'
                  ? 1.3
                  : labTerminal.terminalLineSpacing === 'comfortable'
                  ? 1.8
                  : 1.55
            }}
          >
            {/* Terminal Window Top Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#111111] border-b border-[#222222] text-[10px] text-zinc-400 select-none">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="font-bold ml-2">CYBERPATH PREVIEW CONSOLE</span>
              </div>
              <span className="text-[9px] text-zinc-500">
                {labTerminal.terminalFontFamily} • {labTerminal.terminalFontSize}
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-2 min-h-[160px] max-h-[220px] overflow-y-auto">
              <p className="text-zinc-500 text-[10px]">
                # CyberPath Interactive Target Container [Target: 10.10.20.15]
              </p>

              {previewHistory.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-400 font-bold">cyberpath@lab:~$</span>
                    <span className="text-white font-semibold">{item.cmd}</span>
                  </div>
                  <pre className="text-zinc-300 whitespace-pre-wrap pl-2 border-l border-zinc-800 text-[0.9em]">
                    {item.out}
                  </pre>
                </div>
              ))}

              {/* Input row */}
              <form onSubmit={handleRunPreviewCmd} className="flex items-center gap-2 pt-1">
                <span className="text-emerald-400 font-bold shrink-0">cyberpath@lab:~$</span>
                <input
                  type="text"
                  value={previewCommand}
                  onChange={(e) => setPreviewCommand(e.target.value)}
                  placeholder="Type test command (e.g. id, ifconfig, help, clear)..."
                  className="flex-1 bg-transparent text-white border-none outline-none p-0 focus:ring-0"
                  style={{
                    fontFamily: labTerminal.terminalFontFamily,
                    fontSize: labTerminal.terminalFontSize
                  }}
                />
                {/* Cursor graphic based on preference */}
                {labTerminal.terminalCursor === 'block' && (
                  <span className="inline-block w-2 h-4 bg-[#00FF66] animate-pulse" />
                )}
                {labTerminal.terminalCursor === 'line' && (
                  <span className="inline-block w-0.5 h-4 bg-[#00FF66] animate-pulse" />
                )}
                {labTerminal.terminalCursor === 'underline' && (
                  <span className="inline-block w-2.5 h-0.5 bg-[#00FF66] animate-pulse mt-3" />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Environment Behavior Toggles */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <RefreshCw size={14} />
          CONTAINER & SESSION LIFECYCLE BEHAVIORS
        </h3>

        <div className="space-y-2.5">
          {toggles.map((item) => {
            const isChecked = labTerminal[item.key] as boolean;

            return (
              <div
                key={item.key}
                onClick={() => updateLabTerminal({ [item.key]: !isChecked })}
                className="flex items-center justify-between p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#CCCCCC] dark:hover:border-[#444444] cursor-pointer transition-all duration-150"
              >
                <div className="pr-4 space-y-0.5">
                  <span className="font-bold text-xs text-[#111111] dark:text-white uppercase font-heading block">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-[#666666] dark:text-[#B5B5B5] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      isChecked
                        ? 'bg-[#111111] dark:bg-white'
                        : 'bg-[#E5E5E5] dark:bg-[#2A2A2A]'
                    }`}
                  >
                    <div
                      className={`bg-white dark:bg-[#080808] w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                        isChecked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {isChecked && <Check size={10} className="text-[#111111] dark:text-white stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
