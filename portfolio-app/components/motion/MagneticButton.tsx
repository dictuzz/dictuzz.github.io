'use client';

import Link from 'next/link';
import { useState } from 'react';

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
};

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

export function MagneticButton({
  href,
  children,
  variant = 'primary',
  className = ''
}: MagneticButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isExternal = /^(https?:|mailto:)/i.test(href);
  const classes = `button button--${variant} ${className}`.trim();

  function handleMove(event: React.MouseEvent<HTMLElement>) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    setOffset({ x: clamp(x, 6), y: clamp(y, 6) });
  }

  function handleLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`
  };

  if (isExternal) {
    return (
      <a
        className={classes}
        href={href}
        style={style}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      className={classes}
      href={href}
      prefetch={false}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </Link>
  );
}
