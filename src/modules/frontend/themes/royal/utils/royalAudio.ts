/**
 * Native Web Audio API Synthesizer for Royal Decree & Wax Seal Theme
 * Synthesizes wax seal opening crackle, ethereal royal harp glissando, and brass fanfare
 * without external audio downloads or network latency.
 */

class RoyalAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Sound of crisp wax seal cracking open
   */
  public playWaxSealCrack(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Low Thud of breaking the wax seal
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);

      // 2. Parchment rustle noise
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1800, now + 0.04);
      noiseFilter.Q.setValueAtTime(3.0, now + 0.04);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now + 0.04);
    } catch {}
  }

  /**
   * Ethereal Royal Harp Glissando Chime
   */
  public playRoyalHarpChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Ascending C Major 9 Harp glissando: C5, E5, G5, B5, D6, G6
      const harpNotes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
      const step = 0.06;

      harpNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * step;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch {}
  }

  /**
   * Royal Brass Fanfare Arpeggio
   */
  public playRoyalFanfare(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      const step = 0.1;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * step;
        const isLast = idx === notes.length - 1;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + (isLast ? 0.6 : 0.2));

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + (isLast ? 0.65 : 0.22));
      });
    } catch {}
  }
}

export const royalAudio = new RoyalAudioSynthesizer();
export const playWaxSealCrack = () => royalAudio.playWaxSealCrack();
export const playRoyalHarpChime = () => royalAudio.playRoyalHarpChime();
export const playRoyalFanfare = () => royalAudio.playRoyalFanfare();
