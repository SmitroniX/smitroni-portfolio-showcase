import React, { useState, useEffect, useRef } from 'react';
import { Activity, Volume2, VolumeX, Cpu, Radio, ChevronUp, ChevronDown } from 'lucide-react';
import { sounds } from '../utils/sound';

export const CyberHUD: React.FC = () => {
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.6);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Audio equalizer bars state
  const [eqLevels, setEqLevels] = useState<number[]>([40, 70, 90, 50, 30]);

  // Real-time FPS Calculation Loop
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = (now: number) => {
      frameCount++;
      const delta = now - lastTime;

      if (delta >= 500) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        const currentFrameTime = +(1000 / currentFps).toFixed(1);
        setFps(currentFps);
        setFrameTime(currentFrameTime);
        frameCount = 0;
        lastTime = now;

        // Animate subtle equalizer fluctuations
        setEqLevels([
          Math.floor(20 + Math.random() * 80),
          Math.floor(30 + Math.random() * 70),
          Math.floor(40 + Math.random() * 60),
          Math.floor(25 + Math.random() * 75),
          Math.floor(15 + Math.random() * 85),
        ]);
      }

      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);

    // Mouse coordinates tracking
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const state = sounds.toggleSound();
    setSoundEnabled(state);
  };

  return (
    <aside
      aria-label="System Telemetry & Controls"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 z-40 select-none font-mono text-[11px]"
    >
      <div className="relative rounded-2xl bg-[#090D15]/85 border border-white/10 shadow-2xl backdrop-blur-xl p-3 flex flex-col gap-2.5 transition-all duration-300 hover:border-orange-500/40 hover:shadow-orange-500/10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">
              GL_TELEMETRY
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle Button */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-lg border transition-all ${
                soundEnabled
                  ? 'bg-orange-500/10 border-orange-500/30 text-[#FF8A00] hover:bg-orange-500/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Acoustic Synthesis Active (Click to Mute)' : 'Sound Muted (Click to Enable)'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Telemetry Metrics */}
        {!collapsed && (
          <div className="space-y-2 pt-1 border-t border-white/5">
            {/* FPS & Latency */}
            <div className="flex items-center justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Activity className="w-3 h-3 text-[#FF8A00]" />
                <span>REFRESH</span>
              </span>
              <span className="font-bold text-emerald-400">
                {fps} FPS <span className="text-slate-500 font-normal">({frameTime}ms)</span>
              </span>
            </div>

            {/* Cursor Coordinates */}
            <div className="flex items-center justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>POINTER</span>
              </span>
              <span className="text-cyan-300 font-mono">
                X:{coords.x} Y:{coords.y}
              </span>
            </div>

            {/* Sound Equalizer Visualizer */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <span className="text-[10px] text-slate-500 uppercase">SYNTH FREQ</span>
              <div className="flex items-end gap-1 h-3.5">
                {eqLevels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className="w-1 rounded-full transition-all duration-150"
                    style={{
                      height: soundEnabled ? `${lvl}%` : '20%',
                      backgroundColor: soundEnabled ? (idx % 2 === 0 ? '#FF8A00' : '#00F0FF') : '#64748B',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
