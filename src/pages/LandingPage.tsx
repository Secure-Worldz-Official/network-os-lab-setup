import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Compass, Terminal, Cpu, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 45; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;

      for (let i = 0; i < dots.length; i++) {
        const d1 = dots[i];
        d1.x += d1.vx;
        d1.y += d1.vy;

        if (d1.x < 0 || d1.x > canvas.width) d1.vx *= -1;
        if (d1.y < 0 || d1.y > canvas.height) d1.vy *= -1;

        ctx.beginPath();
        ctx.arc(d1.x, d1.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dist = Math.hypot(d1.x - d2.x, d1.y - d2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(d1.x, d1.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#080808] text-[#111111] dark:text-white flex flex-col justify-between overflow-x-hidden font-mono transition-colors duration-250">
      {/* Background canvas grid animation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-30" />

      {/* ─── 1. TOP HEADER ─── */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white/80 dark:bg-[#080808]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] font-bold shadow-sm">
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base tracking-widest text-[#111111] dark:text-white uppercase">
              NETWORKING OS LAB
            </span>
            <span className="text-[9px] text-[#888888] dark:text-[#777777] tracking-widest uppercase font-mono">
              SECURITY PLATFORM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <Link to="/dashboard" className="btn-cyber-primary text-xs py-2.5 px-5 uppercase font-bold tracking-wider">
            <span>ENTER PLATFORM →</span>
          </Link> */}
        </div>
      </header>

      {/* ─── 2. HERO SECTION ─── */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20 space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#141414] text-[10px] uppercase tracking-widest text-[#111111] dark:text-white font-bold">
            <Cpu size={12} className="text-[#111111] dark:text-white" />
            <span>STATE-OF-THE-ART CYBERSECURITY LEARNING ENVIRONMENT</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-7xl font-extrabold font-heading tracking-tight text-[#111111] dark:text-white leading-none uppercase">
              MASTER CYBERSECURITY.
            </h1>
            <h1 className="text-4xl sm:text-7xl font-extrabold font-heading tracking-tight text-[#666666] dark:text-[#777777] leading-none uppercase">
              THROUGH INTERACTIVE LABS.
            </h1>
          </div>

          <p className="text-xs sm:text-base text-[#555555] dark:text-[#B5B5B5] max-w-2xl mx-auto leading-relaxed font-sans">
            CyberPath bridges the gap between theoretical knowledge and practical execution. Experience guided visual concept walkthroughs and input-driven sandbox labs built for real cybersecurity professionals.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/learn" className="w-full sm:w-auto" id="landing-hero-enter-learning-lab">
              <button className="w-full sm:w-auto btn-cyber-primary py-4 px-8 text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 shadow-md">
                <Compass size={16} />
                <span>ENTER LEARNING LAB →</span>
              </button>
            </Link>
            <Link to="/labs" className="w-full sm:w-auto" id="landing-hero-explore-experiments">
              <button className="w-full sm:w-auto btn-cyber-secondary py-4 px-8 text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2">
                <Terminal size={16} />
                <span>EXPLORE EXPERIMENT LAB ↗</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* ─── 3. LEARNING LAB vs EXPERIMENT LAB COMPARISON SECTION ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest">
              DUAL-PILLAR LEARNING ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
              LEARNING LAB VS EXPERIMENT LAB
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-xl mx-auto">
              Our curriculum combines structured sequential progression with open, practical sandbox experimentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Learning Lab Pillar Card */}
            <div className="p-8 rounded-2xl border border-[#111111] dark:border-white bg-white dark:bg-[#141414] space-y-6 shadow-xs card-lift">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
                    <Compass size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#888888] dark:text-[#777777]">PILLAR 01</span>
                    <h3 className="text-xl font-extrabold text-[#111111] dark:text-white font-heading uppercase">LEARNING LAB</h3>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#F0F0F0] dark:bg-[#1E1E1E] text-[#111111] dark:text-white uppercase font-mono">
                  GUIDED PATH
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                A single continuous, winding level path of connected nodes. Each node delivers concise theory paired with a custom, user-triggered animated visual explainer.
              </p>

              <ul className="space-y-2.5 text-xs text-[#111111] dark:text-white font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Sequential unlocks: Level N unlocks upon completing Level N-1</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>User-triggered SVG animations (TCP handshake, packet flow)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Condensed theory blocks with clear step-by-step tasks</span>
                </li>
              </ul>

              <Link to="/learn" className="block pt-2">
                <button className="w-full btn-cyber-primary py-3 text-xs uppercase font-bold tracking-wider">
                  ENTER LEARNING LAB →
                </button>
              </Link>
            </div>

            {/* Experiment Lab Pillar Card */}
            <div className="p-8 rounded-2xl border border-[#111111] dark:border-white bg-white dark:bg-[#141414] space-y-6 shadow-xs card-lift">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#888888] dark:text-[#777777]">PILLAR 02</span>
                    <h3 className="text-xl font-extrabold text-[#111111] dark:text-white font-heading uppercase">EXPERIMENT LAB</h3>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                  HANDS-ON SANDBOX
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                Open, input-driven sandbox environments where students type custom parameters, trigger live technical operations, and observe genuine computed results.
              </p>

              <ul className="space-y-2.5 text-xs text-[#111111] dark:text-white font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Real interactive calculators, query engines & hash tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Live cause-and-effect computed technical output</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Target machine instances & terminal CLI commands</span>
                </li>
              </ul>

              <Link to="/labs" className="block pt-2">
                <button className="w-full btn-cyber-secondary py-3 text-xs uppercase font-bold tracking-wider">
                  EXPLORE EXPERIMENTS ↗
                </button>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ─── 4. FEATURE HIGHLIGHTS GRID ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4 text-center">
            <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest">
              ENGINEERED FOR REAL SKILL ACQUISITION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight mt-1">
              KEY PLATFORM FEATURES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 card-lift">
              <div className="w-10 h-10 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
                <Sparkles size={18} />
              </div>
              <h3 className="font-heading font-extrabold text-sm text-[#111111] dark:text-white uppercase">
                WINDING LEVEL PATH
              </h3>
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">
                Snaking node path with strict state-driven unlocking. Clear visual indication of completed, current, and locked levels.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 card-lift">
              <div className="w-10 h-10 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
                <Cpu size={18} />
              </div>
              <h3 className="font-heading font-extrabold text-sm text-[#111111] dark:text-white uppercase">
                INTERACTIVE VISUALIZERS
              </h3>
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">
                Custom animated packet flows, payload injection displays, and handshake step-throughs triggered directly by user clicks.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 card-lift">
              <div className="w-10 h-10 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
                <Terminal size={18} />
              </div>
              <h3 className="font-heading font-extrabold text-sm text-[#111111] dark:text-white uppercase">
                REAL SANDBOX TOOLS
              </h3>
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">
                Dynamic input subnet calculators, query builders, hash crack timers, and live HTTP header auditors.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 card-lift">
              <div className="w-10 h-10 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
              <h3 className="font-heading font-extrabold text-sm text-[#111111] dark:text-white uppercase">
                SPECIALIZED TRACKS
              </h3>
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">
                Tailored pathways for SOC Analysts, Penetration Testers, AppSec Engineers, and Governance Analysts.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ─── 5. FOOTER ─── */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888888] dark:text-[#777777]">
        <div className="flex items-center gap-2 font-mono">
          <Shield size={14} className="text-[#111111] dark:text-white" />
          <span>NETWORKING OS LAB © 2026. ALL RIGHTS RESERVED.</span>
        </div>
        {/* <div className="flex items-center gap-6 font-mono text-[11px]">
          <Link to="/learn" className="hover:text-[#111111] dark:hover:text-white transition-colors">LEARNING LAB</Link>
          <Link to="/labs" className="hover:text-[#111111] dark:hover:text-white transition-colors">EXPERIMENT LAB</Link>
          <Link to="/dashboard" className="hover:text-[#111111] dark:hover:text-white transition-colors">DASHBOARD</Link>
        </div> */}
      </footer>
    </div>
  );
}
