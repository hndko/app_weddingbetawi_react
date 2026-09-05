/**
 * Synthesizes traditional Dayak Kenyah Sape' lute plucking and ceremonial gong
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
 * Synthesize a single acoustic Sape' string pluck with wood resonance
 */
function playSapeNote(ctx: AudioContext, frequency: number, startTime: number, duration: number = 1.2, gainValue: number = 0.25) {
  const osc = ctx.createOscillator();
  const oscBody = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Sape strings: mix of triangle and slight sawtooth for metallic nylon snap
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, startTime);

  oscBody.type = 'sine';
  oscBody.frequency.setValueAtTime(frequency * 0.5, startTime); // Sub wooden body hum

  // Bandpass filter to model carved Adau wood resonance chamber
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(frequency * 1.5, startTime);
  filter.Q.setValueAtTime(3.5, startTime);

  // Pluck attack & exponential decay envelope
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(filter);
  oscBody.connect(gain);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  oscBody.start(startTime);
  osc.stop(startTime + duration);
  oscBody.stop(startTime + duration);
}

/**
 * Plays traditional Dayak Sape' Kenyah opening arpeggio strum
 * Pentatonic scale (F - C - F - A - C)
 */
export function playSapeStrum(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Dayak Sape' pentatonic frequencies (Hz)
  const notes = [174.61, 261.63, 349.23, 440.0, 523.25]; // F3, C4, F4, A4, C5
  const strumInterval = 0.07; // Rapid delicate finger pluck

  notes.forEach((freq, idx) => {
    playSapeNote(ctx, freq, now + idx * strumInterval, 1.4 - idx * 0.1, 0.22);
  });
}

/**
 * Plays deep resonant Dayak ceremonial bronze gong
 */
export function playGongDayak(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const lowpass = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(88, now); // Low fundamental 88Hz
  osc.frequency.exponentialRampToValueAtTime(82, now + 2.5);

  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(450, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

  osc.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 3.2);
}
