// ============================================================
//  utils/effects.js — Visual Feedback Helpers
// ============================================================

export function spawnConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#FF80AB', '#FFD54F', '#4FC3F7', '#AED581', '#CE93D8'];

    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = Math.random() * 8 + 6 + 'px';
        piece.style.height = piece.style.width;
        piece.style.animationDuration = Math.random() * 2 + 2 + 's';
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(piece);
    }

    // Cleanup
    setTimeout(() => {
        container.remove();
    }, 4500);
}

export function spawnSparkles(el) {
    const rect = el.getBoundingClientRect();
    const count = 12;

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = rect.left + rect.width / 2 + 'px';
        sparkle.style.top = rect.top + rect.height / 2 + 'px';

        const angle = (i / count) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        sparkle.style.setProperty('--dx', `${dx}px`);
        sparkle.style.setProperty('--dy', `${dy}px`);

        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    }
}
