import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight, Globe } from 'lucide-react';
import { sounds } from '../utils/sound';

interface AppleHelloWelcomeProps {
  onComplete: () => void;
  onReplayChime?: () => void;
}

interface LanguageGreeting {
  lang: string;
  nativeLang: string;
  greeting: string;
  subtext: string;
}

const GREETINGS: LanguageGreeting[] = [
  { lang: 'English', nativeLang: 'English', greeting: 'hello', subtext: 'Welcome to my digital workshop' },
  { lang: 'Spanish', nativeLang: 'Español', greeting: 'hola', subtext: 'Bienvenido a mi portafolio' },
  { lang: 'French', nativeLang: 'Français', greeting: 'bonjour', subtext: 'Bienvenue dans mon univers' },
  { lang: 'Italian', nativeLang: 'Italiano', greeting: 'ciao', subtext: 'Benvenuto nel mio spazio' },
  { lang: 'Hindi', nativeLang: 'हिन्दी', greeting: 'नमस्ते', subtext: 'मेरे पोर्टफोलियो में आपका स्वागत है' },
  { lang: 'Japanese', nativeLang: '日本語', greeting: 'こんにちは', subtext: '私のポートフォリオへようこそ' },
  { lang: 'German', nativeLang: 'Deutsch', greeting: 'hallo', subtext: 'Willkommen in meiner Welt' },
  { lang: 'Portuguese', nativeLang: 'Português', greeting: 'olá', subtext: 'Bem-vindo ao meu portfólio' },
  { lang: 'Chinese', nativeLang: '简体中文', greeting: '你好', subtext: '欢迎来到我的主页' },
  { lang: 'Arabic', nativeLang: 'العربية', greeting: 'مرحباً', subtext: 'أهلاً بك في ملف أعمالي' },
];

const COLOR_THEMES = [
  { id: 'silver', name: 'Classic Silver', stroke: '#F8FAFC', glow: 'rgba(255, 255, 255, 0.45)', dot: 'bg-slate-200' },
  { id: 'amber', name: 'SmitroniX Amber', stroke: '#FF9E2C', glow: 'rgba(255, 158, 44, 0.55)', dot: 'bg-amber-400' },
  { id: 'blue', name: 'Pacific Blue', stroke: '#38BDF8', glow: 'rgba(56, 189, 248, 0.5)', dot: 'bg-sky-400' },
  { id: 'emerald', name: 'Aurora Emerald', stroke: '#34D399', glow: 'rgba(52, 211, 153, 0.5)', dot: 'bg-emerald-400' },
  { id: 'purple', name: 'Cosmic Violet', stroke: '#C084FC', glow: 'rgba(192, 132, 252, 0.5)', dot: 'bg-purple-400' },
];

export const AppleHelloWelcome: React.FC<AppleHelloWelcomeProps> = ({ onComplete }) => {
  const [isDrawnPath0, setIsDrawnPath0] = useState(false);
  const [isDrawnPath1, setIsDrawnPath1] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [progress, setProgress] = useState(0);

  const path0Ref = useRef<SVGPathElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const [path0Length, setPath0Length] = useState(1665);
  const [path1Length, setPath1Length] = useState(8135);

  // Exact Apple "hello." paths from official macOS vector assets
  const PATH_0 = "M-109.06069946289062,95.92639923095703 C1.9544999599456787,157.6403045654297 103.11389923095703,236.9969940185547 217.881103515625,372.07550048828125 C296,464.2846984863281 337.9999084472656,569.5725708007812 340,642.1939697265625 C341,696.1920166015625 314.6702880859375,737.156005859375 266,737.156005859375 C212,737.156005859375 178,696.1920166015625 157,602.1610107421875 C134,498.82000732421875 117,380.239990234375 74,0";
  const PATH_1 = "M78.21453094482422,37.160953521728516 C100.22924041748047,230.68260192871094 184,372 291,372 C355,372 395.6745910644531,321 384.1253967285156,248 C377.6238098144531,205 370.0873107910156,161 361.3063049316406,110 C351.0714111328125,46 380.3254089355469,-4 468.96173095703125,-4 C598.2246704101562,-4 739.2435302734375,67.83381652832031 811.4124145507812,179.0941619873047 C836,217 846,251 847,284 C848,344 814,389 754,389 C678,389 620,303 620,193 C620,75 684,-8 819.9180908203125,-8 C1004.7244873046875,-8 1209.4246826171875,213.84754943847656 1303.4808349609375,461.42327880859375 C1330.037353515625,531.3258056640625 1340,596.2349243164062 1340,641.593994140625 C1340,695.3764038085938 1323,736.673583984375 1275,736.673583984375 C1228,736.673583984375 1197,700.1784057617188 1169,642.5543823242188 C1136.1939697265625,575.7216186523438 1111.927734375,479.32598876953125 1102,370.3599853515625 C1077,96.94000244140625 1133,-4 1266.152099609375,-4 C1427.6083984375,-4 1607.1151123046875,220.92921447753906 1698.771728515625,462.18878173828125 C1725.037353515625,531.3258056640625 1735,596.2349243164062 1735,641.593994140625 C1735,695.3764038085938 1718,736.673583984375 1670,736.673583984375 C1623,736.673583984375 1592,700.1784057617188 1564,642.5543823242188 C1531.1939697265625,575.7216186523438 1506.927734375,479.32598876953125 1497,370.3599853515625 C1472,96.94000244140625 1528,-4 1646.906005859375,-4 C1765.623779296875,-4 1830.114990234375,99.48485565185547 1868.77880859375,209.3712158203125 C1907,318 1954,385 2052,385 C2133,385 2197,325 2197,212 C2197,87 2115.90087890625,-7 2013.41845703125,-8 C1923.234130859375,-9 1864,64 1870,174 C1877,296 1951,385 2048,385 C2104,385 2151.03564453125,360.1071472167969 2188,333 C2288.21435546875,259.8928527832031 2365.4287109375,305.0714416503906 2395,377.3571472167969";

  // Measure path lengths accurately in browser
  useEffect(() => {
    if (path0Ref.current) {
      try {
        const len = path0Ref.current.getTotalLength();
        if (len > 0) setPath0Length(len);
      } catch {}
    }
    if (path1Ref.current) {
      try {
        const len = path1Ref.current.getTotalLength();
        if (len > 0) setPath1Length(len);
      } catch {}
    }
  }, []);

  // Sequence the Apple "hello" handwriting animation & chime
  useEffect(() => {
    const chimeTimer = setTimeout(() => {
      sounds.playAppleChime();
    }, 150);

    const t0 = setTimeout(() => {
      setIsDrawnPath0(true);
    }, 180);

    const t1 = setTimeout(() => {
      setIsDrawnPath1(true);
    }, 600);

    const t2 = setTimeout(() => {
      setShowShimmer(true);
    }, 2200);

    return () => {
      clearTimeout(chimeTimer);
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Multilingual greeting rotation
  useEffect(() => {
    const greetingInterval = setInterval(() => {
      setGreetingIdx((prev) => (prev + 1) % GREETINGS.length);
    }, 1600);
    return () => clearInterval(greetingInterval);
  }, []);

  // Subtle bottom progress bar tracking the welcome sequence
  useEffect(() => {
    const duration = 4800;
    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          handleExit();
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    try {
      sessionStorage.setItem('hasSeenAppleHello', 'true');
    } catch {}

    setTimeout(() => {
      onComplete();
    }, 850);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        sounds.playClick();
        handleExit();
      } else if (e.key.toLowerCase() === 'c') {
        sounds.playAppleChime();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting]);

  const currentGreeting = GREETINGS[greetingIdx];

  return (
    <div
      onClick={handleExit}
      className={`fixed inset-0 z-[9999] flex flex-col justify-between bg-black text-white select-none cursor-pointer overflow-hidden transition-all duration-[850ms] ${
        isExiting
          ? 'opacity-0 scale-105 filter blur-xl pointer-events-none'
          : 'opacity-100 scale-100 filter blur-0'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      role="region"
      aria-label="Apple Hello Welcome Screen"
    >
      {/* Ambient Apple Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle 600px at 50% 45%, ${selectedTheme.glow}, transparent 70%)`,
        }}
      />

      {/* Subtle Noise Texture for authentic hardware screen feel */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      {/* Top Header Controls (Frosted Glass Apple Pill Buttons) */}
      <header
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-5 sm:pt-7 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Device & Location Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
            Macintosh System • Portfolio OS
          </span>
        </div>

        {/* Right: Audio Chime & Skip Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Apple Startup Chime Button */}
          <button
            onClick={() => {
              sounds.playAppleChime();
              setSoundEnabled(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs text-slate-200 transition-all hover:scale-105 active:scale-95"
            title="Play Apple Startup Chime [Key: C]"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="hidden sm:inline text-[11px] font-medium tracking-wide">Chime</span>
          </button>

          {/* Skip Button */}
          <button
            onClick={() => {
              sounds.playClick();
              handleExit();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-xs font-medium text-white transition-all hover:scale-105 active:scale-95 group shadow-sm"
            title="Skip Intro (Enter or Space)"
          >
            <span className="text-xs">Skip</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Center Stage: The Iconic Cursive "hello." */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 my-auto">
        <div className="w-full max-w-[620px] sm:max-w-[720px] md:max-w-[820px] mx-auto flex flex-col items-center">
          
          {/* Authentic Apple Cursive "hello." SVG Vector */}
          <div className="relative w-full aspect-[2620/860] flex items-center justify-center">
            <svg
              viewBox="-160 -60 2620 860"
              className="w-full h-full drop-shadow-2xl overflow-visible"
              style={{
                filter: showShimmer
                  ? `drop-shadow(0 0 28px ${selectedTheme.glow}) drop-shadow(0 0 8px ${selectedTheme.stroke})`
                  : `drop-shadow(0 0 16px ${selectedTheme.glow})`,
                transition: 'filter 1.2s ease-in-out',
              }}
            >
              <defs>
                <linearGradient id="appleStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={selectedTheme.stroke} />
                  <stop offset="60%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor={selectedTheme.stroke} />
                </linearGradient>
              </defs>

              <g transform="scale(1, -1) translate(0, -728.156005859375)">
                {/* Path 0: Initial leading loop of 'h' */}
                <path
                  ref={path0Ref}
                  d={PATH_0}
                  fill="none"
                  stroke="url(#appleStrokeGrad)"
                  strokeWidth="56"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: path0Length,
                    strokeDashoffset: isDrawnPath0 ? 0 : path0Length,
                    transition: 'stroke-dashoffset 0.65s cubic-bezier(0.35, 0, 0.25, 1)',
                  }}
                />

                {/* Path 1: Continuous cursive loop for rest of 'hello' */}
                <path
                  ref={path1Ref}
                  d={PATH_1}
                  fill="none"
                  stroke="url(#appleStrokeGrad)"
                  strokeWidth="56"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: path1Length,
                    strokeDashoffset: isDrawnPath1 ? 0 : path1Length,
                    transition: 'stroke-dashoffset 1.75s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                />
              </g>
            </svg>
          </div>

          {/* Multilingual Sub-Greeting & Developer Identity (Apple Setup typography) */}
          <div className="mt-4 sm:mt-6 text-center space-y-2.5 transition-all duration-500">
            
            {/* Dynamic Multilingual Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/10 backdrop-blur-md">
              <Globe className="w-3 h-3 text-slate-400" />
              <span className="text-xs font-medium text-slate-200 tracking-wide capitalize">
                {currentGreeting.greeting}
              </span>
              <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/10">
                {currentGreeting.nativeLang}
              </span>
            </div>

            {/* Subtext description */}
            <p className="text-xs sm:text-sm text-slate-300 font-normal tracking-wide h-5 transition-opacity duration-300">
              {currentGreeting.subtext}
            </p>

            {/* Author Credit */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono tracking-wider">
              <span>Asmit Jogdand</span>
              <span>•</span>
              <span className="text-amber-400/90 font-semibold">@SmitroniX</span>
              <span>•</span>
              <span>Full Stack & Cloud Systems</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer: Color Theme Switcher & Interaction Hint */}
      <footer
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 pb-5 sm:pb-7 flex flex-col sm:flex-row items-center justify-between gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Apple M-Series Palette Chooser */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 mr-1 hidden xs:inline">
            Finish:
          </span>
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTheme(theme);
                }}
                className={`w-4 h-4 rounded-full ${theme.dot} transition-all ${
                  selectedTheme.id === theme.id
                    ? 'ring-2 ring-white scale-110 shadow-sm'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
                title={`Theme: ${theme.name}`}
              />
            ))}
          </div>
        </div>

        {/* Apple Centered Hint */}
        <div
          onClick={handleExit}
          className="text-center group cursor-pointer flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="font-sans text-xs tracking-wide">
            Click anywhere or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[10px] font-mono text-slate-200">Enter</kbd> to explore
          </span>
        </div>

        {/* Right empty spacer for visual balance on desktop */}
        <div className="hidden sm:block w-28 text-right">
          <span className="text-[10px] font-mono text-slate-400">
            v2.4 • 2026
          </span>
        </div>
      </footer>

      {/* Thin Apple Progress Indicator at very bottom edge */}
      <div className="w-full h-0.5 bg-white/5 absolute bottom-0 left-0">
        <div
          className="h-full transition-all duration-75 ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: selectedTheme.stroke,
            boxShadow: `0 0 8px ${selectedTheme.glow}`,
          }}
        />
      </div>
    </div>
  );
};
