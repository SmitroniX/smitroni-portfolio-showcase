import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight,
  FileDown,
  Terminal,
  GraduationCap,
  ShieldCheck,
  Copy,
  Check,
  Play,
  Code2,
  Cpu,
  Radio,
  Sparkles,
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SpotlightCard } from './SpotlightCard';
import { KineticText } from './KineticText';
import { Magnetic } from './Magnetic';
import { sounds } from '../utils/sound';

interface HeroProps {
  onOpenTerminal: () => void;
  onOpenCompiler: () => void;
}

type CodeTabKey = 'engine' | 'pwa' | 'cloud' | 'jvm';

interface CodeTabConfig {
  id: CodeTabKey;
  filename: string;
  lang: 'cpp' | 'typescript' | 'java';
  code: string;
  runCommand: string;
  logs: string[];
  metricLabel: string;
  metricValue: string;
}

const CODE_TABS: CodeTabConfig[] = [
  {
    id: 'engine',
    filename: 'ShadowLauncher.cpp',
    lang: 'cpp',
    metricLabel: 'Render Output',
    metricValue: '138 FPS • 7.2ms',
    runCommand: './bench_gl4es --display=120hz --touch=raw',
    logs: [
      '[NDK] Mounted GL4ES OpenGL ES 3.2 translation bridge',
      '[MEM] Dynamic heap allocator locked (0 OOM events)',
      '[BENCH] 138.4 FPS sustained | Frame time: 7.22ms | Touch: 6.4ms',
      '✓ PASS — Desktop-class pipeline verified on ARM64',
    ],
    code: `// ShadowLauncher: Android Native C++ Core (GL4ES Bridge)
class NativeGraphicsPipeline {
  static constexpr double TARGET_MS = 7.24; // 138 FPS

  void dispatchRenderLoop(EGLDisplay dpy, EGLSurface surf) {
    setNativeThreadPriority(THREAD_PRIORITY_URGENT_DISPLAY);
    while (mRunning.load(std::memory_order_relaxed)) {
      gl4es_flushFrameBuffers();
      eglSwapBuffers(dpy, surf); // <8ms touch-to-photon
    }
  }
};`,
  },
  {
    id: 'pwa',
    filename: 'SmiTriX.tsx',
    lang: 'typescript',
    metricLabel: 'Zero Telemetry',
    metricValue: 'WebAuthn Local',
    runCommand: 'vitest run webauthn.passkey.spec.ts',
    logs: [
      '[CRYPTO] Generated 32-byte CSPRNG challenge locally',
      '[BIOMETRIC] Platform authenticator assertion verified',
      '[INDEXEDDB] 1,324 exercises synced offline (0 external calls)',
      '✓ PASS — 100% local-first privacy invariant holds',
    ],
    code: `// SmiTriX: Privacy PWA with Biometric WebAuthn Passkeys
export async function authenticatePasskey(): Promise<AuthResult> {
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: generateLocalCryptographicChallenge(),
      userVerification: 'required',
      timeout: 30000,
    },
  });
  // Zero analytics, zero third-party telemetry
  return verifyPasskeyLocally(credential);
}`,
  },
  {
    id: 'cloud',
    filename: 'Shadow_API.ts',
    lang: 'typescript',
    metricLabel: 'p95 Latency',
    metricValue: '<150ms Cached',
    runCommand: 'curl -sI https://shadowapi-bice.vercel.app/v2/stream',
    logs: [
      'HTTP/2 200 OK | X-Cache: HIT (Redis Cluster)',
      'X-RateLimit-Remaining: 119/120 | Edge: BOM-India',
      '[BENCH] Cold miss: 128ms | Warm Redis HIT: 19ms',
      '✓ PASS — Sub-150ms SLA met at 50K+ user scale',
    ],
    code: `// Shadow_API: High-Throughput Media Indexing Microservice
export async function handleStreamIndex(req: Req, reply: Reply) {
  const cacheKey = \`stream:\${req.params.id}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return reply.header('X-Cache', 'HIT').send(cached);

  const payload = await scrapeMediaCluster(req.params.id);
  await redis.setex(cacheKey, 3600, JSON.stringify(payload));
  return reply.header('X-Latency-Bench', '<150ms').send(payload);
}`,
  },
  {
    id: 'jvm',
    filename: 'Packet.java',
    lang: 'java',
    metricLabel: 'Tick Stability',
    metricValue: '20.0 TPS • Low GC',
    runCommand: 'java -XX:+UseZGC -jar packet-bench.jar --clients=5000',
    logs: [
      '[JVM] Java 21 LTS ZGC pause time: 0.31ms max',
      '[NET] Netty epoll batch flush active (zero-copy buffer)',
      '[TPS] 20.00 / 20.00 stable across 5,000 concurrent players',
      '✓ PASS — Zero tick drops under peak load',
    ],
    code: `// High-Throughput Java 21 Server Extension & Packet Batching
public final class PacketDispatchPipeline {
  private final ConcurrentLinkedQueue<Packet> ring = new ConcurrentLinkedQueue<>();

  public void flushTick(ServerTickEvent tick) {
    int drained = 0;
    while (drained < BATCH_CAP && !ring.isEmpty()) {
      dispatchZeroCopy(ring.poll()); // Minimizes GC pressure
      drained++;
    }
  }
}`,
  },
];

// Smooth animated metric counter
const AnimatedStatCounter: React.FC<{
  target: number;
  decimals?: number;
  suffix?: string;
}> = ({ target, decimals = 0, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1100;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setVal(target);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val)}
      {suffix}
    </span>
  );
};

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal, onOpenCompiler }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeTabKey>('engine');
  const [roleIdx, setRoleIdx] = useState(0);
  const [typedRole, setTypedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [avatarPinged, setAvatarPinged] = useState(false);

  const currentTab = useMemo(
    () => CODE_TABS.find((t) => t.id === activeTab) ?? CODE_TABS[0],
    [activeTab]
  );

  // Typewriter cycling through developer roles
  useEffect(() => {
    const roles = PERSONAL_INFO.rotatingRoles;
    const target = roles[roleIdx];
    const speed = isDeleting ? 28 : 52;

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        const next = target.slice(0, typedRole.length + 1);
        setTypedRole(next);
        if (next === target) {
          window.setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        const next = target.slice(0, typedRole.length - 1);
        setTypedRole(next);
        if (next === '') {
          setIsDeleting(false);
          setRoleIdx((prev) => (prev + 1) % roles.length);
        }
      }
    }, speed);

    return () => window.clearTimeout(timer);
  }, [typedRole, isDeleting, roleIdx]);

  // Syntax highlight current snippet with PrismJS
  const highlightedLines = useMemo(() => {
    const grammar = Prism.languages[currentTab.lang] || Prism.languages.javascript;
    const html = Prism.highlight(currentTab.code, grammar, currentTab.lang);
    return html.split('\n');
  }, [currentTab]);

  // Reset runner logs when switching tabs
  useEffect(() => {
    setVisibleLogs([]);
    setIsRunning(false);
  }, [activeTab]);

  const handleRunSnippet = () => {
    if (isRunning) return;
    sounds.playInject();
    setIsRunning(true);
    setVisibleLogs([`$ ${currentTab.runCommand}`]);

    currentTab.logs.forEach((line, idx) => {
      window.setTimeout(() => {
        setVisibleLogs((prev) => [...prev, line]);
        if (idx === currentTab.logs.length - 1) {
          setIsRunning(false);
          sounds.playSuccess();
        }
      }, (idx + 1) * 280);
    });
  };

  const handleCopyEmail = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 overflow-hidden">
      {/* Subtle Signature Ember + Cyan Ambient Aura */}
      <div
        aria-hidden="true"
        className="absolute top-12 left-1/4 -translate-x-1/2 w-[560px] h-[340px] bg-gradient-to-br from-[#FF6B00]/12 via-[#FF8A00]/6 to-transparent rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-28 right-1/4 translate-x-1/3 w-[480px] h-[300px] bg-gradient-to-bl from-[#00F0FF]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Grid: Left Developer Identity + Right Interactive Executable IDE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center mb-14">
          {/* Left Column (7 Cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-5"
          >
            {/* Developer Status & Interactive Identity Pill */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A0E17]/90 border border-emerald-500/30 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono text-emerald-300 font-medium">
                  {PERSONAL_INFO.currently.available}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setAvatarPinged(true);
                  window.setTimeout(() => setAvatarPinged(false), 900);
                }}
                className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] transition-all cursor-pointer group"
                title="Verified GitHub Developer Profile"
              >
                <img
                  src={PERSONAL_INFO.avatarUrl}
                  alt="Asmit Jogdand avatar"
                  className={`w-6 h-6 rounded-full object-cover border transition-transform duration-500 ${
                    avatarPinged
                      ? 'border-[#FF8A00] scale-110'
                      : 'border-white/20 group-hover:border-[#FF8A00]'
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-[11px] font-mono text-slate-300">
                  <span className="text-[#FF8A00]">@</span>SmitroniX
                </span>
              </button>
            </motion.div>

            {/* Terminal Prompt + Kinetic Display Heading */}
            <motion.div variants={itemVariants} className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-[#FF8A00] font-bold">smitronix@dev</span>
                <span className="text-slate-600">:</span>
                <span className="text-[#00F0FF]">~/portfolio</span>
                <span className="text-slate-500">$</span>
                <span className="text-slate-300">whoami --verbose</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                <KineticText
                  text="Asmit Jogdand"
                  as="span"
                  triggerOnMount
                  scrambleOnHover
                  speed={26}
                  className="text-white"
                />
                <span className="text-[#FF6B00]">.</span>
              </h1>

              {/* Live Typewriter Role Line */}
              <div className="min-h-[32px] sm:min-h-[36px] flex items-center text-lg sm:text-2xl font-display font-semibold text-slate-200">
                <span className="text-[#FF8A00] font-mono mr-2 text-base sm:text-xl">&gt;</span>
                <span className="text-gradient-dev">{typedRole}</span>
                <span
                  aria-hidden="true"
                  className="inline-block w-2.5 h-5 sm:h-6 bg-[#FF8A00] ml-1 align-middle animate-blink"
                />
              </div>
            </motion.div>

            {/* Concise Authentic Bio */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl"
            >
              Computer Engineering student at{' '}
              <strong className="text-white font-semibold">RAIT, Mumbai University</strong>{' '}
              (<span className="text-[#FF9E2C] font-mono">8.65 CGPA</span>). Founding captain of
              Hack The Box team{' '}
              <strong className="text-white font-semibold">sudo Unknown (#331386)</strong> — I
              engineer native <span className="text-[#00F0FF] font-mono">C++/Java</span> graphics
              engines, zero-telemetry PWAs, and sub-150ms cloud microservices.
            </motion.p>

            {/* Engineering Credential Chips */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-2 text-xs font-mono"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0E17] border border-[#FF6B00]/25 text-[#FFB84D]">
                <GraduationCap className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>RAIT Mumbai • 8.65 CGPA</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0E17] border border-[#00F0FF]/25 text-[#67E8F9]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>HTB Captain #331386</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A0E17] border border-emerald-500/25 text-emerald-300">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ex-Intern @ Naviotech</span>
              </span>
            </motion.div>

            {/* Primary Magnetic Action Row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-2 pt-2"
            >
              <Magnetic strength={0.22} radius={70}>
                <a
                  href="#projects"
                  onClick={() => sounds.playClick()}
                  className="px-4 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF8A00] text-black font-bold text-xs sm:text-[13px] transition-all flex items-center gap-1.5 shadow-lg shadow-[#FF6B00]/25 active:scale-[0.98]"
                >
                  <span>Explore Systems</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </Magnetic>

              <Magnetic strength={0.2} radius={70}>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenCompiler();
                  }}
                  className="px-3.5 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-[#00F0FF]/35 text-[#00F0FF] hover:text-white font-mono font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Cloud IDE</span>
                </button>
              </Magnetic>

              <a
                href={PERSONAL_INFO.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.playClick()}
                className="px-3.5 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.12] text-slate-100 font-medium text-xs transition-all flex items-center gap-1.5 active:scale-[0.98]"
              >
                <FileDown className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Resume</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenTerminal();
                }}
                className="px-3 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                title="Launch Interactive Developer Shell (Cmd+K)"
              >
                <Terminal className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>⌘K Shell</span>
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Email</span>
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Live Syntax-Highlighted & Executable Code Workbench (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <SpotlightCard
              enableTilt
              maxTilt={3}
              className={`border ${
                isRunning
                  ? 'border-emerald-400/50 running-glow-border'
                  : 'border-white/[0.12]'
              } shadow-2xl`}
            >
              {/* IDE Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-[#060910]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/85" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/85" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/85" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">
                    smitronix-core — bench
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRunSnippet}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-[11px] font-mono font-bold text-emerald-300 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Bench'}</span>
                </button>
              </div>

              {/* File Tabs */}
              <div
                role="tablist"
                aria-label="Production code benchmarks"
                className="flex items-center overflow-x-auto border-b border-white/[0.07] bg-[#080C15] text-[11px] font-mono"
              >
                {CODE_TABS.map((tab) => {
                  const active = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => {
                        sounds.playClick();
                        setActiveTab(tab.id);
                      }}
                      className={`relative px-3 py-2 border-r border-white/[0.06] whitespace-nowrap transition-colors cursor-pointer ${
                        active
                          ? 'text-white bg-white/[0.05] font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.filename}
                      {active && (
                        <motion.span
                          layoutId="heroIdeTabIndicator"
                          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                          className="absolute inset-x-0 bottom-0 h-[2px] bg-[#FF8A00]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Syntax-Highlighted Code Area with Line Numbers & Laser Scan */}
              <div className="relative bg-[#05080F] p-3.5 font-mono text-[11px] leading-[1.65] overflow-x-auto min-h-[218px]">
                {isRunning && (
                  <>
                    <div className="laser-scan-beam" />
                    <div className="laser-scan-glow" />
                  </>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTab.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-0"
                  >
                    {highlightedLines.map((lineHtml, idx) => (
                      <div key={idx} className="flex items-start">
                        <span
                          aria-hidden="true"
                          className="w-7 pr-3 text-right select-none text-slate-600 shrink-0 tabular-nums"
                        >
                          {idx + 1}
                        </span>
                        <span
                          className="whitespace-pre text-slate-200"
                          dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }}
                        />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Live Benchmark Output Drawer */}
              <AnimatePresence>
                {visibleLogs.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-emerald-500/25 bg-[#04070C] px-3.5 py-2.5 font-mono text-[10px] space-y-1 overflow-hidden"
                  >
                    {visibleLogs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={
                          log.startsWith('✓')
                            ? 'text-emerald-400 font-semibold'
                            : log.startsWith('$')
                            ? 'text-[#FF9E2C]'
                            : 'text-slate-300'
                        }
                      >
                        {log}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Telemetry Strip */}
              <div className="grid grid-cols-3 divide-x divide-white/[0.07] border-t border-white/[0.08] bg-[#070B14] text-center py-2.5 font-mono text-[10px]">
                <div className="px-2">
                  <div className="text-slate-500 uppercase">Target</div>
                  <div className="text-[#FF9E2C] font-bold truncate">{currentTab.metricValue}</div>
                </div>
                <div className="px-2">
                  <div className="text-slate-500 uppercase">Runtime</div>
                  <div className="text-[#00F0FF] font-bold uppercase">{currentTab.lang}</div>
                </div>
                <div className="px-2">
                  <div className="text-slate-500 uppercase">Status</div>
                  <div className="text-emerald-400 font-bold">
                    {isRunning ? 'EXECUTING' : 'VERIFIED'}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* Animated Engineering Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          {PERSONAL_INFO.stats.map((stat, idx) => (
            <SpotlightCard
              key={stat.label}
              className="p-4 sm:p-5"
              spotlightColor={
                idx % 2 === 0 ? 'rgba(255, 107, 0, 0.14)' : 'rgba(0, 240, 255, 0.12)'
              }
            >
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-white">
                <AnimatedStatCounter
                  target={stat.numeric}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                />
              </div>
              <div className="mt-1 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                <span>{stat.note}</span>
              </div>
            </SpotlightCard>
          ))}
        </motion.div>

        {/* Live "Currently" Status & Direct Dev Profiles Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="pt-5 border-t border-white/[0.07] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono text-slate-400"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#FF8A00] animate-pulse" />
              <span className="text-slate-500">BUILDING:</span>
              <span className="text-slate-200">{PERSONAL_INFO.currently.building}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="text-slate-500">RESEARCHING:</span>
              <span className="text-slate-300">{PERSONAL_INFO.currently.learning}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#FF8A00] transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#00F0FF] transition-colors"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={PERSONAL_INFO.socials.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9E2C] transition-colors"
            >
              LeetCode ↗
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
