/**
 * Synthesizes Cyberpunk 2077 futuristic digital glitch & neon laser synth audio
 * using Web Audio API (Zero external assets required).
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesize a digital holographic boot glitch sound
 */
export function playCyberGlitch(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Digital Glitch Oscillators
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sawtooth';
  osc2.type = 'square';

  // Pitch slide modulation (rapid tech glitch drop)
  osc1.frequency.setValueAtTime(1200, now);
  osc1.frequency.exponentialRampToValueAtTime(320, now + 0.08);
  osc1.frequency.exponentialRampToValueAtTime(880, now + 0.16);
  osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.35);

  osc2.frequency.setValueAtTime(600, now);
  osc2.frequency.exponentialRampToValueAtTime(160, now + 0.08);
  osc2.frequency.exponentialRampToValueAtTime(440, now + 0.16);
  osc2.frequency.exponentialRampToValueAtTime(880, now + 0.35);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, now);
  filter.Q.setValueAtTime(4.0, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.45);
  osc2.stop(now + 0.45);
}

/**
 * Synthesize a neon laser synth chord hit (Blade Runner / Cyberpunk 2077 feel)
 */
export function playLaserSynth(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const chordNotes = [220.0, 277.18, 329.63, 440.0]; // A Major 7th cyber chord

  chordNotes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3500, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 1.2);
    filter.Q.setValueAtTime(6.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  });
}
