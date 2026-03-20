const smudges = [
  { left: '10%', top: '16%', width: 280, height: 160 },
  { left: '72%', top: '20%', width: 260, height: 180 },
  { left: '42%', top: '64%', width: 320, height: 200 },
  { left: '18%', top: '76%', width: 220, height: 140 },
  { left: '58%', top: '44%', width: 360, height: 180 }
];

export function ChalkboardBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--board-bg)'
        }}
      />

      <div
        className="absolute inset-0 opacity-55"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 14%, rgba(255,255,255,0.025), transparent 18%),
            radial-gradient(circle at 78% 22%, rgba(255,255,255,0.02), transparent 20%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.015) 2px,
              rgba(255,255,255,0.015) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.008) 2px,
              rgba(255,255,255,0.008) 4px
            )
          `
        }}
      />

      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" preserveAspectRatio="none">
        <filter id="chalk-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#chalk-noise)" />
      </svg>

      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 22%, rgba(255,255,255,0.04) 0, transparent 24%), radial-gradient(circle at 84% 68%, rgba(255,255,255,0.035) 0, transparent 22%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0, transparent 38%)',
          mixBlendMode: 'screen'
        }}
      />

      {smudges.map((smudge, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-white/10 blur-[60px]"
          style={{
            left: smudge.left,
            top: smudge.top,
            width: smudge.width,
            height: smudge.height,
            opacity: 0.03
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 28%, rgba(0,0,0,0.35) 72%, rgba(0,0,0,0.56) 100%)'
        }}
      />

      <div
        className="absolute inset-0 border-[8px]"
        style={{
          borderColor: '#0a0d0a',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
        }}
      />
    </div>
  );
}
