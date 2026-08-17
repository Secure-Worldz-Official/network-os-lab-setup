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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-zinc-400 text-sm">Module not found.</p>
        <Link to="/labs" className="text-xs text-zinc-500 hover:text-white mt-2 inline-block">
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
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div variants={fadeUp}>
        <Link to="/labs" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-4">
          <ArrowLeft size={14} /> Back to hub
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <FlaskConical size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{module.title} Labs</h1>
            <p className="text-sm text-zinc-400 mt-0.5">Select a tool to launch its interactive playground</p>
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
              className="group flex flex-col p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)] transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200">{tool.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">
                      Interactive Tool
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{tool.description}</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/70">
                <span className="text-[10px] font-mono text-zinc-500">Live Execution</span>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
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
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <motion.div variants={fadeUp}>
        <Link to="/labs" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-4">
          <ArrowLeft size={14} /> Back to hub
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <Icon size={20} className="text-zinc-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{module.title}</h1>
            <p className="text-sm text-zinc-400 mt-0.5">{module.subtitle}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-zinc-300">
          <Lock size={16} />
          <span className="text-sm font-medium">Coming Soon</span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          This module is under active development. The labs below are planned and will be
          implemented with the same real-execution standards as Module 1.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 space-y-2">
              <p className="text-sm font-medium text-zinc-200">{item.title}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
