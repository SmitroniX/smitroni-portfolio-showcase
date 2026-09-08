import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('a, button, input, textarea, select, [role="button"]');
        setIsHovering(!!isInteractive);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    const updateCursor = () => {
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.2;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(updateCursor);
    };
    animId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full will-change-transform pointer-events-none transition-[width,height,background-color] duration-75"
        style={{
          width: isHovering ? '6px' : '4px',
          height: isHovering ? '6px' : '4px',
          backgroundColor: isHovering ? '#FF8A00' : '#FFFFFF',
        }}
      />

      {/* Smooth Trailing Halo */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 rounded-full will-change-transform pointer-events-none transition-[width,height,background-color] duration-150 ease-out"
        style={{
          width: isHovering ? '36px' : '20px',
          height: isHovering ? '36px' : '20px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backgroundColor: isHovering ? 'rgba(255, 138, 0, 0.05)' : 'transparent',
        }}
      />
    </div>
  );
};
