import { describe, it, expect } from 'vitest';
import { playSuccessBeep, playWarningBeep } from '../audioBeep';

describe('audioBeep Utility Suite', () => {
  it('should not throw error when executing in headless or non-browser environments', () => {
    expect(() => playSuccessBeep()).not.toThrow();
    expect(() => playWarningBeep()).not.toThrow();
  });
});
