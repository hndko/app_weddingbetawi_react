/**
 * Web Audio API Synthesizer for Stage Screen Chime
 * Generates a warm, bell-like harmonic chime when a new wedding wish arrives
 * Zero external audio files, pure browser-native sound generation
 */

let stageAudioCtx: AudioContext | null = null;

function getStageAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!stageAudioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      stageAudioCtx = new AudioContextClass();
    }
  }
  if (stageAudioCtx && stageAudioCtx.state === 'suspended') {
    stageAudioCtx.resume().catch(() => {});
  }
  return stageAudioCtx;
}

/**
 * Play a cinematic stage bell chime (C5 -> E5 -> G5 chord progression)
 */
export function playStageChime(): void {
  try {
    const ctx = getStageAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Harmonic Chord)
    const delays = [0, 0.08, 0.16, 0.24];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delays[idx]);

      // Bell-like envelope: fast attack, exponential decay
      gain.gain.setValueAtTime(0.18, now + delays[idx]);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delays[idx] + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delays[idx]);
      osc.stop(now + delays[idx] + 1.2);
    });
  } catch {
    // Graceful fallback if Web Audio is restricted
  }
}
