import { useState } from 'react';
import { useCyberPath } from '@/context/CyberPathContext';
import { Wifi, Download, CheckCircle, RefreshCw, Server } from 'lucide-react';

export function VpnPage() {
  const { vpnStatus, toggleVpn, downloadVpnConfig, username } = useCyberPath();
  const [checking, setChecking] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  const handleCheckConnection = () => {
    setChecking(true);
    setVerifyMsg(null);
    setTimeout(() => {
      setChecking(false);
      if (vpnStatus.connected) {
        setVerifyMsg('✓ LATENCY 14ms — CONNECTED TO CYBERPATH PRIVATE LAB NETWORK (10.8.0.14)');
      } else {
        setVerifyMsg('✕ DISCONNECTED — Please import your .ovpn configuration or click toggle below.');
      }
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none font-mono">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest mb-1">
          <Wifi size={14} className="text-[#111111] dark:text-white" />
          <span>VIRTUAL PRIVATE NETWORK SETUP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
          LAB CONNECTIVITY & VPN GUIDE
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] mt-1 font-sans">
          Connect your device to the CyberPath isolated virtual laboratory network to safely interact with target machines.
        </p>
      </div>

      {/* VPN Connection Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-widest block">
              CURRENT VPN STATUS
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${vpnStatus.connected ? 'bg-emerald-600 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-base font-extrabold text-[#111111] dark:text-white uppercase font-heading">
                {vpnStatus.connected ? 'CONNECTED' : 'NOT CONNECTED'}
              </span>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#B5B5B5]">
              Network: <strong className="text-[#111111] dark:text-white">{vpnStatus.network}</strong> | Assigned IP: <strong className="text-[#111111] dark:text-white">{vpnStatus.ip}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCheckConnection}
              disabled={checking}
              className="btn-cyber-secondary text-xs"
            >
              <RefreshCw size={13} className={checking ? 'animate-spin' : ''} />
              <span>{checking ? 'PINGING LAB...' : 'CHECK CONNECTION'}</span>
            </button>
            <button
              onClick={downloadVpnConfig}
              className="btn-cyber-primary text-xs"
            >
              <Download size={13} />
              <span>DOWNLOAD VPN CONFIG</span>
            </button>
          </div>
        </div>

        {verifyMsg && (
          <div className={`p-3 rounded border text-xs font-mono font-bold ${
            vpnStatus.connected ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-rose-600 bg-rose-500/10 text-rose-700 dark:text-rose-400'
          }`}>
            {verifyMsg}
          </div>
        )}

        {/* Quick Toggle for Simulated Environment */}
        <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#181818] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#111111] dark:text-white block">SIMULATED VPN STATUS TOGGLE</span>
            <span className="text-[#666666] dark:text-[#888888] text-[11px]">
              Toggle client-side simulated VPN status for offline development mode.
            </span>
          </div>
          <button
            onClick={toggleVpn}
            className={`px-3 py-1.5 rounded font-bold text-xs transition-colors ${
              vpnStatus.connected 
                ? 'bg-rose-600 text-white hover:bg-rose-700' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {vpnStatus.connected ? 'DISCONNECT VPN' : 'CONNECT VPN'}
          </button>
        </div>
      </div>

      {/* 6-Step Setup Instructions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#111111] dark:text-white font-heading uppercase tracking-wide">
          6-STEP CONNECTIVITY WORKFLOW
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {[
            { num: '01', title: 'Download Lab Configuration', desc: `Generate your personalized .ovpn certificate configuration file bound to user ${username}.` },
            { num: '02', title: 'Install Supported Client', desc: 'Install OpenVPN GUI, WireGuard, or Tunnelblick on your host operating system.' },
            { num: '03', title: 'Import Profile to Client', desc: 'Drag and drop your cyberpath_lab.ovpn profile into the VPN client dashboard.' },
            { num: '04', title: 'Connect to Lab Network', desc: 'Initiate connection to entry node vpn.cyberpath.labs on UDP port 1194.' },
            { num: '05', title: 'Verify Gateway Connection', desc: 'Confirm your local interface receives an IP address in the 10.8.0.0/24 range.' },
            { num: '06', title: 'Start Target Machine & Attack', desc: 'Launch target instances inside any room to start performing security tasks.' }
          ].map((step) => (
            <div key={step.num} className="p-4 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded bg-[#111111] dark:bg-white text-white dark:text-[#080808] text-[10px] font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <CheckCircle size={14} className="text-[#888888] dark:text-[#777777]" />
              </div>
              <h3 className="font-bold text-sm text-[#111111] dark:text-white font-heading uppercase">
                {step.title}
              </h3>
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Disclaimer Card */}
      <div className="p-5 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#111111] dark:text-white uppercase">
          <Server size={14} className="text-[#111111] dark:text-white" />
          <span>ISOLATED LAB ARCHITECTURE NOTE</span>
        </div>
        <p className="text-[#555555] dark:text-[#B5B5B5] font-sans text-xs leading-relaxed">
          CyberPath virtual lab targets run inside isolated Docker and Kubernetes worker nodes. Target host IPs in the <code className="text-[#111111] dark:text-white bg-[#F5F5F5] dark:bg-[#202020] px-1 py-0.5 rounded">10.10.X.X</code> range are strictly isolated from production application servers.
        </p>
      </div>
    </div>
  );
}
