// ============================================================
//  utils/storage.js — localStorage Persistence Helpers
// ============================================================

const PFX = 'emotion-match-';

function set(key, val, persistent = true) {
    try {
        const storage = persistent ? localStorage : sessionStorage;
        storage.setItem(PFX + key, JSON.stringify(val));
    } catch (e) {
        console.warn('Storage blocked or failed:', e);
    }
}
function get(key, persistent = true) {
    try {
        const storage = persistent ? localStorage : sessionStorage;
        const item = storage.getItem(PFX + key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.warn('Storage read blocked or failed:', e);
        return null;
    }
}

// ── Player profile ───────────────────────────────────────────
export function savePlayer(data) { set('player', data); }
export function loadPlayer() { return get('player'); }

// ── Per-level best scores ────────────────────────────────────
/** @param {number} level  @param {{ stars:number, attempts:number }} data */
export function saveScore(level, data) {
    const scores = get('scores') || {};
    const prev = scores[level];
    if (!prev || data.stars > prev.stars ||
        (data.stars === prev.stars && data.attempts < prev.attempts)) {
        scores[level] = data;
        set('scores', scores);
    }
}
export function loadScores() { return get('scores') || {}; }
export function resetScores() { set('scores', {}); }

export function saveUnlockedInsights(ids) { set('insights', ids); }
export function loadUnlockedInsights() { return get('insights') || []; }

// ── Discovered Feeling Fusions ───────────────────────────────
export function saveDiscoveredMixes(ids) { set('discoveredMixes', ids); }
export function loadDiscoveredMixes() { return get('discoveredMixes') || []; }

// ── App settings ─────────────────────────────────────────────
export function saveSettings(data) { set('settings', data); }
export function loadSettings() { 
    return get('settings') ?? { 
        soundEnabled: true, 
        speechEnabled: false,
        highContrast: false,
        dyslexicFont: false,
        reducedMotion: false
    }; 
}

// ── Nuclear option ───────────────────────────────────────────
export function clearAll() {
    try {
        Object.keys(localStorage)
            .filter(k => k.startsWith(PFX))
            .forEach(k => localStorage.removeItem(k));
    } catch (e) {
        console.warn('Storage clear failed:', e);
    }
}
