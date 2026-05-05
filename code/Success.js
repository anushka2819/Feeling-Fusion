/**
 * code/Success.js — Victory Screen
 */
import { state } from './gameState.js';
import { sounds } from './utils/sounds.js';

export function template() {
    const result = state.lastResult || { name: 'Emotion', icon: 'assets/feeling_fusion/joy_select.svg' };
    
    return /* html */`
    <section id="screen-success" class="screen success-screen active" aria-label="Experiment Successful">
        <div class="lab-environment">
            <div class="chalkboard"></div>
            <div class="workbench"></div>
        </div>

        <div class="result-card success">
            <div class="result-badge">SUCCESS</div>
            <div class="result-icon-container">
                <img src="${result.icon}" alt="${result.name}" class="result-icon pulse-animation">
            </div>
            
            <h1 class="result-title">New Discovery!</h1>
            <h2 class="emotion-name">${result.name}</h2>
            <p class="result-desc">${result.description || 'You have successfully synthesized a new emotion in the lab.'}</p>
            
            <div class="result-actions">
                <button id="btn-success-continue" class="btn-primary">
                    <i data-lucide="flask-conical" style="margin-right: 12px;"></i>
                    NEXT EXPERIMENT
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
}

export function onShow() {
    if (window.lucide) window.lucide.createIcons();
}
