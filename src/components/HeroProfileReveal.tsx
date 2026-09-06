import React, { useState, useRef } from 'react';
import { Sparkles, ShieldCheck, MapPin, GraduationCap, GitBranch, Scan, Eye, Check } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

export const HeroProfileReveal: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const triggerReveal = () => {
    sounds.playWarp();
    setIsScanning(true);
    setIsRevealed((prev) => !prev);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FF8A00', '#00F0FF', '#FFFFFF'],
    });

    setTimeout(() => {
      setIsScanning(false);
      sounds.playSuccess();
    }, 800);
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4 select-none">
      
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent rounded-3xl blur-3xl pointer-events-none transform -rotate-3 scale-95" />

      {/* Floating Orbit Badge 1: Top-Right Available */}
      <div className="absolute -top-3 -right-2 sm:-right-4 z-20 animate-bounce duration-1000 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 shadow-xl backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-mono text-emerald-300 font-semibold tracking-wide">
          Available 2025/26
        </span>
      </div>

      {/* Floating Orbit Badge 2: Bottom-Left RAIT */}
      <div className="absolute -bottom-3 -left-2 sm:-left-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-white/10 shadow-xl backdrop-blur-md text-xs font-mono text-slate-300">
        <GraduationCap className="w-3.5 h-3.5 text-[#FF8A00]" />
        <span>B.Tech @ RAIT</span>
      </div>

      {/* 3D Tilt Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={triggerReveal}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="relative w-72 sm:w-80 h-[380px] sm:h-[420px] rounded-3xl p-3 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/20 shadow-2xl backdrop-blur-xl cursor-pointer group overflow-hidden"
      >
        {/* Dynamic Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
          }}
        />

        {/* Outer Laser Scanline Animation */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#FF8A00] to-transparent shadow-[0_0_15px_#FF8A00] animate-scanline z-40" />
        )}

        {/* Photo Box */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
          
          {/* Main Photo Image */}
          <img
            src="https://avatars.githubusercontent.com/u/142213284?v=4"
            alt="Asmit Jogdand (SmitroniX)"
            className={`w-full h-full object-cover transition-all duration-700 ${
              isRevealed
                ? 'scale-105 filter brightness-105 contrast-110 saturate-110'
                : 'scale-100 filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105'
            }`}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

          {/* Holographic HUD Grid overlay when revealed */}
          {isRevealed && (
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-black/60 pointer-events-none flex flex-col justify-between p-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#FF8A00] bg-black/60 px-2.5 py-1 rounded-md border border-orange-500/30 backdrop-blur-md">
                <span>IDENTITY // VERIFIED</span>
                <span>ASMIT_JOGDAND</span>
              </div>

              <div className="space-y-1 bg-black/75 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5" /> Full Stack &amp; Cloud Architect
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  B.Tech CE • Naviotech Intern • Hypixel Plugin Dev
                </div>
              </div>
            </div>
          )}

          {/* Bottom Identity Card Banner */}
          {!isRevealed && (
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white font-display">
                  Asmit Jogdand
                </div>
                <div className="text-[11px] font-mono text-[#FF8A00]">
                  @SmitroniX
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-1 rounded-lg">
                <Eye className="w-3 h-3 text-[#FF8A00]" />
                <span>Tap to Reveal</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Interactive Trigger Button Below Photo */}
      <button
        onClick={triggerReveal}
        className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-md active:scale-95"
      >
        <Scan className="w-3.5 h-3.5 text-[#FF8A00]" />
        <span>{isRevealed ? 'Reset Portrait View' : 'Heroic Shutter Reveal'}</span>
      </button>

    </div>
  );
};
