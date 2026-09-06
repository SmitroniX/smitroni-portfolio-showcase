import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Terminal, Binary, Menu, X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { sounds } from '../utils/sound';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  onOpenTerminal: () => void;
  onToggleMatrix: () => void;
  matrixActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTerminal,
  onToggleMatrix,
  matrixActive,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = sounds.toggleSound();
    setSoundOn(newState);
  };

  const navLinks = [
    { name: 'Projects', href: '#projects', num: '01' },
    { name: 'Skills', href: '#skills', num: '02' },
    { name: 'Experience', href: '#experience', num: '03' },
    { name: 'Play Zone', href: '#playground', num: '04' },
    { name: 'Contact', href: '#contact', num: '05' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'bg-[#05070B]/85 backdrop-blur-md border-b border-orange-500/20 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={() => sounds.playClick()}
          onMouseEnter={() => sounds.playHover()}
          className="group flex items-center gap-2 font-mono text-lg sm:text-xl font-bold tracking-wider"
        >
          <span className="text-[#FF6B00] group-hover:text-[#00F0FF] transition-colors">&lt;</span>
          <span className="text-white tracking-widest font-black uppercase text-base sm:text-lg">
            Smitroni<span className="text-[#FF6B00] group-hover:text-[#00F0FF] transition-colors">X</span>
          </span>
          <span className="text-[#FF6B00] group-hover:text-[#00F0FF] transition-colors">/&gt;</span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded-full bg-orange-500/10 border border-orange-500/30 text-[#FF8A00]">
            v2.6
          </span>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => sounds.playHover()}
              onClick={() => sounds.playClick()}
              className="group px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <span className="text-[#FF6B00] text-[10px] group-hover:text-[#00F0FF] transition-colors">
                {link.num}.
              </span>
              <span className="tracking-wide">{link.name}</span>
            </a>
          ))}
        </nav>

        {/* Action HUD Buttons */}
        <div className="flex items-center gap-2">
          {/* Terminal Command Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => sounds.playHover()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-orange-500/30 hover:border-orange-500 text-xs font-mono text-slate-200 hover:text-[#FF6B00] shadow-sm transition-all group"
            title="Launch Terminal (Ctrl+K)"
          >
            <Terminal className="w-3.5 h-3.5 text-[#FF6B00] group-hover:rotate-12 transition-transform" />
            <span className="hidden lg:inline font-semibold">Terminal</span>
            <kbd className="px-1 py-0.2 bg-black/50 border border-slate-700 text-[10px] rounded text-slate-400">
              ^K
            </kbd>
          </button>

          {/* Matrix Mode Toggle */}
          <button
            onClick={() => {
              sounds.playWarp();
              onToggleMatrix();
            }}
            onMouseEnter={() => sounds.playHover()}
            className={`p-2 rounded-lg border text-xs transition-all ${
              matrixActive
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-[#00FF9D] hover:border-[#00FF9D]/40'
            }`}
            title="Toggle SmiTriX Matrix Mode"
          >
            <Binary className="w-4 h-4" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleSoundToggle}
            onMouseEnter={() => sounds.playHover()}
            className={`p-2 rounded-lg border text-xs transition-all ${
              soundOn
                ? 'bg-orange-500/20 border-orange-500/50 text-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.25)]'
                : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundOn ? 'Sound FX Enabled (Click to Mute)' : 'Sound FX Muted (Click to Unmute)'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Direct Social Shortcuts */}
          <a
            href={PERSONAL_INFO.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title="GitHub Profile"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href={PERSONAL_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => sounds.playHover()}
            onClick={() => sounds.playClick()}
            className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[#00F0FF] hover:bg-[#00F0FF]/10 hover:border-[#00F0FF]/40 transition-colors"
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#FF6B00]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070A0F]/95 border-b border-orange-500/20 backdrop-blur-xl px-6 py-6 transition-all">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  sounds.playClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between py-2 border-b border-slate-800/60 text-sm font-mono text-slate-300 hover:text-[#FF6B00]"
              >
                <span>{link.name}</span>
                <span className="text-xs text-[#FF6B00]">{link.num}</span>
              </a>
            ))}

            <button
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="flex items-center gap-2 py-2 text-sm font-mono text-[#00F0FF]"
            >
              <Terminal className="w-4 h-4" /> Launch Interactive Terminal
            </button>

            <div className="flex items-center gap-4 pt-4">
              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white"
              >
                <GithubIcon className="w-4 h-4 text-[#FF6B00]" /> GitHub
              </a>
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white"
              >
                <LinkedinIcon className="w-4 h-4 text-[#00F0FF]" /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
