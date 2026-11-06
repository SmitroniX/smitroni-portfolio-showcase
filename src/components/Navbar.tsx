import React, { useState, useEffect } from 'react';
import { Menu, X, Command, FileDown, ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenCompiler: () => void;
  onOpenDarkSide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  onOpenCompiler,
  onOpenDarkSide,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    if (next >= 5) {
      setLogoClicks(0);
      if (onOpenDarkSide) onOpenDarkSide();
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Stack', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 pointer-events-none transition-all duration-300">
      <div
        className={`max-w-4xl mx-auto rounded-full pointer-events-auto transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between ${
          scrolled
            ? 'bg-[#070A11]/85 border border-white/[0.12] backdrop-blur-xl shadow-2xl shadow-black/80'
            : 'bg-[#070A11]/60 border border-white/[0.06] backdrop-blur-md'
        }`}
      >
        {/* Brand / Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold font-mono text-cyan-400 hover:border-cyan-400 transition-colors cursor-pointer group"
            title="Asmit Jogdand (Click 5x to trigger secret)"
          >
            AJ
          </button>
          <a href="#" className="flex flex-col group">
            <span className="text-xs sm:text-sm font-semibold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
              Asmit Jogdand
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              @SmitroniX
            </span>
          </a>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {/* Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-mono text-slate-300 transition-all cursor-pointer"
            title="Open Command Palette (Cmd+K)"
          >
            <Command className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px]">⌘K</span>
          </button>

          {/* Direct Resume Download */}
          <a
            href={PERSONAL_INFO.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.12] text-xs font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Resume</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white md:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-sm mx-auto p-4 rounded-2xl bg-[#070A11]/95 border border-white/10 backdrop-blur-2xl shadow-2xl pointer-events-auto flex flex-col space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="flex items-center gap-2 text-xs font-mono text-cyan-400 py-1"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Command Palette (⌘K)</span>
            </button>
            <a
              href={PERSONAL_INFO.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-white bg-white/10 px-3 py-1.5 rounded-full"
            >
              Resume PDF
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
