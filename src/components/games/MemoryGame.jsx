"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProgress, progressConfig } from '@/contexts/ProgressContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


const Button = ({ onClick, className, children, isActive }) => (
    <div 
        onClick={onClick} 
        className={`m-1 select-none cursor-pointer rounded-xl transition-all ${className} ${isActive ? 'button-3d-active' : 'button-3d-inactive'}`}
    >
        <div 
            className="w-full h-full flex items-center justify-center font-bold rounded-lg transition-all duration-100 p-3"
            style={{ 
                background: isActive 
                    ? 'linear-gradient(to top right, #3b82f6, #6366f1)'
                    : 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
            }}
        >
            {children}
        </div>
    </div>
);

const DIFFICULTY_LEVELS = {
  Easy: { name: 'Easy (3x4)', pairs: 6, cols: 4, totalCards: 12 },
  Medium: { name: 'Medium (4x4)', pairs: 8, cols: 4, totalCards: 16 },
  Hard: { name: 'Hard (6x6)', pairs: 18, cols: 6, totalCards: 36 },
};

const EMOJI_MAP = {
  'Fantasy/Cute': ['🦄', '🌈', '⭐', '🍭', '🧸', '🎈', '👑', '💖', '🍀', '🦋', '✨', '🎶', '🍎', '🦊', '🐸', '🚀', '🔮', '💎', '🎉'],
  'Food/Treats': ['🍕', '🍔', '🍟', '🍩', '🍪', '🍰', '🍦', '🍓', '🍇', '🍉', '🍊', '🍍', '🌮', '🌶️', '🍿', '🥤', '🥚', '🥐', '🥨'],
  'Animals': ['🐱', '🐶', '🐰', '🐼', '🦁', '🐵', '🐘', '🦒', '🐠', '🐳', '🐢', '🦖', '🦜', '🦢', '🦔', '🐝', '🐞', '🐌', '🦋'],
};


const MemoryGame = ({ gameId = 'memory-match-1' }) => {
  const [selectedTheme, setSelectedTheme] = useState('Fantasy/Cute');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [matchEffectId, setMatchEffectId] = useState(null);

  const { toast } = useToast();
  const { user } = useAuth();
  const { addPoints } = useProgress();
  const supabase = useSupabaseClient();

  const currentDifficulty = DIFFICULTY_LEVELS[selectedDifficulty];

  const uniqueEmojis = useMemo(() => {
    const allEmojis = EMOJI_MAP[selectedTheme] || EMOJI_MAP['Fantasy/Cute'];
    return allEmojis.slice(0, currentDifficulty.pairs);
  }, [selectedTheme, currentDifficulty.pairs]);

  const initializeMemoryGame = useCallback(() => {
    const shuffledEmojis = [...uniqueEmojis, ...uniqueEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
      }));
      
    setMemoryCards(shuffledEmojis);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameWon(false);
    setMatchEffectId(null);
  }, [uniqueEmojis]);

  useEffect(() => {
    initializeMemoryGame();
  }, [initializeMemoryGame, selectedTheme, selectedDifficulty]);

  const handleWin = async (finalMoves) => {
    setGameWon(true);
    const score = Math.max(100 - (finalMoves * 5), 10); 
    
    toast({
        title: "🎉 CONGRATULATIONS!",
        description: `You solved the ${currentDifficulty.name} puzzle in ${finalMoves} moves! Score: ${score}`,
    });

    if (user) {
        addPoints(progressConfig.pointValues.GAME_LEVEL, 'Playing Memory Match', `${progressConfig.activityTypes.GAME_LEVEL}_${gameId}_${selectedDifficulty}`);
        if (score > 0) {
            const { error } = await supabase
                .from('game_scores')
                .insert({ 
                    user_id: user.id, 
                    game_id: gameId, 
                    score: score, 
                    difficulty: selectedDifficulty 
                });
            
            if (error) {
                console.error('Error saving score:', error);
            }
        }
    }
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || gameWon || matchedCards.includes(cardId) || flippedCards.includes(cardId)) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = memoryCards.find(card => card.id === firstCardId);
      const secondCard = memoryCards.find(card => card.id === secondCardId);

      if (firstCard?.content === secondCard?.content) {
        const newlyMatched = [firstCardId, secondCardId];
        setMatchedCards([...matchedCards, ...newlyMatched]);
        setFlippedCards([]);

        setMatchEffectId(firstCardId);
        setTimeout(() => setMatchEffectId(null), 500); 
        
        if (matchedCards.length + 2 === memoryCards.length) {
          handleWin(newMoves);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  const Card = ({ card }) => {
    const isFlipped = flippedCards.includes(card.id);
    const isMatched = matchedCards.includes(card.id);
    const isActive = isFlipped || isMatched;
    
    const shouldAnimateMatch = isMatched && matchEffectId !== null && 
        (card.id === matchEffectId || memoryCards.find(c => c.id === matchEffectId)?.content === card.content);

    const cardTransform = isActive ? 'rotateY(180deg)' : 'rotateY(0deg)';
    const matchPopClass = shouldAnimateMatch ? 'card-match-pop' : '';

    let iconSizeClass = 'text-5xl sm:text-6xl';
    if (currentDifficulty.cols === 6) {
        iconSizeClass = 'text-3xl sm:text-4xl';
    }

    // IMPORTANT: Using the provided mock URL for the card back logo
    const cardBackLogoUrl = 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/logo.webp';

    return (
        <div 
            className="group aspect-square relative"
            style={{ perspective: '1000px', aspectRatio: '1 / 1' }}
            onClick={() => !isMatched && flippedCards.length < 2 && handleCardClick(card.id)}
        >
            <div
                className={`w-full h-full absolute cursor-pointer rounded-2xl ${matchPopClass}`}
                style={{ 
                    transformStyle: 'preserve-3d',
                    transform: cardTransform,
                    transition: isMatched ? 'none' : 'transform 0.5s ease-in-out, box-shadow 0.2s',
                }}
            >
                <div 
                    className={`absolute w-full h-full backface-hidden rounded-2xl flex items-center justify-center font-extrabold 
                        ${iconSizeClass}
                        ${isMatched ? 'bg-green-300' : 'bg-white'} 
                        p-2 border-4 border-gray-100 shadow-xl`}
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    {card.content}
                </div>

                <div
                    className={`absolute w-full h-full backface-hidden rounded-2xl p-0.5 shadow-xl transition-opacity duration-100 
                    ${isMatched ? 'opacity-50' : ''}`}
                    style={{ 
                        backgroundColor: '#312e81',
                        boxShadow: isMatched ? 'none' : '0 6px 0 0 #312e81, 0 10px 0 0 rgba(0,0,0,0.4)',
                    }}
                >
                    <div
                        className="w-full h-full flex items-center justify-center text-white font-bold rounded-xl p-2"
                        style={{
                            background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)', 
                            border: '4px solid #4f46e5',
                        }}
                    >
                        <img 
                            src={cardBackLogoUrl} 
                            alt="Card Back Logo" 
                            className="w-4/5 h-4/5 object-contain opacity-90"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "https://placehold.co/100x100/312e81/ffffff?text=Logo"; 
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const gridLayoutClass = currentDifficulty.cols === 6 
    ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6' 
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
  const gridGapClass = currentDifficulty.cols === 6 ? 'gap-1 sm:gap-2' : 'gap-2 sm:gap-4';

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8 font-sans">
      
      {/* Theme and Difficulty Selector Container: Increased horizontal space to sm:space-x-12 */}
      <div className="w-full max-w-lg mb-6 flex flex-col sm:flex-row sm:space-x-12 space-y-6 sm:space-y-0 pt-4 sm:pt-0">
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Theme:</label>
            {/* Kept pr-6 to fix the glowing outline clipping issue */}
            <div className="flex space-x-2 overflow-x-auto pb-2 pr-6">
                {Object.keys(EMOJI_MAP).map(theme => (
                    <Button 
                        key={theme} 
                        onClick={() => setSelectedTheme(theme)}
                        isActive={selectedTheme === theme}
                        className={`flex-shrink-0 text-white text-sm whitespace-nowrap`}
                    >
                        {theme.split('/')[0]}
                    </Button>
                ))}
            </div>
        </div>

        <div className="flex-none sm:w-auto">
            <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty:</label>
            <div className="flex space-x-2">
                {Object.keys(DIFFICULTY_LEVELS).map(level => (
                    <Button 
                        key={level} 
                        onClick={() => setSelectedDifficulty(level)}
                        isActive={selectedDifficulty === level}
                        className={`flex-shrink-0 text-white text-sm whitespace-nowrap`}
                    >
                        {level}
                    </Button>
                ))}
            </div>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center">
        
        <div className="relative w-full mb-8">
          <div className={`grid ${gridLayoutClass} ${gridGapClass} w-full mx-auto p-2 sm:p-4 bg-gray-800/50 rounded-2xl`}>
            {memoryCards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </div>

        {gameWon && (
          <div
            className="text-center p-6 bg-green-900/80 rounded-2xl border-4 border-green-500 shadow-2xl shadow-green-700/50 max-w-sm mx-auto animate-zoom-in mb-8"
          >
            <h3 className="text-3xl font-extrabold text-green-300 mb-2">
              CONGRATULATIONS! 🎉
            </h3>
            <p className="text-lg text-gray-200">
              You solved the <span className="font-bold text-green-200">{currentDifficulty.name}</span> puzzle in <span className="font-bold text-yellow-300">{moves}</span> moves.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center w-full mt-8 mb-4">
          <div className="text-xl font-semibold text-purple-300 tracking-wider">
            Moves: <span className="text-pink-400">{moves}</span>
          </div>
          <Button
            onClick={initializeMemoryGame}
            isActive={false}
            className="text-white text-base shadow-lg shadow-purple-500/50"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              New Game
            </div>
          </Button>
        </div>

      </div>


      <style>{`
        .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        .button-3d-inactive {
            background-color: #312e81;
            box-shadow: 0 4px 0 0 #312e81, 0 8px 0 0 rgba(0,0,0,0.4);
            transform: translateY(0);
            border: 2px solid #312e81;
        }

        @keyframes glowing-pulse {
            0% {
                box-shadow: 
                    0 1px 0 0 #312e81, 
                    0 2px 0 0 rgba(0,0,0,0.4), 
                    0 0 0 3px #f472b6, 
                    0 0 10px 1px #f472b6;
            }
            50% {
                box-shadow: 
                    0 1px 0 0 #312e81, 
                    0 2px 0 0 rgba(0,0,0,0.4), 
                    0 0 0 4px #f472b6, 
                    0 0 15px 3px #f472b6;
            }
            100% {
                box-shadow: 
                    0 1px 0 0 #312e81, 
                    0 2px 0 0 rgba(0,0,0,0.4), 
                    0 0 0 3px #f472b6, 
                    0 0 10px 1px #f472b6;
            }
        }

        .button-3d-active {
            background-color: #312e81; 
            box-shadow: 
                0 1px 0 0 #312e81, 
                0 2px 0 0 rgba(0,0,0,0.4), 
                0 0 0 3px #f472b6, 
                0 0 10px 1px #f472b6;
            
            transform: translateY(4px); 
            border: 2px solid #312e81;
            animation: glowing-pulse 1.5s infinite alternate;
        }

        .button-3d-inactive:hover {
            transform: translateY(-1px);
        }
        .button-3d-inactive:active {
            transform: translateY(4px);
            box-shadow: 0 1px 0 0 #312e81, 0 2px 0 0 rgba(0,0,0,0.4);
        }

        @keyframes match-pop-animation {
            0% { transform: scale(1); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); }
            50% { transform: scale(1.15); box-shadow: 0 0 25px rgba(255, 255, 150, 0.8); }
            100% { transform: scale(1.0) rotateY(180deg); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); }
        }

        .card-match-pop {
            animation: match-pop-animation 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform: rotateY(180deg) !important; 
        }

        @keyframes zoom-in {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in {
            animation: zoom-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .group:active > div:first-child:not(.card-match-pop) > div:last-child {
            transform: translateY(4px);
            box-shadow: 0 2px 0 0 #312e81, 0 4px 0 0 rgba(0,0,0,0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default MemoryGame;