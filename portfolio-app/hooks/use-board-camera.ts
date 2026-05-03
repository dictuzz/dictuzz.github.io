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
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const driftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRoundedIndexRef = useRef<number>(0);

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

  // Tighter spring: camera tracks scroll input closely instead of drifting behind.
  // Critical-ish damping (zeta ~= 1) keeps motion smooth without overshoot.
  const springX = useSpring(targetX, {
    stiffness: 220,
    damping: 30,
    mass: 1,
    restDelta: 0.5
  });
  const springY = useSpring(targetY, {
    stiffness: 220,
    damping: 30,
    mass: 1,
    restDelta: 0.5
  });

  const backgroundX = useTransform(springX, (value) => value * 0.2);
  const backgroundY = useTransform(springY, (value) => value * 0.2);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  });

  // Continuous scroll position in node-space (0..nodes.length-1) as a motion value.
  // Cards / navigator subscribe to this directly via useTransform, so the per-frame
  // scroll updates never trigger a React re-render of the board.
  const nodeProgress = useTransform(scrollYProgress, (v) => {
    const bounded = Math.max(0, Math.min(v, 1));
    return bounded * Math.max(nodes.length - 1, 0);
  });

  // Ensure scrollYProgress initializes activeIndex correctly if needed
  useEffect(() => {
    setActiveIndex(0);
    lastRoundedIndexRef.current = 0;
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

    // Subtle "breathing" while idle — small enough that it reads as the
    // wall settling, not as a wobble that competes with the user's gaze.
    const playDrift = async () => {
      while (isSubscribed) {
        const nextX = base.cameraX + (Math.random() - 0.5) * 4;
        const nextY = base.cameraY + (Math.random() - 0.5) * 3;

        const xAnim = animate(targetX, nextX, { duration: 6, ease: 'easeInOut' });
        const yAnim = animate(targetY, nextY, { duration: 6, ease: 'easeInOut' });

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
    const progress = bounded * Math.max(nodes.length - 1, 0);
    const currentIndex = Math.min(Math.floor(progress), Math.max(nodes.length - 2, 0));
    // Linear interpolation between waypoints — camera tracks scroll 1:1.
    // The cubic easing was adding perceptible settling between nodes.
    const localProgress = progress - currentIndex;
    const from = waypoints[currentIndex] ?? waypoints[0];
    const to = waypoints[currentIndex + 1] ?? from;

    if (from && to) {
      targetX.set(lerp(from.cameraX, to.cameraX, localProgress));
      targetY.set(lerp(from.cameraY, to.cameraY, localProgress));
    }

    // Only commit React state when the rounded node actually changes — avoids
    // re-rendering the board (and every memoized subtree) on every scroll tick.
    const rounded = Math.round(progress);
    if (rounded !== lastRoundedIndexRef.current) {
      lastRoundedIndexRef.current = rounded;
      setActiveIndex(rounded);
    }

    // React bails out when these setters are called with the same value,
    // so per-tick calls don't trigger re-renders once they're already true.
    if (progress > 0.05) {
      setHasScrolled(true);
    }
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
    nodeProgress,
    hasScrolled,
    jumpToNode
  };
}
