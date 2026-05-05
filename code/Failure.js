/**
 * code/Failure.js — Failure Screen
 */
import { state } from './gameState.js';
import { sounds } from './utils/sounds.js';

export function template() {
    const target = state.targetEmotion ? state.targetEmotion.result : { name: 'Unknown' };
    
    return /* html */`
    <section id="screen-failure" class="screen failure-screen active" aria-label="Experiment Failed">
        <div class="lab-environment">
            <div class="chalkboard"></div>
            <div class="workbench"></div>
        </div>

        <div class="result-card failure">
            <div class="result-badge">FAILED</div>
            <div class="result-icon-container">
                <i data-lucide="flask-conical-off" class="result-icon-fallback"></i>
            </div>
            
            <h1 class="result-title">Reaction Volatile</h1>
            <p class="result-desc">The mixture was unstable and the experiment failed. You were unable to synthesize:</p>
            <h2 class="emotion-name" style="color: #FF5252;">${target.name}</h2>
            
            <div class="result-actions">
                <button id="btn-failure-retry" class="btn-primary" style="background: #546E7A;">
                    <i data-lucide="refresh-cw" style="margin-right: 12px;"></i>
                    RETRY MISSION
                </button>
                <button id="btn-failure-home" class="circle-btn" style="margin-top: 20px;" title="Exit to Menu">
                    <i data-lucide="home"></i>
                </button>
            </div>
        </div>
    </section>`;
}

export function init({ navigate }) {
    document.getElementById('btn-failure-retry').addEventListener('click', () => {
        sounds.click();
        navigate('moodMixer');
    });

    document.getElementById('btn-failure-home').addEventListener('click', () => {
        sounds.click();
        navigate('splash');
    });
}

export function onShow() {
    if (window.lucide) window.lucide.createIcons();
}
