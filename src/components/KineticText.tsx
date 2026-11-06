import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sound';

interface KineticTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div';
  scrambleOnHover?: boolean;
  triggerOnMount?: boolean;
  speed?: number;
  playSound?: boolean;
}

const CYBER_GLYPHS = '01アイウエオカキクケコサシスセソタチツテトABCDEF0123456789§¢∆¥⚡∑∏∂λ//_';

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
  scrambleOnHover = true,
  triggerOnMount = false,
  speed = 35,
  playSound = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const isScrambling = useRef(false);
  const frameRef = useRef<number | null>(null);

  const startScramble = () => {
    if (isScrambling.current) return;
    isScrambling.current = true;

    if (playSound) {
      sounds.playKeyTick();
    }

    const length = text.length;
    let iteration = 0;
    const maxIterations = length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < iteration) {
              return text[index];
            }
            return CYBER_GLYPHS[Math.floor(Math.random() * CYBER_GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        isScrambling.current = false;
      }

      iteration += 1 / 2.2;
    }, speed);
  };

  useEffect(() => {
    setDisplayText(text);
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        startScramble();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [text, triggerOnMount]);

  return (
    <Component
      onMouseEnter={() => {
        if (scrambleOnHover) {
          startScramble();
        }
      }}
      className={`inline-block select-none cursor-default font-feature-settings will-change-contents ${className}`}
    >
      {displayText}
    </Component>
  );
};
