/**
 * code/Splash.js
 */
import { sounds } from './utils/sounds.js';
import { requestFullscreen } from './utils/fullscreen.js';

export function template() {
    return /* html */`
    <section id="screen-splash" class="screen splash-screen" aria-label="Welcome to Feeling Fusion">
        <div class="lab-environment">
            <div class="chalkboard">
                <div class="formula" style="top: 15%; left: 10%;">Happiness = ?</div>
                <div class="formula" style="top: 40%; left: 80%;">Mix₂</div>
                <div class="formula" style="top: 20%; left: 65%;">Lab #42</div>
            </div>
            <div class="workbench"></div>
        </div>

        <div class="splash-overlay">
            <div class="logo-container">
                <div class="logo-glow"></div>
                <img src="assets/logo.svg" alt="Feeling Fusion Logo" class="main-logo-img">
            </div>
            <h1 class="splash-title">Feeling Fusion</h1>
            <p class="splash-subtitle">The Emotion Laboratory</p>
            
            <div class="splash-actions">
                <button id="btn-start-game" class="btn-primary pulse-button">
                    <i data-lucide="play" style="margin-right: 12px; width: 24px; height: 24px;"></i>
                    START EXPERIMENT
                </button>
            </div>

            <div class="splash-footer">
                <p>Master your emotions, one discovery at a time.</p>
            </div>
        </div>
    </section>`;
}

export function init({ navigate }) {
    document.getElementById('btn-start-game').addEventListener('click', () => {
        // IMPORTANT: Modern web browsers block fullscreen requests unless they are strictly 
        // initiated by a direct user gesture (like a click event). By calling requestFullscreen() 
        // directly inside this onClick handler, we ensure the browser allows the transition.
        requestFullscreen();

        sounds.click();
        navigate('tutorial');
    });
}

export function onShow() {
    // Optional: play background music or trigger animations
}
