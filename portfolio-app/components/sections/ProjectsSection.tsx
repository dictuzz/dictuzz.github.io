'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';

/* ─── Case data (from real resume) ─────────────────────── */
const CASES = [
  {
    id: 'case-001',
    code: 'VOL. I — NO. 1',
    stamp: 'CLASSIFIED',
    title: 'THE AUTOMATION MANDATE.',
    img: '/portfolio/press-auto.png',
    org: 'Home Digital Indonesia',
    period: 'Jul 2024 – Sep 2025',
    role: 'M.T.',
    brief: 'Designed and deployed automated reporting pipelines that eliminated 12+ hours of manual weekly work across finance, sales, and operations.',
    findings: [
      'Built automated systems using advanced Excel, cutting manual workload by ~12 hrs/week.',
      'Standardized cross-functional SOPs across Finance, Sales, and Ops.',
    ],
    tags: ['Excel', 'SOP Design', 'Ops'],
    impact: '12+ hrs/week saved',
  },
  {
    id: 'case-002',
    code: 'VOL. I — NO. 2',
    stamp: 'DECLASSIFIED',
    title: 'KPI-BASED GOVERNANCE.',
    img: '/portfolio/press-gov.png',
    org: 'SMA Santa Maria 2',
    period: 'Nov 2021 – Nov 2022',
    role: 'Pres.',
    brief: 'Led a 34-member, 10-division council through structured KPI governance, institutional program design, and strategic outreach.',
    findings: [
      'Led 34 members using KPI-based governance and weekly rhythms.',
      'Designed long-term institutional programs adopted school-wide.',
      'Directed campaigns targeting 12 feeder schools.',
    ],
    tags: ['Leadership', 'KPI', 'Outreach'],
    impact: '34 members, 10 divs.',
  },
  {
    id: 'case-003',
    code: 'VOL. I — NO. 3',
    stamp: 'ACTIVE',
    title: 'LARGE-SCALE EVENT OPS.',
    img: '/portfolio/press-events.png',
    org: 'Ultimate Event Organizer',
    period: '2022 – 2025',
    role: 'Stage & MC',
    brief: 'Coordinated backstage execution for 1,000+ attendee events, and MC-led Youth Mass 2025 for 500+ participants — ensuring zero downtime.',
    findings: [
      'Coordinated technical execution for events with 1,000+ attendees.',
      'Reduced transition downtime through structured stage workflows.',
    ],
    tags: ['Event Ops', 'MC', 'Stage'],
    impact: '1000+ audience scale',
  },
  {
    id: 'case-004',
    code: 'VOL. I — NO. 4',
    stamp: 'ONGOING',
    title: 'VERTICAL RESCUE OPS.',
    img: '/portfolio/press-rescue.png',
    org: 'Vertical Rescue Indonesia',
    period: 'Jan 2021 – Present',
    role: 'Asst. Inst.',
    brief: 'Maintaining operational readiness for high-altitude rescue equipment, leading technical climbing sessions, and training the next generation.',
    findings: [
      'Maintained equipment through structured inspection systems.',
      'Supported training sessions as lead climber and belayer.',
    ],
    tags: ['Safety', 'Training', 'Rescue'],
    impact: '4+ years active',
  },
];

type CaseType = typeof CASES[number];

/* ─── Layout on the Physical Board (3000x2000 Canvas) ──── */
// h is now an approximation used purely for the camera center calculation.
// The actual DOM element height is determined by its content (`height: auto`).
const POS = [
  { x: 300, y: 300, w: 460, h: 460 },    // Top Left
  { x: 1000, y: 900, w: 460, h: 460 },   // Bottom Middle
  { x: 1700, y: 200, w: 460, h: 460 },   // Top Right
  { x: 2300, y: 800, w: 460, h: 460 },   // Bottom Far Right
];

const CENTERS = POS.map(p => ({ x: p.x + p.w / 2, y: p.y + p.h / 2 }));

/* ─── Premium Physical Board UI ────────────────────────── */

function MetalPin() {
  return (
    <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 z-30 filter drop-shadow-[0_5px_4px_rgba(0,0,0,0.6)]">
      <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#f0f0f0] to-[#555] border border-[#333] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)]" />
      <div className="w-1.5 h-4 bg-gradient-to-r from-[#999] to-[#333] mx-auto -mt-[5px] rounded-b-sm shadow-inner" />
    </div>
  );
}

function TautStrings() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]" aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="string-shadow">
          <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#000" floodOpacity="0.85" />
        </filter>
      </defs>
      <line x1={CENTERS[0].x} y1={CENTERS[0].y} x2={CENTERS[1].x} y2={CENTERS[1].y} stroke="#a31919" strokeWidth="2.5" filter="url(#string-shadow)" />
      <line x1={CENTERS[1].x} y1={CENTERS[1].y} x2={CENTERS[2].x} y2={CENTERS[2].y} stroke="#a31919" strokeWidth="2.5" filter="url(#string-shadow)" />
      <line x1={CENTERS[2].x} y1={CENTERS[2].y} x2={CENTERS[3].x} y2={CENTERS[3].y} stroke="#a31919" strokeWidth="2.5" filter="url(#string-shadow)" />
    </svg>
  );
}

/* ─── Literal Dense Newspaper Clipping ─────────────────── */

function NewspaperClipping({ data, pos, onClick }: { data: CaseType; pos: typeof POS[0]; onClick: () => void }) {
  return (
    <div
      className="absolute cursor-pointer group"
      // Height is omitted here so the clipping dynamically wraps the text perfectly without any blank space bottom
      style={{ left: pos.x, top: pos.y, width: pos.w, zIndex: 10 }}
      onClick={onClick}
    >
      {/* Heavy drop shadow for realism */}
      <div className="absolute inset-0 bg-black/80 blur-[16px] translate-y-6 translate-x-3 -z-10 group-hover:translate-y-8 group-hover:blur-[24px] transition-all duration-500 rounded-sm" />
      
      <MetalPin />

      {/* The Newsprint */}
      <div 
        className="relative w-full bg-[#e8e4db] rounded-sm p-6 lg:p-8 overflow-hidden border-2 border-dashed border-black/10"
        style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.1)' }}
      >
        {/* Paper grain/noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.14] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

        {/* Vintage Header Rule */}
        <div className="border-t-[4px] border-b-[1px] border-[#111] pb-1 mb-4 relative z-10">
          <div className="flex justify-between items-center mt-1.5">
            <span className="font-sans font-[900] uppercase text-[9px] tracking-[0.2em] text-[#050505]">{data.code}</span>
            <span className="font-sans font-[900] uppercase text-[9px] tracking-[0.2em] text-[#a31919] border border-[#a31919] px-1.5 py-0.5 transform -rotate-2">
              {data.stamp}
            </span>
          </div>
        </div>

        {/* Massive Headline */}
        <h3 
          className="font-display text-5xl text-[#050505] leading-[0.85] tracking-tight mb-4 px-1 relative z-10" 
          style={{ wordSpacing: '-0.1em' }}
        >
          {data.title}
        </h3>
        
        {/* Dateline & Byline */}
        <div className="border-t border-b border-[#050505]/40 py-1.5 mb-5 flex justify-between items-center font-sans relative z-10">
          <p className="text-[9px] uppercase tracking-[0.1em] text-[#050505] font-[900]">
            BY <span className="italic font-serif tracking-normal text-[11px] font-normal">{data.org}</span>
          </p>
          <p className="text-[8px] uppercase tracking-[0.15em] text-[#333] font-[900]">
            {data.role} • {data.period}
          </p>
        </div>

        {/* Dense Two-Column Layout */}
        <div className="columns-2 gap-5 mb-5 border-b-2 border-dashed border-[#050505]/20 pb-5 relative z-10">
          
          {/* Halftone Press Photo */}
          <div className="relative mb-4 break-inside-avoid border-2 border-[#111] p-1 bg-white shadow-sm">
            <img 
              src={data.img} 
              alt={data.title}
              className="w-full grayscale contrast-[1.4] brightness-90 filter sepia-[0.3] object-cover aspect-square"
              draggable={false}
            />
            <p className="font-sans text-[7px] uppercase tracking-widest mt-1 text-right text-[#050505] font-black">
              FIG 1. ARCHIVE PHOTO
            </p>
          </div>
          
          {/* Dense Justified Body Text */}
          <p className="font-serif text-[12.5px] leading-[1.45] text-justify text-[#050505] first-letter:float-left first-letter:text-[3.8rem] first-letter:pr-2.5 first-letter:font-display first-letter:leading-[0.8] first-letter:text-[#050505] first-letter:mt-1 break-inside-avoid">
            {data.brief} It is imperative to note the subsequent findings resulting from this operational directive.
          </p>
          
          {/* Bullet points styled as dense editorial paragraphs */}
          <div className="mt-3 font-serif text-[11.5px] leading-[1.45] text-justify text-[#050505] break-inside-avoid">
            <span className="font-sans font-[900] text-[9.5px] uppercase tracking-widest block mb-1 border-b border-[#050505]/20 pb-0.5">Reported Findings:</span>
            {data.findings.map((f, i) => (
              <span key={i} className="block mb-2">
                <span className="font-[900] mr-1">[{i+1}]</span> {f}
              </span>
            ))}
          </div>

        </div>

        {/* Impact Bar at Bottom */}
        <div className="flex justify-between items-end relative z-10">
          <div className="font-sans">
            <span className="text-[8px] uppercase tracking-[0.2em] text-[#333] block mb-0.5 font-[900]">Impact Metric:</span>
            <span className="text-[12px] text-[#f40000] font-[900] tracking-tight italic bg-[#050505] px-1.5 py-0.5">{data.impact}</span>
          </div>
          
          <div className="font-sans text-[8px] text-[#050505] uppercase tracking-[0.2em] font-[900] group-hover:underline underline-offset-4 cursor-pointer">
            Read Page A4 ↘
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Massive Newspaper Broadsheet Modal ───────────────── */
function CaseModal({ caseData, onClose }: { caseData: CaseType; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-2 md:p-6 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Matte black backdrop */}
      <motion.div className="absolute inset-0 bg-[#000000]/95 backdrop-blur-sm" />

      <motion.div
        className="relative w-full max-w-6xl max-h-[96vh] min-h-[85vh] overflow-y-auto overflow-x-hidden bg-[#e8e4db] shadow-[0_40px_100px_rgba(0,0,0,1)] cursor-auto"
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 opacity-[0.14] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

        {/* The Broad-sheet Layout Container */}
        <div className="p-4 md:p-8 relative border-[16px] border-[#e8e4db] outline outline-1 outline-black/30 m-1 md:m-2">
          
          <button onClick={onClose} className="absolute -top-10 right-0 md:-right-8 font-sans text-[10px] uppercase font-black text-white/50 hover:text-white tracking-[0.2em] transition-colors">
            X CLOSE ARCHIVE
          </button>

          {/* Massive Broadsheet Masthead */}
          <div className="text-center border-b-[8px] border-double border-[#050505] pb-6 mb-8 mt-2 relative z-10">
            <h1 className="font-display text-5xl md:text-[5.5rem] tracking-tighter uppercase text-[#050505] mb-4 scale-y-[1.1]" style={{ wordSpacing: '-0.1em' }}>
              The Operational Record.
            </h1>
            <div className="flex flex-wrap justify-between items-center border-y-2 border-[#050505] font-sans text-[10px] md:text-sm uppercase tracking-[0.2em] py-2.5 font-[900] text-[#050505]">
              <span>Edition: {caseData.code}</span>
              <span>Published: {caseData.period}</span>
              <span className="text-[#e22222] bg-[#050505] px-2.5 py-1">{caseData.stamp}</span>
            </div>
          </div>
          
          {/* Main Headline */}
          <h2 className="font-display text-5xl md:text-[5.5rem] text-center text-[#050505] leading-[0.85] tracking-tighter mb-10 max-w-5xl mx-auto uppercase relative z-10" style={{ wordSpacing: '-0.05em' }}>
            {caseData.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 border-t-2 border-[#050505] pt-8 relative z-10">
            
            {/* Left Rail: Bylines & Metadata & Pull Quote */}
            <div className="md:col-span-3 border-b-2 md:border-b-0 md:border-r-2 border-[#050505] pb-8 md:pb-0 md:pr-8">
              <p className="font-sans uppercase text-[11px] font-black tracking-widest text-[#050505] mb-6">
                <span className="text-[#a31919]">Reporting By:</span><br/>
                <span className="font-serif italic capitalize text-xl tracking-normal font-normal block mt-2">{caseData.org}</span>
              </p>
              
              <div className="border-t border-b border-[#050505]/30 py-4 mb-8">
                 <p className="font-sans uppercase text-[10px] tracking-widest text-[#444] font-[900] mb-1.5">Designation</p>
                 <p className="font-serif text-[15px] font-[900] text-[#050505]">{caseData.role}</p>
                 
                 <p className="font-sans uppercase text-[10px] tracking-widest text-[#444] font-[900] mt-5 mb-1.5">Measured Output</p>
                 <p className="font-serif text-2xl font-black text-[#a31919] italic leading-none">{caseData.impact}</p>
              </div>

              {/* Bold Pull Quote Box */}
              <div className="bg-[#050505] text-[#e8e4db] p-8 text-center shadow-lg transform -rotate-1 relative">
                <span className="absolute -top-4 left-4 font-display text-7xl text-[#555]">“</span>
                <p className="font-display text-3xl leading-none uppercase relative z-10 pt-4">
                  "Systematic optimization yielding unprecedented {" "}
                  <span className="text-[#a31919] italic">{caseData.impact}</span>."
                </p>
              </div>
            </div>

            {/* Middle: Main Article Body */}
            <div className="md:col-span-5 font-serif text-[16px] leading-[1.65] text-justify text-[#050505]">
              
              <p className="first-letter:float-left first-letter:text-[5.5rem] first-letter:pr-3 first-letter:font-display first-letter:leading-[0.8] first-letter:text-[#050505] first-letter:mt-1.5 mb-6">
                {caseData.brief} The execution of this directive demanded rigorous operational discipline and the implementation of uncompromising protocols. An investigation into the methodology reveals a highly structured approach to managing complexity.
              </p>
              
              <div className="border-t-[3px] border-double border-[#050505] pt-6 mt-8">
                <h4 className="font-sans font-black text-[12px] uppercase tracking-widest mb-4">Official Log of Findings:</h4>
                <ul className="space-y-4">
                  {caseData.findings.map((finding, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-display text-2xl leading-none text-[#a31919] font-bold">{i+1}.</span>
                      <span className="leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-[#050505]/30 pt-4 flex flex-wrap items-center gap-2">
                <span className="font-sans font-[900] text-[10px] uppercase tracking-widest mr-2 py-1">Indexed Tags:</span>
                {caseData.tags.map(tag => (
                  <span key={tag} className="font-sans text-[9px] font-[900] uppercase tracking-[0.1em] text-[#050505] border border-[#050505]/30 px-2.5 py-1 rounded-sm bg-[#050505]/5">
                    {tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Right: Featured Halftone Press Photo */}
            <div className="md:col-span-4 pl-0 md:pl-6">
              <div className="border-[3px] border-[#050505] p-2 bg-white shadow-md transform rotate-1 mb-6">
                <img 
                  src={caseData.img} 
                  alt={caseData.title}
                  className="w-full h-auto grayscale contrast-[1.5] brightness-90 filter sepia-[0.35]"
                  draggable={false}
                />
              </div>
              <p className="font-sans text-[11px] leading-relaxed text-[#333] text-justify border-b border-[#050505]/30 pb-5">
                <span className="font-[900] text-[#050505] uppercase tracking-widest">Fig 1. Archival Evidence. </span> 
                Visual documentation acquired during the active period of {caseData.period}. The scene corroborates the intense operational tempo required to achieve {caseData.impact}.
              </p>
              
              {/* Dummy Advertisement / Classifieds filler to make it look like a newspaper */}
              <div className="mt-8 border-4 border-[#050505] p-5 text-center bg-[#050505]/5 relative">
                <div className="absolute top-0 left-0 w-2 h-2 border-r border-b border-[#050505]" />
                <div className="absolute top-0 right-0 w-2 h-2 border-l border-b border-[#050505]" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-r border-t border-[#050505]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-l border-t border-[#050505]" />
                <p className="font-display text-4xl uppercase tracking-tighter mb-2 text-[#050505]">Attention!</p>
                <p className="font-serif text-sm italic mb-5 text-[#222]">Seeking highly optimized systems and strategic leadership?</p>
                <p className="font-sans font-black text-[11px] uppercase tracking-widest bg-[#050505] text-[#e8e4db] py-1.5 border border-[#050505]">Contact Immediately</p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Scroll-Driven Board Camera ───────────────────────── */
export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const times = [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1];

  const baseScale = mounted && isMobile ? 0.8 : 1.25;
  const zoomOutScale = mounted && isMobile ? 0.35 : 0.6;
  const scales = [baseScale, zoomOutScale, baseScale, zoomOutScale, baseScale, zoomOutScale, baseScale];
  
  const boardScale = useTransform(scrollYProgress, times, scales);

  const M01 = { x: (CENTERS[0].x + CENTERS[1].x)/2, y: (CENTERS[0].y + CENTERS[1].y)/2 };
  const M12 = { x: (CENTERS[1].x + CENTERS[2].x)/2, y: (CENTERS[1].y + CENTERS[2].y)/2 };
  const M23 = { x: (CENTERS[2].x + CENTERS[3].x)/2, y: (CENTERS[2].y + CENTERS[3].y)/2 };

  const xs = [
    `calc(50vw - ${CENTERS[0].x * scales[0]}px)`,
    `calc(50vw - ${M01.x * scales[1]}px)`,
    `calc(50vw - ${CENTERS[1].x * scales[2]}px)`,
    `calc(50vw - ${M12.x * scales[3]}px)`,
    `calc(50vw - ${CENTERS[2].x * scales[4]}px)`,
    `calc(50vw - ${M23.x * scales[5]}px)`,
    `calc(50vw - ${CENTERS[3].x * scales[6]}px)`,
  ];

  const ys = [
    `calc(50vh - ${CENTERS[0].y * scales[0]}px)`,
    `calc(50vh - ${M01.y * scales[1]}px)`,
    `calc(50vh - ${CENTERS[1].y * scales[2]}px)`,
    `calc(50vh - ${M12.y * scales[3]}px)`,
    `calc(50vh - ${CENTERS[2].y * scales[4]}px)`,
    `calc(50vh - ${M23.y * scales[5]}px)`,
    `calc(50vh - ${CENTERS[3].y * scales[6]}px)`,
  ];

  const boardX = useTransform(scrollYProgress, times, xs);
  const boardY = useTransform(scrollYProgress, times, ys);

  return (
    <>
      <section ref={containerRef} id="projects" className="relative h-[400vh] bg-[#0c0d0c]">
        
        <div className="sticky top-0 w-full h-screen overflow-hidden">

          <motion.div
            className="absolute top-0 left-0 w-[3000px] h-[3000px]"
            style={{
              x: boardX,
              y: boardY,
              scale: boardScale,
              transformOrigin: '0 0',
            }}
          >
            {/* Realistic dark chalkboard background */}
            <div 
              className="absolute inset-0 bg-[#0a0c0a]"
              style={{
                backgroundImage: `url("/portfolio/chalkboard.png")`,
                backgroundSize: '1200px 1200px',
                backgroundPosition: 'center',
                opacity: 0.85
              }}
            />
            {/* Subtle radial spotlighting underneath the grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1700px_1000px,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none mix-blend-overlay" />
            
            <TautStrings />

            {/* Render dossiers */}
            {!mounted ? null : CASES.map((c, i) => (
              <NewspaperClipping key={c.id} data={c} pos={POS[i]} onClick={() => setActiveCase(c)} />
            ))}
          </motion.div>

          {/* Cinematic Vignette edge shadows */}
          <div className="absolute inset-0 z-30 pointer-events-none shadow-[inset_0_0_200px_80px_rgba(4,5,4,0.95)]"  />
          
          <div className="absolute top-8 left-8 md:top-12 md:left-12 z-40 pointer-events-none drop-shadow-lg">
            <span className="font-sans text-[9px] text-white/40 tracking-[0.3em] font-[900] uppercase block mb-1">
              / 03 — The Editorial Archive
            </span>
            <h2 className="font-display italic text-[#e8e4db] text-4xl mt-2 tracking-tight drop-shadow-md">
              Published Records.
            </h2>
            <p className="font-sans font-[900] text-[9px] text-[#f2ede4] uppercase tracking-[0.2em] mt-3 bg-[#050505]/70 backdrop-blur-md px-3 py-1.5 inline-block border border-white/10 shadow-lg">
              [ Scroll to Pan ] • [ Click for Archive ]
            </p>
          </div>
          
        </div>
      </section>

      <AnimatePresence>
        {activeCase && <CaseModal caseData={activeCase} onClose={() => setActiveCase(null)} />}
      </AnimatePresence>
    </>
  );
}
