/**
 * code/Success.js — Victory Screen
 */
import { state } from './gameState.js';
import { sounds } from './utils/sounds.js';

export function template() {
    const result = state.lastResult || { name: 'Emotion', icon: 'assets/elements/joy_select.svg' };
    
    return /* html */`
    <section id="screen-success" class="screen success-screen active" aria-label="Experiment Successful">
        <div class="lab-environment">
            <div class="chalkboard"></div>
            <div class="workbench"></div>
        </div>

        <div class="result-card success">
            <div class="result-badge">YOU WON!</div>
            <div class="result-icon-container">
                <img src="${result.icon}" alt="${result.name}" class="result-icon pulse-animation">
            </div>
            
            <h1 class="result-title">Mission Accomplished</h1>
            <h2 class="emotion-name">${result.name}</h2>
            <p class="result-desc">Excellent work, Scientist! You correctly identified the elements of <b>${result.name}</b>.</p>
            
            <div class="result-actions">
                <button id="btn-success-continue" class="btn-primary">
                    <i data-lucide="flask-conical" style="margin-right: 12px;"></i>
                    NEXT MISSION
                </button>
                <button id="btn-success-home" class="circle-btn" style="margin-top: 20px;" title="Exit to Menu">
                    <i data-lucide="home"></i>
                </button>
            </div>
        </div>
    </section>`;
}

export function init({ navigate }) {
    document.getElementById('btn-success-continue').addEventListener('click', () => {
        sounds.click();
        navigate('moodMixer');
    });

    document.getElementById('btn-success-home').addEventListener('click', () => {
        sounds.click();
        navigate('splash');
    });
}

export function onShow() {
    if (window.lucide) window.lucide.createIcons();
}
