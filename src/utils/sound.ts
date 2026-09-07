// Pure Web Audio API Sound Synthesizer
// Completely zero-dependency, works offline and instantly!

class SoundEngine {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (this.soundEnabled) {
      this.playSuccess();
    }
    return this.soundEnabled;
  }

  // Futuristic hover blip
  public playHover() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Tactical click
  public playClick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  // Arcade laser / zap
  public playLaser() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // Sci-Fi Warp / Mode activate
  public playWarp() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Success chime
  public playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.05);

        gain.gain.setValueAtTime(0.025, now + index * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.05 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.05);
        osc.stop(now + index * 0.05 + 0.12);
      });
    } catch {}
  }

  // Authentic Apple Startup Chime (F# Major resonant acoustic chord)
  public playAppleChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // F# major rich chord frequencies
      const freqs = [92.5, 138.59, 185.0, 233.08, 277.18, 369.99, 554.37, 739.99];
      const duration = 3.2;

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Use warm sine with fundamental warmth
        osc.type = idx === 0 ? 'triangle' : 'sine';
        // Add subtle detune for authentic acoustic fullness
        const detune = (idx % 2 === 0 ? 1 : -1) * (idx * 1.5);
        osc.frequency.setValueAtTime(freq + detune * 0.1, now);

        const peakGain = 0.042 / (idx * 0.3 + 1);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch {}
  }

  // Keypress tick for terminal
  public playKeyTick() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(900 + Math.random() * 200, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {}
  }

  // Red Alert Klaxon Alarm
  public playAlarm() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Siren pulse 1 & 2
      [0, 0.22].forEach((offset) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now + offset);
        osc.frequency.exponentialRampToValueAtTime(520, now + offset + 0.18);

        gain.gain.setValueAtTime(0.04, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.18);
      });
    } catch {}
  }

  // Cyber Glitch noise burst
  public playGlitch() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(200 + Math.random() * 1600, now + i * 0.03);
        
        gain.gain.setValueAtTime(0.03, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.03 + 0.04);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.04);
      }
    } catch {}
  }

  // Heavy Cyber Security Access Granted
  public playAccessGranted() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(130, now + 0.1);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.4);

      subGain.gain.setValueAtTime(0.06, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.4);
    } catch {}
  }

  // In-game Memory / Code Injection chirp
  public playInject() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Crisp Gaming Hitmarker (iconic high-pitch tick)
  public playHitmarker() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.03);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  // Tactical Suppressed Cyber Gunshot
  public playGunshot() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.09);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }
}

export const sounds = new SoundEngine();
