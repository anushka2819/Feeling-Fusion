
import * as Splash from './code/Splash.js';
import * as Tutorial from './code/Tutorial.js';
import * as MoodMixer from './code/MoodMixer.js';
import * as Success from './code/Success.js';
import * as Failure from './code/Failure.js';
import { toggleFullscreen, isFullscreen } from './code/utils/fullscreen.js';

const app = document.getElementById('app');

const screens = {
    splash: Splash,
    tutorial: Tutorial,
    moodMixer: MoodMixer,
    success: Success,
    failure: Failure
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

    const updateFsIcon = () => {
        const fsToggleBtn = document.getElementById('btn-fullscreen-toggle');
        if (!fsToggleBtn) return;
        
        fsToggleBtn.innerHTML = isFullscreen() ? '<i data-lucide="minimize"></i>' : '<i data-lucide="maximize"></i>';
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    document.addEventListener('fullscreenchange', updateFsIcon);
    document.addEventListener('webkitfullscreenchange', updateFsIcon);
    document.addEventListener('MSFullscreenChange', updateFsIcon);
}

document.addEventListener('DOMContentLoaded', initApp);
