// ============================================================
//  utils/sounds.js — Synthesised Sound Effects (Web Audio API)
//  No external files — all tones generated in-browser.
// ============================================================

let _ctx = null;
let _enabled = true;

/** Lazy AudioContext — created on first user gesture */
function getCtx() {
    if (!_ctx) {
        _ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (_ctx.state === 'suspended') _ctx.resume();
    return _ctx;
}

/**
 * Play a single synthesised tone.
 * @param {{ freq?:number, type?:OscillatorType, dur?:number, vol?:number, delay?:number }}
 */
function tone({ freq = 440, type = 'sine', dur = 0.15, vol = 0.2, delay = 0 } = {}) {
    if (!_enabled) return;
    try {
        const ac = getCtx();
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.connect(g);
        g.connect(ac.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
        g.gain.setValueAtTime(vol, ac.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + delay + dur);

        osc.start(ac.currentTime + delay);
        osc.stop(ac.currentTime + delay + dur + 0.05);
    } catch (_) { /* audio unavailable in this environment */ }
}

// ── Public API ───────────────────────────────────────────────
// ── Music ────────────────────────────────────────────────────
let _musicAudio = null;
let _musicStarted = false;

export const sounds = {
    setEnabled(v) {
        _enabled = !!v;
        if (!_enabled) this.stopMusic();
    },
    isEnabled() { return _enabled; },

    /** Start background music — handles both file-based and synthesized backup */
    startMusic() {
        if (!_enabled || _musicStarted) return;
        _musicStarted = true;

        try {
            // Priority 1: Use the user's song if it exists
            _musicAudio = new Audio('assets/sounds/MeSong.mpeg');
            _musicAudio.loop = true;
            _musicAudio.volume = 0.4;

            // Silently catch 404 (file not found) and fall back to synth
            _musicAudio.onerror = () => {
                this._startSynthBGM();
            };

            const playPromise = _musicAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(_error => {
                    // Autoplay blocked or file missing — use synthesized backup
                    this._startSynthBGM();
                });
            }
        } catch (e) {
            this._startSynthBGM();
        }
    },

    stopMusic() {
        if (_musicAudio) {
            _musicAudio.pause();
            _musicAudio.currentTime = 0;
        }
        _musicStarted = false;
    },

    pauseBackgroundMusic() {
        if (_musicAudio && !this.isPaused) {
            _musicAudio.pause();
            this.isPaused = true;
        }
    },

    resumeBackgroundMusic() {
        if (_musicAudio && this.isPaused && _enabled) {
            _musicAudio.play().catch(() => {});
            this.isPaused = false;
        }
    },

    isPaused: false,


    /** A gentle, airy synthesized background loop (as fallback) */
    _startSynthBGM() {
        const playNote = (freq, vol, dur, delay) => {
            if (!_musicStarted || !_enabled) return;
            tone({ freq, type: 'sine', dur, vol, delay });
            setTimeout(() => playNote(freq, vol, dur, delay), 8000); // Loop every 8s
        };

        // Gentle Cmaj7 arpeggio
        [261.63, 329.63, 392.00, 493.88].forEach((f, i) => {
            setTimeout(() => playNote(f, 0.05, 4, 0), i * 2000);
        });
    },

    flip() {
        tone({ freq: 750, type: 'sine', dur: 0.07, vol: 0.15 });
    },

    /** Happy ascending arpeggio on a correct match */
    match(emotionId = 'stress') {
        const baseFreq = this._getEmotionFrequency(emotionId);
        [1, 1.25, 1.5, 2].forEach((mult, i) =>
            tone({ 
                freq: baseFreq * mult, 
                type: emotionId === 'anger' ? 'sawtooth' : 'sine', 
                dur: 0.28, 
                vol: 0.15, 
                delay: i * 0.09 
            })
        );
    },

    /** Low descending tones — gentle, not harsh — on a wrong match */
    wrong(emotionId = 'stress') {
        const baseFreq = emotionId === 'anger' ? 200 : 300;
        tone({ freq: baseFreq, type: 'triangle', dur: 0.18, vol: 0.15 });
        tone({ freq: baseFreq * 0.75, type: 'triangle', dur: 0.2, vol: 0.12, delay: 0.14 });
    },

    _getEmotionFrequency(id) {
        const freqs = {
            anger: 300,        // Heavy/Low
            sadness: 440,      // Pure/Standard
            joy: 784,          // High/Bright
            fear: 659,         // High/Tense
            trust: 523,        // Balanced
            disgust: 349,      // Low/Sharp
            anticipation: 880, // Very High
            surprise: 1047,    // Dynamic
            stress: 523        // Energetic (Default)
        };
        return freqs[id] || 523;
    },

    /** Full fanfare on victory */
    victory() {
        [523, 659, 784, 1047, 1319, 1568].forEach((freq, i) =>
            tone({ freq, type: 'sine', dur: 0.45, vol: 0.22, delay: i * 0.1 })
        );
    },

    /** Bright, child-friendly 'Ta-da!' for discoveries */
    discovery() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((f, i) => {
            tone({ 
                freq: f, 
                type: 'sine', 
                dur: 0.4, 
                vol: 0.15, 
                delay: i * 0.08 
            });
        });
        // Final emphasize note
        tone({ freq: 1046.50, type: 'sine', dur: 0.6, vol: 0.1, delay: 0.35 });
    },

    /** Subtle click for UI buttons */
    click() {
        tone({ freq: 620, type: 'sine', dur: 0.06, vol: 0.1 });
    },

    /** Soft hover sound for children's feedback */
    hover() {
        tone({ freq: 440, type: 'sine', dur: 0.04, vol: 0.05 });
    },

    /** Magical shimmer for matches or success */
    shimmer() {
        for (let i = 0; i < 8; i++) {
            tone({
                freq: 880 + (i * 120),
                type: 'sine',
                dur: 0.15,
                vol: 0.08,
                delay: i * 0.04
            });
        }
    },

    /** Soft breathing-phase bell */
    breathBell() {
        tone({ freq: 880, type: 'sine', dur: 0.6, vol: 0.18 });
    },

    /** Synthesized cheer sound using multiple tones and noise-like frequencies */
    cheer() {
        if (!_enabled) return;
        const ac = getCtx();
        // Multiple rising notes for "whoop" effect
        [440, 554.37, 659.25, 880].forEach((f, i) => {
            const osc = ac.createOscillator();
            const g = ac.createGain();
            osc.connect(g);
            g.connect(ac.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, ac.currentTime + i * 0.05);
            osc.frequency.exponentialRampToValueAtTime(f * 1.5, ac.currentTime + i * 0.05 + 0.5);
            
            g.gain.setValueAtTime(0, ac.currentTime + i * 0.05);
            g.gain.linearRampToValueAtTime(0.1, ac.currentTime + i * 0.05 + 0.1);
            g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + i * 0.05 + 0.6);
            
            osc.start(ac.currentTime + i * 0.05);
            osc.stop(ac.currentTime + i * 0.05 + 0.7);
        });
        
        // Add some noise bursts for "applause"
        for (let j = 0; j < 15; j++) {
            this.clap(ac.currentTime + Math.random() * 0.8);
        }
    },

    /** Short noise burst for a clap */
    clap(time = null) {
        if (!_enabled) return;
        const ac = getCtx();
        const t = time || ac.currentTime;
        
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.connect(g);
        g.connect(ac.destination);
        
        // Use a high-frequency sawtooth/noise-ish sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(Math.random() * 500 + 1000, t);
        
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        
        osc.start(t);
        osc.stop(t + 0.1);
    },

    /** Bright, congratulatory 'Ta-da!' arpeggio with applause */
    congratulate() {
        if (!_enabled) return;
        const ac = getCtx();
        // Ascending major arpeggio
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
            tone({ freq: f, type: 'sine', dur: 0.5, vol: 0.14, delay: i * 0.08 });
        });
        
        // Overlay claps
        for (let j = 0; j < 8; j++) {
            this.clap(ac.currentTime + 0.3 + Math.random() * 0.5);
        }
    }
};
