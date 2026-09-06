import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('a, button, input, textarea, select, [role="button"]');
        setIsHovering(!!isInteractive);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    const updateTrail = () => {
      setTrail((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.2,
        y: prev.y + (pos.y - prev.y) * 0.2,
      }));
      animId = requestAnimationFrame(updateTrail);
    };
    animId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [pos]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Precision Core Dot */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovering ? '6px' : '4px',
          height: isHovering ? '6px' : '4px',
          backgroundColor: isHovering ? '#FF8A00' : '#FFFFFF',
        }}
      />

      {/* Smooth Trailing Halo */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ease-out"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: isHovering ? '36px' : '20px',
          height: isHovering ? '36px' : '20px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backgroundColor: isHovering ? 'rgba(255, 138, 0, 0.05)' : 'transparent',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};
