import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Box,
  Cloud,
  Activity,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  Play,
  Pause,
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import { SpotlightCard } from './SpotlightCard';
import { sounds } from '../utils/sound';

interface PipelineStage {
  id: string;
  step: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  badge: string;
  metrics: { label: string; value: string };
  description: string;
  specs: string[];
  snippet: {
    filename: string;
    lang: 'yaml' | 'docker' | 'typescript';
    label: string;
    code: string;
  };
}

const STAGES: PipelineStage[] = [
  {
    id: 'ci',
    step: '01',
    title: 'Automated CI & Strict Validation',
    category: 'Continuous Integration',
    icon: <GitBranch className="w-5 h-5 text-[#FF8A00]" />,
    badge: 'GitHub Actions',
    metrics: { label: 'Pipeline Speed', value: '42s avg' },
    description:
      'Every pull request triggers an automated GitHub Actions runner performing static analysis, strict TypeScript compilation, security linting, and regression suites before merge.',
    specs: [
      'Automated branch protection & PR review gates',
      'TypeScript compiler dry-run (tsc --noEmit)',
      'ESLint strict ruleset & dependency vulnerability audit',
      'Parallelized test matrix across Node.js LTS versions',
    ],
    snippet: {
      filename: '.github/workflows/ci.yml',
      lang: 'yaml',
      label: 'YAML',
      code: `name: Production CI
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit
      - run: npm run build`,
    },
  },
  {
    id: 'docker',
    step: '02',
    title: 'Multi-Stage Containerization',
    category: 'Build & Artifacts',
    icon: <Box className="w-5 h-5 text-[#00F0FF]" />,
    badge: 'Docker & Compose',
    metrics: { label: 'Image Footprint', value: '38 MB' },
    description:
      'Containerized using production-grade multi-stage Docker builds with non-root security contexts, Alpine Linux bases, and zero unnecessary development artifacts.',
    specs: [
      'Multi-stage builds separating build tools from runtime',
      'Minimal Alpine Linux base for reduced attack surface',
      'Non-root user execution privileges for container isolation',
      'Deterministic layer caching for sub-minute rebuilds',
    ],
    snippet: {
      filename: 'Dockerfile',
      lang: 'docker',
      label: 'DOCKERFILE',
      code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
USER node
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]`,
    },
  },
  {
    id: 'cloud',
    step: '03',
    title: 'Cloud Orchestration & Edge Delivery',
    category: 'Deployment & Infra',
    icon: <Cloud className="w-5 h-5 text-amber-400" />,
    badge: 'AWS EC2 & Oracle ARM64',
    metrics: { label: 'Availability', value: '99.9% SLA' },
    description:
      'Zero-downtime rolling deployments across AWS EC2 and Oracle Cloud ARM64 nodes, reverse-proxied through Cloudflare edge caching, TLS termination, and DDoS mitigation.',
    specs: [
      'Sharded microservices & bots supporting 50,000+ active users',
      'Cloudflare reverse-proxy with edge SSL & brotli compression',
      'Zero-downtime blue/green rolling deployment strategy',
      'Automated database snapshots and encrypted S3 backups',
    ],
    snippet: {
      filename: 'docker-compose.prod.yml',
      lang: 'yaml',
      label: 'COMPOSE',
      code: `services:
  api:
    image: smitronix/api:latest
    restart: always
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://cache:6379
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4096M`,
    },
  },
  {
    id: 'monitoring',
    step: '04',
    title: 'Real-Time Observability & Telemetry',
    category: 'Health & Resilience',
    icon: <Activity className="w-5 h-5 text-emerald-400" />,
    badge: 'Health & Alerts',
    metrics: { label: 'p95 Latency', value: '<45ms' },
    description:
      'Continuous health probes, structured JSON logging, circuit breakers, and automated webhook alerts catch anomalous error spikes or resource exhaustion immediately.',
    specs: [
      'Synthetic health endpoints (/health, /metrics) probed every 30s',
      'Structured JSON logging with request trace correlation IDs',
      'Circuit breakers tripping on repeated upstream timeouts',
      'Real-time Discord webhook alerts for instant incident triage',
    ],
    snippet: {
      filename: 'monitoring/healthcheck.ts',
      lang: 'typescript',
      label: 'TYPESCRIPT',
      code: `export async function verifyServiceHealth() {
  const [db, cache] = await Promise.all([
    checkDatabaseConnection(),
    redis.ping(),
  ]);
  return {
    status: db && cache === 'PONG' ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
}`,
    },
  },
];

export const DevOpsArchitecture: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Subtle auto-advance so pipeline visually feels alive until user interacts
  useEffect(() => {
    if (!autoPlay) return;
    const timer = window.setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [autoPlay]);

  const current = STAGES[activeStage];

  const highlightedLines = useMemo(() => {
    const grammar = Prism.languages[current.snippet.lang] || Prism.languages.javascript;
    return Prism.highlight(current.snippet.code, grammar, current.snippet.lang).split('\n');
  }, [current]);

  const handleCopySnippet = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(current.snippet.code);
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <section
      id="architecture"
      className="py-24 relative overflow-hidden border-y border-white/[0.05] bg-[#070A12]/55"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-xs font-mono text-[#00F0FF] tracking-widest uppercase font-semibold">
              // Production Delivery Pipeline
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              DevOps &amp; Cloud Architecture
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setAutoPlay((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] text-xs font-mono text-slate-300 cursor-pointer transition-colors"
            >
              {autoPlay ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#FF8A00]" />
                  <span>Auto-Flow: ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auto-Flow: PAUSED</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Animated Data-Flow Stage Selector with Connecting Signal Rail */}
        <div className="relative mb-8">
          {/* Desktop Animated Signal Trace Line Behind Buttons */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-1/2 left-8 right-8 h-px bg-white/[0.08] -translate-y-1/2 pointer-events-none overflow-hidden"
          >
            <motion.div
              animate={{ x: ['-20%', '120%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
              className="w-36 h-full bg-gradient-to-r from-transparent via-[#FF8A00] to-[#00F0FF]"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
            {STAGES.map((stage, idx) => {
              const active = activeStage === idx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveStage(idx);
                    setAutoPlay(false);
                  }}
                  className={`relative p-4 rounded-xl text-left border transition-all cursor-pointer backdrop-blur-md ${
                    active
                      ? 'bg-[#0C1220] border-[#FF8A00]/55 shadow-lg shadow-[#FF6B00]/10'
                      : 'bg-[#080C15]/90 border-white/[0.07] hover:border-white/[0.18]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pipelineActiveBorder"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-x-3 bottom-0 h-[2px] bg-gradient-to-r from-[#FF6B00] to-[#00F0FF]"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        active ? 'text-[#FF8A00]' : 'text-slate-500'
                      }`}
                    >
                      STAGE {stage.step}
                    </span>
                    {stage.icon}
                  </div>
                  <div className="text-xs sm:text-sm font-display font-bold text-white truncate">
                    {stage.category}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                    {stage.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Breakdown Card */}
        <SpotlightCard className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Specifications */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF8A00] font-semibold uppercase">
                    <span>
                      Stage {current.step} • {current.category}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {current.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {current.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {current.specs.map((spec, i) => (
                    <motion.div
                      key={spec}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <div className="px-3.5 py-2 rounded-lg bg-[#05080F] border border-white/[0.08]">
                    <span className="text-slate-400">{current.metrics.label}: </span>
                    <span className="text-emerald-400 font-bold">{current.metrics.value}</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-lg bg-[#05080F] border border-white/[0.08]">
                    <span className="text-slate-400">Artifact: </span>
                    <span className="text-[#FF9E2C] font-semibold">{current.snippet.label}</span>
                  </div>
                </div>
              </div>

              {/* Right Syntax-Highlighted Artifact */}
              <div className="lg:col-span-6">
                <div className="rounded-xl bg-[#05080F] border border-white/[0.09] overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[#080C15] text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-2 truncate">
                      <Terminal className="w-3.5 h-3.5 text-[#FF8A00] shrink-0" />
                      <span className="truncate text-slate-200">{current.snippet.filename}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySnippet}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.12] text-[10px] text-slate-300 cursor-pointer shrink-0 transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 text-[11px] font-mono leading-[1.65] overflow-x-auto">
                    {highlightedLines.map((lineHtml, idx) => (
                      <div key={idx} className="flex items-start">
                        <span
                          aria-hidden="true"
                          className="w-6 pr-3 text-right select-none text-slate-600 shrink-0 tabular-nums"
                        >
                          {idx + 1}
                        </span>
                        <span
                          className="whitespace-pre text-slate-200"
                          dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </SpotlightCard>
      </div>
    </section>
  );
};
