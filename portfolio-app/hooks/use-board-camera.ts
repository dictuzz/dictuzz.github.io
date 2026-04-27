import {
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionValueEvent,
  animate
} from 'framer-motion';
import { useEffect, useMemo, useRef, useState, RefObject } from 'react';
import { BOARD_CONFIG } from '@/config/board';
import { lerp } from '@/lib/utils';

// Camera configurations imported from config

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Waypoint {
  cameraX: number;
  cameraY: number;
}

interface BoardNodeData {
  boardX: number;
  boardY: number;
}

interface NodeSize {
  height: number;
  width: number;
}

export function useBoardCamera({
  nodes,
  nodeSizes,
  sectionRef,
  isMobile,
  reducedMotion,
  viewportWidth,
  viewportHeight
}: {
  nodes: BoardNodeData[];
  nodeSizes: NodeSize[];
  sectionRef: RefObject<HTMLElement | null>;
  isMobile: boolean;
  reducedMotion: boolean;
  viewportWidth: number;
  viewportHeight: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const driftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const waypoints = useMemo<Waypoint[]>(
    () =>
      nodes.map((node, index) => {
        const nodeSize = nodeSizes[index];
        const cardWidth = nodeSize?.width ?? BOARD_CONFIG.DESKTOP_CARD_WIDTH;
        const cardHeight = nodeSize?.height ?? BOARD_CONFIG.DESKTOP_CARD_HEIGHT;

        return {
          cameraX: -node.boardX + viewportWidth * BOARD_CONFIG.DESKTOP_FOCUS_X_RATIO - cardWidth / 2,
          cameraY: -node.boardY + viewportHeight * BOARD_CONFIG.DESKTOP_FOCUS_Y_RATIO - cardHeight / 2
        };
      }),
    [nodeSizes, nodes, viewportHeight, viewportWidth]
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

  // Ensure scrollYProgress initializes activeIndex correctly if needed
  useEffect(() => {
    setActiveIndex(0);
    setProgressValue(0);
  }, []);

  useEffect(() => {
    if (!waypoints.length) return;
    targetX.set(waypoints[0].cameraX);
    targetY.set(waypoints[0].cameraY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waypoints]);

  useEffect(() => {
    if (isMobile || reducedMotion || isScrolling || !waypoints.length) {
      return;
    }

    const base = waypoints[Math.min(activeIndex, waypoints.length - 1)];
    if (!base) return;

    let isSubscribed = true;

    const playDrift = async () => {
      while (isSubscribed) {
        const nextX = base.cameraX + (Math.random() - 0.5) * 8;
        const nextY = base.cameraY + (Math.random() - 0.5) * 6;

        const xAnim = animate(targetX, nextX, { duration: 4, ease: 'easeInOut' });
        const yAnim = animate(targetY, nextY, { duration: 4, ease: 'easeInOut' });

        await Promise.all([xAnim, yAnim]);
      }
    };

    playDrift();

    return () => {
      isSubscribed = false;
    };
  }, [activeIndex, isMobile, isScrolling, reducedMotion, targetX, targetY, waypoints]);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const bounded = Math.max(0, Math.min(value, 1));
    const nodeProgress = bounded * Math.max(nodes.length - 1, 0);
    const currentIndex = Math.min(Math.floor(nodeProgress), Math.max(nodes.length - 2, 0));
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
      if (driftTimerRef.current) clearTimeout(driftTimerRef.current);
    };
  }, []);

  const hasScrolled = progressValue > 0.05;

  const jumpToNode = (index: number) => {
    if (!sectionRef.current) return;
    const top = sectionRef.current.offsetTop + window.innerHeight * index;
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return {
    backgroundX,
    backgroundY,
    springX,
    springY,
    activeIndex,
    setActiveIndex,
    progressValue,
    hasScrolled,
    jumpToNode
  };
}
