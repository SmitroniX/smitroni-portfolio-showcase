import React, { useState, useEffect, useRef } from 'react';
import {
  Skull,
  ShieldAlert,
  Terminal,
  Cpu,
  Eye,
  Flame,
  Volume2,
  VolumeX,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Crosshair,
  Ghost,
  Radio,
  Zap,
  ChevronRight,
  Sparkles,
  Layers,
  FileCode2,
  Binary,
  Maximize2,
  Target,
  Sliders,
  ShoppingBag
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { EspRadarSimulator } from './EspRadarSimulator';
import { AntiCheatBattleArena } from './AntiCheatBattleArena';
import { DarkWebMarketplace } from './DarkWebMarketplace';
import { WantedPosterGenerator } from './WantedPosterGenerator';
import {
  CS2Icon,
  ValorantIcon,
  GtaVIcon,
  MinecraftIcon,
  PhasmophobiaIcon,
  ApexLegendsIcon,
  VanguardIcon,
  VacnetIcon,
  EasyAntiCheatIcon,
  RicochetIcon,
  BattlEyeIcon
} from './BrandIcons';

interface DarkSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImGui?: () => void;
}

interface GameExploit {
  id: string;
  name: string;
  game: string;
  codename: string;
  targetProcess: string;
  anticheat: string;
  threatLevel: 'OMEGA' | 'CRITICAL' | 'HIGH';
  status: 'UNDETECTED' | 'OPERATIONAL' | 'CLASSIFIED';
  engine: string;
  description: string;
  techniques: string[];
  codeSnippet: string;
}

const getGameLogo = (gameId: string, className = "w-4 h-4 shrink-0") => {
  switch (gameId) {
    case 'cs2':
      return <CS2Icon className={className} />;
    case 'valorant':
      return <ValorantIcon className={className} />;
    case 'gta':
    case 'gta5':
      return <GtaVIcon className={className} />;
    case 'phasmo':
    case 'phasmophobia':
      return <PhasmophobiaIcon className={className} />;
    case 'minecraft':
      return <MinecraftIcon className={className} />;
    case 'apex':
      return <ApexLegendsIcon className={className} />;
    default:
      return <Crosshair className={className} />;
  }
};

const getAntiCheatLogo = (acName: string, className = "w-3.5 h-3.5 shrink-0") => {
  if (acName.includes('Vanguard')) return <VanguardIcon className={className} />;
  if (acName.includes('VACnet') || acName.includes('VAC')) return <VacnetIcon className={className} />;
  if (acName.includes('EasyAntiCheat') || acName.includes('EAC')) return <EasyAntiCheatIcon className={className} />;
  if (acName.includes('Ricochet')) return <RicochetIcon className={className} />;
  if (acName.includes('BattlEye') || acName.includes('BattleEye')) return <BattlEyeIcon className={className} />;
  return <ShieldAlert className={className} />;
};

const GAME_EXPLOITS: GameExploit[] = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2 / CS:GO',
    game: 'CS2 / CS:GO',
    codename: 'ViperStrike Kernel Internal',
    targetProcess: 'cs2.exe',
    anticheat: 'Valve Anti-Cheat (VACnet 3.0)',
    threatLevel: 'OMEGA',
    status: 'UNDETECTED',
    engine: 'Source 2 (DirectX 11 / Vulkan)',
    description:
      'Direct memory manipulation & Bone Matrix transformation tool. Parses dynamic NetVars directly from client.dll memory space to render high-fidelity ESP bounding boxes and algorithmic Bezier recoil compensation.',
    techniques: [
      'NetVar offset memory dump & dynamic SigScanning',
      'WorldToScreen 4x4 ViewMatrix transformation calculation',
      'Direct3D 11 EndScene VMT hook for hardware-accelerated ImGui overlay',
      'Standalone Recoil Control System (RCS) subtracting aimPunchAngle smoothly'
    ],
    codeSnippet: `// CS2 ViewMatrix & Bone ESP Extraction
struct BoneMatrix { float mat[3][4]; };
void RenderPlayerESP(uintptr_t entityList, ViewMatrix& vm) {
    for (int i = 1; i <= 64; i++) {
        uintptr_t entity = Mem::Read<uintptr_t>(entityList + (i * 0x10));
        if (!entity || !Mem::Read<bool>(entity + Offsets::m_bPawnIsAlive)) continue;
        Vector3 headPos = GetBonePosition(entity, 6); // Head bone ID
        Vector2 screenPos;
        if (WorldToScreen(headPos, screenPos, vm)) {
            DrawSnapline(screenPos, Color::Red());
            DrawBoneSkeleton(entity, vm);
        }
    }
}`
  },
  {
    id: 'valorant',
    name: 'Valorant',
    game: 'Valorant',
    codename: 'Aegis Vanguard Ring-0 Bypass Research',
    targetProcess: 'VALORANT-Win64-Shipping.exe',
    anticheat: 'Riot Vanguard (Ring-0 Hypervisor / vgk.sys)',
    threatLevel: 'OMEGA',
    status: 'OPERATIONAL',
    engine: 'Unreal Engine 4.27',
    description:
      'State-of-the-art kernel security research into Vanguard hypervisor memory guards. Demonstrates PCIe Direct Memory Access (DMA) hardware screamer techniques and Bring-Your-Own-Vulnerable-Driver (BYOVD) physical mapping without hooks in protected memory.',
    techniques: [
      'PCIe DMA (Direct Memory Access) Screamer hardware packet emulation',
      'BYOVD driver exploit mapping physical memory (MmMapIoSpace)',
      'Bypassing CR3 page directory base encryption & virtualization checks',
      'Microcontroller HID mouse packet injector bypassing software detection'
    ],
    codeSnippet: `// Kernel Physical Memory Reader (DMA Architecture)
NTSTATUS ReadPhysicalMemory(ULONG64 physAddress, PVOID buffer, SIZE_T size) {
    PHYSICAL_ADDRESS target = { .QuadPart = (LONGLONG)physAddress };
    PVOID mappedAddress = MmMapIoSpace(target, size, MmNonCached);
    if (!mappedAddress) return STATUS_UNSUCCESSFUL;
    RtlCopyMemory(buffer, mappedAddress, size);
    MmUnmapIoSpace(mappedAddress, size);
    return STATUS_SUCCESS;
}`
  },
  {
    id: 'gta5',
    name: 'Grand Theft Auto V / GTA Online',
    game: 'GTA V / FiveM',
    codename: 'Los Santos Chaos Native Invoker',
    targetProcess: 'GTA5.exe',
    anticheat: 'Rockstar Arxan & BattlEye Integration',
    threatLevel: 'CRITICAL',
    status: 'OPERATIONAL',
    engine: 'RAGE Engine (Rockstar Advanced Game Engine)',
    description:
      'Native function registration table hook and cross-thread script invoker. Overrides Rockstar tunable global arrays to unlock vehicles, freeze entity damage states, and bypass transaction server checksum verifications.',
    techniques: [
      'ScriptHookV pattern scanning to locate Native Registration Handler',
      'Cross-thread native call dispatching via Fibers/Script Virtual Machine',
      'Global variable offset injection (Tunables Global_262145)',
      'Transaction server telemetry blocker & entity clone cascade protection'
    ],
    codeSnippet: `// RAGE Engine Native Invoker Dispatcher
void NativeInvoker::Call(uint64_t hash, NativeArgs* args) {
    auto handler = NativeTable::GetHandler(hash);
    if (handler) {
        NativeContext ctx(args);
        handler(&ctx);
    }
}
// Give All Weapons & Godmode Memory Patch
void ActivateInvincibility() {
    PLAYER::SET_PLAYER_INVINCIBLE(PLAYER::PLAYER_ID(), TRUE);
    PED::SET_PED_CAN_RAGDOLL(PLAYER::PLAYER_PED_ID(), FALSE);
}`
  },
  {
    id: 'phasmophobia',
    name: 'Phasmophobia',
    game: 'Phasmophobia',
    codename: 'SpecterSight Paranormal ESP & Memory Freeze',
    targetProcess: 'Phasmophobia.exe',
    anticheat: 'Custom Integrity Hash Checks',
    threatLevel: 'HIGH',
    status: 'OPERATIONAL',
    engine: 'Unity (IL2CPP Runtime)',
    description:
      'IL2CPP binary reverse engineering tool. Extracts class structures and runtime metadata using Il2CppDumper to reveal ghost identity, real-time favorite room temperatures, hunting state timers, and manipulate cursed possessions.',
    techniques: [
      'Il2CppDumper metadata parsing & Ghidra reverse engineering',
      'GhostController memory inspection: reveals Ghost Type (Banshee/Demon/Revenant)',
      'PlayerSanity lock at 100.0f and fusebox state forced ON',
      'Cursed possession manipulation (Tarot cards forced The Sun / Ouija board)'
    ],
    codeSnippet: `// Unity IL2CPP Ghost Controller Hook
void Hook_GhostAI_Update(GhostAI* ghost) {
    int ghostType = ghost->fields.ghostType; // 1 = Demon, 2 = Banshee, etc.
    float huntCooldown = ghost->fields.huntTimer;
    Vector3 ghostPos = ghost->fields.transform->fields.position;
    
    // Draw 3D Paranormal Radar Overlay
    RenderGhostRadar(ghostPos, GetGhostName(ghostType), huntCooldown);
}`
  },
  {
    id: 'minecraft',
    name: 'Minecraft (Java Edition)',
    game: 'Minecraft Java',
    codename: 'Eclipse Bytecode Hacked Client Engine',
    targetProcess: 'javaw.exe',
    anticheat: 'GrimAC, Vulcan, Hypixel Watchdog, Spartan',
    threatLevel: 'OMEGA',
    status: 'UNDETECTED',
    engine: 'Java Virtual Machine (JVM / LWJGL)',
    description:
      'High-performance JVM bytecode transformation engine built using ASM and Fabric/Forge Mixin architecture. Spoofs incoming/outgoing network packets to achieve Velocity cancellation and humanized rotational raytracing.',
    techniques: [
      'Java ASM bytecode instrumentation & runtime class redefinition',
      'Packet spoofing: intercepts SPacketEntityVelocity to nullify knockback',
      'Raytrace KillAura smoothing mimicking legitimate bezier mouse kinematics',
      'Auto-Scaffold path planning with predictive tick block placement'
    ],
    codeSnippet: `// Bytecode Injection via Mixin & Packet Interception
@Inject(method = "handleEntityVelocity", at = @At("HEAD"), cancellable = true)
private void onEntityVelocity(SPacketEntityVelocity packet, CallbackInfo ci) {
    if (packet.getEntityID() == mc.player.getId() && EclipseModule.VELOCITY.isEnabled()) {
        ci.cancel(); // 0% Knockback bypass
    }
}`
  },
  {
    id: 'apex',
    name: 'Apex Legends & CoD Warzone',
    game: 'Apex / Warzone',
    codename: 'Titanium Ballistic Prediction Engine',
    targetProcess: 'r5apex.exe / ModernWarfare.exe',
    anticheat: 'EasyAntiCheat (EAC) & Ricochet Kernel',
    threatLevel: 'CRITICAL',
    status: 'CLASSIFIED',
    engine: 'Source Modified & IW Engine',
    description:
      'Bespoke kernel-mode memory reader with bullet drop trajectory physics. Calculates target velocity vectors and travel time to predict 100% projectile impacts across long-range ballistic sniper rifles.',
    techniques: [
      'Kernel SSDT & IRP Hook bypasses for entity list reading',
      'Ballistic projectile physics simulation (Gravity + Drag + Bullet Speed)',
      'Highlight Glow struct modification in engine memory space',
      'Obfuscated Shellcode injection via thread hijacking'
    ],
    codeSnippet: `// Ballistic Target Prediction Equation
Vector3 PredictImpactPosition(Vector3 targetPos, Vector3 targetVel, float bulletSpeed, float gravity) {
    float distance = Vector3::Distance(LocalPlayer::GetEyePos(), targetPos);
    float timeOfFlight = distance / bulletSpeed;
    Vector3 predicted = targetPos + (targetVel * timeOfFlight);
    predicted.z += 0.5f * gravity * (timeOfFlight * timeOfFlight);
    return predicted;
}`
  }
];

export const DarkSideModal: React.FC<DarkSideModalProps> = ({ isOpen, onClose, onOpenImGui }) => {
  const [phase, setPhase] = useState<'breach' | 'dossier'>('breach');
  const [activeTab, setActiveTab] = useState<'radar' | 'battle' | 'marketplace' | 'poster' | 'games' | 'arsenal' | 'simulator'>('radar');
  const [selectedGame, setSelectedGame] = useState<GameExploit>(GAME_EXPLOITS[0]);
  const [breachProgress, setBreachProgress] = useState(0);
  const [breachText, setBreachText] = useState('INITIALIZING BIOMETRIC OVERRIDE...');
  
  // Simulator states
  const [simProcess, setSimProcess] = useState('cs2.exe');
  const [simModule, setSimModule] = useState('ViperStrike Direct3D 11 VMT Hook');
  const [simLogs, setSimLogs] = useState<string[]>([
    '[INIT] Memory Injector ready. Select target game process.'
  ]);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isInjected, setIsInjected] = useState(false);
  const [cheatToggles, setCheatToggles] = useState({
    esp: true,
    aimbot: true,
    recoil: true,
    ghostReveal: true,
    antiCheatBypass: true
  });

  const logsEndRef = useRef<HTMLDivElement>(null);
  const simTimeoutIdsRef = useRef<number[]>([]);

  // Clear timers on modal close or unmount
  useEffect(() => {
    return () => {
      simTimeoutIdsRef.current.forEach((id) => clearTimeout(id));
      simTimeoutIdsRef.current = [];
    };
  }, [isOpen]);

  // Trigger sound and breach animation on open
  useEffect(() => {
    if (isOpen) {
      setPhase('breach');
      setBreachProgress(0);
      sounds.playAlarm();
      sounds.playGlitch();

      const messages = [
        'WARNING: UNAUTHORIZED INTERPOL CYBER DEFENSE OVERRIDE...',
        'BYPASSING RING-0 KERNEL DEFENSES (CR3 RECTIFICATION)...',
        'RESOLVING SUBJECT: ASMIT JOGDAND // ALIAS: "SMITRONIX"...',
        'EXTRACTING CLASSIFIED BLACK HAT & GAME REVERSING VAULT...',
        'DECRYPTION COMPLETE: ACCESSING OMEGA-LEVEL DOSSIER...'
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        setBreachProgress((prev) => {
          const next = prev + 20;
          if (currentStep < messages.length) {
            setBreachText(messages[currentStep]);
            currentStep++;
            sounds.playKeyTick();
          }
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              sounds.playAccessGranted();
              setPhase('dossier');
            }, 400);
            return 100;
          }
          return next;
        });
      }, 350);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll simulator logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simLogs]);

  const handleRunInjectionSimulator = () => {
    if (isInjecting) return;
    setIsInjecting(true);
    setIsInjected(false);
    sounds.playInject();

    const newLogs = [
      `[0.01s] Attached stealth handle to process '${simProcess}'`,
      `[0.05s] Scanning PEB and module base addresses...`,
      `[0.12s] Found base memory region: 0x7FFF${Math.floor(Math.random() * 89999 + 10000)}0000`,
      `[0.18s] Allocating 8192 bytes PAGE_EXECUTE_READWRITE memory...`,
      `[0.26s] Nullifying anti-cheat integrity heartbeat packets... SUCCESS`,
      `[0.34s] Injecting module: ${simModule}...`,
      `[0.42s] Hooking Present() VMT table & initializing ImGui renderer...`,
      `[✓] MODULE ACTIVE: All telemetry blinded. Injected successfully!`
    ];

    setSimLogs([`[+] Initiating stealth injection into ${simProcess}...`]);

    simTimeoutIdsRef.current.forEach((id) => clearTimeout(id));
    simTimeoutIdsRef.current = [];

    newLogs.forEach((log, index) => {
      const timer = window.setTimeout(() => {
        setSimLogs((prev) => [...prev, log]);
        sounds.playKeyTick();
        if (index === newLogs.length - 1) {
          setIsInjecting(false);
          setIsInjected(true);
          sounds.playSuccess();
        }
      }, (index + 1) * 220);
      simTimeoutIdsRef.current.push(timer);
    });
  };

  const skipBreach = () => {
    sounds.playAccessGranted();
    setPhase('dossier');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl overflow-y-auto">
      {/* CRT Scanline & Grain Overlay */}
      <div className="fixed inset-0 crt-scanlines opacity-80 pointer-events-none z-10" />

      {/* PHASE 1: Dramatic Cinematic Breach Sequence */}
      {phase === 'breach' ? (
        <div className="relative z-20 w-full max-w-2xl p-6 sm:p-8 bg-[#0B0405] border-2 border-red-600/80 rounded-2xl shadow-crimson-glow text-center space-y-6">
          <div className="flex items-center justify-center gap-3 text-red-500 animate-pulse">
            <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            <span className="text-sm sm:text-base font-mono font-bold tracking-widest uppercase">
              CRITICAL SECURITY OVERRIDE
            </span>
            <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              ACCESSING RESTRICTED DOSSIER
            </h2>
            <p className="text-xs sm:text-sm font-mono text-red-400/90">
              LEVEL 9 CYBER THREAT CLASSIFICATION // INTERPOL FILE #SRX-009
            </p>
          </div>

          {/* Glitch Progress Meter */}
          <div className="space-y-2 max-w-md mx-auto">
            <div className="h-3 w-full bg-red-950/60 rounded-full overflow-hidden border border-red-500/50 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-300 shadow-[0_0_15px_#EF4444]"
                style={{ width: `${breachProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-red-400">
              <span className="truncate max-w-[280px]">{breachText}</span>
              <span className="font-bold">{breachProgress}%</span>
            </div>
          </div>

          <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl text-left font-mono text-xs text-red-300 space-y-1">
            <div>&gt; BYPASS_SIGNATURE: MmCopyVirtualMemory Hooked</div>
            <div>&gt; HWID_SPOOFER: SMBIOS / NIC MAC address randomized</div>
            <div>&gt; TARGET_ALTER_EGO: Elite Game Reverser &amp; Black Hat Architect</div>
          </div>

          <button
            onClick={skipBreach}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 font-mono text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>Skip Decryption</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* PHASE 2: Complete Classified Cyber Rogue & Game Reverser Dossier */
        <div className="relative z-20 w-full max-w-5xl bg-[#090507] border-2 border-red-600/60 rounded-2xl shadow-crimson-glow overflow-hidden my-auto max-h-[92vh] flex flex-col font-mono">
          
          {/* Top Classified Warning Header */}
          <div className="bg-gradient-to-r from-red-950 via-red-900/80 to-black px-4 sm:px-6 py-3 border-b border-red-600/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-200 tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>INTERPOL CYBER THREAT DOSSIER // TOP SECRET</span>
                </div>
                <span className="text-[10px] text-red-400/80">
                  CASE FILE #SRX-OMEGA-99 • THREAT LEVEL: CRITICAL
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenImGui && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenImGui();
                  }}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/60 text-red-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(239,68,68,0.4)] active:scale-95 shrink-0"
                  title="Open DirectX ImGui Cheat Menu Overlay"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-300" />
                  <span>IMGUI MENU</span>
                  <span className="hidden sm:inline text-amber-300 font-mono text-[10px]">[INS]</span>
                </button>
              )}

              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Exit Dossier"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">RETURN TO CIVILIAN MODE (ESC)</span>
              </button>
            </div>
          </div>

          {/* Dossier Body: Split Profile & Archive */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Wanted Bio Card & Alter Ego Intro */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 sm:p-5 rounded-2xl bg-red-950/20 border border-red-600/30 relative overflow-hidden">
              <div className="absolute top-2 right-4 pointer-events-none opacity-20 sm:opacity-30">
                <div className="classified-stamp text-xs sm:text-sm px-3 py-1">
                  WANTED: HIGH BOUNTY
                </div>
              </div>

              {/* Hologram Avatar / Wanted Mugshot */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-black/60 border border-red-500/30 rounded-xl relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-red-950 to-black border-2 border-red-500/50 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <Skull className="w-16 h-16 text-red-500 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent" />
                  <div className="absolute bottom-1 text-[9px] font-bold text-red-400 tracking-widest uppercase">
                    [SMITRONIX]
                  </div>
                </div>
                <div className="mt-3 text-center space-y-0.5">
                  <div className="text-sm font-bold text-white">ASMIT JOGDAND</div>
                  <div className="text-xs text-red-400 font-bold">ALIAS: "THE KERNEL SPECTRE"</div>
                  <div className="text-[10px] text-slate-400">BOUNTY: ₿ 120.00 BTC (~$7.8M USD)</div>
                </div>
              </div>

              {/* Bio & Crime Sheet */}
              <div className="md:col-span-8 space-y-2 text-xs sm:text-sm text-slate-300">
                <div className="text-red-400 font-bold text-sm sm:text-base flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>The Developer's Classified Dark Side Revealed</span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  By day: an elite full-stack engineer and cloud architect building refined UI/UX. 
                  By night: an underground ring-0 kernel exploiter, reverse engineer, and master game modder. 
                  Specializes in bypassing Vanguard, BattlEye, VAC, and EasyAntiCheat using custom driver-level physical memory injection, DMA hardware spoofing, and decompiled bytecode manipulation.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div className="p-2 rounded bg-black/40 border border-red-900/40">
                    <span className="text-slate-500 block text-[9px]">SPECIALIZATION</span>
                    <span className="text-red-300 font-bold">Ring-0 Drivers / Hooking</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-red-900/40">
                    <span className="text-slate-500 block text-[9px]">PRIMARY WEAPONS</span>
                    <span className="text-red-300 font-bold">IDA Pro / x64dbg / C++20</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-red-900/40">
                    <span className="text-slate-500 block text-[9px]">GAMES MASTERED</span>
                    <span className="text-red-300 font-bold">CS2, Val, GTA5, Phasmo</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-red-900/40">
                    <span className="text-slate-500 block text-[9px]">CURRENT STATUS</span>
                    <span className="text-emerald-400 font-bold">100% UNDETECTED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Dossier Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 border-b border-red-900/40 pb-2 overflow-x-auto">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('radar');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'radar'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-amber-300" />
                <span>Live ESP &amp; Aimbot Radar</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[9px] text-amber-300 font-bold">
                  SIMULATOR
                </span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('battle');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'battle'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Anti-Cheat Boss Duel</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-[9px] text-rose-300 font-bold">
                  BATTLE
                </span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('marketplace');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'marketplace'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>Dark Web Exploit Market</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[9px] text-amber-300 font-bold">
                  ONION
                </span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('poster');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'poster'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Skull className="w-3.5 h-3.5 text-red-400" />
                <span>FBI Wanted Poster</span>
                <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-[9px] text-red-300 font-bold">
                  CANVAS
                </span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('games');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'games'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Game Engine Reversing ({GAME_EXPLOITS.length})</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('simulator');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'simulator'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Payload Injector Simulator</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('arsenal');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'arsenal'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Binary className="w-3.5 h-3.5" />
                <span>Black Hat Cyber Arsenal</span>
              </button>
            </div>

            {/* TAB 0: Interactive ESP & Aimbot Radar Simulator */}
            {activeTab === 'radar' && (
              <EspRadarSimulator />
            )}

            {/* TAB 0.5: Turn-Based Anti-Cheat vs Hacker Duel Arena */}
            {activeTab === 'battle' && (
              <AntiCheatBattleArena />
            )}

            {/* TAB 0.8: Dark Web Onion Exploit Marketplace */}
            {activeTab === 'marketplace' && (
              <DarkWebMarketplace />
            )}

            {/* TAB 0.9: FBI / Interpol Most Wanted Poster Generator */}
            {activeTab === 'poster' && (
              <WantedPosterGenerator />
            )}

            {/* TAB 1: Game Engine Reversing & Modding Vault */}
            {activeTab === 'games' && (
              <div className="space-y-4">
                {/* Horizontal Game Selector Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {GAME_EXPLOITS.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedGame(exp);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        selectedGame.id === exp.id
                          ? 'bg-red-600/30 border border-red-500 text-white'
                          : 'bg-black/40 border border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="shrink-0">{getGameLogo(exp.id, "w-3.5 h-3.5")}</span>
                      <span>{exp.game}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Game Deep Dive */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-red-900/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                        <span className="shrink-0">{getGameLogo(selectedGame.id, "w-4 h-4")}</span>
                        <span>{selectedGame.codename}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                        {selectedGame.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2.5 py-1 rounded bg-red-950/60 border border-red-800 text-red-300 font-bold flex items-center gap-1.5">
                        {getAntiCheatLogo(selectedGame.anticheat, "w-3.5 h-3.5")}
                        <span>Target: {selectedGame.anticheat}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold">
                        {selectedGame.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedGame.description}
                  </p>

                  {/* Exploitation Vectors */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-red-400 font-bold uppercase tracking-wider block">
                      Reverse Engineering Feats &amp; Techniques:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedGame.techniques.map((tech, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 rounded-lg bg-red-950/10 border border-red-900/20 text-xs text-slate-300"
                        >
                          <Zap className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span>{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decompiled Memory Hook Code Preview */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Decompiled Hook &amp; Exploit Architecture:</span>
                      </span>
                      <span className="text-slate-500">C++20 / x86_64</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-[#05080E] border border-white/10 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
                      <code>{selectedGame.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Live Memory Injector Simulator */}
            {activeTab === 'simulator' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-950/15 border border-red-800/30 text-xs text-red-300">
                  ⚠️ <span className="font-bold">Interactive Sandbox:</span> Test the custom memory injection engine against game processes in real-time. Select a target binary and payload, then initiate the injection pipeline.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Select Process */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">
                      Target Process Executable:
                    </label>
                    <select
                      value={simProcess}
                      onChange={(e) => setSimProcess(e.target.value)}
                      className="w-full bg-black/60 border border-red-900/50 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                    >
                      <option value="cs2.exe">cs2.exe (Counter-Strike 2)</option>
                      <option value="VALORANT-Win64-Shipping.exe">VALORANT-Win64-Shipping.exe (Riot Games)</option>
                      <option value="GTA5.exe">GTA5.exe (Grand Theft Auto V)</option>
                      <option value="Phasmophobia.exe">Phasmophobia.exe (Kinetic Games)</option>
                      <option value="javaw.exe">javaw.exe (Minecraft Java 1.21)</option>
                      <option value="r5apex.exe">r5apex.exe (Apex Legends)</option>
                    </select>
                  </div>

                  {/* Select Exploit Type */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">
                      Injection Vector &amp; Payload:
                    </label>
                    <select
                      value={simModule}
                      onChange={(e) => setSimModule(e.target.value)}
                      className="w-full bg-black/60 border border-red-900/50 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                    >
                      <option value="Kernel Stealth Manual Map (PE Header Erased)">Kernel Stealth Manual Map (PE Header Erased)</option>
                      <option value="DirectX 11 VMT Hook & ImGui DrawList">DirectX 11 VMT Hook &amp; ImGui DrawList</option>
                      <option value="IL2CPP Runtime Method Detour Hook">IL2CPP Runtime Method Detour Hook</option>
                      <option value="JVM Bytecode Mixin Network Interceptor">JVM Bytecode Mixin Network Interceptor</option>
                      <option value="DMA Hardware Memory Reader (PCIe Screamer)">DMA Hardware Memory Reader (PCIe Screamer)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunInjectionSimulator}
                    disabled={isInjecting}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isInjecting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>INJECTING EXPLOIT SHELLCODE...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>EXECUTE MEMORY INJECTION</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Injection Terminal Console */}
                <div className="rounded-xl bg-[#04060A] border border-red-900/40 p-3.5 space-y-1 text-xs font-mono max-h-48 overflow-y-auto">
                  <div className="text-slate-500 text-[10px] pb-1 border-b border-white/5 flex items-center justify-between">
                    <span>INJECTION CONSOLE • /dev/shm/kernel_hook.sys</span>
                    <span>PID: 1337</span>
                  </div>
                  {simLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`${
                        log.includes('✓')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('WARNING')
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>

                {/* Active Exploit Toggles when Injected */}
                {isInjected && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>EXPLOIT HOOK ACTIVE: TOGGLE MODULES</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                        ANTI-CHEAT BLINDED
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setCheatToggles((prev) => ({ ...prev, esp: !prev.esp }));
                        }}
                        className={`p-2 rounded-lg border text-left font-bold transition-all ${
                          cheatToggles.esp
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            : 'bg-black/40 border-white/10 text-slate-500'
                        }`}
                      >
                        Bone Matrix ESP: {cheatToggles.esp ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setCheatToggles((prev) => ({ ...prev, aimbot: !prev.aimbot }));
                        }}
                        className={`p-2 rounded-lg border text-left font-bold transition-all ${
                          cheatToggles.aimbot
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            : 'bg-black/40 border-white/10 text-slate-500'
                        }`}
                      >
                        Silent Aimbot: {cheatToggles.aimbot ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setCheatToggles((prev) => ({ ...prev, recoil: !prev.recoil }));
                        }}
                        className={`p-2 rounded-lg border text-left font-bold transition-all ${
                          cheatToggles.recoil
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            : 'bg-black/40 border-white/10 text-slate-500'
                        }`}
                      >
                        Zero Recoil: {cheatToggles.recoil ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setCheatToggles((prev) => ({ ...prev, ghostReveal: !prev.ghostReveal }));
                        }}
                        className={`p-2 rounded-lg border text-left font-bold transition-all ${
                          cheatToggles.ghostReveal
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            : 'bg-black/40 border-white/10 text-slate-500'
                        }`}
                      >
                        Ghost / Godmode: {cheatToggles.ghostReveal ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Black Hat Cyber Arsenal */}
            {activeTab === 'arsenal' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-black/40 border border-red-900/30 space-y-1.5">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-red-400" />
                    <span>Ring-0 Kernel Driver Development</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Custom Windows KMDF driver authoring, SSDT hooking, and Direct Kernel Object Manipulation (DKOM) to unlink target processes from ActiveProcessLinks for complete invisibility.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-red-900/30 space-y-1.5">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Binary className="w-4 h-4 text-red-400" />
                    <span>Stealth Manual PE Mapping</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Reflective DLL injection without calling LoadLibraryA. Manually parses import address tables (IAT), relocates sections, and destroys the PE DOS header in memory to evade forensic scanners.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-red-900/30 space-y-1.5">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-400" />
                    <span>PCIe DMA Hardware Interception</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Using dual-PC hardware setups with FPGA PCIe screamers to inspect physical RAM directly without software hooks on the game machine, completely bypassing driver-level kernel detection.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-red-900/30 space-y-1.5">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-400" />
                    <span>JVM &amp; IL2CPP Bytecode Decompilation</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Dynamic class redefinition in Java with ASM &amp; Fabric Mixin pipelines; Unity engine metadata extraction using Il2CppDumper and Ghidra for real-time game state manipulation.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Dossier Footer */}
          <div className="px-4 py-2.5 bg-black/80 border-t border-red-900/40 flex items-center justify-between text-[11px] text-slate-500">
            <span>DISCLAIMER: For ethical reverse engineering &amp; cybersecurity research demonstrations.</span>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="text-red-400 hover:text-red-300 font-bold"
            >
              [CLOSE DOSSIER]
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
