import { useParams, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, Calculator, SquareCode, Network, Globe2, Bug, Shield, AlertCircle, Code2, Database, Globe } from 'lucide-react';
import { roadmap } from '@/data/roadmap';
import { SubnetCalculatorLab } from '@/pages/labs/SubnetLab';
import { HttpTesterLab } from '@/pages/labs/HttpTesterLab';
import { NetworkInspectorLab } from '@/pages/labs/NetworkInspectorLab';
import { DnsResolverLab } from '@/pages/labs/DnsResolverLab';
import { MalwareClassifierLab } from '@/pages/labs/MalwareClassifierLab';
import { AttackVectorLab } from '@/pages/labs/AttackVectorLab';
import { SocialEngineeringLab } from '@/pages/labs/SocialEngineeringLab';
import { XssPlaygroundLab } from '@/pages/labs/XssPlaygroundLab';
import { SqliTesterLab } from '@/pages/labs/SqliTesterLab';
import { HeaderAnalyzerLab } from '@/pages/labs/HeaderAnalyzerLab';

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
  Bug,
  Shield,
  AlertCircle,
  Code2,
  Database,
  Globe,
};

export function ExperimentToolPage() {
  const { moduleId, toolId } = useParams<{ moduleId: string; toolId: string }>();
  const module = roadmap.find((m) => m.id === moduleId);

  if (!module || module.comingSoon || !toolId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center select-none font-mono">
        <p className="text-[#555555] dark:text-[#B5B5B5] text-sm">Tool not found or module is not yet available.</p>
        <Link to="/labs" className="text-xs text-[#888888] dark:text-[#777777] hover:underline mt-2 inline-block">
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
      case 'malware':
        return <MalwareClassifierLab />;
      case 'attack-vector':
        return <AttackVectorLab />;
      case 'social-eng':
        return <SocialEngineeringLab />;
      case 'xss':
        return <XssPlaygroundLab />;
      case 'sqli':
        return <SqliTesterLab />;
      case 'headers':
        return <HeaderAnalyzerLab />;
      default:
        return (
          <div className="text-sm text-[#555555] dark:text-[#B5B5B5] font-mono">
            Tool "{toolId}" is not implemented yet.
          </div>
        );
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none font-mono">
      <motion.div variants={fadeUp}>
        <Link
          to={`/labs/${moduleId}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white transition-colors mb-4 font-bold"
        >
          <ArrowLeft size={14} /> Back to {module.title} Labs
        </Link>
        <div className="flex items-center gap-3 mb-6 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808]">
            <ToolIcon size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight uppercase font-heading">{tool?.name || toolId}</h1>
            <p className="text-sm text-[#555555] dark:text-[#B5B5B5] mt-0.5 font-sans">{tool?.description || 'Interactive tool'}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {renderLab()}
      </motion.div>
    </motion.div>
  );
}
