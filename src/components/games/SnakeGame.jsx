"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, Pause, Trophy, Zap, Gamepad } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useProgress, progressConfig } from '@/contexts/ProgressContext';

// Canvas-based performant Snake game component
const SnakeGame = ({ gameId = 'snake-game-1' }) => {
  const BOARD_SIZE = 20; // logical grid dimension
  const MIN_CELL_PIXEL = 25; // minimum cell pixel size for fat-finger controls
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_FOOD = { x: 15, y: 15 };
  const INITIAL_DIRECTION = { x: 0, y: -1 };
  const MIN_SPEED_MS = 80; // max speed = smaller ms
  const INITIAL_SPEED_MS = 150;

  // React state for UI-only updates (score, high score, control booleans)
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for mutable game state to avoid frequent re-renders
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTickRef = useRef(0);
  const accumulatedRef = useRef(0);
  const snakeRef = useRef([...INITIAL_SNAKE]);
  const directionRef = useRef({ ...INITIAL_DIRECTION });
  const foodRef = useRef({ ...INITIAL_FOOD });
  const speedRef = useRef(INITIAL_SPEED_MS);
  const scoreRef = useRef(0);
  const gameRunningRef = useRef(false);
  const gameOverRef = useRef(false);
  const isPausedRef = useRef(false);
  const boardShakeRef = useRef(false);

  // Pointer handling
  const pointerStart = useRef(null);
  const SWIPE_THRESHOLD = 50; // px

  const { toast } = useToast();
  const { user } = useAuth();
  const { addPoints } = useProgress();
  const supabase = useSupabaseClient();

  // Utility: persist high score
  const setHighScoreAndPersist = useCallback((value) => {
    setHighScore(value);
    try { localStorage.setItem('snakeHighScore', String(value)); } catch (e) { /* ignore */ }
  }, []);

  // Game over handler
  const handleGameOver = useCallback(async (finalScore) => {
    gameOverRef.current = true;
    setGameOver(true);
    setGameRunning(false);
    gameRunningRef.current = false;

    boardShakeRef.current = true;
    setTimeout(() => { boardShakeRef.current = false; }, 500);

    if (finalScore > highScore) {
      setHighScoreAndPersist(finalScore);
      toast({ title: '🎉 New High Score!', description: `You scored ${finalScore}` });
    } else {
      toast({ title: '💥 Game Over', description: `You scored ${finalScore}` });
    }

    if (user && finalScore > 0) {
      addPoints(progressConfig.pointValues.GAME_LEVEL, 'Playing Snake', `${progressConfig.activityTypes.GAME_LEVEL}_${gameId}`);
      try {
        const { error } = await supabase.from('game_scores').insert({ user_id: user.id, game_id: gameId, score: finalScore });
        if (error) console.error('Supabase error:', error);
      } catch (err) {
        console.error('Submit score error', err);
      }
    }
  }, [gameId, user, toast, highScore, addPoints, setHighScoreAndPersist]);

  // Food generator (avoid infinite loop when board almost full)
  const generateFood = useCallback(() => {
    const maxAttempts = 500;
    let attempt = 0;
    let pos = null;
    while (attempt++ < maxAttempts) {
      const candidate = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };
      const collision = snakeRef.current.some(s => s.x === candidate.x && s.y === candidate.y);
      if (!collision) { pos = candidate; break; }
    }
    return pos || { x: 0, y: 0 };
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    snakeRef.current = [...INITIAL_SNAKE];
    directionRef.current = { ...INITIAL_DIRECTION };
    foodRef.current = { ...INITIAL_FOOD };
    speedRef.current = INITIAL_SPEED_MS;
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setGameRunning(false);
    setIsPaused(false);
    gameRunningRef.current = false;
    gameOverRef.current = false;
    isPausedRef.current = false;
    renderCanvas();
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    if (gameOverRef.current) resetGame();
    setGameRunning(true);
    setIsPaused(false);
    gameRunningRef.current = true;
    isPausedRef.current = false;
    lastTickRef.current = performance.now();
    accumulatedRef.current = 0;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
  }, [resetGame]);

  // Pause
  const pauseGame = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  }, []);

  // Prevent direction reversal
  const attemptChangeDirection = (newDir) => {
    const cur = directionRef.current;
    if (cur.x + newDir.x === 0 && cur.y + newDir.y === 0) return;
    directionRef.current = newDir;
  };

  // Move single step (mutates refs)
  const moveStep = useCallback(() => {
    const curSnake = snakeRef.current;
    const head = { ...curSnake[0] };
    const dir = directionRef.current;
    head.x += dir.x; head.y += dir.y;

    const isWallCollision = head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE;
    const isSelfCollision = curSnake.some(s => s.x === head.x && s.y === head.y);

    if (isWallCollision || isSelfCollision) { handleGameOver(scoreRef.current); return; }

    curSnake.unshift(head);
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 10; setScore(scoreRef.current);
      speedRef.current = Math.max(MIN_SPEED_MS, speedRef.current - 5);
      foodRef.current = generateFood();
      toast({ title: '✨ Pop!', description: '+10 points', duration: 800 });
      if (navigator?.vibrate) navigator.vibrate(30);
    } else {
      curSnake.pop();
    }
  }, [generateFood, handleGameOver, toast]);

  // RAF loop: time-based ticks
  const loop = useCallback((now) => {
    rafRef.current = requestAnimationFrame(loop);
    if (!gameRunningRef.current || isPausedRef.current || gameOverRef.current) { lastTickRef.current = now; return; }

    const delta = now - lastTickRef.current; lastTickRef.current = now; accumulatedRef.current += delta;
    const stepMs = speedRef.current;
    while (accumulatedRef.current >= stepMs) { moveStep(); accumulatedRef.current -= stepMs; }
    renderCanvas();
  }, [moveStep]);

  // Helper: rounded rect drawing
  const roundRect = (ctx, x, y, width, height, radius) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + width, y, x + width, y + height, r); ctx.arcTo(x + width, y + height, x, y + height, r); ctx.arcTo(x, y + height, x, y, r); ctx.arcTo(x, y, x + width, y, r); ctx.closePath();
  };

  // Render onto canvas: grid, food, snake
  const renderCanvas = () => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;

    const w = canvas.width; const h = canvas.height; const cellSize = Math.floor(Math.min(w, h) / BOARD_SIZE);
    if (boardShakeRef.current) { const sx = (Math.random()-0.5)*6; const sy = (Math.random()-0.5)*6; ctx.setTransform(1,0,0,1,sx,sy); } else { ctx.setTransform(1,0,0,1,0,0); }

    ctx.fillStyle = '#0b1221'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_SIZE; x++) { const px = Math.round(x*cellSize); ctx.beginPath(); ctx.moveTo(px,0); ctx.lineTo(px,cellSize*BOARD_SIZE); ctx.stroke(); }
    for (let y = 0; y <= BOARD_SIZE; y++) { const py = Math.round(y*cellSize); ctx.beginPath(); ctx.moveTo(0,py); ctx.lineTo(cellSize*BOARD_SIZE,py); ctx.stroke(); }

    // Food
    const f = foodRef.current; const fx = f.x*cellSize + cellSize/2; const fy = f.y*cellSize + cellSize/2; const foodRadius = Math.min(cellSize, cellSize)*0.3;
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.arc(fx, fy, foodRadius, 0, Math.PI*2); ctx.fill();

    // Snake
    const snake = snakeRef.current; snake.forEach((segment, idx) => {
      const sx = segment.x*cellSize; const sy = segment.y*cellSize; const pad = Math.max(1, cellSize*0.08);
      if (idx === 0) { ctx.fillStyle = '#06b6d4'; roundRect(ctx, sx+pad, sy+pad, cellSize-pad*2, cellSize-pad*2, 6); ctx.fill(); } else { ctx.fillStyle = '#0891b2'; roundRect(ctx, sx+pad, sy+pad, cellSize-pad*2, cellSize-pad*2, 3); ctx.fill(); }
    });
  };

  // Keyboard input
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!gameRunningRef.current || isPausedRef.current) return;
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') attemptChangeDirection({ x: 0, y: -1 });
      if (key === 'arrowdown' || key === 's') attemptChangeDirection({ x: 0, y: 1 });
      if (key === 'arrowleft' || key === 'a') attemptChangeDirection({ x: -1, y: 0 });
      if (key === 'arrowright' || key === 'd') attemptChangeDirection({ x: 1, y: 0 });
      if (key === ' ') { pauseGame(); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown);
  }, [pauseGame]);

  // Pointer events for swipe on the canvas
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;

    const handlePointerDown = (e) => { pointerStart.current = { x: e.clientX, y: e.clientY }; try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } };
    const handlePointerMove = (e) => { if (!pointerStart.current || !gameRunningRef.current || isPausedRef.current) return; const dx = e.clientX - pointerStart.current.x; const dy = e.clientY - pointerStart.current.y; if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return; if (Math.abs(dx) > Math.abs(dy)) attemptChangeDirection({ x: dx > 0 ? 1 : -1, y: 0 }); else attemptChangeDirection({ x: 0, y: dy > 0 ? 1 : -1 }); pointerStart.current = null; };
    const handlePointerUp = (e) => { try { canvas.releasePointerCapture(e.pointerId); } catch {} pointerStart.current = null; };

    canvas.addEventListener('pointerdown', handlePointerDown); canvas.addEventListener('pointermove', handlePointerMove); canvas.addEventListener('pointerup', handlePointerUp); canvas.addEventListener('pointercancel', handlePointerUp);
    return () => { canvas.removeEventListener('pointerdown', handlePointerDown); canvas.removeEventListener('pointermove', handlePointerMove); canvas.removeEventListener('pointerup', handlePointerUp); canvas.removeEventListener('pointercancel', handlePointerUp); };
  }, []);

  // Resize canvas to devicePixelRatio and ensure min cell size
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current; if (!canvas) return;
      const maxWidth = Math.min(window.innerWidth * 0.9, 720); const baseSize = Math.floor(Math.min(maxWidth, window.innerHeight * 0.7)); const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasSize = baseSize * dpr; canvas.width = Math.floor(BOARD_SIZE * (canvasSize / dpr)); canvas.height = Math.floor(BOARD_SIZE * (canvasSize / dpr)); canvas.style.width = `${Math.floor(canvas.width / dpr)}px`; canvas.style.height = `${Math.floor(canvas.height / dpr)}px`; const ctx = canvas.getContext('2d'); ctx && ctx.setTransform(dpr, 0, 0, dpr, 0, 0); renderCanvas();
    };
    resize(); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize);
  }, []);

  // Load persisted high score
  useEffect(() => { try { const raw = localStorage.getItem('snakeHighScore'); if (raw) setHighScore(parseInt(raw)); } catch {} }, []);

  // Start RAF loop on mount
  useEffect(() => { if (!rafRef.current) rafRef.current = requestAnimationFrame(loop); return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; }; }, [loop]);

  // initial render
  useEffect(() => { renderCanvas(); }, []);

  // initial controls: start/stop buttons etc render
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="text-white w-full mx-auto bg-black min-h-screen p-4">
      <div className="text-center mb-8 px-4">
        <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-lg font-semibold text-green-400"><Trophy className="w-5 h-5" /> <span>Score: {score}</span></div>
          <div className="flex items-center gap-2 text-lg font-semibold text-red-400"><Zap className="w-5 h-5" /> <span>High Score: {highScore}</span></div>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 shadow-lg shadow-green-500/50" disabled={gameRunning && !gameOver}><Play className="w-4 h-4" />{gameOver ? 'Play Again' : 'Start'}</Button>
          {gameRunning && !gameOver && (<Button onClick={pauseGame} className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2 shadow-lg shadow-yellow-500/50"><Pause className="w-4 h-4" /> {isPaused ? 'Resume' : 'Pause'}</Button>)}
          <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-lg shadow-purple-500/50"><RotateCcw className="w-4 h-4" /> Reset</Button>
        </div>
      </div>

      {isPaused && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-semibold text-yellow-400 mb-4 animate-pulse text-center">⏸️ Game Paused - Press Space or Resume</motion.div>)}
      {gameRunning && !isPaused && !gameOver && (<div className="text-sm text-gray-500 mb-4 text-center">Use arrow keys or swipe on the board to move</div>)}

      <div className="flex justify-center mb-4 px-2">
        <div className="relative rounded-3xl shadow-2xl border-8 border-purple-700 overflow-hidden bg-gray-900 p-2" style={{ width: '90vw', maxWidth: 520 }}>
          <canvas ref={canvasRef} className="rounded-xl block w-full h-auto touch-none" />
        </div>
      </div>

      {gameOver && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="bg-red-900/70 p-6 rounded-2xl max-w-md mx-auto border-4 border-red-700 shadow-2xl shadow-red-900/70">
            <h3 className="text-3xl font-bold text-red-400 mb-3"><Gamepad className='inline-block w-6 h-6 mr-2' /> FAILURE</h3>
            <p className="text-gray-300 mb-2">Final Score: <span className="font-bold text-green-400">{score}</span></p>
            {score === highScore && score > 0 && (<p className="text-sm text-yellow-400 font-semibold mt-3">🎉 New High Score Recorded!</p>)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  };

export default SnakeGame;

