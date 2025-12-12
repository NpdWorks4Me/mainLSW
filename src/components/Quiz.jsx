import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quizData = {
  pages: [
    {
      questions: [
        {
          question: "When you're feeling little, what's your go-to activity?",
          choices: [
            { text: "Coloring & drawing", value: "creative" },
            { text: "Watching cartoons", value: "passive" },
            { text: "Building with blocks", value: "constructive" },
            { text: "Cuddling with a stuffie", value: "comfort" },
          ],
        },
        {
          question: "Pick a magical creature sidekick:",
          choices: [
            { text: "A sparkly unicorn", value: "magical" },
            { text: "A fluffy dragon", value: "adventurous" },
            { text: "A talking kitten", value: "social" },
            { text: "A wise old owl", value: "calm" },
          ],
        },
        {
          question: "What's the best kind of snack?",
          choices: [
            { text: "Animal crackers", value: "classic" },
            { text: "Gummy bears", value: "sweet" },
            { text: "Apple slices", value: "healthy" },
            { text: "Goldfish crackers", value: "savory" },
          ],
        },
        {
          question: "Your ideal little space is:",
          choices: [
            { text: "A cozy blanket fort", value: "cozy" },
            { text: "A sunny playroom", value: "energetic" },
            { text: "A quiet reading nook", value: "peaceful" },
            { text: "A magical forest", value: "imaginative" },
          ],
        },
      ],
    },
    {
      questions: [
        {
          question: "Choose a superpower:",
          choices: [
            { text: "Flying", value: "freedom" },
            { text: "Invisibility", value: "shy" },
            { text: "Talking to animals", value: "nurturing" },
            { text: "Super strength", value: "playful" },
          ],
        },
        {
          question: "What's your favorite type of story?",
          choices: [
            { text: "Fairy tales with happy endings", value: "classic" },
            { text: "Adventures in far-off lands", value: "adventurous" },
            { text: "Silly stories that make you giggle", value: "humorous" },
            { text: "Bedtime stories that are calm and soothing", value: "comfort" },
          ],
        },
        {
          question: "If you could have any pet, it would be:",
          choices: [
            { text: "A playful puppy", value: "energetic" },
            { text: "A cuddly bunny", value: "gentle" },
            { text: "A colorful fish", value: "calm" },
            { text: "A mischievous ferret", value: "playful" },
          ],
        },
        {
          question: "What do you wear to feel your littlest?",
          choices: [
            { text: "A comfy onesie", value: "cozy" },
            { text: "A twirly dress or cape", value: "imaginative" },
            { text: "Cute overalls", value: "playful" },
            { text: "Pajamas, any time of day!", value: "relaxed" },
          ],
        },
      ],
    },
    {
      questions: [
        {
          question: "What's the best sound?",
          choices: [
            { text: "Rain on the window", value: "calm" },
            { text: "Giggles", value: "happy" },
            { text: "A crackling fireplace", value: "cozy" },
            { text: "Cartoon sound effects", value: "silly" },
          ],
        },
        {
          question: "Pick a dream vacation:",
          choices: [
            { text: "A trip to a theme park", value: "exciting" },
            { text: "Camping under the stars", value: "adventurous" },
            { text: "A cozy cabin in the woods", value: "peaceful" },
            { text: "Building sandcastles at the beach", value: "creative" },
          ],
        },
        {
          question: "What's your favorite thing to drink from?",
          choices: [
            { text: "A sippy cup", value: "young" },
            { text: "A fun straw cup", value: "playful" },
            { text: "A big, colorful mug", value: "cozy" },
            { text: "A juice box", value: "classic" },
          ],
        },
        {
          question: "How do you show you're happy?",
          choices: [
            { text: "Clapping my hands", value: "expressive" },
            { text: "A big, happy smile", value: "joyful" },
            { text: "Wiggling and dancing", value: "energetic" },
            { text: "Hugging my favorite stuffie tight", value: "loving" },
          ],
        },
      ],
    },
  ],
  results: {
    creative: { title: "Creative Cutie", description: "You're a little artist with a big imagination! You love making things beautiful and expressing yourself through colors and crafts." },
    comfort: { title: "Cuddle Bug", description: "You find the most joy in snuggles, soft blankets, and all things cozy. For you, feeling safe and warm is what it's all about." },
    playful: { title: "Playful Pounce", description: "You're full of energy and love to play! Games, jokes, and silly adventures are your favorite way to spend your little time." },
    default: { title: "Sweet Sparkle", description: "You're a wonderful mix of everything sweet and fun! You enjoy a little bit of everything, from quiet cuddles to playful adventures." },
  },
};

const Quiz = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = useMemo(() => quizData.pages.reduce((acc, page) => acc + page.questions.length, 0), []);
  const questionsAnswered = Object.keys(answers).length;
  const progress = (questionsAnswered / totalQuestions) * 100;

  const handleSelectAnswer = (questionIndex, choiceValue) => {
    const globalQuestionIndex = currentPage * quizData.pages[0].questions.length + questionIndex;
    
    setAnswers(prev => {
      const newAnswers = {...prev};
      if (newAnswers[globalQuestionIndex] === choiceValue) {
        delete newAnswers[globalQuestionIndex];
        return newAnswers;
      }
      newAnswers[globalQuestionIndex] = choiceValue;
      return newAnswers;
    });

    setTimeout(() => {
      if (currentQuestionIndex < quizData.pages[currentPage].questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (currentPage < quizData.pages.length - 1) {
        setCurrentPage(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowResults(true);
      }
    }, 800);
  };

  const calculateResults = () => {
    const counts = Object.values(answers).reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    
    const topResult = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, null);
    return quizData.results[topResult] || quizData.results.default;
  };

  const result = useMemo(calculateResults, [showResults]);

  const globalQuestionNumber = currentPage * quizData.pages[0].questions.length + currentQuestionIndex + 1;
  const currentQuestionData = quizData.pages[currentPage].questions[currentQuestionIndex];
  const globalQuestionKey = `${currentPage}-${currentQuestionIndex}`;
  const selectedChoice = answers[currentPage * quizData.pages[0].questions.length + currentQuestionIndex];

  return (
    <div id="app" className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <style>{`
        .quiz-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 25px rgba(255, 105, 180, 0.2);
          transform-style: preserve-3d;
        }
        .progress-bar-glow {
          background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue));
          box-shadow: 0 0 10px var(--neon-blue), 0 0 20px var(--neon-pink);
        }
        .y2k-answer-btn {
          background: #00ffff;
          color: #000;
          border: 2px solid #000;
          text-shadow: 1px 1px #ff00ff;
          box-shadow: 4px 4px 0px #ff00ff;
          transition: all 0.2s ease-in-out;
          font-family: 'VT323', monospace;
        }
        .y2k-answer-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #ff00ff;
        }
        .y2k-answer-btn.selected {
          box-shadow: 0 0 15px 5px #00ffff, 0 0 25px 10px #ff00ff;
          transform: scale(1.05);
        }
      `}</style>
      
      <div className="fixed top-0 left-0 w-full h-2.5 z-50">
        <div
          className="h-full progress-bar-glow transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="w-full h-full flex items-center justify-center p-4" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={globalQuestionKey}
              className="w-full max-w-2xl"
              initial={{ opacity: 0, transform: 'rotateY(-90deg)' }}
              animate={{ opacity: 1, transform: 'rotateY(0deg)' }}
              exit={{ opacity: 0, transform: 'rotateY(90deg)' }}
              transition={{ duration: 0.5 }}
            >
              <div className="quiz-card p-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  Question {globalQuestionNumber}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 font-sans">
                  {currentQuestionData.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {currentQuestionData.choices.map((choice, index) => {
                      const isSelected = selectedChoice === choice.value;
                      if (selectedChoice && !isSelected) {
                        return (
                          <motion.div
                            key={choice.text}
                            exit={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                            transition={{ duration: 0.3 }}
                          >
                            <button className="y2k-answer-btn text-xl p-4 w-full rounded-lg">
                              {choice.text}
                            </button>
                          </motion.div>
                        );
                      }
                      return (
                        <motion.button
                          key={choice.text}
                          layout
                          className={`y2k-answer-btn text-xl p-4 w-full rounded-lg ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectAnswer(currentQuestionIndex, choice.value)}
                        >
                          {choice.text}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              className="w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="quiz-card p-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  {result.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 font-sans">
                  {result.description}
                </p>
                <button
                  onClick={() => {
                    setCurrentPage(0);
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setShowResults(false);
                  }}
                  className="y2k-answer-btn text-2xl px-8 py-3 rounded-lg"
                >
                  Play Again!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;