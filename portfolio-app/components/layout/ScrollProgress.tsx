'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9997] origin-left"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, var(--color-accent), rgba(196, 151, 79, 0.5))',
        boxShadow: '0 0 8px var(--color-accent-glow)',
      }}
    />
  );
}
