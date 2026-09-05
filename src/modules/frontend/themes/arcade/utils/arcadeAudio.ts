/**
 * Native Web Audio API Synthesizer for 8-Bit Retro Arcade Theme
 * Synthesizes authentic chiptune square wave coin chime, level-up fanfare, and power-up
 * without external audio files or downloads.
 */

class ArcadeAudioSynthesizer {
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
   * Classic Arcade Coin Sound (B5 -> E6 square wave)
   */
  public playCoinSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      // First tone: B5 (987.77 Hz)
      osc.frequency.setValueAtTime(987.77, now);
      // Jump to E6 (1318.51 Hz) after 70ms
      osc.frequency.setValueAtTime(1318.51, now + 0.07);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.setValueAtTime(0.18, now + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch {}
  }

  /**
   * 8-Bit Level Up / Quest Clear Fanfare
   */
  public playLevelUpJingle(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Arpeggio: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const duration = 0.09;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * duration;
        const isLast = idx === notes.length - 1;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + (isLast ? 0.4 : duration));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + (isLast ? 0.42 : duration));
      });
    } catch {}
  }

  /**
   * Retro Power-Up Frequency Sweep
   */
  public playPowerUpSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.29);
    } catch {}
  }
}

export const arcadeAudio = new ArcadeAudioSynthesizer();
export const playCoinSound = () => arcadeAudio.playCoinSound();
export const playLevelUpJingle = () => arcadeAudio.playLevelUpJingle();
export const playPowerUpSound = () => arcadeAudio.playPowerUpSound();
