/**
 * Native Web Audio API Synthesizer for Toraja Tongkonan Theme
 * Synthesizes traditional Pa'pompang bamboo wind tones, Rambu Tuka' bronze gong,
 * and Kandaure bead shimmer with 0 external network requests or audio files.
 */

class TorajaAudioSynthesizer {
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
   * Resonant Pa'pompang bamboo flute tone
   * Deep breath resonance transitioning into harmonic overtones
   */
  public playPapompangBlow(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Fundamental Bamboo Tone (E4 ~ 329.63Hz -> G4 ~ 392Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(329.63, now);
      osc1.frequency.exponentialRampToValueAtTime(392.00, now + 0.35);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      // Second harmonic (Breath tone ~ 659.25Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.exponentialRampToValueAtTime(783.99, now + 0.35);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      // Lowpass filter for warm bamboo wood texture
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(2.5, now);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 0.95);
    } catch {
      // Ignore Web Audio errors on restricted mobile browsers
    }
  }

  /**
   * Resonant Rambu Tuka' ceremonial bronze gong
   */
  public playGongToraja(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(146.83, now); // D3
      osc.frequency.exponentialRampToValueAtTime(138.59, now + 1.5);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.05);
    } catch {}
  }

  /**
   * Shimmering Kandaure golden beads
   */
  public playKandaureChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const frequencies = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {}
  }
}

export const torajaAudio = new TorajaAudioSynthesizer();
export const playPapompangBlow = () => torajaAudio.playPapompangBlow();
export const playGongToraja = () => torajaAudio.playGongToraja();
export const playKandaureChime = () => torajaAudio.playKandaureChime();
