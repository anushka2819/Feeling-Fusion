/**
 * code/utils/fullscreen.js
 * 
 * Utility functions for handling cross-browser fullscreen requests.
 */

export function requestFullscreen() {
    const elem = document.documentElement;
    
    try {
        let requestPromise = null;

        if (elem.requestFullscreen) {
            requestPromise = elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            requestPromise = elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            requestPromise = elem.msRequestFullscreen();
        }

        // Modern browsers return a promise from requestFullscreen, which can reject.
        // We gracefully handle the catch to avoid unhandled promise rejection console errors.
        if (requestPromise !== undefined && requestPromise !== null) {
            requestPromise.catch((err) => {
                console.warn(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
            });
        }
    } catch (err) {
        console.warn('Fullscreen request failed:', err);
    }
}

export function isFullscreen() {
    return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    );
}

export function toggleFullscreen() {
    if (isFullscreen()) {
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        } catch (err) {
            console.warn('Error exiting fullscreen:', err);
        }
    } else {
        requestFullscreen();
    }
}
