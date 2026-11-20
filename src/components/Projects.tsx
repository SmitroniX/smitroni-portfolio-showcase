import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Zap,
  Radio,
  Code2,
  Gauge,
} from 'lucide-react';
import {
  GithubIcon,
  JavaIcon,
  PythonIcon,
  CppIcon,
  TypeScriptIcon,
  RustIcon,
  GoIcon,
} from './BrandIcons';
import { PROJECTS, Project } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';

interface ProjectsProps {
  onOpenCompiler?: () => void;
}

const FRAME_BARS_138 = [34, 38, 35, 36, 37, 35, 34, 38, 36, 35, 37, 36];
const FRAME_BARS_60 = [76, 80, 78, 82, 79, 81, 77, 80, 82, 79, 78, 81];

const CAMPUS_EVENTS = [
  { channel: '#RAIT-CSE', text: 'New WebSocket session synced (42 online)' },
  { channel: '#MARKET', text: 'Listed: Gate CS & DSA Reference Pack' },
  { channel: '#CLUBS', text: 'sudo Unknown CTF Workshop RSVP opened' },
];

export const Projects: React.FC<ProjectsProps> = ({ onOpenCompiler }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shadowFpsMode, setShadowFpsMode] = useState<'138' | '60'>('138');
  const [smitrixState, setSmitrixState] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [apiPingState, setApiPingState] = useState<'idle' | 'pinging' | 'ok'>('idle');
  const [apiLatency, setApiLatency] = useState<number>(24);
  const [campusTick, setCampusTick] = useState<number>(0);

  const categories = ['All', 'Systems & Engine', 'Full Stack', 'Cloud & API', 'Developer Tools'];

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCampusTick((prev) => (prev + 1) % CAMPUS_EVENTS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  const handleSimulatePasskey = () => {
    sounds.playInject();
    setSmitrixState('scanning');
    window.setTimeout(() => {
      setSmitrixState('verified');
      sounds.playSuccess();
    }, 650);
  };

  const handleToggleShadowFps = () => {
    sounds.playClick();
    setShadowFpsMode((prev) => (prev === '138' ? '60' : '138'));
  };

  const handlePingApi = () => {
    sounds.playLaser();
    setApiPingState('pinging');
    window.setTimeout(() => {
      setApiLatency(17 + Math.floor(Math.random() * 19));
      setApiPingState('ok');
      sounds.playSuccess();
    }, 420);
  };

  const renderInteractiveDemo = (project: Project) => {
    if (project.id === 'shadowlauncher') {
      const bars = shadowFpsMode === '138' ? FRAME_BARS_138 : FRAME_BARS_60;
      return (
        <div className="rounded-xl bg-[#05080F] border border-white/[0.08] p-3.5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
            <span className="text-[11px] text-slate-400">OpenGL ES 3.2 Native Pipeline</span>
            <button
              type="button"
              onClick={handleToggleShadowFps}
              className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 text-[#FF9E2C] border border-[#FF6B00]/35 transition-all cursor-pointer"
            >
              {shadowFpsMode === '138' ? '138 FPS (120Hz Peak)' : '60 FPS (VSync Cap)'}
            </button>
          </div>

          {/* Live Animated Frame-Time Pacing Bars */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>FRAME PACING (ms)</span>
              <span className={shadowFpsMode === '138' ? 'text-emerald-400' : 'text-amber-400'}>
                {shadowFpsMode === '138' ? '7.2ms avg · LOCKED' : '16.6ms avg · VSYNC'}
              </span>
            </div>
            <div className="h-9 flex items-end gap-1 px-1.5 py-1 rounded bg-white/[0.02] border border-white/[0.04]">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${h}%` }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24, delay: i * 0.02 }}
                  className={`flex-1 rounded-t-sm ${
                    shadowFpsMode === '138'
                      ? 'bg-gradient-to-t from-emerald-500/80 to-[#00F0FF]'
                      : 'bg-gradient-to-t from-[#FF6B00]/75 to-amber-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-slate-500">Frame Time</div>
              <div className="text-emerald-400 font-bold tabular-nums">
                {shadowFpsMode === '138' ? '<7.2ms' : '16.6ms'}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-slate-500">C++ Bridge</div>
              <div className="text-[#00F0FF] font-bold">GL4ES / LWJGL3</div>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-slate-500">Touch Latency</div>
              <div className="text-[#FF9E2C] font-bold">&lt;8ms Raw</div>
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'smitrix') {
      return (
        <div className="relative rounded-xl bg-[#05080F] border border-white/[0.08] p-3.5 space-y-3 font-mono text-xs overflow-hidden">
          {smitrixState === 'scanning' && <div className="laser-scan-beam" />}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <Fingerprint className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Zero-Trust Passkey Auth</span>
            </span>
            <button
              type="button"
              onClick={handleSimulatePasskey}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                smitrixState === 'verified'
                  ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                  : 'bg-[#00F0FF]/12 hover:bg-[#00F0FF]/20 border-[#00F0FF]/35 text-[#00F0FF]'
              }`}
            >
              {smitrixState === 'scanning'
                ? 'Verifying Key...'
                : smitrixState === 'verified'
                ? '✔ Assertion Valid'
                : 'Simulate Passkey'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-slate-500">Catalog</div>
              <div className="text-[#FF9E2C] font-bold">1,324 Moves</div>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-slate-500">Telemetry</div>
              <div className="text-emerald-400 font-bold">0 Bytes Sent</div>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <div className="text-slate-500">Storage</div>
              <div className="text-[#00F0FF] font-bold">IndexedDB</div>
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'dypu-connect') {
      const evt = CAMPUS_EVENTS[campusTick];
      return (
        <div className="rounded-xl bg-[#05080F] border border-white/[0.08] p-3 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>wss://dypu-connect/live</span>
            </span>
            <span>REAL-TIME</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={campusTick}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-2 text-slate-300 truncate"
            >
              <span className="px-1.5 py-0.5 rounded bg-[#FF6B00]/15 text-[#FF9E2C] text-[10px] shrink-0">
                {evt.channel}
              </span>
              <span className="truncate">{evt.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    if (project.id === 'compiler') {
      return (
        <div className="rounded-xl bg-[#05080F] border border-white/[0.08] p-3 font-mono text-[11px] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <JavaIcon className="w-4 h-4" />
              <PythonIcon className="w-4 h-4" />
              <CppIcon className="w-4 h-4" />
              <TypeScriptIcon className="w-4 h-4" />
              <RustIcon className="w-4 h-4" />
              <GoIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-slate-400">9 Runtimes</span>
          </div>
          {onOpenCompiler && (
            <button
              type="button"
              onClick={() => {
                sounds.playWarp();
                onOpenCompiler();
              }}
              className="w-full py-2 rounded-lg bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 border border-[#FF6B00]/40 text-[#FF9E2C] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Launch Live Cloud IDE →</span>
            </button>
          )}
        </div>
      );
    }

    if (project.id === 'shadow-api') {
      return (
        <div className="rounded-xl bg-[#05080F] border border-white/[0.08] p-3 font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400 truncate">GET /v2/stream/index</span>
            <button
              type="button"
              onClick={handlePingApi}
              className="px-2 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Zap className="w-3 h-3" />
              <span>{apiPingState === 'pinging' ? 'Pinging...' : 'Ping API'}</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-300 bg-white/[0.03] px-2.5 py-1.5 rounded border border-white/[0.05] tabular-nums">
            {apiPingState === 'ok'
              ? `200 OK · X-Cache: HIT · ${apiLatency}ms (Redis)`
              : 'Status: Ready · Edge Cache TTL 3600s · <150ms SLA'}
          </div>
        </div>
      );
    }

    if (project.id === 'aniplex') {
      return (
        <div className="rounded-xl bg-[#05080F] border border-white/[0.08] p-3 font-mono text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>Lighthouse Perf</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
              98 / 100
            </span>
            <span className="text-[10px] text-slate-500">HLS Proxy</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10"
        >
          <div>
            <span className="text-xs font-mono text-[#FF8A00] tracking-widest uppercase font-semibold">
              // Selected Engineering Works
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Featured Systems &amp; Platforms
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0 leading-relaxed">
            Production native graphics engines, zero-telemetry PWAs, campus platforms, and developer tooling built from scratch.
          </p>
        </motion.div>

        {/* Animated Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-2 mb-10"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => {
                  sounds.playClick();
                  setActiveCategory(cat);
                }}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  active
                    ? 'text-black font-bold'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.07]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="projectFilterPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-[#FF8A00] -z-10 shadow-md shadow-[#FF6B00]/25"
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Animated Zero-Gap Bento Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const bentoSpan =
                activeCategory === 'All'
                  ? project.id === 'shadowlauncher' || project.id === 'smitrix'
                    ? 'md:col-span-2 lg:col-span-4'
                    : project.id === 'dypu-connect' || project.id === 'compiler'
                    ? 'lg:col-span-2'
                    : 'lg:col-span-3'
                  : filteredProjects.length === 1
                  ? 'md:col-span-2 lg:col-span-6'
                  : 'lg:col-span-3';
              const isExpanded = expandedId === project.id;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.42,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={bentoSpan}
                >
                  <SpotlightCard
                    enableTilt
                    maxTilt={2.5}
                    spotlightColor={
                      project.id === 'shadowlauncher'
                        ? 'rgba(255, 107, 0, 0.14)'
                        : 'rgba(0, 240, 255, 0.11)'
                    }
                    className="p-6 flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-[#FF8A00] uppercase tracking-wider font-semibold">
                          {project.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {project.status}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                          {project.tagline}
                        </p>
                      </div>

                      {/* Live Interactive Engineering Widget */}
                      {renderInteractiveDemo(project)}

                      {/* Key Highlights */}
                      <div className="space-y-1.5 pt-1">
                        {project.highlights.slice(0, isExpanded ? 4 : 3).map((h, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Expandable Architecture Story */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.07] text-xs text-slate-300 leading-relaxed">
                              <span className="font-mono text-[10px] uppercase text-[#FF9E2C] block mb-1">
                                // Architecture Note
                              </span>
                              {project.story}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Footer: Stack + Links */}
                    <div className="pt-5 border-t border-white/[0.07] mt-5 space-y-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-[10px] font-mono text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white transition-colors group"
                            >
                              <GithubIcon className="w-3.5 h-3.5" />
                              <span>Source</span>
                              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#FF8A00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          )}

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                if (project.liveUrl === '#/compiler' && onOpenCompiler) {
                                  e.preventDefault();
                                  onOpenCompiler();
                                }
                              }}
                              className="flex items-center gap-1 text-xs font-mono text-[#00F0FF] hover:text-white transition-colors group"
                            >
                              <span>Live</span>
                              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setExpandedId(isExpanded ? null : project.id);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-[#FF9E2C] transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? 'Less' : 'Story'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
