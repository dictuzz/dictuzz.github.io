'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Massive Expanded Skill Data
const CLUSTERS = [
  {
    id: 'ux',
    name: 'Product & UX Design',
    color: '#00f0ff',
    nodes: [
      { id: 'ux1', label: 'User Interface Design', size: 12 },
      { id: 'ux2', label: 'Wireframing', size: 8 },
      { id: 'ux3', label: 'Interactive Prototyping', size: 10 },
      { id: 'ux4', label: 'Figma Auto-Layout', size: 9 },
      { id: 'ux5', label: 'User Research', size: 7 },
      { id: 'ux6', label: 'Usability Testing', size: 8 },
      { id: 'ux7', label: 'Design Systems', size: 11 },
      { id: 'ux8', label: 'Information Architecture', size: 9 },
    ],
  },
  {
    id: 'auto',
    name: 'Workflow & Automation',
    color: '#ff0055',
    nodes: [
      { id: 'a1', label: 'Process Automation', size: 14 },
      { id: 'a2', label: 'Advanced Excel', size: 12 },
      { id: 'a3', label: 'Data Pipelines', size: 10 },
      { id: 'a4', label: 'SOP Standardization', size: 11 },
      { id: 'a5', label: 'API Integrations', size: 8 },
      { id: 'a6', label: 'Zapier / Make.com', size: 9 },
      { id: 'a7', label: 'Custom Scripting', size: 7 },
    ],
  },
  {
    id: 'sys',
    name: 'Systems Architecture',
    color: '#ffffff',
    nodes: [
      { id: 's1', label: 'Performance Tracking', size: 11 },
      { id: 's2', label: 'Scalability Planning', size: 9 },
      { id: 's3', label: 'Database Architecture', size: 8 },
      { id: 's4', label: 'Workflow Optimization', size: 13 },
      { id: 's5', label: 'Technical Auditing', size: 10 },
      { id: 's6', label: 'Cloud Infrastructure', size: 7 },
    ],
  },
  {
    id: 'res',
    name: 'Vertical Rescue & Safety',
    color: '#00ff66',
    nodes: [
      { id: 'r1', label: 'Vertical Rescue', size: 13 },
      { id: 'r2', label: 'Crisis Management', size: 15 },
      { id: 'r3', label: 'Safety Protocols', size: 11 },
      { id: 'r4', label: 'Rope Access Systems', size: 10 },
      { id: 'r5', label: 'Risk Assessment', size: 9 },
      { id: 'r6', label: 'Equipment Inspection', size: 8 },
      { id: 'r7', label: 'Adaptability', size: 12 },
      { id: 'r8', label: 'Lead Climbing', size: 10 },
    ],
  },
  {
    id: 'ld',
    name: 'Leadership & Strategy',
    color: '#cbawff',
    nodes: [
      { id: 'l1', label: 'Team Management', size: 14 },
      { id: 'l2', label: 'KPI Frameworks', size: 12 },
      { id: 'l3', label: 'Strategic Outreach', size: 10 },
      { id: 'l4', label: 'Program Design', size: 11 },
      { id: 'l5', label: 'Executive Reporting', size: 9 },
      { id: 'l6', label: 'Mentorship', size: 8 },
      { id: 'l7', label: 'Public Speaking', size: 12 },
      { id: 'l8', label: 'Master of Ceremonies (MC)', size: 9 },
    ],
  },
  {
    id: 'ops',
    name: 'Operations & Logistics',
    color: '#ffaa00',
    nodes: [
      { id: 'o1', label: 'Event Logistics', size: 13 },
      { id: 'o2', label: 'Resource Allocation', size: 10 },
      { id: 'o3', label: 'Stage Management', size: 9 },
      { id: 'o4', label: 'Vendor Management', size: 8 },
      { id: 'o5', label: 'Scheduling Rhythms', size: 7 },
      { id: 'o6', label: 'Downtime Reduction', size: 11 },
      { id: 'o7', label: 'Cross-functional Ops', size: 12 },
    ],
  }
];

// Cluster centers in the 4000x4000 space (ordered sequentially for the scroll path)
const CENTERS = [
  { id: 'ux', x: 800, y: 1200 },    // [0]
  { id: 'auto', x: 1800, y: 800 },  // [1]
  { id: 'sys', x: 2800, y: 1500 },  // [2]
  { id: 'res', x: 3200, y: 2500 },  // [3]
  { id: 'ld', x: 2200, y: 3200 },   // [4]
  { id: 'ops', x: 1200, y: 2800 }   // [5]
];

function generateCosmos() {
  const points: any[] = [];
  const edges: any[] = [];
  const CANVAS_SIZE = 4000;

  CLUSTERS.forEach((cluster) => {
    const center = CENTERS.find(c => c.id === cluster.id)!;
    
    const clusterPoints = cluster.nodes.map((node, i) => {
      // Scatter nodes organically 
      const angle = (i / cluster.nodes.length) * Math.PI * 2 + (Math.random() * 0.5);
      const radius = 100 + Math.random() * 350; 
      
      const px = center.x + Math.cos(angle) * radius;
      const py = center.y + Math.sin(angle) * radius;

      return {
        ...node,
        clusterId: cluster.id,
        clusterName: cluster.name,
        color: cluster.color,
        x: px,
        y: py,
      };
    });

    points.push(...clusterPoints);

    // Intra-cluster edges
    for (let i = 0; i < clusterPoints.length; i++) {
        const nextIdx = (i + 1) % clusterPoints.length;
        edges.push({ source: clusterPoints[i].id, target: clusterPoints[nextIdx].id, type: 'intra', color: 'rgba(255,255,255,0.3)' });
        
        if (Math.random() > 0.5) {
          const randIdx = Math.floor(Math.random() * clusterPoints.length);
          if (randIdx !== i) {
            edges.push({ source: clusterPoints[i].id, target: clusterPoints[randIdx].id, type: 'intra', color: 'rgba(255,255,255,0.15)' });
          }
        }
    }
  });

  // Inter-cluster connections (Hyperspace routes)
  edges.push({ source: 'ux4', target: 's4', type: 'inter' }); // Figma Auto -> Workflow Opt
  edges.push({ source: 'ux7', target: 's1', type: 'inter' }); // Design Sys -> Perf Tracking
  edges.push({ source: 'a1', target: 'o7', type: 'inter' }); // Process Auto -> Cross-functional Ops
  edges.push({ source: 'o1', target: 'l1', type: 'inter' }); // Event Logistics -> Team Mgmt
  edges.push({ source: 'r2', target: 'l1', type: 'inter' }); // Crisis Mgmt -> Team Mgmt
  edges.push({ source: 'a4', target: 'ux8', type: 'inter' }); // SOP Standards -> Info Arch
  edges.push({ source: 's3', target: 'a3', type: 'inter' }); // DB Arch -> Data Pipelines
  edges.push({ source: 'l2', target: 's1', type: 'inter' }); // KPI -> Perf Tracking

  return { points, edges, size: CANVAS_SIZE };
}


function DeepSpaceBackground() {
  const [stars, setStars] = useState<{id: number, x: number, y: number, s: number, o: number, d: number}[]>([]);
  
  useEffect(() => {
    const arr = Array.from({ length: 600 }).map((_, i) => ({
      id: i,
      x: Math.random() * 4000,
      y: Math.random() * 4000,
      s: Math.random() * 2.5 + 0.5,
      o: Math.random() * 0.5 + 0.1,
      d: Math.random() * 10 + 5 
    }));
    setStars(arr);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(10,30,60,0.6)_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(40,10,30,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_60%_20%,rgba(10,50,40,0.3)_0%,transparent_60%)] mix-blend-screen" />
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full mix-blend-screen"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.s}px`,
            height: `${star.s}px`,
            opacity: star.o
          }}
          animate={{ opacity: [star.o, star.o * 3, star.o] }}
          transition={{ duration: star.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { points, edges, size: CANVAS_SIZE } = useMemo(() => generateCosmos(), []);

  /* ─── Scroll-Driven Camera ─── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const times = [0, 0.2, 0.4, 0.6, 0.8, 1];
  
  // Parallax / pulsing scale effect while flying through space
  const baseScale = mounted && isMobile ? 0.6 : 0.9;
  const zoomScale = mounted && isMobile ? 0.4 : 0.65;
  const scales = [baseScale, zoomScale, baseScale, zoomScale, baseScale, zoomScale];

  const skyScale = useTransform(scrollYProgress, times, scales);

  // Map route sequentially by cluster
  const xs = CENTERS.map((p, i) => `calc(50vw - ${p.x * scales[i]}px)`);
  const ys = CENTERS.map((p, i) => `calc(50vh - ${p.y * scales[i]}px)`);

  const skyX = useTransform(scrollYProgress, times, xs);
  const skyY = useTransform(scrollYProgress, times, ys);

  // Progress text indicator
  const sysLabel = useTransform(scrollYProgress, times, [
    'SECTOR: UX DESIGN',
    'SECTOR: AUTOMATION',
    'SECTOR: SYSTEMS ARCH',
    'SECTOR: VERTICAL RESCUE',
    'SECTOR: LEADERSHIP',
    'SECTOR: OPERATIONS'
  ]);

  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="relative h-[600vh] bg-[#010203]" // Epic massive scroll height
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* HUD Fixed Overlay */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 z-[100] pointer-events-none drop-shadow-xl">
          <span className="font-mono text-[10px] text-white/50 tracking-[0.3em] uppercase block mb-3">
            / 04 — The Arsenal
          </span>
          <h2 className="font-display italic text-white/95 text-5xl md:text-6xl drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            The Infinite Cosmos.
          </h2>
          <div className="flex items-center gap-3 mt-4 bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 w-max rounded-full shadow-lg">
            <span className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_10px_#00f0ff]" />
            <motion.p className="text-white font-mono text-[10px] uppercase tracking-widest">
              {sysLabel}
            </motion.p>
          </div>
        </div>

        {/* Scroll hint corner */}
        <div className="absolute bottom-8 right-8 z-[100] text-right pointer-events-none">
          <p className="font-sans font-[900] text-[9px] text-white uppercase tracking-[0.2em] bg-black/60 backdrop-blur-sm px-3 py-1.5 inline-block border border-white/10 shadow-lg">
            [ Scroll to Traverse ] • [ Hover to Inspect ]
          </p>
        </div>

        {/* The Cinematic Scroll-Driven Canvas */}
        <motion.div
          className="absolute w-[4000px] h-[4000px] transform-gpu"
          style={{ 
            x: skyX, 
            y: skyY,
            scale: skyScale,
            transformOrigin: '0 0'
          }}
        >
          <DeepSpaceBackground />

          {/* Edges layer */}
          <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none">
            <defs>
              <filter id="hyper-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {!mounted ? null : edges.map((edge, i) => {
              const source = points.find(p => p.id === edge.source);
              const target = points.find(p => p.id === edge.target);
              if (!source || !target) return null;

              const isHovered = hoveredNode === source.id || hoveredNode === target.id;
              const isClusterHovered = hoveredCluster === source.clusterId && hoveredCluster === target.clusterId;
              const isActive = isHovered || isClusterHovered;
              const isDimmed = !!hoveredNode && !isActive;

              let baseStroke = edge.type === 'intra' ? edge.color : 'rgba(255,255,255,0.08)';
              if (isActive) baseStroke = 'rgba(255,255,255,1)';

              return (
                <motion.line
                  key={`edge-${i}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={baseStroke}
                  strokeWidth={isActive ? 2 : (edge.type === 'inter' ? 1 : 1.5)}
                  strokeDasharray={edge.type === 'inter' ? '5 15' : 'none'}
                  initial={{ opacity: 0, pathLength: 0 }}
                  whileInView={{ opacity: isDimmed ? 0.02 : 1, pathLength: 1 }}
                  viewport={{ once: true, margin: "2000px" }} // Render offscreen to prevent popping
                  transition={{ duration: 2, delay: i * 0.01 }}
                  filter={isActive ? 'url(#hyper-glow)' : 'none'}
                />
              );
            })}
          </svg>

          {/* Nodes Layer */}
          {!mounted ? null : points.map((node, i) => {
            const isHovered = hoveredNode === node.id;
            const isClusterHovered = hoveredCluster === node.clusterId;
            const isActive = isHovered || isClusterHovered;
            const isDimmed = !!hoveredNode && !isHovered;

            return (
              <motion.div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-crosshair group z-50 transform-gpu"
                style={{ left: node.x, top: node.y }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: isDimmed ? 0.15 : 1 }}
                viewport={{ once: true, margin: "2000px" }}
                transition={{ duration: 1, delay: i * 0.02, type: 'spring' }}
                onMouseEnter={() => { setHoveredNode(node.id); setHoveredCluster(node.clusterId); }}
                onMouseLeave={() => { setHoveredNode(null); setHoveredCluster(null); }}
              >
                {/* Star Corona */}
                <div 
                  className="absolute rounded-full pointer-events-none mix-blend-screen transition-all duration-500"
                  style={{ 
                    backgroundColor: node.color, 
                    width: node.size * (isActive ? 6 : 4), 
                    height: node.size * (isActive ? 6 : 4),
                    opacity: isActive ? 0.8 : 0.3,
                    filter: `blur(${node.size * 1.5}px)`
                  }}
                />

                {/* Physical Star Body */}
                <div 
                  className="rounded-full relative z-10 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,1)]"
                  style={{ 
                    width: isActive ? node.size * 1.5 : node.size, 
                    height: isActive ? node.size * 1.5 : node.size, 
                    backgroundColor: '#ffffff',
                    boxShadow: isActive ? `0 0 ${node.size * 3}px ${node.color}, inset 0 0 4px rgba(0,0,0,0.8)` : `0 0 8px ${node.color}`
                  }}
                />

                {/* Holographic Tooltip */}
                <div className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-500 ease-out z-[60] ${isActive ? 'top-10 opacity-100' : 'top-6 opacity-0'}`}>
                  <div className="bg-[#010203]/90 backdrop-blur-xl border border-white/20 px-5 py-3 flex flex-col items-center shadow-[0_0_40px_rgba(0,0,0,0.9)] rounded-lg">
                    <span className="font-mono text-[9px] uppercase tracking-[0.4em] mb-1.5" style={{ color: node.color }}>
                      {node.clusterName} sector
                    </span>
                    <span className="font-display italic text-2xl tracking-wide text-white drop-shadow-md">
                      {node.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

        </motion.div>
        
        {/* Deep cinematic vignette over everything */}
        <div className="absolute inset-0 z-[80] pointer-events-none shadow-[inset_0_0_200px_80px_rgba(1,2,3,0.95)]" />
      </div>
    </section>
  );
}
