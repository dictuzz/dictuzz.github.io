import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TapeStrip } from '@/components/ui/tape-strip';
import { Thumbtack } from '@/components/ui/thumbtack';

export function NewspaperClipping({
  children,
  tiltDegree,
  className,
  scrollable = true
}: {
  children: ReactNode;
  tiltDegree: number;
  className?: string;
  scrollable?: boolean;
}) {
  return (
    <article
      className={cn(
        'newspaper-card scrollbar-paper relative px-6 pb-6 pt-10 md:px-8 md:pb-8 md:pt-12',
        scrollable ? 'overflow-y-auto' : 'overflow-hidden',
        className
      )}
      style={{ transform: `rotate(${tiltDegree}deg)` }}
    >
      <TapeStrip className="left-[18%]" rotation={-3} />
      <TapeStrip className="right-[18%]" rotation={4} />
      <Thumbtack />
      {children}
    </article>
  );
}
