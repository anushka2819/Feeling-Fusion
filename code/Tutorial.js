/**
 * code/Tutorial.js
 */
import { sounds } from './utils/sounds.js';

export function template() {
    return /* html */`
    <section id="screen-tutorial" class="screen tutorial-screen" aria-label="How to Play">
        <div class="lab-environment">
            <div class="chalkboard"></div>
            <div class="workbench"></div>
        </div>

        <div class="tutorial-card">
            <header class="tutorial-header">
                <button id="btn-tutorial-back" class="circle-btn" title="Go Back">
                    <i data-lucide="arrow-left"></i>
                </button>
                <h2 class="splash-title" style="font-size: 2.5rem; letter-spacing: 2px;">Lab Manual</h2>
            </header>

            <div class="tutorial-steps">
                <div class="tutorial-step">
                    <div class="step-icon">1</div>
                    <div class="step-text">
                        <h3>Check Mission</h3>
                        <p>Look at the <b>Clipboard</b> to see your target emotion for this level.</p>
                    </div>
                </div>

                <div class="tutorial-step">
                    <div class="step-icon">2</div>
                    <div class="step-text">
                        <h3>Read Notes</h3>
                        <p>Click the <b>Note Icon</b> for a helpful story about the emotion you're making.</p>
                    </div>
                </div>

                <div class="tutorial-step">
                    <div class="step-icon">3</div>
                    <div class="step-text">
                        <h3>Limited Tries</h3>
                        <p>You have 4 tries! If you're stuck, click the <b>Lightbulb</b> for a scientific tip.</p>
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

    document.getElementById('btn-tutorial-done').addEventListener('click', () => {
        sounds.click();
        navigate('moodMixer');
    });
}

export function onShow() {
    // Scroll to top or reset animations
}
