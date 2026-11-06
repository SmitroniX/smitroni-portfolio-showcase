import React from 'react';
import { Briefcase, GraduationCap, CheckCircle2, ArrowUpRight, Award, ShieldCheck } from 'lucide-react';
import { EXPERIENCES, PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-purple-400 tracking-widest uppercase font-semibold">
              // Career &amp; Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Experience &amp; Education
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0 leading-relaxed">
            Software engineering internships, collegiate CTF leadership, high-concurrency systems, and academic accomplishments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Work Experiences (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {EXPERIENCES.map((exp, idx) => (
              <SpotlightCard key={idx} className="p-6 sm:p-7 space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {exp.role}
                      </h3>
                      {exp.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {exp.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                      <span className="text-slate-200 font-semibold">{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0">
                    {exp.period}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {exp.description}
                </p>

                {/* Bullet Highlights */}
                <div className="space-y-1.5 pt-1">
                  {exp.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                  {exp.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>

              </SpotlightCard>
            ))}
          </div>

          {/* Education & Academic Honors (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <SpotlightCard className="p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Undergraduate Degree</h3>
                  <span className="text-[11px] font-mono text-slate-400">2025 — 2029</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-200">
                  {PERSONAL_INFO.education.degree}
                </div>
                <div className="text-slate-400 leading-relaxed">
                  {PERSONAL_INFO.education.institution}
                </div>
                
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] mt-3 space-y-1.5">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-400">Current CGPA</span>
                    <span className="text-emerald-400 font-bold text-sm">8.65 / 10.0</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span>Semester 1</span>
                    <span className="text-slate-300 font-medium">8.80 SGPA</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span>Semester 2</span>
                    <span className="text-slate-300 font-medium">8.50 SGPA</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 space-y-1 font-mono">
                  <div>HSC Science: <span className="text-slate-200">{PERSONAL_INFO.education.hsc}</span></div>
                  <div>ICSE Board: <span className="text-slate-200">{PERSONAL_INFO.education.icse}</span></div>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">CTF &amp; Security</h3>
                  <span className="text-[11px] font-mono text-slate-400">Competitive Hacking</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  Founding Captain of Hack The Box team <strong className="text-white">sudo Unknown (#331386)</strong>. Competing across binary exploitation, heap manipulation, reverse engineering, and web security.
                </p>
                <a
                  href={PERSONAL_INFO.socials.hackthebox}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:text-purple-300 pt-1"
                >
                  <span>View HTB Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </SpotlightCard>
          </div>

        </div>

      </div>
    </section>
  );
};
