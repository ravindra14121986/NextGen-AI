/**
 * Web Audio API Sound Generator for Tactile UI Feedback
 * Zero external audio files required — synthesized in real-time.
 */

let isAudioMuted = false;

// Attempt to read user preference
try {
  const saved = localStorage.getItem('mckinsey_ui_sound_muted');
  if (saved !== null) {
    isAudioMuted = saved === 'true';
  }
} catch (e) {
  // Ignore storage read failures
}

export function isSoundMuted(): boolean {
  return isAudioMuted;
}

export function toggleSound(): boolean {
  isAudioMuted = !isAudioMuted;
  try {
    localStorage.setItem('mckinsey_ui_sound_muted', isAudioMuted.toString());
  } catch (e) {
    // Ignore storage write failures
  }
  return isAudioMuted;
}

/**
 * Plays a clean, high-grade mechanical tactile click sound
 */
export function playClickSound(): void {
  if (isAudioMuted) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // 1. High crisp transient snap (switch contact)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(320, now + 0.035);

    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.038);

    // 2. Low tactile mechanical body (switch seat)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(260, now);
    osc2.frequency.exponentialRampToValueAtTime(70, now + 0.045);

    gain2.gain.setValueAtTime(0.14, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now);
    osc2.stop(now + 0.048);

    // Auto close context after playback to prevent resource leak
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 150);
  } catch (err) {
    // Browsers may block audio until first user gesture; silently ignore
  }
}

/**
 * Plays a subtle chime sound for refresh / live pulse
 */
export function playChimeSound(): void {
  if (isAudioMuted) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 200);
  } catch (err) {
    // Ignore
  }
}
