import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// --- Archetype Definitions (Updated for Spirit Animal Core) ---
const ARCHETYPES = {
    Lion: {
        title: 'The Sovereign Spirit 🦁',
        emoji: '🦁',
        description: "You embody courage and commanding presence. You are a natural-born leader who faces challenges head-on, seeking to empower others through bold action and unwavering confidence. Your strength is your ability to inspire collective greatness.",
        color: 'text-yellow-400', // Changed from fuchsia
    },
    Owl: {
        title: 'The Wisdom Keeper 🦉',
        emoji: '🦉',
        description: 'You prioritize clarity, logic, and deep understanding. You are the strategist of the group, observing details others miss and crafting meticulous plans. You seek truth and knowledge above all else.',
        color: 'text-teal-400',
    },
    Dolphin: {
        title: 'The Harmonizer 🐬',
        emoji: '🐬',
        description: 'Your essence is empathy and connection. You navigate social situations with grace, promoting peace and emotional well-being within your pod. You are highly communicative and thrive when fostering deep, joyful bonds.',
        color: 'text-sky-400',
    },
    Fox: {
        title: 'The Agile Mind 🦊',
        emoji: '🦊',
        description: 'You possess unmatched wit and adaptability. You excel at lateral thinking, finding creative solutions, and leveraging loopholes. You are highly curious and move quickly, often succeeding through intelligence and charm.',
        color: 'text-amber-400',
    },
    Wolf: {
        title: 'The Loyal Guide 🐺',
        emoji: '🐺',
        description: 'You are defined by loyalty, intuition, and teamwork. You form deep, meaningful bonds and prioritize the health of your inner circle. You lead by example and rely on gut feeling to navigate life’s complex terrain.',
        color: 'text-gray-300', // New color for visual distinction
    },
    Bear: {
        title: 'The Grounded Protector 🐻',
        emoji: '🐻',
        description: 'You represent strength, stability, and introspection. You are the rock of your community, providing silent, dependable support. You value rest, inner reflection, and fiercely protect those under your care.',
        color: 'text-red-400', // New color
    },
};

// --- Quiz Questions: Index of option maps to Archetype: 0:Lion, 1:Owl, 2:Dolphin, 3:Fox, 4:Wolf, 5:Bear ---
const quizData = [
    {
        id: 1,
        question: "Group project time. What's your primary contribution to the mission?",
        options: [
            "I lead the charge and assign roles.", // Lion (0)
            "I build the perfect, color-coded plan.", // Owl (1)
            "I manage morale and check for team vibes.", // Dolphin (2)
            "I find the fastest, smartest loophole.", // Fox (3)
            "I ensure everyone's voice is represented.", // Wolf (4)
            "I tackle the boring, heavy lifting.", // Bear (5)
        ],
    },
    {
        id: 2,
        question: "When faced with an intense conflict within your friend group, you usually...",
        options: [
            "Mediate quickly; everyone needs to feel heard.", // Dolphin (2)
            "Listen privately and offer deep, intuitive counsel.", // Wolf (4)
            "Shut it down and demand a clear, quick resolution.", // Lion (0)
            "Analyze the facts and give an objective report.", // Owl (1)
            "Wait silently until I find the hidden root cause.", // Fox (3)
            "Stay out, but offer support to the most vulnerable.", // Bear (5)
        ],
    },
    {
        id: 3,
        question: "Your perfect Saturday involves...",
        options: [
            "Deep research, planning, or reading complicated non-fiction.", // Owl (1)
            "Intentional solitude and grounding activities (hiking, rest).", // Bear (5)
            "A joyful brunch and easy, fluid social hangouts.", // Dolphin (2)
            "Impulsively starting a complicated new, unique project.", // Fox (3)
            "Leading an impromptu adventure or challenging physical feat.", // Lion (0)
            "A small, close-knit gathering for deep conversations.", // Wolf (4)
        ],
    },
    {
        id: 4,
        question: "When you meet new people, your energy is usually...",
        options: [
            "Assertive, taking up space, and setting the tone.", // Lion (0)
            "Reserved and observant, analyzing group dynamics.", // Owl (1)
            "Warm, open, and instantly seeking common ground.", // Dolphin (2)
            "Witty, unpredictable, and dropping niche references.", // Fox (3)
            "Selective; seeking deep connection and trust.", // Wolf (4)
            "Calm, steady, quiet, and reassuring.", // Bear (5)
        ],
    },
    {
        id: 5,
        question: "You need to master a complex new skill. Your primary method is...",
        options: [
            "Meticulous research and a detailed, 10-step schedule.", // Owl (1)
            "Jumping in, using hacks, and learning by pure trial-and-error.", // Fox (3)
            "Finding a mentor to guide me through the pack structure.", // Wolf (4)
            "Committing fully with sheer willpower until I dominate the skill.", // Lion (0)
            "Taking it slow, focusing on deep foundational principles.", // Bear (5)
            "Joining a supportive community to learn and share.", // Dolphin (2)
        ],
    },
    {
        id: 6,
        question: "When you feel emotionally drained or overwhelmed, you prioritize...",
        options: [
            "Complete solitude to restore my quiet inner strength.", // Bear (5)
            "Immediate reach-out for validation and emotional check-in.", // Dolphin (2)
            "Gathering the inner circle for grounding and mutual support.", // Wolf (4)
            "A chaotic mini-project or inventing a clever solution to a different problem.", // Fox (3)
            "Analyzing the stressor to systematically plan its removal.", // Owl (1)
            "Pushing through to complete a high-impact task and regain control.", // Lion (0)
        ],
    },
    {
        id: 7,
        question: "How do you view taking big risks (career change, cross-country move, etc.)?",
        options: [
            "A necessary, calculated step toward the ultimate prize.", // Lion (0)
            "Exciting, a chance to outmaneuver obstacles with wit.", // Fox (3)
            "Only if it aligns with the stability of my pack/loved ones.", // Wolf (4)
            "If the reward guarantees a more grounded, stable future.", // Bear (5)
            "I analyze every outcome and create plans A, B, and C first.", // Owl (1)
            "I avoid risks that cause stress or disharmony for others.", // Dolphin (2)
        ],
    },
    {
        id: 8,
        question: "Your most effective tool for navigating a complex social situation is...",
        options: [
            "Intuition and sensing the group's unspoken needs.", // Wolf (4)
            "Witty phrasing that eases tension or changes the subject.", // Fox (3)
            "Being fully present, listening, and validating feelings.", // Dolphin (2)
            "My powerful presence, which commands automatic respect.", // Lion (0)
            "Objective analysis of unspoken rules and hierarchies.", // Owl (1)
            "Calm silence and measured reaction, which keeps others safe.", // Bear (5)
        ],
    },
    {
        id: 9,
        question: "An important system (a new app, a community rulebook) is broken or inefficient. You...",
        options: [
            "Immediately find the counter-intuitive genius hack to fix it.", // Fox (3)
            "Consult the manual/code and meticulously debug the sequence.", // Owl (1)
            "Lobby leadership for a clearer, more stable, enforced solution.", // Lion (0)
            "Seek a compromise that makes the system emotionally inclusive.", // Dolphin (2)
            "Create a temporary workaround to keep the team's flow uninterrupted.", // Wolf (4)
            "Disengage until the dust settles and a stable, long-term fix emerges.", // Bear (5)
        ],
    },
    {
        id: 10,
        question: "What is your most powerful internal driver or core motivation?",
        options: [
            "Status, achievement, and being acknowledged as the best.", // Lion (0)
            "The relentless pursuit of truth, mastery, and intellectual perfection.", // Owl (1)
            "Ensuring all my loved ones are happy, supported, and connected.", // Dolphin (2)
            "The thrill of discovery and always being one step ahead.", // Fox (3)
            "The deep need for profound loyalty and the success of my chosen family.", // Wolf (4)
            "Commitment to stability, resilience, and quiet strength.", // Bear (5)
        ],
    },
];

const App = () => {
    const navigate = useNavigate();
    // Dynamically generate initial scores based on ARCHETYPES keys
    const initialScores = Object.keys(ARCHETYPES).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [scores, setScores] = useState(initialScores);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isFlipping, setIsFlipping] = useState(false);

    const progress = currentQuestionIndex >= 0 ? currentQuestionIndex / quizData.length * 100 : 0;

    const handleStart = useCallback(() => {
        setIsFlipping(true);
        setTimeout(() => {
            setCurrentQuestionIndex(0);
            setIsFlipping(false);
        }, 300);
    }, []);

    const handleAnswer = useCallback((index) => {
        if (selectedIndex !== null) return;
        setSelectedIndex(index);
    }, [selectedIndex]);

    const handleNext = useCallback(() => {
        if (selectedIndex === null) return;

        // Map the selected index to the archetype and update score
        const archetypeKeys = Object.keys(ARCHETYPES);
        const selectedArchetype = archetypeKeys[selectedIndex];

        setScores(s => ({
            ...s,
            [selectedArchetype]: s[selectedArchetype] + 1
        }));

        setIsFlipping(true);
        setTimeout(() => {
            setSelectedIndex(null);
            setCurrentQuestionIndex(i => i + 1);
            setIsFlipping(false);
        }, 300);
    }, [selectedIndex]);

    const handleRestart = useCallback(() => {
        setIsFlipping(true);
        setTimeout(() => {
            setCurrentQuestionIndex(-1);
            setScores(initialScores);
            setSelectedIndex(null);
            setIsFlipping(false);
        }, 300);
    }, [initialScores]);

    const getResultArchetype = () => {
        // Find the archetype with the highest score (ties go to the first one found)
        let resultTypes = [];
        let currentMax = -1;

        Object.entries(scores).forEach(([type, score]) => {
            if (score > currentMax) {
                currentMax = score;
                resultTypes = [type];
            } else if (score === currentMax) {
                resultTypes.push(type);
            }
        });
        
        return ARCHETYPES[resultTypes[0]];
    };

    const renderResults = () => {
        const result = getResultArchetype();

        return (
            <div className={`quiz-card p-8 md:p-12 space-y-8 flex flex-col justify-center items-center text-center ${isFlipping ? 'flip-out' : 'flip-in'}`}>
                <div className="space-y-6">
                    <h2 className="pixel-font text-4xl md:text-5xl font-extrabold text-white leading-tight">
                        🌟 Your Spirit Animal is... {result.emoji}
                    </h2>
                    
                    <h3 className={`text-3xl md:text-4xl font-bold ${result.color} mt-4`}>
                        {result.title}
                    </h3>

                    <p className="text-md sm:text-lg text-purple-200 mt-4 max-w-lg">
                        {result.description}
                    </p>

                    {/* Removed the detailed Alignment Score breakdown for a cleaner result */}
                </div>
                <button onClick={handleRestart} className="option-button font-bold py-3 px-8 rounded-full text-lg mt-6">
                    Find Your Inner Calling (Again)
                </button>
            </div>
        );
    };

    const renderQuestion = () => {
        const currentQuestion = quizData[currentQuestionIndex];
        const hasSelected = selectedIndex !== null;

        return (
            <div className={`quiz-card p-8 md:p-12 space-y-6 flex flex-col justify-center ${isFlipping ? 'flip-out' : 'flip-in'}`}>
                <div className="text-lg md:text-xl font-bold text-cyan-400 text-center pixel-font">
                    Question {currentQuestionIndex + 1} of {quizData.length}
                </div>
                <p className="text-xl md:text-2xl font-semibold text-white text-center">
                    {currentQuestion.question}
                </p>
                <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button w-full text-left py-3 px-6 rounded-xl text-md sm:text-lg transition duration-300 
                                ${hasSelected && selectedIndex !== index ? 'opacity-30' : ''}
                                ${selectedIndex === index ? 'selected' : ''}`}
                            onClick={() => handleAnswer(index)}
                            disabled={hasSelected}
                        >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + index)})</span> {option}
                        </button>
                    ))}
                </div>
                {hasSelected && (
                    <div className="flex justify-center">
                        <button onClick={handleNext} className="option-button font-bold py-3 px-8 text-lg rounded-full mt-4">
                            Next Challenge
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderWelcome = () => (
        <div className={`quiz-card p-8 md:p-12 space-y-8 flex flex-col justify-center items-center text-center ${isFlipping ? 'flip-out' : 'flip-in'}`}>
            <div className="space-y-6">
                <h1 className="pixel-font text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                    Spirit Animal Quiz
                </h1>
                <p className="text-md sm:text-lg text-purple-200 max-w-lg">
                    Journey into your subconscious! Identify the dominant Spirit Animal whose unique <span className="font-extrabold text-cyan-300">strengths</span> and <span className="font-extrabold text-cyan-300">instincts</span> guide your path.
                </p>
                <button onClick={handleStart} className="option-button font-bold py-3 px-8 text-lg rounded-full">
                    Begin the Journey
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-transparent text-white overflow-hidden">
            <style>{`
                /* Global styles using Tailwind CSS */
                @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
                
                .pixel-font { 
                    font-family: 'VT323', monospace; 
                    text-shadow: 2px 2px #000000; 
                }
                .quiz-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    border: 2px solid;
                    border-image: linear-gradient(45deg, #ff00ff, #00ffff) 1;
                    box-shadow: 0 0 15px rgba(255, 0, 255, 0.4), 0 0 15px rgba(0, 255, 255, 0.4);
                    transform-style: preserve-3d;
                    transition: transform 0.6s, opacity 0.6s;
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                /* Flip animation keyframes */
                .flip-container { 
                    position: relative; 
                    perspective: 1000px; 
                    width: 100%; 
                    min-height: 500px; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center;
                }
                .flip-in { transform: rotateY(0deg); opacity: 1; }
                .flip-out { transform: rotateY(180deg); opacity: 0; }
                
                .option-button {
                    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out, opacity 0.3s ease-in-out, background 0.1s;
                    background: #1e3a8a; /* Dark Blue */
                    color: #e0f2fe; /* Light Blue Text */
                    border: 2px solid #00ffff;
                    text-shadow: 1px 1px #ff00ff;
                    box-shadow: 4px 4px 0px #ff00ff;
                    outline: none;
                }
                .option-button:hover:not(.selected):not(:disabled) { 
                    transform: translateY(-4px); 
                    box-shadow: 6px 6px 0px #ff00ff;
                    background: #00ffff;
                    color: #0c0b2c;
                }
                .option-button.selected {
                    transform: translateY(-2px) scale(1.01);
                    background: #ff00ff; /* Fuchsia for selected */
                    color: #0c0b2c;
                    border-color: #00ffff;
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 4px 4px 0px #00ffff;
                    filter: brightness(1.1);
                }
                .option-button:disabled { cursor: not-allowed; }
                
                .progress-bar {
                    height: 12px;
                    background: linear-gradient(90deg, #ff00ff 0%, #00ffff 100%);
                    width: 0%;
                    transition: width 0.6s ease-in-out;
                    border-radius: 9999px;
                    box-shadow: 0 0 8px rgba(255, 0, 255, 0.6), 0 0 8px rgba(0, 255, 255, 0.6);
                }
            `}</style>
            
            <div className="fixed top-0 left-0 right-0 h-3 bg-transparent z-50 p-2">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            
            {/* Discreet Exit Button - Visible ONLY during the quiz */}
            {currentQuestionIndex >= 0 && currentQuestionIndex < quizData.length && (
                 <button 
                    onClick={() => navigate('/quizzes')}
                    className="fixed top-8 left-4 md:left-8 z-40 text-cyan-200/70 hover:text-cyan-100 transition-all duration-300 flex items-center gap-2 text-xl pixel-font tracking-wide hover:scale-105 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:border-cyan-400/50 group"
                    aria-label="Exit Quiz"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>EXIT</span>
                </button>
            )}
            
            <div className="w-full max-w-xl mx-auto p-4 md:p-8 flip-container">
                {currentQuestionIndex === -1 && renderWelcome()}
                {currentQuestionIndex >= 0 && currentQuestionIndex < quizData.length && renderQuestion()}
                {currentQuestionIndex === quizData.length && renderResults()}
            </div>
        </div>
    );
};

export default App;