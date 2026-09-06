import React from 'react';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { EXPERIENCES, CERTIFICATIONS, PERSONAL_INFO } from '../data/portfolioData';
import { sounds } from '../utils/sound';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B00] uppercase tracking-widest font-bold">
              <span>03 //</span> CAREER TRAJECTORY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase mt-2">
              Experience & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-amber-300">Milestones</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-mono mt-4 md:mt-0 max-w-md">
            Hands-on production contributions, enterprise software internships, and academic foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Work Experience Column (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-8 relative">
            
            {/* Connecting cyber line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#FF6B00] via-[#00F0FF] to-slate-800 hidden sm:block" />

            {EXPERIENCES.map((exp, index) => (
              <div
                key={index}
                onMouseEnter={() => sounds.playHover()}
                className="relative flex flex-col sm:flex-row gap-6 group"
              >
                {/* Timeline node icon */}
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border-2 border-orange-500/60 group-hover:border-[#00F0FF] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all shrink-0 z-10">
                  <Briefcase className="w-5 h-5 text-[#FF6B00] group-hover:text-[#00F0FF] transition-colors" />
                </div>

                {/* Experience Content Box */}
                <div className="cyber-card rounded-2xl p-6 sm:p-7 flex-1 border border-slate-800 hover:border-orange-500/40 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-[#FF8A00] transition-colors">
                      {exp.role}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-orange-500/10 text-[#FF8A00] border border-orange-500/30">
                      {exp.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mb-4">
                    <span className="text-[#00F0FF] font-semibold">{exp.company}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {exp.location}
                    </span>
                  </div>

                  <div className="space-y-2 mb-5">
                    {exp.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[11px] font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Education & Certifications (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Education Card */}
            <div className="cyber-card rounded-2xl p-6 sm:p-7 border border-orange-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <GraduationCap className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#FF6B00] uppercase font-bold">Academic Base</span>
                  <h4 className="text-lg font-bold font-display text-white">Education</h4>
                </div>
              </div>

              <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="text-sm font-bold text-white">
                  {PERSONAL_INFO.education.degree}
                </div>
                <div className="text-xs font-mono text-[#00F0FF]">
                  {PERSONAL_INFO.education.institution}
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Duration:</span>
                  <span className="text-slate-200">{PERSONAL_INFO.education.year}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Score / Merit:</span>
                  <span className="text-emerald-400 font-semibold">{PERSONAL_INFO.education.score}</span>
                </div>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="cyber-card rounded-2xl p-6 sm:p-7 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                  <Award className="w-5 h-5 text-[#00F0FF]" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#00F0FF] uppercase font-bold">Verified Credentials</span>
                  <h4 className="text-lg font-bold font-display text-white">Certifications</h4>
                </div>
              </div>

              <div className="space-y-4">
                {CERTIFICATIONS.map((cert, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="text-sm font-bold text-slate-200">
                      {cert.title}
                    </div>
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span className="text-[#00F0FF]">{cert.issuer}</span>
                      <span>{cert.year}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
