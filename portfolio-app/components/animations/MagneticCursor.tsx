'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MagneticCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const outerSpring = { damping: 20, stiffness: 150, mass: 0.8 };

  const innerX = useSpring(cursorX, springConfig);
  const innerY = useSpring(cursorY, springConfig);
  const outerX = useSpring(cursorX, outerSpring);
  const outerY = useSpring(cursorY, outerSpring);

  const outerScale = useMotionValue(1);
  const outerScaleSpring = useSpring(outerScale, { damping: 20, stiffness: 300 });

  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a, button, [data-cursor="interact"], input, textarea, [role="button"]'
      );
      if (target) {
        outerScale.set(2.5);
        if (labelRef.current) labelRef.current.style.opacity = '1';
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'a, button, [data-cursor="interact"], input, textarea, [role="button"]'
      );
      if (target) {
        outerScale.set(1);
        if (labelRef.current) labelRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    // Hide default cursor
    document.documentElement.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.documentElement.style.cursor = '';
    };
  }, [cursorX, cursorY, outerScale]);

  return (
    <div className="custom-cursor fixed inset-0 z-[9999] pointer-events-none">
      {/* Inner dot */}
      <motion.div
        className="fixed w-2 h-2 rounded-full bg-[var(--color-accent)]"
        style={{
          x: innerX,
          y: innerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed w-10 h-10 rounded-full border border-[var(--color-accent)]/40"
        style={{
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
          scale: outerScaleSpring,
        }}
      >
        <span
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center text-[7px] font-mono uppercase tracking-[0.15em] text-[var(--color-accent)] opacity-0 transition-opacity duration-200"
        >
          interact
        </span>
      </motion.div>
    </div>
  );
}
