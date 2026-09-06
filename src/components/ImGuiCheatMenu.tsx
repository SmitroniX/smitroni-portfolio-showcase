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
  
  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 80, y: 100 });
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

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 420, e.clientX - dragOffsetRef.current.x)),
        y: Math.max(10, Math.min(window.innerHeight - 200, e.clientY - dragOffsetRef.current.y))
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
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
      {/* Optional In-Game Watermark HUD (Top Left) */}
      {showWatermark && (
        <div className="fixed top-20 right-4 z-40 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 border border-red-500/30 text-[10px] font-mono text-slate-300 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-white">SmitroniX.dev</span>
          <span className="text-red-400">| Ring-0 Driver</span>
          <span className="text-slate-500">| FPS: 165</span>
          <span className="text-emerald-400">| Undetected</span>
        </div>
      )}

      {/* Main Draggable ImGui Window */}
      <div
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="fixed z-50 w-[92vw] sm:w-[480px] bg-[#0C1017]/95 border-2 border-red-600/70 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(239,68,68,0.25)] font-mono text-xs text-slate-300 overflow-hidden backdrop-blur-xl select-none"
      >
        {/* Title Bar (Draggable Handle) */}
        <div
          onMouseDown={handleMouseDown}
          className="bg-gradient-to-r from-red-950 via-slate-900 to-black px-3.5 py-2.5 border-b border-red-600/40 flex items-center justify-between cursor-move"
        >
          <div className="flex items-center gap-2 font-bold text-white text-xs">
            <Crosshair className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="tracking-wide">SmitroniX Multi-Cheat [v4.2 Internal]</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-600/30 text-red-300 font-bold border border-red-500/30">
              ImGui DirectX
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1 rounded hover:bg-red-600/50 text-slate-400 hover:text-white transition-colors"
              title="Close (Insert)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body (Collapsible if minimized) */}
        {!isMinimized && (
          <div className="flex flex-col">
            {/* Tab Header Bar */}
            <div className="flex items-center gap-1 p-2 bg-black/50 border-b border-white/5 overflow-x-auto text-[11px]">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('aimbot');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'config'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Config</span>
              </button>
            </div>

            {/* Tab Views */}
            <div className="p-4 space-y-3.5 max-h-[380px] overflow-y-auto">
              
              {/* TAB 1: AIMBOT */}
              {activeTab === 'aimbot' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <span className="font-bold text-white">Enable Vector Aimbot</span>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAimbotEnabled(!aimbotEnabled);
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        aimbotEnabled ? 'bg-red-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                          aimbotEnabled ? 'left-5' : 'left-1'
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
                          className={`p-1.5 rounded-lg border text-center uppercase font-bold text-[10px] ${
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
                      className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
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
                      className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* RCS */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                    <div>
                      <div className="font-bold text-white">Standalone RCS (Recoil Compensation)</div>
                      <div className="text-[10px] text-slate-500">Compensates viewangles on weapon spray</div>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setRcsEnabled(!rcsEnabled);
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        rcsEnabled ? 'bg-red-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                          rcsEnabled ? 'left-5' : 'left-1'
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
                      className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                        espBox ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>3D Box ESP</span>
                      <span className="text-[10px]">{espBox ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setEspSkeleton(!espSkeleton)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                        espSkeleton ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>Bone Skeletons</span>
                      <span className="text-[10px]">{espSkeleton ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setEspSnaplines(!espSnaplines)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                        espSnaplines ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>Snaplines</span>
                      <span className="text-[10px]">{espSnaplines ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setEspHealth(!espHealth)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                        espHealth ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>Health &amp; Distance</span>
                      <span className="text-[10px]">{espHealth ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>

                  {/* Glow Chams Color */}
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold block">Glow Chams Accent Color:</label>
                    <div className="flex items-center gap-2">
                      {['#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'].map((col) => (
                        <button
                          key={col}
                          onClick={() => setGlowColor(col)}
                          style={{ backgroundColor: col }}
                          className={`w-7 h-7 rounded-lg transition-transform ${
                            glowColor === col ? 'scale-110 ring-2 ring-white' : 'opacity-70'
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
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Kernel HWID Spoofer</span>
                      <button
                        onClick={randomizeHwid}
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-red-600/20 text-red-300 border border-red-500/40 hover:bg-red-600/40"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Randomize</span>
                      </button>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">{spoofedHwid}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setBhopScript(!bhopScript)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                        bhopScript ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>Auto Bunnyhop</span>
                      <span className="text-[10px]">{bhopScript ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setAntiFlash(!antiFlash)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                        antiFlash ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-black/30 border-white/5 text-slate-500'
                      }`}
                    >
                      <span>No Flash / Smoke</span>
                      <span className="text-[10px]">{antiFlash ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Watermark Overlay</div>
                      <div className="text-[10px] text-slate-500">Displays FPS &amp; driver latency on screen</div>
                    </div>
                    <button
                      onClick={() => setShowWatermark(!showWatermark)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        showWatermark ? 'bg-red-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 ${
                          showWatermark ? 'left-5' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: SPECIFIC GAME EXPLOITS */}
              {activeTab === 'games' && (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-red-400 flex items-center gap-1.5">
                      <span>👻</span>
                      <span>Phasmophobia Ghost Revealer</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Instantly reads memory offset 0x3F8 to extract Ghost Type (Demon/Banshee) before hunting starts.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span>⛏️</span>
                      <span>Minecraft Velocity Nullifier</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Bytecode Mixin intercepting SPacketEntityVelocity to reduce knockback to 0%.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <span>🚗</span>
                      <span>GTA V Native Vehicle Spawner</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Overrides ScriptHookV table and injects global tunables for instant vehicle cascade.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CONFIG & PRESETS */}
              {activeTab === 'config' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAimSmooth(8.5);
                        setAimFov(3.5);
                      }}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-red-500/50 text-center"
                    >
                      <div className="font-bold text-white">Legit Play</div>
                      <div className="text-[9px] text-slate-500">Low FOV, High Smooth</div>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAimSmooth(1.2);
                        setAimFov(15.0);
                      }}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-red-500/50 text-center"
                    >
                      <div className="font-bold text-red-400">Rage Hack</div>
                      <div className="text-[9px] text-slate-500">Max FOV, Instant Snap</div>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setAimSmooth(3.0);
                        setAimFov(6.0);
                      }}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-red-500/50 text-center"
                    >
                      <div className="font-bold text-amber-400">HvH Mode</div>
                      <div className="text-[9px] text-slate-500">Anti-Aim + Pitch Zero</div>
                    </button>
                  </div>

                  {onLaunchDarkSide && (
                    <button
                      onClick={() => {
                        onClose();
                        onLaunchDarkSide();
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Open Full Cyber Threat Dossier</span>
                    </button>
                  )}
                </div>
              )}

            </div>

            {/* ImGui Status Footer */}
            <div className="px-3.5 py-2 bg-black/70 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>HOOK: Direct3D 11 Present()</span>
              </span>
              <span>Press [INSERT] to Toggle Menu</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
