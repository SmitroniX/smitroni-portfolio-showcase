import React, { useState } from 'react';
import { ArrowRight, FileDown, Terminal, GraduationCap, ShieldCheck, Copy, Check, Sparkles, Activity } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'engine' | 'pwa' | 'cloud'>('engine');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    engine: `// ShadowLauncher: Android Native C++ Core (GL4ES Bridge)
class NativeGraphicsPipeline {
    static constexpr double TARGET_FRAME_TIME_MS = 7.24; // 138 FPS Locked
    
    void dispatchRenderLoop(EGLDisplay dpy, EGLSurface surf) {
        setNativeThreadPriority(THREAD_PRIORITY_URGENT_DISPLAY);
        while (mIsRunning.load(std::memory_order_relaxed)) {
            gl4es_flushFrameBuffers();
            eglSwapBuffers(dpy, surf); // Sub-8ms touch-to-photon
        }
    }
};`,
    pwa: `// SmiTriX: Privacy PWA with Biometric WebAuthn Passkeys
export async function authenticatePasskey(): Promise<AuthResult> {
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: generateLocalCryptographicChallenge(),
      userVerification: 'required',
      timeout: 30000,
    }
  });
  // 100% Client-side cryptographic verification with zero telemetry
  return verifyPasskeyLocally(credential);
}`,
    cloud: `// Shadow_API: High-Throughput Media Indexing Microservice
export async function handleStreamIndex(req: FastifyRequest, reply: FastifyReply) {
  const cacheKey = \`stream:\${req.params.id}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return reply.header('X-Cache', 'HIT').send(cached);

  const payload = await scrapeMediaCluster(req.params.id);
  await redis.setex(cacheKey, 3600, JSON.stringify(payload));
  return reply.header('X-Latency-Bench', '<150ms').send(payload);
}`
  };

  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid: Left Value Proposition + Right Interactive Code Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono text-slate-300">
                Available for SWE Internships &amp; Roles
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Asmit Jogdand
              </h1>
              <div className="text-xl sm:text-2xl text-slate-300 font-medium leading-snug">
                Full-Stack Software Engineer &amp; Systems Builder.{' '}
                <span className="text-cyan-400 font-mono text-lg sm:text-xl font-normal block sm:inline mt-1 sm:mt-0">
                  @SmitroniX
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
              Computer Engineering student at RAIT, Mumbai University. Maintaining an{' '}
              <strong className="text-slate-200">8.65 CGPA</strong>, founding captain of CTF team{' '}
              <strong className="text-slate-200">sudo Unknown (#331386)</strong>, and builder of native C++/Java game engines, privacy-first PWAs, and high-throughput cloud microservices.
            </p>

            {/* Credential Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-amber-300">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>CGPA 8.65 • RAIT Mumbai</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Capt. sudo Unknown</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-cyan-300">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>52+ Repositories</span>
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-semibold text-xs sm:text-sm hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileDown className="w-4 h-4 text-cyan-400" />
                <span>Download Resume</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="px-3.5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Sleek Interactive Code Console (5 Cols) */}
          <div className="lg:col-span-5">
            <SpotlightCard className="p-0 border border-white/[0.12] shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-black/40">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">architecture-benchmarks</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Code Tabs */}
              <div className="flex items-center border-b border-white/[0.06] bg-black/20 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('engine')}
                  className={`px-3.5 py-2 border-r border-white/[0.06] transition-colors ${
                    activeTab === 'engine'
                      ? 'bg-white/[0.06] text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ShadowLauncher.cpp
                </button>
                <button
                  onClick={() => setActiveTab('pwa')}
                  className={`px-3.5 py-2 border-r border-white/[0.06] transition-colors ${
                    activeTab === 'pwa'
                      ? 'bg-white/[0.06] text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SmiTriX.tsx
                </button>
                <button
                  onClick={() => setActiveTab('cloud')}
                  className={`px-3.5 py-2 transition-colors ${
                    activeTab === 'cloud'
                      ? 'bg-white/[0.06] text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Shadow_API.ts
                </button>
              </div>

              {/* Code Viewer */}
              <div className="p-4 bg-black/60 font-mono text-xs text-slate-300 overflow-x-auto min-h-[220px]">
                <pre className="text-[11px] leading-relaxed text-slate-300">
                  <code>{codeSnippets[activeTab]}</code>
                </pre>
              </div>

              {/* Bottom Benchmark Metrics Bar */}
              <div className="grid grid-cols-3 divide-x divide-white/[0.08] border-t border-white/[0.08] bg-black/40 text-center py-2.5 font-mono text-[11px]">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Engine FPS</div>
                  <div className="text-cyan-400 font-bold">138 FPS (120Hz)</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Input Latency</div>
                  <div className="text-emerald-400 font-bold">&lt;7.2ms Frame</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Security</div>
                  <div className="text-purple-400 font-bold">WebAuthn Zero-Trust</div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Quick Tech Ticker Bar (Linear Style) */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-200 font-medium">Core Stack:</span>
            <span>React 19 • TypeScript • Java 21 • C/C++ • Node.js • Docker • AWS</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://github.com/SmitroniX"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              github.com/SmitroniX ↗
            </a>
            <a
              href="https://linkedin.com/in/asmit-jogdand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              linkedin/asmit-jogdand ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
