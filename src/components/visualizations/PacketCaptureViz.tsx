import { useState, useEffect } from 'react';
import { Play, Pause, Terminal, Eye } from 'lucide-react';

interface CapturedPacket {
  no: number;
  time: string;
  src: string;
  dst: string;
  proto: 'HTTP' | 'TCP' | 'DNS' | 'ARP';
  len: number;
  info: string;
  hex: string;
  ascii: string;
  details: {
    layer: string;
    headers: string[];
  };
}

const PACKETS: CapturedPacket[] = [
  {
    no: 1,
    time: '0.000',
    src: '192.168.1.105',
    dst: '8.8.8.8',
    proto: 'DNS',
    len: 74,
    info: 'Standard query 0x1a2b A example.com',
    hex: '4500 004a 1c2d 4000 4011 7cce c0a8 0169 0808 0808 0035',
    ascii: 'E..J.@.@.|..i...5..example.com..',
    details: {
      layer: 'Domain Name System (Query)',
      headers: ['Transaction ID: 0x1a2b', 'Flags: 0x0100 (Standard query)', 'Questions: 1 (A example.com)']
    }
  },
  {
    no: 2,
    time: '0.014',
    src: '8.8.8.8',
    dst: '192.168.1.105',
    proto: 'DNS',
    len: 90,
    info: 'Standard query response 0x1a2b A 93.184.216.34',
    hex: '4500 005a 0000 4000 3b11 9885 0808 0808 c0a8 0169 0035',
    ascii: 'E..Z..@.;......i.5..A 93.184.216.34',
    details: {
      layer: 'Domain Name System (Response)',
      headers: ['Transaction ID: 0x1a2b', 'Answers: 1 (93.184.216.34)', 'TTL: 300 seconds']
    }
  },
  {
    no: 3,
    time: '0.022',
    src: '192.168.1.105',
    dst: '93.184.216.34',
    proto: 'TCP',
    len: 66,
    info: '54321 → 80 [SYN] Seq=0 Win=64240 Len=0',
    hex: '4500 0042 d4f2 4000 4006 c37a c0a8 0169 5d80 d822 d431',
    ascii: 'E..B..@.@..z...i]..".1..SYN...',
    details: {
      layer: 'Transmission Control Protocol (SYN)',
      headers: ['Source Port: 54321', 'Destination Port: 80', 'Flags: [SYN]', 'Sequence Number: 0']
    }
  },
  {
    no: 4,
    time: '0.045',
    src: '93.184.216.34',
    dst: '192.168.1.105',
    proto: 'TCP',
    len: 66,
    info: '80 → 54321 [SYN, ACK] Seq=0 Ack=1 Win=65535',
    hex: '4500 0042 0000 4000 3806 986d 5d80 d822 c0a8 0169 0050',
    ascii: 'E..B..@.8..m].."...i.P..SYN-ACK',
    details: {
      layer: 'Transmission Control Protocol (SYN-ACK)',
      headers: ['Source Port: 80', 'Destination Port: 54321', 'Flags: [SYN, ACK]', 'Ack Number: 1']
    }
  },
  {
    no: 5,
    time: '0.046',
    src: '192.168.1.105',
    dst: '93.184.216.34',
    proto: 'TCP',
    len: 54,
    info: '54321 → 80 [ACK] Seq=1 Ack=1 Win=64240',
    hex: '4500 0036 d4f3 4000 4006 c385 c0a8 0169 5d80 d822 d431',
    ascii: 'E..6..@.@......i]..".1..ACK...',
    details: {
      layer: 'Transmission Control Protocol (ACK)',
      headers: ['Flags: [ACK]', 'Seq Number: 1', 'Ack Number: 1']
    }
  },
  {
    no: 6,
    time: '0.052',
    src: '192.168.1.105',
    dst: '93.184.216.34',
    proto: 'HTTP',
    len: 480,
    info: 'GET /login.php HTTP/1.1 (application/x-www-form-urlencoded)',
    hex: '4745 5420 2f6c 6f67 696e 2e70 6870 2048 5454 502f 312e',
    ascii: 'GET /login.php HTTP/1.1 Host: example.com User-Agent: Kali',
    details: {
      layer: 'Hypertext Transfer Protocol (GET Request)',
      headers: ['Method: GET', 'URI: /login.php', 'Host: example.com', 'User-Agent: Mozilla/5.0 (Kali Linux)']
    }
  }
];

export function PacketCaptureViz() {
  const [filter, setFilter] = useState<'ALL' | 'HTTP' | 'TCP' | 'DNS'>('ALL');
  const [isCapturing, setIsCapturing] = useState<boolean>(true);
  const [selectedNo, setSelectedNo] = useState<number>(6);
  const [streamIndex, setStreamIndex] = useState<number>(PACKETS.length);

  useEffect(() => {
    if (!isCapturing) return;
    const interval = setInterval(() => {
      setStreamIndex((prev) => (prev >= PACKETS.length ? 1 : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isCapturing]);

  const filteredPackets = PACKETS.slice(0, streamIndex).filter(
    (p) => filter === 'ALL' || p.proto === filter
  );

  const activePacket = PACKETS.find((p) => p.no === selectedNo) || PACKETS[0];

  return (
    <div className="space-y-5 font-mono select-none w-full">
      {/* Interactive Wireshark Control Header */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase shrink-0">
            FILTER:
          </span>
          {(['ALL', 'HTTP', 'TCP', 'DNS'] as const).map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                id={`pcap-filter-${f.toLowerCase()}`}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <button
          id="pcap-toggle-capture"
          type="button"
          onClick={() => setIsCapturing(!isCapturing)}
          className="p-2 rounded-lg bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors flex items-center gap-1.5 text-xs font-bold uppercase shrink-0 cursor-pointer"
          title={isCapturing ? 'Stop Packet Capture' : 'Start Live Packet Capture'}
        >
          {isCapturing ? <Pause size={14} /> : <Play size={14} />}
          <span className="hidden sm:inline">{isCapturing ? 'PAUSE STREAM' : 'START STREAM'}</span>
        </button>
      </div>

      {/* Live Packet Table Stream */}
      <div className="rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-2 p-3 bg-[#F7F7F7] dark:bg-[#181818] border-b border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-extrabold text-[#888888] dark:text-[#777777] uppercase">
          <span className="col-span-1">NO.</span>
          <span className="col-span-2">TIME</span>
          <span className="col-span-3">SOURCE</span>
          <span className="col-span-3">DESTINATION</span>
          <span className="col-span-1">PROTO</span>
          <span className="col-span-2 text-right">LEN</span>
        </div>

        <div className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A] max-h-[220px] overflow-y-auto">
          {filteredPackets.map((p) => {
            const isSelected = p.no === selectedNo;
            return (
              <button
                key={p.no}
                id={`pcap-row-${p.no}`}
                type="button"
                onClick={() => {
                  setSelectedNo(p.no);
                  setIsCapturing(false);
                }}
                className={`w-full grid grid-cols-12 gap-2 p-3 text-left text-xs font-mono transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-black font-extrabold'
                    : 'hover:bg-[#F7F7F7] dark:hover:bg-[#181818] text-[#111111] dark:text-white'
                }`}
              >
                <span className="col-span-1 opacity-80">{p.no}</span>
                <span className="col-span-2 opacity-80">{p.time}</span>
                <span className="col-span-3 truncate">{p.src}</span>
                <span className="col-span-3 truncate">{p.dst}</span>
                <span className={`col-span-1 font-extrabold ${p.proto === 'HTTP' ? 'text-amber-500' : p.proto === 'TCP' ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {p.proto}
                </span>
                <span className="col-span-2 text-right opacity-80">{p.len}B</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Packet Inspector & Hex Dump */}
      <div className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2.5">
            <Eye size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              PACKET #{activePacket.no} — {activePacket.details.layer}
            </span>
          </div>
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] font-mono">
            FRAME LEN: {activePacket.len} BYTES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2 font-mono">
            <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">DECODED PROTOCOL HEADERS</span>
            <ul className="space-y-1 text-[#111111] dark:text-white text-xs">
              {activePacket.details.headers.map((h, i) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2 font-mono">
            <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] flex items-center gap-1">
              <Terminal size={12} /> RAW HEX & ASCII PAYLOAD
            </span>
            <code className="block text-xs text-emerald-600 dark:text-emerald-400 break-all leading-relaxed font-bold">
              HEX: {activePacket.hex}
            </code>
            <code className="block text-xs text-[#111111] dark:text-white break-all leading-relaxed font-sans pt-1">
              RAW: {activePacket.ascii}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
