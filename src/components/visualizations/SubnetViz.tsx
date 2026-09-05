import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

type CidrPrefix = 24 | 25 | 26 | 27 | 28;

interface SubnetInfo {
  prefix: CidrPrefix;
  mask: string;
  subnetsCount: number;
  blockSize: number;
  usableHosts: number;
  blocks: { id: number; network: string; range: string; broadcast: string }[];
}

const CIDR_DATA: Record<CidrPrefix, SubnetInfo> = {
  24: {
    prefix: 24, mask: '255.255.255.0', subnetsCount: 1, blockSize: 256, usableHosts: 254,
    blocks: [{ id: 1, network: '192.168.1.0', range: '.1 – .254', broadcast: '192.168.1.255' }]
  },
  25: {
    prefix: 25, mask: '255.255.255.128', subnetsCount: 2, blockSize: 128, usableHosts: 126,
    blocks: [
      { id: 1, network: '192.168.1.0', range: '.1 – .126', broadcast: '192.168.1.127' },
      { id: 2, network: '192.168.1.128', range: '.129 – .254', broadcast: '192.168.1.255' }
    ]
  },
  26: {
    prefix: 26, mask: '255.255.255.192', subnetsCount: 4, blockSize: 64, usableHosts: 62,
    blocks: [
      { id: 1, network: '192.168.1.0', range: '.1 – .62', broadcast: '192.168.1.63' },
      { id: 2, network: '192.168.1.64', range: '.65 – .126', broadcast: '192.168.1.127' },
      { id: 3, network: '192.168.1.128', range: '.129 – .190', broadcast: '192.168.1.191' },
      { id: 4, network: '192.168.1.192', range: '.193 – .254', broadcast: '192.168.1.255' }
    ]
  },
  27: {
    prefix: 27, mask: '255.255.255.224', subnetsCount: 8, blockSize: 32, usableHosts: 30,
    blocks: [
      { id: 1, network: '192.168.1.0', range: '.1 – .30', broadcast: '192.168.1.31' },
      { id: 2, network: '192.168.1.32', range: '.33 – .62', broadcast: '192.168.1.63' },
      { id: 3, network: '192.168.1.64', range: '.65 – .94', broadcast: '192.168.1.95' },
      { id: 4, network: '192.168.1.96', range: '.97 – .126', broadcast: '192.168.1.127' },
      { id: 5, network: '192.168.1.128', range: '.129 – .158', broadcast: '192.168.1.159' },
      { id: 6, network: '192.168.1.160', range: '.161 – .190', broadcast: '192.168.1.191' },
      { id: 7, network: '192.168.1.192', range: '.193 – .222', broadcast: '192.168.1.223' },
      { id: 8, network: '192.168.1.224', range: '.225 – .254', broadcast: '192.168.1.255' }
    ]
  },
  28: {
    prefix: 28, mask: '255.255.255.240', subnetsCount: 16, blockSize: 16, usableHosts: 14,
    blocks: [
      { id: 1, network: '192.168.1.0', range: '.1 – .14', broadcast: '192.168.1.15' },
      { id: 2, network: '192.168.1.16', range: '.17 – .30', broadcast: '192.168.1.31' },
      { id: 3, network: '192.168.1.32', range: '.33 – .46', broadcast: '192.168.1.47' },
      { id: 4, network: '192.168.1.48', range: '.49 – .62', broadcast: '192.168.1.63' }
    ]
  }
};

const easeOut: [number, number, number, number] = [0.4, 0, 0.2, 1];
const trans = { duration: 0.4, ease: easeOut };

export function SubnetViz() {
  const [selectedPrefix, setSelectedPrefix] = useState<CidrPrefix>(26);
  const [activeBlockId, setActiveBlockId] = useState<number>(1);
  const [_showSplit, setShowSplit] = useState(false);
  const [splitProgress, setSplitProgress] = useState(0);

  const info = CIDR_DATA[selectedPrefix];
  const activeBlock = info.blocks.find((b) => b.id === activeBlockId) || info.blocks[0];

  const handlePrefixChange = (prefix: CidrPrefix) => {
    setSelectedPrefix(prefix);
    setActiveBlockId(1);
    setShowSplit(true);
    setSplitProgress(0);

    const startTime = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      setSplitProgress(t);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className="space-y-5 font-mono select-none w-full">
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#F7F7F7] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] uppercase shrink-0">
            CIDR MASK:
          </span>
          {([24, 25, 26, 27, 28] as CidrPrefix[]).map((prefix) => {
            const isActive = selectedPrefix === prefix;
            return (
              <button
                key={prefix}
                id={`subnet-cidr-${prefix}`}
                type="button"
                onClick={() => handlePrefixChange(prefix)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white shadow-sm'
                    : 'bg-white dark:bg-[#1C1C1C] text-[#666666] dark:text-[#999999] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                /{prefix}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-[#888888] dark:text-[#777777] hidden sm:inline font-bold">
          {info.subnetsCount} Subnet{info.subnetsCount > 1 ? 's' : ''} ({info.usableHosts} hosts/net)
        </span>
      </div>

      <div className="relative rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-6 space-y-5 shadow-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={trans}
          className="p-4 rounded-xl border border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#181818] flex items-center justify-between text-xs"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777]">PARENT NETWORK BLOCK</span>
            <p className="text-base font-extrabold text-[#111111] dark:text-white font-mono">192.168.1.0 / 24</p>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777]">SUBNET MASK</span>
            <p className="text-base font-extrabold text-[#111111] dark:text-white font-mono">{info.mask}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {info.blocks.map((block, idx) => {
            const isSelected = block.id === activeBlock.id;
            const isVisible = idx < info.blocks.length * splitProgress;
            return (
              <motion.button
                key={block.id}
                id={`subnet-block-${block.id}`}
                type="button"
                onClick={() => setActiveBlockId(block.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 10,
                  scale: isSelected ? 1.02 : 1
                }}
                transition={{ ...trans, delay: idx * 0.1 }}
                className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer font-mono ${
                  isSelected
                    ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white shadow-md'
                    : 'bg-[#FAFAFA] dark:bg-[#141414] text-[#111111] dark:text-white border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                }`}
              >
                <div className="flex justify-between items-center text-xs opacity-80 mb-1.5">
                  <span className="font-bold uppercase">SUBNET 0{block.id}</span>
                  <span className="font-extrabold">/{selectedPrefix}</span>
                </div>
                <p className="text-sm font-extrabold truncate">192.168.1{block.range}</p>
                <span className="text-[10px] opacity-75 mt-1.5 block font-sans">
                  {info.usableHosts} Usable Hosts
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={`${selectedPrefix}-${activeBlockId}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={trans}
        className="p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Calculator size={16} />
            <span className="text-sm font-extrabold uppercase tracking-wide text-[#111111] dark:text-white font-heading">
              SUBNET MATH INSPECTOR — 192.168.1.0/{selectedPrefix}
            </span>
          </div>
          <span className="text-xs font-bold text-[#888888] dark:text-[#777777] font-mono">
            BLOCK SIZE: {info.blockSize}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] block font-bold">NETWORK ADDRESS</span>
            <span className="font-extrabold text-sm text-[#111111] dark:text-white font-mono">{activeBlock.network}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] block font-bold">USABLE IP RANGE</span>
            <span className="font-extrabold text-sm text-[#111111] dark:text-white font-mono">192.168.1{activeBlock.range}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] block font-bold">BROADCAST ADDRESS</span>
            <span className="font-extrabold text-sm text-[#111111] dark:text-white font-mono">{activeBlock.broadcast}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
            <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] block font-bold">HOST FORMULA</span>
            <span className="font-bold text-xs text-[#111111] dark:text-white font-mono">
              2^({32 - selectedPrefix}) - 2 = {info.usableHosts}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
