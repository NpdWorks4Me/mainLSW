"use client";
import React, { useState, useEffect } from 'react';
import { RotateCcw, Zap, Target, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProgress, progressConfig } from '@/contexts/ProgressContext';

const GameButton = ({ onClick, className, children, isActive }) => (
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

const FLASH_DURATION = 250;
const INTER_FLASH_PAUSE = 350;

const ColorSequenceGame = ({
  gameId = 'color-sequence-1'
}) => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [activeColor, setActiveColor] = useState(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { addPoints } = useProgress();
  const supabase = useSupabaseClient();

  const statusColorMap = {
    'text-orange-400': { hex: '#fb923c', colorClass: 'border-orange-500 bg-orange-900/40' },
    'text-green-400': { hex: '#4ade80', colorClass: 'border-green-500 bg-green-900/40' },
    'text-red-400': { hex: '#f87171', colorClass: 'border-red-500 bg-red-900/40' },
    'text-indigo-400': { hex: '#818cf8', colorClass: 'border-indigo-500 bg-indigo-900/40' },
  };

  const colors = [{
    id: 'red',
    bg: 'bg-red-600',
    hover: 'hover:bg-red-700',
    active: 'bg-red-700',
    name: 'Red',
    glowColor: '#ef4444'
  }, {
    id: 'blue',
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    active: 'bg-blue-700',
    name: 'Blue',
    glowColor: '#3b82f6'
  }, {
    id: 'green',
    bg: 'bg-green-600',
    hover: 'hover:bg-green-700',
    active: 'bg-green-700',
    name: 'Green',
    glowColor: '#10b981'
  }, {
    id: 'yellow',
    bg: 'bg-yellow-400',
    hover: 'hover:bg-yellow-500',
    active: 'bg-yellow-500',
    name: 'Yellow',
    glowColor: '#fde047'
  }, {
    id: 'purple',
    bg: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    active: 'bg-purple-700',
    name: 'Purple',
    glowColor: '#8b5cf6'
  }, {
    id: 'pink',
    bg: 'bg-pink-600',
    hover: 'hover:bg-pink-700',
    active: 'bg-pink-700',
    name: 'Pink',
    glowColor: '#ec4899'
  }];
  
  const difficultySettings = {
    easy: {
      colors: 4,
      speed: 800,
      name: 'EASY'
    },
    medium: {
      colors: 5,
      speed: 600,
      name: 'MEDIUM'
    },
    hard: {
      colors: 6,
      speed: 400,
      name: 'HARD'
    }
  };
  
  const handleGameOver = async finalScore => {
    setGameOver(true);
    setIsPlaying(false);
    toast({
      title: "🎮 Game Over!",
      description: `You scored ${finalScore} points! Try again to beat your score!`
    });
    if (user && finalScore > 0) {
      addPoints(progressConfig.pointValues.GAME_LEVEL, 'Playing Color Sequence', `${progressConfig.activityTypes.GAME_LEVEL}_${gameId}`);
      const {
        error
      } = await supabase.from('game_scores').insert({
        user_id: user.id,
        game_id: gameId,
        score: finalScore
      });
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Could not save score.',
          description: error.message
        });
      } else {
        toast({
          title: 'Score submitted!',
          description: 'Your score is on the leaderboard.'
        });
      }
    } else if (!user && finalScore > 0) {
      toast({
        title: 'Log in to save your score!',
        description: 'Create an account to join the leaderboard.'
      });
    }
  };
  
  const getRandomColor = () => {
    const availableColors = colors.slice(0, difficultySettings[difficulty].colors);
    return availableColors[Math.floor(Math.random() * availableColors.length)].id;
  };
  
  const startGame = () => {
    const newSequence = [getRandomColor()];
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    showSequence(newSequence);
  };
  
  const showSequence = async sequenceToShow => {
    setIsShowingSequence(true);
    setActiveColor(null);
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = 0; i < sequenceToShow.length; i++) {
      setActiveColor(sequenceToShow[i]);
      await new Promise(resolve => setTimeout(resolve, FLASH_DURATION));
      setActiveColor(null);
      await new Promise(resolve => setTimeout(resolve, INTER_FLASH_PAUSE));
    }
    setIsShowingSequence(false);
  };
  
  const handleColorClick = colorId => {
    if (isShowingSequence || gameOver || !isPlaying) return;

    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 100);

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);
    
    if (colorId !== sequence[newPlayerSequence.length - 1]) {
      handleGameOver(score);
      return;
    }
    
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + sequence.length;
      setScore(newScore);
      setPlayerSequence([]);

      if (newScore > 0 && newScore % 20 === 0) {
        toast({
          title: "🎉 Awesome!",
          description: `You're on fire! Score: ${newScore}`
        });
      }
      
      setTimeout(() => {
        const nextSequence = [...sequence, getRandomColor()];
        setSequence(nextSequence);
        showSequence(nextSequence);
      }, 1000);
    }
  };
  
  const resetGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setIsShowingSequence(false);
    setActiveColor(null);
  };
  
  const changeDifficulty = newDifficulty => {
    setDifficulty(newDifficulty);
    resetGame();
  };
  
  const getStatusKey = () => {
    if (isShowingSequence) return 'watching';
    if (isPlaying && !gameOver) return 'repeating';
    if (gameOver) return 'gameover';
    return 'ready';
  }

  const getGameStatusMessage = () => {
    if (isShowingSequence) {
        return { text: "SYSTEM: WATCHING SEQUENCE", color: "text-orange-400" };
    }
    if (isPlaying && !gameOver) {
        return { 
            text: `USER: REPEAT PATTERN (${Math.max(1, playerSequence.length + 1)}/${sequence.length})`, 
            color: "text-green-400" 
        };
    }
    if (gameOver) {
        return { text: "STATUS: GAME OVER", color: "text-red-400" };
    }
    return { text: "STATUS: READY TO START", color: "text-indigo-400" };
  }

  const status = getGameStatusMessage();
  const consoleStyle = statusColorMap[status.color];
  const stableKey = getStatusKey();

  const numColors = difficultySettings[difficulty].colors;
  const columnClass = numColors === 4 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"; 

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center p-4 sm:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="w-full max-w-2xl p-4 sm:p-6"
      >

        <div className="text-center mb-8">

            <div className="flex justify-center gap-3 mb-6">
              {Object.entries(difficultySettings).map(([key, setting]) => (
                <GameButton 
                    key={key} 
                    onClick={() => changeDifficulty(key)}
                    isActive={difficulty === key}
                    className="flex-shrink-0 text-white text-xs sm:text-sm whitespace-nowrap"
                >
                    {setting.name}
                </GameButton>
              ))}
            </div>

            <div className="flex justify-between items-center gap-4 mb-6 p-3 bg-gray-900/50 rounded-xl max-w-lg mx-auto">
              <div className="flex items-center gap-1 text-base sm:text-lg font-semibold text-purple-300">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>SCORE: <span className="text-pink-400">{score}</span></span>
              </div>
              <div className="flex items-center gap-1 text-base sm:text-lg font-semibold text-blue-300">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>LEVEL: <span className="text-yellow-400">{sequence.length}</span></span>
              </div>
              
              <GameButton 
                onClick={isPlaying ? resetGame : startGame} 
                isActive={false}
                className="text-white text-xs sm:text-sm flex-shrink-0"
              >
                <div className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  {isPlaying ? 'Reset' : 'Start'}
                </div>
              </GameButton>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative h-12 flex items-center justify-center p-2 mb-4 rounded-xl overflow-hidden shadow-lg border-2 ${consoleStyle.colorClass} max-w-lg mx-auto`}
            >
                {isShowingSequence && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                            animate={{ scale: [1, 1.5, 2.5], opacity: [0.8, 0.4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            className="w-full h-full rounded-full absolute bg-orange-400/50"
                        />
                    </div>
                )}
                
                <motion.div 
                    key={stableKey} 
                    className={`font-extrabold z-10 ${status.color} flex items-center gap-2`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {isShowingSequence && <Eye className="w-5 h-5 animate-pulse" />}
                    {isPlaying && !isShowingSequence && !gameOver && <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, type: 'spring' }}><Target className="w-5 h-5" /></motion.div>}
                    {gameOver && <motion.div animate={{ scale: [1, 1.1, 1]} } transition={{ repeat: Infinity, duration: 1 }}><Zap className="w-5 h-5" /></motion.div>}
                    
                    <span 
                        className="text-sm sm:text-base"
                    >
                        {status.text}
                    </span>
                </motion.div>
            </motion.div>
        </div>

        <div className={`grid ${columnClass} gap-4 sm:gap-6 max-w-lg mx-auto mb-8 w-full`}>
            {colors.slice(0, difficultySettings[difficulty].colors).map(color => {
                const isActive = activeColor === color.id;
                const isGameDisabled = isShowingSequence || gameOver || !isPlaying;

                return (
                    <motion.div 
                        key={color.id} 
                        className={`aspect-square rounded-2xl cursor-pointer flex items-center justify-center text-white font-bold text-xl sm:text-2xl
                            shadow-xl transition-all ${color.bg} ${isGameDisabled ? 'cursor-not-allowed opacity-75' : ''}`} 
                        style={{ aspectRatio: '1 / 1' }}
                        onClick={() => handleColorClick(color.id)} 
                        
                        whileHover={{
                            scale: isGameDisabled ? 1 : 1.05,
                            boxShadow: isGameDisabled ? 'none' : '0 10px 30px rgba(0,0,0,0.5)'
                        }} 
                        whileTap={{
                            scale: isGameDisabled ? 1 : 0.95,
                        }} 
                        
                        animate={{
                            scale: isActive ? 1.2 : 1, 
                            boxShadow: isActive 
                                ? `0 0 10px ${color.glowColor}, 0 0 40px ${color.glowColor}, 0 0 80px ${color.glowColor}` 
                                : '0 10px 25px rgba(0,0,0,0.4)'
                        }} 
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                        }}
                    >
                        {color.name}
                    </motion.div>
                )})}
        </div>
    
        {gameOver && <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="text-center mt-6">
              <div className="bg-red-900/50 rounded-2xl p-6 max-w-sm mx-auto border-2 border-red-500 shadow-xl shadow-red-500/30">
                <h3 className="text-2xl font-bold text-red-300 mb-2">😭 Sequence Broken!</h3>
                <p className="text-gray-200 mb-4">
                  Final Score: <span className="font-extrabold text-yellow-300 text-xl">{score}</span>
                </p>
                <p className="text-sm text-gray-400">
                  You reached Level {sequence.length}. Better luck next time!
                </p>
              </div>
            </motion.div>}
      </motion.div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default ColorSequenceGame;