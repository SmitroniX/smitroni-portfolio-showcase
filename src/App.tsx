import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { DevOpsArchitecture } from './components/DevOpsArchitecture';
import { SkillsRadar } from './components/SkillsRadar';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ThreeCanvas } from './components/ThreeCanvas';
import { CustomCursor } from './components/CustomCursor';
import { TerminalModal } from './components/TerminalModal';
import { DarkSideModal } from './components/DarkSideModal';
import { CompilerPage } from './pages/CompilerPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<'portfolio' | 'compiler'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash.includes('compiler') || path.includes('compiler')) {
        return 'compiler';
      }
    }
    return 'portfolio';
  });

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [darkSideOpen, setDarkSideOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.includes('darkside') || window.location.hash.includes('classified');
    }
    return false;
  });

  const keySequenceRef = React.useRef<string>('');

  // Sync route with URL hash & popstate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('compiler')) {
        setCurrentPage('compiler');
      } else {
        setCurrentPage('portfolio');
      }
      if (hash.includes('darkside') || hash.includes('classified')) {
        setDarkSideOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigateTo = (page: 'portfolio' | 'compiler') => {
    setCurrentPage(page);
    if (page === 'compiler') {
      window.location.hash = '/compiler';
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.location.hash = '';
    }
  };

  // Global hotkeys (Cmd+K / Ctrl+K, ESC, & secret 'darkside' sequence)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (darkSideOpen) {
          setDarkSideOpen(false);
        } else if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
        }
      }

      // Secret sequence detection (typing "darkside", "blackhat", or "cheat")
      if (!['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        keySequenceRef.current = (keySequenceRef.current + e.key.toLowerCase()).slice(-10);
        if (
          keySequenceRef.current.includes('darkside') ||
          keySequenceRef.current.includes('blackhat') ||
          keySequenceRef.current.includes('cheat')
        ) {
          keySequenceRef.current = '';
          setDarkSideOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, darkSideOpen]);

  // Standalone Cloud Compiler / IDE Page
  if (currentPage === 'compiler') {
    return <CompilerPage onBackToHome={() => navigateTo('portfolio')} />;
  }

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 relative font-sans selection:bg-cyan-500 selection:text-black">
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* 60FPS Ambient Particle Wavefront Engine */}
      <ThreeCanvas />

      {/* Floating Glassmorphic Navbar */}
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenCompiler={() => navigateTo('compiler')}
        onOpenDarkSide={() => setDarkSideOpen(true)}
      />

      {/* Main Content Flow */}
      <main className="relative z-10">
        <Hero onOpenTerminal={() => setCommandPaletteOpen(true)} />
        <Projects />
        <DevOpsArchitecture />
        <SkillsRadar />
        <ExperienceTimeline />
        <ContactSection />
      </main>

      {/* Minimalist Footer */}
      <Footer />

      {/* Command Palette Modal (Cmd+K) */}
      <TerminalModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenCompiler={() => navigateTo('compiler')}
        onOpenDarkSide={() => setDarkSideOpen(true)}
      />

      {/* Secret Cyber Dossier Modal (Easter Egg) */}
      {darkSideOpen && (
        <DarkSideModal isOpen={darkSideOpen} onClose={() => setDarkSideOpen(false)} />
      )}
    </div>
  );
}
export default App;
