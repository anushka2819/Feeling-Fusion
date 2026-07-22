export const state = {
    discoveredMixes: [],
    targetEmotion: null,
    triesLeft: 4,
    tipsLeft: 1,
    gameStatus: 'playing', // 'playing', 'won', 'lost'
    lastResult: null,      // Stores the last mixed emotion or target for result screens
    currentLevel: 1,
    unlockedLevels: 1,
    starsPerLevel: {},     // e.g. {1: 3, 2: 1}
    score: 0,
    powerUps: { wand: 3, freeze: 3 },
    timeLeft: 60,
    timerInterval: null,
    labLevel: 1,
    winStreak: 0,
    filterCount: 1
};

export function saveProgress() {
    const data = {
        discoveredMixes: state.discoveredMixes,
        currentLevel: state.currentLevel,
        unlockedLevels: state.unlockedLevels,
        starsPerLevel: state.starsPerLevel,
        powerUps: state.powerUps
    };
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('feelingFusionSave', JSON.stringify(data));
    }
}

export function loadProgress() {
    if (typeof localStorage === 'undefined') return;
    const saved = localStorage.getItem('feelingFusionSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            state.discoveredMixes = data.discoveredMixes || [];
            state.currentLevel = data.currentLevel || 1;
            state.unlockedLevels = data.unlockedLevels || 1;
            state.starsPerLevel = data.starsPerLevel || {};
            state.powerUps = data.powerUps || { wand: 3, freeze: 3 };
        } catch(e) {}
    }
}

export function saveDiscoveredMixes(mixes) {
    state.discoveredMixes = mixes;
    saveProgress();
}

export function loadDiscoveredMixes() {
    loadProgress();
}

// Automatically load progress when module initializes
loadProgress();
