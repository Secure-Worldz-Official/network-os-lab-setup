import { useParams, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, Calculator, SquareCode, Network, Globe2 } from 'lucide-react';
import { roadmap } from '@/data/roadmap';
import { SubnetCalculatorLab } from '@/pages/labs/SubnetLab';
import { HttpTesterLab } from '@/pages/labs/HttpTesterLab';
import { NetworkInspectorLab } from '@/pages/labs/NetworkInspectorLab';
import { DnsResolverLab } from '@/pages/labs/DnsResolverLab';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const toolIcons: Record<string, typeof Calculator> = {
  Calculator,
  SquareCode,
  Network,
  Globe2,
};

export function ExperimentToolPage() {
  const { moduleId, toolId } = useParams<{ moduleId: string; toolId: string }>();
  const module = roadmap.find((m) => m.id === moduleId);

  if (!module || module.comingSoon || !toolId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-zinc-400 text-sm">Tool not found or module is not yet available.</p>
        <Link to="/labs" className="text-xs text-zinc-500 hover:text-white mt-2 inline-block">
          ← Back to Experiment Lab hub
        </Link>
      </div>
    );
  }

  const tool = module.tools?.find((t) => t.id === toolId);
  const ToolIcon = tool ? toolIcons[tool.icon] || Calculator : Calculator;

  const renderLab = () => {
    switch (toolId) {
      case 'subnet':
        return <SubnetCalculatorLab />;
      case 'http':
        return <HttpTesterLab />;
      case 'network':
        return <NetworkInspectorLab />;
      case 'dns':
        return <DnsResolverLab />;
      default:
        return (
          <div className="text-sm text-zinc-400">
            Tool "{toolId}" is not implemented yet.
          </div>
        );
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div variants={fadeUp}>
        <Link
          to={`/labs/${moduleId}`}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back to {module.title} Labs
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <ToolIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{tool?.name || toolId}</h1>
            <p className="text-sm text-zinc-400 mt-0.5">{tool?.description || 'Interactive tool'}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {renderLab()}
      </motion.div>
    </motion.div>
  );
}
