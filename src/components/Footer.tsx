import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sounds.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#05070B] py-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-white text-base">
              <span>Asmit Jogdand</span>
              <span className="text-xs font-mono text-[#FF8A00] font-normal">@SmitroniX</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Full-stack software engineer &amp; computer engineering student at RAIT, Mumbai.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Top</span>
            </button>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-sans">
          <div>
            © {new Date().getFullYear()} Asmit Jogdand. Built with React, TypeScript &amp; Tailwind CSS.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Mumbai, India • Crafted with attention to detail</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
