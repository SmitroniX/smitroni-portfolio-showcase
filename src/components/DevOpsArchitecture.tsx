import React, { useState } from 'react';
import { GitBranch, Box, Cloud, Activity, CheckCircle2, Terminal, Shield, ArrowRight, Server, RefreshCw, Cpu, Layers } from 'lucide-react';
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
    code: string;
  };
}

export const DevOpsArchitecture: React.FC = () => {
  const stages: PipelineStage[] = [
    {
      id: 'ci',
      step: '01',
      title: 'Automated CI & Validation',
      category: 'Continuous Integration',
      icon: <GitBranch className="w-5 h-5 text-[#FF8A00]" />,
      badge: 'GitHub Actions',
      metrics: { label: 'Pipeline Speed', value: '42s avg' },
      description: 'Every pull request triggers an automated GitHub Actions runner performing static analysis, strict TypeScript compilation, linting, and regression tests before merge.',
      specs: [
        'Automated branch protection & PR review gates',
        'TypeScript compiler dry-run (tsc --noEmit)',
        'ESLint strict ruleset & automated security audit',
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
      icon: <Box className="w-5 h-5 text-cyan-400" />,
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
      title: 'Cloud Orchestration & Edge',
      category: 'Deployment & Infrastructure',
      icon: <Cloud className="w-5 h-5 text-amber-400" />,
      badge: 'AWS & Vercel Edge',
      metrics: { label: 'Availability', value: '99.9% SLA' },
      description: 'Zero-downtime rolling deployments across AWS EC2, S3 static pipelines, and serverless edge functions with Cloudflare CDN caching and DDoS mitigation.',
      specs: [
        'AWS EC2 & S3 with secure IAM least-privilege policies',
        'Cloudflare reverse-proxy with edge SSL & gzip/brotli compression',
        'Zero-downtime blue/green rolling deployment strategy',
        'Automated DNS routing and SSL certificate renewal'
      ],
      snippet: {
        filename: 'infra/aws-deploy.sh',
        code: `#!/usr/bin/env bash
set -eo pipefail
echo "==> Deploying to AWS EC2 Production Node..."
docker pull smitronix/service:latest
docker stop live_app || true
docker run -d --name live_app \\
  --restart always -p 80:8080 \\
  -e NODE_ENV=production \\
  smitronix/service:latest
echo "==> Health check: $(curl -s -o /dev/null -w "%{http_code}" localhost/healthz)"`
      }
    },
    {
      id: 'observability',
      step: '04',
      title: 'Reliability & Observability',
      category: 'Monitoring & Telemetry',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      badge: 'Redis & Telemetry',
      metrics: { label: 'P95 Latency', value: '<150ms' },
      description: 'Distributed caching with Redis, structured logging with Winston, automated rate-limiting to prevent noisy neighbors, and real-time health probe endpoints.',
      specs: [
        'In-memory Redis caching with automatic TTL eviction',
        'Token Bucket rate limiting headers (X-RateLimit-Remaining)',
        'Structured JSON logging with request correlation IDs',
        'Liveness & Readiness probe endpoints (/healthz, /ready)'
      ],
      snippet: {
        filename: 'src/middleware/health.ts',
        code: `app.get("/healthz", async (req, res) => {
  const dbStatus = await checkDbConnection();
  const redisStatus = await redis.ping();
  const healthy = dbStatus && redisStatus === "PONG";
  
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "UP" : "DEGRADED",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage().heapUsed
  });
});`
      }
    }
  ];

  const [activeStage, setActiveStage] = useState<PipelineStage>(stages[0]);

  return (
    <section id="devops" className="py-24 relative overflow-hidden bg-[#04070D]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-mono text-[#FF8A00] tracking-widest uppercase font-semibold">
              DevOps &amp; Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-1">
              Software Engineering &amp; CI/CD
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-sans mt-3 md:mt-0 max-w-md">
            Production-grade systems are more than code — they demand automated testing, container orchestration, low latencies, and resilient cloud architectures.
          </p>
        </div>

        {/* 4 Pipeline Stages Navigation Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stages.map((stage) => {
            const isSelected = activeStage.id === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveStage(stage);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-white/20 shadow-lg -translate-y-0.5'
                    : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-white/5">
                    {stage.icon}
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    STAGE {stage.step}
                  </span>
                </div>
                <div className="font-semibold text-sm text-white font-display">
                  {stage.title}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {stage.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Pipeline Stage Inspector */}
        <SpotlightCard className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Specs & Metrics (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF8A00] mb-1">
                  <span>{activeStage.category}</span>
                  <span>•</span>
                  <span>STAGE {activeStage.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  {activeStage.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mt-2 font-sans">
                  {activeStage.description}
                </p>
              </div>

              {/* Benchmark Stat Card */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Target Metric</div>
                  <div className="text-sm font-semibold text-slate-200">{activeStage.metrics.label}</div>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {activeStage.metrics.value}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Engineering Best Practices
                </div>
                <div className="space-y-2">
                  {activeStage.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Live Code Configuration (6 Cols) */}
            <div className="lg:col-span-6">
              <div className="rounded-xl bg-[#060A10] border border-white/10 overflow-hidden shadow-2xl">
                
                {/* Code Window Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-white/5 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-slate-300 ml-2 font-medium">{activeStage.snippet.filename}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">PRODUCTION CONFIG</span>
                </div>

                {/* Code Body */}
                <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed bg-[#060A10]">
                  <code>{activeStage.snippet.code}</code>
                </pre>

              </div>
            </div>

          </div>
        </SpotlightCard>

        {/* SWE Architecture Principles Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <SpotlightCard className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF8A00]">
              <Server className="w-4 h-4" /> Microservices
            </div>
            <h4 className="text-sm font-bold text-white">Loosely Coupled</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modular services communicating over REST and WebSockets with isolated failure domains.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <RefreshCw className="w-4 h-4" /> Multi-Tier Caching
            </div>
            <h4 className="text-sm font-bold text-white">Sub-150ms Responses</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browser HTTP caching, Cloudflare edge caching, and Redis in-memory lookup pipelines.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Shield className="w-4 h-4" /> Security &amp; Rate Limits
            </div>
            <h4 className="text-sm font-bold text-white">Defense in Depth</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              JWT token rotation, input sanitization, token-bucket rate limiting, and CORS headers.
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Cpu className="w-4 h-4" /> Clean Code &amp; Types
            </div>
            <h4 className="text-sm font-bold text-white">Strict TypeScript</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              End-to-end type safety preventing runtime bugs, regression suites, and automated linting.
            </p>
          </SpotlightCard>
        </div>

      </div>
    </section>
  );
};
