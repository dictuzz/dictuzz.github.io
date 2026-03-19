'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const PARAGRAPHS = [
  {
    text: 'It started with a broken spreadsheet and a room full of people doing things the hard way. I was a management trainee at a digital company, watching teams burn twelve hours a week on reports that could be automated in minutes. So I built the system that did it.',
  },
  {
    text: 'That pattern kept repeating: find the friction, map the process, design the fix. Whether it was standardizing SOPs across finance, sales, and operations — or leading a 34-member student council through KPI-based governance — the work was always about making chaos legible.',
  },
  {
    text: "Now I'm studying Data Science at Universitas Terbuka while continuing to build operational systems that actually work. I believe the best systems aren't the most complex — they're the ones that make the next step obvious for everyone in the room.",
  },
];

const HISTORY = [
  { year: '2021', label: 'Started vertical rescue training', desc: 'Technical rope access & crisis response' },
  { year: '2022', label: 'Led student council', desc: 'Implemented KPI-governance for 34 members' },
  { year: '2023', label: 'Media Recognition', desc: 'Awarded by Goethe-Institut' },
  { year: '2024', label: 'Home Digital Indonesia', desc: 'Management Trainee in operational reporting' },
  { year: '2025', label: 'Data Science', desc: 'Academic pursuit in systems analysis' },
];

const STATS = [
  { value: '12+', text: 'Hours Saved Weekly', sub: 'Through advanced pipeline automation' },
  { value: '34', text: 'Personnel Managed', sub: 'Across 10 cross-functional divisions' },
  { value: '1K+', text: 'Audience Handled', sub: 'In live-event technical execution' },
];

function FadeText({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  return (
    <motion.p 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-xl md:text-2xl text-[#e8e4db]/80 font-serif leading-[1.7] max-w-3xl mb-12"
    >
      {children}
    </motion.p>
  );
}

function TimelineItem({ item, i }: { item: typeof HISTORY[0], i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div 
      ref={ref}
      className="relative pl-10 md:pl-20 py-8 group"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.8, delay: i * 0.15 }}
    >
      {/* The physical dot on the timeline */}
      <div className="absolute left-[-5px] top-11 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-[#e8e4db] group-hover:bg-[#e8e4db] transition-colors duration-500 shadow-[0_0_10px_rgba(232,228,219,0)] group-hover:shadow-[0_0_15px_rgba(232,228,219,0.5)] z-10" />

      {/* Horizontal connector line (optional, but looks elegant) */}
      <div className="absolute left-[5px] top-[48px] w-4 md:w-10 h-px bg-[#e8e4db]/20 group-hover:bg-[#e8e4db]/60 transition-colors duration-500" />

      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
        <span className="font-mono text-sm uppercase tracking-widest text-[#e8e4db]/60 group-hover:text-[#e8e4db] transition-colors w-20 shrink-0">
          {item.year}
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-display italic text-2xl md:text-3xl text-[#e8e4db] font-normal tracking-tight">
            {item.label}
          </span>
          <span className="font-sans text-base text-[#e8e4db]/60 font-light">
            {item.desc}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const yImage = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={sectionRef} id="about" className="relative py-40 min-h-screen bg-[#050505] overflow-hidden selection:bg-[#e8e4db] selection:text-black">
      
      <div className="absolute top-0 right-0 w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] bg-white opacity-[0.015] blur-[200px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-8 mb-32 border-b border-[#e8e4db]/10 pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[#e8e4db]/50 font-semibold">
            Section 02
          </span>
          <span className="font-sans text-xs uppercase tracking-[0.4em] text-[#e8e4db]">
            The Origin
          </span>
          <div className="flex-1" />
        </div>

        {/* Narrative Block */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-24 items-start mb-48">
          
          <div className="xl:col-span-5 relative">
            <motion.div 
              style={{ y: yImage }}
              className="relative w-full aspect-[3/4] overflow-hidden rounded-sm"
            >
              <img
                src="/portfolio/avatar.png"
                alt="Benedictus Richard Ricardo"
                className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-[3s] hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#050505]/20 mix-blend-overlay" />
            </motion.div>
            
            <div className="mt-8 flex justify-between items-center border-t border-[#e8e4db]/10 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#e8e4db]/50">ID: B. R. Ricardo</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#e8e4db]/50">Jakarta, ID</p>
            </div>
          </div>

          <div className="xl:col-span-7 pt-0 xl:pt-16">
            <motion.h2 
              className="font-display italic text-5xl md:text-7xl lg:text-8xl text-[#e8e4db] mb-24 leading-[0.9] tracking-tighter"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              Architecting order<br className="hidden md:block" /> from chaos.
            </motion.h2>

            <div className="flex flex-col">
              {PARAGRAPHS.map((p, i) => (
                <FadeText key={i} delay={i * 0.1}>{p.text}</FadeText>
              ))}
            </div>
          </div>
        </div>

        {/* Freestanding elegant typography stats */}
        <div className="mb-48 border-t border-b border-[#e8e4db]/10">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e8e4db]/10">
            {STATS.map((stat, i) => (
              <div key={i} className="py-16 md:py-24 px-8 flex flex-col items-center md:items-start text-center md:text-left group cursor-crosshair">
                <p className="font-display italic text-8xl lg:text-[9rem] text-[#e8e4db] leading-none tracking-tighter mb-8 group-hover:scale-[1.02] transition-transform duration-700 origin-left">
                  {stat.value}
                </p>
                <div className="h-px w-12 bg-[#e8e4db]/20 mb-6 group-hover:w-full transition-all duration-700 ease-[0.16,1,0.3,1]" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#e8e4db]/90 font-bold mb-2">
                  {stat.text}
                </p>
                <p className="font-serif italic text-base text-[#e8e4db]/50 font-light max-w-xs">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The physical vertical timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-8 mb-16 pb-6">
            <h3 className="font-display italic text-4xl md:text-5xl text-[#e8e4db] tracking-tight">Timeline & Milestones</h3>
            <div className="flex-1 h-px bg-[#e8e4db]/10" />
          </div>
          
          <div className="relative border-l border-[#e8e4db]/20 ml-2 md:ml-4 pb-12">
            {HISTORY.map((item, i) => (
              <TimelineItem key={i} item={item} i={i} />
            ))}
            
            {/* Soft fade-out at the bottom of the timeline line */}
            <div className="absolute bottom-0 left-[-1px] w-[3px] h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
          </div>
        </div>

      </div>
    </section>
  );
}
