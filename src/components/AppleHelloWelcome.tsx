import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sound';

interface AppleHelloWelcomeProps {
  onComplete: () => void;
}

export const AppleHelloWelcome: React.FC<AppleHelloWelcomeProps> = ({ onComplete }) => {
  const [isDrawnPath0, setIsDrawnPath0] = useState(false);
  const [isDrawnPath1, setIsDrawnPath1] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const path0Ref = useRef<SVGPathElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const [path0Length, setPath0Length] = useState(1665);
  const [path1Length, setPath1Length] = useState(8135);

  // Exact Apple "hello." vector paths from official macOS typography
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

  // Sequence the Apple "hello" handwriting animation & chime
  useEffect(() => {
    // Attempt Apple Startup Chime
    const chimeTimer = setTimeout(() => {
      sounds.playAppleChime();
    }, 150);

    // Step 1: Draw initial stroke of 'h'
    const t0 = setTimeout(() => {
      setIsDrawnPath0(true);
    }, 180);

    // Step 2: Seamlessly draw connected cursive body 'ello'
    const t1 = setTimeout(() => {
      setIsDrawnPath1(true);
    }, 550);

    // Step 3: Trigger Apple luminous glow sheen
    const t2 = setTimeout(() => {
      setShowShimmer(true);
    }, 2100);

    // Step 4: Smoothly auto-exit into website after handwriting completes
    const t3 = setTimeout(() => {
      handleExit();
    }, 2900);

    return () => {
      clearTimeout(chimeTimer);
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Keyboard controls: any key dismisses immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      sounds.playClick();
      handleExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting]);

  return (
    <div
      onClick={handleExit}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black select-none cursor-pointer overflow-hidden transition-all duration-[850ms] ${
        isExiting
          ? 'opacity-0 scale-105 filter blur-2xl pointer-events-none'
          : 'opacity-100 scale-100 filter blur-0'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      role="region"
      aria-label="Apple Hello Welcome Screen"
    >
      {/* Pure deep true-black OLED background with ultra-subtle ambient center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 500px at 50% 50%, rgba(255, 255, 255, 0.04), transparent 70%)',
        }}
      />

      {/* The Iconic Apple Cursive "hello." */}
      <div className="relative z-10 w-full max-w-[520px] sm:max-w-[680px] md:max-w-[820px] px-6 aspect-[2620/860] flex items-center justify-center">
        <svg
          viewBox="-160 -60 2620 860"
          className="w-full h-full overflow-visible"
          style={{
            filter: showShimmer
              ? 'drop-shadow(0 0 28px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))'
              : 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.35))',
            transition: 'filter 1.2s ease-in-out',
          }}
        >
          <g transform="scale(1, -1) translate(0, -728.156005859375)">
            {/* Path 0: Initial leading loop of 'h' */}
            <path
              ref={path0Ref}
              d={PATH_0}
              fill="none"
              stroke="#FFFFFF"
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
              stroke="#FFFFFF"
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
    </div>
  );
};
