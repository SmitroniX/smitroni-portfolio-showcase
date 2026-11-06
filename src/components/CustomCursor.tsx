import React, { useEffect, useState, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'project' | 'terminal'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const mousePos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0, speed: 0 });
  const sparks = useRef<Spark[]>([]);

  useEffect(() => {
    // Disable on coarse pointer devices (touchscreens/mobile)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest('[data-cursor="project"]')) {
          setCursorType('project');
        } else if (target.closest('[data-cursor="terminal"]')) {
          setCursorType('terminal');
        } else if (target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer')) {
          setCursorType('pointer');
        } else {
          setCursorType('default');
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Spawn expanding sonar shockwave rings
      const ripple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setClickRipples((prev) => [...prev.slice(-3), ripple]);
      setTimeout(() => {
        setClickRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 700);

      // Spawn ballistic canvas spark particles
      const sparkColors = ['#FF8A00', '#FFA800', '#00F0FF', '#FFFFFF'];
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5.5;
        const maxLife = 25 + Math.random() * 20;

        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          alpha: 1,
          life: 0,
          maxLife,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    // Canvas size sync
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Main 60-120 FPS cursor animation loop
    let animId: number;
    const updateCursor = () => {
      // Calculate velocity vector
      const vx = mousePos.current.x - prevMousePos.current.x;
      const vy = mousePos.current.y - prevMousePos.current.y;
      const speed = Math.hypot(vx, vy);

      velocity.current = { x: vx, y: vy, speed };
      prevMousePos.current = { x: mousePos.current.x, y: mousePos.current.y };

      // Smooth spring trail interpolation
      const lerpFactor = cursorType === 'pointer' ? 0.35 : 0.22;
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * lerpFactor;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * lerpFactor;

      // Update Dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update Reticle / Outer Ring
      if (reticleRef.current) {
        const angle = Math.atan2(vy, vx) * (180 / Math.PI);
        const stretch = Math.min(speed * 0.015, 0.35);

        let transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
        if (cursorType === 'default' && speed > 2) {
          transform += ` rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.5})`;
        }
        reticleRef.current.style.transform = transform;
      }

      // Render physical ballistic sparks
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && sparks.current.length > 0) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = sparks.current.length - 1; i >= 0; i--) {
          const s = sparks.current[i];
          s.life++;
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.12; // Gravity
          s.vx *= 0.96; // Air drag
          s.vy *= 0.96;
          s.alpha = 1 - s.life / s.maxLife;

          if (s.life >= s.maxLife) {
            sparks.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.fillStyle = s.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(updateCursor);
    };

    animId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [cursorType]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none" aria-hidden="true">
      {/* Physical Particle Sparks Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />

      {/* Dual Expanding Sonic Click Shockwaves */}
      {clickRipples.map((ripple) => (
        <React.Fragment key={ripple.id}>
          <div
            className="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '44px',
              height: '44px',
              border: '2px solid rgba(255, 138, 0, 0.85)',
              boxShadow: '0 0 16px rgba(255, 138, 0, 0.6), inset 0 0 10px rgba(0, 240, 255, 0.4)',
              animationDuration: '0.65s',
            }}
          />
          <div
            className="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '24px',
              height: '24px',
              border: '1.5px solid rgba(0, 240, 255, 0.9)',
              animationDuration: '0.45s',
            }}
          />
        </React.Fragment>
      ))}

      {/* 1. Precision Laser Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full will-change-transform pointer-events-none transition-[width,height,background-color] duration-150"
        style={{
          width: cursorType === 'pointer' ? '6px' : '5px',
          height: cursorType === 'pointer' ? '6px' : '5px',
          backgroundColor: cursorType === 'pointer' ? '#00F0FF' : '#FF8A00',
          boxShadow:
            cursorType === 'pointer'
              ? '0 0 12px #00F0FF, 0 0 4px #FFFFFF'
              : '0 0 10px #FF8A00, 0 0 4px #FFA800',
        }}
      />

      {/* 2. Adaptive Multi-State Reticle / Halo */}
      <div
        ref={reticleRef}
        className="fixed top-0 left-0 will-change-transform pointer-events-none flex items-center justify-center transition-[width,height,opacity,border-color] duration-200"
        style={{
          width: cursorType === 'project' ? '76px' : cursorType === 'pointer' ? '46px' : '30px',
          height: cursorType === 'project' ? '76px' : cursorType === 'pointer' ? '46px' : '30px',
        }}
      >
        {/* State A: Default Ambient Ring */}
        {cursorType === 'default' && (
          <div className="w-full h-full rounded-full border border-orange-500/35 bg-orange-500/5 backdrop-blur-[1px] shadow-[0_0_10px_rgba(255,138,0,0.15)]" />
        )}

        {/* State B: Tactical Target Reticle (4 Brackets [ · ]) */}
        {cursorType === 'pointer' && (
          <div className="relative w-full h-full animate-[spin_8s_linear_infinite]">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />
            {/* Center Reticle Pulse */}
            <div className="absolute inset-1 rounded-full border border-cyan-400/20 bg-cyan-400/10" />
          </div>
        )}

        {/* State C: Project Lens Reveal HUD */}
        {cursorType === 'project' && (
          <div className="relative w-full h-full rounded-full border border-[#FF8A00] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-1 shadow-[0_0_20px_rgba(255,138,0,0.4)]">
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#FF8A00] flex items-center gap-0.5">
              EXPLORE
            </span>
            <span className="text-[8px] font-mono text-cyan-300">↗ OPEN</span>
          </div>
        )}

        {/* State D: Terminal Cyber Prompt */}
        {cursorType === 'terminal' && (
          <div className="px-2 py-1 rounded bg-black/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-400 flex items-center gap-1 shadow-lg shadow-emerald-500/20">
            <span>&gt;_</span>
            <span className="w-1.5 h-3 bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
