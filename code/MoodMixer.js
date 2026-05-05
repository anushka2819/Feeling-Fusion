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

    const bubbleHtml = (slot) => Array(4).fill(0).map((_, i) => `
        <circle class="fluid-bubble" cx="${30 + i * 15}" cy="100" r="${2 + i % 2}" fill="white" opacity="0.4" style="animation-delay: ${i * 0.5}s;" />
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
                <rect id="liquid-${id}" class="liquid-rect" x="0" y="110" width="100" height="0" fill="var(--primary)" opacity="0.7" />
                ${bubbleHtml(id)}
            </g>
        </svg>
    `;

    return /* html */`
    <section id="screen-mood-mixer" class="screen" aria-label="Feeling Fusion Lab">
        <div class="lab-environment">
            <div class="chalkboard">
                <div class="formula" style="top: 15%; left: 10%;">H₂O + Joy = ?</div>
                <div class="formula" style="top: 35%; left: 80%;">NaCl</div>
                <div class="formula" style="top: 65%; left: 15%;">E = mc²</div>
                <div class="formula" style="top: 10%; left: 65%;">C₆H₁₂O₆</div>
            </div>
            <div class="workbench"></div>
        </div>

        <div class="mood-mixer-container">
            <header class="mixer-header" style="position: absolute; top: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between;">
                <button id="btn-mixer-back" class="circle-btn" aria-label="Exit">
                    <i data-lucide="log-out"></i>
                </button>
                <button id="btn-mixer-settings" class="circle-btn" aria-label="Settings">
                    <i data-lucide="settings"></i>
                </button>
            </header>

            <div class="lab-main-area">
                <div class="lab-side-choices side-left">
                    <p class="side-label">ELEMENT A</p>
                    <div class="choice-grid-2x4">
                        ${leftChoicesHtml}
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
                    <div class="choice-grid-2x4">
                        ${rightChoicesHtml}
                    </div>
                </div>
            </div>

            <div id="discovery-shelf" class="discovery-shelf-container"></div>
        </div>

        <div id="fusion-overlay" class="fusion-overlay">
            <div class="fusion-content">
                <div id="fusion-new-character" style="width: 100px; height: 100px; margin: 0 auto 20px;"></div>
                <h2 id="fusion-result-name" style="font-size: 2rem; color: white; margin: 0;">New Discovery!</h2>
                <p id="fusion-recipe-formula" style="color: var(--primary); font-weight: 800; margin: 10px 0;"></p>
                <p id="fusion-result-desc" style="color: rgba(255,255,255,0.7); font-size: 0.9rem;"></p>
                <button id="btn-close-fusion" class="btn-primary" style="margin-top: 20px; width: 100%;">Collect Emotion</button>
            </div>
        </div>
    </section>`;
}

export function init({ navigate }) {
    document.getElementById('btn-mixer-back').addEventListener('click', () => {
        sounds.click();
        navigate('splash');
    });

    document.getElementById('btn-do-fusion').addEventListener('click', performFusion);
    document.getElementById('btn-close-fusion').addEventListener('click', closeFusionOverlay);

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
    if (!label || !liquid) return;
    
    label.textContent = data.name;
    label.style.color = 'white';
    
    liquid.setAttribute('fill', data.color);
    liquid.style.height = '60px'; 
    liquid.style.y = '50';
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

    sounds.mixSuccess();

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
    speakText(`Success! You discovered ${result.name}!`);
}

function closeFusionOverlay() {
    document.getElementById('fusion-overlay').classList.remove('active');
    clearMixer();
    renderDiscoveryGrid();
}

function clearMixer() {
    selectedSlot1 = null;
    selectedSlot2 = null;

    const liq1 = document.getElementById('liquid-1');
    const liq2 = document.getElementById('liquid-2');
    if (liq1) { liq1.style.height = '0'; liq1.style.y = '110'; }
    if (liq2) { liq2.style.height = '0'; liq2.style.y = '110'; }

    document.querySelectorAll('.choice-bubble').forEach(b => {
        b.classList.remove('selected');
        b.classList.remove('disabled');
        b.disabled = false;
    });
    checkCombinations();
}
