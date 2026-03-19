'use client';

import { motion } from 'framer-motion';

type ScanLineProps = {
  /** How long the sweep takes in seconds */
  duration?: number;
  /** Delay before starting */
  delay?: number;
  /** Callback when sweep completes */
  onComplete?: () => void;
};

export function ScanLine({
  duration = 0.6,
  delay = 0.3,
  onComplete,
}: ScanLineProps) {
  return (
    <motion.div
      className="fixed inset-x-0 h-[2px] z-[9996] pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
        boxShadow: '0 0 20px var(--color-accent-glow), 0 0 60px var(--color-accent-glow)',
      }}
      initial={{ top: 0, opacity: 1 }}
      animate={{ top: '100vh', opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
      }}
      onAnimationComplete={onComplete}
    />
  );
}
