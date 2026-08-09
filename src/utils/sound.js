let audioContext = null;
let currentNodes = [];

const getContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

export const stopTone = () => {
  currentNodes.forEach((node) => {
    try {
      node.stop();
    } catch (error) {
      /* already stopped */
    }
  });
  currentNodes = [];
};

export const playTone = ({ pattern, volume = 0.5, type = 'sine' }) => {
  stopTone();
  try {
    const ctx = getContext();
    let startAt = ctx.currentTime + 0.02;
    pattern.forEach(([freq, duration]) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = freq;
      gain.gain.setValueAtTime(volume, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.02);
      currentNodes.push(oscillator);
      startAt += duration;
    });
  } catch (error) {
    /* audio unavailable */
  }
};

export const RINGTONES = [
  { name: 'Cosmic Chime', pattern: [[880, 0.15], [0, 0.06], [1174.66, 0.15], [0, 0.06], [1567.98, 0.25]], type: 'sine' },
  { name: 'Digital Dawn', pattern: [[660, 0.1], [880, 0.1], [990, 0.1], [1320, 0.2]], type: 'square' },
  { name: 'Neon Pulse', pattern: [[523.25, 0.12], [0, 0.05], [523.25, 0.12], [0, 0.05], [1046.5, 0.2]], type: 'triangle' },
  { name: 'Orbit', pattern: [[392, 0.2], [523.25, 0.2], [659.25, 0.2], [783.99, 0.3]], type: 'sine' },
  { name: 'Solar Wake', pattern: [[587.33, 0.15], [0, 0.04], [880, 0.15], [0, 0.04], [1174.66, 0.3]], type: 'sine' },
];
