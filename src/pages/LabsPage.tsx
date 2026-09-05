import { Link } from 'react-router-dom';
import { foundationLabs } from '@/data/foundationLabs';

const isNetwork = (topic: string) => ['Networking', 'Subnetting', 'Packet Analysis', 'Firewalls', 'NAT & Isolated Networks'].includes(topic);

function ExperimentSection({ title, labs }: { title: string; labs: typeof foundationLabs }) {
  return <section className="space-y-4"><div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3"><h2 className="text-lg font-extrabold text-[#111111] dark:text-white font-heading uppercase">{title}</h2><p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans mt-1">{labs.length} terminal-based operational exercises</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{labs.map((lab, index) => <article key={lab.id} className="min-h-[190px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] rounded-lg p-5 shadow-xs flex flex-col"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold tracking-[0.14em] text-[#888888] dark:text-[#777777] uppercase">Experiment {String(index + 1).padStart(2, '0')}</p><h3 className="text-base font-extrabold text-[#111111] dark:text-white font-heading uppercase leading-tight mt-2">{lab.title}</h3></div><span className="text-[10px] text-[#666666] dark:text-[#B5B5B5] whitespace-nowrap">{index < 4 ? 'Beginner' : index < 8 ? 'Intermediate' : 'Advanced'}</span></div><p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed mt-3">Execute a {lab.steps.length}-step terminal runbook and verify the final operational condition.</p><Link to={`/labs/foundation/${lab.id}`} className="btn-cyber-primary text-xs mt-auto self-start">Launch Experiment</Link></article>)}</div></section>;
}

export function LabsPage() {
  const network = foundationLabs.filter((lab) => isNetwork(lab.topic));
  const os = foundationLabs.filter((lab) => lab.topic === 'Operating Systems');
  return <main className="max-w-6xl mx-auto space-y-10 pb-12 font-mono select-none"><header className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#888888] dark:text-[#777777]">Practical environment</p><h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight mt-2">Experiment Lab</h1><p className="text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-2xl mt-2">Choose an independent experiment and execute its terminal runbook.</p></header><ExperimentSection title="Network Experiments" labs={network} /><ExperimentSection title="OS Experiments" labs={os} /></main>;
}
