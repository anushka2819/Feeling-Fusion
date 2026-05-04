import { state } from '../gameState.js';

/**
 * Reads text aloud using the browser's Speech Synthesis.
 * Useful for young children who cannot yet read.
 */
export function speakText(text) {
    if (!state.speechEnabled) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: Try to find a child-friendly or high-quality voice
    const voices = window.speechSynthesis.getVoices();
    // Default to a clear English voice if possible
    const enVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'));
    if (enVoice) utterance.voice = enVoice;
    
    utterance.pitch = 1.2; // Slightly higher pitch for child-friendly feel
    utterance.rate = 1.0;  // Normal speed
    
    window.speechSynthesis.speak(utterance);
}

/**
 * Applies global accessibility styles and focus behavior.
 */
export function applyAccessibilitySettings() {
    const root = document.documentElement;

    // 1. High Contrast
    root.classList.toggle('a11y-high-contrast', !!state.highContrast);

    // 2. Dyslexic Font
    root.classList.toggle('a11y-dyslexic-font', !!state.dyslexicFont);

    // 3. Reduced Motion
    root.classList.toggle('a11y-reduced-motion', !!state.reducedMotion);
}
