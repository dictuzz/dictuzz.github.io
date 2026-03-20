'use client';

import Link from 'next/link';
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getCases } from '@/data/cases';
import type { CaseStudy, PortfolioHomeData } from '@/content/types';
import { ChalkboardBackground } from '@/components/ui/chalkboard-bg';
import { type BoardNavigatorItem, CaseNavigator } from '@/components/ui/case-navigator';
import { NewspaperClipping } from '@/components/ui/newspaper-clipping';
import { type BoardAnchor, RedString } from '@/components/ui/red-string';
import { CaseCard } from '@/components/sections/case-card';

const CANVAS_WIDTH = 5000;
const CANVAS_HEIGHT = 3000;
const DESKTOP_CARD_WIDTH = 880;
const DESKTOP_CARD_HEIGHT = 840;
const DESKTOP_FOCUS_X_RATIO = 0.5;
const DESKTOP_FOCUS_Y_RATIO = 0.6;

const INTRO_NODE = {
  id: 'intro',
  boardX: 180,
  boardY: 260,
  title: 'Subject Dossier',
  href: undefined
} satisfies BoardAnchor & BoardNavigatorItem;

const CONTACT_NODE = {
  id: 'contact',
  boardX: 3600,
  boardY: 1820,
  title: 'Dispatch Contact',
  href: '#dispatch'
} satisfies BoardAnchor & BoardNavigatorItem;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

function IntroCard({ home }: { home: PortfolioHomeData }) {
  return (
    <NewspaperClipping className="mx-0" scrollable={false} tiltDegree={-1.6}>
      <header className="border-b-2 border-[rgba(26,20,16,0.2)] pb-4">
        <p className="ui-label text-[var(--stamp-blue)]">{home.masthead.archiveLabel}</p>
        <h2 className="mt-4 max-w-[12ch] font-[var(--font-headline)] text-[var(--font-size-3xl)] italic leading-[0.96] text-[var(--ink-black)]">
          {home.hero.name}
        </h2>
        <p className="mt-3 font-[var(--font-ui)] text-[var(--font-size-sm)] uppercase tracking-[0.1em] text-[var(--ink-dark)]">
          {home.hero.designation}
        </p>
      </header>

      <div className="newspaper-body mt-5">
        <div className="mb-5">
          <p className="ui-label text-[var(--stamp-blue)]">Opening brief</p>
          <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.hero.lead}</p>
          <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.hero.body}</p>
        </div>

        <div className="mb-5">
          <p className="ui-label text-[var(--stamp-blue)]">Profile note</p>
          <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.profile.summary}</p>
          <blockquote className="mt-4 border-l-2 border-[var(--stamp-blue)] pl-4 font-[var(--font-headline)] text-[var(--font-size-lg)] italic leading-8 text-[var(--ink-black)]">
            {home.profile.philosophy}
          </blockquote>
        </div>
      </div>

      <footer className="mt-5 border-t-2 border-[rgba(26,20,16,0.2)] pt-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {home.hero.quickFacts.map((fact) => (
            <span className="case-pill" key={fact.label}>
              {fact.label}: {fact.value}
            </span>
          ))}
        </div>
        <p className="text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.masthead.guidance}</p>
      </footer>
    </NewspaperClipping>
  );
}

function ContactCard({ home }: { home: PortfolioHomeData }) {
  return (
    <NewspaperClipping className="mx-0" scrollable={false} tiltDegree={1.3}>
      <header className="border-b-2 border-[rgba(26,20,16,0.2)] pb-4">
        <p className="ui-label text-[var(--stamp-blue)]">Dispatch Contact</p>
        <h2 className="mt-4 max-w-[14ch] font-[var(--font-headline)] text-[var(--font-size-2xl)] italic leading-[1.02] text-[var(--ink-black)]">
          {home.contact.title}
        </h2>
        <p className="mt-3 text-[var(--font-size-sm)] leading-7 text-[var(--ink-dark)]">{home.contact.body}</p>
      </header>

      <div className="mt-5 grid gap-3">
        <a className="paper-link" href={`mailto:${home.contact.email}`}>
          Email Dispatch
        </a>
        <a className="paper-link paper-link--secondary" href={home.contact.linkedin} rel="noreferrer" target="_blank">
          LinkedIn File
        </a>
        <a className="paper-link paper-link--secondary" href={home.contact.calendar} rel="noreferrer" target="_blank">
          Book Calendar
        </a>
      </div>

      <footer className="mt-5 border-t-2 border-[rgba(26,20,16,0.2)] pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="case-pill">{home.contact.email}</span>
          <span className="case-pill">{home.contact.availability}</span>
        </div>
      </footer>
    </NewspaperClipping>
  );
}

export function CaseBoardSection({
  home,
  caseStudies
}: {
  home: PortfolioHomeData;
  caseStudies: CaseStudy[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const driftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const driftIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
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

  const waypoints = useMemo(
    () =>
      boardNodes.map((node) => ({
        cameraX: -node.boardX + viewportWidth * DESKTOP_FOCUS_X_RATIO - DESKTOP_CARD_WIDTH / 2,
        cameraY: -node.boardY + viewportHeight * DESKTOP_FOCUS_Y_RATIO - DESKTOP_CARD_HEIGHT / 2
      })),
    [boardNodes, viewportHeight, viewportWidth]
  );

  const targetX = useMotionValue(waypoints[0]?.cameraX ?? 0);
  const targetY = useMotionValue(waypoints[0]?.cameraY ?? 0);

  const springX = useSpring(targetX, {
    stiffness: 34,
    damping: 14,
    mass: 1.65,
    restDelta: 0.5
  });
  const springY = useSpring(targetY, {
    stiffness: 34,
    damping: 14,
    mass: 1.65,
    restDelta: 0.5
  });

  const backgroundX = useTransform(springX, (value) => value * 0.2);
  const backgroundY = useTransform(springY, (value) => value * 0.2);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    if (!waypoints.length) {
      return;
    }

    targetX.set(waypoints[0].cameraX);
    targetY.set(waypoints[0].cameraY);
  }, [targetX, targetY, waypoints]);

  useEffect(() => {
    if (isMobile || reducedMotion || isScrolling || !waypoints.length) {
      if (driftIntervalRef.current) {
        clearInterval(driftIntervalRef.current);
        driftIntervalRef.current = null;
      }
      return;
    }

    driftIntervalRef.current = setInterval(() => {
      const base = waypoints[Math.min(activeIndex, waypoints.length - 1)];

      if (!base) {
        return;
      }

      targetX.set(base.cameraX + (Math.random() - 0.5) * 4);
      targetY.set(base.cameraY + (Math.random() - 0.5) * 3);
    }, 4000);

    return () => {
      if (driftIntervalRef.current) {
        clearInterval(driftIntervalRef.current);
        driftIntervalRef.current = null;
      }
    };
  }, [activeIndex, isMobile, isScrolling, reducedMotion, targetX, targetY, waypoints]);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const bounded = Math.max(0, Math.min(value, 1));
    const nodeProgress = bounded * Math.max(boardNodes.length - 1, 0);
    const currentIndex = Math.min(Math.floor(nodeProgress), Math.max(boardNodes.length - 2, 0));
    const localProgress = easeInOutCubic(nodeProgress - currentIndex);
    const from = waypoints[currentIndex] ?? waypoints[0];
    const to = waypoints[currentIndex + 1] ?? from;

    if (from && to) {
      targetX.set(lerp(from.cameraX, to.cameraX, localProgress));
      targetY.set(lerp(from.cameraY, to.cameraY, localProgress));
    }

    setProgressValue(nodeProgress);
    setActiveIndex(Math.round(nodeProgress));
    setIsScrolling(true);

    if (driftTimerRef.current) {
      clearTimeout(driftTimerRef.current);
    }

    driftTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 340);
  });

  useEffect(() => {
    return () => {
      if (driftTimerRef.current) {
        clearTimeout(driftTimerRef.current);
      }
      if (driftIntervalRef.current) {
        clearInterval(driftIntervalRef.current);
      }
    };
  }, []);

  const hasScrolled = progressValue > 0.05;

  const jumpToNode = (index: number) => {
    if (!sectionRef.current) return;
    const top = sectionRef.current.offsetTop + window.innerHeight * index;
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

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
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            x: springX,
            y: springY
          }}
        >
          <RedString
            activeIndex={activeIndex}
            canvasHeight={CANVAS_HEIGHT}
            canvasWidth={CANVAS_WIDTH}
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
