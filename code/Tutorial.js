/**
 * code/Tutorial.js
 */
import { sounds } from './utils/sounds.js';
import { toggleFullscreen, isFullscreen } from './utils/fullscreen.js';

export function template() {
    return /* html */`
    <section id="screen-tutorial" class="screen tutorial-screen" aria-label="How to Play">
        <div class="lab-environment">
            <div class="chalkboard"></div>
            <div class="workbench"></div>
        </div>

        <div class="tutorial-card">
            <header class="tutorial-header">
                <div style="display: flex; gap: 10px;">
                    <button id="btn-tutorial-back" class="circle-btn" title="Go Back">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <button id="btn-fullscreen-toggle" class="circle-btn" title="Toggle Fullscreen">
                        <i data-lucide="${isFullscreen() ? 'minimize' : 'maximize'}"></i>
                    </button>
                </div>
                <h2 class="splash-title" style="font-size: 2.5rem; letter-spacing: 2px;">Lab Manual</h2>
            </header>

            <div class="tutorial-steps">
                <div class="tutorial-step">
                    <div class="step-icon">1</div>
                    <div class="step-text">
                        <h3>Identify the Target</h3>
                        <p>Look at the <b>Mission Target</b> at the top. This is the new emotion you need to create!</p>
                    </div>
                </div>

                <div class="tutorial-step">
                    <div class="step-icon">2</div>
                    <div class="step-text">
                        <h3>Pick Your Elements</h3>
                        <p>Emotions are like recipes! Select <b>one item from the top row</b> and <b>one from the bottom row</b>.</p>
                    </div>
                </div>

                <div class="tutorial-step">
                    <div class="step-icon">3</div>
                    <div class="step-text">
                        <h3>Mix and Discover</h3>
                        <p>Click <b>Begin Experiment</b> to see the reaction. If you're right, you'll unlock a new discovery!</p>
                    </div>
                </div>

                <div class="tutorial-step">
                    <div class="step-icon">4</div>
                    <div class="step-text">
                        <h3>Use Your Lab Tools</h3>
                        <p>Check the <b>Notebook</b> for a clue, or the <b>Lightbulb</b> for a tip. You have 4 tries—use them wisely!</p>
                    </div>
                </div>
            </div>

            <button id="btn-tutorial-done" class="btn-primary" style="width: 100%; justify-content: center;">
                <i data-lucide="check" style="margin-right: 12px;"></i>
                UNDERSTOOD!
            </button>
        </div>
    </section>`;
}

export function init({ navigate }) {
    document.getElementById('btn-tutorial-back').addEventListener('click', () => {
        sounds.click();
        navigate('splash');
    });

    document.getElementById('btn-fullscreen-toggle').addEventListener('click', () => {
        sounds.click();
        toggleFullscreen();
    });

    document.getElementById('btn-tutorial-done').addEventListener('click', () => {
        sounds.click();
        navigate('moodMixer');
    });
}

export function onShow() {
    // Scroll to top or reset animations
}
