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
                <div id="mission-board" style="position: absolute; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; box-sizing: border-box;">
                    <h2 style="color: var(--primary); margin: 0; font-size: 1.2rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 2px;">Target Emotion</h2>
                    <h1 id="target-emotion-name" style="color: white; margin: 10px 0; font-size: 3.5rem; text-shadow: 0 0 20px rgba(255,255,255,0.2);">???</h1>
                    <p id="target-emotion-desc" style="color: var(--chalk); font-size: 1rem; max-width: 400px; margin: 0;">Use your scientific skills to find the right combination!</p>
                </div>
            </div>

        <div class="mood-mixer-container">
            <header class="mixer-header" style="position: absolute; top: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; z-index: 100;">
                <button id="btn-mixer-back" class="circle-btn" title="Exit to Menu">
                    <i data-lucide="log-out"></i>
                </button>
                
                <div class="mission-status" style="background: rgba(0,0,0,0.4); padding: 10px 20px; border-radius: 20px; color: white; display: flex; align-items: center; gap: 15px; backdrop-filter: blur(5px);">
                    <div style="text-align: right;">
                        <div style="font-size: 0.7rem; opacity: 0.7; text-transform: uppercase;">Tries Left</div>
                        <div id="tries-count" style="font-size: 1.2rem; font-weight: 900; color: #FF4081;">${state.triesLeft}</div>
                    </div>
                </div>

                <button id="btn-mixer-tips" class="circle-btn" title="Get a Tip">
                    <i data-lucide="lightbulb"></i>
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

    document.getElementById('btn-mixer-tips').addEventListener('click', () => {
        sounds.click();
        showTip();
    });

    document.getElementById('btn-do-fusion').addEventListener('click', performFusion);
    document.getElementById('btn-close-fusion').addEventListener('click', () => {
        if (state.gameStatus === 'playing') {
            closeFusionOverlay();
        } else {
            // Restart or back to splash if game ended
            navigate('splash');
        }
    });

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
    state.gameStatus = 'playing';
    
    // Pick a random recipe as target
    const randomRecipe = MIXING_RECIPES[Math.floor(Math.random() * MIXING_RECIPES.length)];
    state.targetEmotion = randomRecipe;
    
    // Update UI
    const targetName = document.getElementById('target-emotion-name');
    const targetDesc = document.getElementById('target-emotion-desc');
    const triesCount = document.getElementById('tries-count');
    
    if (targetName) targetName.textContent = randomRecipe.result.name;
    if (targetDesc) targetDesc.textContent = randomRecipe.result.description;
    if (triesCount) {
        triesCount.textContent = state.triesLeft;
        triesCount.style.color = '#FF4081';
    }
}

function showTip() {
    if (!state.targetEmotion) return;
    
    // Pick one of the two ingredients
    const ingredients = [state.targetEmotion.e1, state.targetEmotion.e2];
    const pickedIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    
    // Find buttons for this ingredient and add highlight
    const bubbles = document.querySelectorAll(`.choice-bubble[data-emotion="${pickedIngredient}"]`);
    bubbles.forEach(b => {
        b.classList.add('tip-highlight');
        setTimeout(() => b.classList.remove('tip-highlight'), 3000);
    });
    
    speakText(`Try using ${pickedIngredient} as one of your elements.`);
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
        showFusionResult(recipe.result, true);
        
        if (!state.discoveredMixes.find(m => m.id === recipe.result.id)) {
            state.discoveredMixes.push(recipe.result);
            saveDiscoveredMixes(state.discoveredMixes);
        }
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
            showFusionResult({
                name: 'Reaction Failed',
                description: `You ran out of tries! The target was ${state.targetEmotion.result.name}.`,
                icon: 'assets/feeling_fusion/panic.svg',
                color: '#263238'
            }, false);
        } else {
            sounds.mixFail();
            const result = recipe ? recipe.result : { 
                name: 'Unknown Result', 
                description: 'This is not the emotion we were looking for. Try again!',
                icon: 'assets/feeling_fusion/confusion.svg',
                color: '#9E9E9E'
            };
            showFusionResult(result, false);
        }
    }
}

function showFusionResult(result, isWin) {
    const overlay = document.getElementById('fusion-overlay');
    const nameEl = document.getElementById('fusion-result-name');
    const descEl = document.getElementById('fusion-result-desc');
    const characterEl = document.getElementById('fusion-new-character');
    const formulaEl = document.getElementById('fusion-recipe-formula');
    const closeBtn = document.getElementById('btn-close-fusion');

    nameEl.textContent = isWin ? 'Experiment Success!' : (state.gameStatus === 'lost' ? 'Lab Closure' : 'Incorrect Mix');
    nameEl.style.color = isWin ? '#4CAF50' : '#FF5252';
    
    descEl.textContent = result.description;
    characterEl.innerHTML = `<img src="${result.icon}" style="width: 100%; height: 100%; animation: popIn 0.5s;">`;
    formulaEl.textContent = isWin ? `Discovery: ${result.name}` : `Result: ${result.name}`;
    
    closeBtn.textContent = isWin ? 'Next Experiment' : (state.gameStatus === 'lost' ? 'Try Again' : 'Keep Trying');
    
    overlay.classList.add('active');
    
    if (isWin) {
        speakText(`Success! You created ${result.name}!`);
    } else {
        speakText(`That's not quite right. You have ${state.triesLeft} tries left.`);
    }
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
