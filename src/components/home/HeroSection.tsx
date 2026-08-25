import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Shield, Terminal, BookOpen, Layers, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const pills = [
  { icon: Shield, label: 'CIA TRIAD' },
  { icon: Layers, label: 'OSI 7-LAYER MODEL' },
  { icon: Terminal, label: 'SUBNETTING & CIDR' },
  { icon: BookOpen, label: 'WIRESHARK RECON' },
];

export function HeroSection() {
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

    const particles: { x: number; y: number; opacity: number; speed: number; radius: number }[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: Math.random() * 0.3 + 0.05,
        speed: Math.random() * 0.2 + 0.05,
        radius: Math.random() * 1.2 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-zinc-800 bg-black font-mono">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        aria-hidden="true"
      />

      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 radial-glow-top pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="w-full flex flex-col items-center space-y-6">
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-heading uppercase text-center max-w-3xl"
          >
            CYBERSECURITY FOUNDATIONS <br />
            <span className="text-zinc-400 font-normal">FROM THEORY TO VIRTUAL LABS</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl text-center leading-relaxed font-sans"
          >
            Structured cybersecurity curriculum covering networking principles, TCP/IP, subnetting math,
            packet analysis with Wireshark, and simulated virtual lab environments.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto pt-2"
          >
            {pills.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300"
              >
                <Icon size={12} className="text-white" />
                {label}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 w-full sm:w-auto"
          >
            <Link to="/roadmap" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[170px] uppercase">
                <span>[ START CURRICULUM ]</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
            <Link to="/labs" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[170px] uppercase">
                <span>[ EXPERIMENT LAB ↗ ]</span>
                <FlaskConical size={14} />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
