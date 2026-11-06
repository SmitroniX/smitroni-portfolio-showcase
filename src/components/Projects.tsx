import React, { useState } from 'react';
import { ExternalLink, CheckCircle, Terminal, Layers, ArrowUpRight, Sparkles, Server, Users, Shield, Cpu, Activity, Lock, Database, Play, Fingerprint, RefreshCw } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { PROJECTS, Project } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';
import { KineticText } from './KineticText';
import { Magnetic } from './Magnetic';
import { motion, AnimatePresence } from 'framer-motion';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Interactive micro-simulation state
  const [shadowFpsMode, setShadowFpsMode] = useState<'138' | '60'>('138');
  const [smitrixVerified, setSmitrixVerified] = useState<boolean>(false);
  const [smitrixScanning, setSmitrixScanning] = useState<boolean>(false);

  const categories = ['All', 'Full Stack', 'Systems & Engine', 'Developer Tools', 'Cloud & API'];

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  const handleSimulatePasskey = () => {
    sounds.playWarp();
    setSmitrixScanning(true);
    setSmitrixVerified(false);

    setTimeout(() => {
      setSmitrixScanning(false);
      setSmitrixVerified(true);
      sounds.playAccessGranted();
    }, 600);
  };

  const handleToggleShadowFps = () => {
    sounds.playClick();
    setShadowFpsMode((prev) => (prev === '138' ? '60' : '138'));
  };

  const renderVisualMockup = (project: Project) => {
    switch (project.previewType) {
      case 'shadowlauncher':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-3 font-mono text-xs preserve-3d">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] text-slate-400 ml-1">ShadowLauncher Core // JNI Engine</span>
              </div>
              <button
                onClick={handleToggleShadowFps}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 transition-all active:scale-95"
                title="Click to toggle FPS Mode (60Hz vs 120Hz/138FPS)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {shadowFpsMode === '138' ? '138 FPS (120Hz Max)' : '60 FPS (VSync)'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                <div className="text-slate-500 text-[9px] uppercase">Latency</div>
                <div className="text-emerald-400 font-bold">
                  {shadowFpsMode === '138' ? '<7.2ms Frame' : '<16.6ms'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[#FF8A00]">
                <div className="text-slate-500 text-[9px] uppercase">Native Bridge</div>
                <div className="font-bold">GL4ES + LWJGL3</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                <div className="text-slate-500 text-[9px] uppercase">RAM Alloc</div>
                <div className="text-cyan-400 font-bold">Dynamic JNI</div>
              </div>
            </div>

            {/* Live Interactive Oscilloscope Frame Trace */}
            <div className="p-2 rounded-lg bg-black/70 border border-white/5 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Renderer: OpenGL ES 3.2 (Mobile Vulkan Pipe)</span>
              </span>
              <span className="text-emerald-400 font-mono font-bold animate-pulse">
                {shadowFpsMode === '138' ? '138 FPS PEAK' : '60 FPS LOCKED'}
              </span>
            </div>
          </div>
        );

      case 'smitrix':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-3 font-sans text-xs preserve-3d">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-1">SmiTriX PWA // Private Workout Hub</span>
              </div>
              <button
                onClick={handleSimulatePasskey}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 transition-all active:scale-95 ${
                  smitrixVerified
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : smitrixScanning
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20'
                }`}
                title="Click to test WebAuthn Passkey Handshake"
              >
                <Fingerprint className="w-3 h-3 text-cyan-400" />
                {smitrixScanning
                  ? 'Verifying...'
                  : smitrixVerified
                  ? 'Passkey Verified ✓'
                  : 'Test Passkey Scan'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                <div className="text-slate-500 text-[9px]">EXERCISES</div>
                <div className="text-[#FF8A00] font-bold text-xs">1,324 Routines</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                <div className="text-slate-500 text-[9px]">PERIODIZATION</div>
                <div className="text-emerald-400 font-bold text-xs">Auto 1RM Sync</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                <div className="text-slate-500 text-[9px]">TELEMETRY</div>
                <div className="text-purple-400 font-bold text-xs">0 Bytes (100% Private)</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-slate-300 text-[11px] flex items-center justify-between font-mono">
              <span className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Local-first IndexedDB storage + offline service workers
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Encrypted</span>
            </div>
          </div>
        );

      case 'compiler':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-3 font-sans text-xs preserve-3d">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-1">Code With SmitroniX // Windows 11 Desktop</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                9 RUNTIMES
              </span>
            </div>

            <div className="bg-black/60 p-2.5 rounded-lg border border-white/5 font-mono text-[10px] text-slate-300 space-y-1">
              <div className="text-cyan-400">public class ScientificCalculator extends JFrame &#123;</div>
              <div className="text-slate-500 pl-3">// Authentic Draggable Windows 11 GUI Rendering</div>
              <div className="text-[#FF8A00] pl-3">setTitle(&quot;Scientific Calculator&quot;); setSize(380, 520);</div>
              <div className="text-cyan-400">&#125;</div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
              <span className="text-emerald-400">Virtual Java Swing/AWT Manager</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-white">Lab PDF Export</span>
            </div>
          </div>
        );

      case 'dypu':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-3 font-sans text-xs preserve-3d">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-1">dypu-connect.netlify.app</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CAMPUS LIVE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium pt-1">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-200">
                📣 Confessions
              </div>
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[#FF8A00]">
                🛍️ Marketplace
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-200">
                💬 Clubs &amp; Chat
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-slate-300 text-[11px]">
              <div className="flex justify-between items-center text-slate-400 text-[10px] mb-1">
                <span>Recent University Exchange</span>
                <span className="text-emerald-400 font-mono font-bold">2.5k Students</span>
              </div>
              &ldquo;Database Systems notes &amp; Arduino Starter Kit available for exchange at RAIT Central Library.&rdquo;
            </div>
          </div>
        );

      case 'aniplex':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-3 font-sans text-xs preserve-3d">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-1">ani-plex.vercel.app</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">1080P PROXY</span>
            </div>

            <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-slate-400 text-[11px]">
              <span>🔍 Search anime, manga &amp; light novels...</span>
              <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-300">/</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300">Consumet Engine</span>
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300">Zero Buffering</span>
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300">Manga Reader</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-2.5 font-mono text-xs preserve-3d">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[11px] text-slate-400">REST Microservice // Response</span>
              <span className="text-[10px] text-emerald-400 font-bold">142ms</span>
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-white/5 space-y-1 text-[11px]">
              <div className="text-emerald-400">GET /api/v1/search?q=matrix HTTP/1.1</div>
              <div className="text-slate-500">Host: shadowapi-bice.vercel.app</div>
              <div className="text-slate-400 pt-1">
                {`{ "status": 200, "cached": true, "ttl": 3600, "results": 48 }`}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-[#FF8A00] tracking-widest uppercase font-semibold">
              Selected Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
              <KineticText text="Projects & Systems" playSound speed={35} />
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-sans mt-3 md:mt-0 max-w-md">
            Production platforms, native systems engines, distributed clusters, and developer tools built with high-performance architectures.
          </p>
        </div>

        {/* Filter Categories with Spring Animated Pill */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick();
                  setActiveCategory(cat);
                }}
                className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    className="absolute inset-0 bg-white rounded-xl shadow-lg"
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-slate-900/80 rounded-xl border border-white/5 hover:border-white/10" />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid with 3D Tilt, Holographic Foil, and Laser Border Beam */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              data-cursor="project"
              enableTilt
              enableFoil
              enableLaserBeam
              className="p-6 sm:p-7 flex flex-col justify-between group"
            >
              <div className="space-y-5">
                {/* Visual Mockup Container */}
                <div className="transition-transform duration-300 group-hover:scale-[1.01]">
                  {renderVisualMockup(project)}
                </div>

                {/* Project Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-[#FF8A00] font-semibold">
                      {project.category}
                    </span>
                    {project.stats && (
                      <span className="text-xs font-mono text-slate-400">
                        {project.stats.label}: <strong className="text-white font-bold">{project.stats.value}</strong>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white font-display group-hover:text-amber-200 transition-colors">
                    <KineticText text={project.title} playSound speed={25} />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    {project.tagline}
                  </p>
                </div>

                {/* Project Description & Context */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
                  {project.story}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-1">
                  {project.highlights.slice(0, 2).map((hl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack & Action Links */}
              <div className="pt-6 mt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {project.githubUrl && (
                    <Magnetic strength={0.3} radius={50}>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sounds.playClick()}
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors block"
                        title="View GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    </Magnetic>
                  )}
                  {project.liveUrl && (
                    <Magnetic strength={0.3} radius={60}>
                      <a
                        href={project.liveUrl}
                        target={project.liveUrl.startsWith('#') ? '_self' : '_blank'}
                        rel={project.liveUrl.startsWith('#') ? undefined : 'noopener noreferrer'}
                        onClick={() => sounds.playClick()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs transition-all shadow-md active:scale-95"
                      >
                        <span>{project.liveUrl.startsWith('#') ? 'Launch App' : 'Live Site'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </Magnetic>
                  )}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

      </div>
    </section>
  );
};
