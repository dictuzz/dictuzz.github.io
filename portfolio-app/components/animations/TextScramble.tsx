'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

type TextScrambleProps = {
  /** Final text to resolve to */
  text: string;
  /** Delay before starting (ms) */
  delay?: number;
  /** How many random cycles per character */
  cycles?: number;
  /** Time between cycles (ms) */
  cycleSpeed?: number;
  /** Stagger between characters starting (ms) */
  stagger?: number;
  /** CSS class for the container */
  className?: string;
  /** Callback when reveal completes */
  onComplete?: () => void;
};

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export function TextScramble({
  text,
  delay = 0,
  cycles = 8,
  cycleSpeed = 40,
  stagger = 50,
  className = '',
  onComplete,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState<string[]>(
    Array(text.length).fill('\u00A0')
  );
  const [locked, setLocked] = useState<boolean[]>(
    Array(text.length).fill(false)
  );
  const completedRef = useRef(false);

  const scramble = useCallback(() => {
    const chars = text.split('');
    const timers: ReturnType<typeof setTimeout>[] = [];

    chars.forEach((char, i) => {
      if (char === ' ') {
        timers.push(
          setTimeout(() => {
            setDisplayed((prev) => {
              const next = [...prev];
              next[i] = ' ';
              return next;
            });
            setLocked((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, delay)
        );
        return;
      }

      for (let c = 0; c < cycles; c++) {
        timers.push(
          setTimeout(() => {
            setDisplayed((prev) => {
              const next = [...prev];
              next[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
              return next;
            });
          }, delay + i * stagger + c * cycleSpeed)
        );
      }

      timers.push(
        setTimeout(() => {
          setDisplayed((prev) => {
            const next = [...prev];
            next[i] = char;
            return next;
          });
          setLocked((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });

          if (i === chars.length - 1 && !completedRef.current) {
            completedRef.current = true;
            onComplete?.();
          }
        }, delay + i * stagger + cycles * cycleSpeed)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [text, delay, cycles, cycleSpeed, stagger, onComplete]);

  useEffect(() => {
    return scramble();
  }, [scramble]);

  // Split into words to prevent mid-word line breaks
  const words: { chars: { char: string; locked: boolean; index: number }[] }[] = [];
  let currentWord: { char: string; locked: boolean; index: number }[] = [];

  displayed.forEach((char, i) => {
    if (char === ' ') {
      if (currentWord.length > 0) {
        words.push({ chars: currentWord });
        currentWord = [];
      }
    } else {
      currentWord.push({ char, locked: locked[i], index: i });
    }
  });
  if (currentWord.length > 0) {
    words.push({ chars: currentWord });
  }

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} style={{ whiteSpace: 'nowrap' }}>
          {word.chars.map((c) => (
            <span
              key={c.index}
              className={`inline-block transition-colors duration-150 ${
                c.locked
                  ? 'text-[var(--color-text)]'
                  : 'text-[var(--color-accent)]'
              }`}
            >
              {c.char}
            </span>
          ))}
          {wi < words.length - 1 && <span>{'\u00A0'}</span>}
        </span>
      ))}
    </span>
  );
}
