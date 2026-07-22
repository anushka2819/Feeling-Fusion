import { sounds } from './utils/sounds.js';

export function template() {
    return /* html */`
    <section id="screen-splash" class="screen splash-screen" aria-label="Welcome to Feeling Fusion">
        <div class="lab-environment"></div>

        <div class="splash-overlay" style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
            <div class="logo-container" style="margin-bottom: 20px;">
                <img src="assets/logo.svg" alt="Feeling Fusion Logo" class="main-logo-img main-logo-img-large">
            </div>
            <h1 class="splash-title" style="font-size: 3.6rem; color: #FFF; font-weight: 900; text-shadow: 0 6px 0 #D84315, 0 0 35px rgba(255,87,34,0.9); margin: 0;">FEELING FUSION</h1>
            <p class="splash-subtitle" style="font-size: 1.4rem; color: #FFECB3; margin: 10px 0 30px 0; font-weight: bold;">Master Your Emotions & Solve Puzzles!</p>
            
            <div class="splash-actions" style="display: flex; flex-direction: column; gap: 18px; width: 100%; max-width: 360px;">
                <button id="btn-start-saga" class="btn-primary pulse-button" style="font-size: 1.4rem; padding: 18px 35px; background: linear-gradient(180deg, #FF7043, #F4511E); border: 4px solid #FFF; border-radius: 50px; box-shadow: 0 10px 25px rgba(244,81,30,0.6); cursor: pointer; color: #FFF; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 12px;">
                    <i data-lucide="sparkles" style="fill: #FFF; width: 26px; height: 26px;"></i>
                    EMOTION CRUSH (MATCH 3)
                </button>

                <button id="btn-start-lab" class="btn-primary" style="font-size: 1.3rem; padding: 16px 35px; background: linear-gradient(180deg, #42A5F5, #1E88E5); border: 4px solid #90CAF9; border-radius: 50px; box-shadow: 0 8px 20px rgba(30,136,229,0.5); cursor: pointer; color: #FFF; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 12px;">
                    <i data-lucide="flask-conical" style="width: 24px; height: 24px;"></i>
                    LAB MIXER MODE
                </button>
            </div>

            <div class="splash-footer" style="margin-top: 40px; color: rgba(255,255,255,0.85); font-size: 1.05rem; font-weight: bold;">
                <p>Click any mode to view its Manual & Start Playing!</p>
            </div>
        </div>

        <!-- Emotion Crush Fullscreen Manual Modal -->
        <div id="manual-modal-saga" class="manual-modal" style="display:none;">
            <div class="manual-card manual-card-fullscreen" style="background: linear-gradient(135deg, #1A237E 0%, #0D47A1 50%, #002171 100%); color: white; position: relative;">
                <div style="max-width: 1100px; width: 100%; margin: 0 auto;">
                    <button id="btn-close-saga-manual" class="circle-btn" style="position: absolute; top: 25px; right: 25px; background: #FF1744; color: white; border: none; cursor: pointer; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 10;">
                        <i data-lucide="x" style="width: 28px; height: 28px;"></i>
                    </button>

                    <h2 style="color: #FFEB3B; font-weight: 900; margin-top: 0; display: flex; align-items: center; gap: 15px; font-size: 2.5rem; border-bottom: 3px dashed rgba(255,255,255,0.25); padding-bottom: 15px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                        <i data-lucide="sparkles" style="width: 40px; height: 40px; color: #FF9800;"></i> EMOTION CRUSH — GAME MANUAL
                    </h2>

                    <!-- Visual Cards Grid -->
                    <div class="manual-grid">
                        <!-- Card 1: Objective & Swapping -->
                        <div class="manual-item-card" style="border-left: 5px solid #FF5722;">
                            <div class="manual-item-icon" style="background: #FF5722;">🎯</div>
                            <div class="manual-item-title">Objective & Swapping</div>
                            <div class="manual-item-desc">
                                Reach the Target Score before running out of moves! Drag & drop or tap 2 adjacent tiles to swap. Line up 3 identical emotions to pop them!
                            </div>
                        </div>

                        <!-- Card 2: Emotion Fusion -->
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

                        <!-- Card 3: Line Blaster (Match 4) -->
                        <div class="manual-item-card" style="border-left: 5px solid #00E676;">
                            <div class="manual-item-icon" style="background: #00E676;">⚡</div>
                            <div class="manual-item-title">Line Blaster (Match 4)</div>
                            <div class="manual-item-desc">
                                Match 4 identical emotions in a row to spawn a <strong>Line Blaster Tile</strong>! When matched, it shoots a laser clearing an entire row & column!
                            </div>
                        </div>

                        <!-- Card 4: Rainbow Bomb (Match 5) -->
                        <div class="manual-item-card" style="border-left: 5px solid #E91E63;">
                            <div class="manual-item-icon" style="background: #E91E63;">🌈</div>
                            <div class="manual-item-title">Rainbow Bomb (Match 5)</div>
                            <div class="manual-item-desc">
                                Match 5 identical emotions in a row or T/L shape to create a <strong>Rainbow Emotion Bomb</strong>! Explodes a 3x3 surrounding grid area!
                            </div>
                        </div>

                        <!-- Card 5: Power-up Boosters -->
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
                    <button id="btn-confirm-start-saga" class="btn-primary pulse-button" style="width: 100%; font-size: 1.5rem; padding: 16px; background: linear-gradient(180deg, #FF7043, #F4511E); border: 4px solid #FFF; border-radius: 50px; cursor: pointer; color: #FFF; font-weight: 900; justify-content: center; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(244,81,30,0.7);">
                        <i data-lucide="play" style="fill: #FFF; width: 28px; height: 28px;"></i> ENTER SAGA MAP
                    </button>
                </div>
            </div>
        </div>

        <!-- Lab Mixer Fullscreen Manual Modal -->
        <div id="manual-modal-lab" class="manual-modal" style="display:none;">
            <div class="manual-card manual-card-fullscreen" style="background: linear-gradient(135deg, #0D47A1 0%, #004D40 50%, #00251a 100%); color: white; position: relative;">
                <div style="max-width: 1100px; width: 100%; margin: 0 auto;">
                    <button id="btn-close-lab-manual" class="circle-btn" style="position: absolute; top: 25px; right: 25px; background: #FF1744; color: white; border: none; cursor: pointer; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 10;">
                        <i data-lucide="x" style="width: 28px; height: 28px;"></i>
                    </button>

                    <h2 style="color: #FFEB3B; font-weight: 900; margin-top: 0; display: flex; align-items: center; gap: 15px; font-size: 2.5rem; border-bottom: 3px dashed rgba(255,255,255,0.25); padding-bottom: 15px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                        <i data-lucide="flask-conical" style="width: 40px; height: 40px; color: #00E676;"></i> LAB MIXER — GAME MANUAL
                    </h2>

                    <!-- Visual Cards Grid -->
                    <div class="manual-grid">
                        <!-- Card 1: Synthesis Mission -->
                        <div class="manual-item-card" style="border-left: 5px solid #42A5F5;">
                            <div class="manual-item-icon" style="background: #1976D2;">🎯</div>
                            <div class="manual-item-title">Synthesis Mission</div>
                            <div class="manual-item-desc">
                                Read your Target Emotion task! Select 1 element from Element A and 1 element from Element B to fuse them in the lab beakers.
                            </div>
                        </div>

                        <!-- Card 2: Hearts & Tries -->
                        <div class="manual-item-card" style="border-left: 5px solid #FF1744;">
                            <div class="manual-item-icon" style="background: #D50000;">❤️</div>
                            <div class="manual-item-title">Hearts & Tries System</div>
                            <div class="manual-item-desc">
                                You have <strong>4 Hearts (❤️ ❤️ ❤️ ❤️)</strong>. Every wrong combination deducts 1 Heart. Running out of hearts causes a Volatile Failure!
                            </div>
                        </div>

                        <!-- Card 3: Level Progression & Shuffling -->
                        <div class="manual-item-card" style="border-left: 5px solid #AB47BC;">
                            <div class="manual-item-icon" style="background: #8E24AA;">🔀</div>
                            <div class="manual-item-title">Level Ups & Shuffling</div>
                            <div class="manual-item-desc">
                                Every completed mission levels you up! Choice bubbles **shuffle positions** every new level & attempt for fresh challenges.
                            </div>
                        </div>

                        <!-- Card 4: Scientific Tools -->
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
                    <button id="btn-confirm-start-lab" class="btn-primary" style="width: 100%; font-size: 1.5rem; padding: 16px; background: linear-gradient(180deg, #42A5F5, #1E88E5); border: 4px solid #FFF; border-radius: 50px; cursor: pointer; color: #FFF; font-weight: 900; justify-content: center; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(30,136,229,0.6);">
                        <i data-lucide="flask-conical" style="width: 28px; height: 28px;"></i> START LAB EXPERIMENT
                    </button>
                </div>
            </div>
        </div>
    </section>`;
}

export function init({ navigate }) {
    const modalSaga = document.getElementById('manual-modal-saga');
    const modalLab = document.getElementById('manual-modal-lab');

    document.getElementById('btn-start-saga').addEventListener('click', () => {
        sounds.click();
        if (modalSaga) modalSaga.style.display = 'flex';
        if (window.lucide) window.lucide.createIcons();
    });

    document.getElementById('btn-start-lab').addEventListener('click', () => {
        sounds.click();
        if (modalLab) modalLab.style.display = 'flex';
        if (window.lucide) window.lucide.createIcons();
    });

    document.getElementById('btn-close-saga-manual').addEventListener('click', () => {
        sounds.click();
        if (modalSaga) modalSaga.style.display = 'none';
    });

    document.getElementById('btn-close-lab-manual').addEventListener('click', () => {
        sounds.click();
        if (modalLab) modalLab.style.display = 'none';
    });

    document.getElementById('btn-confirm-start-saga').addEventListener('click', () => {
        sounds.click();
        if (modalSaga) modalSaga.style.display = 'none';
        navigate('saga');
    });

    document.getElementById('btn-confirm-start-lab').addEventListener('click', () => {
        sounds.click();
        if (modalLab) modalLab.style.display = 'none';
        navigate('moodMixer');
    });
}

export function onShow() {}
