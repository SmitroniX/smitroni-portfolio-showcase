import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Layout,
  Server,
  Cpu,
  Cloud,
  Shield,
  Wrench,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  SKILL_DOMAINS,
  RADAR_AXES,
  DEV_TOOLING,
  SkillDomain,
} from '../data/portfolioData';
import {
  JavaIcon,
  CppIcon,
  PythonIcon,
  TypeScriptIcon,
  JavaScriptIcon,
  BashIcon,
} from './BrandIcons';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  languages: <Code2 className="w-4 h-4 text-[#FF8A00]" />,
  frontend: <Layout className="w-4 h-4 text-[#00F0FF]" />,
  backend: <Server className="w-4 h-4 text-emerald-400" />,
  systems: <Cpu className="w-4 h-4 text-amber-400" />,
  cloud: <Cloud className="w-4 h-4 text-[#00F0FF]" />,
  security: <Shield className="w-4 h-4 text-[#FF8A00]" />,
};

const TIER_STYLES: Record<string, string> = {
  Core: 'bg-[#FF6B00]/15 text-[#FF9E2C] border-[#FF6B00]/35',
  Advanced: 'bg-[#00F0FF]/12 text-[#67E8F9] border-[#00F0FF]/30',
  Proficient: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/30',
  Active: 'bg-amber-500/12 text-amber-300 border-amber-500/30',
};

const BAR_GRADIENTS: Record<SkillDomain['accent'], string> = {
  orange: 'from-[#FF6B00] to-[#FFB84D]',
  cyan: 'from-[#00C8FF] to-[#00F0FF]',
  emerald: 'from-emerald-500 to-teal-300',
  amber: 'from-amber-500 to-yellow-300',
};

function getSkillIcon(name: string): React.ReactNode | null {
  const lower = name.toLowerCase();
  if (lower.startsWith('java (')) return <JavaIcon className="w-4 h-4 shrink-0" />;
  if (lower.includes('c / c++')) return <CppIcon className="w-4 h-4 shrink-0" />;
  if (lower.includes('python')) return <PythonIcon className="w-4 h-4 shrink-0" />;
  if (lower.includes('typescript')) return <TypeScriptIcon className="w-4 h-4 shrink-0" />;
  if (lower.includes('javascript')) return <JavaScriptIcon className="w-4 h-4 shrink-0" />;
  if (lower.includes('shell') || lower.includes('bash'))
    return <BashIcon className="w-4 h-4 shrink-0" />;
  return null;
}

export const SkillsRadar: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [focusedAxisId, setFocusedAxisId] = useState<string>(RADAR_AXES[0].id);

  const focusedAxis = useMemo(
    () => RADAR_AXES.find((a) => a.id === focusedAxisId) ?? RADAR_AXES[0],
    [focusedAxisId]
  );

  const totalSkillsCount = useMemo(
    () => SKILL_DOMAINS.reduce((acc, d) => acc + d.items.length, 0),
    []
  );

  const visibleDomains = useMemo(
    () =>
      selectedDomain === 'all'
        ? SKILL_DOMAINS
        : SKILL_DOMAINS.filter((d) => d.id === selectedDomain),
    [selectedDomain]
  );

  // Interactive 6-axis SVG radar geometry
  const cx = 160;
  const cy = 150;
  const radius = 102;
  const ringLevels = [25, 50, 75, 100];

  const getPoint = (index: number, pct: number) => {
    const angle = (Math.PI * 2 * index) / RADAR_AXES.length - Math.PI / 2;
    const r = (pct / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const dataPolygonPoints = RADAR_AXES.map((axis, i) => {
    const pt = getPoint(i, axis.score);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs font-mono text-[#FF8A00] tracking-widest uppercase font-semibold">
              // Engineering Competency Matrix
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Skills, Languages &amp; Systems Stack
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0 leading-relaxed">
            {totalSkillsCount} production-tested technologies spanning native C++/Java engines,
            modern full-stack TypeScript, cloud DevOps, and offensive security.
          </p>
        </motion.div>

        {/* Top Interactive Radar + Competency Spotlight Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10"
        >
          {/* Interactive 6-Axis SVG Radar Chart (5 Cols) */}
          <SpotlightCard className="lg:col-span-5 p-5 sm:p-6 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                6-Axis Skill Telemetry
              </span>
              <span className="text-[10px] font-mono text-[#00F0FF] px-2 py-0.5 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/25">
                Interactive — Click Axis
              </span>
            </div>

            <svg
              viewBox="0 0 320 300"
              className="w-full max-w-[320px] h-auto overflow-visible"
              role="img"
              aria-label="Six-axis technical skill competency radar chart"
            >
              <defs>
                <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.22" />
                </linearGradient>
                <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF8A00" />
                  <stop offset="100%" stopColor="#00F0FF" />
                </linearGradient>
              </defs>

              {/* Concentric Hexagonal Grid Rings */}
              {ringLevels.map((lvl) => {
                const pts = RADAR_AXES.map((_, i) => {
                  const pt = getPoint(i, lvl);
                  return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                }).join(' ');
                return (
                  <polygon
                    key={lvl}
                    points={pts}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radial Spokes */}
              {RADAR_AXES.map((axis, i) => {
                const outer = getPoint(i, 100);
                const isFocused = axis.id === focusedAxisId;
                return (
                  <line
                    key={axis.id}
                    x1={cx}
                    y1={cy}
                    x2={outer.x}
                    y2={outer.y}
                    stroke={isFocused ? 'rgba(255, 138, 0, 0.55)' : 'rgba(255,255,255,0.08)'}
                    strokeWidth={isFocused ? 1.5 : 1}
                  />
                );
              })}

              {/* Animated Competency Polygon */}
              <motion.polygon
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
                points={dataPolygonPoints}
                fill="url(#radarFill)"
                stroke="url(#radarStroke)"
                strokeWidth="2"
              />

              {/* Interactive Axis Nodes & Labels */}
              {RADAR_AXES.map((axis, i) => {
                const pt = getPoint(i, axis.score);
                const lbl = getPoint(i, 122);
                const isFocused = axis.id === focusedAxisId;

                return (
                  <g
                    key={axis.id}
                    onClick={() => {
                      sounds.playClick();
                      setFocusedAxisId(axis.id);
                      setSelectedDomain(axis.id);
                    }}
                    onMouseEnter={() => setFocusedAxisId(axis.id)}
                    className="cursor-pointer"
                  >
                    {isFocused && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={10}
                        fill="rgba(255, 138, 0, 0.22)"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isFocused ? 5.5 : 4}
                      fill={isFocused ? '#FF8A00' : '#00F0FF'}
                      stroke="#05070B"
                      strokeWidth="2"
                    />
                    <text
                      x={lbl.x}
                      y={lbl.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[10px] font-mono select-none transition-colors ${
                        isFocused ? 'fill-[#FF9E2C] font-bold' : 'fill-slate-400'
                      }`}
                    >
                      {axis.shortLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </SpotlightCard>

          {/* Focused Axis Readout + Core Engineering Summary (7 Cols) */}
          <SpotlightCard className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={focusedAxis.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#FF8A00] uppercase font-semibold">
                      Selected Discipline
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                      {focusedAxis.label}
                    </h3>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-[#05080F] border border-[#FF6B00]/30 text-right font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">Index</div>
                    <div className="text-xl font-bold text-[#FF9E2C] tabular-nums">
                      {focusedAxis.score}
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{focusedAxis.summary}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {focusedAxis.topSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.09] text-xs font-mono text-slate-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quick Axis Switcher Pills + Preferred Languages Callout */}
            <div className="space-y-4 pt-4 border-t border-white/[0.07]">
              <div className="flex flex-wrap gap-1.5">
                {RADAR_AXES.map((axis) => (
                  <button
                    key={axis.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setFocusedAxisId(axis.id);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                      focusedAxisId === axis.id
                        ? 'bg-[#FF6B00]/20 border border-[#FF6B00]/45 text-[#FF9E2C] font-semibold'
                        : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    {axis.shortLabel} ({axis.score})
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-[#05080F] border border-white/[0.07] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-400">
                  <Layers className="w-4 h-4 text-[#FF8A00]" />
                  <span>Preferred Core:</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-slate-100">
                  <span className="inline-flex items-center gap-1.5">
                    <JavaIcon className="w-4 h-4" /> Java 21 LTS
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CppIcon className="w-4 h-4" /> C / C++
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <PythonIcon className="w-4 h-4" /> Python
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <TypeScriptIcon className="w-4 h-4" /> TypeScript
                  </span>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Interactive Skill Domain Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter skills by engineering domain"
          className="flex flex-wrap items-center gap-2 mb-8"
        >
          <button
            role="tab"
            type="button"
            aria-selected={selectedDomain === 'all'}
            onClick={() => {
              sounds.playClick();
              setSelectedDomain('all');
            }}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              selectedDomain === 'all'
                ? 'text-black font-bold'
                : 'bg-white/[0.03] border border-white/[0.07] text-slate-400 hover:text-white'
            }`}
          >
            {selectedDomain === 'all' && (
              <motion.span
                layoutId="skillFilterPill"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-[#FF8A00] -z-10"
              />
            )}
            All Domains ({totalSkillsCount})
          </button>

          {SKILL_DOMAINS.map((domain) => {
            const active = selectedDomain === domain.id;
            return (
              <button
                key={domain.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => {
                  sounds.playClick();
                  setSelectedDomain(domain.id);
                  setFocusedAxisId(domain.id);
                }}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  active
                    ? 'text-black font-bold'
                    : 'bg-white/[0.03] border border-white/[0.07] text-slate-400 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="skillFilterPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-[#FF8A00] -z-10"
                  />
                )}
                {domain.shortTitle} ({domain.items.length})
              </button>
            );
          })}
        </div>

        {/* Animated Skill Domain Grid */}
        <motion.div
          layout
          className={`grid grid-cols-1 ${
            visibleDomains.length === 1 ? 'md:grid-cols-1 max-w-4xl' : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-5 mb-10`}
        >
          <AnimatePresence mode="popLayout">
            {visibleDomains.map((domain, idx) => (
              <motion.div
                key={domain.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <SpotlightCard
                  className="p-5 sm:p-6 h-full flex flex-col"
                  spotlightColor={
                    domain.accent === 'orange'
                      ? 'rgba(255, 107, 0, 0.13)'
                      : 'rgba(0, 240, 255, 0.11)'
                  }
                >
                  {/* Domain Card Header */}
                  <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-white/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        {DOMAIN_ICONS[domain.id]}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-white text-base">
                          {domain.title}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-400">{domain.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skill Rows with Animated Progress Bars */}
                  <div
                    className={`grid grid-cols-1 ${
                      visibleDomains.length === 1 ? 'sm:grid-cols-2 gap-3.5' : 'gap-3'
                    }`}
                  >
                    {domain.items.map((item, itemIdx) => {
                      const brandIcon = getSkillIcon(item.name);
                      return (
                        <div
                          key={item.name}
                          className="p-3 rounded-lg bg-[#060911]/90 border border-white/[0.05] hover:border-white/[0.14] transition-colors space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {brandIcon}
                              <span className="text-xs font-semibold text-slate-100 truncate">
                                {item.name}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border shrink-0 ${
                                TIER_STYLES[item.exp] || TIER_STYLES.Proficient
                              }`}
                            >
                              {item.exp}
                            </span>
                          </div>

                          {/* Animated Proficiency Meter */}
                          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.proficiency}%` }}
                              viewport={{ once: true, amount: 0.4 }}
                              transition={{
                                duration: 0.75,
                                delay: 0.08 + itemIdx * 0.05,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className={`h-full rounded-full bg-gradient-to-r ${BAR_GRADIENTS[domain.accent]}`}
                            />
                          </div>

                          <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                            <span className="truncate" title={item.detail}>
                              {item.detail}
                            </span>
                            <span className="text-slate-300 font-semibold tabular-nums shrink-0">
                              {item.proficiency}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Daily Developer Workbench & Tooling Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <SpotlightCard className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-semibold">
                <Wrench className="w-4 h-4 text-[#FF8A00]" />
                <span>DAILY ENGINEERING ENVIRONMENT &amp; TOOLING</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Linux / Windows • Active DSA &amp; Open Source
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DEV_TOOLING.map((tool) => (
                <div
                  key={tool.name}
                  className="px-3 py-2.5 rounded-lg bg-[#05080F] border border-white/[0.06] hover:border-[#FF8A00]/35 transition-colors"
                >
                  <div className="text-xs font-semibold text-white">{tool.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{tool.role}</div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
};
