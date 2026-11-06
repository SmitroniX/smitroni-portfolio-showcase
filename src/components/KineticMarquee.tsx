import React, { useEffect, useRef, useState } from 'react';

interface KineticMarqueeProps {
  items?: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
  outlineStyle?: boolean;
}

const DEFAULT_ITEMS = [
  'SHADOWLAUNCHER // 138 FPS NATIVE JNI RUNTIME',
  'ZERO-DAY EXPLOITS & REVERSE ENGINEERING',
  'SMITRIX // PASSKEY WEBAUTHN OFFLINE PWA',
  'CODE WITH SMITRONIX // VIRTUAL JAVA GUI RUNNER',
  'DEVOPS ARCHITECTURE // DOCKER • K8S • GITHUB ACTIONS',
  'RAIT MUMBAI // CGPA 8.65 COMPUTER ENGINEERING',
  'HACK THE BOX // CAPTAIN RANK #331386',
];

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  items = DEFAULT_ITEMS,
  direction = 'left',
  speed = 40,
  className = '',
  outlineStyle = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      // Bound velocity between -15 and 15
      const clamped = Math.max(-15, Math.min(15, delta * 0.4));
      setScrollVelocity(clamped);

      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        setScrollVelocity(0);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Duplicate items for continuous seamless loop
  const displayItems = [...items, ...items, ...items, ...items];

  const effectiveSkew = direction === 'left' ? -scrollVelocity * 0.4 : scrollVelocity * 0.4;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none py-3.5 border-y border-white/[0.06] bg-black/40 backdrop-blur-md ${className}`}
      style={{
        transform: `perspective(600px) skewY(${direction === 'left' ? -0.8 : 0.8}deg) skewX(${effectiveSkew}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      <div
        className={`flex whitespace-nowrap will-change-transform ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        }`}
        style={{
          animationDuration: `${Math.max(15, speed - Math.abs(scrollVelocity) * 1.5)}s`,
        }}
      >
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-6 mx-4 font-mono uppercase tracking-wider text-xs sm:text-sm font-extrabold group"
          >
            <span
              className={
                outlineStyle || idx % 2 === 1
                  ? 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] group-hover:[-webkit-text-stroke:1px_#FF8A00] transition-colors'
                  : 'text-slate-300 group-hover:text-[#FF8A00] transition-colors'
              }
            >
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] opacity-80" />
          </div>
        ))}
      </div>
    </div>
  );
};
