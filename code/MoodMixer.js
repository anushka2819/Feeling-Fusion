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
    const basicEmotions = Object.values(EMOTIONS_DATA);
    
    const generateChoiceHtml = (side) => basicEmotions.map((emo) => `
        <button class="choice-bubble choice-${side}" data-emotion="${emo.id}" data-side="${side}" title="${emo.name}" type="button">
            <img src="${emo.icon}" alt="${emo.name}">
        </button>
    `).join('');

    const leftChoicesHtml = generateChoiceHtml('left');
    const rightChoicesHtml = generateChoiceHtml('right');

    return /* html */`
    <section id="screen-mood-mixer" class="screen" aria-label="Feeling Fusion Lab">
        <!-- Lab Environment Background -->
        <div class="lab-environment">
            <div class="chalkboard">
                <div class="formula" style="top: 15%; left: 10%;">H₂O + Joy = ?</div>
                <div class="formula" style="top: 35%; left: 80%;">NaCl</div>
                <div class="formula" style="top: 65%; left: 15%;">E = mc²</div>
                <div class="formula" style="top: 10%; left: 65%;">C₆H₁₂O₆</div>
                <svg class="formula" style="top: 45%; left: 45%; width: 80px; height: 80px;" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="8" stroke="rgba(255,255,255,0.4)" fill="none" stroke-width="2" />
                    <line x1="50" y1="42" x2="50" y1="15" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                    <line x1="50" y1="58" x2="50" y2="85" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                    <line x1="42" y1="50" x2="15" y1="50" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                    <line x1="58" y1="50" x2="85" y2="50" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
                </svg>
            </div>
            <div class="workbench"></div>
        </div>

        <!-- Interactive UI -->
        <div class="mood-mixer-container">
            <header class="mixer-header">
                <button id="btn-mixer-back" class="circle-btn" aria-label="Exit">
                    <i data-lucide="log-out"></i>
                </button>
                <h1 class="side-label" style="color: white; margin: 0; font-size: 1.5rem;">LABORATORY</h1>
                <button id="btn-mixer-settings" class="circle-btn" aria-label="Settings">
                    <i data-lucide="settings"></i>
                </button>
            </header>

            <div class="lab-main-area">
                <!-- Element A Panel -->
                <div class="lab-side-choices side-left">
                    <p class="side-label">ELEMENT A</p>
                    <div class="choice-grid-2x4">
                        ${leftChoicesHtml}
                    </div>
                </div>

                <!-- Central Fusion Chamber -->
                <div class="lab-flask-area">
                    <div class="mixer-slots">
                        <div id="mixer-slot-1-wrap" class="mixer-slot">
                            <div class="flask-visual">
                                <svg viewBox="0 0 100 120" class="beaker-img">
                                    <path d="M40 20 L40 50 L10 110 L90 110 L60 50 L60 20 Z" stroke="white" stroke-width="2" fill="none" />
                                </svg>
                                <div id="flask-liquid-1" class="flask-liquid"></div>
                                <div id="flask-icon-1" class="slot-icon-overlay"></div>
                            </div>
                            <div id="slot-name-1" class="side-label" style="font-size: 0.7rem; margin-top: 10px;">Ingredient 1</div>
                        </div>

                        <span class="plus-symbol">+</span>

                        <div id="mixer-slot-2-wrap" class="mixer-slot">
                            <div class="flask-visual">
                                <svg viewBox="0 0 100 120" class="beaker-img">
                                    <path d="M40 20 L40 50 L10 110 L90 110 L60 50 L60 20 Z" stroke="white" stroke-width="2" fill="none" />
                                </svg>
                                <div id="flask-liquid-2" class="flask-liquid"></div>
                                <div id="flask-icon-2" class="slot-icon-overlay"></div>
                            </div>
                            <div id="slot-name-2" class="side-label" style="font-size: 0.7rem; margin-top: 10px;">Ingredient 2</div>
                        </div>
                    </div>

                    <!-- Hidden Central Reaction Flask -->
                    <div id="reaction-flask-container" class="reaction-container">
                        <div class="reaction-flask">
                            <svg viewBox="0 0 100 120" style="width: 100%; height: 100%;">
                                <path d="M30 10 L30 40 L10 110 L90 110 L70 40 L70 10 Z" stroke="white" stroke-width="3" fill="rgba(255,255,255,0.1)" />
                                <rect id="reaction-liquid" x="15" y="110" width="70" height="0" fill="white" opacity="0.6"></rect>
                            </svg>
                        </div>
                    </div>

                    <div id="blast-effect" class="blast-effect"></div>
                    <div id="smoke-wrap" class="smoke-wrap" style="position: absolute; top: 50%; left: 50%;"></div>

                    <button id="btn-do-fusion" class="btn-primary disabled" disabled>
                        Begin Experiment!
                    </button>
                </div>

                <!-- Element B Panel -->
                <div class="lab-side-choices side-right">
                    <p class="side-label">ELEMENT B</p>
                    <div class="choice-grid-2x4">
                        ${rightChoicesHtml}
                    </div>
                </div>
            </div>

            <!-- Collection Shelf -->
            <div id="discovery-shelf" class="discovery-shelf-container"></div>
        </div>

        <!-- Result Overlay (Moved outside container for better positioning) -->
        <div id="fusion-overlay" class="fusion-overlay">
            <div class="fusion-content">
                <div id="fusion-new-character" style="width: 120px; height: 120px; margin: 0 auto 20px;"></div>
                <h2 id="fusion-result-name" class="splash-title" style="font-size: 2.2rem; color: white;">New Discovery!</h2>
                <p id="fusion-recipe-formula" style="color: var(--primary); font-weight: 800; margin: 10px 0;"></p>
                <p id="fusion-result-desc" style="color: rgba(255,255,255,0.7); line-height: 1.6;"></p>
                <button id="btn-close-fusion" class="btn-primary" style="margin-top: 30px; width: 100%;">Collect Emotion</button>
            </div>
        </div>
    </section>`;
}

export function init({ navigate }) {
    const backBtn = document.getElementById('btn-mixer-back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            sounds.click();
            navigate('splash');
        });
    }

    const fuseBtn = document.getElementById('btn-do-fusion');
    if (fuseBtn) fuseBtn.addEventListener('click', performFusion);

    const closeBtn = document.getElementById('btn-close-fusion');
    if (closeBtn) closeBtn.addEventListener('click', closeFusionOverlay);

    initChoiceListeners();
}

function initChoiceListeners() {
    const choices = document.querySelectorAll('.choice-bubble');
    choices.forEach(btn => {
        btn.addEventListener('click', () => {
            const emoId = btn.dataset.emotion;
            const side = btn.dataset.side;
            const emotionData = EMOTIONS_DATA[emoId];

            if (side === 'left') {
                selectedSlot1 = emotionData;
                updateSlotUI(1, emotionData);
            } else {
                selectedSlot2 = emotionData;
                updateSlotUI(2, emotionData);
            }

            // Highlighting
            document.querySelectorAll(`.choice-${side}`).forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            checkCombinations();
        });
    });
}

export function onShow() {
    clearMixer();
    renderDiscoveryGrid();
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
            slot.innerHTML = `<img src="${discovered.icon}" style="width: 50px; height: 50px;" alt="${discovered.name}">`;
        } else {
            slot.innerHTML = '<i data-lucide="help-circle" style="color: rgba(255,255,255,0.1);"></i>';
        }
        grid.appendChild(slot);
    }
    if (window.lucide) window.lucide.createIcons();
}

function updateSlotUI(slotNum, data) {
    const iconOverlay = document.getElementById(`flask-icon-${slotNum}`);
    const label = document.getElementById(`slot-name-${slotNum}`);
    const liquid = document.getElementById(`flask-liquid-${slotNum}`);
    if (!iconOverlay || !label || !liquid) return;
    
    iconOverlay.innerHTML = `<img src="${data.icon}" alt="${data.name}" style="width: 100%; height: 100%; animation: popIn 0.3s forwards;">`;
    label.textContent = data.name;
    label.style.color = 'white';
    
    // Fill liquid
    liquid.style.backgroundColor = data.color;
    liquid.style.height = '60%';
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

    // 1. Tilt flasks
    const s1 = document.getElementById('mixer-slot-1-wrap');
    const s2 = document.getElementById('mixer-slot-2-wrap');
    s1.classList.add('pouring-left');
    s2.classList.add('pouring-right');
    
    sounds.pour();

    // 2. Drain liquid
    document.getElementById('flask-liquid-1').style.height = '0%';
    document.getElementById('flask-liquid-2').style.height = '0%';

    // 3. Show reaction flask and blast
    setTimeout(() => {
        const reactionContainer = document.getElementById('reaction-flask-container');
        reactionContainer.classList.add('active');
        const blast = document.getElementById('blast-effect');
        blast.classList.add('active');
        createSmoke();
        sounds.mixSuccess();
    }, 1000);

    // 4. Show result
    setTimeout(() => {
        if (recipe) {
            const result = recipe.result;
            showFusionResult(result);
            if (!state.discoveredMixes.find(m => m.id === result.id)) {
                state.discoveredMixes.push(result);
                saveDiscoveredMixes(state.discoveredMixes);
            }
        } else {
            showFusionResult({
                id: 'unknown',
                name: 'Unknown Reaction',
                description: 'This combination produced a volatile but unidentified emotion.',
                icon: 'assets/feeling_fusion/surprise_select.svg',
                color: '#9E9E9E'
            });
        }
    }, 1800);
}

function createSmoke() {
    const wrap = document.getElementById('smoke-wrap');
    for (let i = 0; i < 12; i++) {
        const s = document.createElement('div');
        s.className = 'smoke active';
        const size = 20 + Math.random() * 60;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.left = `${(Math.random() - 0.5) * 80}px`;
        s.style.animationDelay = `${Math.random() * 0.4}s`;
        wrap.appendChild(s);
        setTimeout(() => s.remove(), 2000);
    }
}

function showFusionResult(result) {
    const overlay = document.getElementById('fusion-overlay');
    const nameEl = document.getElementById('fusion-result-name');
    const descEl = document.getElementById('fusion-result-desc');
    const characterEl = document.getElementById('fusion-new-character');
    const formulaEl = document.getElementById('fusion-recipe-formula');

    nameEl.textContent = result.name;
    descEl.textContent = result.description;
    characterEl.innerHTML = `<img src="${result.icon}" style="width: 100%; height: 100%; animation: popIn 0.5s;">`;
    formulaEl.textContent = `${selectedSlot1.name} + ${selectedSlot2.name}`;
    
    overlay.classList.add('active');
    speakText(`Eureka! You discovered ${result.name}!`);
}

function closeFusionOverlay() {
    document.getElementById('fusion-overlay').classList.remove('active');
    document.getElementById('reaction-flask-container').classList.remove('active');
    document.getElementById('blast-effect').classList.remove('active');
    
    const s1 = document.getElementById('mixer-slot-1-wrap');
    const s2 = document.getElementById('mixer-slot-2-wrap');
    s1.classList.remove('pouring-left');
    s2.classList.remove('pouring-right');

    clearMixer();
    renderDiscoveryGrid();
}

function clearMixer() {
    selectedSlot1 = null;
    selectedSlot2 = null;
    
    const icon1 = document.getElementById('flask-icon-1');
    const label1 = document.getElementById('slot-name-1');
    const liq1 = document.getElementById('flask-liquid-1');
    if (icon1) icon1.innerHTML = '';
    if (label1) label1.textContent = 'Ingredient 1';
    if (liq1) liq1.style.height = '0%';

    const icon2 = document.getElementById('flask-icon-2');
    const label2 = document.getElementById('slot-name-2');
    const liq2 = document.getElementById('flask-liquid-2');
    if (icon2) icon2.innerHTML = '';
    if (label2) label2.textContent = 'Ingredient 2';
    if (liq2) liq2.style.height = '0%';

    document.querySelectorAll('.choice-bubble').forEach(b => {
        b.classList.remove('selected');
    });

    checkCombinations();
}
