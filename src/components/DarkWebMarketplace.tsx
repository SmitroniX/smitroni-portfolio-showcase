import React, { useState } from 'react';
import {
  Globe,
  Lock,
  Coins,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Terminal,
  Cpu,
  Zap,
  Sparkles,
  ShoppingBag,
  Filter,
  Eye
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface ExploitListing {
  id: string;
  title: string;
  category: 'KERNEL' | 'DMA HARDWARE' | 'LUA / SCRIPT' | 'BYTECODE';
  targetGame: string;
  priceBtc: number;
  rating: number;
  salesCount: number;
  status: 'AVAILABLE' | 'PURCHASED';
  shortDesc: string;
  fullSpecs: string[];
  codeStub: string;
}

const INITIAL_LISTINGS: ExploitListing[] = [
  {
    id: 'dma-firmware',
    title: 'PCIe DMA FPGA Custom LeechCore Firmware',
    category: 'DMA HARDWARE',
    targetGame: 'Valorant / Apex / EAC / BattlEye',
    priceBtc: 4.5,
    rating: 5.0,
    salesCount: 89,
    status: 'AVAILABLE',
    shortDesc: 'Custom PCIe Configuration Space spoofer for CaptainDMA 75T / Squirrel FPGA cards. Direct hardware physical memory access with 0% software footprint.',
    fullSpecs: [
      'Clones legitimate Intel Wi-Fi / Realtek PCIe VendorID & DeviceID (VID/PID)',
      'Spoofs Device Serial Number, BARs, and DSN registers in FPGA bitstream',
      'Tested against Vanguard HVCI memory integrity checks',
      'Ultra-low PCIe read latency: ~380 nanoseconds per 4KB memory page'
    ],
    codeStub: `// PCIe FPGA LeechCore Memory Read Hook
#include <leechcore.h>
#include <vmmdll.h>

bool ReadGameProcessMemory(DWORD pid, uintptr_t address, void* buffer, size_t size) {
    SIZE_T bytesRead = 0;
    return VMMDLL_MemReadEx(vmmHandle, pid, address, (PBYTE)buffer, size, &bytesRead, VMMDLL_FLAG_NOCACHE);
}`
  },
  {
    id: 'cs2-rcs-sdk',
    title: 'Source 2 Client NetVar Dumper & RCS Engine',
    category: 'KERNEL',
    targetGame: 'Counter-Strike 2 (VACnet 3.0)',
    priceBtc: 2.8,
    rating: 4.9,
    salesCount: 142,
    status: 'AVAILABLE',
    shortDesc: 'Kernel-mode memory dumper extracting dynamic NetVars and client.dll offsets on match start. Flawless standalone recoil compensation system.',
    fullSpecs: [
      'Automated SigScanning parses dwEntityList, dwLocalPlayerPawn, dwViewMatrix',
      'Dynamic RCS calculates aimPunchAngle delta to nullify AK-47 spray patterns',
      'Safe mouse_event simulation with micro-Gaussian variance',
      'DirectX 11 ImGui EndScene Present Hook template included'
    ],
    codeStub: `// Standalone Recoil Control System (RCS)
Vector2 oldPunch = { 0.f, 0.f };
void CompensateRecoil(Vector2 currentPunch) {
    Vector2 punchDelta = (currentPunch - oldPunch) * 2.0f;
    MoveMouseSmoothly(-punchDelta.y, punchDelta.x);
    oldPunch = currentPunch;
}`
  },
  {
    id: 'fivem-lua-exec',
    title: 'FiveM / CitizenFX Unrestricted Lua Ring',
    category: 'LUA / SCRIPT',
    targetGame: 'GTA V / FiveM Roleplay',
    priceBtc: 1.5,
    rating: 4.8,
    salesCount: 310,
    status: 'AVAILABLE',
    shortDesc: 'Bypasses CitizenFX server-side code hash verification. Injects into mono runtime to execute privileged server events and trigger client cheats.',
    fullSpecs: [
      'Unhooks ScripthookV native invocation blocklists',
      'TriggerServerEvent payload spammer with auto-generated nonce bypasses',
      'Invisible Godmode, infinite stamina, and instantaneous vehicle speed booster',
      'Server-side logging interceptor to suppress admin panic alerts'
    ],
    codeStub: `-- CitizenFX Unrestricted Remote Event Trigger
RegisterNetEvent('esx:playerLoaded')
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        SetPlayerInvincible(PlayerId(), true)
        SetSuperJumpThisFrame(PlayerId())
    end
end)`
  },
  {
    id: 'phasmo-radar',
    title: 'Unity IL2CPP Phasmophobia Ghost Oracle',
    category: 'KERNEL',
    targetGame: 'Phasmophobia (Unity Engine)',
    priceBtc: 0.9,
    rating: 5.0,
    salesCount: 224,
    status: 'AVAILABLE',
    shortDesc: 'Inspects IL2CPP metadata structures to extract GhostAI state, current hunt countdown, favourite room temperature, and exact cursed possession coords.',
    fullSpecs: [
      'Parses GameController and GhostAI singletons from GameAssembly.dll',
      'Renders 2D map overlay with real-time ghost coordinate tracking',
      'Live sanity display for all 4 team members with anti-drain locks',
      'Full protection against ghost hunt kill triggers'
    ],
    codeStub: `// Phasmophobia Ghost Room & Hunt Reader
uintptr_t ghostAI = Read<uintptr_t>(gameAssemblyBase + 0x24FA9B0);
int ghostType = Read<int>(ghostAI + 0x78); // 1 = Revenant, 2 = Banshee...
bool isHunting = Read<bool>(ghostAI + 0x94);
Vector3 ghostPos = Read<Vector3>(ghostAI + 0xB0);`
  },
  {
    id: 'mc-mixin-suite',
    title: 'Fabric / Forge JVM ASM Mixin Cloak',
    category: 'BYTECODE',
    targetGame: 'Minecraft PvP (1.8.9 - 1.21)',
    priceBtc: 1.2,
    rating: 4.9,
    salesCount: 450,
    status: 'AVAILABLE',
    shortDesc: 'Transforms Minecraft bytecode at runtime using ASM and Mixins. Zero knockback, predictive auto-scaffold, and humanized rotational raytracing.',
    fullSpecs: [
      'Cancels SPacketEntityVelocity without triggering Grim/Vulcan anticheat flags',
      'Smooth rotational interpolation mimicking genuine bezier mouse kinematics',
      'Client-side tick prediction for block scaffolding across the void',
      'Self-destruct panic button wipes injected classes and cleans JVM memory'
    ],
    codeStub: `// Fabric Mixin Velocity Packet Cancellation
@Inject(method = "handleEntityVelocity", at = @At("HEAD"), cancellable = true)
private void cancelKnockback(SPacketEntityVelocity packet, CallbackInfo ci) {
    if (packet.getEntityID() == mc.player.getId()) {
        ci.cancel(); // 0% Knockback
    }
}`
  },
  {
    id: 'warzone-ballistics',
    title: 'Apex & Warzone Ballistic Vector Solver',
    category: 'KERNEL',
    targetGame: 'Apex Legends / CoD Modern Warfare',
    priceBtc: 3.2,
    rating: 4.9,
    salesCount: 118,
    status: 'AVAILABLE',
    shortDesc: 'C++ physics equation solving projectile gravity, target movement vectors, and velocity damping for 1,000m sniper headshots.',
    fullSpecs: [
      'Multi-threaded target velocity Kalman filter prediction',
      'Weapon-specific bullet drop compensation tables (Kraber, Sentinel, Longbow)',
      'Smooth crosshair adjustment factoring in client frame time variance',
      'Integrates directly with DirectX ImGui bone snapline systems'
    ],
    codeStub: `// 3D Ballistic Trajectory Predictor
Vector3 SolveBallistics(Vector3 muzzle, Vector3 targetPos, Vector3 targetVel, float bulletSpeed, float gravity) {
    float dist = (targetPos - muzzle).Length();
    float time = dist / bulletSpeed;
    Vector3 predicted = targetPos + (targetVel * time);
    predicted.z += 0.5f * gravity * (time * time);
    return predicted;
}`
  }
];

export const DarkWebMarketplace: React.FC = () => {
  const [btcBalance, setBtcBalance] = useState(120.0);
  const [listings, setListings] = useState<ExploitListing[]>(INITIAL_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<ExploitListing>(INITIAL_LISTINGS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'KERNEL' | 'DMA HARDWARE' | 'LUA / SCRIPT' | 'BYTECODE'>('ALL');
  const [marketStatusMsg, setMarketStatusMsg] = useState<string | null>(null);

  const filteredListings = listings.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.category === activeFilter;
  });

  const handleBuy = (item: ExploitListing) => {
    if (item.status === 'PURCHASED') return;

    if (btcBalance < item.priceBtc) {
      sounds.playAlarm();
      setMarketStatusMsg('❌ INSUFFICIENT BITCOIN BALANCE IN ESCROW WALLET!');
      setTimeout(() => setMarketStatusMsg(null), 3000);
      return;
    }

    sounds.playAccessGranted();
    setBtcBalance((prev) => parseFloat((prev - item.priceBtc).toFixed(2)));
    
    // Update status
    setListings((prev) =>
      prev.map((l) => (l.id === item.id ? { ...l, status: 'PURCHASED' } : l))
    );

    if (selectedListing.id === item.id) {
      setSelectedListing((prev) => ({ ...prev, status: 'PURCHASED' }));
    }

    setMarketStatusMsg(`🔓 DECRYPTED: ${item.title} has been transferred to your local vault!`);
    setTimeout(() => setMarketStatusMsg(null), 4000);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    sounds.playClick();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 font-mono">
      
      {/* Onion Header / Simulated Tor Browser Bar */}
      <div className="p-3 sm:p-4 rounded-xl bg-black/90 border border-red-900/50 space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          
          {/* Tor URL address bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto bg-[#0a0507] border border-red-500/30 rounded-lg px-3 py-1.5 flex-1 max-w-xl text-[11px] text-red-300 overflow-hidden">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 font-bold">tor://</span>
            <span className="truncate">smitronix7k3z7q9n2o4v8x1b9c.onion:8080/vault/market</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
              CIRCUIT SECURE
            </span>
          </div>

          {/* Simulated Darknet Crypto Wallet */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-red-950/60 to-black border border-red-500/40 px-3 py-1.5 rounded-lg text-xs shrink-0 self-end sm:self-auto">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-slate-400 text-[11px]">ESCROW:</span>
            <span className="text-amber-300 font-bold font-mono">₿ {btcBalance.toFixed(2)} BTC</span>
          </div>
        </div>

        {/* Tor Routing Info */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-red-950/60">
          <span>Relay Circuit: Guard (DE) &rarr; Relay (CH) &rarr; Exit (IS) &rarr; SmitroniX Ring-0 Hidden Service</span>
          <span className="text-emerald-400 font-bold hidden sm:inline">PGP 4096-BIT SIGNED</span>
        </div>
      </div>

      {/* Alert Status Banner */}
      {marketStatusMsg && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-xs text-red-200 text-center font-bold animate-in fade-in zoom-in-95 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          {marketStatusMsg}
        </div>
      )}

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-red-900/40">
        {(['ALL', 'KERNEL', 'DMA HARDWARE', 'LUA / SCRIPT', 'BYTECODE'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sounds.playClick();
              setActiveFilter(cat);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === cat
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-400'
                : 'bg-black/50 border border-red-950 text-slate-400 hover:text-white hover:border-red-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Marketplace Listings & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Listings Catalog */}
        <div className="lg:col-span-6 space-y-3 max-h-[580px] overflow-y-auto pr-1">
          {filteredListings.map((item) => {
            const isSelected = selectedListing.id === item.id;
            const isPurchased = item.status === 'PURCHASED';

            return (
              <div
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedListing(item);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'bg-black/60 hover:bg-black/80 border-red-900/40 hover:border-red-600/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-white hover:text-red-300 transition-colors">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-[10px] text-amber-300 font-bold shrink-0">
                      ₿ {item.priceBtc} BTC
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-black/60 text-red-400 border border-red-900/40">
                      {item.category}
                    </span>
                    <span className="text-slate-400">Target: {item.targetGame}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                    {item.shortDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 font-bold">
                    ★ {item.rating} ({item.salesCount} downloads)
                  </span>

                  {isPurchased ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      UNLOCKED
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuy(item);
                      }}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow-md shadow-red-600/40"
                    >
                      Acquire Stub (₿ {item.priceBtc})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Item Deep Inspector & Decrypted Code */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#140608] to-black border-2 border-red-600/50 shadow-crimson-glow flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600/20 border border-red-500/40 text-[10px] text-red-300 font-bold">
                    {selectedListing.category}
                  </span>
                  <span className="text-slate-400 text-xs">Target: {selectedListing.targetGame}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white font-display mt-1">
                  {selectedListing.title}
                </h4>
              </div>

              <div className="text-right shrink-0">
                <div className="text-base font-bold text-amber-400 font-mono">
                  ₿ {selectedListing.priceBtc} BTC
                </div>
                <div className="text-[10px] text-slate-400">
                  Rating: ★ {selectedListing.rating} / 5.0
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedListing.shortDesc}
            </p>

            {/* Technical Specifications */}
            <div className="space-y-1.5 p-3 rounded-xl bg-black/60 border border-red-900/40">
              <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Technical Specifications &amp; Reversing Notes
              </div>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {selectedListing.fullSpecs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold">&bull;</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Decrypted Code Snippet / Payload Stub */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  {selectedListing.status === 'PURCHASED' ? 'DECRYPTED EXPLOIT SOURCE CODE' : 'PREVIEW STUB (PARTIALLY MASKED)'}
                </span>

                <button
                  onClick={() => handleCopyCode(selectedListing.codeStub, selectedListing.id)}
                  className="px-2.5 py-1 rounded bg-black/60 hover:bg-red-950/60 border border-red-800/40 text-red-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedId === selectedListing.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>COPY STUB</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black/90 border border-red-950 font-mono text-[11px] text-red-200 overflow-x-auto max-h-48">
                <pre className="whitespace-pre">
                  {selectedListing.status === 'PURCHASED'
                    ? selectedListing.codeStub
                    : selectedListing.codeStub.split('\n').slice(0, 4).join('\n') + '\n// [ENCRYPTED PAYLOAD: Unlock to view full Ring-0 source implementation]'}
                </pre>
              </div>
            </div>
          </div>

          {/* Action Button: Purchase or Download */}
          <div className="pt-2 border-t border-red-950 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {selectedListing.status === 'PURCHASED'
                ? '✅ Cryptographic signature verified & stored in RAM'
                : '100% Escrow protected by Onion network'}
            </span>

            {selectedListing.status === 'PURCHASED' ? (
              <button
                onClick={() => handleCopyCode(selectedListing.codeStub, selectedListing.id)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Payload</span>
              </button>
            ) : (
              <button
                onClick={() => handleBuy(selectedListing)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-red-600/40"
              >
                <Coins className="w-3.5 h-3.5 text-amber-300" />
                <span>Acquire for ₿ {selectedListing.priceBtc} BTC</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
