import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { SkillsRadar } from './components/SkillsRadar';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { MiniGame } from './components/MiniGame';
import { GitHubPulse } from './components/GitHubPulse';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ThreeCanvas } from './components/ThreeCanvas';
import { CustomCursor } from './components/CustomCursor';
import { MatrixRain } from './components/MatrixRain';
import { TerminalModal } from './components/TerminalModal';
import { sounds } from './utils/sound';

export function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);

  // Global hotkeys (Ctrl+K or Cmd+K for terminal, Esc to dismiss overlays)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        sounds.playWarp();
        setTerminalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (matrixActive) setMatrixActive(false);
        if (terminalOpen) setTerminalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [matrixActive, terminalOpen]);

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 relative font-sans selection:bg-[#FF6B00] selection:text-black">
      {/* Interactive Custom Magnetic Fluid Cursor */}
      <CustomCursor />

      {/* 3D WebGL Three.js Particle Nebula & Holographic Wireframe Core */}
      <ThreeCanvas />

      {/* Cyber Grid Pattern Overlay */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />

      {/* SmiTriX Matrix Rain Simulation Overlay */}
      <MatrixRain
        active={matrixActive}
        onClose={() => setMatrixActive(false)}
      />

      {/* Main HUD Navigation */}
      <Navbar
        onOpenTerminal={() => setTerminalOpen(true)}
        onToggleMatrix={() => setMatrixActive((prev) => !prev)}
        matrixActive={matrixActive}
      />

      {/* Main Portfolio Content Flow */}
      <main className="relative z-10">
        <Hero onOpenTerminal={() => setTerminalOpen(true)} />
        <Projects />
        <SkillsRadar />
        <ExperienceTimeline />
        <MiniGame />
        <GitHubPulse />
        <ContactSection />
      </main>

      {/* Futuristic System Footer */}
      <Footer />

      {/* Interactive Command Terminal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onTriggerMatrix={() => setMatrixActive(true)}
      />
    </div>
  );
}

export default App;
