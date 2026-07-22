import { state, saveProgress } from './gameState.js';
import { sounds } from './utils/sounds.js';

export function template() {
    return `
    <section id="screen-saga-map" class="screen" aria-label="Saga Map">
        <header style="position: absolute; top: 20px; left: 20px; z-index: 10;">
            <button id="btn-saga-back" class="circle-btn" title="Back to Menu" style="background: rgba(0,0,0,0.5); border: 2px solid #FFF; color: #FFF; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <i data-lucide="arrow-left"></i>
            </button>
        </header>
        
        <div class="saga-container" style="width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; position: relative; background: linear-gradient(180deg, #0288D1 0%, #81D4FA 50%, #E0F7FA 100%); padding: 100px 0;">
            <div style="text-align: center; margin-bottom: 20px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                <h1 style="color: #FFF; font-size: 2.8rem; margin: 0; font-weight: 900; -webkit-text-stroke: 2px #01579B;">EMOTION SAGA MAP</h1>
                <p style="color: #E0F7FA; font-size: 1.1rem; margin-top: 5px; font-weight: bold;">Tap an unlocked level to play!</p>
            </div>
            
            <svg id="saga-path" style="position: absolute; top: 180px; left: 0; width: 100%; height: 1000px; pointer-events: none;"></svg>
            <div id="level-nodes-container" style="position: relative; width: 100%; height: 1000px;">
                <!-- Populated by JS -->
            </div>
        </div>
    </section>
    `;
}

let localNavigate = null;

export function init({ navigate }) {
    localNavigate = navigate;
    document.getElementById('btn-saga-back').addEventListener('click', () => {
        sounds.click();
        localNavigate('splash');
    });
}

export function onShow() {
    renderMap();
}

function renderMap() {
    const container = document.getElementById('level-nodes-container');
    const pathSvg = document.getElementById('saga-path');
    if (!container || !pathSvg) return;

    container.innerHTML = '';
    
    const numLevels = 10;
    const pathPoints = [];
    const stepY = 85;
    
    for (let i = 1; i <= numLevels; i++) {
        const isUnlocked = i <= state.unlockedLevels;
        const stars = state.starsPerLevel[i] || 0;
        
        const y = 900 - (i * stepY);
        const x = 50 + Math.sin(i * 1.5) * 35;

        pathPoints.push(`${x}% ${y}px`);

        const node = document.createElement('div');
        node.className = `level-node ${isUnlocked ? 'unlocked' : 'locked'}`;
        node.style.position = 'absolute';
        node.style.left = `calc(${x}% - 35px)`;
        node.style.top = `${y - 35}px`;
        node.style.width = '70px';
        node.style.height = '70px';
        node.style.borderRadius = '50%';
        node.style.background = isUnlocked ? 'linear-gradient(180deg, #FFEB3B, #F57F17)' : '#78909C';
        node.style.border = '4px solid #FFF';
        node.style.boxShadow = isUnlocked ? '0 8px 20px rgba(255, 235, 59, 0.6), inset 0 -4px 0 rgba(0,0,0,0.3)' : '0 4px 10px rgba(0,0,0,0.3)';
        node.style.display = 'flex';
        node.style.flexDirection = 'column';
        node.style.alignItems = 'center';
        node.style.justifyContent = 'center';
        node.style.cursor = isUnlocked ? 'pointer' : 'not-allowed';
        node.style.transition = 'transform 0.2s';

        node.innerHTML = `
            <div style="font-size: 1.6rem; font-weight: 900; color: ${isUnlocked ? '#37474F' : '#ECEFF1'}; text-shadow: ${isUnlocked ? '0 1px 0 #FFF' : 'none'};">${i}</div>
            <div style="display: flex; gap: 2px; margin-top: -2px;">
                <i data-lucide="star" style="width: 14px; height: 14px; fill: ${stars >= 1 ? '#FFD700' : 'rgba(0,0,0,0.2)'}; stroke: ${stars >= 1 ? '#FF6F00' : '#FFF'};"></i>
                <i data-lucide="star" style="width: 14px; height: 14px; fill: ${stars >= 2 ? '#FFD700' : 'rgba(0,0,0,0.2)'}; stroke: ${stars >= 2 ? '#FF6F00' : '#FFF'};"></i>
                <i data-lucide="star" style="width: 14px; height: 14px; fill: ${stars >= 3 ? '#FFD700' : 'rgba(0,0,0,0.2)'}; stroke: ${stars >= 3 ? '#FF6F00' : '#FFF'};"></i>
            </div>
        `;
        
        if (isUnlocked) {
            node.addEventListener('mouseover', () => { node.style.transform = 'scale(1.15)'; });
            node.addEventListener('mouseout', () => { node.style.transform = 'scale(1)'; });
            node.addEventListener('click', () => {
                sounds.click();
                state.currentLevel = i;
                saveProgress();
                localNavigate('match3');
            });
        }
        
        container.appendChild(node);
    }

    if (pathPoints.length > 1) {
        pathSvg.innerHTML = `<polyline points="${pathPoints.join(', ')}" fill="none" stroke="#FFF" stroke-width="8" stroke-dasharray="12,12" opacity="0.8" />`;
    }
}
