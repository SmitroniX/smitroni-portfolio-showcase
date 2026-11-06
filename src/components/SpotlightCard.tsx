import React, { useRef, useState, useCallback } from 'react';
import { sounds } from '../utils/sound';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
  enableFoil?: boolean;
  enableLaserBeam?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 138, 0, 0.14)',
  enableTilt = true,
  enableFoil = true,
  enableLaserBeam = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; pctX: number; pctY: number }>({
    x: 0,
    y: 0,
    pctX: 50,
    pctY: 50,
  });
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const pctX = Math.round((x / rect.width) * 100);
      const pctY = Math.round((y / rect.height) * 100);

      setCoords({ x, y, pctX, pctY });

      if (enableTilt) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // Subtle, refined 3D tilt (max 8 degrees to remain ultra-crisp and legible)
        const rotX = ((y - centerY) / centerY) * -7.5;
        const rotY = ((x - centerX) / centerX) * 7.5;
        setRotation({ x: rotX, y: rotY });
      }
    },
    [enableTilt]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    sounds.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Holographic foil gradient angle calculated from pointer
  const foilAngle = Math.round((coords.pctX + coords.pctY) * 1.8);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: enableTilt
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.012 : 1}, ${isHovered ? 1.012 : 1}, 1)`
          : undefined,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s ease'
          : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease',
      }}
      className={`bento-card relative rounded-2xl border border-white/[0.08] bg-[#0c1019]/75 backdrop-blur-xl overflow-hidden group select-none ${className}`}
      {...props}
    >
      {/* 1. Dynamic Specular Light Glare following pointer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-10 will-change-transform"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 75%)`,
        }}
      />

      {/* 2. Holographic Rainbow Diffraction Foil Sheen */}
      {enableFoil && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 z-10 mix-blend-color-dodge will-change-transform"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `linear-gradient(${foilAngle}deg, transparent 20%, rgba(255, 0, 128, 0.15) 35%, rgba(0, 240, 255, 0.2) 50%, rgba(255, 138, 0, 0.18) 65%, transparent 80%)`,
          }}
        />
      )}

      {/* 3. Real-time Specular Point Reflection */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 0.5 : 0,
          background: `radial-gradient(circle 120px at ${coords.pctX}% ${coords.pctY}%, rgba(255, 255, 255, 0.18) 0%, transparent 100%)`,
        }}
      />

      {/* 4. Laser Border Tracer on Hover */}
      {enableLaserBeam && isHovered && (
        <div className="laser-border-tracer pointer-events-none absolute inset-0 rounded-2xl z-30" />
      )}

      {/* 5. 3D Spatial Interior Container */}
      <div
        className="relative z-20 h-full w-full"
        style={{
          transform: enableTilt && isHovered ? 'translateZ(18px)' : 'translateZ(0px)',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
};
