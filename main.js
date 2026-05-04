
import * as Splash from './code/Splash.js';
import * as Tutorial from './code/Tutorial.js';
import * as MoodMixer from './code/MoodMixer.js';

const app = document.getElementById('app');

const screens = {
    splash: Splash,
    tutorial: Tutorial,
    moodMixer: MoodMixer
};

function navigate(screenId) {
    console.log('Navigating to:', screenId);
    const screenModule = screens[screenId];
    
    if (screenModule) {
        // Inject the template
        app.innerHTML = screenModule.template();
        
        // Make the screen visible
        const screenElement = app.querySelector('.screen');
        if (screenElement) screenElement.classList.add('active');
        
        // Initialize the screen
        screenModule.init({ navigate });
        
        // Show the screen (run animations, etc.)
        if (screenModule.onShow) screenModule.onShow();
        
        // Create icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    } else {
        console.error('Screen not found:', screenId);
    }
}

// Initial boot
function initApp() {
    // Start with the splash screen
    navigate('splash');
}

document.addEventListener('DOMContentLoaded', initApp);
