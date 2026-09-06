import React, { useEffect, useRef } from 'react';
import { X, Terminal } from 'lucide-react';
import { sounds } from '../utils/sound';

interface MatrixRainProps {
  active: boolean;
  onClose: () => void;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ active, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const characters = 'SMITRONIX0123456789ABCDEF$#@%&*+-/<>{}[]=~|^λπΩ';
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const render = () => {
      // Semi-transparent black to create fading trail
      ctx.fillStyle = 'rgba(5, 7, 11, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Lead character is bright white or orange, rest are matrix neon
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#FF6B00';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FF6B00';
        } else if (Math.random() > 0.5) {
          ctx.fillStyle = '#00FF9D';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00FF9D';
        } else {
          ctx.fillStyle = '#00F0FF';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#00F0FF';
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        ctx.shadowBlur = 0;

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#05070B]/85 backdrop-blur-md transition-opacity duration-300">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* HUD Header Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-full bg-slate-900/90 border border-[#FF6B00]/40 shadow-2xl backdrop-blur-lg">
        <Terminal className="w-5 h-5 text-[#FF6B00] animate-pulse" />
        <span className="text-xs md:text-sm font-mono tracking-widest text-[#00FF9D] font-bold">
          SMITRIX MATRIX SIMULATION // ACTIVE
        </span>
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="ml-4 p-1.5 rounded-full bg-slate-800 hover:bg-[#FF6B00] text-slate-300 hover:text-black transition-colors"
          title="Exit Matrix Simulation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs font-mono text-slate-400 bg-black/60 px-4 py-2 rounded-lg border border-slate-800">
        Click <span className="text-[#FF6B00]">Exit</span> or press <span className="text-[#00F0FF]">ESC</span> to return to portfolio
      </div>
    </div>
  );
};
