/**
 * code/Splash.js
 */
import { sounds } from './utils/sounds.js';

export function template() {
    return /* html */`
    <section id="screen-splash" class="screen splash-screen" aria-label="Welcome to Emo Mixer">
        <div class="splash-content">
            <div class="logo-container">
                <div class="logo-glow"></div>
                <i data-lucide="beaker" class="main-logo-icon"></i>
            </div>
            <h1 class="splash-title">FEELING FUSION</h1>
            <p class="splash-subtitle">The Feeling Fusion Lab</p>
            
            <div class="splash-actions">
                <button id="btn-start-game" class="btn-primary pulse-button">
                    <i data-lucide="play" style="margin-right: 10px;"></i>
                    BEGIN ADVENTURE
                </button>
            </div>
        </div>
        
        <div class="splash-footer">
            <p>Master your emotions, one discovery at a time.</p>
        </div>
    </section>`;
}

export function init({ navigate }) {
    document.getElementById('btn-start-game').addEventListener('click', () => {
        sounds.click();
        navigate('tutorial');
    });
}

export function onShow() {
    // Optional: play background music or trigger animations
}
