'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';

export type BoardNavigatorItem = {
  id: string;
  href?: string;
  title: string;
};

export function CaseNavigator({
  activeIndex,
  items,
  onJump,
  progress
}: {
  activeIndex: number;
  items: BoardNavigatorItem[];
  onJump: (index: number) => void;
  progress: number;
}) {
  const activeItem = useMemo(() => items[activeIndex] ?? items[0], [activeIndex, items]);
  const progressPercent = items.length > 1 ? Math.min(Math.max(progress / (items.length - 1), 0), 1) * 100 : 0;

  return (
    <aside className="pointer-events-auto absolute bottom-4 left-1/2 z-30 w-[min(88vw,470px)] -translate-x-1/2 rounded-[18px] border border-white/10 bg-[rgba(15,18,16,0.78)] px-3 py-3 shadow-[var(--shadow-deep)] backdrop-blur-md">
      <div className="mb-3 px-2">
        <div className="relative h-6">
          <div className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-[rgba(242,237,228,0.16)]" />
          <motion.div
            className="absolute left-3 top-1/2 h-px -translate-y-1/2 bg-[rgba(242,237,228,0.7)]"
            style={{ width: `calc((100% - 24px) * ${progressPercent / 100})` }}
          />
          <motion.div
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(242,237,228,0.8)] bg-[var(--chalk-white)] shadow-[0_0_10px_rgba(255,255,255,0.28)]"
            style={{ left: `calc(12px + (100% - 24px) * ${progressPercent / 100})` }}
          />
          <div className="absolute inset-0 flex items-center justify-between">
            {items.map((entry, index) => (
              <button
                aria-label={`Jump to ${entry.title}`}
                className="relative flex h-6 w-6 items-center justify-center"
                key={entry.id}
                onClick={() => onJump(index)}
                type="button"
              >
                <span
                  className="font-[var(--font-mono)] text-[var(--font-size-xs)] leading-none"
                  style={{
                    color: index <= activeIndex ? 'var(--chalk-white)' : 'var(--chalk-dim)',
                    textShadow: index === activeIndex ? '0 0 8px rgba(255,255,255,0.3)' : 'none'
                  }}
                >
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="chalk-label text-center" style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>
        BOARD {String(activeIndex + 1).padStart(2, '0')} OF {String(items.length).padStart(2, '0')}
      </p>
      <div className="mt-2 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <AnimatePresence mode="wait">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[18rem] font-[var(--font-headline)] text-[1.15rem] text-[var(--chalk-white)]"
            exit={{ opacity: 0, y: 4 }}
            initial={{ opacity: 0, y: 4 }}
            key={activeItem?.id ?? 'empty'}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeItem?.title ?? ''}
          </motion.p>
        </AnimatePresence>
        {activeItem?.href ? (
          <a className="paper-link paper-link--chalk min-h-[38px] px-3 text-[0.7rem]" href={activeItem.href}>
            Open
          </a>
        ) : null}
      </div>
    </aside>
  );
}
