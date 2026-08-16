import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Shield, Terminal, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const pills = [
  { icon: Shield, label: 'CIA Triad' },
  { icon: Layers, label: 'OSI 7-Layer Model' },
  { icon: Terminal, label: 'Subnetting & CIDR' },
  { icon: BookOpen, label: 'Wireshark Analysis' },
];

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle monochrome starfield / particles
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
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: Math.random() * 0.3 + 0.05,
        speed: Math.random() * 0.25 + 0.05,
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
    <section className="relative overflow-hidden border-b border-zinc-800 bg-[#09090b]">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        aria-hidden="true"
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" aria-hidden="true" />

      {/* Subtle radial lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.03) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          {/* Eyebrow badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
            <Badge variant="outline" size="md">
              Self-Paced Roadmap · v1.0 Live
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl mx-auto"
          >
            Cybersecurity Foundations <br />
            <span className="text-zinc-400 font-normal">From Theory to Virtual Labs</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            A high-craft curriculum covering networking principles, TCP/IP, subnetting math,
            packet analysis with Wireshark, and isolated virtual lab environments.
          </motion.p>

          {/* Topic Pills */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-2 pt-2"
          >
            {pills.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300"
              >
                <Icon size={13} className="text-zinc-400" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <Link to="/roadmap" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span>Start Learning</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/roadmap/module-1/day-1" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <span>Jump into Day 01</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
