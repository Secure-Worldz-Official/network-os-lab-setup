import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { InteractiveTerminal } from '@/components/terminal/InteractiveTerminal';
import { foundationLabs } from '@/data/foundationLabs';

export function FoundationLabPage() {
  const { labId } = useParams<{ labId: string }>();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const currentLab = useMemo(() => foundationLabs.find((lab) => lab.id === labId) || foundationLabs[0], [labId]);
  const completedCount = currentLab.steps.filter((step) => completedSteps.has(`${currentLab.id}:${step.id}`)).length;

  const handleCommandRun = (command: string, output: string) => {
    const next = new Set(completedSteps);
    const normalized = command.toLowerCase();
    currentLab.steps.forEach((step) => {
      const key = `${currentLab.id}:${step.id}`;
      if (!next.has(key) && step.match.some((match) => normalized.includes(match.toLowerCase()) || output.toLowerCase().includes(match.toLowerCase()))) next.add(key);
    });
    setCompletedSteps(next);
  };

  return <main className="min-h-full w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] font-mono overflow-visible">
    <section className="grid grid-cols-1 text-[#111111] dark:text-white">
      <div className="min-w-0 flex flex-col border-r border-[#E5E5E5] dark:border-[#2A2A2A]">
        <header className="px-6 py-5 bg-white dark:bg-[#141414] border-b border-[#E5E5E5] dark:border-[#2A2A2A] flex items-start justify-between gap-6">
          <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#888888] dark:text-[#777777]">{currentLab.topic} · terminal workspace</p><h1 className="mt-1 text-xl font-extrabold uppercase tracking-tight font-heading truncate">{currentLab.title}</h1><p className="mt-1 text-[11px] text-[#666666] dark:text-[#999999]">{completedCount} of {currentLab.steps.length} verification steps complete</p></div>
          {/* <Link to="/labs" className="shrink-0 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#666666] dark:text-[#B5B5B5] hover:text-[#111111] dark:hover:text-white"><ChevronLeft size={14} /> Experiments</Link> */}
        </header>
        <div className="overflow-x-auto bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          <div className="grid min-h-[620px] min-w-[880px] grid-cols-[340px_minmax(540px,1fr)]">
            <section className="max-h-[620px] overflow-y-auto lab-scroll-region border-r border-[#E5E5E5] dark:border-[#2A2A2A] p-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#888888] dark:text-[#777777] mb-4">Execution steps</h2>
              <div className="space-y-3">{currentLab.steps.map((step, index) => { const done = completedSteps.has(`${currentLab.id}:${step.id}`); return <div key={step.id} className={`flex items-start gap-3 p-3 border rounded-md ${done ? 'bg-[#F7F7F7] dark:bg-[#181818] border-[#111111] dark:border-white' : 'bg-white dark:bg-[#141414] border-[#E5E5E5] dark:border-[#2A2A2A]'}`}><span className="shrink-0 mt-0.5">{done ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-[#888888] dark:text-[#777777]" />}</span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] dark:text-[#777777]">Step {index + 1}</p><p className="mt-1 text-xs leading-relaxed">{step.objective}</p><code className="block mt-2 text-[11px] text-[#666666] dark:text-[#B5B5B5] overflow-x-auto">$ {step.command}</code></div></div>; })}</div>
            </section>
            <section className="h-[620px] p-5 bg-[#050505]"><InteractiveTerminal targetIp="10.10.20.15" roomId={currentLab.id} roomTitle={currentLab.title} initialMessage={`Connected to isolated ${currentLab.title} environment. Execute the listed commands to complete each verification step.`} onCommandRun={handleCommandRun} className="h-full" /></section>
          </div>
        </div>
      </div>
    </section>
  </main>;
}
