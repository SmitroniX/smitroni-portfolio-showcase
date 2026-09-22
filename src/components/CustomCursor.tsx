import React, { useEffect, useState, useRef } from 'react';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

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

    const handleMouseDown = (e: MouseEvent) => {
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    let animId: number;
    const updateCursor = () => {
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.25;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.25;

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
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {/* Interactive Click Shockwave Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '40px',
            height: '40px',
            border: '2px solid rgba(255, 138, 0, 0.75)',
            boxShadow: '0 0 15px rgba(255, 138, 0, 0.5), inset 0 0 10px rgba(0, 240, 255, 0.4)',
            animationDuration: '0.6s',
          }}
        />
      ))}

      {/* Precision Core Dot with Cyber Glow */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full will-change-transform pointer-events-none transition-[width,height,background-color,box-shadow] duration-100"
        style={{
          width: isHovering ? '7px' : '5px',
          height: isHovering ? '7px' : '5px',
          backgroundColor: isHovering ? '#FF8A00' : '#FFFFFF',
          boxShadow: isHovering
            ? '0 0 10px #FF8A00, 0 0 20px #FF8A00'
            : '0 0 6px rgba(255, 255, 255, 0.8)',
        }}
      />

      {/* Smooth Trailing Halo with Dynamic Border & Glow */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 rounded-full will-change-transform pointer-events-none transition-[width,height,border-color,background-color,box-shadow] duration-200 ease-out"
        style={{
          width: isHovering ? '44px' : '22px',
          height: isHovering ? '44px' : '22px',
          border: isHovering ? '1.5px solid rgba(255, 138, 0, 0.6)' : '1px solid rgba(255, 255, 255, 0.25)',
          backgroundColor: isHovering ? 'rgba(255, 138, 0, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          boxShadow: isHovering ? '0 0 15px rgba(255, 138, 0, 0.25)' : 'none',
        }}
      />
    </div>
  );
};
