import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sound';

interface AppleHelloWelcomeProps {
  onComplete: () => void;
}

// Single continuous unbroken Apple "hello." vector path
const APPLE_HELLO_PATH = 
  "M-109.06069946289062,95.92639923095703 C1.9544999599456787,157.6403045654297 103.11389923095703,236.9969940185547 217.881103515625,372.07550048828125 C296,464.2846984863281 337.9999084472656,569.5725708007812 340,642.1939697265625 C341,696.1920166015625 314.6702880859375,737.156005859375 266,737.156005859375 C212,737.156005859375 178,696.1920166015625 157,602.1610107421875 C134,498.82000732421875 117,380.239990234375 74,0 L78.21453094482422,37.160953521728516 C100.22924041748047,230.68260192871094 184,372 291,372 C355,372 395.6745910644531,321 384.1253967285156,248 C377.6238098144531,205 370.0873107910156,161 361.3063049316406,110 C351.0714111328125,46 380.3254089355469,-4 468.96173095703125,-4 C598.2246704101562,-4 739.2435302734375,67.83381652832031 811.4124145507812,179.0941619873047 C836,217 846,251 847,284 C848,344 814,389 754,389 C678,389 620,303 620,193 C620,75 684,-8 819.9180908203125,-8 C1004.7244873046875,-8 1209.4246826171875,213.84754943847656 1303.4808349609375,461.42327880859375 C1330.037353515625,531.3258056640625 1340,596.2349243164062 1340,641.593994140625 C1340,695.3764038085938 1323,736.673583984375 1275,736.673583984375 C1228,736.673583984375 1197,700.1784057617188 1169,642.5543823242188 C1136.1939697265625,575.7216186523438 1111.927734375,479.32598876953125 1102,370.3599853515625 C1077,96.94000244140625 1133,-4 1266.152099609375,-4 C1427.6083984375,-4 1607.1151123046875,220.92921447753906 1698.771728515625,462.18878173828125 C1725.037353515625,531.3258056640625 1735,596.2349243164062 1735,641.593994140625 C1735,695.3764038085938 1718,736.673583984375 1670,736.673583984375 C1623,736.673583984375 1592,700.1784057617188 1564,642.5543823242188 C1531.1939697265625,575.7216186523438 1506.927734375,479.32598876953125 1497,370.3599853515625 C1472,96.94000244140625 1528,-4 1646.906005859375,-4 C1765.623779296875,-4 1830.114990234375,99.48485565185547 1868.77880859375,209.3712158203125 C1907,318 1954,385 2052,385 C2133,385 2197,325 2197,212 C2197,87 2115.90087890625,-7 2013.41845703125,-8 C1923.234130859375,-9 1864,64 1870,174 C1877,296 1951,385 2048,385 C2104,385 2151.03564453125,360.1071472167969 2188,333 C2288.21435546875,259.8928527832031 2365.4287109375,305.0714416503906 2395,377.3571472167969";

export const AppleHelloWelcome: React.FC<AppleHelloWelcomeProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(9838);
  const hasExitedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  // Lock body scroll so page doesn't shift behind welcome screen
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
      if (exitTimerRef.current !== null) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  // Measure path length dynamically in browser with 9838 fallback
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) setPathLength(len);
      } catch {}
    }
  }, []);

  const handleExit = () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    setIsExiting(true);

    exitTimerRef.current = window.setTimeout(() => {
      onComplete();
    }, 750);
  };

  // Orchestrate single smooth Apple handwriting drawing sequence
  useEffect(() => {
    // Attempt Apple startup chime
    const chimeTimer = setTimeout(() => {
      try {
        sounds.playAppleChime();
      } catch {}
    }, 100);

    // Fade in path and start handwriting stroke
    const startTimer = setTimeout(() => {
      setIsVisible(true);
      setIsDrawing(true);
    }, 80);

    // Glow sheen after path draws completely (~2.0s)
    const glowTimer = setTimeout(() => {
      setShowGlow(true);
    }, 2100);

    // Smooth auto-exit into website after handwriting finishes
    const autoExitTimer = setTimeout(() => {
      handleExit();
    }, 2850);

    return () => {
      clearTimeout(chimeTimer);
      clearTimeout(startTimer);
      clearTimeout(glowTimer);
      clearTimeout(autoExitTimer);
    };
  }, []);

  // Keyboard dismiss: Enter, Space, Escape (without blocking browser shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Never block browser reload (Ctrl+R, Cmd+R, F5) or DevTools (F12)
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (['Enter', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        try {
          sounds.playClick();
        } catch {}
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onClick={() => {
        try {
          sounds.playClick();
        } catch {}
        handleExit();
      }}
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black select-none cursor-pointer overflow-hidden touch-none transition-all duration-[750ms] ${
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
      {/* Pure, deep true-black OLED background */}
      <div className="absolute inset-0 bg-black pointer-events-none" />

      {/* The Iconic Apple Cursive "hello." */}
      <div className="relative z-10 w-full max-w-[540px] sm:max-w-[700px] md:max-w-[840px] px-6 sm:px-8 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="-160 -60 2620 860"
          className="w-full h-auto overflow-visible"
          style={{
            filter: showGlow
              ? 'drop-shadow(0 0 32px rgba(255, 255, 255, 0.55)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))'
              : 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.25))',
            transition: 'filter 0.9s ease-in-out',
          }}
        >
          <g transform="scale(1, -1) translate(0, -728.156005859375)">
            <path
              ref={pathRef}
              d={APPLE_HELLO_PATH}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="56"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: pathLength,
                strokeDashoffset: isDrawing ? 0 : pathLength,
                opacity: isVisible ? 1 : 0,
                transition: 'stroke-dashoffset 2.0s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease',
              }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
