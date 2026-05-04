# Utility Modules

This directory contains standalone helper modules that provide specific functionality used across multiple screens or components.

## Modules

| File | Responsibility | Key Exported Functions |
| :--- | :--- | :--- |
| `storage.js` | Persistent data handling via `localStorage`. | `savePlayer`, `loadPlayer`, `saveHighscore`, `clearStorage` |
| `sounds.js` | Audio engine for music and sound effects. | `sounds.init()`, `sounds.play(id)`, `sounds.toggleMute()` |
| `effects.js` | Visual feedback and micro-animations. | `spawnConfetti()`, `spawnSparkles(element)` |

## Usage Examples

### Playing a Sound
```javascript
import { sounds } from '../utils/sounds.js';
sounds.click(); // Standard button click
```

### Saving Player Progress
```javascript
import { savePlayer } from '../utils/storage.js';
savePlayer({ name: 'Alex', avatar: 'volcano.svg' });
```

### Triggering a Celebration
```javascript
import { spawnConfetti } from '../utils/effects.js';
spawnConfetti();
```

## Best Practices
- **Isolation**: Utils should not depend on screens to avoid circular dependencies.
- **Fallbacks**: Always provide fallbacks for browser APIs (like `localStorage` or `AudioContext`) if they are unavailable.
- **Cleanup**: Visual effects in `effects.js` should automatically remove themselves from the DOM after the animation completes.
