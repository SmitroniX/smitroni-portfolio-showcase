import React from 'react';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, CheckCircle2, ArrowUpRight, ShieldCheck, Check, BookmarkCheck } from 'lucide-react';
import { EXPERIENCES, CERTIFICATIONS, PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-[#FF8A00] tracking-widest uppercase font-semibold">
              Background &amp; Credentials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
              Experience &amp; Education
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-sans mt-3 md:mt-0 max-w-md">
            Production internships, cybersecurity team captaincy, systems optimization, and academic milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Work Experience (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {EXPERIENCES.map((exp, idx) => (
              <SpotlightCard
                key={idx}
                className="p-6 sm:p-7 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-white font-display">
                        {exp.role}
                      </h3>
                      {exp.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-orange-500/10 text-[#FF8A00] border border-orange-500/20">
                          {exp.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                      <span className="text-[#FF8A00] font-semibold">{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md self-start sm:self-auto shrink-0">
                    {exp.period}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {exp.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  {exp.highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {exp.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Education & Certifications (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Education Bento */}
            <SpotlightCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF8A00] uppercase font-semibold">
                  <GraduationCap className="w-4 h-4" /> Formal Education
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                  CGPA 8.65
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white text-base leading-snug">
                    {PERSONAL_INFO.education.degree}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                    {PERSONAL_INFO.education.institution}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {PERSONAL_INFO.education.department}
                  </p>
                </div>

                {/* Semester Score Breakdown */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 flex justify-between items-center">
                    <span>Degree CGPA:</span>
                    <span className="text-emerald-400 font-bold text-sm">8.65 / 10.0</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 text-[10px] font-mono">
                    <div className="bg-black/40 p-1.5 rounded text-center">
                      <div className="text-slate-500">SEM 1</div>
                      <div className="text-white font-bold">8.80 SGPA</div>
                    </div>
                    <div className="bg-black/40 p-1.5 rounded text-center">
                      <div className="text-slate-500">SEM 2</div>
                      <div className="text-white font-bold">8.50 SGPA</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 pt-1 border-t border-white/5 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Tenure:</span>
                    <span className="text-white">{PERSONAL_INFO.education.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Class X (ICSE):</span>
                    <span className="text-emerald-400 font-semibold">{PERSONAL_INFO.education.icse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Class XII (HSC):</span>
                    <span className="text-slate-300">{PERSONAL_INFO.education.hsc}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Certifications Bento */}
            <SpotlightCard className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-semibold">
                <Award className="w-4 h-4" /> Certifications &amp; Credentials
              </div>

              <div className="space-y-3">
                {CERTIFICATIONS.map((cert, i) => (
                  <a
                    key={i}
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playClick()}
                    className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-white group-hover:text-[#FF8A00] transition-colors leading-snug">
                        {cert.title}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 mt-0.5" />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                      <span>{cert.issuer}</span>
                      <span>{cert.year}</span>
                    </div>
                    {cert.credentialId && (
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <BookmarkCheck className="w-3 h-3" />
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </SpotlightCard>

          </div>

        </div>

      </div>
    </section>
  );
};
