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
            <div class="chalkboard">
                <div class="formula" style="top: 15%; left: 10%;">H₂O + Joy = ?</div>
                <div class="formula" style="top: 40%; left: 80%;">Mix₂</div>
            </div>

        <div class="mood-mixer-container">
            <header class="mixer-header" style="position: absolute; top: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; z-index: 100; align-items: center; gap: 20px;">
                <button id="btn-mixer-back" class="circle-btn" title="Exit to Menu">
                    <i data-lucide="log-out"></i>
                </button>
                
                <!-- Center: Mission Display -->
                <div class="mission-header" style="flex: 1; display: flex; flex-direction: column; align-items: center; background: rgba(0,0,0,0.5); padding: 8px 60px; border-radius: 20px; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.05); position: relative; overflow: hidden;">
                    <!-- Technical Brackets -->
                    <div style="position: absolute; top: 10px; left: 10px; width: 15px; height: 15px; border-top: 2px solid var(--primary); border-left: 2px solid var(--primary); opacity: 0.5;"></div>
                    <div style="position: absolute; bottom: 10px; right: 10px; width: 15px; height: 15px; border-bottom: 2px solid var(--primary); border-right: 2px solid var(--primary); opacity: 0.5;"></div>
                    
                    <div style="font-size: 0.65rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 4px; color: #FFF; margin-bottom: 4px; font-weight: 300;">MISSION TARGET</div>
                    <div id="target-emotion-name" style="font-size: 2.2rem; font-weight: 900; color: white; text-shadow: 0 0 20px rgba(255,255,255,0.4); font-family: 'Outfit', sans-serif; letter-spacing: 1px;">???</div>
                    
                    <!-- Scanning Line Animation -->
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%); animation: scan-line 4s infinite linear; pointer-events: none;"></div>
                </div>

                <div class="status-actions" style="display: flex; align-items: center; gap: 10px;">
                    <div class="mission-status" style="background: rgba(0,0,0,0.6); padding: 5px 12px; border-radius: 12px; color: white; display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
                        <div id="tries-count" style="font-size: 1.1rem; font-weight: 900; color: #FF4081;">${state.triesLeft}</div>
                    </div>

                    <button id="btn-mixer-note" class="circle-btn" title="Read Lab Notes">
                        <i data-lucide="notebook-text"></i>
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
                        <span id="emotion-scenario">This feeling happens when you're waiting for a surprise party!</span>
                    </p>
                    <div style="margin-top: 30px; text-align: right; font-size: 0.8rem; color: #BCAAA4; font-style: italic;">- Chief Scientist</div>
                </div>
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

        <!-- Result Overlay (Popup) -->
        <div id="fusion-overlay" class="fusion-overlay">
            <div class="fusion-content" style="background: rgba(255,255,255,0.05); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border: 2px solid rgba(255,255,255,0.1); border-radius: 40px; padding: 40px; text-align: center; width: 90%; max-width: 400px; box-shadow: 0 40px 100px rgba(0,0,0,0.8); animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div id="fusion-icon-container" style="width: 120px; height: 120px; margin: 0 auto 20px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1);">
                    <div id="fusion-result-icon" style="width: 80px; height: 80px;"></div>
                </div>
                <h3 id="fusion-result-status" style="margin: 0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: var(--primary);">Analysis Result</h3>
                <h2 id="fusion-result-name" style="font-size: 2.2rem; color: white; margin: 5px 0 15px 0; font-weight: 900;">Discovery!</h2>
                <p id="fusion-result-desc" style="color: rgba(255,255,255,0.7); font-size: 0.9rem; line-height: 1.6; margin-bottom: 30px;"></p>
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

    document.getElementById('btn-mixer-note').addEventListener('click', () => {
        sounds.click();
        showNote();
    });

    document.getElementById('btn-close-note').addEventListener('click', () => {
        sounds.click();
        document.getElementById('note-overlay').style.display = 'none';
    });

    document.getElementById('btn-close-fusion').addEventListener('click', () => {
        sounds.click();
        closeFusionResult();
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
    state.tipsLeft = 1;
    state.gameStatus = 'playing';
    
    // Pick a random recipe as target
    // Use all complex emotions as questions (priority to undiscovered ones)
    const undiscovered = MIXING_RECIPES.filter(r => !state.discoveredMixes.find(m => m.id === r.result.id));
    
    if (undiscovered.length > 0) {
        // Pick the first one in the list for a structured learning path
        state.targetEmotion = undiscovered[0];
    } else {
        // All discovered! Pick a random one for review
        state.targetEmotion = MIXING_RECIPES[Math.floor(Math.random() * MIXING_RECIPES.length)];
    }
    
    // Update UI
    const targetName = document.getElementById('target-emotion-name');
    const targetDesc = document.getElementById('target-emotion-desc');
    const triesCount = document.getElementById('tries-count');
    const tipsCount = document.getElementById('tips-count');
    const tipsBtn = document.getElementById('btn-mixer-tips');
    
    if (targetName) targetName.textContent = state.targetEmotion.result.name;
    
    if (triesCount) {
        triesCount.textContent = state.triesLeft;
        triesCount.style.color = '#FF4081';
    }
    
    if (tipsCount) {
        tipsCount.textContent = state.tipsLeft;
        tipsCount.style.display = 'flex';
        tipsCount.style.color = '#FFEB3B';
    }

    if (tipsBtn) {
        tipsBtn.classList.remove('disabled');
        tipsBtn.disabled = false;
        tipsBtn.style.opacity = '1';
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
            tipsBtn.style.opacity = '0.5';
        }
        if (tipsCount) tipsCount.style.display = 'none';
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

function showNote() {
    if (!state.targetEmotion) return;
    
    const overlay = document.getElementById('note-overlay');
    const scenarioEl = document.getElementById('emotion-scenario');
    
    // Child-friendly scenarios for each emotion
    const scenarios = {
        'love': 'This is what you feel when you get a big, warm hug from your mom or dad!',
        'submission': 'This is when you listen carefully to your teacher because you know they want to help you stay safe.',
        'awe': 'This is the "Wow!" feeling when you look up at a huge, beautiful rainbow or a giant dinosaur at the museum.',
        'disapproval': 'This is how you feel when a friend takes a toy without asking, and you know it wasn\'t the right thing to do.',
        'remorse': 'This is the "I wish I hadn\'t done that" feeling after you accidentally break something or hurt a friend\'s feelings.',
        'contempt': 'This is when you see someone being mean to others and you think, "I don\'t want to be like that at all."',
        'aggressiveness': 'This is the feeling when you\'re super determined to win a race or finally learn how to ride your bike!',
        'optimism': 'This is when you wake up and just know that today is going to be a great day for playing outside!',
        'guilt': 'This is that small, shy feeling when you know you did something wrong and want to make it right.',
        'curiosity': 'This is when you find a strange bug in the garden and really want to see what it does next!',
        'despair': 'This is that very sad feeling when you lose your favorite stuffed animal and aren\'t sure if you\'ll find it.',
        'unbelief': 'This is the "No way!" feeling when you see someone eat something really yucky, like a worm!',
        'envy': 'This is when you see your friend with a cool new game and you really wish you had one just like it.',
        'cynicism': 'This is when you\'re being very choosy about which socks to wear because only the softest ones will do!',
        'pride': 'This is the "I did it!" feeling after you finish a big puzzle or get a gold star on your homework.',
        'hope': 'This is when you\'re waiting for your birthday and you just know it\'s going to be so much fun!',
        'delight': 'This is the "Yay!" feeling when you find an extra treat in your lunchbox that you didn\'t expect!',
        'silliness': 'This is when you make funny faces in the mirror or tell a joke that makes everyone giggle!',
        'empathy': 'This is when your friend is sad because they fell down, and you feel a little sad too because you care about them.',
        'strong': 'This is the "I can do anything!" feeling when you help your parents carry the groceries or climb to the top of the slide.',
        'shame': 'This is when you feel a bit yucky inside because you made a mistake and you\'re worried what others might think.',
        'anxiety': 'This is the butterflies in your tummy feeling before you start your first day at a new school.',
        'confusion': 'This is when you\'re trying to solve a tricky math problem and your brain feels like it\'s all mixed up!',
        'outrage': 'This is how you feel when someone is being very unfair, like when they don\'t share the swings at the park.',
        'pessimism': 'This is when you think it might rain on your picnic day, even though the sun is still out.',
        'maze': 'This is the exciting feeling of exploring a new playground with your best friend for the first time!',
        'bittersweet': 'This is when you\'re happy to be growing up, but a little sad that your favorite old shoes don\'t fit anymore.',
        'panic': 'This is when everything feels too fast, like when you lose your mom in the supermarket for just a second. Take a deep breath!'
    };

    // Riddle-style hints for basic emotions
    const EMOTION_HINTS = {
        'joy': 'the element of a big, sunny smile',
        'trust': 'the feeling of being safe with a best friend',
        'fear': 'the shaky feeling of being a little bit scared',
        'surprise': 'the "Oh!" feeling when something unexpected happens',
        'sadness': 'the heavy feeling of a rainy afternoon',
        'disgust': 'the "Yuck!" feeling when you see something gross',
        'anger': 'the hot, red feeling of being very mad',
        'anticipation': 'the orange glow of waiting for something exciting'
    };

    const hint1 = EMOTION_HINTS[state.targetEmotion.e1] || state.targetEmotion.e1;
    const hint2 = EMOTION_HINTS[state.targetEmotion.e2] || state.targetEmotion.e2;
    
    const baseText = scenarios[state.targetEmotion.result.id] || state.targetEmotion.result.description;
    scenarioEl.innerHTML = `
        <div style="margin-bottom: 20px;">${baseText}</div>
        <div style="background: rgba(0,0,0,0.05); padding: 15px; border-radius: 10px; border-left: 4px solid #FFAB91;">
            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #795548; font-weight: 900; margin-bottom: 5px;">Scientific Hint:</div>
            <div style="font-size: 0.9rem; color: #5D4037;">To create this reaction, try mixing <b>${hint1}</b> with <b>${hint2}</b>.</div>
        </div>
    `;
    
    overlay.style.display = 'flex';
    speakText(baseText + `. Hint: mix ${hint1} and ${hint2}`);
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
        // VALID RECIPE (regardless if it matches mission)
        const isTarget = recipe.result.id === state.targetEmotion.result.id;
        state.lastResult = recipe.result;

        // Add to discovery shelf if new
        if (!state.discoveredMixes.find(m => m.id === recipe.result.id)) {
            state.discoveredMixes.push(recipe.result);
            saveDiscoveredMixes(state.discoveredMixes);
        }

        if (isTarget) {
            sounds.mixSuccess();
            state.gameStatus = 'won';
            showFusionResult(recipe.result, true);
        } else {
            sounds.mixFail();
            state.triesLeft--;
            updateTriesUI();
            
            if (state.triesLeft <= 0) {
                state.gameStatus = 'lost';
                showFusionResult(recipe.result, false, true); // Game over
            } else {
                showFusionResult(recipe.result, false, false); // Wrong mix, but valid recipe
            }
        }
    } else {
        // INVALID COMBO
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
            showFusionResult(unknownResult, false, true);
        } else {
            showFusionResult(unknownResult, false, false);
        }
    }
}

function updateTriesUI() {
    const triesCount = document.getElementById('tries-count');
    if (triesCount) {
        triesCount.textContent = state.triesLeft;
        if (state.triesLeft <= 1) triesCount.style.color = '#F44336';
    }
}

function showFusionResult(result, isWin, isGameOver = false) {
    const overlay = document.getElementById('fusion-overlay');
    const statusEl = document.getElementById('fusion-result-status');
    const nameEl = document.getElementById('fusion-result-name');
    const descEl = document.getElementById('fusion-result-desc');
    const iconEl = document.getElementById('fusion-result-icon');
    const closeBtn = document.getElementById('btn-close-fusion');

    statusEl.textContent = isWin ? 'Mission Success!' : (isGameOver ? 'Final Analysis' : 'Incorrect Mix');
    statusEl.style.color = isWin ? '#4CAF50' : '#FF5252';
    
    nameEl.textContent = result.name;
    descEl.textContent = result.description;
    iconEl.innerHTML = `<img src="${result.icon || 'assets/results/confusion.svg'}" style="width: 100%; height: 100%; animation: popIn 0.5s;">`;
    
    closeBtn.textContent = isWin ? 'COLLECT REWARD' : (isGameOver ? 'VIEW LAB REPORT' : 'TRY ANOTHER MIX');
    
    overlay.classList.add('active');
    
    if (isWin) {
        speakText(`Success! You created ${result.name}!`);
    } else {
        speakText(`That's not ${state.targetEmotion.result.name}. You created ${result.name}. You have ${state.triesLeft} tries left.`);
    }
}

function closeFusionResult() {
    const overlay = document.getElementById('fusion-overlay');
    overlay.classList.remove('active');
    
    if (state.gameStatus === 'won') {
        localNavigate('success');
    } else if (state.gameStatus === 'lost') {
        localNavigate('failure');
    } else {
        clearMixer();
        renderDiscoveryGrid();
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
    if (liq1) { 
        liq1.style.height = '0'; liq1.style.y = '110'; 
        liq1.closest('.beaker-svg').classList.remove('animating');
    }
    if (liq2) { 
        liq2.style.height = '0'; liq2.style.y = '110'; 
        liq2.closest('.beaker-svg').classList.remove('animating');
    }

    document.querySelectorAll('.choice-bubble').forEach(b => {
        b.classList.remove('selected');
        b.classList.remove('disabled');
        b.disabled = false;
    });
    checkCombinations();
}
