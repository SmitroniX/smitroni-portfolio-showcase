import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only activate custom cursor on non-touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = target.closest('a, button, input, textarea, [role="button"], .cursor-pointer');
        setIsHovering(!!isClickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animationFrameId: number;
    const animateTrail = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22,
      }));
      animationFrameId = requestAnimationFrame(animateTrail);
    };
    animationFrameId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pos]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Central bright dot */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isClicked ? '10px' : isHovering ? '6px' : '8px',
          height: isClicked ? '10px' : isHovering ? '6px' : '8px',
          backgroundColor: isHovering ? '#00F0FF' : '#FF6B00',
          boxShadow: isHovering
            ? '0 0 12px #00F0FF, 0 0 20px #00F0FF'
            : '0 0 12px #FF6B00, 0 0 24px #FF6B00',
        }}
      />

      {/* Trailing aura ring */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-all duration-150"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isHovering ? '44px' : isClicked ? '24px' : '32px',
          height: isHovering ? '44px' : isClicked ? '24px' : '32px',
          borderColor: isHovering ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 107, 0, 0.5)',
          backgroundColor: isHovering ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 107, 0, 0.03)',
          transform: `translate(-50%, -50%) scale(${isClicked ? 0.8 : 1})`,
        }}
      />
    </div>
  );
};
