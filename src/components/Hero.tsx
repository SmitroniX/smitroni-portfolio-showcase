import React, { useState, useEffect } from 'react';
import { Terminal, ArrowRight, ShieldCheck, Cpu, Code2, Globe, Sparkles, Download } from 'lucide-react';
import { sounds } from '../utils/sound';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentRole = PERSONAL_INFO.roles[roleIndex];
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === currentRole) {
      typingSpeed = 2000; // Pause at end of text
      const timeout = setTimeout(() => setIsDeleting(true), typingSpeed);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % PERSONAL_INFO.roles.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting ? currentRole.substring(0, prev.length - 1) : currentRole.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF6B00]/15 via-orange-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/30 text-xs font-mono backdrop-blur-md shadow-[0_0_15px_rgba(255,107,0,0.15)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">SYS_STATUS:</span>
              <span className="text-[#FF6B00] font-bold">ONLINE</span>
              <span className="text-slate-600">|</span>
              <span className="text-[#00F0FF] hidden sm:inline">MUMBAI, IN</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-400 hidden sm:inline">RAIT • DYPU</span>
            </div>

            {/* Main Name & Title */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-mono tracking-widest text-[#FF8A00] uppercase font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                Identity Protocol // Verified Engineer
              </p>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-display uppercase">
                Asmit <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8A00] to-amber-300">Jogdand</span>
              </h1>

              {/* Dynamic Typewriter Box */}
              <div className="h-12 sm:h-14 flex items-center font-mono text-xl sm:text-3xl text-slate-200">
                <span className="text-[#00F0FF] mr-3">&gt;</span>
                <span className="text-white font-bold tracking-wide">
                  {displayText}
                </span>
                <span className="inline-block w-2.5 h-6 ml-1.5 bg-[#FF6B00] animate-pulse" />
              </div>
            </div>

            {/* Bio Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans">
              B.Tech in Computer Engineering at <span className="text-[#FF6B00] font-semibold">Ramrao Adik Institute of Technology (RAIT)</span>. 
              Engineering scalable cloud architectures, high-concurrency microservices, AI CLI agents, and interactive web realities.
            </p>

            {/* Core Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#projects"
                onClick={() => sounds.playClick()}
                onMouseEnter={() => sounds.playHover()}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-black font-bold font-mono text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(255,107,0,0.4)] hover:shadow-[0_0_35px_rgba(255,107,0,0.7)] hover:scale-105 active:scale-95"
              >
                <span>Holo-Vault</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>

              <button
                onClick={() => {
                  sounds.playWarp();
                  onOpenTerminal();
                }}
                onMouseEnter={() => sounds.playHover()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-orange-500/40 hover:border-[#FF6B00] text-slate-200 hover:text-white font-mono text-sm tracking-wide transition-all shadow-lg active:scale-95 group"
              >
                <Terminal className="w-4 h-4 text-[#00F0FF] group-hover:rotate-12 transition-transform" />
                <span>Command CLI</span>
                <span className="px-1.5 py-0.5 rounded bg-black/60 border border-slate-700 text-[11px] text-slate-400 font-mono">
                  Ctrl+K
                </span>
              </button>

              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                onMouseEnter={() => sounds.playHover()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white font-mono text-sm transition-all"
              >
                <span>LinkedIn</span>
                <span className="text-[#00F0FF]">↗</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              {PERSONAL_INFO.metrics.map((metric, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white flex items-baseline gap-1">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-amber-400">
                      {metric.value}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-200 tracking-wider">
                    {metric.label}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {metric.detail}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Interactive 3D Cyber Emblem / Hologram Card */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm cyber-card rounded-2xl p-6 relative overflow-hidden border border-orange-500/30 group">
              
              {/* Scanline effect */}
              <div className="scanline-overlay pointer-events-none" />

              {/* Glowing Corner Accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#FF6B00]" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#FF6B00]" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#FF6B00]" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#FF6B00]" />

              {/* Card Header HUD */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Cpu className="w-4 h-4 text-[#FF6B00]" />
                  <span>CORE.KERNEL // v4.2</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  OPTIMIZED
                </span>
              </div>

              {/* Visual Avatar / Emblem */}
              <div className="my-6 relative flex flex-col items-center">
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-[0_0_30px_rgba(255,107,0,0.3)] bg-gradient-to-b from-slate-900 to-black p-1 group-hover:border-[#00F0FF] transition-all">
                  <img
                    src="https://avatars.githubusercontent.com/u/142213284?v=4"
                    alt="Asmit Jogdand"
                    className="w-full h-full object-cover rounded-xl grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Digital overlay grid */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono text-orange-400">
                    <span>ASMIT_J</span>
                    <span>99.8%</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-sm font-mono font-bold text-white tracking-widest uppercase">
                    Asmit Jogdand
                  </div>
                  <div className="text-xs font-mono text-[#00F0FF]">
                    @SmitroniX
                  </div>
                </div>
              </div>

              {/* Quick specs */}
              <div className="space-y-2 text-xs font-mono pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-slate-400">
                  <span>Specialization:</span>
                  <span className="text-slate-200">Cloud & Full Stack</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Institute:</span>
                  <span className="text-[#FF8A00]">RAIT (DY Patil)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Favorite Stack:</span>
                  <span className="text-emerald-400">React • Node • Python</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-[#00F0FF]">Ready to Build ⚡</span>
                </div>
              </div>

              {/* Interactive Audio Trigger on Card */}
              <button
                onClick={() => {
                  sounds.playLaser();
                }}
                className="mt-5 w-full py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-mono text-[#FF8A00] flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transmit Neural Pulse</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
