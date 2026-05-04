/**
 * code/Tutorial.js
 */
import { sounds } from './utils/sounds.js';

export function template() {
    return /* html */`
    <section id="screen-tutorial" class="screen tutorial-screen" aria-label="How to Play">
        <header class="tutorial-header">
            <button id="btn-tutorial-back" class="btn-icon circle-btn">
                <i data-lucide="arrow-left"></i>
            </button>
            <h2 class="premium-title">How to Play</h2>
        </header>

        <div class="tutorial-content">
            <div class="tutorial-steps">
                <div class="tutorial-step" style="--delay: 1">
                    <div class="step-icon">1</div>
                    <div class="step-text">
                        <h3>Pick Ingredients</h3>
                        <p>Select two primary emotions from the side panels to place them in the flasks.</p>
                    </div>
                </div>

                <div class="tutorial-step" style="--delay: 2">
                    <div class="step-icon">2</div>
                    <div class="step-text">
                        <h3>Mix Them Up</h3>
                        <p>Press <strong>"Begin Experiment"</strong> to fuse the emotions together in the chamber.</p>
                    </div>
                </div>

                <div class="tutorial-step" style="--delay: 3">
                    <div class="step-icon">3</div>
                    <div class="step-text">
                        <h3>Discover New Feelings</h3>
                        <p>Every combination creates a unique feeling! Collect them all in your discovery grid.</p>
                    </div>
                </div>
            </div>

            <button id="btn-tutorial-done" class="btn-primary">
                I'm Ready!
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
