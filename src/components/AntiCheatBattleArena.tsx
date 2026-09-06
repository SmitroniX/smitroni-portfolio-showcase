import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  RotateCcw,
  Trophy,
  Terminal,
  Zap,
  Skull,
  AlertTriangle,
  Heart,
  Radio
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface AntiCheatBoss {
  id: string;
  name: string;
  codename: string;
  game: string;
  hp: number;
  maxHp: number;
  defense: number;
  threatLevel: 'OMEGA' | 'CRITICAL' | 'HIGH';
  icon: string;
  color: string;
  borderColor: string;
  description: string;
  attacks: {
    name: string;
    damage: number;
    description: string;
    type: 'scan' | 'ban' | 'telemetry';
  }[];
}

const BOSS_LIST: AntiCheatBoss[] = [
  {
    id: 'vanguard',
    name: 'Riot Vanguard',
    codename: 'vgk.sys Ring-0 Boot Driver',
    game: 'Valorant / League of Legends',
    hp: 950,
    maxHp: 950,
    defense: 25,
    threatLevel: 'OMEGA',
    icon: '🛡️',
    color: 'from-rose-600 to-red-900',
    borderColor: 'border-rose-500',
    description: 'Kernel-level boot driver loaded before Windows OS initializes. Enforces SecureBoot, HVCI memory integrity, and continuous memory pool audits.',
    attacks: [
      { name: 'Kernel Stack Walking Audit', damage: 22, description: 'Traces execution stack pointers to detect unbacked memory code pages.', type: 'scan' },
      { name: 'TPM 2.0 Hardware Attestation', damage: 32, description: 'Verifies motherboard cryptographic trust certificates and Secure Boot integrity.', type: 'telemetry' },
      { name: 'Hardware ID Ban Wave (Code 152)', damage: 45, description: 'Bans NIC MAC, SMBIOS UUID, and NVMe serial numbers directly.', type: 'ban' }
    ]
  },
  {
    id: 'vacnet',
    name: 'Valve VACnet 3.0',
    codename: 'Deep Learning Sub-Tick Neural Cluster',
    game: 'Counter-Strike 2 / TF2',
    hp: 850,
    maxHp: 850,
    defense: 20,
    threatLevel: 'OMEGA',
    icon: '👁️',
    color: 'from-amber-600 to-orange-950',
    borderColor: 'border-amber-500',
    description: 'Cloud AI cluster analyzing petabytes of match demos, sub-tick mouse movement jerkiness, angular acceleration, and predictive crosshair snaps.',
    attacks: [
      { name: 'Sub-Tick Kinematic Anomaly Detection', damage: 20, description: 'Flags unnatural aim trajectory velocity delta spikes within 1.5ms.', type: 'scan' },
      { name: 'Trust Factor Suppression Quarantine', damage: 28, description: 'Reduces player matchmaking status to untrusted cheater matchmaking pool.', type: 'telemetry' },
      { name: 'VAC Live Real-Time Match Cancellation', damage: 40, description: 'Instantly terminates live match upon detecting dynamic NetVar tampering.', type: 'ban' }
    ]
  },
  {
    id: 'eac',
    name: 'EasyAntiCheat (EAC)',
    codename: 'EasyAntiCheat.sys Driver Guard',
    game: 'Apex Legends / Rust / Fortnite',
    hp: 800,
    maxHp: 800,
    defense: 18,
    threatLevel: 'CRITICAL',
    icon: '⚡',
    color: 'from-blue-600 to-cyan-950',
    borderColor: 'border-blue-500',
    description: 'Wide-spread kernel watchdog monitoring OpenProcess handles, thread injection hooks, and virtual memory read/write permissions.',
    attacks: [
      { name: 'ObRegisterCallbacks Handle Stripping', damage: 18, description: 'Strips PROCESS_VM_READ and WRITE access rights from cheat processes.', type: 'scan' },
      { name: 'Driver Certificate Revocation Probe', damage: 26, description: 'Queries Windows Defender driver blocklist against stolen certs.', type: 'telemetry' },
      { name: 'Game Security Violation (#0000000D)', damage: 38, description: 'Fatal unhandled exception terminate with memory core dump sent to cloud.', type: 'ban' }
    ]
  },
  {
    id: 'ricochet',
    name: 'Activision Ricochet',
    codename: 'Server-Side Telemetry & Mitigation Matrix',
    game: 'Call of Duty: Warzone / Modern Warfare III',
    hp: 880,
    maxHp: 880,
    defense: 22,
    threatLevel: 'CRITICAL',
    icon: '🎯',
    color: 'from-emerald-600 to-teal-950',
    borderColor: 'border-emerald-500',
    description: 'Server-orchestrated anti-cheat equipped with live in-game mitigations: phantom targets, damage shielding, and weapon disarming.',
    attacks: [
      { name: 'Damage Shield & Ghost Bullets', damage: 22, description: 'Renders legitimate players immune and nullifies incoming damage packets.', type: 'telemetry' },
      { name: 'Hallucination Dummy Decoys', damage: 30, description: 'Spawns server-side fake invisible entities to bait and trap silent aimbots.', type: 'scan' },
      { name: 'Shadowban Disconnect (Lobby Purgatory)', damage: 42, description: 'Silently exiles cheat signature to high-ping developer shadowban lobbies.', type: 'ban' }
    ]
  }
];

interface PlayerMove {
  id: string;
  name: string;
  cost: number;
  minDamage: number;
  maxDamage: number;
  heal?: number;
  description: string;
  cooldown: number;
  currentCooldown: number;
  technique: string;
}

const INITIAL_PLAYER_MOVES: PlayerMove[] = [
  {
    id: 'byovd',
    name: 'BYOVD Signed Driver Exploit',
    cost: 25,
    minDamage: 180,
    maxDamage: 240,
    description: 'Exploits a vulnerable signed manufacturer driver (RTCore64.sys) to gain Ring-0 arbitrary read/write, punching through kernel protections.',
    cooldown: 0,
    currentCooldown: 0,
    technique: 'CVE-2019-16098 Arbitrary Physical Memory Mapping'
  },
  {
    id: 'hypervisor',
    name: 'EPT Hypervisor Shadow Hook',
    cost: 40,
    minDamage: 260,
    maxDamage: 330,
    description: 'Deploys an Intel VT-x / AMD-V hypervisor. Points anti-cheat memory reads to original clean pages while CPU executes modified hooks.',
    cooldown: 2,
    currentCooldown: 0,
    technique: 'Second Level Address Translation (SLAT) Split-Memory Page View'
  },
  {
    id: 'dkom',
    name: 'DKOM Process Unlinking',
    cost: 35,
    minDamage: 140,
    maxDamage: 190,
    heal: 25,
    description: 'Direct Kernel Object Manipulation. Removes cheat process from ActiveProcessLinks doubly linked list, vanishing from OS task managers.',
    cooldown: 2,
    currentCooldown: 0,
    technique: 'ntoskrnl.exe EPROCESS Unlink & Handle Table Obfuscation'
  },
  {
    id: 'humanizer',
    name: 'Bezier Kinematic Humanizer',
    cost: 15,
    minDamage: 70,
    maxDamage: 110,
    heal: 45,
    description: 'Smoothes crosshair trajectory with Gaussian jitter and humanized response curves, suppressing anti-cheat heuristic detection.',
    cooldown: 0,
    currentCooldown: 0,
    technique: 'Non-Linear Bezier Spline & Micro-Tremor Simulation'
  },
  {
    id: 'hwid',
    name: 'Ring-0 HWID Identity Spoofer',
    cost: 30,
    minDamage: 120,
    maxDamage: 160,
    heal: 35,
    description: 'Intercepts IOCTL queries to disk controllers and network cards, generating fresh randomized SMBIOS serial numbers and MAC addresses.',
    cooldown: 1,
    currentCooldown: 0,
    technique: 'IRP Hooking: SmartGetVersion, NVMe Identify & Registry Sanitization'
  }
];

export const AntiCheatBattleArena: React.FC = () => {
  const [selectedBossIndex, setSelectedBossIndex] = useState(0);
  const boss = BOSS_LIST[selectedBossIndex];

  // Battle state
  const [bossHp, setBossHp] = useState(boss.hp);
  const [playerHp, setPlayerHp] = useState(100);
  const [playerEp, setPlayerEp] = useState(100);
  const [moves, setMoves] = useState<PlayerMove[]>(INITIAL_PLAYER_MOVES);
  const [combatLogs, setCombatLogs] = useState<string[]>([
    `[SECURITY BREACH DETECTED] Target initialized: ${boss.name} (${boss.codename}).`,
    `[HACKER PROTOCOL READY] Select ring-0 bypass exploit to neutralize kernel watchdog.`
  ]);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [battleState, setBattleState] = useState<'playing' | 'victory' | 'defeat'>('playing');
  const [shakeScreen, setShakeScreen] = useState(false);
  const [invulnerableTurns, setInvulnerableTurns] = useState(0);

  // When changing boss, reset battle
  useEffect(() => {
    resetBattle(selectedBossIndex);
  }, [selectedBossIndex]);

  const resetBattle = (bossIdx = selectedBossIndex) => {
    const newBoss = BOSS_LIST[bossIdx];
    setBossHp(newBoss.hp);
    setPlayerHp(100);
    setPlayerEp(100);
    setBattleState('playing');
    setInvulnerableTurns(0);
    setMoves(INITIAL_PLAYER_MOVES.map((m) => ({ ...m, currentCooldown: 0 })));
    setCombatLogs([
      `[ENGAGEMENT INITIATED] Target: ${newBoss.name} [${newBoss.codename}]. Threat Level: ${newBoss.threatLevel}.`,
      `[SYSTEM] Ring-0 memory allocation established. Memory integrity: 100%. Kernel Energy: 100 EP.`
    ]);
  };

  const addLog = (msg: string) => {
    setCombatLogs((prev) => [msg, ...prev.slice(0, 15)]);
  };

  const triggerShake = () => {
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 500);
  };

  // Recharge EP Move
  const handleRecharge = () => {
    if (isProcessingTurn || battleState !== 'playing') return;
    sounds.playAccessGranted();
    setIsProcessingTurn(true);

    const epGain = 45;
    const newEp = Math.min(100, playerEp + epGain);
    setPlayerEp(newEp);
    addLog(`⚡ [KERNEL OVERCLOCK] Flushed memory pipelines and restored +${epGain} Energy Points (EP). Current EP: ${newEp}.`);

    decrementCooldowns();

    setTimeout(() => {
      executeBossTurn(bossHp);
    }, 800);
  };

  const decrementCooldowns = () => {
    setMoves((prev) =>
      prev.map((m) => ({
        ...m,
        currentCooldown: Math.max(0, m.currentCooldown - 1)
      }))
    );
  };

  // Player attacks
  const handlePlayerMove = (move: PlayerMove) => {
    if (isProcessingTurn || battleState !== 'playing') return;
    if (playerEp < move.cost) {
      sounds.playAlarm();
      addLog(`❌ [ERROR] Insufficient Energy Points! Required: ${move.cost} EP, Available: ${playerEp} EP. Overclock to recharge!`);
      return;
    }
    if (move.currentCooldown > 0) {
      sounds.playGlitch();
      addLog(`⏳ [COOLDOWN] ${move.name} is currently cooling down (${move.currentCooldown} turns remaining).`);
      return;
    }

    setIsProcessingTurn(true);
    sounds.playInject();

    // Deduct EP
    setPlayerEp((prev) => Math.max(0, prev - move.cost));

    // Calculate Damage
    const rawDmg = Math.floor(Math.random() * (move.maxDamage - move.minDamage + 1)) + move.minDamage;
    const actualDmg = Math.max(20, Math.floor(rawDmg * (1 - boss.defense / 100)));
    const newBossHp = Math.max(0, bossHp - actualDmg);
    setBossHp(newBossHp);

    triggerShake();
    sounds.playHitmarker();

    let logText = `💥 [EXPLOIT EXECUTED] ${move.name} breached ${boss.name}! Inflicted ${actualDmg} ring-0 damage.`;

    // Handle Healing / Stealth Restoration
    if (move.heal) {
      const newPlayerHp = Math.min(100, playerHp + move.heal);
      setPlayerHp(newPlayerHp);
      logText += ` [HEURISTIC REPAIRED] +${move.heal}% Stealth Integrity restored.`;
    }

    // Special moves effect
    if (move.id === 'dkom') {
      setInvulnerableTurns(1);
      logText += ` [STEALTH ACTIVE] Process unlinked from EPROCESS! Immune to next scan!`;
    }

    addLog(logText);

    // Update cooldowns
    setMoves((prev) =>
      prev.map((m) =>
        m.id === move.id ? { ...m, currentCooldown: move.cooldown } : { ...m, currentCooldown: Math.max(0, m.currentCooldown - 1) }
      )
    );

    // Check Boss Defeat
    if (newBossHp <= 0) {
      setTimeout(() => {
        sounds.playAccessGranted();
        setBattleState('victory');
        addLog(`🏆 [VICTORY] ${boss.name} HAS BEEN COMPLETELY NULLIFIED! Ring-0 kernel dominance achieved.`);
        setIsProcessingTurn(false);
      }, 700);
      return;
    }

    // Boss Turn
    setTimeout(() => {
      executeBossTurn(newBossHp);
    }, 1000);
  };

  // Boss Attack AI
  const executeBossTurn = (currentBossHp: number) => {
    if (currentBossHp <= 0) return;

    if (invulnerableTurns > 0) {
      sounds.playGlitch();
      addLog(`🛡️ [SCAN EVADED] ${boss.name} attempted a memory integrity scan, but your unlinked process was completely invisible!`);
      setInvulnerableTurns(0);
      setIsProcessingTurn(false);
      return;
    }

    // Pick random attack
    const attack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)];
    const variance = Math.floor(Math.random() * 9) - 4;
    const damageDealt = Math.max(10, attack.damage + variance);
    const newPlayerHp = Math.max(0, playerHp - damageDealt);

    setPlayerHp(newPlayerHp);
    triggerShake();
    sounds.playAlarm();

    addLog(`🚨 [ANTI-CHEAT COUNTERATTACK] ${boss.name} triggered "${attack.name}"! Inflicted ${damageDealt}% Detection Damage. (${attack.description})`);

    // Check Player Defeat
    if (newPlayerHp <= 0) {
      setTimeout(() => {
        sounds.playGlitch();
        setBattleState('defeat');
        addLog(`☠️ [HWID BAN ENFORCED] Your signature was blacklisted by ${boss.name}. Re-spoof HWID and deploy fresh offsets.`);
        setIsProcessingTurn(false);
      }, 700);
      return;
    }

    setIsProcessingTurn(false);
  };

  return (
    <div className={`space-y-4 font-mono transition-transform duration-100 ${shakeScreen ? 'translate-x-1 -translate-y-1' : ''}`}>
      
      {/* Boss Selector Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-red-900/40">
        <div className="flex items-center gap-2">
          {BOSS_LIST.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => {
                sounds.playClick();
                setSelectedBossIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedBossIndex === idx
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-400'
                  : 'bg-black/40 border border-red-950 text-slate-400 hover:text-white hover:border-red-800'
              }`}
            >
              <span>{b.icon}</span>
              <span>{b.name}</span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-black/60 text-amber-300">
                {b.threatLevel}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            resetBattle();
          }}
          className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-700/50 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
          title="Restart Battle Protocol"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESET DUEL</span>
        </button>
      </div>

      {/* Main Duel Arena Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left / Top: Boss Status Card */}
        <div className={`lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#18090C] to-black border-2 ${boss.borderColor} relative overflow-hidden shadow-crimson-glow`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black/80 border border-red-500/40 flex items-center justify-center text-2xl shadow-inner">
                {boss.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-white font-display">
                    {boss.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                    {boss.threatLevel}
                  </span>
                </div>
                <div className="text-[11px] text-red-400/90 font-mono">
                  {boss.codename}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Target: {boss.game}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
            {boss.description}
          </p>

          {/* Boss HP Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                KERNEL DEFENSE INTEGRITY
              </span>
              <span className="text-white font-bold">
                {bossHp} / {boss.maxHp} HP ({Math.round((bossHp / boss.maxHp) * 100)}%)
              </span>
            </div>
            <div className="h-4 w-full bg-black/80 rounded-full overflow-hidden border border-red-600/50 p-0.5">
              <div
                className={`h-full bg-gradient-to-r ${boss.color} rounded-full transition-all duration-300 shadow-[0_0_12px_#EF4444]`}
                style={{ width: `${Math.max(0, (bossHp / boss.maxHp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Boss Special Attributes */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-black/60 border border-red-900/30">
              <span className="text-slate-400">Armor / Mitigation:</span>{' '}
              <span className="text-amber-400 font-bold">{boss.defense}%</span>
            </div>
            <div className="p-2 rounded-lg bg-black/60 border border-red-900/30">
              <span className="text-slate-400">Attack Vectors:</span>{' '}
              <span className="text-red-300 font-bold">{boss.attacks.length} Kernel Routines</span>
            </div>
          </div>
        </div>

        {/* Right / Top: Player (Cyber Rogue) Status Card */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0b1016] to-black border-2 border-emerald-500/50 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <Skull className="w-7 h-7 animate-pulse text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-white font-display">
                    Kernel Spectre (SmitroniX)
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    RING-0 OPERATOR
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  Privilege Level: Ring -1 (VT-x Hypervisor Active)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Status: {invulnerableTurns > 0 ? 'STEALTH CLOAKED (EPROCESS UNLINKED)' : 'UNDETECTED (ZERO HEURISTIC FLAGS)'}
                </div>
              </div>
            </div>
          </div>

          {/* Player Stealth / HP Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-400" />
                STEALTH INTEGRITY (UNDETECTED STATUS)
              </span>
              <span className="text-white font-bold">
                {playerHp} / 100%
              </span>
            </div>
            <div className="h-4 w-full bg-black/80 rounded-full overflow-hidden border border-emerald-600/50 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-300 shadow-[0_0_12px_#10B981]"
                style={{ width: `${Math.max(0, playerHp)}%` }}
              />
            </div>
          </div>

          {/* Player Energy / EP Bar */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                KERNEL ENERGY POINTS (EP)
              </span>
              <span className="text-white font-bold">
                {playerEp} / 100 EP
              </span>
            </div>
            <div className="h-3 w-full bg-black/80 rounded-full overflow-hidden border border-cyan-600/50 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 rounded-full transition-all duration-300 shadow-[0_0_10px_#06B6D4]"
                style={{ width: `${Math.max(0, playerEp)}%` }}
              />
            </div>
          </div>

          {/* Quick Overclock Action */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Need energy to deploy heavy Ring-0 payloads?</span>
            <button
              onClick={handleRecharge}
              disabled={isProcessingTurn || battleState !== 'playing'}
              className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>OVERCLOCK CORE (+45 EP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Battle Status Banner: Victory or Defeat */}
      {battleState === 'victory' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 border-2 border-emerald-500 text-center space-y-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 mb-1">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-display">
            ANTI-CHEAT REVERSED &amp; NULLIFIED!
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
            You successfully routed around all kernel hooks and algorithmic heuristics of {boss.name}. 
            Your binary driver remains undetected with 100% Ring-0 persistence.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => resetBattle()}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider transition-all"
            >
              Duel Again
            </button>
            <button
              onClick={() => {
                const nextIdx = (selectedBossIndex + 1) % BOSS_LIST.length;
                setSelectedBossIndex(nextIdx);
              }}
              className="px-5 py-2 rounded-xl bg-black/60 hover:bg-black/90 border border-emerald-400/50 text-emerald-300 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Challenge Next Anti-Cheat &gt;
            </button>
          </div>
        </div>
      )}

      {battleState === 'defeat' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-2 border-red-500 text-center space-y-2 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-400 text-red-300 mb-1">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-display">
            HWID BAN ENFORCED BY {boss.name.toUpperCase()}
          </h3>
          <p className="text-xs sm:text-sm text-red-200 max-w-xl mx-auto">
            Detection threshold exceeded! The kernel watchdog verified foreign code pages and isolated your virtual memory space.
          </p>
          <div className="pt-2">
            <button
              onClick={() => resetBattle()}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/40"
            >
              Deploy Spoofer &amp; Retry Duel
            </button>
          </div>
        </div>
      )}

      {/* Cyber Exploit Skill Deck */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="font-bold flex items-center gap-1.5 text-red-400">
            <Terminal className="w-4 h-4 text-red-500" />
            RING-0 CYBER COUNTERMEASURE ARSENAL
          </span>
          <span className="text-slate-400 text-[11px]">
            {isProcessingTurn ? 'Executing kernel memory modification...' : 'Select countermeasure to attack'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {moves.map((move) => {
            const canAfford = playerEp >= move.cost;
            const onCooldown = move.currentCooldown > 0;
            const isDisabled = isProcessingTurn || !canAfford || onCooldown || battleState !== 'playing';

            return (
              <button
                key={move.id}
                onClick={() => handlePlayerMove(move)}
                disabled={isDisabled}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                  isDisabled
                    ? 'bg-black/30 border-white/5 opacity-50 cursor-not-allowed'
                    : 'bg-black/70 hover:bg-red-950/30 border-red-500/40 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] active:scale-[0.98]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white group-hover:text-red-300 transition-colors">
                      {move.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold shrink-0">
                      {move.cost} EP
                    </span>
                  </div>

                  <div className="text-[10px] text-amber-300/90 font-mono mt-0.5">
                    {move.technique}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">
                    {move.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-red-400 font-bold">
                    DMG: {move.minDamage} - {move.maxDamage}
                  </span>
                  {move.heal && (
                    <span className="text-emerald-400 font-bold">
                      +{move.heal}% Stealth
                    </span>
                  )}
                  {onCooldown && (
                    <span className="text-amber-400 font-bold">
                      {move.currentCooldown}T CD
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Tactical Combat Terminal Feed */}
      <div className="p-4 rounded-xl bg-black/90 border border-red-900/40 font-mono text-xs space-y-2 shadow-inner">
        <div className="flex items-center justify-between pb-2 border-b border-red-950">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px]">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>RING-0 MEMORY INTERCEPTION LOGS</span>
          </div>
          <span className="text-[10px] text-slate-500">REAL-TIME TELEMETRY</span>
        </div>

        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {combatLogs.map((log, i) => (
            <div
              key={i}
              className={`leading-relaxed text-[11px] ${
                log.includes('VICTORY')
                  ? 'text-emerald-400 font-bold'
                  : log.includes('HWID BAN') || log.includes('COUNTERATTACK')
                  ? 'text-red-400'
                  : log.includes('EXPLOIT EXECUTED')
                  ? 'text-amber-300'
                  : log.includes('OVERCLOCK')
                  ? 'text-cyan-300'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
