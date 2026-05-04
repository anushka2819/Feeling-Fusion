/**
 * moodMixerData.js
 * 
 * Recipes for "The Feeling Fusion Lab" (Emotion Mixing Game)
 * Total 28 combinations for 8 basic emotions.
 */

export const MIXING_RECIPES = [
    // Primary Dyads
    { e1: 'joy', e2: 'trust', result: { id: 'love', name: 'Love', description: 'A warm, fuzzy feeling for someone special.', icon: 'assets/feeling_fusion/love.svg', color: '#F06292' } },
    { e1: 'trust', e2: 'fear', result: { id: 'submission', name: 'Humble', description: 'A quiet feeling of respect and safety.', icon: 'assets/feeling_fusion/humble.svg', color: '#81C784' } },
    { e1: 'fear', e2: 'surprise', result: { id: 'awe', name: 'Awe', description: 'When something is so big and amazing it surprises you!', icon: 'assets/feeling_fusion/awe.svg', color: '#BA68C8' } },
    { e1: 'surprise', e2: 'sadness', result: { id: 'disapproval', name: 'Disapproval', description: 'When something unexpected makes you feel a bit sad or let down.', icon: 'assets/feeling_fusion/disapproval.svg', color: '#9575CD' } },
    { e1: 'sadness', e2: 'disgust', result: { id: 'remorse', name: 'Remorse', description: 'The "Oh no" feeling after we do something we regret.', icon: 'assets/feeling_fusion/remorse.svg', color: '#7986CB' } },
    { e1: 'disgust', e2: 'anger', result: { id: 'contempt', name: 'Contempt', description: 'When you really dont like what someone is doing.', icon: 'assets/feeling_fusion/contempt.svg', color: '#AFB42B' } },
    { e1: 'anger', e2: 'anticipation', result: { id: 'aggressiveness', name: 'Determined', description: 'When you are ready to take on a big challenge!', icon: 'assets/feeling_fusion/determined.svg', color: '#E53935' } },
    { e1: 'anticipation', e2: 'joy', result: { id: 'optimism', name: 'Optimism', description: 'Looking forward to great things with a smile!', icon: 'assets/feeling_fusion/optimistic.svg', color: '#FFB300' } },

    // Secondary Dyads
    { e1: 'joy', e2: 'fear', result: { id: 'guilt', name: 'Shy', description: 'A bit happy but also a bit worried about being seen.', icon: 'assets/feeling_fusion/shy.svg', color: '#FFD54F' } },
    { e1: 'trust', e2: 'surprise', result: { id: 'curiosity', name: 'Curiosity', description: 'Wanting to know more about something new and safe.', icon: 'assets/feeling_fusion/curiosity.svg', color: '#4DB6AC' } },
    { e1: 'fear', e2: 'sadness', result: { id: 'despair', name: 'Despair', description: 'Feeling very lost and a little bit scared.', icon: 'assets/feeling_fusion/despair.svg', color: '#5C6BC0' } },
    { e1: 'surprise', e2: 'disgust', result: { id: 'unbelief', name: 'Shocked', description: 'When something is so yucky you cant believe it!', icon: 'assets/feeling_fusion/unbelief.svg', color: '#CDDC39' } },
    { e1: 'sadness', e2: 'anger', result: { id: 'envy', name: 'Envy', description: 'Wanting what someone else has and feeling sad about it.', icon: 'assets/feeling_fusion/envy.svg', color: '#66BB6A' } },
    { e1: 'disgust', e2: 'anticipation', result: { id: 'cynicism', name: 'Pickiness', description: 'Being very careful and choosy about what you like.', icon: 'assets/feeling_fusion/cynicism.svg', color: '#C0CA33' } },
    { e1: 'anger', e2: 'joy', result: { id: 'pride', name: 'Pride', description: 'Feeling like a champion for doing something great!', icon: 'assets/feeling_fusion/pride.svg', color: '#FF8A65' } },
    { e1: 'anticipation', e2: 'trust', result: { id: 'hope', name: 'Hope', description: 'Waiting for something good to happen with a friend.', icon: 'assets/feeling_fusion/hope.svg', color: '#81C784' } },

    // Tertiary Dyads & Others
    { e1: 'joy', e2: 'surprise', result: { id: 'delight', name: 'Delight', description: 'A wonderful, happy surprise!', icon: 'assets/feeling_fusion/delight.svg', color: '#F06292' } },
    { e1: 'joy', e2: 'disgust', result: { id: 'morbid', name: 'Silliness', description: 'Doing something yucky because it is funny!', icon: 'assets/feeling_fusion/silliness.svg', color: '#DCE775' } },
    { e1: 'trust', e2: 'sadness', result: { id: 'empathy', name: 'Empathy', description: 'Feeling sad together because you care about each other.', icon: 'assets/feeling_fusion/empathy.svg', color: '#64B5F6' } },
    { e1: 'trust', e2: 'anger', result: { id: 'dominance', name: 'Strong', description: 'Feeling powerful and safe at the same time.', icon: 'assets/feeling_fusion/strong.svg', color: '#43A047' } },
    { e1: 'fear', e2: 'disgust', result: { id: 'shame', name: 'Shame', description: 'Feeling yucky because you are worried about a mistake.', icon: 'assets/feeling_fusion/shame.svg', color: '#9E9E9E' } },
    { e1: 'fear', e2: 'anticipation', result: { id: 'anxiety', name: 'Anxiety', description: 'Waiting for something that might be a bit scary.', icon: 'assets/feeling_fusion/anxiety.svg', color: '#9575CD' } },
    { e1: 'surprise', e2: 'anticipation', result: { id: 'confusion', name: 'Confusion', description: 'When your brain is waiting for one thing but gets another!', icon: 'assets/feeling_fusion/confusion.svg', color: '#E1BEE7' } },
    { e1: 'surprise', e2: 'anger', result: { id: 'outrage', name: 'Surprised Anger', description: 'When something unexpected makes you very cross.', icon: 'assets/feeling_fusion/outrage.svg', color: '#FF1744' } },
    { e1: 'sadness', e2: 'anticipation', result: { id: 'pessimism', name: 'Pessimism', description: 'Waiting for things that you think might be sad.', icon: 'assets/feeling_fusion/pessimism.svg', color: '#B0BEC5' } },
    { e1: 'anger', e2: 'disgust', result: { id: 'contempt_2', name: 'Yucky Anger', description: 'Feeling angry at something very gross.', icon: 'assets/feeling_fusion/contempt_2.svg', color: '#827717' } },
    { e1: 'surprise', e2: 'trust', result: { id: 'trusting_surprise', name: 'A Maze', description: 'Finding something new and exciting with someone you trust.', icon: 'assets/feeling_fusion/maze.svg', color: '#4DB6AC' } },
    { e1: 'joy', e2: 'sadness', result: { id: 'bittersweet', name: 'Bittersweet', description: 'Being happy and sad at the same time. Like growing up!', icon: 'assets/feeling_fusion/bittersweet.svg', color: '#CE93D8' } },
    { e1: 'anger', e2: 'fear', result: { id: 'panic', name: 'Panic', description: 'When everything feels like it\'s moving too fast and you\'re not sure what to do next. Take a deep breath!', icon: 'assets/feeling_fusion/panic.svg', color: '#D81B60' } }
];
