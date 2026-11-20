import React, { useEffect, useRef, useState } from 'react';

interface KineticMarqueeProps {
  items?: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
  outlineStyle?: boolean;
}

const DEFAULT_ITEMS = [
  'JAVA 21 LTS // HIGH-CONCURRENCY SYSTEMS',
  'SHADOWLAUNCHER // 138 FPS GL4ES NATIVE ENGINE',
  'REACT 19 + TYPESCRIPT // ZERO-JANK INTERFACES',
  'SMITRIX // WEBAUTHN PASSKEY OFFLINE PWA',
  'CODE WITH SMITRONIX // 9-RUNTIME CLOUD IDE',
  'DOCKER + AWS EC2 + REDIS // 99.9% UPTIME',
  'SUDO UNKNOWN // HACK THE BOX TEAM #331386',
  'RAIT MUMBAI // 8.65 CGPA COMPUTER ENGINEERING',
];

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  items = DEFAULT_ITEMS,
  direction = 'left',
  speed = 36,
  className = '',
  outlineStyle = false,
}) => {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      const clamped = Math.max(-12, Math.min(12, delta * 0.35));
      setScrollVelocity(clamped);

      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        setScrollVelocity(0);
      }, 160);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };
  }, []);

  const displayItems = [...items, ...items, ...items];
  const effectiveSkew = direction === 'left' ? -scrollVelocity * 0.3 : scrollVelocity * 0.3;

  return (
    <div
      aria-label="Engineering highlights ticker"
      className={`relative w-full overflow-hidden select-none py-3 border-y border-white/[0.06] bg-[#070A12]/70 backdrop-blur-md ${className}`}
      style={{
        transform: `skewX(${effectiveSkew}deg)`,
        transition: 'transform 0.18s ease-out',
      }}
    >
      {/* Left & Right Edge Fade Masks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#05070B] to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#05070B] to-transparent z-10"
      />

      <div
        className={`flex whitespace-nowrap will-change-transform ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        }`}
        style={{
          animationDuration: `${Math.max(16, speed - Math.abs(scrollVelocity) * 1.1)}s`,
        }}
      >
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-5 mx-3 font-mono uppercase tracking-wider text-[11px] sm:text-xs font-bold group"
          >
            <span
              className={
                outlineStyle || idx % 2 === 1
                  ? 'text-slate-400 group-hover:text-[#00F0FF] transition-colors'
                  : 'text-slate-200 group-hover:text-[#FF8A00] transition-colors'
              }
            >
              {item}
            </span>
            <span
              aria-hidden="true"
              className={`w-1.5 h-1.5 rounded-full ${
                idx % 2 === 0 ? 'bg-[#FF6B00]' : 'bg-[#00F0FF]'
              } opacity-80`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
