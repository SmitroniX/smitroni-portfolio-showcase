import React, { useState } from 'react';
import { GitBranch, Box, Cloud, Activity, CheckCircle2, ArrowRight, Server, Shield, Terminal } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

export const DevOpsArchitecture: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      id: 'ci',
      step: '01',
      title: 'Automated CI & Strict Validation',
      category: 'Continuous Integration',
      icon: <GitBranch className="w-5 h-5 text-cyan-400" />,
      badge: 'GitHub Actions',
      metrics: { label: 'Pipeline Speed', value: '42s avg' },
      description: 'Every pull request triggers an automated GitHub Actions runner performing static analysis, strict TypeScript compilation, security linting, and regression suites before merge.',
      specs: [
        'Automated branch protection & PR review gates',
        'TypeScript compiler dry-run (tsc --noEmit)',
        'ESLint strict ruleset & automated vulnerability audit',
        'Parallelized test matrix across Node.js LTS versions'
      ],
      snippet: {
        filename: '.github/workflows/ci.yml',
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
      - run: npm run build`
      }
    },
    {
      id: 'docker',
      step: '02',
      title: 'Multi-Stage Containerization',
      category: 'Build & Artifacts',
      icon: <Box className="w-5 h-5 text-purple-400" />,
      badge: 'Docker & Microservices',
      metrics: { label: 'Image Compression', value: '38 MB' },
      description: 'Containerized using production-grade multi-stage Docker builds with non-root security contexts, Alpine Linux bases, and zero unnecessary development artifacts.',
      specs: [
        'Multi-stage builds separating build tools from runtime',
        'Minimal Alpine Linux distribution for minimal attack surface',
        'Non-root user execution privileges for container security',
        'Layer caching to speed up CI/CD build repetitions'
      ],
      snippet: {
        filename: 'Dockerfile',
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
CMD ["node", "dist/server.js"]`
      }
    },
    {
      id: 'cloud',
      step: '03',
      title: 'Cloud Orchestration & Edge Delivery',
      category: 'Deployment & Infrastructure',
      icon: <Cloud className="w-5 h-5 text-amber-400" />,
      badge: 'Oracle ARM64 & AWS EC2',
      metrics: { label: 'Availability', value: '99.9% SLA' },
      description: 'Zero-downtime rolling deployments across Oracle Cloud ARM64 and AWS EC2 instances, reverse-proxied through Cloudflare edge caching, SSL termination, and DDoS mitigation.',
      specs: [
        'Oracle Cloud ARM64 Ampere A1 (4 OCPU, 24GB RAM host)',
        'Cloudflare reverse-proxy with edge SSL & gzip/brotli compression',
        'Zero-downtime blue/green rolling deployment strategy',
        'Automated database snapshots and encrypted off-site backups'
      ],
      snippet: {
        filename: 'docker-compose.prod.yml',
        code: `version: '3.8'
services:
  app:
    image: smitronix/api:latest
    restart: always
    environment:
      - NODE_ENV=production
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4096M`
      }
    },
    {
      id: 'monitoring',
      step: '04',
      title: 'Real-time Observability & Telemetry',
      category: 'Health & Resilience',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      badge: 'Prometheus & Uptime',
      metrics: { label: 'Response Latency', value: '<45ms p95' },
      description: 'Continuous health checks, structured JSON logging, and automated Discord webhook alerts notify of anomalous error spikes or resource exhaustion.',
      specs: [
        'Synthetic health endpoints (/health, /metrics) pinged every 30s',
        'Structured Pino context logging with trace IDs',
        'Circuit breakers tripping on repeated upstream timeouts',
        'Real-time Discord webhook alerts for instant incident triage'
      ],
      snippet: {
        filename: 'monitoring/healthcheck.ts',
        code: `export async function verifyServiceHealth() {
  const [db, cache] = await Promise.all([
    checkDatabaseConnection(),
    redis.ping()
  ]);
  return {
    status: db && cache === 'PONG' ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  };
}`
      }
    }
  ];

  return (
    <section id="architecture" className="py-24 relative overflow-hidden bg-black/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-purple-400 tracking-widest uppercase font-semibold">
              // Systems Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              DevOps &amp; Cloud Architecture
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-3 md:mt-0 leading-relaxed">
            From automated pull request linting to containerized microservices and zero-downtime rolling deployments.
          </p>
        </div>

        {/* Pipeline Stage Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stages.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                activeStage === idx
                  ? 'bg-white/[0.08] border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-cyan-400 font-bold">{stage.step}</span>
                {stage.icon}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white truncate">{stage.category}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{stage.badge}</div>
            </button>
          ))}
        </div>

        {/* Active Stage Detailed Breakdown Bento */}
        {stages[activeStage] && (
          <SpotlightCard className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Specifications */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                      Stage {stages[activeStage].step} • {stages[activeStage].category}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {stages[activeStage].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {stages[activeStage].description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {stages[activeStage].specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-4 text-xs font-mono">
                  <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                    <span className="text-slate-400">{stages[activeStage].metrics.label}: </span>
                    <span className="text-emerald-400 font-bold">{stages[activeStage].metrics.value}</span>
                  </div>
                </div>
              </div>

              {/* Right Code Artifact Snippet */}
              <div className="lg:col-span-6">
                <div className="rounded-xl bg-black/60 border border-white/[0.08] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-black/40 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{stages[activeStage].snippet.filename}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">YAML / DOCKER</span>
                  </div>
                  <pre className="p-4 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto">
                    <code>{stages[activeStage].snippet.code}</code>
                  </pre>
                </div>
              </div>

            </div>
          </SpotlightCard>
        )}

      </div>
    </section>
  );
};
