/**
 * Native Web Audio API Synthesizer for Interactive Envelope & Wax Seal
 * Zero external audio dependencies, 100% offline and low latency.
 */

class EnvelopeAudioSynthesizer {
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
   * Play the complete envelope opening acoustic experience:
   * 1. Crisp wax seal fracture (low thud + snap click)
   * 2. Parchment paper sliding rustle
   * 3. Gentle harmonic glissando chime
   */
  public playEnvelopeOpenSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Wax Seal Pop & Snap
      // A. Low thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(140, now);
      thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.14);

      thudGain.gain.setValueAtTime(0.3, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.17);

      // B. Sharp high click snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'square';
      snapOsc.frequency.setValueAtTime(1800, now);
      snapOsc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      snapGain.gain.setValueAtTime(0.12, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.06);

      // 2. Parchment Paper Rustle (Bandpass filtered white noise burst)
      const bufferSize = Math.floor(ctx.sampleRate * 0.22);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2200, now + 0.06);
      noiseFilter.frequency.linearRampToValueAtTime(1200, now + 0.22);
      noiseFilter.Q.setValueAtTime(2.2, now + 0.06);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.setValueAtTime(0.14, now + 0.06);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(now + 0.05);

      // 3. Ethereal Gold Chime (Ascending harmonic sparkle notes)
      const chimeFrequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const noteDelay = 0.06;

      chimeFrequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + 0.12 + idx * noteDelay;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.09, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.75);
      });
    } catch {
      // Graceful fallback if Web Audio is not supported in environment
    }
  }
}

export const envelopeAudio = new EnvelopeAudioSynthesizer();
export const playEnvelopeOpenSound = () => envelopeAudio.playEnvelopeOpenSound();
