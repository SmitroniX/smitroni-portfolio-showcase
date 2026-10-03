import React, { useState, useEffect } from 'react';
import { ArrowRight, Copy, Check, Terminal, MapPin, Clock, ExternalLink, FileDown, ShieldCheck, GraduationCap } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { HeroProfileReveal } from './HeroProfileReveal';
import { sounds } from '../utils/sound';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState('');

  // Live Mumbai Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    sounds.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Soft subtle radial ambient backdrop */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Grid: Left Content + Right Heroic Profile Reveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Headlines & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for SWE Internships</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 backdrop-blur-md">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>CGPA 8.65 • RAIT Mumbai</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Captain • HTB #331386</span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
                Hey, I&apos;m{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  Asmit Jogdand
                </span>
                .
              </h1>

              <p className="text-xl sm:text-2xl text-slate-300 font-normal leading-snug">
                Full-stack software engineer &amp; systems builder in Mumbai. Known online as{' '}
                <span className="text-[#FF8A00] font-semibold">@SmitroniX</span>.
              </p>
            </div>

            <p className="text-base text-slate-400 leading-relaxed font-sans max-w-xl">
              Computer Engineering undergraduate at <span className="text-slate-200 font-medium">Ramrao Adik Institute of Technology (RAIT)</span>. 
              I engineer low-latency systems like <span className="text-slate-200 font-medium">ShadowLauncher</span> (native 138 FPS gaming core), campus platforms like <span className="text-slate-200 font-medium">DYPU Connect</span>, 
              and privacy-first apps like <span className="text-slate-200 font-medium">SmiTriX</span>.
            </p>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                onClick={() => sounds.playClick()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-medium text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Direct Resume Download Button */}
              <a
                href={PERSONAL_INFO.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Asmit_Jogdand_Resume.pdf"
                onClick={() => sounds.playClick()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF8A00] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0"
                title="Download Official Asmit Jogdand Resume (PDF)"
              >
                <FileDown className="w-4 h-4" />
                <span>Resume (PDF)</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/10 hover:border-white/20 text-slate-200 text-sm font-medium transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  sounds.playWarp();
                  onOpenTerminal();
                }}
                className="inline-flex items-center gap-2 px-3.5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 text-slate-300 text-sm font-mono transition-all"
                title="Open Command Palette"
              >
                <Terminal className="w-4 h-4 text-[#FF8A00]" />
                <span className="hidden sm:inline">⌘K</span>
              </button>
            </div>

          </div>

          {/* Right Column: Heroic Profile Reveal Card (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HeroProfileReveal />
          </div>

        </div>

        {/* Hero Bento Grid: Personal Snapshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Bento 1: Live Mumbai Clock & Location */}
          <SpotlightCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" /> Mumbai, IN
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5" /> IST
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono tracking-tight text-white">
                {time || 'Loading...'}
              </div>
              <p className="text-xs text-slate-400">
                UTC+5:30 • Usually hacking, building, or reviewing PRs
              </p>
            </div>
          </SpotlightCard>

          {/* Bento 2: Academic & CTF Merit */}
          <SpotlightCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="flex items-center gap-1.5 text-amber-400">
                <GraduationCap className="w-3.5 h-3.5" /> Academic &amp; CTF
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                TOP TIER
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
                <span>8.65</span>
                <span className="text-xs font-normal text-slate-400 font-sans">CGPA (Sem 1: 8.80)</span>
              </div>
              <p className="text-xs text-slate-400">
                RAIT Mumbai • HTB Team #331386 Founding Captain
              </p>
            </div>
          </SpotlightCard>

          {/* Bento 3: Currently Building */}
          <SpotlightCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active Focus
              </span>
              <span className="text-[11px] text-slate-500 font-mono">v2 Engine</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white truncate">
                {PERSONAL_INFO.currently.building}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                Native C/C++ graphics translation, 138 FPS mobile HUD, and distributed campus microservices.
              </p>
            </div>
          </SpotlightCard>

          {/* Bento 4: GitHub Pulse */}
          <SpotlightCard className="p-5 flex flex-col justify-between group">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
              <span className="flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-slate-300" /> GitHub
              </span>
              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Asmit Jogdand GitHub Profile (@SmitroniX)"
                title="View Asmit Jogdand GitHub Repositories (@SmitroniX)"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
                <span>52+</span>
                <span className="text-xs font-normal text-slate-400 font-sans">Repositories</span>
              </div>
              <p className="text-xs text-slate-400">
                Systems engines, open-source utilities, and 99.9% uptime bots.
              </p>
            </div>
          </SpotlightCard>

        </div>

      </div>
    </section>
  );
};
