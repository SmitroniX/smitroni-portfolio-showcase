import React, { useRef, useState } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderGlowColor?: string;
  enableTilt?: boolean;
  maxTilt?: number;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 138, 0, 0.13)',
  borderGlowColor = 'rgba(255, 138, 0, 0.4)',
  enableTilt = false,
  maxTilt = 4,
  style,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    if (enableTilt) {
      const rx = ((y / rect.height) - 0.5) * -maxTilt * 2;
      const ry = ((x / rect.width) - 0.5) * maxTilt * 2;
      setTilt({ rx, ry });
    }
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => {
    setOpacity(0);
    if (enableTilt) setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: enableTilt
          ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
          : undefined,
        transition: enableTilt
          ? opacity
            ? 'transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
            : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease'
          : undefined,
      }}
      className={`relative rounded-xl bg-[#0A0E17]/82 border border-white/[0.08] backdrop-blur-xl overflow-hidden transition-colors duration-300 hover:border-white/[0.18] hover:shadow-2xl hover:shadow-black/60 ${className}`}
      {...props}
    >
      {/* Dynamic Cursor-Following Border Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(320px circle at ${position.x}px ${position.y}px, ${borderGlowColor}, transparent 55%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Radial Surface Spotlight Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 50%)`,
        }}
      />

      {/* Subtle Specular Top Hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
