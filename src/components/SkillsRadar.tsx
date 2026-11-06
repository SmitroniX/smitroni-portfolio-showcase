import React from 'react';
import { Layout, Server, Cloud, Database, Terminal, Code2, Flame, ExternalLink, Cpu, ShieldCheck } from 'lucide-react';
import { TECH_STACK, PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';
import { KineticText } from './KineticText';
import { Magnetic } from './Magnetic';

export const SkillsRadar: React.FC = () => {
  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-slate-950/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-[#FF8A00] tracking-widest uppercase font-semibold">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
              <KineticText text="Tech Stack & Tools" playSound speed={35} />
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-sans mt-3 md:mt-0 max-w-md">
            Languages, frameworks, and infrastructure tools I use daily to build robust digital products.
          </p>
        </div>

        {/* Tech Bento Grid with 3D Tilt & Holographic Foil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Frontend Card */}
          <SpotlightCard className="p-6 flex flex-col justify-between" enableTilt enableFoil>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FF8A00]">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Frontend</h3>
                  <span className="text-[11px] text-slate-400 font-mono">User interfaces &amp; web</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {TECH_STACK.frontend.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors"
                  >
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Backend Card */}
          <SpotlightCard className="p-6 flex flex-col justify-between" enableTilt enableFoil>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Backend &amp; APIs</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Services &amp; concurrency</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {TECH_STACK.backend.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors"
                  >
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Cloud & DevOps Card */}
          <SpotlightCard className="p-6 flex flex-col justify-between" enableTilt enableFoil>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Cloud &amp; DevOps</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Deployments &amp; systems</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {TECH_STACK.cloud.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors"
                  >
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Databases & Algorithms */}
          <SpotlightCard className="p-6 flex flex-col justify-between" enableTilt enableFoil>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Databases &amp; DSA</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Storage &amp; logic</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {TECH_STACK.databases.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors"
                  >
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

        </div>

        {/* Algorithm Profiles, CTF & Philosophy Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <SpotlightCard className="p-6 flex flex-col justify-between" enableTilt enableFoil>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Flame className="w-4 h-4" /> Algorithmic Problem Solving
              </div>
              <h4 className="text-base font-bold text-white">
                LeetCode &amp; Competitive DSA
              </h4>
              <p className="text-xs text-slate-400">
                Data structures, graph algorithms, and competitive coding practice.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4">
              <Magnetic strength={0.3} radius={50}>
                <a
                  href={PERSONAL_INFO.socials.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playClick()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all font-mono"
                >
                  <span>LeetCode Profile</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              </Magnetic>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 flex flex-col justify-between" enableTilt enableFoil>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <ShieldCheck className="w-4 h-4" /> Cyber Security &amp; CTF
              </div>
              <h4 className="text-base font-bold text-white">
                Hack The Box &amp; Reverse Engineering
              </h4>
              <p className="text-xs text-slate-400">
                Captain of team #331386. Binary exploitation, memory safety, and web security.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4">
              <Magnetic strength={0.3} radius={50}>
                <a
                  href="https://app.hackthebox.com/users/331386"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playClick()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all font-mono"
                >
                  <span>HTB Dossier</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </a>
              </Magnetic>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 flex flex-col justify-between" enableTilt enableFoil>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Cpu className="w-4 h-4" /> Systems Engineering Focus
              </div>
              <h4 className="text-base font-bold text-white">
                Low-Latency Native Runtime
              </h4>
              <p className="text-xs text-slate-400">
                Compilers, JVM internals, JNI native bridge optimization, and Linux kernel fundamentals.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                GL4ES • LWJGL3 • POSIX • C++
              </span>
            </div>
          </SpotlightCard>

        </div>

      </div>
    </section>
  );
};
