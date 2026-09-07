import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Command, Terminal, Skull } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenCompiler: () => void;
  onOpenDarkSide?: () => void;
  onReplayHello?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette, onOpenCompiler, onOpenDarkSide, onReplayHello }) => {
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    sounds.playClick();
    const next = logoClicks + 1;
    if (next >= 5) {
      setLogoClicks(0);
      sounds.playAlarm();
      if (onOpenDarkSide) onOpenDarkSide();
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = sounds.toggleSound();
    setSoundOn(newState);
  };

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'DevOps', href: '#devops' },
    { name: 'Stack', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#06090E]/80 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Identity Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-slate-900 flex items-center justify-center text-xs font-bold font-mono text-[#FF8A00] hover:border-[#FF8A00]/50 transition-colors cursor-pointer group"
            title="Asmit Jogdand (Click 5x to trigger secret)"
          >
            AJ
          </button>
          <a
            href="#"
            onClick={() => sounds.playClick()}
            className="flex flex-col group"
          >
            <span className="text-sm font-bold text-white tracking-tight group-hover:text-slate-200 transition-colors">
              Asmit Jogdand
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              @SmitroniX
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => sounds.playClick()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {link.name}
            </a>
          ))}

          {/* Standalone Compiler Page Link */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCompiler();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all ml-1"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Online Compiler</span>
          </button>
        </nav>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2">
          {/* Apple Hello Intro Trigger */}
          {onReplayHello && (
            <button
              onClick={() => {
                sounds.playClick();
                onReplayHello();
              }}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all group"
              title="Replay Apple Hello Welcome Animation"
            >
              <span className="font-serif italic text-xs tracking-wider text-slate-200 group-hover:text-amber-400 transition-colors">hello.</span>
            </button>
          )}

          {/* Command Palette Trigger */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenCommandPalette();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-colors"
            title="Search & commands (⌘K)"
          >
            <Command className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">⌘K</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title={soundOn ? 'Mute micro-interactions' : 'Enable audio feedback'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#FF8A00]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Direct Social Links */}
          <a
            href={PERSONAL_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className="hidden sm:inline-flex p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="GitHub"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>

          <a
            href={PERSONAL_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className="hidden sm:inline-flex p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
          </a>

          {/* Get in Touch CTA */}
          <a
            href="#contact"
            onClick={() => sounds.playClick()}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-medium text-xs transition-colors"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#06090E]/95 border-b border-white/10 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(false);
              }}
              className="block py-1.5 text-sm text-slate-300 hover:text-white"
            >
              {link.name}
            </a>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCompiler();
            }}
            className="w-full flex items-center justify-between py-2 text-xs font-mono text-emerald-400 border-t border-white/5"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Launch Online Compiler
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px]">NEW</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCommandPalette();
            }}
            className="w-full flex items-center justify-between py-2 text-xs font-mono text-slate-300 border-t border-white/5"
          >
            <span>Search &amp; Command Palette</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10">⌘K</span>
          </button>

          {onReplayHello && (
            <button
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(false);
                onReplayHello();
              }}
              className="w-full flex items-center justify-between py-2 text-xs text-slate-300 hover:text-white border-t border-white/5"
            >
              <span className="flex items-center gap-2">
                <span className="font-serif italic text-sm text-amber-400">hello.</span>
                <span>Apple Welcome Intro</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">Replay</span>
            </button>
          )}

          {onOpenDarkSide && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                sounds.playAlarm();
                onOpenDarkSide();
              }}
              className="w-full flex items-center justify-between py-2 text-xs font-mono text-red-400 border-t border-white/5"
            >
              <span className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-500 animate-pulse" /> The Dark Side [Classified]
              </span>
              <span className="px-1.5 py-0.5 rounded bg-red-600/20 text-[10px] text-red-300 font-bold border border-red-500/30">
                RESTRICTED
              </span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
