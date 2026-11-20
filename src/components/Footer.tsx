import React, { useState, useEffect } from 'react';
import { ArrowUp, Terminal } from 'lucide-react';
import { sounds } from '../utils/sound';

interface FooterProps {
  onOpenTerminal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerminal }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now)
      );
    };
    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sounds.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-10 border-t border-white/[0.07] relative z-10 bg-[#05080F]/85 backdrop-blur-md text-xs font-mono text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Developer Signature */}
        <div className="flex items-center gap-2.5 text-center md:text-left">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00] shrink-0" />
          <span className="text-slate-300">
            © {new Date().getFullYear()} Asmit Jogdand (<span className="text-[#FF9E2C]">@SmitroniX</span>) — Engineered with React, Three.js &amp; Framer Motion.
          </span>
        </div>

        {/* Center: Live IST Clock */}
        <div className="flex items-center gap-3 text-slate-400">
          <span>
            Mumbai: <span className="text-white font-medium tabular-nums">{time || '--:--:--'}</span> IST
          </span>
          {onOpenTerminal && (
            <button
              type="button"
              onClick={onOpenTerminal}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-slate-300 hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              <Terminal className="w-3 h-3" />
              <span>⌘K</span>
            </button>
          )}
        </div>

        {/* Right: Back to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-[#FF6B00]/18 border border-white/[0.08] hover:border-[#FF6B00]/40 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
