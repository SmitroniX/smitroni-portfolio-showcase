import React, { useState } from 'react';
import { ExternalLink, Layers, Terminal, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { PROJECTS, Project } from '../data/portfolioData';
import { sounds } from '../utils/sound';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Full Stack', 'Cloud & API', 'AI & CLI', 'Systems & Bots'];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B00] uppercase tracking-widest font-bold">
              <span className="text-[#00F0FF]">01 //</span> HOLO-VAULT ARCHIVES
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase mt-2">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-amber-300">Engineering</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-mono mt-4 md:mt-0 max-w-md">
            Production web ecosystems, cloud APIs, intelligent CLI tools, and distributed bot infrastructures.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setActiveCategory(cat);
              }}
              onMouseEnter={() => sounds.playHover()}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-black font-bold shadow-[0_0_15px_rgba(255,107,0,0.35)] scale-105'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => sounds.playHover()}
              className="cyber-card rounded-2xl p-6 relative flex flex-col justify-between group border border-orange-500/20 hover:border-[#FF6B00] transition-all duration-300"
            >
              {/* Card Corner Accents */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#FF6B00]/40 group-hover:border-[#FF6B00]" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#FF6B00]/40 group-hover:border-[#FF6B00]" />

              {/* Card Header & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider bg-orange-500/10 text-[#FF8A00] border border-orange-500/30">
                    {project.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {project.category}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold font-display text-white group-hover:text-[#00F0FF] transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-[#FF8A00] font-mono mb-3">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                  {project.description}
                </p>

                {/* Core Feature Bullets */}
                <div className="space-y-1.5 mb-6">
                  {project.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Tech Stack & Actions */}
              <div>
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6 pt-4 border-t border-slate-800">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-black/40 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSelectedProject(project);
                    }}
                    className="text-xs font-mono text-[#00F0FF] hover:text-white flex items-center gap-1 group/btn"
                  >
                    <span>Inspect Specs</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sounds.playClick()}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Source Code"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sounds.playClick()}
                        className="p-2 rounded-lg bg-[#FF6B00]/20 hover:bg-[#FF6B00] border border-orange-500/40 text-[#FF8A00] hover:text-black transition-all"
                        title="Live Deployment"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Deep Dive Architecture Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#070A0F] border border-orange-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => {
                  sounds.playClick();
                  setSelectedProject(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 hover:bg-[#FF6B00] text-slate-300 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B00] mb-2">
                <span>PROJECT INTEL // SPEC SHEET</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                {selectedProject.title}
              </h3>
              <p className="text-sm font-mono text-[#00F0FF] mb-4">
                {selectedProject.tagline}
              </p>

              <div className="space-y-6 text-slate-300 text-sm">
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Overview & Architecture</h4>
                  <p className="leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-slate-300">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Key Engineering Capabilities</h4>
                  <div className="space-y-2">
                    {selectedProject.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-black/40 p-3 rounded-lg border border-slate-800/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Technologies Utilized</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-[#FF8A00]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-black font-bold font-mono text-xs uppercase flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Live Application
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center gap-2"
                    >
                      <GithubIcon className="w-4 h-4" /> GitHub Repository
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
