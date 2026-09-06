import React from 'react';
import { Layout, Server, Cloud, Database, Code2, Award, Zap, Flame, Terminal } from 'lucide-react';
import { SKILL_CATEGORIES, FUN_FACTS, PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';

export const SkillsRadar: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-[#FF6B00]" />;
      case 'Server':
        return <Server className="w-5 h-5 text-[#00F0FF]" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-amber-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      default:
        return <Code2 className="w-5 h-5 text-[#FF6B00]" />;
    }
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] uppercase tracking-widest font-bold">
              <span>02 //</span> CYBERNETICS MATRIX
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase mt-2">
              Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-cyan-200">Arsenal</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-mono mt-4 md:mt-0 max-w-md">
            Engineered proficiency across high-load frontend renderers, distributed microservices, cloud orchestration, and core algorithms.
          </p>
        </div>

        {/* Skill Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => sounds.playHover()}
              className="cyber-card rounded-2xl p-6 sm:p-8 relative border border-slate-800 hover:border-[#FF6B00]/40 transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 shadow-inner">
                  {getIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Skills Progress List */}
              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 font-medium">
                          {skill.name}
                        </span>
                        {skill.highlight && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-orange-500/10 text-[#FF8A00] border border-orange-500/30">
                            CORE
                          </span>
                        )}
                      </div>
                      <span className="text-[#00F0FF] font-semibold">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF8A00] to-[#00F0FF] transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Algorithm Profiles & Fun Facts Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* LeetCode & Competitive Coding Card */}
          <div className="cyber-card rounded-2xl p-6 border border-orange-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#FF6B00] uppercase font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Algorithmic Rigor
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  DSA & SPEED
                </span>
              </div>
              <h4 className="text-xl font-bold font-display text-white mb-2">
                Problem Solving
              </h4>
              <p className="text-xs text-slate-300 mb-6 font-mono leading-relaxed">
                Consistent problem solving across data structures, graph algorithms, dynamic programming, and systems optimization.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <a
                href={PERSONAL_INFO.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-xs font-mono text-slate-200 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">LC</span>
                  <span>LeetCode Profile</span>
                </div>
                <span className="text-amber-400">@SmitroniX ↗</span>
              </a>

              <a
                href={PERSONAL_INFO.socials.hackerrank}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-mono text-slate-200 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">HR</span>
                  <span>HackerRank Profile</span>
                </div>
                <span className="text-emerald-400">@jogdandasmit ↗</span>
              </a>
            </div>
          </div>

          {/* Fun Facts & Philosophy Card (Span 2) */}
          <div className="lg:col-span-2 cyber-card rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#00F0FF] uppercase font-bold flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Engineering Mindset
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {PERSONAL_INFO.quote}
                </span>
              </div>
              <h4 className="text-xl font-bold font-display text-white mb-4">
                Developer Principles & Core Logic
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FUN_FACTS.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>PRIMARY FOCUS: PRODUCTION ARCHITECTURE</span>
              <span className="text-[#00FF9D]">ALL SYSTEMS NOMINAL</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
