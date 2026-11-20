import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Command, FileDown, Code2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenCompiler: () => void;
  onOpenDarkSide?: () => void;
}

const NAV_LINKS = [
  { id: 'projects', name: 'Projects', href: '#projects' },
  { id: 'architecture', name: 'Architecture', href: '#architecture' },
  { id: 'skills', name: 'Skills', href: '#skills' },
  { id: 'experience', name: 'Experience', href: '#experience' },
  { id: 'contact', name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  onOpenCompiler,
  onOpenDarkSide,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [logoClicks, setLogoClicks] = useState(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track currently visible section for sliding active pill
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleLogoClick = () => {
    sounds.playClick();
    const next = logoClicks + 1;
    if (next >= 5) {
      setLogoClicks(0);
      if (onOpenDarkSide) onOpenDarkSide();
    } else {
      setLogoClicks(next);
      window.setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  return (
    <>
      {/* Scroll-Driven Telemetry Progress Rail */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left bg-gradient-to-r from-[#FF6B00] via-[#FF9E2C] to-[#00F0FF] shadow-[0_0_12px_rgba(255,107,0,0.7)] pointer-events-none"
      />

      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3.5 pointer-events-none"
      >
        <div
          className={`max-w-5xl mx-auto rounded-full pointer-events-auto transition-all duration-300 px-3 sm:px-5 py-2 flex items-center justify-between ${
            scrolled
              ? 'bg-[#070A12]/90 border border-white/[0.12] backdrop-blur-xl shadow-2xl shadow-black/80'
              : 'bg-[#070A12]/65 border border-white/[0.07] backdrop-blur-md'
          }`}
        >
          {/* Brand / Identity */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleLogoClick}
              aria-label="Asmit Jogdand emblem"
              className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B00]/25 to-[#00F0FF]/15 border border-[#FF6B00]/40 flex items-center justify-center text-xs font-bold font-mono text-[#FF8A00] hover:border-[#FF8A00] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Asmit Jogdand (Click 5x for secret dossier)"
            >
              AJ
              {logoClicks > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF6B00] text-[9px] text-black font-bold flex items-center justify-center">
                  {logoClicks}
                </span>
              )}
            </button>
            <a href="#" className="flex flex-col group">
              <span className="text-xs sm:text-sm font-display font-bold text-white tracking-tight group-hover:text-[#FF8A00] transition-colors">
                Asmit Jogdand
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                @SmitroniX
              </span>
            </a>
          </div>

          {/* Desktop Navigation with Sliding Spring Pill */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onMouseEnter={() => sounds.playHover()}
                  onClick={() => {
                    sounds.playClick();
                    setActiveSection(link.id);
                  }}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavPill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white/[0.09] border border-[#FF8A00]/30 -z-10"
                    />
                  )}
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Developer Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Launch Built-in Cloud IDE */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenCompiler();
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6B00]/12 hover:bg-[#FF6B00]/22 border border-[#FF6B00]/35 text-xs font-mono text-[#FF9E2C] hover:text-white transition-all cursor-pointer"
              title="Launch Code With SmitroniX Cloud IDE"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Cloud IDE</span>
            </button>

            {/* Command Palette / Shell Trigger */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenCommandPalette();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.11] border border-white/[0.09] text-xs font-mono text-slate-300 transition-all cursor-pointer"
              title="Open Command Palette & Shell (Cmd+K)"
            >
              <Command className="w-3 h-3 text-[#00F0FF]" />
              <span className="text-[10px]">⌘K</span>
            </button>

            {/* Direct Resume Download */}
            <a
              href={PERSONAL_INFO.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-950 hover:bg-[#FF8A00] hover:text-black text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white md:hidden cursor-pointer"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden mt-2 max-w-sm mx-auto p-3.5 rounded-2xl bg-[#070A12]/96 border border-white/12 backdrop-blur-2xl shadow-2xl pointer-events-auto flex flex-col gap-1.5"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => {
                    sounds.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? 'bg-[#FF6B00]/15 text-[#FF9E2C] border border-[#FF6B00]/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-2 mt-1 border-t border-white/10 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCompiler();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 text-xs font-mono text-[#FF9E2C]"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Cloud IDE</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCommandPalette();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-mono text-[#00F0FF]"
                >
                  <Command className="w-3.5 h-3.5" />
                  <span>Shell (⌘K)</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
