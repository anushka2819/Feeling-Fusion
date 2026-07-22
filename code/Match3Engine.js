import { state, saveProgress } from './gameState.js';
import { sounds } from './utils/sounds.js';
import { EMOTIONS_DATA } from './gameData.js';
import { MIXING_RECIPES } from './moodMixerData.js';

let score = 0;
let moves = 20;
let targetScore = 1000;
let grid = [];
const cols = 8;
const rows = 8;
const basicEmotions = ['joy', 'sadness', 'anger', 'fear', 'trust', 'surprise', 'disgust', 'anticipation'];

let selectedTile = null;
let activeBooster = null; // 'wand', 'hammer', 'shuffle'
let isAnimating = false;
let comboCount = 0;
let localNavigate = null;

export function template() {
    return /* html */`
    <section id="screen-match3" class="screen" aria-label="Emotion Crush">
        <header style="position: absolute; top: 15px; left: 20px; right: 20px; z-index: 10; display: flex; justify-content: space-between; align-items: center;">
            <button id="btn-match3-back" class="circle-btn" title="Back to Map" style="background: rgba(0,0,0,0.5); border: 2px solid #FFF; color: #FFF; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <i data-lucide="map"></i>
            </button>

            <div style="display: flex; gap: 20px; background: rgba(0,0,0,0.6); padding: 8px 25px; border-radius: 30px; border: 2px solid #FF5722; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
                <div style="text-align: center;">
                    <div style="font-size: 0.75rem; color: #FFCCBC; text-transform: uppercase; letter-spacing: 1px;">Target</div>
                    <div id="match3-target" style="color: #FFEB3B; font-size: 1.4rem; font-weight: 900;">1000</div>
                </div>
                <div style="width: 2px; background: rgba(255,255,255,0.2);"></div>
                <div style="text-align: center;">
                    <div style="font-size: 0.75rem; color: #FFCCBC; text-transform: uppercase; letter-spacing: 1px;">Score</div>
                    <div id="match3-score" style="color: #FFF; font-size: 1.4rem; font-weight: 900;">0</div>
                </div>
                <div style="width: 2px; background: rgba(255,255,255,0.2);"></div>
                <div style="text-align: center;">
                    <div style="font-size: 0.75rem; color: #FFCCBC; text-transform: uppercase; letter-spacing: 1px;">Moves</div>
                    <div id="match3-moves" style="color: #00E676; font-size: 1.4rem; font-weight: 900;">20</div>
                </div>
            </div>

            <button id="btn-match3-help" class="circle-btn" title="How to Play" style="background: rgba(0,0,0,0.5); border: 2px solid #FFF; color: #FFF; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <i data-lucide="help-circle"></i>
            </button>
        </header>

        <div class="match3-board-container" style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; width: 100%; gap: 15px; padding-top: 60px;">
            <!-- Grid -->
            <div id="match3-grid" style="display: grid; grid-template-columns: repeat(8, 56px); grid-template-rows: repeat(8, 56px); gap: 6px; background: rgba(13, 71, 161, 0.7); padding: 12px; border-radius: 24px; border: 4px solid #FF5722; box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.4); position: relative;">
                <!-- Tiles injected by JS -->
            </div>

            <!-- Boosters Bar -->
            <div class="booster-bar">
                <button id="booster-wand" class="booster-btn" title="Magic Wand: Destroy 1 Tile">
                    <i data-lucide="wand-2"></i>
                    <span class="booster-badge" id="badge-wand">3</span>
                </button>
                <button id="booster-hammer" class="booster-btn" title="Hammer: Explode 3x3 Area">
                    <i data-lucide="hammer"></i>
                    <span class="booster-badge" id="badge-hammer">3</span>
                </button>
                <button id="booster-shuffle" class="booster-btn" title="Shuffle Board">
                    <i data-lucide="shuffle"></i>
                    <span class="booster-badge" id="badge-shuffle">∞</span>
                </button>
            </div>
        </div>        <!-- Emotion Crush Fullscreen Manual Modal -->
        <div id="manual-modal-match3-ingame" class="manual-modal" style="display:none;">
            <div class="manual-card manual-card-fullscreen" style="background: linear-gradient(135deg, #1A237E 0%, #0D47A1 50%, #002171 100%); color: white; position: relative;">
                <div style="max-width: 1100px; width: 100%; margin: 0 auto;">
                    <button id="btn-close-match3-help" class="circle-btn" style="position: absolute; top: 25px; right: 25px; background: #FF1744; color: white; border: none; cursor: pointer; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 10;">
                        <i data-lucide="x" style="width: 28px; height: 28px;"></i>
                    </button>

                    <h2 style="color: #FFEB3B; font-weight: 900; margin-top: 0; display: flex; align-items: center; gap: 15px; font-size: 2.5rem; border-bottom: 3px dashed rgba(255,255,255,0.25); padding-bottom: 15px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                        <i data-lucide="sparkles" style="width: 40px; height: 40px; color: #FF9800;"></i> EMOTION CRUSH — GAME MANUAL
                    </h2>

                    <!-- Visual Cards Grid -->
                    <div class="manual-grid">
                        <div class="manual-item-card" style="border-left: 5px solid #FF5722;">
                            <div class="manual-item-icon" style="background: #FF5722;">🎯</div>
                            <div class="manual-item-title">Objective & Swapping</div>
                            <div class="manual-item-desc">
                                Reach the Target Score before running out of moves! Drag & drop or tap 2 adjacent tiles to swap. Line up 3 identical emotions to pop them!
                            </div>
                        </div>

                        <div class="manual-item-card" style="border-left: 5px solid #FFD700;">
                            <div class="manual-item-icon" style="background: #F57F17;">🧪</div>
                            <div class="manual-item-title">Emotion Fusion Swap</div>
                            <div class="manual-item-desc">
                                Swap 2 DIFFERENT basic emotions to trigger a fusion recipe! Synthesizes a <strong>Golden Tier-2 Emotion Booster Tile (+500 Bonus Points)</strong>!
                            </div>
                            <div class="recipe-preview-box">
                                <span style="color:#FFEB3B; font-weight:bold;">Joy 😊</span> + <span style="color:#64B5F6; font-weight:bold;">Sadness 😢</span> = <span style="color:#FFD700; font-weight:900;">Bittersweet ✨</span>
                            </div>
                        </div>

                        <div class="manual-item-card" style="border-left: 5px solid #00E676;">
                            <div class="manual-item-icon" style="background: #00E676;">⚡</div>
                            <div class="manual-item-title">Line Blaster (Match 4)</div>
                            <div class="manual-item-desc">
                                Match 4 identical emotions in a row to spawn a <strong>Line Blaster Tile</strong>! When matched, it shoots a laser clearing an entire row & column!
                            </div>
                        </div>

                        <div class="manual-item-card" style="border-left: 5px solid #E91E63;">
                            <div class="manual-item-icon" style="background: #E91E63;">🌈</div>
                            <div class="manual-item-title">Rainbow Bomb (Match 5)</div>
                            <div class="manual-item-desc">
                                Match 5 identical emotions in a row or T/L shape to create a <strong>Rainbow Emotion Bomb</strong>! Explodes a 3x3 surrounding grid area!
                            </div>
                        </div>

                        <div class="manual-item-card" style="border-left: 5px solid #2979FF; grid-column: span 2;">
                            <div class="manual-item-icon" style="background: #2979FF;">🛠️</div>
                            <div class="manual-item-title">Booster Arsenal</div>
                            <div class="manual-item-desc" style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 5px;">
                                <span>🪄 <strong>Magic Wand:</strong> Destroys any single tile.</span>
                                <span>🔨 <strong>Hammer:</strong> Explodes a 3x3 area.</span>
                                <span>🔀 <strong>Shuffle:</strong> Remixes board tiles anytime.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="max-width: 500px; width: 100%; margin: 15px auto 5px;">
                    <button id="btn-resume-match3" class="btn-primary" style="width: 100%; font-size: 1.5rem; padding: 16px; background: linear-gradient(180deg, #FF7043, #F4511E); border: 4px solid #FFF; border-radius: 50px; cursor: pointer; color: #FFF; font-weight: 900; justify-content: center; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(244,81,30,0.7);">
                        <i data-lucide="play" style="fill: #FFF; width: 28px; height: 28px;"></i> RESUME GAME
                    </button>
                </div>
            </div>
        </div>
    </section>
    `;
}

export function init({ navigate }) {
    localNavigate = navigate;
    document.getElementById('btn-match3-back').addEventListener('click', () => {
        sounds.click();
        localNavigate('saga');
    });

    document.getElementById('booster-wand').addEventListener('click', () => toggleBooster('wand'));
    document.getElementById('booster-hammer').addEventListener('click', () => toggleBooster('hammer'));
    document.getElementById('booster-shuffle').addEventListener('click', () => useShuffleBooster());

    const helpModal = document.getElementById('manual-modal-match3-ingame');
    document.getElementById('btn-match3-help')?.addEventListener('click', () => {
        sounds.click();
        if (helpModal) helpModal.style.display = 'flex';
        if (window.lucide) window.lucide.createIcons();
    });
    document.getElementById('btn-close-match3-help')?.addEventListener('click', () => {
        sounds.click();
        if (helpModal) helpModal.style.display = 'none';
    });
    document.getElementById('btn-resume-match3')?.addEventListener('click', () => {
        sounds.click();
        if (helpModal) helpModal.style.display = 'none';
    });
}

export function onShow() {
    score = 0;
    moves = Math.max(12, 22 - state.currentLevel);
    targetScore = 800 + (state.currentLevel * 400);
    selectedTile = null;
    activeBooster = null;
    isAnimating = false;
    comboCount = 0;

    updateHeader();
    updateBoosterBadges();
    
    // Choose basic emotions for level difficulty (4-6 colors)
    initGrid();
    renderGrid();
}

function updateHeader() {
    const targetEl = document.getElementById('match3-target');
    const scoreEl = document.getElementById('match3-score');
    const movesEl = document.getElementById('match3-moves');
    if (targetEl) targetEl.textContent = targetScore;
    if (scoreEl) scoreEl.textContent = score;
    if (movesEl) movesEl.textContent = moves;
}

function updateBoosterBadges() {
    const wandBadge = document.getElementById('badge-wand');
    const hammerBadge = document.getElementById('badge-hammer');
    if (wandBadge) wandBadge.textContent = state.powerUps?.wand ?? 3;
    if (hammerBadge) hammerBadge.textContent = state.powerUps?.freeze ?? 3;
}

function toggleBooster(boosterType) {
    sounds.click();
    if (activeBooster === boosterType) {
        activeBooster = null;
        document.getElementById(`booster-${boosterType}`)?.classList.remove('active');
    } else {
        if (activeBooster) {
            document.getElementById(`booster-${activeBooster}`)?.classList.remove('active');
        }
        activeBooster = boosterType;
        document.getElementById(`booster-${boosterType}`)?.classList.add('active');
    }
}

function useShuffleBooster() {
    if (isAnimating) return;
    sounds.pour();
    shuffleGrid();
    renderGrid();
    showComboText('SHUFFLED! 🔀', rows / 2, cols / 2);
}

function getLevelEmotions() {
    // Difficulty scales emotion types count (4 colors at lvl 1, up to 6 at higher levels)
    const count = Math.min(basicEmotions.length, 4 + Math.floor((state.currentLevel - 1) / 3));
    return basicEmotions.slice(0, count);
}

function getRandomEmotion() {
    const pool = getLevelEmotions();
    return pool[Math.floor(Math.random() * pool.length)];
}

function initGrid() {
    let hasInitialMatch = true;
    while (hasInitialMatch) {
        grid = [];
        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < cols; c++) {
                row.push({
                    type: getRandomEmotion(),
                    special: null // 'blaster', 'bomb', or fused recipe object
                });
            }
            grid.push(row);
        }
        hasInitialMatch = findMatches().length > 0;
    }
}

function shuffleGrid() {
    let tiles = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c]) tiles.push(grid[r][c]);
        }
    }
    // Shuffle array
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    let idx = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c] = tiles[idx++];
        }
    }
}

function renderGrid() {
    const container = document.getElementById('match3-grid');
    if (!container) return;
    container.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = grid[r][c];
            if (!cell) continue;

            const emoData = EMOTIONS_DATA[cell.type] || cell.fusedData;
            const tile = document.createElement('div');
            tile.className = 'match3-tile';
            tile.dataset.r = r;
            tile.dataset.c = c;
            tile.style.width = '100%';
            tile.style.height = '100%';
            tile.style.borderRadius = '50%';
            tile.style.backgroundColor = cell.fusedData ? cell.fusedData.color : (emoData ? emoData.color : '#FF9800');
            tile.style.display = 'flex';
            tile.style.justifyContent = 'center';
            tile.style.alignItems = 'center';
            tile.style.cursor = 'pointer';
            tile.style.boxShadow = 'inset 0 -4px 0 rgba(0,0,0,0.35)';

            if (selectedTile && selectedTile.r === r && selectedTile.c === c) {
                tile.classList.add('selected');
            }
            if (cell.special === 'blaster') {
                tile.classList.add('special-blaster');
            } else if (cell.special === 'bomb') {
                tile.classList.add('special-bomb');
            } else if (cell.fusedData) {
                tile.classList.add('fused-tile');
            }

            const iconSrc = cell.fusedData ? cell.fusedData.icon : (emoData ? emoData.icon : 'assets/elements/joy_select.svg');
            tile.innerHTML = `<img src="${iconSrc}" style="width:38px; height:38px; pointer-events:none; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">`;

            // Tile click handler
            tile.addEventListener('click', () => handleTileClick(r, c));

            // Drag and drop handlers
            tile.draggable = true;
            tile.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ r, c }));
            });
            tile.addEventListener('dragover', (e) => e.preventDefault());
            tile.addEventListener('drop', (e) => {
                e.preventDefault();
                try {
                    const from = JSON.parse(e.dataTransfer.getData('text/plain'));
                    if (from && (from.r !== r || from.c !== c)) {
                        attemptSwap(from.r, from.c, r, c);
                    }
                } catch(err){}
            });

            container.appendChild(tile);
        }
    }
}

function handleTileClick(r, c) {
    if (isAnimating) return;

    // Handle Active Booster execution
    if (activeBooster === 'wand') {
        if ((state.powerUps.wand || 0) <= 0) return;
        state.powerUps.wand--;
        updateBoosterBadges();
        activeBooster = null;
        document.getElementById('booster-wand')?.classList.remove('active');
        sounds.mixSuccess();
        grid[r][c] = null;
        score += 300;
        updateHeader();
        processBoardCascades();
        return;
    }

    if (activeBooster === 'hammer') {
        if ((state.powerUps.freeze || 0) <= 0) return;
        state.powerUps.freeze--;
        updateBoosterBadges();
        activeBooster = null;
        document.getElementById('booster-hammer')?.classList.remove('active');
        sounds.mixSuccess();
        trigger3x3Explosion(r, c);
        score += 800;
        updateHeader();
        processBoardCascades();
        return;
    }

    // Standard Select / Swap
    if (!selectedTile) {
        selectedTile = { r, c };
        sounds.click();
        renderGrid();
    } else {
        const r1 = selectedTile.r;
        const c1 = selectedTile.c;
        selectedTile = null;

        if (r1 === r && c1 === c) {
            renderGrid();
            return;
        }

        // Check if adjacent
        const isAdjacent = (Math.abs(r1 - r) + Math.abs(c1 - c)) === 1;
        if (isAdjacent) {
            attemptSwap(r1, c1, r, c);
        } else {
            // Select new tile instead
            selectedTile = { r, c };
            sounds.click();
            renderGrid();
        }
    }
}

function attemptSwap(r1, c1, r2, c2) {
    if (moves <= 0 || isAnimating) return;

    isAnimating = true;
    sounds.pour();

    const t1 = grid[r1][c1];
    const t2 = grid[r2][c2];

    // Check Emotion Fusion swap: Swapping two DIFFERENT basic emotions
    const recipe = findFusionRecipe(t1.type, t2.type);

    if (recipe) {
        // Trigger Emotion Fusion!
        moves--;
        updateHeader();
        sounds.mixSuccess();
        shakeScreen();

        // Create Fused Special Tile at r2, c2
        grid[r2][c2] = {
            type: recipe.result.id,
            fusedData: recipe.result,
            special: 'fused'
        };
        grid[r1][c1] = null;

        showComboText(`FUSION: ${recipe.result.name.toUpperCase()}! ✨`, r2, c2);
        score += 500;
        updateHeader();

        setTimeout(() => {
            processBoardCascades();
        }, 400);
        return;
    }

    // Standard Swap
    grid[r1][c1] = t2;
    grid[r2][c2] = t1;
    renderGrid();

    const matches = findMatches();
    if (matches.length > 0) {
        moves--;
        updateHeader();
        comboCount = 1;
        clearMatchesAndProcess(matches);
    } else {
        // Invalid swap - animate back
        sounds.mixFail();
        setTimeout(() => {
            grid[r1][c1] = t1;
            grid[r2][c2] = t2;
            renderGrid();
            isAnimating = false;
        }, 300);
    }
}

function findFusionRecipe(e1, e2) {
    if (!e1 || !e2 || e1 === e2) return null;
    return MIXING_RECIPES.find(r => 
        (r.e1 === e1 && r.e2 === e2) || (r.e1 === e2 && r.e2 === e1)
    );
}

function findMatches() {
    let matchedCells = new Set();

    // Horizontal matches
    for (let r = 0; r < rows; r++) {
        let matchLength = 1;
        for (let c = 0; c < cols; c++) {
            const current = grid[r][c];
            const next = (c < cols - 1) ? grid[r][c + 1] : null;

            if (current && next && current.type === next.type && !current.fusedData && !next.fusedData) {
                matchLength++;
            } else {
                if (matchLength >= 3) {
                    for (let i = 0; i < matchLength; i++) {
                        matchedCells.add(`${r},${c - i}`);
                    }
                }
                matchLength = 1;
            }
        }
    }

    // Vertical matches
    for (let c = 0; c < cols; c++) {
        let matchLength = 1;
        for (let r = 0; r < rows; r++) {
            const current = grid[r][c];
            const next = (r < rows - 1) ? grid[r + 1][c] : null;

            if (current && next && current.type === next.type && !current.fusedData && !next.fusedData) {
                matchLength++;
            } else {
                if (matchLength >= 3) {
                    for (let i = 0; i < matchLength; i++) {
                        matchedCells.add(`${r - i},${c}`);
                    }
                }
                matchLength = 1;
            }
        }
    }

    return Array.from(matchedCells).map(pos => {
        const [r, c] = pos.split(',').map(Number);
        return { r, c };
    });
}

function clearMatchesAndProcess(matches) {
    let pointsGained = matches.length * 100 * comboCount;
    score += pointsGained;

    // Check for special tile creation (Match 4 or 5)
    if (matches.length >= 5) {
        const pivot = matches[0];
        grid[pivot.r][pivot.c] = { type: getRandomEmotion(), special: 'bomb' };
        showComboText('RAINBOW BOMB! 🌈', pivot.r, pivot.c);
    } else if (matches.length === 4) {
        const pivot = matches[0];
        grid[pivot.r][pivot.c] = { type: getRandomEmotion(), special: 'blaster' };
        showComboText('LINE BLASTER! ⚡', pivot.r, pivot.c);
    }

    // Clear matched cells
    matches.forEach(({ r, c }) => {
        const tile = grid[r][c];
        if (tile) {
            if (tile.special === 'blaster') {
                triggerRowColExplosion(r, c);
            } else if (tile.special === 'bomb') {
                trigger3x3Explosion(r, c);
            }
            grid[r][c] = null;
        }
    });

    sounds.pour();

    if (comboCount > 1) {
        const comboWords = ['SWEET! 🍬', 'DELICIOUS! 🌟', 'UNSTOPPABLE! 🔥', 'EPIC FUSION! 💥'];
        const word = comboWords[Math.min(comboCount - 2, comboWords.length - 1)];
        const pivot = matches[0] || { r: 4, c: 4 };
        showComboText(`${word} x${comboCount}`, pivot.r, pivot.c);
        shakeScreen();
    }

    updateHeader();

    setTimeout(() => {
        processBoardCascades();
    }, 350);
}

function processBoardCascades() {
    // Gravity drop
    for (let c = 0; c < cols; c++) {
        for (let r = rows - 1; r >= 0; r--) {
            if (grid[r][c] === null) {
                for (let k = r - 1; k >= 0; k--) {
                    if (grid[k][c] !== null) {
                        grid[r][c] = grid[k][c];
                        grid[k][c] = null;
                        break;
                    }
                }
                if (grid[r][c] === null) {
                    grid[r][c] = { type: getRandomEmotion(), special: null };
                }
            }
        }
    }

    renderGrid();

    // Check cascading matches
    const newMatches = findMatches();
    if (newMatches.length > 0) {
        comboCount++;
        setTimeout(() => {
            clearMatchesAndProcess(newMatches);
        }, 300);
    } else {
        isAnimating = false;
        checkWinLoss();
    }
}

function triggerRowColExplosion(r, c) {
    for (let i = 0; i < cols; i++) grid[r][i] = null;
    for (let j = 0; j < rows; j++) grid[j][c] = null;
    score += 600;
}

function trigger3x3Explosion(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                grid[nr][nc] = null;
            }
        }
    }
    score += 800;
}

function showComboText(text, r, c) {
    const container = document.getElementById('match3-grid');
    if (!container) return;

    const popup = document.createElement('div');
    popup.className = 'combo-popup';
    popup.textContent = text;
    popup.style.left = `calc(${c * 56 + 28}px)`;
    popup.style.top = `calc(${r * 56}px)`;

    container.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
}

function shakeScreen() {
    const screen = document.getElementById('screen-match3');
    if (!screen) return;
    screen.classList.add('shake-screen');
    setTimeout(() => screen.classList.remove('shake-screen'), 400);
}

function checkWinLoss() {
    if (score >= targetScore) {
        sounds.mixSuccess();
        const starsEarned = moves >= 5 ? 3 : (moves >= 2 ? 2 : 1);
        state.starsPerLevel[state.currentLevel] = Math.max(state.starsPerLevel[state.currentLevel] || 0, starsEarned);
        state.unlockedLevels = Math.max(state.unlockedLevels, state.currentLevel + 1);
        saveProgress();

        if (window.confetti) {
            window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        setTimeout(() => {
            alert(`🎉 LEVEL COMPLETE! SWEET!\nYou scored ${score} pts and earned ${starsEarned} Star(s)!`);
            localNavigate('saga');
        }, 500);
    } else if (moves <= 0) {
        sounds.mixFail();
        setTimeout(() => {
            alert(`💔 Out of moves! You scored ${score}/${targetScore}.\nTry again!`);
            localNavigate('saga');
        }, 500);
    }
}
