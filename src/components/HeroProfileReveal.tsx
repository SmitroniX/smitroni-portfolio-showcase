import React, { useState, useRef } from 'react';
import { Sparkles, ShieldCheck, MapPin, GraduationCap, GitBranch, Scan, Eye, Check, Cpu, Award } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Magnetic } from './Magnetic';

export const HeroProfileReveal: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -11;
    const rotateY = ((x - centerX) / centerX) * 11;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -11;
    const rotateY = ((x - centerX) / centerX) * 11;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const triggerReveal = () => {
    sounds.playWarp();
    setIsScanning(true);
    setIsRevealed((prev) => !prev);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#FF8A00', '#00F0FF', '#22C55E', '#FFFFFF'],
    });

    setTimeout(() => {
      setIsScanning(false);
      sounds.playSuccess();
    }, 800);
  };

  const foilAngle = Math.round((glarePos.x + glarePos.y) * 1.8);

  return (
    <div className="relative flex flex-col items-center justify-center py-4 select-none">
      {/* Background Ambient Plasma Aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 via-amber-500/10 to-cyan-500/15 rounded-3xl blur-3xl pointer-events-none transform -rotate-2 scale-95" />

      {/* Floating Magnetic Orbit Badge 1: Top-Right Available */}
      <div className="absolute -top-4 -right-2 sm:-right-5 z-30 hidden sm:block">
        <Magnetic strength={0.3} radius={70}>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-emerald-500/50 shadow-xl backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-emerald-300 font-semibold tracking-wide">
              CGPA 8.65 • Available 2026/27
            </span>
          </div>
        </Magnetic>
      </div>

      {/* Floating Magnetic Orbit Badge 2: Bottom-Left RAIT */}
      <div className="absolute -bottom-4 -left-2 sm:-left-6 z-30 hidden sm:block">
        <Magnetic strength={0.3} radius={70}>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-white/10 shadow-xl backdrop-blur-md text-xs font-mono text-slate-300">
            <GraduationCap className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span>B.E. Comp Engg @ RAIT</span>
          </div>
        </Magnetic>
      </div>

      {/* 3D Perspective Tilt Card Container */}
      <div
        ref={cardRef}
        onMouseMove={(e) => {
          setIsHovered(true);
          handleMouseMove(e);
        }}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => {
          setIsHovered(true);
          handleTouchMove(e);
        }}
        onTouchEnd={handleTouchEnd}
        onClick={triggerReveal}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
            : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="relative w-[290px] sm:w-[325px] h-[400px] sm:h-[440px] max-w-[92vw] rounded-3xl p-3 bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/20 shadow-2xl backdrop-blur-2xl cursor-pointer group overflow-hidden touch-pan-y"
      >
        {/* Holographic Rainbow Diffraction Foil Sheen */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl mix-blend-color-dodge transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0.15,
            background: `linear-gradient(${foilAngle}deg, transparent 20%, rgba(255, 0, 128, 0.2) 35%, rgba(0, 240, 255, 0.25) 50%, rgba(255, 138, 0, 0.2) 65%, transparent 80%)`,
          }}
        />

        {/* Dynamic Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-200 rounded-3xl"
          style={{
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.22) 0%, transparent 80%)`,
          }}
        />

        {/* Outer Laser Scanline Animation */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#FF8A00] to-transparent shadow-[0_0_20px_#FF8A00] animate-scanline z-40" />
        )}

        {/* Card Perimeter Laser Border */}
        {isHovered && (
          <div className="laser-border-tracer pointer-events-none absolute inset-0 rounded-3xl z-30" />
        )}

        {/* Layer 1: Inner 3D Photo Box (translateZ 15px) */}
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950"
          style={{ transform: 'translateZ(15px)' }}
        >
          {/* Main Photo Image */}
          <img
            src="https://avatars.githubusercontent.com/u/142213284?v=4"
            alt="Asmit Jogdand (SmitroniX)"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%230f172a'/><circle cx='100' cy='75' r='40' fill='%23f97316'/><path d='M30 180 C30 130, 170 130, 170 180' fill='%23334155'/></svg>";
            }}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isRevealed
                ? 'scale-105 filter brightness-105 contrast-110 saturate-110'
                : 'scale-100 filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105'
            }`}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

          {/* Cyber Serial Watermark & Barcode Stamp */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md pointer-events-none z-20">
            <span className="text-[#FF8A00] font-bold">SEC_ID // 0x8F94B</span>
            <div className="flex items-center gap-0.5">
              <span className="w-0.5 h-2.5 bg-slate-400" />
              <span className="w-1 h-2.5 bg-slate-400" />
              <span className="w-0.5 h-2.5 bg-slate-400" />
              <span className="w-1.5 h-2.5 bg-slate-400" />
              <span className="w-0.5 h-2.5 bg-slate-400" />
            </div>
            <span>MUMBAI_IN</span>
          </div>

          {/* Holographic HUD Grid overlay when revealed */}
          {isRevealed && (
            <div
              className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-black/80 pointer-events-none flex flex-col justify-between p-4 z-20"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-[#FF8A00] bg-black/75 px-3 py-1.5 rounded-lg border border-orange-500/40 backdrop-blur-md shadow-lg">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> CLEARANCE LEVEL 5
                </span>
                <span>ASMIT_JOGDAND</span>
              </div>

              <div className="space-y-2 bg-black/80 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="text-[12px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Award className="w-4 h-4 text-[#FF8A00]" /> Full Stack &amp; Systems Engineer
                </div>
                <div className="text-[10px] text-slate-300 font-mono leading-relaxed">
                  CGPA 8.65 • RAIT Mumbai • Naviotech Intern • Captain HTB #331386
                </div>
              </div>
            </div>
          )}

          {/* Bottom Identity Card Banner when not revealed */}
          {!isRevealed && (
            <div
              className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md flex items-center justify-between z-20"
              style={{ transform: 'translateZ(25px)' }}
            >
              <div>
                <div className="text-sm font-bold text-white font-display">
                  Asmit Jogdand
                </div>
                <div className="text-[11px] font-mono text-[#FF8A00] font-semibold">
                  @SmitroniX
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <Eye className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Tap to Reveal</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Trigger Button Below Photo */}
      <Magnetic strength={0.25} radius={60}>
        <button
          onClick={triggerReveal}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-lg active:scale-95 group"
        >
          <Scan className="w-3.5 h-3.5 text-[#FF8A00] group-hover:rotate-45 transition-transform" />
          <span>{isRevealed ? 'Reset Portrait View' : 'Heroic Shutter Reveal'}</span>
        </button>
      </Magnetic>
    </div>
  );
};
