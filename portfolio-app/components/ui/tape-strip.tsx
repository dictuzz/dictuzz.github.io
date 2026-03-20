import { cn } from '@/lib/utils';

export function TapeStrip({
  className,
  rotation = -2
}: {
  className?: string;
  rotation?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute top-0 h-6 w-20 -translate-y-1/3', className)}
      style={{
        background: 'var(--tape-color)',
        border: '1px solid rgba(255,240,180,0.3)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transform: `rotate(${rotation}deg)`
      }}
    />
  );
}
