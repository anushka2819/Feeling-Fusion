/**
 * code/MoodMixer.js — The Feeling Fusion Lab
 */
import { state } from './gameState.js';
import { sounds } from './utils/sounds.js';
import { EMOTIONS_DATA } from './gameData.js';
import { MIXING_RECIPES } from './moodMixerData.js';
import { speakText } from './utils/accessibility.js';
import { saveDiscoveredMixes } from './utils/storage.js';

let selectedSlot1 = null;
let selectedSlot2 = null;

export function template() {
    const bubbleHtml = () => Array(5).fill(0).map((_, i) => `
        <circle class="fluid-bubble" cx="${20 + Math.random() * 60}" cy="120" r="${1.5 + Math.random() * 2}" fill="white" opacity="0.6" style="animation-delay: ${Math.random() * 3}s; animation-duration: ${2 + Math.random() * 2}s;" />
    `).join('');

    const beakerSvg = (id) => `
        <svg viewBox="0 0 100 120" class="beaker-svg">
            <defs>
                <clipPath id="clip-flask-${id}">
                    <path d="M40 20 L40 50 L10 110 L90 110 L60 50 L60 20 Z" />
                </clipPath>
            </defs>
            <path d="M40 20 L40 50 L10 110 L90 110 L60 50 L60 20 Z" stroke="white" stroke-width="2" fill="none" />
            <g clip-path="url(#clip-flask-${id})">
                <rect id="liquid-${id}" class="liquid-rect" x="0" y="110" width="100" height="0" fill="var(--primary)" />
                <g class="bubble-group">
                    ${bubbleHtml()}
                </g>
            </g>
        </svg>
    `;

    return /* html */`
    <section id="screen-mood-mixer" class="screen" aria-label="Feeling Fusion Lab">

        <div class="mood-mixer-container">
            <header class="mixer-header" style="position: absolute; top: 15px; left: 20px; right: 20px; display: flex; justify-content: space-between; z-index: 100; align-items: center; gap: 15px;">
                <button id="btn-mixer-back" class="circle-btn" title="Exit to Menu">
                    <i data-lucide="log-out"></i>
                </button>
                
                <!-- Center: Mission & Level Display -->
                <div class="mission-header" style="flex: 1; display: flex; flex-direction: column; align-items: center; position: relative;">
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 2px;">
                        <span id="lab-level-badge" style="background: #FF5722; color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 900; letter-spacing: 1px;">LEVEL ${state.labLevel || 1}</span>
                        <span id="lab-streak-badge" style="background: #FF8F00; color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 900; display: ${state.winStreak > 0 ? 'inline-block' : 'none'};">🔥 STREAK: ${state.winStreak || 0}</span>
                    </div>
                    <div id="target-emotion-name" style="font-size: 1.4rem; font-weight: 800; color: #FFEB3B; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">???</div>
                </div>

                <div class="status-actions" style="display: flex; align-items: center; gap: 8px;">
                    <div class="mission-status" style="background: rgba(0,0,0,0.6); padding: 5px 10px; border-radius: 12px; color: white; display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.1);">
                        <div id="tries-count" style="font-size: 1.1rem; letter-spacing: 2px;">${'❤️'.repeat(state.triesLeft)}</div>
                    </div>

                    <button id="btn-mixer-filter" class="circle-btn" title="50/50 Eraser: Remove Wrong Elements" style="position: relative; background: #8E24AA;">
                        <i data-lucide="filter"></i>
                        <div id="filter-count" class="hint-badge" style="background: #E1BEE7; color: #4A148C !important;">${state.filterCount || 1}</div>
                    </button>

                    <button id="btn-mixer-note" class="circle-btn" title="Read Lab Notes">
                        <i data-lucide="notebook-text"></i>
                    </button>

                    <button id="btn-mixer-help" class="circle-btn" title="How to Play Manual" style="background: #0288D1;">
                        <i data-lucide="help-circle"></i>
                    </button>

                    <button id="btn-mixer-tips" class="circle-btn" title="Use a Tip" style="position: relative;">
                        <i data-lucide="lightbulb"></i>
                        <div id="tips-count" class="hint-badge">${state.tipsLeft}</div>
                    </button>
                </div>
            </header>

            <!-- Lab Note Overlay -->
            <div id="note-overlay" class="note-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);">
                <div class="notebook-page" style="background: #FFF9C4; width: 90%; max-width: 400px; padding: 40px; border-radius: 2px 20px 2px 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: relative; font-family: 'Outfit', sans-serif;">
                    <div style="position: absolute; top: 0; left: 40px; bottom: 0; width: 2px; background: #FFAB91;"></div>
                    <button id="btn-close-note" class="circle-btn" style="position: absolute; top: 15px; right: 15px; background: #ef5350; color: white;">
                        <i data-lucide="x"></i>
                    </button>
                    
                    <h2 style="color: #5D4037; border-bottom: 2px dashed #BCAAA4; padding-bottom: 10px; margin-bottom: 20px; font-size: 1.2rem; text-transform: uppercase;">Lab Notebook</h2>
                    <p style="color: #795548; font-size: 0.9rem; line-height: 1.8; margin: 0;">
                        <strong>Observation:</strong><br>
                        <span id="emotion-scenario"></span>
                    </p>
                </div>
            </div>

            <div class="lab-main-area">
                <div class="lab-side-choices side-left">
                    <p class="side-label">ELEMENT A</p>
                    <div id="left-choices-grid" class="choice-grid-2x4">
                        <!-- Populated by JS -->
                    </div>
                </div>

                <div class="lab-flask-area">
                    <div class="mixer-slots">
                        <div id="mixer-slot-1-wrap" class="mixer-slot">
                            <div class="flask-visual">${beakerSvg(1)}</div>
                            <div id="slot-name-1" class="side-label" style="font-size: 0.7rem; margin-top: 10px; color: #78909C;">Ingredient 1</div>
                        </div>

                        <span class="plus-symbol">+</span>

                        <div id="mixer-slot-2-wrap" class="mixer-slot">
                            <div class="flask-visual">${beakerSvg(2)}</div>
                            <div id="slot-name-2" class="side-label" style="font-size: 0.7rem; margin-top: 10px; color: #78909C;">Ingredient 2</div>
                        </div>
                    </div>

                    <button id="btn-do-fusion" class="btn-primary disabled" disabled>
                        Begin Experiment!
                    </button>
                </div>

                <div class="lab-side-choices side-right">
                    <p class="side-label">ELEMENT B</p>
                    <div id="right-choices-grid" class="choice-grid-2x4">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>

            <div id="discovery-shelf" class="discovery-shelf-container"></div>
        </div>

        <!-- Lab Mixer Fullscreen Manual Modal -->
        <div id="manual-modal-lab-ingame" class="manual-modal" style="display:none;">
            <div class="manual-card manual-card-fullscreen" style="background: linear-gradient(135deg, #0D47A1 0%, #004D40 50%, #00251a 100%); color: white; position: relative;">
                <div style="max-width: 1100px; width: 100%; margin: 0 auto;">
                    <button id="btn-close-lab-help" class="circle-btn" style="position: absolute; top: 25px; right: 25px; background: #FF1744; color: white; border: none; cursor: pointer; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 10;">
                        <i data-lucide="x" style="width: 28px; height: 28px;"></i>
                    </button>

                    <h2 style="color: #FFEB3B; font-weight: 900; margin-top: 0; display: flex; align-items: center; gap: 15px; font-size: 2.5rem; border-bottom: 3px dashed rgba(255,255,255,0.25); padding-bottom: 15px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                        <i data-lucide="flask-conical" style="width: 40px; height: 40px; color: #00E676;"></i> LAB MIXER — GAME MANUAL
                    </h2>

                    <!-- Visual Cards Grid -->
                    <div class="manual-grid">
                        <div class="manual-item-card" style="border-left: 5px solid #42A5F5;">
                            <div class="manual-item-icon" style="background: #1976D2;">🎯</div>
                            <div class="manual-item-title">Synthesis Mission</div>
                            <div class="manual-item-desc">
                                Read your Target Emotion task! Select 1 element from Element A and 1 element from Element B to fuse them in the lab beakers.
                            </div>
                        </div>

                        <div class="manual-item-card" style="border-left: 5px solid #FF1744;">
                            <div class="manual-item-icon" style="background: #D50000;">❤️</div>
                            <div class="manual-item-title">Hearts & Tries System</div>
                            <div class="manual-item-desc">
                                You have <strong>4 Hearts (❤️ ❤️ ❤️ ❤️)</strong>. Every wrong combination deducts 1 Heart. Running out of hearts causes a Volatile Failure!
                            </div>
                        </div>

                        <div class="manual-item-card" style="border-left: 5px solid #AB47BC;">
                            <div class="manual-item-icon" style="background: #8E24AA;">🔀</div>
                            <div class="manual-item-title">Level Ups & Shuffling</div>
                            <div class="manual-item-desc">
                                Every completed mission levels you up! Choice bubbles **shuffle positions** every new level & attempt for fresh challenges.
                            </div>
                        </div>

                        <div class="manual-item-card" style="border-left: 5px solid #FFB300;">
                            <div class="manual-item-icon" style="background: #FF8F00;">⚡</div>
                            <div class="manual-item-title">Scientific Tools & Boosters</div>
                            <div class="manual-item-desc">
                                Use ⚡ <strong>50/50 Filter</strong> to remove 50% of wrong choices, 💡 <strong>Scientific Tip</strong> for ingredient hints, and 📓 <strong>Notebook</strong> for recipe clues!
                            </div>
                        </div>
                    </div>
                </div>

                <div style="max-width: 500px; width: 100%; margin: 15px auto 5px;">
                    <button id="btn-resume-lab" class="btn-primary" style="width: 100%; font-size: 1.5rem; padding: 16px; background: linear-gradient(180deg, #42A5F5, #1E88E5); border: 4px solid #FFF; border-radius: 50px; cursor: pointer; color: #FFF; font-weight: 900; justify-content: center; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(30,136,229,0.6);">
                        <i data-lucide="flask-conical" style="width: 28px; height: 28px;"></i> RESUME EXPERIMENT
                    </button>
                </div>
            </div>
        </div>

    </section>
        <div id="fusion-overlay" class="fusion-overlay">
            <div class="fusion-content">
                <div id="fusion-icon-container" style="width: 120px; height: 120px; margin: 0 auto 20px; background: #37474F; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid #546E7A; box-shadow: inset 0 5px 10px rgba(0,0,0,0.5);">
                    <div id="fusion-result-icon" style="width: 80px; height: 80px;"></div>
                </div>
                <h3 id="fusion-result-status" style="margin: 0; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 2px; color: #00E676; font-weight: 800;">Analysis Result</h3>
                <h2 id="fusion-result-name" style="font-size: 3rem; color: #FF5722; margin: 5px 0 15px 0; font-weight: 900; text-shadow: 0 4px 0 #D84315;">Discovery!</h2>
                <p id="fusion-result-desc" style="color: #ECEFF1; font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px; font-weight: 600;"></p>
                <button id="btn-close-fusion" class="btn-primary" style="width: 100%; justify-content: center;">CONTINUE</button>
            </div>
        </div>

    </section>`;
}

let localNavigate = null;

export function init({ navigate }) {
    localNavigate = navigate;
    document.getElementById('btn-mixer-back').addEventListener('click', () => {
        sounds.click();
        localNavigate('splash');
    });

    document.getElementById('btn-mixer-tips').addEventListener('click', () => {
        sounds.click();
        showTip();
    });

    document.getElementById('btn-mixer-filter').addEventListener('click', () => {
        sounds.click();
        use5050Filter();
    });

    document.getElementById('btn-mixer-note').addEventListener('click', () => {
        sounds.click();
        showNote();
    });

    const labHelpModal = document.getElementById('manual-modal-lab-ingame');
    document.getElementById('btn-mixer-help')?.addEventListener('click', () => {
        sounds.click();
        if (labHelpModal) labHelpModal.style.display = 'flex';
        if (window.lucide) window.lucide.createIcons();
    });
    document.getElementById('btn-close-lab-help')?.addEventListener('click', () => {
        sounds.click();
        if (labHelpModal) labHelpModal.style.display = 'none';
    });
    document.getElementById('btn-resume-lab')?.addEventListener('click', () => {
        sounds.click();
        if (labHelpModal) labHelpModal.style.display = 'none';
    });

    document.getElementById('btn-close-note').addEventListener('click', () => {
        sounds.click();
        closeNote();
    });

    document.getElementById('btn-close-fusion').addEventListener('click', () => {
        sounds.click();
        closeFusionResult();
    });

    document.getElementById('btn-do-fusion').addEventListener('click', performFusion);
}

function renderChoices() {
    const basicEmotions = Object.values(EMOTIONS_DATA);
    const availableEmotions = [...basicEmotions, ...state.discoveredMixes];

    const uniqueEmotions = [];
    const seen = new Set();
    for (const e of availableEmotions) {
        if (!seen.has(e.id)) {
            uniqueEmotions.push(e);
            seen.add(e.id);
        }
    }

    // Shuffle choice placement for left and right grids
    const leftEmotions = [...uniqueEmotions].sort(() => Math.random() - 0.5);
    const rightEmotions = [...uniqueEmotions].sort(() => Math.random() - 0.5);

    const generateChoiceHtml = (side, emoList) => emoList.map((emo) => `
        <button class="choice-bubble choice-${side}" data-emotion="${emo.id}" data-side="${side}" title="${emo.name}" type="button">
            <img src="${emo.icon}" alt="${emo.name}">
            <span class="choice-name">${emo.name}</span>
        </button>
    `).join('');

    document.getElementById('left-choices-grid').innerHTML = generateChoiceHtml('left', leftEmotions);
    document.getElementById('right-choices-grid').innerHTML = generateChoiceHtml('right', rightEmotions);

    initChoiceListeners();
    updateDisabledStates();
}

function initChoiceListeners() {
    const choices = document.querySelectorAll('.choice-bubble');
    choices.forEach(btn => {
        btn.addEventListener('click', () => {
            const emoId = btn.dataset.emotion;
            const side = btn.dataset.side;
            const emotionData = EMOTIONS_DATA[emoId] || state.discoveredMixes.find(m => m.id === emoId);

            if (side === 'left') {
                selectedSlot1 = emotionData;
                updateSlotUI(1, selectedSlot1);
            } else {
                selectedSlot2 = emotionData;
                updateSlotUI(2, selectedSlot2);
            }

            document.querySelectorAll(`.choice-${side}`).forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            updateDisabledStates();
            checkCombinations();
        });
    });
}

function updateDisabledStates() {
    const choices = document.querySelectorAll('.choice-bubble');
    choices.forEach(btn => {
        const emoId = btn.dataset.emotion;
        const side = btn.dataset.side;
        if (!btn.classList.contains('filtered-out')) {
            btn.classList.remove('disabled');
            btn.disabled = false;
            if (side === 'right' && selectedSlot1 && emoId === selectedSlot1.id) {
                btn.classList.add('disabled');
                btn.disabled = true;
            }
            if (side === 'left' && selectedSlot2 && emoId === selectedSlot2.id) {
                btn.classList.add('disabled');
                btn.disabled = true;
            }
        }
    });
}

export function onShow() {
    initNewGame();
    renderChoices();
    clearMixer();
    renderDiscoveryGrid();
}

function initNewGame() {
    // Scaling toughness by labLevel
    const lvl = state.labLevel || 1;
    state.triesLeft = lvl >= 6 ? 2 : (lvl >= 3 ? 3 : 4);
    state.tipsLeft = 1;
    state.filterCount = state.filterCount ?? 1;
    state.gameStatus = 'playing';

    const undiscovered = MIXING_RECIPES.filter(r => !state.discoveredMixes.find(m => m.id === r.result.id));

    let pool = undiscovered.length > 0 ? undiscovered : MIXING_RECIPES;
    if (pool.length > 1 && state.targetEmotion) {
        const currentTargetId = state.targetEmotion.result.id;
        const filtered = pool.filter(r => r.result.id !== currentTargetId);
        if (filtered.length > 0) pool = filtered;
    }

    state.targetEmotion = pool[Math.floor(Math.random() * pool.length)];

    const targetName = document.getElementById('target-emotion-name');
    const triesCount = document.getElementById('tries-count');
    const tipsCount = document.getElementById('tips-count');
    const filterCount = document.getElementById('filter-count');
    const levelBadge = document.getElementById('lab-level-badge');
    const streakBadge = document.getElementById('lab-streak-badge');

    if (levelBadge) levelBadge.textContent = `LEVEL ${lvl}`;
    if (streakBadge) {
        streakBadge.textContent = `🔥 STREAK: ${state.winStreak || 0}`;
        streakBadge.style.display = (state.winStreak || 0) > 0 ? 'inline-block' : 'none';
    }

    if (targetName) targetName.textContent = state.targetEmotion.result.name;

    if (triesCount) {
        triesCount.innerHTML = '❤️'.repeat(Math.max(0, state.triesLeft));
    }

    if (tipsCount) {
        tipsCount.textContent = state.tipsLeft;
        tipsCount.style.display = 'flex';
    }

    if (filterCount) {
        filterCount.textContent = state.filterCount;
    }
}

function use5050Filter() {
    if (!state.targetEmotion || (state.filterCount || 0) <= 0) return;
    state.filterCount--;
    const filterCount = document.getElementById('filter-count');
    if (filterCount) filterCount.textContent = state.filterCount;

    const correctE1 = state.targetEmotion.e1;
    const correctE2 = state.targetEmotion.e2;

    // Filter left wrong choices
    const leftWrong = Array.from(document.querySelectorAll('.choice-left')).filter(b => b.dataset.emotion !== correctE1 && b.dataset.emotion !== correctE2);
    leftWrong.sort(() => Math.random() - 0.5).slice(0, Math.ceil(leftWrong.length / 2)).forEach(b => {
        b.classList.add('disabled', 'filtered-out');
        b.disabled = true;
        b.style.opacity = '0.2';
    });

    // Filter right wrong choices
    const rightWrong = Array.from(document.querySelectorAll('.choice-right')).filter(b => b.dataset.emotion !== correctE1 && b.dataset.emotion !== correctE2);
    rightWrong.sort(() => Math.random() - 0.5).slice(0, Math.ceil(rightWrong.length / 2)).forEach(b => {
        b.classList.add('disabled', 'filtered-out');
        b.disabled = true;
        b.style.opacity = '0.2';
    });

    sounds.mixSuccess();
    speakText("50/50 Filter activated! Half of the incorrect choices were eliminated.");
}

function showTip() {
    if (!state.targetEmotion || state.tipsLeft <= 0) return;

    state.tipsLeft--;
    const tipsCount = document.getElementById('tips-count');
    const tipsBtn = document.getElementById('btn-mixer-tips');

    if (tipsCount) tipsCount.textContent = state.tipsLeft;
    if (state.tipsLeft <= 0) {
        if (tipsBtn) {
            tipsBtn.classList.add('disabled');
            tipsBtn.disabled = true;
            tipsBtn.style.opacity = '0.5';
        }
        if (tipsCount) tipsCount.style.display = 'none';
    }

    const ingredients = [state.targetEmotion.e1, state.targetEmotion.e2];
    const pickedIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];

    const bubbles = document.querySelectorAll(`.choice-bubble[data-emotion="${pickedIngredient}"]`);
    bubbles.forEach(b => {
        b.classList.add('tip-highlight');
        setTimeout(() => b.classList.remove('tip-highlight'), 3000);
    });

    const emoData = EMOTIONS_DATA[pickedIngredient] || state.discoveredMixes.find(m => m.id === pickedIngredient) || { name: pickedIngredient };
    speakText(`Try using ${emoData.name} as one of your elements. You have ${state.tipsLeft} tips left.`);
}

function closeNote() {
    document.getElementById('note-overlay').style.display = 'none';
}

function showNote() {
    if (!state.targetEmotion) return;
    const overlay = document.getElementById('note-overlay');
    const scenarioEl = document.getElementById('emotion-scenario');

    const EMOTION_HINTS = {
        'joy': 'the element of a bright, sunny smile',
        'trust': 'the feeling of being safe with a best friend',
        'fear': 'the shaky feeling in the dark',
        'surprise': 'the "Oh!" moment of unexpected things',
        'sadness': 'the heavy feeling of a rainy afternoon',
        'disgust': 'the "Yuck!" feeling of something gross',
        'anger': 'the hot, fiery feeling of being mad',
        'anticipation': 'the glow of waiting for something exciting'
    };

    function getHint(emotionId) {
        if (EMOTION_HINTS[emotionId]) return EMOTION_HINTS[emotionId];
        const data = EMOTIONS_DATA[emotionId] || state.discoveredMixes.find(m => m.id === emotionId);
        if (data) return `the essence of ${data.name.toLowerCase()}`;
        return `the mystery element`;
    }

    const hint1 = getHint(state.targetEmotion.e1);
    const hint2 = getHint(state.targetEmotion.e2);

    scenarioEl.innerHTML = `
        <div style="margin-bottom: 20px;">${state.targetEmotion.result.description}</div>
        <div style="background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px; border-left: 4px solid #FFAB91;">
            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #795548; font-weight: 900; margin-bottom: 5px;">Scientific Hint:</div>
            <div style="font-size: 0.9rem; color: #5D4037; font-style: italic;">"Seek the combination of <b>${hint1}</b> and <b>${hint2}</b>..."</div>
        </div>
    `;

    overlay.style.display = 'flex';
    speakText(state.targetEmotion.result.description + `. Hint: seek the combination of ${hint1} and ${hint2}`);
}

function renderDiscoveryGrid() {
    const grid = document.getElementById('discovery-shelf');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        const discovered = state.discoveredMixes[i];
        const slot = document.createElement('div');
        slot.className = discovered ? 'discovery-slot unlocked' : 'discovery-slot locked';

        if (discovered) {
            slot.style.setProperty('--slot-color', discovered.color);
            slot.innerHTML = `<img src="${discovered.icon}" style="width: 45px; height: 45px;" alt="${discovered.name}">`;
        } else {
            slot.innerHTML = '<i data-lucide="help-circle" style="color: rgba(255,255,255,0.1);"></i>';
        }
        grid.appendChild(slot);
    }
    if (window.lucide) window.lucide.createIcons();
}

function updateSlotUI(slotNum, data) {
    const label = document.getElementById(`slot-name-${slotNum}`);
    const liquid = document.getElementById(`liquid-${slotNum}`);
    const beaker = liquid ? liquid.closest('.beaker-svg') : null;
    if (!label || !liquid) return;

    label.textContent = data.name;
    label.style.color = 'white';

    liquid.style.fill = data.color;
    liquid.style.height = '60px';
    liquid.style.y = '50';
    if (beaker) beaker.classList.add('animating');
    sounds.pour();
}

function checkCombinations() {
    const btn = document.getElementById('btn-do-fusion');
    if (!btn) return;
    if (selectedSlot1 && selectedSlot2) {
        btn.classList.remove('disabled');
        btn.disabled = false;
    } else {
        btn.classList.add('disabled');
        btn.disabled = true;
    }
}

async function performFusion() {
    if (!selectedSlot1 || !selectedSlot2) return;

    const recipe = MIXING_RECIPES.find(r =>
        (r.e1 === selectedSlot1.id && r.e2 === selectedSlot2.id) ||
        (r.e1 === selectedSlot2.id && r.e2 === selectedSlot1.id)
    );

    const btn = document.getElementById('btn-do-fusion');
    btn.classList.add('disabled');
    btn.disabled = true;

    if (recipe) {
        const isTarget = recipe.result.id === state.targetEmotion.result.id;
        state.lastResult = recipe.result;

        if (!state.discoveredMixes.find(m => m.id === recipe.result.id)) {
            state.discoveredMixes.push(recipe.result);
            saveDiscoveredMixes(state.discoveredMixes);
            renderChoices();
        }

        if (isTarget) {
            sounds.mixSuccess();
            state.gameStatus = 'won';
            state.labLevel = (state.labLevel || 1) + 1;
            state.winStreak = (state.winStreak || 0) + 1;
            state.filterCount = 1; // Replenish filter charge on level up
            showFusionResult(recipe.result, true);
        } else {
            sounds.mixFail();
            state.triesLeft--;
            updateTriesUI();

            if (state.triesLeft <= 0) {
                state.gameStatus = 'lost';
                state.winStreak = 0; // Reset streak on loss
                showFusionResult(recipe.result, false, true);
            } else {
                showFusionResult(recipe.result, false, false);
            }
        }
    } else {
        sounds.mixFail();
        state.triesLeft--;
        updateTriesUI();

        const unknownResult = {
            name: 'Unstable Reaction',
            description: 'These elements do not fuse together. Try a different combination!',
            icon: 'assets/results/confusion.svg',
            color: '#90A4AE'
        };

        if (state.triesLeft <= 0) {
            state.gameStatus = 'lost';
            state.winStreak = 0;
            showFusionResult(unknownResult, false, true);
        } else {
            showFusionResult(unknownResult, false, false);
        }
    }
}

function updateTriesUI() {
    const triesCount = document.getElementById('tries-count');
    if (triesCount) {
        triesCount.innerHTML = '❤️'.repeat(Math.max(0, state.triesLeft));
    }
}

function showFusionResult(resultData, isSuccess, isGameOver = false) {
    const overlay = document.getElementById('fusion-overlay');
    const statusEl = document.getElementById('fusion-result-status');
    const nameEl = document.getElementById('fusion-result-name');
    const descEl = document.getElementById('fusion-result-desc');
    const iconEl = document.getElementById('fusion-result-icon');
    const closeBtn = document.getElementById('btn-close-fusion');

    overlay.classList.remove('shake-error');

    statusEl.textContent = isSuccess ? `🎉 LEVEL ${state.labLevel - 1} COMPLETE!` : (isGameOver ? 'Final Analysis' : 'Incorrect Mix');
    statusEl.style.color = isSuccess ? '#4CAF50' : '#FF5252';

    nameEl.textContent = resultData.name;
    descEl.textContent = isSuccess ? `${resultData.description}\n\n🔥 Level ${state.labLevel} Unlocked! Choice positions shuffled!` : resultData.description;
    iconEl.innerHTML = `<img src="${resultData.icon || 'assets/results/confusion.svg'}" style="width: 100%; height: 100%; animation: popIn 0.5s;">`;

    closeBtn.textContent = isSuccess ? `ADVANCE TO LEVEL ${state.labLevel}` : (isGameOver ? 'VIEW LAB REPORT' : 'TRY ANOTHER MIX');

    if (window.lucide) window.lucide.createIcons();
    overlay.classList.add('active');

    if (isSuccess && window.confetti) {
        window.confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#4FC3F7', '#FF4081', '#FFFFFF']
        });
        speakText(`Success! You completed the mission and unlocked Level ${state.labLevel}!`);
    } else if (!isSuccess) {
        overlay.classList.add('shake-error');
        speakText(`That's not ${state.targetEmotion.result.name}. You created ${resultData.name}. You have ${state.triesLeft} tries left.`);
    }
}

function closeFusionResult() {
    const overlay = document.getElementById('fusion-overlay');
    overlay.classList.remove('active');

    if (state.gameStatus === 'won') {
        initNewGame();
        renderChoices();
        clearMixer();
        renderDiscoveryGrid();
    } else if (state.gameStatus === 'lost') {
        localNavigate('failure');
    } else {
        clearMixer();
        renderDiscoveryGrid();
    }
}

function clearMixer() {
    selectedSlot1 = null;
    selectedSlot2 = null;

    const name1 = document.getElementById('slot-name-1');
    const name2 = document.getElementById('slot-name-2');
    if (name1) {
        name1.textContent = 'Ingredient 1';
        name1.style.color = '#78909C';
    }
    if (name2) {
        name2.textContent = 'Ingredient 2';
        name2.style.color = '#78909C';
    }

    const liq1 = document.getElementById('liquid-1');
    const liq2 = document.getElementById('liquid-2');
    if (liq1) {
        liq1.style.height = '0'; liq1.style.y = '110';
        if (liq1.closest('.beaker-svg')) liq1.closest('.beaker-svg').classList.remove('animating');
    }
    if (liq2) {
        liq2.style.height = '0'; liq2.style.y = '110';
        if (liq2.closest('.beaker-svg')) liq2.closest('.beaker-svg').classList.remove('animating');
    }

    document.querySelectorAll('.choice-bubble').forEach(b => {
        b.classList.remove('selected', 'disabled', 'filtered-out');
        b.disabled = false;
        b.style.opacity = '1';
    });
    checkCombinations();
}
