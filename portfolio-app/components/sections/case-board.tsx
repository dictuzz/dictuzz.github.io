'use client';

import {
  motion,
  useInView,
  useReducedMotion
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getCases } from '@/data/cases';
import type { CaseStudy, PortfolioHomeData } from '@/content/types';
import { ChalkboardBackground } from '@/components/ui/chalkboard-bg';
import { type BoardNavigatorItem, CaseNavigator } from '@/components/ui/case-navigator';
import { type BoardAnchor, RedString } from '@/components/ui/red-string';
import { CaseCard } from '@/components/sections/case-card';

// New imports
import { IntroCard } from '@/components/ui/intro-card';
import { ContactCard } from '@/components/ui/contact-card';
import { useBoardCamera } from '@/hooks/use-board-camera';
import { BOARD_CONFIG, INTRO_NODE, CONTACT_NODE } from '@/config/board';

// Configs imported from '@/config/board'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type BoardNode =
  | (BoardAnchor &
      BoardNavigatorItem & {
        type: 'intro' | 'contact';
      })
  | (BoardAnchor &
      BoardNavigatorItem & {
        caseIndex: number;
        type: 'case';
      });

export function CaseBoardSection({
  home,
  caseStudies
}: {
  home: PortfolioHomeData;
  caseStudies: CaseStudy[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const prefersReducedMotion = useReducedMotion();
  const cases = useMemo(() => getCases(), []);
  const firstCardInView = useInView(firstCardRef, { once: true, margin: '-10% 0px -10% 0px' });

  useEffect(() => {
    const sync = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
      setHasMounted(true);
    };

    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const reducedMotion = hasMounted && prefersReducedMotion;

  const boardNodes = useMemo<BoardNode[]>(
    () => [
      { ...INTRO_NODE, type: 'intro' },
      ...cases.map((caseItem, caseIndex) => ({
        boardX: caseItem.boardX,
        boardY: caseItem.boardY,
        caseIndex,
        href: `/work/${caseItem.slug}/`,
        id: caseItem.id,
        title: caseItem.headline,
        type: 'case' as const
      })),
      { ...CONTACT_NODE, type: 'contact' }
    ],
    [cases]
  );

  const {
    backgroundX,
    backgroundY,
    springX,
    springY,
    activeIndex,
    setActiveIndex,
    progressValue,
    hasScrolled,
    jumpToNode
  } = useBoardCamera({
    nodes: boardNodes,
    sectionRef,
    isMobile,
    reducedMotion: reducedMotion || false,
    viewportWidth,
    viewportHeight
  });

  if (isMobile || reducedMotion) {
    return (
      <section className="page-wrapper relative min-h-screen pb-16 pt-6 md:pt-8" id="case-board" ref={sectionRef}>
        <div className="case-board-shell relative min-h-screen">
          <ChalkboardBackground />

          <div className="board-container relative z-20 mx-auto max-w-6xl">
            <div className="relative">
              <RedString
                activeIndex={activeIndex}
                canvasHeight={Math.max(boardNodes.length * 640 + 280, 1800)}
                canvasWidth={viewportWidth}
                nodes={boardNodes}
                orientation="vertical"
              />

              <div className="relative z-20 space-y-12 pb-8">
                <div onMouseEnter={() => setActiveIndex(0)}>
                  <IntroCard home={home} />
                </div>

                {cases.map((caseItem, index) => (
                  <div
                    key={caseItem.id}
                    onMouseEnter={() => setActiveIndex(index + 1)}
                    ref={index === 0 ? firstCardRef : undefined}
                  >
                    <CaseCard
                      caseItem={caseItem}
                      caseStudy={caseStudies[index]}
                      mobile
                    />
                  </div>
                ))}

                <div id="dispatch" onMouseEnter={() => setActiveIndex(boardNodes.length - 1)}>
                  <ContactCard home={home} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="page-wrapper case-board-shell"
      id="case-board"
      ref={sectionRef}
      style={{ height: `${Math.max(boardNodes.length, 1) * 100}vh` }}
    >
      <div className="fixed inset-0 h-screen w-screen overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ x: backgroundX, y: backgroundY }}>
          <ChalkboardBackground />
        </motion.div>

        {!hasScrolled ? (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-none absolute bottom-8 right-8 z-30 hidden items-center gap-3 md:flex"
            initial={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span
              className="font-[var(--font-mono)] text-[var(--font-size-sm)] uppercase text-[var(--chalk-white)]"
              style={{ letterSpacing: '0.1em', textShadow: '0 0 8px rgba(255,255,255,0.25)' }}
            >
              Scroll to investigate
            </span>
            <motion.span
              animate={{ x: [0, 10, 0] }}
              className="text-[var(--chalk-white)]"
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ⟶
            </motion.span>
          </motion.div>
        ) : null}

        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              'radial-gradient(ellipse 55% 65% at 50% 50%, transparent 0%, transparent 45%, rgba(10, 15, 10, 0.4) 70%, rgba(10, 15, 10, 0.75) 100%)'
          }}
        />

        <motion.div
          className="absolute left-0 top-0 z-10"
          style={{
            width: BOARD_CONFIG.CANVAS_WIDTH,
            height: BOARD_CONFIG.CANVAS_HEIGHT,
            x: springX,
            y: springY
          }}
        >
          <RedString
            activeIndex={activeIndex}
            canvasHeight={BOARD_CONFIG.CANVAS_HEIGHT}
            canvasWidth={BOARD_CONFIG.CANVAS_WIDTH}
            nodes={boardNodes}
            orientation="horizontal"
          />

          <motion.div
            animate={{
              opacity: activeIndex === 0 ? 1 : 0.5,
              scale: Math.abs(progressValue - 0) < 0.5 ? lerp(0.96, 1, 1 - Math.abs(progressValue - 0) / 0.5) : 0.92
            }}
            className="absolute z-20 w-[clamp(320px,60vw,860px)]"
            style={{ left: INTRO_NODE.boardX, top: INTRO_NODE.boardY }}
            transition={{ type: 'spring', stiffness: 86, damping: 18 }}
          >
            <IntroCard home={home} />
          </motion.div>

          {cases.map((caseItem, index) => {
            const nodeDistance = Math.abs(progressValue - (index + 1));
            const scale = nodeDistance < 0.5 ? lerp(0.96, 1, 1 - nodeDistance / 0.5) : 0.92;
            const opacity = nodeDistance < 0.65 ? 1 : nodeDistance < 1.5 ? 0.72 : 0.42;

            return (
              <motion.div
                animate={{ opacity, scale }}
                className="absolute"
                key={caseItem.id}
                ref={index === 0 ? firstCardRef : undefined}
                style={{
                  left: caseItem.boardX,
                  top: caseItem.boardY,
                  zIndex: index + 1 === activeIndex ? 22 : 12
                }}
                transition={{ type: 'spring', stiffness: 86, damping: 18 }}
              >
                <CaseCard
                  caseItem={caseItem}
                  caseStudy={caseStudies[index]}
                  entranceEnabled={index === 0 && firstCardInView}
                  isActive={index + 1 === activeIndex}
                />
              </motion.div>
            );
          })}

          <motion.div
            animate={{
              opacity: activeIndex === boardNodes.length - 1 ? 1 : 0.5,
              scale:
                Math.abs(progressValue - (boardNodes.length - 1)) < 0.5
                  ? lerp(0.96, 1, 1 - Math.abs(progressValue - (boardNodes.length - 1)) / 0.5)
                  : 0.92
            }}
            className="absolute z-20 w-[clamp(320px,60vw,860px)]"
            id="dispatch"
            style={{ left: CONTACT_NODE.boardX, top: CONTACT_NODE.boardY }}
            transition={{ type: 'spring', stiffness: 86, damping: 18 }}
          >
            <ContactCard home={home} />
          </motion.div>
        </motion.div>

        <CaseNavigator activeIndex={activeIndex} items={boardNodes} onJump={jumpToNode} progress={progressValue} />
      </div>
    </section>
  );
}
