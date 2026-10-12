// Retro 8-bit Chiptune Audio Synthesizer (Web Audio API)
// 100% Standalone - No external audio files needed!

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimeout = null;
    this.tempo = 180; // BPM for Mario theme
    this.currentStep = 0;
    this.volume = 0.35;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // --- Sound Effects ---

  // Mario Jump (Small)
  playJump() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.16);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Mario Jump (Super)
  playSuperJump() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.22);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Coin Sound (Iconic B5 -> E6 chime)
  playCoin() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    // B5 ~ 987.77 Hz for 0.08s
    osc.frequency.setValueAtTime(987.77, t);
    // E6 ~ 1318.51 Hz for 0.28s
    osc.frequency.setValueAtTime(1318.51, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.setValueAtTime(0.3, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  // Stomp enemy
  playStomp() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Bump solid block
  playBump() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Powerup appearance (Mushroom sprouting)
  playSprout() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [330, 392, 440, 523, 587, 659];
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.18, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.08);
    });
  }

  // Eat Mushroom / Power Up Fanfare
  playPowerup() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [
      330, 392, 659, 523, 587, 784,
      440, 523, 880, 659, 784, 1046
    ];
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);

      gain.gain.setValueAtTime(0.3, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.04 + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.07);
    });
  }

  // Power Down (Hurt shrink sound)
  playPowerdown() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [784, 740, 698, 659, 622, 587, 554, 523];
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);

      gain.gain.setValueAtTime(0.2, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.04 + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.06);
    });
  }

  // Break Brick Block (Shatter noise)
  playBreakBlock() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.2);
  }

  // Kick Koopa Shell
  playKick() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Flagpole slide sound
  playFlagpole() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587, t);
    osc.frequency.linearRampToValueAtTime(147, t + 1.2);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.2);
  }

  // Stage Clear Fanfare
  playStageClear() {
    this.stopBGM();
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Classic victory fanfare notes
    const fanfare = [
      { f: 523.25, d: 0.12, off: 0 },       // C5
      { f: 659.25, d: 0.12, off: 0.12 },    // E5
      { f: 783.99, d: 0.12, off: 0.24 },    // G5
      { f: 1046.50, d: 0.18, off: 0.36 },   // C6
      { f: 880.00, d: 0.12, off: 0.54 },    // A5
      { f: 1046.50, d: 0.40, off: 0.66 }    // C6
    ];

    fanfare.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(n.f, t + n.off);
      gain.gain.setValueAtTime(0.3, t + n.off);
      gain.gain.exponentialRampToValueAtTime(0.01, t + n.off + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + n.off);
      osc.stop(t + n.off + n.d);
    });
  }

  // Mario Death Fanfare
  playDie() {
    this.stopBGM();
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Classic death notes: B4, F5, F5, F5, E5, D5, C5
    const notes = [
      { f: 493.88, d: 0.14, off: 0.0 },
      { f: 698.46, d: 0.14, off: 0.18 },
      { f: 698.46, d: 0.14, off: 0.36 },
      { f: 698.46, d: 0.18, off: 0.54 },
      { f: 659.25, d: 0.18, off: 0.76 },
      { f: 587.33, d: 0.18, off: 0.98 },
      { f: 523.25, d: 0.35, off: 1.20 }
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.off);
      gain.gain.setValueAtTime(0.35, t + n.off);
      gain.gain.exponentialRampToValueAtTime(0.01, t + n.off + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + n.off);
      osc.stop(t + n.off + n.d);
    });
  }

  // --- Background Music Sequencer ---

  startBGM() {
    if (this.bgmPlaying) return;
    this.ensureContext();
    this.bgmPlaying = true;
    this.scheduleBGM();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }

  scheduleBGM() {
    if (!this.bgmPlaying || !this.ctx) return;

    // Frequencies
    const E4 = 329.63, G4 = 392.00, A4 = 440.00, B4 = 493.88, Bb4 = 466.16;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880.00;
    const C4 = 261.63, E3 = 164.81, G3 = 196.00, C3 = 130.81, A3 = 220.00, B3 = 246.94;
    const REST = 0;

    // 16th note step = (60 / 180) / 4 = 0.0833s
    const stepDuration = 0.085;

    // Iconic Overworld Main Melody Steps (intro + part 1)
    const melody = [
      // Intro: E5, E5, _, E5, _, C5, E5, _, G5, _, _, _, G4, _, _, _
      E5, E5, REST, E5, REST, C5, E5, REST, G5, REST, REST, REST, G4, REST, REST, REST,
      
      // Phrase 1: C5, _, _, G4, _, _, E4, _, _, A4, _, B4, _, Bb4, A4, _
      C5, REST, REST, G4, REST, REST, E4, REST, REST, A4, REST, B4, REST, Bb4, A4, REST,
      // Phrase 1 part 2: G4, E5, G5, A5, _, F5, G5, _, E5, _, C5, D5, B4, _, _, _
      G4, E5, G5, A5, REST, F5, G5, REST, E5, REST, C5, D5, B4, REST, REST, REST,

      // Phrase 2 (repeat): C5, _, _, G4, _, _, E4, _, _, A4, _, B4, _, Bb4, A4, _
      C5, REST, REST, G4, REST, REST, E4, REST, REST, A4, REST, B4, REST, Bb4, A4, REST,
      // Phrase 2 part 2: G4, E5, G5, A5, _, F5, G5, _, E5, _, C5, D5, B4, _, _, _
      G4, E5, G5, A5, REST, F5, G5, REST, E5, REST, C5, D5, B4, REST, REST, REST
    ];

    // Bassline (Triangle wave)
    const bass = [
      // Intro
      D3, D3, REST, D3, REST, D3, D3, REST, G3, REST, REST, REST, G3, REST, REST, REST,
      // Phrase 1
      E3, REST, REST, C3, REST, REST, G3, REST, REST, C4, REST, D4, REST, Db4, C4, REST,
      G3, C4, E4, F4, REST, D4, E4, REST, C4, REST, A3, B3, G3, REST, REST, REST,
      // Phrase 2
      E3, REST, REST, C3, REST, REST, G3, REST, REST, C4, REST, D4, REST, Db4, C4, REST,
      G3, C4, E4, F4, REST, D4, E4, REST, C4, REST, A3, B3, G3, REST, REST, REST
    ];

    const t = this.ctx.currentTime;
    const totalTime = melody.length * stepDuration;

    melody.forEach((freq, idx) => {
      const noteTime = t + idx * stepDuration;
      if (freq !== REST) {
        // Lead Channel (Square wave)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.12, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.005, noteTime + stepDuration * 0.85);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(noteTime);
        osc.stop(noteTime + stepDuration * 0.85);
      }

      // Bass Channel (Triangle)
      const bassFreq = bass[idx];
      if (bassFreq && bassFreq !== REST) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bassFreq, noteTime);

        bGain.gain.setValueAtTime(0.18, noteTime);
        bGain.gain.exponentialRampToValueAtTime(0.01, noteTime + stepDuration * 0.9);

        bOsc.connect(bGain);
        bGain.connect(this.masterGain);
        bOsc.start(noteTime);
        bOsc.stop(noteTime + stepDuration * 0.9);
      }
    });

    // Loop
    this.bgmTimeout = setTimeout(() => {
      if (this.bgmPlaying) {
        this.scheduleBGM();
      }
    }, totalTime * 1000 - 40);
  }
}

// Global Sound Instance
const Sound = new SoundSystem();
