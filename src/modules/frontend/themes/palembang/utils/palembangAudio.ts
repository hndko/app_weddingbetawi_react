// Web Audio API Synthesizer for Palembang Sriwijaya Royal Ceremonial Sounds
// Zero external MP3 downloads - purely synthesized in real-time

class PalembangAudioSynthesizer {
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
   * Resonant Gamelan Kenong / Kromong of Gending Sriwijaya
   * Melodic brass strike with metallic overtone for opening invitation.
   */
  public playKenongSriwijaya(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fundamental = 523.25; // C5 Kenong pitch

    // Fundamental & metallic bell harmonics
    const tones = [
      { freq: fundamental, gain: 0.5, decay: 1.8 },
      { freq: fundamental * 1.58, gain: 0.28, decay: 1.2 },
      { freq: fundamental * 2.32, gain: 0.15, decay: 0.8 },
      { freq: fundamental * 3.85, gain: 0.08, decay: 0.5 },
    ];

    tones.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  /**
   * Royal Gong Kencana Palembang Darussalam
   * Deep, solemn brass gong with long sustained resonance.
   */
  public playGongKencana(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fundamental = 92.5; // F#2 deep gong

    const harmonics = [
      { freq: fundamental, gain: 0.6, decay: 3.2 },
      { freq: fundamental * 2.08, gain: 0.25, decay: 2.2 },
      { freq: fundamental * 3.24, gain: 0.12, decay: 1.5 },
      { freq: fundamental * 4.9, gain: 0.05, decay: 0.9 },
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
   * Delicate Cempaka floral bell chime
   */
  public playCempakaChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15);

    gainNode.gain.setValueAtTime(0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }
}

export const palembangAudio = new PalembangAudioSynthesizer();
export const playKenongSriwijaya = () => palembangAudio.playKenongSriwijaya();
export const playGongKencana = () => palembangAudio.playGongKencana();
export const playCempakaChime = () => palembangAudio.playCempakaChime();
