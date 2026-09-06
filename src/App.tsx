import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { DevOpsArchitecture } from './components/DevOpsArchitecture';
import { OnlineCompiler } from './components/OnlineCompiler';
import { SkillsRadar } from './components/SkillsRadar';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ThreeCanvas } from './components/ThreeCanvas';
import { CustomCursor } from './components/CustomCursor';
import { TerminalModal } from './components/TerminalModal';
import { sounds } from './utils/sound';

export function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global hotkeys (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        sounds.playClick();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen]);

  return (
    <div className="min-h-screen bg-[#06090E] text-slate-100 relative font-sans selection:bg-[#FF8A00] selection:text-black">
      {/* Precision Custom Cursor */}
      <CustomCursor />

      {/* High-End Ambient 3D Three.js Backdrop */}
      <ThreeCanvas />

      {/* Subtle Dot Grid Background Pattern */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-0" />

      {/* Linear-Style Navbar */}
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* Main Flow */}
      <main className="relative z-10">
        <Hero onOpenTerminal={() => setCommandPaletteOpen(true)} />
        <Projects />
        <DevOpsArchitecture />
        <OnlineCompiler />
        <SkillsRadar />
        <ExperienceTimeline />
        <ContactSection />
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Command Palette (⌘K) */}
      <TerminalModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default App;
