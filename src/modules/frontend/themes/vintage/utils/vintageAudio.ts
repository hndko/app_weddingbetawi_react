// Web Audio API Synthesizer for Vintage Newspaper Gazette
// Zero external MP3 downloads - purely synthesized in real-time

class VintageAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Vintage Mechanical Typewriter Key Clack + Carriage Return Bell
   * Triggers on opening invitation or reading major editions.
   */
  public playTypewriterBell(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Mechanical Key Strike (Clack)
    const osc = ctx.createOscillator();
    const clackGain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    clackGain.gain.setValueAtTime(0.35, now);
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(clackGain);
    clackGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);

    // 2. Carriage Return Bell (Ting!) at 2093Hz (C7)
    const bellTime = now + 0.08;
    const bellOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();

    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(2093, bellTime);

    bellGain.gain.setValueAtTime(0.001, bellTime);
    bellGain.gain.exponentialRampToValueAtTime(0.4, bellTime + 0.015);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, bellTime + 0.85);

    bellOsc.connect(bellGain);
    bellGain.connect(ctx.destination);

    bellOsc.start(bellTime);
    bellOsc.stop(bellTime + 0.85);
  }

  /**
   * Postal Rubber Stamp Thud
   */
  public playStampThud(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

    gainNode.gain.setValueAtTime(0.45, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * Soft Vintage Paper Rustle
   */
  public playPaperRustle(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.15);
  }
}

export const vintageAudio = new VintageAudioSynthesizer();
export const playTypewriterBell = () => vintageAudio.playTypewriterBell();
export const playStampThud = () => vintageAudio.playStampThud();
export const playPaperRustle = () => vintageAudio.playPaperRustle();
