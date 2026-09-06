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
import { sounds } from './utils/sound';
import { Terminal, ArrowRight, Play } from 'lucide-react';
import { SpotlightCard } from './components/SpotlightCard';

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
    sounds.playClick();
    setCurrentPage(page);
    if (page === 'compiler') {
      window.location.hash = '/compiler';
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.location.hash = '';
    }
  };

  // Global hotkeys (Cmd+K / Ctrl+K & secret 'darkside' sequence)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        sounds.playClick();
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
          sounds.playAlarm();
          setDarkSideOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, darkSideOpen]);

  // If viewing the standalone Programiz-style compiler page
  if (currentPage === 'compiler') {
    return <CompilerPage onBackToHome={() => navigateTo('portfolio')} />;
  }

  return (
    <div className="min-h-screen bg-[#06090E] text-slate-100 relative font-sans selection:bg-[#FF8A00] selection:text-black">
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* High-End Ambient 3D Three.js Backdrop */}
      <ThreeCanvas />

      {/* Subtle Dot Grid Background Pattern */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-0" />

      {/* Linear-Style Navbar */}
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenCompiler={() => navigateTo('compiler')}
        onOpenDarkSide={() => setDarkSideOpen(true)}
      />

      {/* Main Flow */}
      <main className="relative z-10">
        <Hero onOpenTerminal={() => setCommandPaletteOpen(true)} />
        <Projects />
        <DevOpsArchitecture />

        {/* Dedicated Standalone Compiler Showcase Card */}
        <section className="py-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SpotlightCard className="p-8 border border-white/10 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF8A00] uppercase font-bold">
                    <Terminal className="w-4 h-4" /> Standalone Cloud IDE
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                    Multi-Language Online Compiler
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    A full-screen, Programiz-style online code runner supporting Python, C++, Java, Rust, Go, JavaScript, and TypeScript with real cloud execution and latency telemetry.
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('compiler')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Online Compiler</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </SpotlightCard>
          </div>
        </section>

        <SkillsRadar />
        <ExperienceTimeline />
        <ContactSection />
      </main>

      {/* Minimal Footer with Secret Dark Side Trigger */}
      <Footer onOpenDarkSide={() => setDarkSideOpen(true)} />

      {/* Command Palette (⌘K) */}
      <TerminalModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenCompiler={() => navigateTo('compiler')}
        onOpenDarkSide={() => setDarkSideOpen(true)}
      />

      {/* Secret Easter Egg: The Dark Side Dossier Modal */}
      <DarkSideModal
        isOpen={darkSideOpen}
        onClose={() => setDarkSideOpen(false)}
      />
    </div>
  );
}

export default App;
