/**
 * Instagram Stories Web Audio API Synthesizer
 * Pure Client-Side Audio Synthesis (Zero External MP3 / Zero Network Latency)
 * Features:
 *  - playStoryPop(): Acoustic bubble pop when navigating story slides
 *  - playHeartChime(): Joyful harmonic sparkle chime when sending love reactions
 *  - playCameraSnap(): Crisp shutter snap for photo moments
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
 * Synthesizes a soft organic pop when advancing or rewinding story slides.
 */
export function playStoryPop(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.035);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Synthesizes a joyful high harmonic sparkle chime when sending heart reactions.
 */
export function playHeartChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.6, now);
    master.connect(ctx.destination);

    // Primary High Bell Note (E6 ~1318 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1318.5, now);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(master);
    osc1.start(now);
    osc1.stop(now + 0.38);

    // Sparkle Harmony Note (G#6 ~1661 Hz)
    const t2 = now + 0.05;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1661.2, t2);
    gain2.gain.setValueAtTime(0.4, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.45);
    osc2.connect(gain2);
    gain2.connect(master);
    osc2.start(t2);
    osc2.stop(t2 + 0.48);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Synthesizes a crisp camera shutter snap sound.
 */
export function playCameraSnap(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Fast mechanical shutter impulse
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {
    // Non-blocking fallback
  }
}
