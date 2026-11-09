// Crystal "Tunng" notification chime generator using Web Audio API

let sharedAudioContext = null;
let isAudioUnlocked = false;
let lastPlayedTimestamp = 0;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

// Automatically unlock audio on first user interaction in the admin panel
export function initAudioUnlock() {
  if (typeof window === "undefined" || isAudioUnlocked) return;

  const unlock = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      isAudioUnlocked = true;
    } catch (e) {}

    window.removeEventListener("click", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };

  window.addEventListener("click", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true, passive: true });
  window.addEventListener("touchstart", unlock, { once: true, passive: true });
}

/**
 * Plays a crystalline, metallic "Tunng" bell notification sound
 */
export function playTunngNotification() {
  // Prevent duplicate overlapping sounds within 800ms
  const nowMs = Date.now();
  if (nowMs - lastPlayedTimestamp < 800) {
    return;
  }
  lastPlayedTimestamp = nowMs;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Master Volume Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.connect(ctx.destination);

    // 1. Strike Transient Punch (Low-Mid warmth bell body ~ 523.25 Hz - C5)
    const oscBody = ctx.createOscillator();
    const gainBody = ctx.createGain();
    oscBody.type = "sine";
    oscBody.frequency.setValueAtTime(523.25, now);
    oscBody.frequency.exponentialRampToValueAtTime(518, now + 0.15);
    gainBody.gain.setValueAtTime(0.4, now);
    gainBody.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    oscBody.connect(gainBody);
    gainBody.connect(masterGain);
    oscBody.start(now);
    oscBody.stop(now + 0.45);

    // 2. Fundamental Crystal "Tunng" Tone (1046.5 Hz - C6)
    const oscFund = ctx.createOscillator();
    const gainFund = ctx.createGain();
    oscFund.type = "sine";
    oscFund.frequency.setValueAtTime(1046.5, now);
    // Subtle frequency glide on strike creates the metallic "tunng" acoustic impact
    oscFund.frequency.exponentialRampToValueAtTime(1040, now + 0.08);
    gainFund.gain.setValueAtTime(0.55, now);
    gainFund.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    oscFund.connect(gainFund);
    gainFund.connect(masterGain);
    oscFund.start(now);
    oscFund.stop(now + 1.5);

    // 3. High Shimmer Overtone (2093 Hz - C7, octave harmonic)
    const oscOvertone1 = ctx.createOscillator();
    const gainOvertone1 = ctx.createGain();
    oscOvertone1.type = "sine";
    oscOvertone1.frequency.setValueAtTime(2093, now);
    gainOvertone1.gain.setValueAtTime(0.3, now);
    gainOvertone1.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
    oscOvertone1.connect(gainOvertone1);
    gainOvertone1.connect(masterGain);
    oscOvertone1.start(now);
    oscOvertone1.stop(now + 1.1);

    // 4. Sparkling Third Harmonic (2637 Hz - E7, bright singing resonance)
    const oscOvertone2 = ctx.createOscillator();
    const gainOvertone2 = ctx.createGain();
    oscOvertone2.type = "sine";
    oscOvertone2.frequency.setValueAtTime(2637, now);
    gainOvertone2.gain.setValueAtTime(0.2, now);
    gainOvertone2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    oscOvertone2.connect(gainOvertone2);
    gainOvertone2.connect(masterGain);
    oscOvertone2.start(now);
    oscOvertone2.stop(now + 0.7);

    // 5. Ultra-high glass chime sparkle (4186 Hz - C8)
    const oscSparkle = ctx.createOscillator();
    const gainSparkle = ctx.createGain();
    oscSparkle.type = "sine";
    oscSparkle.frequency.setValueAtTime(4186, now);
    gainSparkle.gain.setValueAtTime(0.12, now);
    gainSparkle.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    oscSparkle.connect(gainSparkle);
    gainSparkle.connect(masterGain);
    oscSparkle.start(now);
    oscSparkle.stop(now + 0.4);
  } catch (err) {
    console.warn("Tunng notification sound notice:", err);
  }
}
