
export const state = {
    discoveredMixes: [],
    targetEmotion: null,
    triesLeft: 4,
    tipsLeft: 1,
    gameStatus: 'playing', // 'playing', 'won', 'lost'
    lastResult: null,      // Stores the last mixed emotion or target for result screens
    currentLevel: 1
};

export function saveDiscoveredMixes(mixes) {
    localStorage.setItem('discoveredMixes', JSON.stringify(mixes));
}

export function loadDiscoveredMixes() {
    const saved = localStorage.getItem('discoveredMixes');
    if (saved) {
        state.discoveredMixes = JSON.parse(saved);
    }
}
