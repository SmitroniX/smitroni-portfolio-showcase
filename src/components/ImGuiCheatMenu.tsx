import React, { useState, useEffect, useRef } from 'react';
import {
  Crosshair,
  Eye,
  Sliders,
  ShieldAlert,
  Cpu,
  RefreshCw,
  X,
  Minus,
  Maximize2,
  Check,
  Zap,
  Terminal,
  Ghost,
  Radio,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { CS2Icon, ValorantIcon, PhasmophobiaIcon, MinecraftIcon, GtaVIcon } from './BrandIcons';

interface ImGuiCheatMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDarkSide?: () => void;
}

export const ImGuiCheatMenu: React.FC<ImGuiCheatMenuProps> = ({
  isOpen,
  onClose,
  onLaunchDarkSide
}) => {
  const [activeTab, setActiveTab] = useState<'aimbot' | 'visuals' | 'misc' | 'games' | 'config'>('aimbot');
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Responsive Dragging state
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const isMob = window.innerWidth < 640;
      if (isMob) {
        return { x: 12, y: 50 };
      }
      return { x: Math.max(20, Math.min(120, window.innerWidth - 510)), y: 90 };
    }
    return { x: 20, y: 60 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Aimbot Settings
  const [aimbotEnabled, setAimbotEnabled] = useState(true);
  const [aimFov, setAimFov] = useState(8.5);
  const [aimSmooth, setAimSmooth] = useState(4.2);
  const [aimBone, setAimBone] = useState<'head' | 'neck' | 'spine'>('head');
  const [rcsEnabled, setRcsEnabled] = useState(true);

  // Visuals Settings
  const [espBox, setEspBox] = useState(true);
  const [espSkeleton, setEspSkeleton] = useState(true);
  const [espSnaplines, setEspSnaplines] = useState(true);
  const [espHealth, setEspHealth] = useState(true);
  const [glowColor, setGlowColor] = useState('#EF4444');

  // Misc & Bypass Settings
  const [bhopScript, setBhopScript] = useState(true);
  const [antiFlash, setAntiFlash] = useState(true);
  const [thirdPerson, setThirdPerson] = useState(false);
  const [hwidSpoofed, setHwidSpoofed] = useState(true);
  const [spoofedHwid, setSpoofedHwid] = useState('UUID: 9A82-C4B1-00F4-1337-ROOT');

  // Watermark HUD
  const [showWatermark, setShowWatermark] = useState(true);

  // Re-center when opened on mobile screens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setPosition({ x: 12, y: 50 });
      }
    }
  }, [isOpen]);

  // Keep inside screen bounds on resize
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const isMob = window.innerWidth < 640;
      const menuWidth = isMob ? window.innerWidth - 24 : 480;
      const maxX = Math.max(8, window.innerWidth - menuWidth - 8);
      const maxY = Math.max(10, window.innerHeight - 120);

      setPosition((prev) => ({
        x: Math.max(8, Math.min(maxX, prev.x)),
        y: Math.max(10, Math.min(maxY, prev.y))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Dragging Start
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  // Touch Dragging Start for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const t = e.touches[0];
      dragOffsetRef.current = {
        x: t.clientX - position.x,
        y: t.clientY - position.y
      };
    }
  };

  // Dragging event listeners for both mouse and touch
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const isMob = window.innerWidth < 640;
      const menuWidth = isMob ? window.innerWidth - 24 : 480;
      const maxX = Math.max(8, window.innerWidth - menuWidth - 8);
      const maxY = Math.max(10, window.innerHeight - 120);

      setPosition({
        x: Math.max(8, Math.min(maxX, clientX - dragOffsetRef.current.x)),
        y: Math.max(10, Math.min(maxY, clientY - dragOffsetRef.current.y))
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging]);

  const randomizeHwid = () => {
    sounds.playInject();
    const hex = () => Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
    setSpoofedHwid(`UUID: ${hex()}-${hex()}-${hex()}-${hex()}-SPOOF`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Optional In-Game Watermark HUD (Top Left, desktop only) */}
      {showWatermark && (
        <div className="fixed top-20 right-4 z-40 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 border border-red-500/30 text-[10px] font-mono text-slate-300 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white">SmitroniX.dev</span>
          <span className="text-red-400">| Ring-0 Driver</span>
          <span className="text-slate-500">| FPS: 165</span>
          <span className="text-emerald-400">| Undetected</span>
        </div>
      )}

      {/* Main Draggable ImGui Window - 100% Mobile Responsive */}
      <div
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="fixed z-50 w-[calc(100vw-24px)] sm:w-[480px] max-w-[480px] max-h-[85vh] bg-[#0C1017]/95 border-2 border-red-600/70 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(239,68,68,0.25)] font-mono text-xs text-slate-300 overflow-hidden backdrop-blur-xl select-none flex flex-col"
      >
        {/* Title Bar (Draggable Handle on mouse & touch) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="bg-gradient-to-r from-red-950 via-slate-900 to-black px-3 py-2 sm:px-3.5 sm:py-2.5 border-b border-red-600/40 flex items-center justify-between cursor-move touch-none select-none shrink-0"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-white text-xs min-w-0">
            <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 animate-pulse shrink-0" />
            <span className="tracking-wide truncate max-w-[150px] xs:max-w-[220px] sm:max-w-none">
              SmitroniX Cheat
            </span>
            <span className="hidden xs:inline-block text-[9px] px-1.5 py-0.2 rounded bg-red-600/30 text-red-300 font-bold border border-red-500/30 shrink-0">
              ImGui DirectX
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded hover:bg-red-600/50 text-slate-400 hover:text-white transition-colors"
              title="Close Menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body (Collapsible if minimized) */}
        {!isMinimized && (
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Tab Header Bar - Smooth touch horizontal scrolling */}
            <div className="flex items-center gap-1 p-2 bg-black/50 border-b border-white/5 overflow-x-auto text-[11px] shrink-0">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('aimbot');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'aimbot'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Crosshair className="w-3 h-3" />
                <span>Aimbot</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('visuals');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'visuals'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Visuals (ESP)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('misc');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'misc'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Misc / Bypass</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('games');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'games'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Ghost className="w-3 h-3" />
                <span>Game Exploits</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('config');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'config'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Config</span>
              </button>
            </div>

            {/* Tab Views Container - Clean Touch Scrollable */}
            <div className="p-3 sm:p-4 space-y-3.5 flex-1 overflow-y-auto max-h-[calc(85vh-115px)] sm:max-h-[380px]">
              
              {/* TAB 1: AIMBOT */}
              {activeTab === 'aimbot' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="font-bold text-white">Enable Vector Aimbot</span>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAimbotEnabled(!aimbotEnabled);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        aimbotEnabled ? 'bg-red-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          aimbotEnabled ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Target Bone */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold">Target Hitbox Bone:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['head', 'neck', 'spine'] as const).map((bone) => (
                        <button
                          key={bone}
                          onClick={() => {
                            sounds.playClick();
                            setAimBone(bone);
                          }}
                          className={`p-2 rounded-lg border text-center uppercase font-bold text-[10px] transition-all ${
                            aimBone === bone
                              ? 'bg-red-600/30 border-red-500 text-red-300'
                              : 'bg-black/30 border-white/5 text-slate-400'
                          }`}
                        >
                          {bone}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FOV Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Field of View (FOV):</span>
                      <span className="text-red-400 font-bold">{aimFov}°</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="20.0"
                      step="0.5"
                      value={aimFov}
                      onChange={(e) => setAimFov(Number(e.target.value))}
                      className="w-full accent-red-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Smooth Factor */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Humanized Smoothing:</span>
                      <span className="text-emerald-400 font-bold">{aimSmooth}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="15.0"
                      step="0.2"
                      value={aimSmooth}
                      onChange={(e) => setAimSmooth(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* RCS */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <div className="pr-2">
                      <div className="font-bold text-white">Standalone RCS</div>
                      <div className="text-[10px] text-slate-500">Compensates viewangles on weapon spray</div>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setRcsEnabled(!rcsEnabled);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        rcsEnabled ? 'bg-red-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          rcsEnabled ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: VISUALS (ESP) */}
              {activeTab === 'visuals' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setEspBox(!espBox)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        espBox ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>3D Box ESP</span>
                      <span className="text-[10px] font-bold">{espBox ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setEspSkeleton(!espSkeleton)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        espSkeleton ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>Bone Skeletons</span>
                      <span className="text-[10px] font-bold">{espSkeleton ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setEspSnaplines(!espSnaplines)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        espSnaplines ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>Snaplines</span>
                      <span className="text-[10px] font-bold">{espSnaplines ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setEspHealth(!espHealth)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                        espHealth ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>Health Bars</span>
                      <span className="text-[10px] font-bold">{espHealth ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>

                  {/* Glow Color Selector */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] text-slate-400 font-bold">ESP Chams Color Palette:</label>
                    <div className="flex items-center gap-2">
                      {['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'].map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            sounds.playClick();
                            setGlowColor(c);
                          }}
                          style={{ backgroundColor: c }}
                          className={`w-7 h-7 rounded-full transition-transform ${
                            glowColor === c ? 'scale-110 ring-2 ring-white shadow-md' : 'opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MISC & BYPASS */}
              {activeTab === 'misc' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <div>
                      <div className="font-bold text-white">Auto BunnyHop Script</div>
                      <div className="text-[10px] text-slate-500">Perfect tick-rate jump sequence</div>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setBhopScript(!bhopScript);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        bhopScript ? 'bg-red-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          bhopScript ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <div>
                      <div className="font-bold text-white">Anti-Flashbang</div>
                      <div className="text-[10px] text-slate-500">Overrides m_flFlashDuration to 0.0s</div>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAntiFlash(!antiFlash);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        antiFlash ? 'bg-red-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          antiFlash ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* HWID Spoofer Module */}
                  <div className="p-3 rounded-lg bg-black/50 border border-red-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-400 flex items-center gap-1.5 text-xs">
                        <Cpu className="w-3.5 h-3.5 text-red-500" />
                        Hardware ID Randomizer
                      </span>
                      <button
                        onClick={randomizeHwid}
                        className="px-2 py-1 rounded bg-red-600/30 hover:bg-red-600/50 text-red-300 text-[10px] font-bold flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>SPOOF</span>
                      </button>
                    </div>
                    <div className="font-mono text-[10px] text-slate-300 bg-black/80 p-2 rounded border border-white/5 break-all">
                      {spoofedHwid}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GAME EXPLOITS */}
              {activeTab === 'games' && (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-2">
                      <CS2Icon className="w-4 h-4 shrink-0" />
                      <span>Counter-Strike 2 NetVar Dumper</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      Dynamic client.dll offset scanner parsing entity lists and viewmatrix.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-rose-400 flex items-center gap-2">
                      <ValorantIcon className="w-4 h-4 shrink-0" />
                      <span>Valorant DMA Hardware Interface</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      LeechCore PCIe FPGA firmware reading physical RAM bypassing Vanguard.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-cyan-400 flex items-center gap-2">
                      <GtaVIcon className="w-4 h-4 shrink-0" />
                      <span>GTA V &amp; FiveM Lua Native Executor</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      CitizenFX runtime bypass executing remote server events and Godmode.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-sky-400 flex items-center gap-2">
                      <PhasmophobiaIcon className="w-4 h-4 shrink-0" />
                      <span>Phasmophobia Ghost Revealer</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      Reads IL2CPP offset to expose Ghost Type (Demon/Revenant) before hunting.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-2">
                      <MinecraftIcon className="w-4 h-4 shrink-0" />
                      <span>Minecraft Velocity Nullifier</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      Fabric ASM Mixin cancels SPacketEntityVelocity for 0% knockback.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CONFIG & PRESETS */}
              {activeTab === 'config' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAimSmooth(8.5);
                        setAimFov(3.5);
                      }}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-red-500/50 text-center transition-colors active:scale-95"
                    >
                      <div className="font-bold text-white text-[11px]">Legit</div>
                      <div className="text-[9px] text-slate-500">Low FOV</div>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAimSmooth(1.2);
                        setAimFov(15.0);
                      }}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-red-500/50 text-center transition-colors active:scale-95"
                    >
                      <div className="font-bold text-red-400 text-[11px]">Rage</div>
                      <div className="text-[9px] text-slate-500">Snap Lock</div>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAimSmooth(3.0);
                        setAimFov(6.0);
                      }}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-red-500/50 text-center transition-colors active:scale-95"
                    >
                      <div className="font-bold text-amber-400 text-[11px]">HvH</div>
                      <div className="text-[9px] text-slate-500">Anti-Aim</div>
                    </button>
                  </div>

                  {onLaunchDarkSide && (
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchDarkSide();
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Open Full Threat Dossier</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-black/60 border border-red-500/30 text-red-300 font-bold text-xs uppercase tracking-wider hover:bg-black/90 transition-colors"
                  >
                    Close Cheat Menu
                  </button>
                </div>
              )}

            </div>

            {/* ImGui Status Footer - Mobile Friendly */}
            <div className="px-3 py-2 bg-black/80 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5 truncate pr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">Direct3D 11 VMT Hook</span>
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline">[INS] Toggle</span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                  }}
                  className="sm:hidden px-2 py-0.5 rounded bg-red-600/30 text-red-300 font-bold border border-red-500/40 text-[10px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
