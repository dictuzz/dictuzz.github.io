'use client';

import { motion } from 'framer-motion';

export type BoardAnchor = {
  boardX: number;
  boardY: number;
  id: string;
};

const CARD_WIDTH = 760;
const PIN_Y_OFFSET = -10;

function verticalPath(index: number, width: number) {
  const x = width / 2;
  const y1 = 220 + index * 640;
  const y2 = 220 + (index + 1) * 640;

  return `M ${x} ${y1} C ${x + 80} ${y1 + 120} ${x - 80} ${y2 - 120} ${x} ${y2}`;
}

function buildScatterPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const sagAmount = Math.max(distance * 0.18, 120);
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 + sagAmount;
  const cp1x = from.x + (midX - from.x) * 0.5;
  const cp2x = midX + (to.x - midX) * 0.5;

  return `M ${from.x} ${from.y} C ${cp1x} ${midY} ${cp2x} ${midY} ${to.x} ${to.y}`;
}

export function RedString({
  activeIndex,
  canvasHeight,
  canvasWidth,
  nodes,
  orientation
}: {
  activeIndex: number;
  canvasHeight: number;
  canvasWidth: number;
  nodes: BoardAnchor[];
  orientation: 'horizontal' | 'vertical';
}) {
  const paths = Array.from({ length: Math.max(nodes.length - 1, 0) }, (_, index) => index);
  const pinPositions = nodes.map((node) => ({
    x: node.boardX + CARD_WIDTH / 2,
    y: node.boardY + PIN_Y_OFFSET
  }));

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-10 overflow-visible"
      style={{
        width: canvasWidth,
        height: canvasHeight
      }}
    >
      <defs>
        <filter id="string-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#7B0000" floodOpacity="0.6" />
        </filter>
        <filter id="string-glow">
          <feGaussianBlur result="blur" stdDeviation="2" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {paths.map((index) => {
        const from = pinPositions[index];
        const to = pinPositions[index + 1];
        const isVisited = index < activeIndex;
        const isCurrent = index === activeIndex - 1;
        const path =
          orientation === 'horizontal'
            ? buildScatterPath(from, to)
            : verticalPath(index, canvasWidth);

        return (
          <motion.path
            animate={{
              opacity: isCurrent ? 1 : isVisited ? 0.84 : 0.18,
              pathLength: isCurrent ? 1 : isVisited ? 1 : 0.92,
              strokeWidth: isCurrent ? 3.2 : isVisited ? 2.15 : 1.15
            }}
            d={path}
            fill="none"
            filter={isCurrent ? 'url(#string-glow)' : 'url(#string-shadow)'}
            key={`string-${nodes[index].id}-${nodes[index + 1].id}`}
            stroke={isCurrent ? '#e74c3c' : isVisited ? '#c0392b' : '#6b2020'}
            strokeLinecap="round"
            initial={{ pathLength: 0.88 }}
            transition={{ duration: isCurrent ? 0.7 : 0.45, ease: 'easeOut' }}
          />
        );
      })}

      {pinPositions.map((pin, index) => {
        const cx = orientation === 'horizontal' ? pin.x : canvasWidth / 2;
        const cy = orientation === 'horizontal' ? pin.y : 220 + index * 640;

        return (
          <motion.g
            animate={{
              opacity: index <= activeIndex ? 1 : 0.32,
              scale: index === activeIndex ? 1.55 : index < activeIndex ? 1.08 : 0.92
            }}
            key={`pin-${nodes[index].id}`}
            style={{ originX: `${cx}px`, originY: `${cy}px` }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          >
            <circle cx={cx} cy={cy} fill={index <= activeIndex ? '#c0392b' : '#6b2020'} r={5} />
          </motion.g>
        );
      })}
    </svg>
  );
}
