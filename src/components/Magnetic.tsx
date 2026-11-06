import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0 to 1, default 0.35
  radius?: number; // Distance in px to trigger magnetic effect
  as?: keyof JSX.IntrinsicElements;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  className = '',
  strength = 0.35,
  radius = 80,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth organic physics spring
  const springConfig = { damping: 15, stiffness: 180, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.hypot(distX, distY);

    if (distance < radius) {
      x.set(distX * strength);
      y.set(distY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
