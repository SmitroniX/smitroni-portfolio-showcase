import React from 'react';
import { ArrowUp, Terminal, Heart, ShieldCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sounds.playWarp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-800/80 bg-[#040609] pt-12 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          
          {/* Logo & Tagline */}
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 font-mono text-lg font-bold">
              <span className="text-[#FF6B00]">&lt;</span>
              <span className="text-white font-black tracking-wider uppercase">
                Smitroni<span className="text-[#FF6B00]">X</span>
              </span>
              <span className="text-[#FF6B00]">/&gt;</span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Architecting cloud systems, scalable bots, and high-performance web realities.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sounds.playHover()}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-[#FF6B00] transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sounds.playHover()}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#00F0FF] hover:border-[#00F0FF] transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              onMouseEnter={() => sounds.playHover()}
              className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#FF8A00] hover:bg-[#FF6B00] hover:text-black transition-all flex items-center gap-1 text-xs font-mono"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline">WARP_TOP</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Asmit Jogdand.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Designed & Engineered with</span>
            <span className="text-[#FF6B00]">⚡</span>
            <span>by Asmit (SmitroniX)</span>
          </div>

          <div className="text-emerald-500/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>ENCRYPTED // HIGH FIDELITY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
