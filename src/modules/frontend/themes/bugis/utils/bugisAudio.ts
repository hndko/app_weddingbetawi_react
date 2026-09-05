// Web Audio API Synthesizer for Bugis-Makassar Royal Ceremonial Sounds
// Zero external MP3 downloads - purely synthesized in real-time

class BugisAudioSynthesizer {
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
   * Resonant low-frequency brass gong sound (Gong Kencana Bugis)
   * Plays when opening the royal invitation or celebrating solemn moments.
   */
  public playBugisGong(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fundamental = 110; // A2 deep brass gong

    // Fundamental and 2 key overtone harmonics
    const harmonics = [
      { freq: fundamental, gain: 0.6, decay: 2.8 },
      { freq: fundamental * 2.05, gain: 0.25, decay: 2.0 },
      { freq: fundamental * 3.12, gain: 0.15, decay: 1.4 },
      { freq: fundamental * 4.8, gain: 0.08, decay: 0.8 },
    ];

    harmonics.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  /**
   * Traditional Bugis 2-stringed lute (Kecapi) pluck
   * Warm, melodious pluck for button taps or section reveals.
   */
  public playKecapiPluck(freq = 440): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    // Subtle pitch dip simulating finger pluck tension release
    osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.35);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  /**
   * Festive Ganrang Bulo drum chime tap
   */
  public playGanrangChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export const bugisAudio = new BugisAudioSynthesizer();
export const playBugisGong = () => bugisAudio.playBugisGong();
export const playKecapiPluck = (freq?: number) => bugisAudio.playKecapiPluck(freq);
export const playGanrangChime = () => bugisAudio.playGanrangChime();
