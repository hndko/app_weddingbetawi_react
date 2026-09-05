/**
 * Apple iOS Theme Web Audio API Synthesizer
 * Pure Client-Side Audio Synthesis (Zero External MP3 / Zero Network Latency)
 * Features:
 *  - playUnlockSound(): Mechanical iOS Lock Screen latch click
 *  - playPaymentChime(): Apple Pay signature harmonic dual chime
 *  - playDynamicPop(): Organic bubble pop for Dynamic Island interaction
 */

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  } catch {
    return null;
  }
}

/**
 * Synthesizes the mechanical iOS lock screen latch click.
 */
export function playUnlockSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // First micro-transient (tick)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1600, now);
    osc1.frequency.exponentialRampToValueAtTime(350, now + 0.018);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.025);

    // Second mechanical latch click (resonance)
    const t2 = now + 0.032;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(580, t2);
    osc2.frequency.exponentialRampToValueAtTime(140, t2 + 0.04);
    gain2.gain.setValueAtTime(0.6, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.045);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t2);
    osc2.stop(t2 + 0.05);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Synthesizes the crisp Apple Pay dual-tone harmonic chime.
 */
export function playPaymentChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Master chime volume
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.7, now);
    master.connect(ctx.destination);

    // Tone 1: C6 (~1046.5 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(master);
    osc1.start(now);
    osc1.stop(now + 0.42);

    // Tone 2: E6 (~1318.5 Hz) layered slightly after
    const t2 = now + 0.07;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, t2);
    gain2.gain.setValueAtTime(0.55, t2);
    gain2.gain.exponentialRampToValueAtTime(0.0005, t2 + 0.7);
    osc2.connect(gain2);
    gain2.connect(master);
    osc2.start(t2);
    osc2.stop(t2 + 0.72);

    // Shimmer sparkle overtone: G6 (~1567.98 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1567.98, t2);
    gain3.gain.setValueAtTime(0.2, t2);
    gain3.gain.exponentialRampToValueAtTime(0.0005, t2 + 0.5);
    osc3.connect(gain3);
    gain3.connect(master);
    osc3.start(t2);
    osc3.stop(t2 + 0.52);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Synthesizes a soft organic pop when expanding or collapsing the Dynamic Island.
 */
export function playDynamicPop(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.035);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Non-blocking fallback
  }
}
