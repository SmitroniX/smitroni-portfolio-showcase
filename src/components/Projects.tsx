import React, { useState } from 'react';
import { ArrowUpRight, Activity, Shield, Users, Server, Play, Lock, CheckCircle2, Terminal } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { PROJECTS, Project } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [shadowFpsMode, setShadowFpsMode] = useState<'138' | '60'>('138');
  const [smitrixVerified, setSmitrixVerified] = useState<boolean>(false);
  const [smitrixScanning, setSmitrixScanning] = useState<boolean>(false);

  const categories = ['All', 'Systems & Engine', 'Full Stack', 'Cloud & API', 'Developer Tools'];

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  const handleSimulatePasskey = () => {
    setSmitrixScanning(true);
    setSmitrixVerified(false);
    setTimeout(() => {
      setSmitrixScanning(false);
      setSmitrixVerified(true);
    }, 500);
  };

  const handleToggleShadowFps = () => {
    setShadowFpsMode((prev) => (prev === '138' ? '60' : '138'));
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-semibold">
              // Selected Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Featured Systems &amp; Platforms
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0 leading-relaxed">
            High-performance graphics engines, campus social hubs, and privacy-first web apps designed for scale and low latency.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isFeatured = project.id === 'shadowlauncher' || project.id === 'smitrix';

            return (
              <SpotlightCard
                key={project.id}
                className={`p-6 sm:p-7 flex flex-col justify-between ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Top Bar: Category & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                      {project.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Interactive Micro-Demos for Flagship Projects */}
                  {project.id === 'shadowlauncher' && (
                    <div className="rounded-xl bg-black/50 border border-white/[0.08] p-3.5 space-y-2.5 font-mono text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <span className="text-[11px] text-slate-400">OpenGL ES 3.2 Native Pipeline</span>
                        <button
                          onClick={handleToggleShadowFps}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-all cursor-pointer"
                        >
                          {shadowFpsMode === '138' ? '138 FPS (120Hz Peak)' : '60 FPS (VSync)'}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-slate-400">Frame Time</div>
                          <div className="text-emerald-400 font-bold">
                            {shadowFpsMode === '138' ? '<7.2ms' : '<16.6ms'}
                          </div>
                        </div>
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-slate-400">C++ Bridge</div>
                          <div className="text-cyan-400 font-bold">GL4ES / LWJGL3</div>
                        </div>
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-slate-400">Touch Latency</div>
                          <div className="text-purple-400 font-bold">&lt;8ms Ultra-low</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {project.id === 'smitrix' && (
                    <div className="rounded-xl bg-black/50 border border-white/[0.08] p-3.5 space-y-2.5 font-mono text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                        <span className="text-[11px] text-slate-400">Zero-Trust Passkey Verification</span>
                        <button
                          onClick={handleSimulatePasskey}
                          className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all cursor-pointer"
                        >
                          {smitrixScanning ? 'Verifying...' : smitrixVerified ? '✔ WebAuthn Validated' : 'Simulate Passkey'}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-slate-400">Exercises</div>
                          <div className="text-amber-400 font-bold">1,324 Indexed</div>
                        </div>
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-slate-400">Telemetry</div>
                          <div className="text-emerald-400 font-bold">Zero Tracking</div>
                        </div>
                        <div className="p-2 rounded bg-white/[0.04]">
                          <div className="text-slate-400">Offline PWA</div>
                          <div className="text-cyan-400 font-bold">IndexedDB 100%</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Highlights Bullet List */}
                  <div className="space-y-1.5 pt-1">
                    {project.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Bottom: Tech Stack & Links */}
                <div className="pt-6 border-t border-white/[0.06] mt-6 space-y-4">
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white transition-colors group"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors group ml-auto"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

              </SpotlightCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
