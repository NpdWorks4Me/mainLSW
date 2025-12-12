"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, Smile, Clock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProgress, progressConfig } from '@/contexts/ProgressContext';


// INCREASED GRID SIZE FOR BETTER DIAGONAL WORD PLACEMENT
const GRID_SIZE = 15; 
const WORDS_PER_GAME = 12; // Number of words to find in the grid

// --- CATEGORY-BASED WORD CATALOGUE ---
const CATEGORIES = {
  'LittleSpace & Comfort': [
    "KIDDO", "STUFFY", "SIPPY", "CAREGIVER", "FUN", "JOY", "PLAY", "SMILE", 
    "CALM", "STRESS", "FEAR", "ANGER", "SHAME", "HEAL", "COPE", "TRUST", 
    "TOYS", "COLOR", "SING", "LEGO", "WALK", "EASY", "FOCUS", 
    "LIFE", "WORK", "HOME", "MOOD", "QUICK", "BIG", "SNACK", "PLAYTIME", 
    "SNUGGLES", "BLANKET", "CRAYONS", "TEDDY", "COZY", "COMFY", "SLUMBER", 
    "SWEET", "TOYBOX", "IMAGINE", "FRIEND", "MUSIC", "SECRET", "HUGS",
    "CUDDLE", "HUGGIES", "PACIFIER", "BOTTLE", "NAPTIME", "TREATS", "PRINCESS", 
    "SUPERHERO", "PUZZLE", "NIGHTLIGHT", "STORY", "BUBBLES", "WAGGLES", 
    "CARTOONS", "RAINBOW", "ADVENTURE", "EXPLORE", "SHINY", "WISH", "LAUGH", 
    "GIGGLE", "NURTURE", "SAFE", "SECURE", "ACCEPT", "PATIENT", "SOFT", 
    "PILLOW", "YUMMY", "SWEATER", "SOCKS", "FLUFFY", "GRUNGE", 
    "WONDER", "MARSHMALLOW", "PUDDLE", "PUFFY", "JUMPER", "GALAXY",
  ],
  'Favorite Foods': [
    "CHOCOLATE", "SPAGHETTI", "HOTDOGS", "NUGGETS", "ICECREAM", 
    "PANCAKES", "PIZZA", "APPLES", "BANANAS", 
    "CUPCAKES", "SMOOTHIE", "SALAD", "CHERRIES", "GRAPES", 
    "CRACKERS", "SANDWICH", "TREATS", "SPRINKLES", "GUMBALL",
    "JELLY", "RED", "SUGAR", "FOOD", 
  ],
  'Critters & Creatures': [
    "PUPPY", "KITTY", "CAT", "FISH", "BIRD", "HAMSTER", 
    "GUINEA", "RABBIT", "TURTLE", "FERRET", "MOUSE", "UNICORN", "BLOBFISH",
    "WIZARD", "MAGICAL", "FENNEC", "AXOLOTL", "CAPYBARA", "LORIS", 
    "QUOKKA", "PYGMY", "HEDGEHOG", "KINKAJOU", "WAGGLES", "SHIFT", "PACK", 
    "HOWL", "FURSONA", "TAIL", "PAWS", "SNIFF", "GROWL",
  ],
  'Tech & Fandoms': [
    "MINECRAFT", "ROBLOX", "GLITTER", "FROSTY", "VAPOR", "NEON", 
    "INTERNET", "BLING", "ARCADE", "ZIGZAG", 
    "BUBBLE", "ALIEN", "SKECHERS", "SHADOW", "CORE", "ANIME", 
    "PULSE", "GHOST", "STATIC", "TRASH", "VOID", 
    "NOISE", "EMOJI", "KAWAII", "FANDOM", "MEME", "AVATAR", "SPONGEBOB", 
    "CHOWDER", "FLAPJACK", "COURAGE", "ZIM", "RUBY", 
  ],
  'Action & Play': [
    "JUMP", "RUN", "WAVE", "QUEST", "BOSS", "BUILD", "LOOT", "WALK", "HIKE", 
    "SWINGING", "TAG", "CHASE", "PUZZLES", "PRETEND", 
    "HIDING", "SWING", "JUMP", "BOUNCE", "CATCH", "HOP", "SLIDE", "FREEZE", 
    "TOSS", "MATCH", "STACK", "RACE", "ROLL", "SPIN", "CLIMB", 
    "EXPLORE", "IMAGINE", "ADVENTURE", "WIN", "TRY", "GOAL", "BRAVE",
  ],
  'Daily Routine': [
    "SLEEP", "NAPPING", "CLEANUP", "CHORES", "ROUTINE", "HABITS", 
    "BATHTIME", "TOWEL", "HAIRBRUSH", "TOOTHBRUSH", "FLOSS", "READ", 
    "WRITE", "CREATE", "SHARE", "HELPING", "SHOPPING", "FOCUS", 
  ],
};

const getRandomWords = (count) => {
  const wordsList = Object.values(CATEGORIES).flat();
  const uniqueWords = [...new Set(wordsList)];
  const shuffled = [...uniqueWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(word => word.toUpperCase());
};
// ---------------------------------------------------------------------------

// Utility for robust API calls with exponential backoff (MOCK IMPLEMENTATION)
const exponentialBackoffFetch = async (promise, maxRetries = 3, delay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await promise();
      if (!result.error) return result;
      
      if (attempt < maxRetries - 1) {
        console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay * (2 ** attempt)}ms...`);
      } else {
        throw new Error(result.error.message || "Final attempt failed.");
      }
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay * (2 ** attempt)));
  }
  throw new Error("Max retries reached.");
};


const generateGrid = (wordsToPlace) => {
  let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  
  // Directions are now limited to horizontal and vertical movement only
  const directions = [
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 0, y: -1 }  // Up
  ];

  const placeWord = (word, grid) => {
    let placed = false;
    let attempts = 0;
    
    // Increased placement attempts to 200 for better success rate
    while (!placed && attempts < 200) { 
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startX = Math.floor(Math.random() * GRID_SIZE);
      const startY = Math.floor(Math.random() * GRID_SIZE);
      
      const endX = startX + (word.length - 1) * dir.x;
      const endY = startY + (word.length - 1) * dir.y;

      if (endX >= 0 && endX < GRID_SIZE && endY >= 0 && endY < GRID_SIZE) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const checkX = startX + i * dir.x;
          const checkY = startY + i * dir.y;
          // Check for collision: must be empty, or match the existing letter (for crossings)
          if (grid[checkY][checkX] !== '' && grid[checkY][checkX] !== word[i]) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[startY + i * dir.y][startX + i * dir.x] = word[i];
          }
          placed = true;
        }
      }
    }
    return placed;
  };

  wordsToPlace.sort((a, b) => b.length - a.length);
  const successfullyPlacedWords = [];
  for (const word of wordsToPlace) {
    if (placeWord(word, grid)) {
      successfullyPlacedWords.push(word);
    }
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  return { grid, placedWords: successfullyPlacedWords };
};

const WordSearchGame = ({ gameId = 'word-search-kawaii' }) => {
  const supabase = useSupabaseClient();
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundCells, setFoundCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); 
  
  const timerRef = useRef(null); 
  const { toast } = useToast();
  const { user } = useAuth();
  const { addPoints } = useProgress();

  const initializeGame = useCallback(() => {
    const newWords = getRandomWords(WORDS_PER_GAME);
    const { grid: newGrid, placedWords } = generateGrid(newWords);
    
    if (placedWords.length < WORDS_PER_GAME) {
        console.warn(`Could only place ${placedWords.length}/${WORDS_PER_GAME} words. Proceeding with placed words.`);
    }
    
    setWords(placedWords);
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
    setFoundCells([]);
    setIsSelecting(false);
    setStartTime(null);
    setTimeElapsed(0); 
    setGameWon(false);
  }, []);

  // Initial load
  useEffect(() => {
    initializeGame();
  }, [initializeGame]); 

  // Timer Effect
  useEffect(() => {
    if (startTime && !gameWon) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, gameWon]);

  // Time formatter for the digital display
  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleCellMouseDown = (row, col) => {
    if (gameWon) return;
    if (!startTime) setStartTime(Date.now());
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseEnter = (row, col) => {
    if (!isSelecting || gameWon) return;
    const isAlreadySelected = selectedCells.some(cell => cell.row === row && cell.col === col);
    if (!isAlreadySelected) {
      setSelectedCells(prev => [...prev, { row, col }]);
    }
  };

  const handleCellMouseUp = async () => {
    if (!isSelecting || gameWon) return;
    setIsSelecting(false);
    
    let currentWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
    let reversedWord = [...selectedCells].reverse().map(cell => grid[cell.row][cell.col]).join('');

    const wordToFind = words.find(w => !foundWords.includes(w) && (w === currentWord || w === reversedWord));

    if (wordToFind) {
      const newFoundWords = [...foundWords, wordToFind];
      setFoundWords(newFoundWords);
      setFoundCells(prev => [...prev, ...selectedCells]);
      
      toast({
        title: "💖 WORD FOUND!",
        description: `"${wordToFind}" unlocked!`,
      });

      if (newFoundWords.length === words.length) {
        setGameWon(true);
        const timeTaken = timeElapsed; 
        const score = Math.max(1000 - timeTaken * 5, 50); 
        
        toast({
          title: "🎉 MISSION COMPLETE!",
          description: `All fun data blocks decrypted in ${timeTaken} seconds! Score: ${score}`,
        });

        if (user && score > 0) {
            const categoryName = 'Mixed';
            addPoints(progressConfig.pointValues.GAME_LEVEL, `Word Search (${categoryName})`, `${progressConfig.activityTypes.GAME_LEVEL}_${gameId}_${categoryName}`);
            
            const scoreSubmissionPromise = () => supabase
                .from('game_scores')
                .insert({ user_id: user.id, game_id: gameId, score: score });
            
            try {
                const result = await exponentialBackoffFetch(scoreSubmissionPromise);
                
                if (result.error) {
                    toast({ variant: 'destructive', title: 'Score Save Failure.', description: 'Could not connect to the network grid, even after retries.' });
                } else {
                    toast({ title: 'Score Synced!', description: 'Your score has been uploaded to the global databanks.' });
                }
            } catch (error) {
                toast({ variant: 'destructive', title: 'Critical Error.', description: 'Network failed to connect after multiple attempts.' });
            }

        } else if (!user) {
            toast({ title: 'ACCESS DENIED.', description: 'Log in to save your score and join the leaderboard.' });
        }
      }
    }
    setSelectedCells([]);
  };

  const getCellClass = (row, col) => {
    if (foundCells.some(cell => cell.row === row && cell.col === col)) {
        return 'bg-[#FFC0CB] text-black shadow-[0_0_8px_#FFC0CB,0_0_12px_#FFC0CB] scale-105 font-extrabold';
    }
    if (selectedCells.some(cell => cell.row === row && cell.col === col)) {
        return 'bg-[#3CB371] text-black shadow-[0_0_8px_#3CB371,0_0_12px_#3CB371] scale-110 font-extrabold ring-1 ring-white/50';
    }
    return 'text-[#4B0082] hover:text-[#FF69B4] hover:bg-[#E6E6FA] transition-colors duration-100';
  }

  return (
    <div 
      className="min-h-screen bg-[#B0E0E6] font-mono sm:p-8"
      onMouseUp={handleCellMouseUp} 
      onMouseLeave={() => { if (isSelecting) handleCellMouseUp(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto sm:grid sm:grid-cols-10 sm:gap-6 lg:gap-12"
      >
        
        <div className="flex flex-col gap-4 items-center justify-center order-2 sm:order-1 sm:col-span-7 p-4 sm:p-0"> 
            <motion.div 
                className="grid select-none border-4 border-[#8A2BE2] bg-[#FFF0F5] p-2 rounded-2xl 
                           shadow-[0_0_15px_#8A2BE2,0_0_30px_#FF69B444] w-full"
                style={{ 
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    margin: 'auto'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {grid.length > 0 && grid.map((rowItems, rowIndex) =>
                rowItems.map((letter, colIndex) => (
                    <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className={`flex items-center justify-center aspect-square 
                                    text-lg sm:text-2xl lg:text-3xl font-extrabold 
                                    cursor-pointer transition-all duration-150 rounded-md
                                    ${getCellClass(rowIndex, colIndex)}`}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        whileHover={{ 
                            scale: (isSelecting || gameWon) ? 1.05 : 1.2, 
                            color: '#FF69B4' 
                        }}
                        onTouchStart={(e) => {
                            e.preventDefault(); 
                            handleCellMouseDown(rowIndex, colIndex);
                        }}
                        onTouchMove={(e) => {
                            const touch = e.touches[0];
                            const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
                            if (targetElement && targetElement.dataset.row && targetElement.dataset.col) {
                                const targetRow = parseInt(targetElement.dataset.row, 10);
                                const targetCol = parseInt(targetElement.dataset.col, 10);
                                handleCellMouseEnter(targetRow, targetCol);
                            }
                        }}
                        onTouchEnd={handleCellMouseUp}
                        data-row={rowIndex} 
                        data-col={colIndex} 
                    >
                        {letter}
                    </motion.div>
                ))
                )}
            </motion.div>
        </div>

        <div className="order-1 sm:order-2 sm:col-span-3 p-4 sm:p-0">
          <motion.div 
              className="w-full p-4 sm:p-6 rounded-2xl bg-[#FFF0F5] 
                         shadow-[0_0_10px_#FF69B444] border border-[#FF69B466]
                         sm:bg-[#D8BFD8] sm:shadow-[0_0_20px_#8A2BE244,0_0_40px_#FF69B444] sm:border-2 sm:border-[#8A2BE266]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
          >
              <h3 className="text-xl font-semibold text-[#FF69B4] mb-4 text-center flex items-center justify-center 
                          shadow-[0_0_3px_#FF69B4]">
                <Search className="w-5 h-5 mr-2 text-[#FF69B4]" /> WORDS TO FIND ({words.length})
              </h3>
              <ul className="flex flex-wrap justify-center sm:block sm:space-y-2 gap-x-3 gap-y-3 p-2 sm:p-0">
                {words.map(word => (
                  <motion.li
                    key={word}
                    className={`text-sm sm:text-base font-bold py-2 px-4 rounded-xl transition-all duration-300 border-2 ${
                      foundWords.includes(word) 
                        ? 'bg-[#FF69B4] text-white line-through opacity-85 border-[#FF69B4] cursor-default' 
                        : 'bg-[#CCFFCC] text-[#4B0082] border-[#8A2BE2] hover:bg-[#E6FEE6] cursor-pointer shadow-[0_4px_0_0_#8A2BE2] active:translate-y-1 active:shadow-none'
                    } sm:inline-block sm:w-full sm:text-left`}
                    animate={{ 
                      scale: foundWords.includes(word) ? 1.05 : 1, 
                      opacity: foundWords.includes(word) ? 0.85 : 1
                    }}
                  >
                    {word}
                  </motion.li>
                ))}
              </ul>
              {gameWon && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 text-center p-4 bg-[#D8BFD8] rounded-lg border border-[#8A2BE2] 
                             shadow-[0_0_10px_#8A2BE2]"
                >
                  <Smile className="w-10 h-10 text-[#FF69B4] mx-auto mb-2 shadow-[0_0_5px_#FF69B4]" />
                  <p className="font-bold text-[#4B0082] uppercase">ALL WORDS FOUND! HOORAY!</p>
                </motion.div>
              )}
          </motion.div>
        </div>

        <div className="sm:col-span-10 mt-8 pt-6 border-t border-[#8A2BE266] flex flex-col sm:flex-row justify-around items-center gap-6 w-full sm:px-6 order-3 p-4 sm:p-0">
            
            <div className="flex items-center gap-4 order-2 sm:order-1">
                <Clock className="w-6 h-6 text-[#4B0082]"/>
                <div className="text-2xl font-bold text-[#4B0082] p-2 rounded-xl 
                                bg-[#FFF0F5] border border-[#FF69B4] 
                                shadow-inner shadow-[#FF69B466]">
                    {formatTime(timeElapsed)}
                </div>
            </div>
            
            <button
                onClick={() => initializeGame()}
                className="flex items-center gap-2 p-3 bg-[#8A2BE2] rounded-xl text-white font-bold text-lg shadow-lg transition-transform 
                            hover:scale-105 active:scale-95 border-2 border-[#FF69B4] hover:bg-[#9932CC] order-1 sm:order-2 whitespace-nowrap"
                aria-label="Restart Game"
            >
                <RotateCcw className="w-5 h-5" />
                NEW GAME
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WordSearchGame;