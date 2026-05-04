/**
 * screens/MoodMixer.js — The Feeling Fusion Lab
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
    
    const generateChoiceHtml = (side) => basicEmotions.map((emo, index) => `
        <button class="choice-bubble choice-${side}" data-emotion="${emo.id}" data-side="${side}" title="${emo.name}" type="button" style="--delay: ${index}">
            <img src="${emo.icon}" alt="${emo.name}">
        </button>
    `).join('');

    const leftChoicesHtml = generateChoiceHtml('left');
    const rightChoicesHtml = generateChoiceHtml('right');

    return /* html */`
    <section id="screen-mood-mixer" class="screen" aria-label="Feeling Fusion Lab">
        <div class="mood-mixer-container">
            <header class="mixer-header">
                <button id="btn-mixer-back" class="btn-icon circle-btn" aria-label="Exit" type="button">
                    <i data-lucide="log-out"></i>
                </button>
                <button id="btn-mixer-settings" class="btn-icon circle-btn" aria-label="Settings" type="button">
                    <i data-lucide="settings"></i>
                </button>
            </header>

            <div class="mixer-card fusion-chamber full-screen-lab">
                <div class="lab-main-area">
                    <!-- 1. Selection Left -->
                    <div class="lab-side-choices side-left">
                        <p class="side-label">Element A</p>
                        <div class="choice-grid-2x4">
                            ${leftChoicesHtml}
                        </div>
                    </div>

                    <!-- 2. Flasks Container -->
                    <div class="lab-flask-area">
                        <div class="mixer-slots">
                            <div class="slot-container">
                                <div id="mixer-slot-1" class="mixer-slot">
                                    <div class="flask-container">
                                        <div id="flask-liquid-1" class="flask-liquid"></div>
                                    </div>
                                    <i data-lucide="beaker" style="opacity: 0.2; color: #81D4FA;"></i>
                                </div>
                                <div id="slot-name-1" class="slot-label">Ingredient 1</div>
                            </div>

                            <span class="plus-symbol">+</span>

                            <div class="slot-container">
                                <div id="mixer-slot-2" class="mixer-slot">
                                    <div class="flask-container">
                                        <div id="flask-liquid-2" class="flask-liquid"></div>
                                    </div>
                                    <i data-lucide="beaker" style="opacity: 0.2; color: #81D4FA;"></i>
                                </div>
                                <div id="slot-name-2" class="slot-label">Ingredient 2</div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Selection Right -->
                    <div class="lab-side-choices side-right">
                        <p class="side-label">Element B</p>
                        <div class="choice-grid-2x4">
                            ${rightChoicesHtml}
                        </div>
                    </div>

                    <!-- 4. Global Action Controls -->
                    <div id="mixer-controls-container" class="lab-controls">
                        <div id="mixer-controls">
                            <button id="btn-do-fusion" class="btn-primary disabled" disabled>
                                <i data-lucide="test-tube-2" style="margin-right: 10px;"></i>
                                Begin Experiment!
                            </button>
                        </div>

                        <div class="mixer-discovery-grid-small">
                            <div id="mixer-discovery-grid" class="mixer-discovery-grid">
                                <!-- Discovered emotions slots -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Result Overlay -->
        <div id="fusion-overlay" class="fusion-overlay">
            <div class="fusion-content">
                <div id="fusion-new-character" class="fusion-result-img"></div>
                <div id="fusion-result-name" class="premium-title" style="font-size: 2.5rem; margin-bottom: 0.5rem;">New Discovery!</div>
                <p id="fusion-recipe-formula" class="premium-subtitle" style="color: #607D8B; font-weight: 800; margin-bottom: 1rem;"></p>
                <p id="fusion-result-desc" class="premium-subtitle" style="margin: 1rem 0; opacity: 1;">You've discovered a new feeling.</p>
                <button id="btn-close-fusion" class="btn-primary">That's amazing!</button>
            </div>
        </div>

        <!-- Victory Overlay -->
        <div id="mixer-victory-overlay" class="fusion-overlay" style="display: none; z-index: 2000;">
            <div class="fusion-content">
                <div class="victory-icon-wrap" style="margin-bottom: 1rem;">
                    <i data-lucide="award" style="width: 80px; height: 80px; color: #FFF176;"></i>
                </div>
                <h2 class="premium-title" style="font-size: 2.5rem; margin-bottom: 0.5rem;">Lab Master!</h2>
                <p class="premium-subtitle" style="color: #607D8B; font-weight: 800; margin-bottom: 2rem;">You have discovered 4 unique feelings today!</p>
                <div class="victory-actions" style="display: flex; gap: 1rem; width: 100%;">
                    <button id="btn-mixer-replay" class="btn-primary" style="flex: 1;">REPLAY</button>
                    <button id="btn-mixer-exit" class="btn-secondary" style="flex: 1;">EXIT</button>
                </div>
            </div>
        </div>
    </section>`;
}

export function onShow() {
    state.discoveredMixes = []; // CRITICAL: Restart game on entry
    clearMixer();
    renderDiscoveryGrid();
}

/**
 * @param {{ navigate: (screen: string) => void }} deps
 */
export function init({ navigate }) {
    document.getElementById('btn-mixer-back').addEventListener('click', () => {
        sounds.click();
        navigate('splash');
    });

    document.getElementById('btn-mixer-settings').addEventListener('click', () => {
        sounds.click();
        navigate('settings');
    });

    document.getElementById('btn-mixer-replay').addEventListener('click', () => {
        sounds.click();
        document.getElementById('mixer-victory-overlay').style.display = 'none';
        onShow(); // Full reset
    });

    document.getElementById('btn-mixer-exit').addEventListener('click', () => {
        sounds.click();
        document.getElementById('mixer-victory-overlay').style.display = 'none';
        navigate('splash');
    });

    const choices = document.querySelectorAll('.choice-bubble');
    choices.forEach(btn => {
        btn.addEventListener('click', () => {
            const emoId = btn.dataset.emotion;
            const side = btn.dataset.side;
            const emoData = EMOTIONS_DATA[emoId];
            if (!emoData) return;

            sounds.click();

            if (side === 'left') {
                // Deselect others on the same side
                document.querySelectorAll('.choice-left').forEach(b => b.classList.remove('selected'));
                selectedSlot1 = emoData;
                updateSlotUI(1, emoData);
                btn.classList.add('selected');

                // VANISH from other side
                document.querySelectorAll('.choice-right').forEach(b => b.classList.remove('disabled-dupe'));
                const otherSideMatch = document.querySelector(`.choice-right[data-emotion="${emoId}"]`);
                if (otherSideMatch) otherSideMatch.classList.add('disabled-dupe');
            } else {
                // Deselect others on the same side
                document.querySelectorAll('.choice-right').forEach(b => b.classList.remove('selected'));
                selectedSlot2 = emoData;
                updateSlotUI(2, emoData);
                btn.classList.add('selected');

                // VANISH from other side
                document.querySelectorAll('.choice-left').forEach(b => b.classList.remove('disabled-dupe'));
                const otherSideMatch = document.querySelector(`.choice-left[data-emotion="${emoId}"]`);
                if (otherSideMatch) otherSideMatch.classList.add('disabled-dupe');
            }
            
            checkCombinations();
        });
    });

    document.getElementById('btn-do-fusion').addEventListener('click', () => {
        if (!selectedSlot1 || !selectedSlot2) return;
        performFusion();
    });



    document.getElementById('btn-close-fusion').addEventListener('click', () => {
        sounds.click();
        document.getElementById('fusion-overlay').classList.remove('active');
        clearMixer();
        renderDiscoveryGrid(); // Update gallery after discovery

        // After closing discovery, check if game is complete (4 slots filled)
        if (state.discoveredMixes && state.discoveredMixes.length >= 4) {
            setTimeout(() => {
                const victoryOverlay = document.getElementById('mixer-victory-overlay');
                if (victoryOverlay) {
                    victoryOverlay.style.display = 'flex';
                    sounds.victory();
                }
            }, 600);
        }
    });
}

function renderDiscoveryGrid() {
    const grid = document.getElementById('mixer-discovery-grid');
    if (!grid) return;

    // We only show 4 slots total now
    const totalSlots = 4;
    
    // Get the discovered emotions (limit to first 4 or unique ones)
    const discoveryIds = state.discoveredMixes.slice(0, totalSlots);
    
    let html = '';
    for (let i = 0; i < totalSlots; i++) {
        const dishId = discoveryIds[i];
        if (dishId) {
            // Find the emotion data for this result ID
            const resultData = MIXING_RECIPES.find(r => r.result.id === dishId)?.result;
            if (resultData) {
                html += `
                    <div class="discovery-slot unlocked" data-recipe-id="${resultData.id}" title="${resultData.name}" style="--slot-color: ${resultData.color}">
                        <img src="${resultData.icon}" alt="${resultData.name}" class="discovery-icon">
                    </div>
                `;
            }
        } else {
            html += `
                <div class="discovery-slot locked" title="Discovery more to fill this slot!">
                    <i data-lucide="help-circle"></i>
                </div>
            `;
        }
    }

    grid.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Add click listeners to UNLOCKED slots to show details
    grid.querySelectorAll('.discovery-slot.unlocked').forEach((slot) => {
        slot.addEventListener('click', () => {
            const recipeId = slot.dataset.recipeId;
            const fullRecipe = MIXING_RECIPES.find(r => r.result.id === recipeId);
            if (fullRecipe) showFusionResult(fullRecipe);
        });
    });


}

function showFusionResult(recipeOrResult) {
    const overlay = document.getElementById('fusion-overlay');
    const resultImg = document.getElementById('fusion-new-character');
    const resultName = document.getElementById('fusion-result-name');
    const formulaText = document.getElementById('fusion-recipe-formula');
    const resultDesc = document.getElementById('fusion-result-desc');

    const isRecipe = recipeOrResult.e1 && recipeOrResult.e2;
    const result = isRecipe ? recipeOrResult.result : recipeOrResult;

    resultImg.innerHTML = `<img src="${result.icon}" style="width: 100%; height: 100%;" />`;
    resultName.textContent = result.name;
    resultName.style.color = result.color;
    resultDesc.textContent = result.description;

    if (isRecipe) {
        const emo1Name = EMOTIONS_DATA[recipeOrResult.e1]?.name || 'Unknown';
        const emo2Name = EMOTIONS_DATA[recipeOrResult.e2]?.name || 'Unknown';
        formulaText.textContent = `${emo1Name} + ${emo2Name}`;
        formulaText.style.display = 'block';
    } else {
        formulaText.style.display = 'none';
    }

    overlay.classList.add('active');
}

function updateSlotUI(slotNum, data) {
    const slot = document.getElementById(`mixer-slot-${slotNum}`);
    const liquid = document.getElementById(`flask-liquid-${slotNum}`);
    const label = document.getElementById(`slot-name-${slotNum}`);
    if (!slot || !label || !liquid) return;
    
    // Add image if missing
    if (!slot.querySelector('img')) {
        const img = document.createElement('img');
        slot.appendChild(img);
    }
    const imgElement = slot.querySelector('img');
    imgElement.src = data.icon;
    imgElement.alt = data.name;

    slot.classList.add('occupied');
    liquid.style.setProperty('--liquid-color', data.color);
    
    label.textContent = data.name;
    label.style.color = data.color;
    label.style.fontWeight = '800';
}

function checkCombinations() {
    const btn = document.getElementById('btn-do-fusion');
    if (selectedSlot1 && selectedSlot2) {
        btn.classList.remove('disabled');
        btn.classList.add('pulse-button');
        btn.disabled = false;
    } else {
        btn.classList.add('disabled');
        btn.classList.remove('pulse-button');
        btn.disabled = true;
    }
}

function clearMixer() {
    selectedSlot1 = null;
    selectedSlot2 = null;
    
    const slot1 = document.getElementById('mixer-slot-1');
    const liq1 = document.getElementById('flask-liquid-1');
    const label1 = document.getElementById('slot-name-1');
    if (slot1) {
        slot1.classList.remove('occupied');
        if (slot1.querySelector('img')) slot1.querySelector('img').remove();
    }
    if (liq1) liq1.style.setProperty('--liquid-color', '#E0E0E0');
    if (label1) {
        label1.textContent = 'Ingredient 1';
        label1.style.color = '#9E9E9E';
    }

    const slot2 = document.getElementById('mixer-slot-2');
    const liq2 = document.getElementById('flask-liquid-2');
    const label2 = document.getElementById('slot-name-2');
    if (slot2) {
        slot2.classList.remove('occupied');
        if (slot2.querySelector('img')) slot2.querySelector('img').remove();
    }
    if (liq2) liq2.style.setProperty('--liquid-color', '#E0E0E0');
    if (label2) {
        label2.textContent = 'Ingredient 2';
        label2.style.color = '#9E9E9E';
    }

    document.querySelectorAll('.choice-bubble').forEach(b => {
        b.classList.remove('selected');
        b.classList.remove('disabled-dupe');
    });

    checkCombinations();
    if (window.lucide) window.lucide.createIcons();
}

function performFusion() {
    const recipe = MIXING_RECIPES.find(r => 
        (r.e1 === selectedSlot1.id && r.e2 === selectedSlot2.id) ||
        (r.e1 === selectedSlot2.id && r.e2 === selectedSlot1.id)
    );

    const overlay = document.getElementById('fusion-overlay');
    const resultImg = document.getElementById('fusion-new-character');
    const resultName = document.getElementById('fusion-result-name');
    const resultDesc = document.getElementById('fusion-result-desc');

    if (recipe) {
        // We found a valid mixture!
        sounds.discovery();
        showFusionResult(recipe);

        // Save discovery if new
        if (!state.discoveredMixes.some(m => (m === recipe.result.id) || (m && m.id === recipe.result.id))) {
            state.discoveredMixes.push(recipe.result.id);
            saveDiscoveredMixes(state.discoveredMixes);
            renderDiscoveryGrid(); 
        }
    } else {
        sounds.click(); // Unknown mixture
        // Unknown mixture - default "curious" result
        const mysteryResult = {
            icon: '', // handled below
            name: "Mystery Mix!",
            description: "We haven't discovered this mix yet! It's a brand new unique feeling of your own.",
            color: '#9E9E9E'
        };
        
        resultImg.innerHTML = `<i data-lucide="help-circle" style="width: 100%; height: 100%; color: #9E9E9E;"></i>`;
        resultName.textContent = mysteryResult.name;
        resultDesc.textContent = mysteryResult.description;
        resultName.style.color = mysteryResult.color;
        
        if (window.lucide) window.lucide.createIcons();
        overlay.classList.add('active');
    }
}
