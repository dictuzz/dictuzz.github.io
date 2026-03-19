'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

type EtherealShadowProps = {
  /** Section color stops [scrollProgress, r, g, b] */
  colorStops?: [number, number, number, number][];
  /** Noise grain opacity 0-1 */
  noiseOpacity?: number;
  /** Animation speed multiplier */
  speed?: number;
};

const DEFAULT_STOPS: [number, number, number, number][] = [
  [0.0, 15, 15, 25],   // Hero — deep space
  [0.2, 20, 10, 30],   // About — dark purple
  [0.4, 10, 20, 15],   // Projects — investigation green
  [0.7, 10, 15, 30],   // Skills — deep navy
  [0.9, 25, 10, 10],   // Contact — transmission red
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateColor(
  stops: [number, number, number, number][],
  progress: number
): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, r0, g0, b0] = stops[i];
    const [p1, r1, g1, b1] = stops[i + 1];
    if (clamped >= p0 && clamped <= p1) {
      const t = (clamped - p0) / (p1 - p0);
      return [lerp(r0, r1, t), lerp(g0, g1, t), lerp(b0, b1, t)];
    }
  }

  const last = stops[stops.length - 1];
  return [last[1], last[2], last[3]];
}

export function EtherealShadow({
  colorStops = DEFAULT_STOPS,
  noiseOpacity = 0.04,
  speed = 0.5,
}: EtherealShadowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const colorRef = useRef<[number, number, number]>([15, 15, 25]);
  const timeRef = useRef(0);

  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    colorRef.current = interpolateColor(colorStops, v);
  });

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const [r, g, b] = colorRef.current;

    timeRef.current += 0.008 * speed;
    const t = timeRef.current;

    // Base fill
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, w, h);

    // Animated gradient blobs
    const blobs = [
      {
        x: w * (0.3 + 0.15 * Math.sin(t * 0.7)),
        y: h * (0.3 + 0.1 * Math.cos(t * 0.5)),
        radius: Math.min(w, h) * (0.35 + 0.05 * Math.sin(t * 0.3)),
        color: [r + 15, g + 8, b + 20],
        alpha: 0.08,
      },
      {
        x: w * (0.7 + 0.1 * Math.cos(t * 0.6)),
        y: h * (0.6 + 0.15 * Math.sin(t * 0.4)),
        radius: Math.min(w, h) * (0.3 + 0.08 * Math.cos(t * 0.35)),
        color: [r + 5, g + 12, b + 10],
        alpha: 0.06,
      },
      {
        x: w * (0.5 + 0.2 * Math.sin(t * 0.3)),
        y: h * (0.8 + 0.1 * Math.cos(t * 0.7)),
        radius: Math.min(w, h) * (0.25 + 0.06 * Math.sin(t * 0.5)),
        color: [r + 10, g + 5, b + 15],
        alpha: 0.05,
      },
    ];

    for (const blob of blobs) {
      const grad = ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, blob.radius
      );
      const [br, bg, bb] = blob.color;
      grad.addColorStop(0, `rgba(${br}, ${bg}, ${bb}, ${blob.alpha})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Noise grain
    if (noiseOpacity > 0) {
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 16) {
        const noise = (Math.random() - 0.5) * 255 * noiseOpacity;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);
    }

    animRef.current = requestAnimationFrame(animate);
  }, [colorStops, noiseOpacity, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      // Lower resolution for performance
      const dpr = Math.min(window.devicePixelRatio, 1);
      canvas.width = window.innerWidth * dpr * 0.5;
      canvas.height = window.innerHeight * dpr * 0.5;
    };

    resize();
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 w-full h-full"
      style={{ imageRendering: 'auto' }}
    />
  );
}
