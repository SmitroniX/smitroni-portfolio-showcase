import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Volume2, VolumeX, Radio, ChevronUp, ChevronDown } from 'lucide-react';
import { sounds } from '../utils/sound';

export const CyberHUD: React.FC = () => {
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.6);
  const [scrollPct, setScrollPct] = useState<number>(0);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.soundEnabled);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [eqLevels, setEqLevels] = useState<number[]>([35, 65, 85, 45, 30]);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId = 0;

    const measureFps = (now: number) => {
      frameCount++;
      const delta = now - lastTime;

      if (delta >= 600) {
        const currentFps = Math.min(240, Math.round((frameCount * 1000) / delta));
        const currentFrameTime = +(1000 / Math.max(1, currentFps)).toFixed(1);
        setFps(currentFps);
        setFrameTime(currentFrameTime);
        frameCount = 0;
        lastTime = now;

        setEqLevels([
          Math.floor(20 + Math.random() * 75),
          Math.floor(30 + Math.random() * 68),
          Math.floor(40 + Math.random() * 60),
          Math.floor(25 + Math.random() * 72),
          Math.floor(15 + Math.random() * 80),
        ]);
      }

      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollPct(Math.round((window.scrollY / max) * 100));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const state = sounds.toggleSound();
    setSoundEnabled(state);
  };

  return (
    <aside
      aria-label="Developer Runtime Telemetry"
      className="fixed bottom-4 right-4 z-40 select-none font-mono text-[11px] hidden sm:block"
    >
      <div className="rounded-xl bg-[#070B13]/90 border border-white/[0.11] shadow-2xl backdrop-blur-xl px-3 py-2 flex flex-col gap-2 transition-colors hover:border-[#FF8A00]/40">
        {/* Compact Header Pill */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-bold tabular-nums">{fps} FPS</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 tabular-nums">{scrollPct}%</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={soundEnabled ? 'Mute UI synthesizer sound' : 'Enable UI synthesizer sound'}
              className={`p-1 rounded-md border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-[#FF6B00]/15 border-[#FF6B00]/40 text-[#FF8A00]'
                  : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
              }`}
              title={soundEnabled ? 'UI Audio: ON' : 'UI Audio: OFF (Click to enable)'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? 'Collapse telemetry panel' : 'Expand telemetry panel'}
              aria-expanded={expanded}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Live Diagnostics */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 pt-2 border-t border-white/[0.07] overflow-hidden min-w-[205px]"
            >
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Activity className="w-3 h-3 text-[#FF8A00]" />
                  <span>FRAME</span>
                </span>
                <span className="text-emerald-400 tabular-nums">{frameTime}ms</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Radio className="w-3 h-3 text-[#00F0FF]" />
                  <span>CURSOR</span>
                </span>
                <span className="text-[#00F0FF] tabular-nums">
                  {coords.x}, {coords.y}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[10px] text-slate-500 uppercase">AUDIO SYNTH</span>
                <div className="flex items-end gap-1 h-3">
                  {eqLevels.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="w-1 rounded-full transition-all duration-150"
                      style={{
                        height: soundEnabled ? `${lvl}%` : '22%',
                        backgroundColor: soundEnabled
                          ? idx % 2 === 0
                            ? '#FF8A00'
                            : '#00F0FF'
                          : '#475569',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};
