import React, { useState, useEffect, useRef } from 'react';
import {
  Crosshair,
  Eye,
  ShieldAlert,
  Ghost,
  Target,
  Zap,
  RotateCcw,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  Radio,
  Layers,
  Check
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { CS2Icon, PhasmophobiaIcon, MinecraftIcon } from './BrandIcons';

interface DummyEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  name: string;
  role: string;
  distance: number;
  ghostType?: string;
  isDead: boolean;
  deathTimer: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export const EspRadarSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game mode
  const [gameMode, setGameMode] = useState<'cs2' | 'phasmo' | 'minecraft'>('cs2');
  
  // Cheat features toggles
  const [boxEsp, setBoxEsp] = useState(true);
  const [skeletonEsp, setSkeletonEsp] = useState(true);
  const [snaplines, setSnaplines] = useState(true);
  const [aimbot, setAimbot] = useState(true);
  const [radar, setRadar] = useState(true);
  const [fovRadius, setFovRadius] = useState(90);
  
  // Game stats
  const [stats, setStats] = useState({ hits: 0, headshots: 0, kills: 0 });
  const [lockedTargetId, setLockedTargetId] = useState<number | null>(null);

  // Entities & floating damage numbers
  const entitiesRef = useRef<DummyEntity[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 350, y: 190 });
  const radarAngleRef = useRef(0);
  const isMouseDownRef = useRef(false);

  // Initialize targets based on game mode
  const initTargets = (mode: 'cs2' | 'phasmo' | 'minecraft') => {
    const targets: DummyEntity[] = [];
    const count = mode === 'phasmo' ? 3 : 5;

    const names = {
      cs2: ['T-Terrorist #1', 'Sniper (AWP)', 'Lurker (AK-47)', 'Entry Fragger', 'Defuser'],
      phasmo: ['Demon (Ghost)', 'Banshee (Spirit)', 'Revenant (Hunting)'],
      minecraft: ['Player_Steve', 'Diamond_Knight', 'Archer_99', 'Netherite_PvP', 'Ninja_User']
    };

    for (let i = 0; i < count; i++) {
      targets.push({
        id: i + 1,
        x: 90 + (i * 120) % 520 + (Math.random() * 40 - 20),
        y: 80 + (i * 50) % 180 + (Math.random() * 30 - 15),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.2,
        width: mode === 'phasmo' ? 44 : 36,
        height: mode === 'phasmo' ? 68 : 64,
        health: 100,
        maxHealth: 100,
        name: names[mode][i] || `Target_${i + 1}`,
        role: mode === 'phasmo' ? 'Paranormal Entity' : 'Opponent',
        distance: Math.floor(Math.random() * 25 + 8),
        ghostType: mode === 'phasmo' ? ['Demon', 'Banshee', 'Revenant'][i % 3] : undefined,
        isDead: false,
        deathTimer: 0
      });
    }
    entitiesRef.current = targets;
  };

  useEffect(() => {
    initTargets(gameMode);
  }, [gameMode]);

  // Handle firing / shooting on canvas
  const handleShoot = () => {
    sounds.playGunshot();

    const mouse = mousePosRef.current;
    let hitSomething = false;

    entitiesRef.current.forEach((target) => {
      if (target.isDead) return;

      const headX = target.x + target.width / 2;
      const headY = target.y + target.height * 0.2;
      const headDist = Math.hypot(mouse.x - headX, mouse.y - headY);
      const bodyDist = Math.hypot(mouse.x - (target.x + target.width / 2), mouse.y - (target.y + target.height / 2));

      // Headshot detection
      if (headDist < 16 || (aimbot && headDist < fovRadius * 0.6)) {
        hitSomething = true;
        sounds.playHitmarker();
        target.health = Math.max(0, target.health - 100);
        setStats((s) => ({ ...s, hits: s.hits + 1, headshots: s.headshots + 1 }));

        floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x: target.x + target.width / 2,
          y: target.y,
          text: gameMode === 'phasmo' ? 'EMF 5 DETECTED!' : 'HEADSHOT! -100',
          color: '#EF4444',
          alpha: 1,
          vy: -1.5
        });
      } else if (bodyDist < 26 || (aimbot && bodyDist < fovRadius)) {
        hitSomething = true;
        sounds.playHitmarker();
        const damage = Math.floor(Math.random() * 25 + 35);
        target.health = Math.max(0, target.health - damage);
        setStats((s) => ({ ...s, hits: s.hits + 1 }));

        floatingTextsRef.current.push({
          id: Date.now() + Math.random(),
          x: target.x + target.width / 2,
          y: target.y + 10,
          text: `-${damage} HP`,
          color: '#F59E0B',
          alpha: 1,
          vy: -1.2
        });
      }

      if (target.health <= 0 && !target.isDead) {
        target.isDead = true;
        target.deathTimer = 100;
        setStats((s) => ({ ...s, kills: s.kills + 1 }));
      }
    });

    if (!hitSomething) {
      floatingTextsRef.current.push({
        id: Date.now() + Math.random(),
        x: mouse.x,
        y: mouse.y,
        text: 'MISS',
        color: '#6B7280',
        alpha: 0.8,
        vy: -1
      });
    }
  };

  // Main Canvas Render Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear & draw background grid
      ctx.fillStyle = gameMode === 'phasmo' ? '#040808' : '#06090E';
      ctx.fillRect(0, 0, width, height);

      // Subtle tactical grid
      ctx.strokeStyle = gameMode === 'phasmo' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 35;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const mouse = mousePosRef.current;
      let closestTarget: DummyEntity | null = null;
      let minDistance = Infinity;

      // 2. Update & Draw Target Entities
      entitiesRef.current.forEach((target) => {
        // Respawn logic
        if (target.isDead) {
          target.deathTimer--;
          if (target.deathTimer <= 0) {
            target.isDead = false;
            target.health = 100;
            target.x = 50 + Math.random() * (width - 150);
            target.y = 50 + Math.random() * (height - 150);
          }
          return;
        }

        // Patrol kinematics
        target.x += target.vx;
        target.y += target.vy;

        // Bounce boundaries
        if (target.x < 30 || target.x > width - target.width - 30) target.vx *= -1;
        if (target.y < 30 || target.y > height - target.height - 40) target.vy *= -1;

        const centerX = target.x + target.width / 2;
        const centerY = target.y + target.height / 2;
        const headX = centerX;
        const headY = target.y + target.height * 0.2;

        // Calculate distance to crosshair for aimbot
        const distToMouse = Math.hypot(mouse.x - headX, mouse.y - headY);
        if (distToMouse < minDistance && distToMouse < fovRadius) {
          minDistance = distToMouse;
          closestTarget = target;
        }

        const primaryColor = gameMode === 'phasmo' ? '#10B981' : '#EF4444';
        const accentColor = gameMode === 'phasmo' ? '#34D399' : '#F87171';

        // 3. SNAPLINES
        if (snaplines) {
          ctx.save();
          ctx.strokeStyle = gameMode === 'phasmo' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(width / 2, height); // Origin from bottom center (player view)
          ctx.lineTo(centerX, target.y + target.height);
          ctx.stroke();
          ctx.restore();
        }

        // 4. BONE MATRIX SKELETON
        if (skeletonEsp) {
          ctx.save();
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1.5;

          // Head circle
          ctx.beginPath();
          ctx.arc(headX, headY, 6, 0, Math.PI * 2);
          ctx.stroke();

          // Spine & Neck
          const spineY = target.y + target.height * 0.5;
          const pelvisY = target.y + target.height * 0.65;
          ctx.beginPath();
          ctx.moveTo(headX, headY + 6);
          ctx.lineTo(centerX, pelvisY);
          ctx.stroke();

          // Left & Right Arms
          const shoulderY = target.y + target.height * 0.32;
          // Left Arm
          ctx.beginPath();
          ctx.moveTo(centerX, shoulderY);
          ctx.lineTo(target.x + 4, shoulderY + 8);
          ctx.lineTo(target.x + 2, target.y + target.height * 0.55);
          ctx.stroke();
          // Right Arm
          ctx.beginPath();
          ctx.moveTo(centerX, shoulderY);
          ctx.lineTo(target.x + target.width - 4, shoulderY + 8);
          ctx.lineTo(target.x + target.width - 2, target.y + target.height * 0.55);
          ctx.stroke();

          // Left & Right Legs
          // Left Leg
          ctx.beginPath();
          ctx.moveTo(centerX, pelvisY);
          ctx.lineTo(target.x + 6, target.y + target.height * 0.82);
          ctx.lineTo(target.x + 4, target.y + target.height);
          ctx.stroke();
          // Right Leg
          ctx.beginPath();
          ctx.moveTo(centerX, pelvisY);
          ctx.lineTo(target.x + target.width - 6, target.y + target.height * 0.82);
          ctx.lineTo(target.x + target.width - 4, target.y + target.height);
          ctx.stroke();

          ctx.restore();
        }

        // 5. 3D CORNER BOX ESP
        if (boxEsp) {
          ctx.save();
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 1.5;
          const cornerLen = 8;

          // Top-Left
          ctx.beginPath();
          ctx.moveTo(target.x, target.y + cornerLen);
          ctx.lineTo(target.x, target.y);
          ctx.lineTo(target.x + cornerLen, target.y);
          ctx.stroke();

          // Top-Right
          ctx.beginPath();
          ctx.moveTo(target.x + target.width - cornerLen, target.y);
          ctx.lineTo(target.x + target.width, target.y);
          ctx.lineTo(target.x + target.width, target.y + cornerLen);
          ctx.stroke();

          // Bottom-Left
          ctx.beginPath();
          ctx.moveTo(target.x, target.y + target.height - cornerLen);
          ctx.lineTo(target.x, target.y + target.height);
          ctx.lineTo(target.x + cornerLen, target.y + target.height);
          ctx.stroke();

          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(target.x + target.width - cornerLen, target.y + target.height);
          ctx.lineTo(target.x + target.width, target.y + target.height);
          ctx.lineTo(target.x + target.width, target.y + target.height - cornerLen);
          ctx.stroke();

          // Health Bar on Left
          const barWidth = 3;
          const healthHeight = (target.health / target.maxHealth) * target.height;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(target.x - 7, target.y, barWidth, target.height);
          ctx.fillStyle = target.health > 50 ? '#10B981' : '#EF4444';
          ctx.fillRect(target.x - 7, target.y + (target.height - healthHeight), barWidth, healthHeight);

          // Name Tag & Distance Header
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          const tag = gameMode === 'phasmo' ? `[ENTITY] ${target.ghostType}` : target.name;
          ctx.fillText(tag, centerX, target.y - 6);

          ctx.fillStyle = primaryColor;
          ctx.font = '8px monospace';
          ctx.fillText(`[${target.health} HP] • ${target.distance}m`, centerX, target.y + target.height + 11);

          ctx.restore();
        }
      });

      setLockedTargetId(closestTarget ? (closestTarget as DummyEntity).id : null);

      // 6. AIMBOT SMOOTH BEZIER LOCK-ON
      if (aimbot && closestTarget) {
        const tgt = closestTarget as DummyEntity;
        const targetHeadX = tgt.x + tgt.width / 2;
        const targetHeadY = tgt.y + tgt.height * 0.2;

        ctx.save();
        // Snapline from Crosshair to Target Head
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(targetHeadX, targetHeadY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Target Lock Reticle
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetHeadX, targetHeadY, 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LOCKED ON HEAD [BONE_6]', targetHeadX, targetHeadY - 16);

        ctx.restore();
      }

      // 7. FOV CIRCLE & CROSSHAIR
      ctx.save();
      // FOV Circle
      ctx.strokeStyle = aimbot ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, fovRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Tactical Crosshair Reticle
      ctx.strokeStyle = aimbot && closestTarget ? '#EF4444' : '#10B981';
      ctx.lineWidth = 1.5;
      const chSize = 7;
      const chGap = 3;
      // Top
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y - chGap);
      ctx.lineTo(mouse.x, mouse.y - chGap - chSize);
      ctx.stroke();
      // Bottom
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y + chGap);
      ctx.lineTo(mouse.x, mouse.y + chGap + chSize);
      ctx.stroke();
      // Left
      ctx.beginPath();
      ctx.moveTo(mouse.x - chGap, mouse.y);
      ctx.lineTo(mouse.x - chGap - chSize, mouse.y);
      ctx.stroke();
      // Right
      ctx.beginPath();
      ctx.moveTo(mouse.x + chGap, mouse.y);
      ctx.lineTo(mouse.x + chGap + chSize, mouse.y);
      ctx.stroke();
      ctx.restore();

      // 8. RADAR MINIMAP (Top Right)
      if (radar) {
        ctx.save();
        const rSize = 45;
        const rX = width - rSize - 15;
        const rY = rSize + 15;

        // Radar background
        ctx.fillStyle = 'rgba(5, 10, 18, 0.85)';
        ctx.beginPath();
        ctx.arc(rX, rY, rSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = gameMode === 'phasmo' ? '#10B981' : '#EF4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Concentric circles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(rX, rY, rSize * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Radar sweep beam
        radarAngleRef.current += 0.035;
        ctx.strokeStyle = gameMode === 'phasmo' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
        ctx.beginPath();
        ctx.moveTo(rX, rY);
        ctx.lineTo(
          rX + Math.cos(radarAngleRef.current) * rSize,
          rY + Math.sin(radarAngleRef.current) * rSize
        );
        ctx.stroke();

        // Self Center Dot
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(rX, rY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Target Blips
        entitiesRef.current.forEach((t) => {
          if (t.isDead) return;
          const relX = ((t.x - width / 2) / (width / 2)) * (rSize * 0.85);
          const relY = ((t.y - height / 2) / (height / 2)) * (rSize * 0.85);
          ctx.fillStyle = gameMode === 'phasmo' ? '#34D399' : '#EF4444';
          ctx.beginPath();
          ctx.arc(rX + relX, rY + relY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Radar Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('RADAR 360°', rX, rY + rSize + 11);
        ctx.restore();
      }

      // 9. Render Floating Damage Numbers
      floatingTextsRef.current.forEach((ft, i) => {
        ft.y += ft.vy;
        ft.alpha -= 0.02;
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.alpha > 0);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [boxEsp, skeletonEsp, snaplines, aimbot, radar, fovRadius, gameMode]);

  return (
    <div className="space-y-4 font-mono">
      {/* Top Controls & Game Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-black/50 border border-red-900/40 text-xs">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">
            Live ESP &amp; Aimbot Radar Range
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-red-600/20 text-red-300 font-bold border border-red-500/30">
            60 FPS
          </span>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => {
              sounds.playClick();
              setGameMode('cs2');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 ${
              gameMode === 'cs2'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <CS2Icon className="w-3.5 h-3.5" />
            <span>CS2 / Valorant</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setGameMode('phasmo');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 ${
              gameMode === 'phasmo'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <PhasmophobiaIcon className="w-3.5 h-3.5" />
            <span>Phasmophobia</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setGameMode('minecraft');
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 ${
              gameMode === 'minecraft'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <MinecraftIcon className="w-3.5 h-3.5" />
            <span>Minecraft PvP</span>
          </button>
        </div>
      </div>

      {/* Interactive Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-red-600/50 bg-[#06090E] shadow-2xl cursor-crosshair select-none group">
        <canvas
          ref={canvasRef}
          width={720}
          height={380}
          className="w-full h-[260px] sm:h-[340px] block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const scaleX = e.currentTarget.width / rect.width;
            const scaleY = e.currentTarget.height / rect.height;
            const posX = (e.clientX - rect.left) * scaleX;
            const posY = (e.clientY - rect.top) * scaleY;
            mousePosRef.current = { x: posX, y: posY };

            const locked = entitiesRef.current.find(
              (t) => !t.isDead && Math.hypot(posX - (t.x + t.width / 2), posY - (t.y + t.height * 0.2)) < fovRadius
            );
            setLockedTargetId(locked ? locked.id : null);
          }}
          onTouchMove={(e) => {
            if (!e.touches[0]) return;
            const t = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const scaleX = e.currentTarget.width / rect.width;
            const scaleY = e.currentTarget.height / rect.height;
            const posX = (t.clientX - rect.left) * scaleX;
            const posY = (t.clientY - rect.top) * scaleY;
            mousePosRef.current = { x: posX, y: posY };

            const locked = entitiesRef.current.find(
              (tgt) => !tgt.isDead && Math.hypot(posX - (tgt.x + tgt.width / 2), posY - (tgt.y + tgt.height * 0.2)) < fovRadius
            );
            setLockedTargetId(locked ? locked.id : null);
          }}
          onTouchStart={(e) => {
            if (!e.touches[0]) return;
            const t = e.touches[0];
            const rect = e.currentTarget.getBoundingClientRect();
            const scaleX = e.currentTarget.width / rect.width;
            const scaleY = e.currentTarget.height / rect.height;
            const posX = (t.clientX - rect.left) * scaleX;
            const posY = (t.clientY - rect.top) * scaleY;
            mousePosRef.current = { x: posX, y: posY };
            handleShoot();
          }}
          onClick={handleShoot}
        />

        {/* In-Canvas HUD Telemetry Overlays */}
        <div className="absolute top-2.5 left-3 pointer-events-none space-y-0.5 text-[10px] text-slate-400 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10">
          <div className="text-white font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>DIRECTX 11 HOOK: INJECTED</span>
          </div>
          <div>FRAME LATENCY: 0.84ms</div>
          <div>TARGETS IN FOV: {lockedTargetId ? '1 (LOCKED)' : '0'}</div>
          <div>ANTI-CHEAT BYPASS: ACTIVE (Ring-0)</div>
        </div>

        {/* Instructions Hint */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] text-slate-400 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          Move cursor to aim • Click to test recoil &amp; hitmarkers
        </div>

        {/* Kill Counters */}
        <div className="absolute top-2.5 right-24 pointer-events-none flex items-center gap-2 text-[10px] bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-white">
          <span>HITS: <strong className="text-amber-400">{stats.hits}</strong></span>
          <span>•</span>
          <span>HEADSHOTS: <strong className="text-red-400">{stats.headshots}</strong></span>
          <span>•</span>
          <span>KILLS: <strong className="text-emerald-400">{stats.kills}</strong></span>
        </div>
      </div>

      {/* Cheat Features Toggle Panel */}
      <div className="p-4 rounded-xl bg-black/50 border border-red-900/30 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-red-400 border-b border-white/5 pb-2">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Reversing Toggles</span>
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              initTargets(gameMode);
              setStats({ hits: 0, headshots: 0, kills: 0 });
            }}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Targets</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {/* Box ESP */}
          <button
            onClick={() => {
              sounds.playClick();
              setBoxEsp(!boxEsp);
            }}
            className={`p-2 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
              boxEsp
                ? 'bg-red-600/20 border-red-500 text-red-300'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            <span>3D Box ESP</span>
            <span className={`text-[10px] ${boxEsp ? 'text-red-400' : 'text-slate-600'}`}>
              {boxEsp ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Skeleton ESP */}
          <button
            onClick={() => {
              sounds.playClick();
              setSkeletonEsp(!skeletonEsp);
            }}
            className={`p-2 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
              skeletonEsp
                ? 'bg-red-600/20 border-red-500 text-red-300'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            <span>Bone Matrix</span>
            <span className={`text-[10px] ${skeletonEsp ? 'text-red-400' : 'text-slate-600'}`}>
              {skeletonEsp ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Snaplines */}
          <button
            onClick={() => {
              sounds.playClick();
              setSnaplines(!snaplines);
            }}
            className={`p-2 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
              snaplines
                ? 'bg-red-600/20 border-red-500 text-red-300'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            <span>Snaplines</span>
            <span className={`text-[10px] ${snaplines ? 'text-red-400' : 'text-slate-600'}`}>
              {snaplines ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Silent Aimbot */}
          <button
            onClick={() => {
              sounds.playClick();
              setAimbot(!aimbot);
            }}
            className={`p-2 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
              aimbot
                ? 'bg-red-600/20 border-red-500 text-red-300'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            <span>Silent Aimbot</span>
            <span className={`text-[10px] ${aimbot ? 'text-red-400' : 'text-slate-600'}`}>
              {aimbot ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* 360 Radar */}
          <button
            onClick={() => {
              sounds.playClick();
              setRadar(!radar);
            }}
            className={`p-2 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${
              radar
                ? 'bg-red-600/20 border-red-500 text-red-300'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            <span>360° Radar</span>
            <span className={`text-[10px] ${radar ? 'text-red-400' : 'text-slate-600'}`}>
              {radar ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* FOV Slider */}
        <div className="pt-1 flex items-center justify-between gap-4 text-xs text-slate-400">
          <span className="shrink-0 text-[11px]">
            Aimbot FOV Radius: <strong className="text-white">{fovRadius}px</strong>
          </span>
          <input
            type="range"
            min="40"
            max="180"
            step="5"
            value={fovRadius}
            onChange={(e) => setFovRadius(Number(e.target.value))}
            className="flex-1 accent-red-500 h-1.5 bg-red-950 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
