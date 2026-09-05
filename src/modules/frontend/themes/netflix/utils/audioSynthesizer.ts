/**
 * Netflix "Ta-Dum!" Sound Effect Synthesizer
 * Pure Client-Side Web Audio API (Zero External Network / File Dependency)
 */

export function playNetflixTadum(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Master Compressor for cinematic punch and wall-of-sound depth
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, now);
    compressor.knee.setValueAtTime(30, now);
    compressor.ratio.setValueAtTime(12, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.25, now);
    compressor.connect(ctx.destination);

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.8, now);
    masterGain.connect(compressor);

    // --- 1. THE "TA" (First Impact at t = 0.0s) ---
    // Sub-bass thump
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(95, now);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    gain1.gain.setValueAtTime(0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Mid-range punch
    const osc1b = ctx.createOscillator();
    const gain1b = ctx.createGain();
    osc1b.type = 'sine';
    osc1b.frequency.setValueAtTime(160, now);
    osc1b.frequency.exponentialRampToValueAtTime(60, now + 0.15);
    gain1b.gain.setValueAtTime(0.5, now);
    gain1b.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc1b.connect(gain1b);
    gain1b.connect(masterGain);
    osc1b.start(now);
    osc1b.stop(now + 0.22);

    // --- 2. THE "DUM" (Second Deep Resonant Impact at t = 0.16s) ---
    const t2 = now + 0.16;

    // Deep Cinema Sub-bass Swell (D1 note ~ 36.7 Hz)
    const osc2a = ctx.createOscillator();
    const gain2a = ctx.createGain();
    osc2a.type = 'sine';
    osc2a.frequency.setValueAtTime(75, t2);
    osc2a.frequency.exponentialRampToValueAtTime(36.7, t2 + 0.4);
    gain2a.gain.setValueAtTime(0.01, now);
    gain2a.gain.setValueAtTime(0.9, t2);
    gain2a.gain.exponentialRampToValueAtTime(0.001, t2 + 2.5);
    osc2a.connect(gain2a);
    gain2a.connect(masterGain);
    osc2a.start(t2);
    osc2a.stop(t2 + 2.6);

    // Timpani / Brass Warm Resonance (D2 note ~ 73.4 Hz + D3 ~ 146.8 Hz)
    const osc2b = ctx.createOscillator();
    const gain2b = ctx.createGain();
    osc2b.type = 'triangle';
    osc2b.frequency.setValueAtTime(146.8, t2);
    osc2b.frequency.exponentialRampToValueAtTime(73.4, t2 + 0.6);
    gain2b.gain.setValueAtTime(0.01, now);
    gain2b.gain.setValueAtTime(0.65, t2);
    gain2b.gain.exponentialRampToValueAtTime(0.001, t2 + 2.2);
    osc2b.connect(gain2b);
    gain2b.connect(masterGain);
    osc2b.start(t2);
    osc2b.stop(t2 + 2.3);

    // High Shimmer Metallic Anvil (Harmonic Sparkle ~ 1600 Hz)
    const oscHigh = ctx.createOscillator();
    const gainHigh = ctx.createGain();
    oscHigh.type = 'sine';
    oscHigh.frequency.setValueAtTime(1760, t2); // A6
    oscHigh.frequency.exponentialRampToValueAtTime(880, t2 + 0.8);
    gainHigh.gain.setValueAtTime(0.01, now);
    gainHigh.gain.setValueAtTime(0.2, t2);
    gainHigh.gain.exponentialRampToValueAtTime(0.001, t2 + 1.6);
    oscHigh.connect(gainHigh);
    gainHigh.connect(masterGain);
    oscHigh.start(t2);
    oscHigh.stop(t2 + 1.8);

  } catch {
    // Graceful fallback if Web Audio is blocked or not supported
  }
}
