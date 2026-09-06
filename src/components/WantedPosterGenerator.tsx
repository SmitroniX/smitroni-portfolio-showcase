import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Skull,
  AlertTriangle,
  Sparkles,
  Sliders,
  Check,
  RefreshCw,
  FileText
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const WantedPosterGenerator: React.FC = () => {
  const [alias, setAlias] = useState('THE KERNEL SPECTRE');
  const [bountyBtc, setBountyBtc] = useState(120);
  const [threatClass, setThreatClass] = useState<'OMEGA' | 'TIER 1' | 'SPECIAL'>('OMEGA');
  const [includeStamp, setIncludeStamp] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw poster on canvas
  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 1100;
    canvas.width = width;
    canvas.height = height;

    // Vintage dark paper / tactical FBI dossier background
    ctx.fillStyle = '#0a0507';
    ctx.fillRect(0, 0, width, height);

    // Subtle texture grid
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer double border
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 6;
    ctx.strokeRect(25, 25, width - 50, height - 50);

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, width - 70, height - 70);

    // Header banner
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(35, 35, width - 70, 75);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('INTERPOL / FBI CYBER CRIME DIVISION', width / 2, 75);

    ctx.fillStyle = '#FCA5A5';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('GLOBAL ARREST WARRANT • SPECIAL NOTICE #SRX-OMEGA-99', width / 2, 98);

    // Large WANTED banner
    ctx.fillStyle = '#EF4444';
    ctx.font = '900 68px monospace';
    ctx.fillText('WANTED', width / 2, 185);

    // Mugshot Box
    const mugX = 260;
    const mugY = 215;
    const mugW = 280;
    const mugH = 280;

    // Mugshot background
    ctx.fillStyle = '#180a0e';
    ctx.fillRect(mugX, mugY, mugW, mugH);
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.strokeRect(mugX, mugY, mugW, mugH);

    // Height measurement lines in mugshot
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 1;
    for (let l = mugY + 40; l < mugY + mugH; l += 30) {
      ctx.beginPath();
      ctx.moveTo(mugX, l);
      ctx.lineTo(mugX + mugW, l);
      ctx.stroke();
    }

    // Hologram Skull Icon representation
    ctx.fillStyle = '#EF4444';
    ctx.font = '900 90px monospace';
    ctx.fillText('☠', width / 2, mugY + 160);

    ctx.fillStyle = '#F87171';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('[SMITRONIX]', width / 2, mugY + 230);
    ctx.font = '12px monospace';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('SUB-TICK KERNEL SPECTRE', width / 2, mugY + 255);

    // Suspect Names
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 28px monospace';
    ctx.fillText('ASMIT JOGDAND', width / 2, 535);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`ALIAS: "${alias.toUpperCase()}"`, width / 2, 565);

    // Threat Level & Bounty Box
    const boxY = 590;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.fillRect(60, boxY, width - 120, 95);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, boxY, width - 120, 95);

    ctx.fillStyle = '#FCA5A5';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`THREAT CATEGORY: ${threatClass} • STATUS: AT LARGE`, width / 2, boxY + 28);

    ctx.fillStyle = '#F59E0B';
    ctx.font = '900 32px monospace';
    const usdReward = (bountyBtc * 65000).toLocaleString();
    ctx.fillText(`REWARD: ₿ ${bountyBtc} BTC (~$${usdReward} USD)`, width / 2, boxY + 68);

    // Crimes & Allegations Table
    const crimeY = 715;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('PRIMARY ALLEGATIONS & CYBER OFFENSES:', 60, crimeY);

    const offenses = [
      '• Ring-0 Windows Kernel Exploitation (Vulnerable Signed BYOVD Drivers)',
      '• Multi-Game Engine Reversing: Source 2, IW Engine, Unreal Engine 5, Unity IL2CPP',
      '• PCIe FPGA DMA Hardware Firmware Emulation bypassing Hypervisor Attestations',
      '• JVM ASM Bytecode Transformation & Sub-Tick Algorithmic Recoil Nullification',
      '• Cryptographic HWID Identity Spoofing (SMBIOS, NIC MAC, Disk Serial Numbers)'
    ];

    ctx.fillStyle = '#E5E7EB';
    ctx.font = '13px monospace';
    offenses.forEach((line, idx) => {
      ctx.fillText(line, 60, crimeY + 30 + idx * 24);
    });

    // Caution Warning Box
    const cautionY = 880;
    ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
    ctx.fillRect(60, cautionY, width - 120, 75);
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, cautionY, width - 120, 75);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#EF4444';
    ctx.font = '900 16px monospace';
    ctx.fillText('CAUTION: EXTREMELY SOPHISTICATED REVERSER', width / 2, cautionY + 30);
    ctx.fillStyle = '#D1D5DB';
    ctx.font = '12px monospace';
    ctx.fillText('DO NOT ATTEMPT TO SCAN MEMORY SPACES DIRECTLY. NOTIFY KERNEL DEFENSE IMMEDIATELY.', width / 2, cautionY + 54);

    // Footer Barcode / Fingerprint simulation
    const footY = 985;
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('REPORT INTELLIGENCE: SECURITY@SMITRONIX.PORTFOLIO // ENCRYPTED TOR NETWORK', width / 2, footY);

    // Simulated Barcode
    const barX = 220;
    const barY = 1005;
    ctx.fillStyle = '#EF4444';
    for (let i = 0; i < 360; i += 4) {
      if ((i * 17) % 7 !== 0) {
        ctx.fillRect(barX + i, barY, (i % 3 === 0 ? 3 : 1.5), 35);
      }
    }

    // Red Stamp overlay if enabled
    if (includeStamp) {
      ctx.save();
      ctx.translate(620, 310);
      ctx.rotate(-0.32);
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 5;
      ctx.strokeRect(-120, -35, 240, 70);
      ctx.fillStyle = '#DC2626';
      ctx.font = '900 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CLASSIFIED', 0, -2);
      ctx.font = 'bold 13px monospace';
      ctx.fillText('TOP SECRET // NOC', 0, 20);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawPoster();
  }, [alias, bountyBtc, threatClass, includeStamp]);

  const handleDownload = () => {
    sounds.playAccessGranted();
    setDownloading(true);

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const link = document.createElement('a');
        link.download = `WANTED_DOSSIER_SMITRONIX_${alias.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      setDownloading(false);
    }, 500);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Intro Header */}
      <div className="p-4 rounded-xl bg-black/80 border border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-red-400 font-bold uppercase">
            <Skull className="w-4 h-4 text-red-500" />
            <span>INTERPOL MOST WANTED POSTER GENERATOR</span>
          </div>
          <p className="text-xs text-slate-300">
            Generate and download a high-resolution, certified cyber crime warrant poster for the portfolio author alter-ego.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'GENERATING...' : 'DOWNLOAD POSTER (.PNG)'}</span>
        </button>
      </div>

      {/* Main Grid: Controls on Left, Live Canvas Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-5 space-y-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#140608] to-black border border-red-900/40">
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-red-950">
            <Sliders className="w-3.5 h-3.5" />
            Warrant Customization Studio
          </div>

          {/* Alias Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 block font-bold">
              UNDERGROUND HACKER ALIAS
            </label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              maxLength={28}
              className="w-full px-3 py-2 rounded-lg bg-black/80 border border-red-800/50 text-white text-xs font-mono focus:border-red-400 focus:outline-none"
              placeholder="e.g. THE KERNEL SPECTRE"
            />
          </div>

          {/* Bounty Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-bold">BITCOIN BOUNTY AMOUNT</span>
              <span className="text-amber-400 font-bold font-mono">₿ {bountyBtc} BTC (~${(bountyBtc * 65000).toLocaleString()} USD)</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={bountyBtc}
              onChange={(e) => setBountyBtc(Number(e.target.value))}
              className="w-full accent-red-500 h-1.5 bg-red-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Threat Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 block font-bold">
              THREAT CLASSIFICATION
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['OMEGA', 'TIER 1', 'SPECIAL'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    sounds.playClick();
                    setThreatClass(lvl);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    threatClass === lvl
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/40 border border-red-400'
                      : 'bg-black/50 border border-red-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Classified Stamp Toggle */}
          <div className="pt-2 border-t border-red-950 flex items-center justify-between">
            <span className="text-xs text-slate-300">Display Classified Red Stamp</span>
            <button
              onClick={() => {
                sounds.playClick();
                setIncludeStamp(!includeStamp);
              }}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                includeStamp ? 'bg-red-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                  includeStamp ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Specs note */}
          <div className="p-3 rounded-xl bg-black/60 border border-red-950 text-[11px] text-slate-400 space-y-1">
            <div className="text-red-400 font-bold">Resolution: 800 x 1100 px (300 DPI ready)</div>
            <div>Format: Lossless PNG with high-contrast tactical cyber palette.</div>
          </div>
        </div>

        {/* Right Column: Live Poster Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-black/70 border border-red-900/40 relative overflow-hidden">
          <div className="w-full max-w-[420px] shadow-[0_0_30px_rgba(239,68,68,0.25)] rounded-lg overflow-hidden border-2 border-red-700/60">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block pointer-events-none"
            />
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Rendered in real-time via HTML5 2D Canvas engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
