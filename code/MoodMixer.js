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
            <div class="chalkboard">
                <div class="formula" style="top: 15%; left: 10%;">H₂O + Joy = ?</div>
                <div class="formula" style="top: 40%; left: 80%;">Mix₂</div>
                <div class="formula" style="top: 70%; left: 15%;">Emo + Fusion</div>
            </div>

        <div class="mood-mixer-container">
            <header class="mixer-header" style="position: absolute; top: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; z-index: 100;">
                <button id="btn-mixer-back" class="circle-btn" title="Exit to Menu">
                    <i data-lucide="log-out"></i>
                </button>
                
                <div class="mission-status" style="background: rgba(0,0,0,0.6); padding: 5px 25px; border-radius: 30px; color: white; display: flex; align-items: center; gap: 20px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
                    <div style="text-align: center;">
                        <div style="font-size: 0.6rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">Tries</div>
                        <div id="tries-count" style="font-size: 1.1rem; font-weight: 900; color: #FF4081;">${state.triesLeft}</div>
                    </div>
                    <div style="width: 1px; height: 20px; background: rgba(255,255,255,0.1);"></div>
                    <div style="text-align: center;">
                        <div style="font-size: 0.6rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">Tips</div>
                        <div id="tips-count" style="font-size: 1.1rem; font-weight: 900; color: #FFEB3B;">${state.tipsLeft}</div>
                    </div>
                </div>

                <button id="btn-mixer-tips" class="circle-btn" title="Use a Tip">
                    <i data-lucide="lightbulb"></i>
                </button>
            </header>

            <!-- Mission Clipboard -->
            <div class="mission-clipboard" style="position: absolute; bottom: 160px; left: 40px; background: #fff; padding: 20px; width: 220px; border-radius: 5px 5px 20px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: rotate(-2deg); z-index: 50;">
                <div style="width: 60px; height: 15px; background: #90A4AE; position: absolute; top: -5px; left: 50%; transform: translateX(-50%); border-radius: 3px;"></div>
                <h3 style="color: #263238; margin: 0 0 10px 0; font-size: 0.7rem; text-transform: uppercase; border-bottom: 2px solid #ECEFF1; padding-bottom: 5px;">Research Goal</h3>
                <div id="target-emotion-name" style="color: #D32F2F; font-size: 1.8rem; font-weight: 900; margin: 10px 0;">???</div>
                <p id="target-emotion-desc" style="color: #546E7A; font-size: 0.8rem; line-height: 1.4; margin: 0;">Select elements to begin analysis.</p>
            </div>

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

    </section>`;
}

export function init({ navigate }) {
    document.getElementById('btn-mixer-back').addEventListener('click', () => {
        sounds.click();
        navigate('splash');
    });

    document.getElementById('btn-mixer-tips').addEventListener('click', () => {
        sounds.click();
        showTip();
    });

    document.getElementById('btn-do-fusion').addEventListener('click', performFusion);

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
    initNewGame();
    clearMixer();
    renderDiscoveryGrid();
}

function initNewGame() {
    state.triesLeft = 4;
    state.tipsLeft = 3;
    state.gameStatus = 'playing';
    
    // Pick a random recipe as target
    const randomRecipe = MIXING_RECIPES[Math.floor(Math.random() * MIXING_RECIPES.length)];
    state.targetEmotion = randomRecipe;
    
    // Update UI
    const targetName = document.getElementById('target-emotion-name');
    const targetDesc = document.getElementById('target-emotion-desc');
    const triesCount = document.getElementById('tries-count');
    const tipsCount = document.getElementById('tips-count');
    const tipsBtn = document.getElementById('btn-mixer-tips');
    
    if (targetName) targetName.textContent = randomRecipe.result.name;
    if (targetDesc) targetDesc.textContent = randomRecipe.result.description;
    
    if (triesCount) {
        triesCount.textContent = state.triesLeft;
        triesCount.style.color = '#FF4081';
    }
    
    if (tipsCount) {
        tipsCount.textContent = state.tipsLeft;
        tipsCount.style.color = '#FFEB3B';
    }

    if (tipsBtn) {
        tipsBtn.classList.remove('disabled');
        tipsBtn.disabled = false;
    }
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
        }
        if (tipsCount) tipsCount.style.color = '#9E9E9E';
    }
    
    // Pick one of the two ingredients
    const ingredients = [state.targetEmotion.e1, state.targetEmotion.e2];
    const pickedIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    
    // Find buttons for this ingredient and add highlight
    const bubbles = document.querySelectorAll(`.choice-bubble[data-emotion="${pickedIngredient}"]`);
    bubbles.forEach(b => {
        b.classList.add('tip-highlight');
        setTimeout(() => b.classList.remove('tip-highlight'), 3000);
    });
    
    speakText(`Try using ${pickedIngredient} as one of your elements. You have ${state.tipsLeft} tips left.`);
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

    if (recipe && recipe.result.id === state.targetEmotion.result.id) {
        // SUCCESS!
        sounds.mixSuccess();
        state.gameStatus = 'won';
        state.lastResult = recipe.result;
        
        if (!state.discoveredMixes.find(m => m.id === recipe.result.id)) {
            state.discoveredMixes.push(recipe.result);
            saveDiscoveredMixes(state.discoveredMixes);
        }
        
        setTimeout(() => navigate('success'), 1500);
    } else {
        // WRONG MIX
        state.triesLeft--;
        const triesCount = document.getElementById('tries-count');
        if (triesCount) {
            triesCount.textContent = state.triesLeft;
            if (state.triesLeft <= 1) triesCount.style.color = '#F44336';
        }
        
        if (state.triesLeft <= 0) {
            state.gameStatus = 'lost';
            sounds.mixFail();
            setTimeout(() => navigate('failure'), 1000);
        } else {
            sounds.mixFail();
            // Optional: Show a quick feedback overlay or just clear and let try again
            // For now, let's keep it simple and just clear for another try
            setTimeout(() => {
                clearMixer();
                btn.classList.remove('disabled');
                btn.disabled = false;
            }, 1000);
        }
    }
}

function closeFusionOverlay() {
    // No longer needed but kept for safety or temporary use
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
