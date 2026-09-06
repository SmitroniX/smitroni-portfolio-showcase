import React, { useState } from 'react';
import { ExternalLink, CheckCircle, Terminal, Layers, ArrowUpRight, Sparkles, Server, Users, Shield, Cpu } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { PROJECTS, Project } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Full Stack', 'Cloud & API', 'Developer Tools', 'Systems & Bots'];

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  const renderVisualMockup = (project: Project) => {
    switch (project.previewType) {
      case 'dypu':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">dypu-connect.netlify.app</span>
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
                💬 Clubs & Chat
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-slate-300 text-[11px]">
              <div className="flex justify-between items-center text-slate-400 text-[10px] mb-1">
                <span>Recent University Exchange</span>
                <span>Just now</span>
              </div>
              &ldquo;Database Systems 4th Sem notes &amp; Arduino Starter Kit available for exchange at RAIT Central Library.&rdquo;
            </div>
          </div>
        );

      case 'aniplex':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">ani-plex.vercel.app</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">1080P PROXY</span>
            </div>

            <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-slate-400 text-[11px]">
              <span>🔍 Search anime, manga &amp; light novels...</span>
              <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-slate-300">/</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300">Consumet API Engine</span>
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300">Zero Buffering</span>
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300">Manga Reader</span>
            </div>
          </div>
        );

      case 'shadow':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-2.5 font-mono text-xs">
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

      case 'cli':
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[11px] text-slate-400">Terminal Shell Companion</span>
              <span className="text-[10px] text-amber-400 font-bold">Gemini 1.5</span>
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-white/5 space-y-1.5 text-[11px]">
              <div className="text-slate-300">$ gemini ask &quot;explain AWS lambda cold start&quot;</div>
              <div className="text-slate-400 text-[10px] leading-relaxed">
                &gt; Cold starts occur when a serverless execution environment is initialized for the first time...
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="rounded-xl bg-[#090D15] border border-white/10 p-4 space-y-2.5 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[11px] font-mono text-slate-400">Bot Gateway // Discord.js</span>
              <span className="text-[10px] font-mono text-emerald-400">99.9% Uptime</span>
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-white/5 space-y-1 text-[11px]">
              <div className="text-[#5865F2] font-semibold">PlexStaff Bot Gateway</div>
              <div className="text-slate-300 text-[10px]">
                Managing 50,000+ members • Automated moderation heuristics • Instant verification
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
              Projects &amp; Systems
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-sans mt-3 md:mt-0 max-w-md">
            Production platforms, university infrastructure, and developer tools built with a focus on real user needs.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
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
                    <span className="text-xs font-mono text-[#FF8A00]">
                      {project.category}
                    </span>
                    {project.stats && (
                      <span className="text-xs font-mono text-slate-400">
                        {project.stats.label}: <strong className="text-white">{project.stats.value}</strong>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white font-display group-hover:text-amber-200 transition-colors">
                    {project.title}
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
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sounds.playClick()}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="View GitHub Repository"
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-medium text-xs transition-colors"
                    >
                      <span>Live Site</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
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
