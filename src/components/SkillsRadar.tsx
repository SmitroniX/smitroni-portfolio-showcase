import React from 'react';
import { Layout, Server, Cloud, Database, Terminal, Code2, Flame, ExternalLink, Cpu } from 'lucide-react';
import { TECH_STACK, PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';

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
              Tech Stack &amp; Tools
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-sans mt-3 md:mt-0 max-w-md">
            Languages, frameworks, and infrastructure tools I use daily to build robust digital products.
          </p>
        </div>

        {/* Tech Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Frontend Card */}
          <SpotlightCard className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FF8A00]">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Frontend</h3>
                  <span className="text-[11px] text-slate-400">User interfaces &amp; web</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {TECH_STACK.frontend.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs"
                  >
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Backend Card */}
          <SpotlightCard className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Backend &amp; APIs</h3>
                  <span className="text-[11px] text-slate-400">Services &amp; concurrency</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {TECH_STACK.backend.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs"
                  >
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Cloud & DevOps Card */}
          <SpotlightCard className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Cloud &amp; DevOps</h3>
                  <span className="text-[11px] text-slate-400">Deployments &amp; systems</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {TECH_STACK.cloud.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs"
                  >
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Databases & Algorithms */}
          <SpotlightCard className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Databases &amp; DSA</h3>
                  <span className="text-[11px] text-slate-400">Storage &amp; algorithmic logic</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {TECH_STACK.databases.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs"
                  >
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>

        </div>

        {/* Algorithm Profiles & Philosophy Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <SpotlightCard className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Flame className="w-4 h-4" /> Algorithmic Problem Solving
              </div>
              <h4 className="text-lg font-bold text-white">
                LeetCode &amp; Competitive Programming
              </h4>
              <p className="text-xs text-slate-400">
                Sharpening data structures, graph algorithms, and time complexities.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
              <a
                href={PERSONAL_INFO.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <span>LeetCode</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
              <a
                href={PERSONAL_INFO.socials.hackerrank}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <span>HackerRank</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF8A00]">
                <Cpu className="w-4 h-4" /> Engineering Philosophy
              </div>
              <h4 className="text-lg font-bold text-white">
                Code with Purpose. Build What Matters.
              </h4>
              <p className="text-xs text-slate-400">
                Focus on clean architectures, intuitive user flows, and real-world utility.
              </p>
            </div>
          </SpotlightCard>

        </div>

      </div>
    </section>
  );
};
