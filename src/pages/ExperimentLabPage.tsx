import { useParams, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  FlaskConical,
  ArrowLeft,
  Lock,
  Shield,
  Bug,
  Globe,
  Calculator,
  SquareCode,
  Network,
  Globe2,
} from 'lucide-react';
import { roadmap } from '@/data/roadmap';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const moduleIcons: Record<string, typeof Shield> = {
  'module-1': Shield,
  'module-2': Bug,
  'module-3': Globe,
};

const toolIcons: Record<string, typeof Calculator> = {
  Calculator,
  SquareCode,
  Network,
  Globe2,
};

export function ExperimentLabPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const module = roadmap.find((m) => m.id === moduleId);

  if (!module) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center select-none font-mono">
        <p className="text-[#555555] dark:text-[#B5B5B5] text-sm">Module not found.</p>
        <Link to="/labs" className="text-xs text-[#888888] dark:text-[#777777] hover:underline mt-2 inline-block">
          ← Back to Experiment Lab hub
        </Link>
      </div>
    );
  }

  if (module.comingSoon) {
    return <ComingSoonLab module={module} />;
  }

  const tools = module.tools || [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none font-mono">
      <motion.div variants={fadeUp}>
        <Link to="/labs" className="inline-flex items-center gap-1.5 text-xs text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white transition-colors mb-4 font-bold">
          <ArrowLeft size={14} /> BACK TO HUB
        </Link>
        <div className="flex items-center gap-3 mb-6 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808]">
            <FlaskConical size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight uppercase font-heading">{module.title} Labs</h1>
            <p className="text-sm text-[#555555] dark:text-[#B5B5B5] mt-0.5 font-sans">Select a tool to launch its interactive playground</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => {
          const Icon = toolIcons[tool.icon] || Calculator;
          return (
            <Link
              key={tool.id}
              to={`/labs/${module.id}/${tool.id}`}
              className="group flex flex-col p-5 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] hover:border-[#111111] dark:hover:border-white shadow-xs transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F7F7F7] dark:bg-[#181818] text-[#111111] dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111] dark:text-white">{tool.name}</p>
                    <p className="text-[10px] font-mono text-[#888888] dark:text-[#777777] uppercase tracking-wider mt-0.5">
                      Interactive Tool
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] mt-3 leading-relaxed font-sans">{tool.description}</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[10px] font-mono text-[#888888] dark:text-[#777777]">Live Execution</span>
                <span className="text-xs text-[#111111] dark:text-white group-hover:underline transition-colors flex items-center gap-1">
                  Launch <ArrowLeft size={13} className="rotate-180" />
                </span>
              </div>
            </Link>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function ComingSoonLab({ module }: { module: typeof roadmap[0] }) {
  const Icon = moduleIcons[module.id] || Shield;
  const plans: Record<string, { title: string; desc: string }[]> = {
    'module-2': [
      { title: 'Malware Analysis Sandbox', desc: 'Upload sample hashes, inspect static properties, and compare against known threat signatures using real VT-style metadata.' },
      { title: 'ATT&CK Matrix Explorer', desc: 'Browse MITRE ATT&CK tactics and techniques with real API data. Filter by platform, search by name, and map techniques to your environment.' },
      { title: 'Phishing URL Inspector', desc: 'Paste a URL and run real heuristic checks: domain age lookup, punycode detection, redirect tracing, and similarity scoring against known brands.' },
    ],
    'module-3': [
      { title: 'XSS Playground', desc: 'Type payloads into a sandboxed iframe and see real execution results. Reflects, stores, and DOM-based contexts with sanitizer bypass demos.' },
      { title: 'SQLi Tester', desc: 'Construct real UNION, error-based, and blind injection queries against a local simulated database engine with real query parsing and error feedback.' },
      { title: 'HTTP Header Analyzer', desc: 'Point at any URL, fetch real headers, and audit for missing security headers: CSP, HSTS, X-Frame-Options, and more.' },
    ],
  };

  const items = plans[module.id] || [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 select-none font-mono">
      <motion.div variants={fadeUp}>
        <Link to="/labs" className="inline-flex items-center gap-1.5 text-xs text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white transition-colors mb-4 font-bold">
          <ArrowLeft size={14} /> BACK TO HUB
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0F0F0] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-center">
            <Icon size={20} className="text-[#888888] dark:text-[#777777]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight uppercase font-heading">{module.title}</h1>
            <p className="text-sm text-[#555555] dark:text-[#B5B5B5] mt-0.5 font-sans">{module.subtitle}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-[#111111] dark:text-white font-bold">
          <Lock size={16} />
          <span className="text-sm font-medium">Coming Soon</span>
        </div>
        <p className="text-sm text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">
          This module is under active development. The labs below are planned and will be
          implemented with the same real-execution standards as Module 1.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#101010] p-4 space-y-2">
              <p className="text-sm font-medium text-[#111111] dark:text-white">{item.title}</p>
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
