export function Thumbtack() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #c4a882, var(--pin-metal))',
        boxShadow: '2px 2px 4px rgba(0,0,0,0.6)'
      }}
    />
  );
}
