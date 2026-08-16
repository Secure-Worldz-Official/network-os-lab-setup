import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Target, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const pills = [
  { icon: Shield, label: 'CIA Triad' },
  { icon: Layers, label: 'OSI / TCP/IP' },
  { icon: Target, label: 'Threat Modelling' },
];

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle grid background
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

    const dots: { x: number; y: number; opacity: number; speed: number }[] = [];
    for (let i = 0; i < 60; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: Math.random() * 0.4 + 0.05,
        speed: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.y -= d.speed;
        if (d.y < 0) { d.y = canvas.height; d.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${d.opacity})`;
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
    <section className="relative overflow-hidden px-6 sm:px-8 py-20 sm:py-28 min-h-[70vh] flex items-center">
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(220,38,38,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Eyebrow */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-6">
          <span className="section-label">Self-paced · Module 1 now live</span>
          <span className="chip chip-accent">Free</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="mb-6">
          <span className="gradient-text">From Zero to</span>
          <br />
          <span className="accent-gradient-text">Security-Ready</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed"
        >
          A structured, hands-on cybersecurity learning roadmap — starting with networking
          fundamentals and progressing to real attack and defence skills. No fluff, no paywalls.
        </motion.p>

        {/* Pills */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {pills.map(({ icon: Icon, label }) => (
            <span key={label} className="chip">
              <Icon size={11} />
              {label}
            </span>
          ))}
          <span className="chip">Wireshark</span>
          <span className="chip">Subnetting</span>
          <span className="chip">Lab Setup</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/roadmap">
            <Button variant="primary" size="lg" id="hero-start-learning-cta">
              Start Learning
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/roadmap/module-1/day-1">
            <Button variant="secondary" size="lg" id="hero-day-1-cta">
              Jump to Day 1
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
