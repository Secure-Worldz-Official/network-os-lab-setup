import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Terminal, Globe, Award, Activity, Cpu } from 'lucide-react';

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
    for (let i = 0; i < 40; i++) {
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
    <div className="relative min-h-screen bg-white dark:bg-[#080808] text-[#111111] dark:text-white flex flex-col justify-between overflow-hidden pb-12 font-mono transition-colors duration-250">
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-30" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white/80 dark:bg-[#080808]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808] font-bold">
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-sm tracking-widest text-[#111111] dark:text-white">
              CYBERPATH
            </span>
            <span className="text-[9px] text-[#888888] dark:text-[#777777] tracking-widest uppercase">SECURITY TRAINING PLATFORM</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-xs font-bold text-[#111111] dark:text-white hover:underline">
            LOG IN
          </Link>
          <Link to="/dashboard" className="btn-cyber-primary text-xs py-2 px-4">
            <span>ENTER PLATFORM →</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-12 flex-1 flex flex-col items-center justify-center text-center space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#141414] text-[10px] uppercase tracking-widest text-[#111111] dark:text-white font-bold">
            <Cpu size={12} className="text-[#111111] dark:text-white" />
            <span>INTERACTIVE CYBER LAB PLATFORM // V2.4</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-7xl font-extrabold font-heading tracking-tight text-[#111111] dark:text-white leading-none uppercase">
              MASTER CYBERSECURITY.
            </h1>
            <h1 className="text-4xl sm:text-7xl font-extrabold font-heading tracking-tight text-[#666666] dark:text-[#777777] leading-none uppercase">
              THROUGH REAL LABS.
            </h1>
          </div>

          <div className="text-sm font-bold tracking-widest text-[#111111] dark:text-white uppercase">
            LEARN. PRACTICE. SOLVE. SECURE.
          </div>

          <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] max-w-2xl mx-auto leading-relaxed font-sans">
            A professional hands-on cybersecurity training platform. Connect to isolated lab networks, analyze network traffic, execute terminal commands, and capture CTF flags inside interactive rooms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto btn-cyber-primary py-3.5 px-8 text-xs tracking-wider uppercase font-bold">
                START LEARNING NOW →
              </button>
            </Link>
            <Link to="/rooms" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto btn-cyber-secondary py-3.5 px-8 text-xs tracking-wider uppercase font-bold">
                EXPLORE ROOMS & LABS ↗
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-8 text-left"
        >
          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808]">
              <Terminal size={18} />
            </div>
            <div className="text-[10px] text-[#888888] dark:text-[#777777] font-bold uppercase">MODULE 01</div>
            <h3 className="font-heading font-extrabold text-base text-[#111111] dark:text-white uppercase">BROWSER TERMINAL</h3>
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">
              Safely execute commands like nmap, curl, cat, and ip addr inside an interactive Linux terminal container.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808]">
              <Globe size={18} />
            </div>
            <div className="text-[10px] text-[#888888] dark:text-[#777777] font-bold uppercase">MODULE 02</div>
            <h3 className="font-heading font-extrabold text-base text-[#111111] dark:text-white uppercase">PRACTICAL ROOMS</h3>
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">
              Structured hands-on rooms covering Recon, Linux, Web Vulnerabilities, SQL Injection, and Forensics.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-[#080808]">
              <Award size={18} />
            </div>
            <div className="text-[10px] text-[#888888] dark:text-[#777777] font-bold uppercase">MODULE 03</div>
            <h3 className="font-heading font-extrabold text-base text-[#111111] dark:text-white uppercase">LAB CONNECTIVITY</h3>
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] leading-relaxed font-sans">
              Simulated VPN connection panel and target machine controls with real validation feedback.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-6 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888888] dark:text-[#777777]">
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-[#111111] dark:text-white" />
          <span className="uppercase font-bold">CYBERPATH // LEARN. PRACTICE. SOLVE. SECURE.</span>
        </div>
        <span>© 2026 CYBERPATH PLATFORM. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
}
