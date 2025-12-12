"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Bot, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProgress, progressConfig } from '@/contexts/ProgressContext';

const TicTacToeGame = ({ gameId }) => {
  const [ticTacToeBoard, setTicTacToeBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [ticTacToeWinner, setTicTacToeWinner] = useState(null);
  const [gameMode, setGameMode] = useState('computer');
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const { addPoints } = useProgress();

  const initializeTicTacToe = () => {
    setTicTacToeBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setTicTacToeWinner(null);
    setIsComputerTurn(false);
  };

  const handleWin = async (winner) => {
    setTicTacToeWinner(winner);
    let score = 0;
    let toastTitle = "🎉 Game Over!";
    let toastDescription = "";

    if (winner === 'Tie') {
        score = 10;
        toastTitle = "🤝 It's a tie!";
        toastDescription = "Great game! You get 10 points.";
    } else if (gameMode === 'computer' && winner === 'X') {
        score = 100;
        toastTitle = "🎉 You win!";
        toastDescription = "Congratulations! You earned 100 points.";
    } else if (gameMode === 'computer' && winner === 'O') {
        toastTitle = "🤖 Computer wins!";
        toastDescription = "Better luck next time!";
    } else {
        toastTitle = `🎉 Player ${winner} wins!`;
        toastDescription = "Congratulations!";
    }

    toast({ title: toastTitle, description: toastDescription });
    
    if (user && score > 0) {
        addPoints(progressConfig.pointValues.GAME_LEVEL, 'Playing Tic-Tac-Toe', `${progressConfig.activityTypes.GAME_LEVEL}_${gameId}`);
        const { error } = await supabase
            .from('game_scores')
            .insert({ user_id: user.id, game_id: gameId, score: score });
        
        if (error) {
            toast({ variant: 'destructive', title: 'Could not save score.', description: error.message });
        } else {
            toast({ title: 'Score submitted!', description: 'Your score is on the leaderboard.' });
        }
    } else if (!user && score > 0) {
        toast({ title: 'Log in to save your score!', description: 'Create an account to join the leaderboard.' });
    }
  };
  
  const checkTicTacToeWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every(cell => cell !== null)) return 'Tie';
    return null;
  };

  const getComputerMove = (board) => {
    // Standard AI logic (win, block, fork, etc.)
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = 'O';
        if (checkTicTacToeWinner(testBoard) === 'O') return i;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const testBoard = [...board];
        testBoard[i] = 'X';
        if (checkTicTacToeWinner(testBoard) === 'X') return i;
      }
    }
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === null);
    if (availableCorners.length > 0) return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
  };

  const makeComputerMove = (board) => {
    const computerMove = getComputerMove(board);
    if (computerMove !== undefined) {
      const newBoard = [...board];
      newBoard[computerMove] = 'O';
      setTicTacToeBoard(newBoard);
      const winner = checkTicTacToeWinner(newBoard);
      if (winner) {
        handleWin(winner);
        setIsComputerTurn(false);
      } else {
        setCurrentPlayer('X');
        setIsComputerTurn(false);
      }
    }
  };

  const handleTicTacToeClick = (index) => {
    if (ticTacToeBoard[index] || ticTacToeWinner || isComputerTurn) return;

    const newBoard = [...ticTacToeBoard];
    newBoard[index] = currentPlayer;
    setTicTacToeBoard(newBoard);

    const winner = checkTicTacToeWinner(newBoard);
    if (winner) {
      handleWin(winner);
    } else {
      if (gameMode === 'computer' && currentPlayer === 'X') {
        setCurrentPlayer('O');
        setIsComputerTurn(true);
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    }
  };

  const handleGameModeChange = (mode) => {
    setGameMode(mode);
    initializeTicTacToe();
  };

  useEffect(() => {
    if (isComputerTurn && gameMode === 'computer' && !ticTacToeWinner) {
      const timer = setTimeout(() => {
        makeComputerMove(ticTacToeBoard);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isComputerTurn, ticTacToeBoard, gameMode, ticTacToeWinner]);

  useEffect(() => {
    initializeTicTacToe();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect rounded-3xl p-4 sm:p-8 shadow-xl w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3 font-['Nunito_Sans']">
          Tic Tac Toe
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-4 px-2">
          {gameMode === 'computer' ? 'You are X, computer is O.' : 'Get three in a row to win!'}
        </p>
        
        <div className="flex justify-center gap-2 sm:gap-4 mb-4">
          <Button
            onClick={() => handleGameModeChange('computer')}
            variant={gameMode === 'computer' ? "default" : "outline"}
            className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-xl font-semibold transition-all flex items-center space-x-2 ${
              gameMode === 'computer' 
                ? 'gradient-bg text-white shadow-lg' 
                : 'border-purple-300 text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>vs AI</span>
          </Button>
          <Button
            onClick={() => handleGameModeChange('player')}
            variant={gameMode === 'player' ? "default" : "outline"}
            className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-xl font-semibold transition-all flex items-center space-x-2 ${
              gameMode === 'player' 
                ? 'gradient-bg text-white shadow-lg' 
                : 'border-purple-300 text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>vs Player</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
          <div className="text-lg font-semibold text-purple-600 h-8 flex items-center">
            {ticTacToeWinner ? 
              (ticTacToeWinner === 'Tie' ? "It's a tie!" : 
               gameMode === 'computer' ? 
                 (ticTacToeWinner === 'X' ? "You win!" : "Computer wins!") :
                 `🎉 Player ${ticTacToeWinner} wins!`) :
              (isComputerTurn ? "Computer is thinking..." : 
               gameMode === 'computer' ? 
                 (currentPlayer === 'X' ? "Your turn (X)" : "Computer's turn (O)") :
                 `Current Player: ${currentPlayer}`)
            }
          </div>
          <Button
            onClick={initializeTicTacToe}
            variant="outline"
            size="sm"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xs mx-auto">
        {ticTacToeBoard.map((cell, index) => (
          <motion.div
            key={index}
            className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center text-5xl sm:text-6xl font-bold bg-white/80 shadow-lg hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400 ${
              isComputerTurn ? 'cursor-not-allowed opacity-75' : ''
            }`}
            onClick={() => handleTicTacToeClick(index)}
            whileHover={{ scale: isComputerTurn ? 1 : 1.05 }}
            whileTap={{ scale: isComputerTurn ? 1 : 0.95 }}
          >
            <span className={cell === 'X' ? 'text-blue-500' : 'text-pink-500'}>
              {cell}
            </span>
          </motion.div>
        ))}
      </div>

      {ticTacToeWinner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center"
        >
          <div className="glass-effect rounded-2xl p-4 max-w-sm mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
              {ticTacToeWinner === 'Tie' ? '🤝 Great Game!' : 
               gameMode === 'computer' ? 
                 (ticTacToeWinner === 'X' ? '🎉 You Won!' : '🤖 Computer Won!') :
                 '🎉 Game Over!'}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {ticTacToeWinner === 'Tie' ? 
                "Nobody wins this time!" : 
                gameMode === 'computer' ?
                  (ticTacToeWinner === 'X' ? "Congratulations! You beat the computer!" : "The computer got you this time! Try again!") :
                  `Player ${ticTacToeWinner} is the winner!`
              }
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TicTacToeGame;