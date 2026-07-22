/**
 * moodMixerData.js
 * 
 * Recipes for "The Feeling Fusion Lab" (Emotion Mixing Game)
 * Total 28 combinations for 8 basic emotions.
 */

export const MIXING_RECIPES = [
    // --- The 28 Unique Basic Emotion Pairs ---
    // JOY pairs (7)
    { e1: 'joy', e2: 'trust', result: { id: 'love', name: 'Love & Peace', description: 'A warm, fuzzy feeling for someone special.', icon: 'assets/results/love.svg', color: '#F06292' } },
    { e1: 'joy', e2: 'fear', result: { id: 'guilt', name: 'Shy', description: 'A bit happy but also a bit worried about being seen.', icon: 'assets/results/shy.svg', color: '#FFD54F' } },
    { e1: 'joy', e2: 'surprise', result: { id: 'delight', name: 'Delight', description: 'A wonderful, happy surprise!', icon: 'assets/results/delight.svg', color: '#F06292' } },
    { e1: 'joy', e2: 'sadness', result: { id: 'bittersweet', name: 'Bittersweet', description: 'Being happy and sad at the same time. Like growing up!', icon: 'assets/results/bittersweet.svg', color: '#CE93D8' } },
    { e1: 'joy', e2: 'disgust', result: { id: 'morbid', name: 'Silliness', description: 'Doing something yucky because it is funny!', icon: 'assets/results/silliness.svg', color: '#DCE775' } },
    { e1: 'joy', e2: 'anger', result: { id: 'pride', name: 'Pride', description: 'Feeling like a champion for doing something great!', icon: 'assets/results/pride.svg', color: '#FF8A65' } },
    { e1: 'joy', e2: 'anticipation', result: { id: 'optimism', name: 'Optimism', description: 'Looking forward to great things with a smile!', icon: 'assets/results/optimistic.svg', color: '#FFB300' } },

    // TRUST pairs (6 remaining)
    { e1: 'trust', e2: 'fear', result: { id: 'submission', name: 'Safety', description: 'A quiet feeling of respect and being safe.', icon: 'assets/results/humble.svg', color: '#81C784' } },
    { e1: 'trust', e2: 'surprise', result: { id: 'curiosity', name: 'Curiosity', description: 'Wanting to know more about something new and safe.', icon: 'assets/results/curiosity.svg', color: '#4DB6AC' } },
    { e1: 'trust', e2: 'sadness', result: { id: 'empathy', name: 'Empathy', description: 'Feeling sad together because you care about each other.', icon: 'assets/results/empathy.svg', color: '#64B5F6' } },
    { e1: 'trust', e2: 'disgust', result: { id: 'peace', name: 'Peace', description: 'The calm, happy feeling of being safe and loved.', icon: 'assets/results/peace.svg', color: '#81C784' } }, // Reassigned to avoid duplicate with Joy
    { e1: 'trust', e2: 'anger', result: { id: 'dominance', name: 'Strong', description: 'Feeling powerful and safe at the same time.', icon: 'assets/results/strong.svg', color: '#43A047' } },
    { e1: 'trust', e2: 'anticipation', result: { id: 'hope', name: 'Hope', description: 'Waiting for something good to happen with a friend.', icon: 'assets/results/hope.svg', color: '#81C784' } },

    // FEAR pairs (5 remaining)
    { e1: 'fear', e2: 'surprise', result: { id: 'awe', name: 'Wonder', description: 'When something is so big and amazing it surprises you!', icon: 'assets/results/awe.svg', color: '#BA68C8' } },
    { e1: 'fear', e2: 'sadness', result: { id: 'despair', name: 'Despair', description: 'Feeling very lost and a little bit scared.', icon: 'assets/results/despair.svg', color: '#5C6BC0' } },
    { e1: 'fear', e2: 'disgust', result: { id: 'shame', name: 'Shame', description: 'Feeling yucky because you are worried about a mistake.', icon: 'assets/results/shame.svg', color: '#9E9E9E' } },
    { e1: 'fear', e2: 'anger', result: { id: 'panic', name: 'Panic', description: 'When everything feels like it\'s moving too fast.', icon: 'assets/results/panic.svg', color: '#D81B60' } },
    { e1: 'fear', e2: 'anticipation', result: { id: 'anxiety', name: 'Anxiety', description: 'Waiting for something that might be a bit scary.', icon: 'assets/results/anxiety.svg', color: '#9575CD' } },

    // SURPRISE pairs (4 remaining)
    { e1: 'surprise', e2: 'sadness', result: { id: 'disapproval', name: 'Disapproval', description: 'When something unexpected makes you feel a bit sad.', icon: 'assets/results/disapproval.svg', color: '#9575CD' } },
    { e1: 'surprise', e2: 'disgust', result: { id: 'unbelief', name: 'Shocked', description: 'When something is so yucky you can\'t believe it!', icon: 'assets/results/unbelief.svg', color: '#CDDC39' } },
    { e1: 'surprise', e2: 'anger', result: { id: 'outrage', name: 'Surprised Anger', description: 'When something unexpected makes you very cross.', icon: 'assets/results/outrage.svg', color: '#FF1744' } },
    { e1: 'surprise', e2: 'anticipation', result: { id: 'confusion', name: 'Confusion', description: 'When your brain is waiting for one thing but gets another!', icon: 'assets/results/confusion.svg', color: '#E1BEE7' } },

    // SADNESS pairs (3 remaining)
    { e1: 'sadness', e2: 'disgust', result: { id: 'remorse', name: 'Regret', description: 'The "Oh no" feeling after we do something we wish we hadn\'t.', icon: 'assets/results/remorse.svg', color: '#7986CB' } },
    { e1: 'sadness', e2: 'anger', result: { id: 'envy', name: 'Envy', description: 'Wanting what someone else has and feeling sad about it.', icon: 'assets/results/envy.svg', color: '#66BB6A' } },
    { e1: 'sadness', e2: 'anticipation', result: { id: 'pessimism', name: 'Pessimism', description: 'Waiting for things that you think might be sad.', icon: 'assets/results/pessimism.svg', color: '#B0BEC5' } },

    // DISGUST pairs (2 remaining)
    { e1: 'disgust', e2: 'anger', result: { id: 'contempt', name: 'Contempt', description: 'When you really don\'t like what someone is doing.', icon: 'assets/results/contempt.svg', color: '#AFB42B' } },
    { e1: 'disgust', e2: 'anticipation', result: { id: 'cynicism', name: 'Pickiness', description: 'Being very careful and choosy about what you like.', icon: 'assets/results/cynicism.svg', color: '#C0CA33' } },

    // ANGER pairs (1 remaining)
    { e1: 'anger', e2: 'anticipation', result: { id: 'aggressiveness', name: 'Determined', description: 'When you are ready to take on a big challenge!', icon: 'assets/results/determined.svg', color: '#E53935' } },

    // --- TIER 3 (MIXED + BASIC) RECIPES ---
    { e1: 'love', e2: 'joy', result: { id: 'bliss', name: 'Bliss', description: 'Pure, absolute happiness and love!', icon: 'assets/results/delight.svg', color: '#FF80AB' } },
    { e1: 'pride', e2: 'trust', result: { id: 'honor', name: 'Honor', description: 'Feeling proud to be trusted and doing the right thing.', icon: 'assets/results/strong.svg', color: '#FFD54F' } },
    { e1: 'awe', e2: 'anticipation', result: { id: 'magic', name: 'Magic', description: 'The amazing feeling that anything is possible!', icon: 'assets/results/curiosity.svg', color: '#B388FF' } },
    { e1: 'optimism', e2: 'trust', result: { id: 'faith', name: 'Faith', description: 'Knowing that everything will work out perfectly.', icon: 'assets/results/hope.svg', color: '#4DD0E1' } },
    { e1: 'delight', e2: 'surprise', result: { id: 'euphoria', name: 'Euphoria', description: 'The most exciting, happy surprise ever!', icon: 'assets/results/excitement.svg', color: '#FF4081' } }
];
