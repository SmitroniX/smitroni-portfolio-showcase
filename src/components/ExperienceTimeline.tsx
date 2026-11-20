import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  GraduationCap,
  CheckCircle2,
  ArrowUpRight,
  Award,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react';
import { EXPERIENCES, PERSONAL_INFO, CERTIFICATIONS } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

export const ExperienceTimeline: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 65%'],
  });

  const lineScaleY = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="experience"
      className="py-24 relative overflow-hidden border-y border-white/[0.05] bg-[#070A12]/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs font-mono text-[#00F0FF] tracking-widest uppercase font-semibold">
              // Career, Leadership &amp; Credentials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Experience, Education &amp; Certs
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0 leading-relaxed">
            Software engineering internships, competitive CTF captaincy, distributed systems work,
            verified credentials, and academic standing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Cols: Scroll-Animated Vertical Career Timeline */}
          <div ref={timelineRef} className="lg:col-span-8 relative pl-6 sm:pl-8 space-y-5">
            {/* Static Background Spine */}
            <div
              aria-hidden="true"
              className="absolute left-2 sm:left-3 top-3 bottom-3 w-px bg-white/[0.08]"
            />

            {/* Scroll-Drawn Animated Glowing Spine */}
            <motion.div
              aria-hidden="true"
              style={{ scaleY: lineScaleY }}
              className="absolute left-2 sm:left-3 top-3 bottom-3 w-[2px] -ml-[0.5px] origin-top bg-gradient-to-b from-[#FF6B00] via-[#FF9E2C] to-[#00F0FF] shadow-[0_0_12px_rgba(255,107,0,0.75)]"
            />

            {EXPERIENCES.map((exp, idx) => (
              <motion.div
                key={`${exp.company}-${idx}`}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                {/* Timeline Milestone Dot */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[22px] sm:-left-[26px] top-7 w-3 h-3 rounded-full border-2 border-[#05070B] ${
                    idx === 0
                      ? 'bg-[#FF6B00] shadow-[0_0_12px_#FF6B00]'
                      : 'bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]'
                  }`}
                />

                <SpotlightCard className="p-5 sm:p-6 space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-white tracking-tight">
                          {exp.role}
                        </h3>
                        {exp.badge && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FF6B00]/15 text-[#FF9E2C] border border-[#FF6B00]/30">
                            {exp.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                        <span className="text-slate-100 font-semibold">{exp.company}</span>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-300 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0">
                      {exp.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-1.5 pt-0.5">
                    {exp.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                    {exp.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-[#05080F] border border-white/[0.07] text-[10px] font-mono text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Right 4 Cols: Education + Certifications + HTB Captaincy */}
          <div className="lg:col-span-4 space-y-5">
            {/* Undergraduate Degree Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
            >
              <SpotlightCard className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FF6B00]/12 border border-[#FF6B00]/30 text-[#FF8A00]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">
                      Undergraduate Degree
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      {PERSONAL_INFO.education.year}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="font-semibold text-slate-100">
                    {PERSONAL_INFO.education.degree}
                  </div>
                  <div className="text-slate-400 leading-relaxed">
                    {PERSONAL_INFO.education.institution}
                  </div>

                  {/* Animated CGPA Gauge Box */}
                  <div className="p-3.5 rounded-xl bg-[#05080F] border border-white/[0.07] space-y-2.5">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">Current CGPA</span>
                      <span className="text-emerald-400 font-bold text-sm tabular-nums">
                        {PERSONAL_INFO.education.cgpa} / 10.0
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '86.5%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-emerald-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] flex justify-between">
                        <span className="text-slate-500">Sem 1</span>
                        <span className="text-slate-200 font-semibold">
                          {PERSONAL_INFO.education.sem1}
                        </span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] flex justify-between">
                        <span className="text-slate-500">Sem 2</span>
                        <span className="text-slate-200 font-semibold">
                          {PERSONAL_INFO.education.sem2}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-400 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Class XII (HSC)</span>
                      <span className="text-slate-200 font-semibold">
                        {PERSONAL_INFO.education.hsc}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Class X (ICSE)</span>
                      <span className="text-slate-200 font-semibold">
                        {PERSONAL_INFO.education.icse}
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Verified Certifications Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <SpotlightCard className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/12 border border-emerald-500/30 text-emerald-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">
                      Verified Certifications
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Credentials &amp; Simulations
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {CERTIFICATIONS.map((cert) => (
                    <a
                      key={cert.title}
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-xl bg-[#05080F] hover:bg-white/[0.04] border border-white/[0.06] hover:border-emerald-500/35 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {cert.title}
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        {cert.issuer} • {cert.year}
                      </div>
                      {cert.credentialId && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
                          <BadgeCheck className="w-3 h-3" />
                          <span>ID: {cert.credentialId}</span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* sudo Unknown CTF Card with 7 Disciplines */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: 0.14 }}
            >
              <SpotlightCard className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#00F0FF]/12 border border-[#00F0FF]/30 text-[#00F0FF]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">
                      sudo Unknown (#331386)
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Hack The Box Captaincy
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Founding captain leading competitive security engagements across all 7 CTF
                  disciplines, publishing research on GLIBC heap exploitation and web cache
                  deception.
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {PERSONAL_INFO.ctfDisciplines.map((disc) => (
                    <span
                      key={disc}
                      className="px-2 py-0.5 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/25 text-[10px] font-mono text-[#67E8F9]"
                    >
                      {disc}
                    </span>
                  ))}
                </div>

                <a
                  href={PERSONAL_INFO.socials.hackthebox}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00F0FF] hover:text-white transition-colors pt-1"
                >
                  <span>View HTB Team Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
