'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TextScramble } from '@/components/animations/TextScramble';

const ROLE = 'Systems Architect & Workflow Automation Specialist';
const TAGLINE = 'Engineering operational clarity out of systemic chaos.';

/* ─── Telemetry HUD overlay ───────────────────────────── */
function TelemetryHUD() {
  const [time, setTime] = useState('');
  const [coords, setCoords] = useState('00.0000° N, 00.0000° W');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}:${d.getMilliseconds().toString().padStart(3,'0')}`);
    };
    const timer = setInterval(updateTime, 47);
    
    // Fake coordinate jitter
    const coordTimer = setInterval(() => {
      setCoords(`${(Math.random() * 90).toFixed(4)}° N, ${(Math.random() * 180).toFixed(4)}° W`);
    }, 2000);

    return () => { clearInterval(timer); clearInterval(coordTimer); };
  }, []);

  return (
    <div className="absolute inset-x-8 top-8 flex justify-between pointer-events-none z-50 font-mono text-[9px] uppercase tracking-widest text-white/40">
      <div className="flex flex-col gap-1">
        <span>[ SYS.STATUS: ONLINE ]</span>
        <span className="animate-pulse text-[#44ff44]">{time}</span>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <span>MEM: {Math.floor(Math.random() * 1024 + 4000)} MB</span>
        <span>POS: {coords}</span>
      </div>
    </div>
  );
}

/* ─── Cybernetic CTA Button ───────────────────────────── */
function CyberButton({ children, href, primary = false }: { children: React.ReactNode, href: string, primary?: boolean }) {
  return (
    <a href={href} className="group relative focus-visible:outline-none">
      <div className={`absolute inset-0 border transition-all duration-500 ease-out 
        ${primary ? 'border-[#e8e4db]/30 group-hover:bg-[#e8e4db] group-hover:border-[#e8e4db]' : 'border-white/10 group-hover:border-white/40'}`} 
      />
      {/* Target corners */}
      <div className={`absolute -top-1 -left-1 w-2 h-2 border-t border-l transition-colors duration-500 ${primary ? 'border-[#e8e4db] group-hover:border-black' : 'border-white/40 group-hover:border-white'}`} />
      <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b border-r transition-colors duration-500 ${primary ? 'border-[#e8e4db] group-hover:border-black' : 'border-white/40 group-hover:border-white'}`} />
      
      <div className={`px-8 py-4 relative font-mono text-xs uppercase tracking-[0.2em] font-bold transition-colors duration-500
        ${primary ? 'text-[#e8e4db] group-hover:text-black' : 'text-white/60 group-hover:text-white'}`}>
        {children}
      </div>
    </a>
  );
}

/* ─── Hero Section ────────────────────────────────────── */
export function HeroSection() {
  const [phase, setPhase] = useState<'booting' | 'revealing' | 'ready'>('booting');
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax physics tracking mouse perfectly
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  
  // Heavily damped spring for the massive eclipse shadow (lags behind mouse)
  const eclipseX = useSpring(mX, { stiffness: 20, damping: 40 });
  const eclipseY = useSpring(mY, { stiffness: 20, damping: 40 });

  // Tighter spring for typography parallax
  const textX = useSpring(mX, { stiffness: 80, damping: 30 });
  const textY = useSpring(mY, { stiffness: 80, damping: 30 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mX.set((e.clientX - cx) / cx); // range -1 to 1
      mY.set((e.clientY - cy) / cy);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mX, mY]);

  // Boot sequence timing
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('revealing'), 800);
    const t2 = setTimeout(() => setPhase('ready'), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[100dvh] bg-[#020202] text-white overflow-hidden flex flex-col justify-center select-none"
    >
      <TelemetryHUD />

      {/* ─── Cinematic Eclipse Background ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div 
          className="relative w-[80vw] h-[80vw] max-w-[800px] max-h-[800px]"
          style={{ x: useTransform(eclipseX, [-1, 1], [-100, 100]), y: useTransform(eclipseY, [-1, 1], [-100, 100]) }}
        >
          {/* Outer diffuse glow */}
          <div className="absolute inset-0 rounded-full bg-[#f4f1ea] opacity-[0.03] blur-[100px]" />
          {/* Inner sharp edge simulating backlighting */}
          <div className="absolute inset-10 rounded-full border border-white/5 shadow-[0_0_80px_rgba(255,255,255,0.08)]" />
          {/* The black hole core */}
          <div className="absolute inset-12 rounded-full bg-[#020202] shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />
        </motion.div>
      </div>

      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      {/* ─── Massive Interlocking Typography ─── */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center pointer-events-none w-full max-w-[1400px] mx-auto px-4"
        style={{ x: useTransform(textX, [-1, 1], [30, -30]), y: useTransform(textY, [-1, 1], [30, -30]) }}
      >
        <span className="font-mono text-[9px] text-[#e8e4db]/50 tracking-[0.4em] uppercase mb-12 self-start md:ml-[10%] drop-shadow-lg">
          / 01 — The Awakening
        </span>

        <h1 className="font-display italic leading-[0.8] tracking-tighter text-[#e8e4db] w-full text-center mix-blend-difference drop-shadow-2xl">
          {phase !== 'booting' && (
            <>
              <motion.span 
                className="block text-[15vw] md:text-[8.5rem] lg:text-[11rem] md:-ml-[10%] mb-2"
                initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <TextScramble text="BENEDICTUS" delay={0.2} cycleSpeed={30} stagger={50} />
              </motion.span>
              <motion.span 
                className="block text-[15vw] md:text-[8.5rem] lg:text-[11rem] md:ml-[15%] mb-2 text-[#a31919]"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(30px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <TextScramble text="RICHARD" delay={0.8} cycleSpeed={40} stagger={60} />
              </motion.span>
              <motion.span 
                className="block text-[15vw] md:text-[8.5rem] lg:text-[11rem] md:-ml-[5%]"
                initial={{ opacity: 0, y: -50, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <TextScramble text="RICARDO." delay={1.4} cycleSpeed={30} stagger={50} />
              </motion.span>
            </>
          )}
        </h1>
      </motion.div>

      {/* ─── Role & CTAs ─── */}
      <AnimatePresence>
        {phase === 'ready' && (
          <motion.div 
            className="absolute bottom-16 inset-x-0 z-30 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="max-w-xl text-center mb-10 pointer-events-none">
              <p className="font-mono text-[9px] md:text-[11px] text-[#e8e4db] tracking-[0.2em] uppercase mb-4 py-1.5 px-3 bg-white/5 border border-white/10 max-w-max mx-auto">
                {ROLE}
              </p>
              <p className="font-serif italic text-lg md:text-xl text-[#e8e4db]/70 leading-relaxed">
                {TAGLINE}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <CyberButton href="#projects" primary>Access Records (03)</CyberButton>
              <CyberButton href="#contact">Open Comm Link (05)</CyberButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boot sequence black overlay */}
      <AnimatePresence>
        {phase === 'booting' && (
          <motion.div 
            className="absolute inset-0 bg-black z-[100] flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="w-1/3 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 bottom-0 left-0 bg-white"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, ease: 'linear' }}
              />
            </div>
            <span className="absolute mt-12 font-mono text-[8px] uppercase tracking-widest text-white/40">Loading Core Matrices...</span>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
