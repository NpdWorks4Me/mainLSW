/* eslint-disable no-unused-vars */
// SnakeScene is exported as a factory that receives the Phaser module at runtime.
// This avoids bundling Phaser into non-game chunks and enables dynamic loading.
import useGameStore from '../store';

// Export a factory: call createSnakeScene(Phaser) to get a Scene subclass.
export default function createSnakeScene(Phaser) {
  return class SnakeScene extends Phaser.Scene {
    constructor() {
      super({ key: 'SnakeScene' });
      this.boardSize = 20;
      this.cellSize = 24; // will be recalculated on resize
      this.snake = [];
      this.food = { x: 0, y: 0 };
      this.direction = { x: 0, y: -1 };
      this.speedMs = 150;
      this.score = 0;
      this.timer = null;
      this.started = false;
    }

  init() {
    this.game.events.on('resize', this.resize, this);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    try { console.debug('[SnakeScene] create() called'); } catch (e) {}
    // Setup input for touch
  this.input.on('pointerdown', this.handlePointerDown, this);
  this.input.on('pointermove', this.handlePointerMove, this);
  this.input.on('pointerup', this.handlePointerUp, this);
    // Also attach DOM pointer listeners directly to the canvas to improve
    // compatibility with synthetic PointerEvents from Playwright tests.
    try {
      const canvas = this.sys && this.sys.canvas;
      if (canvas && canvas.addEventListener) {
  this.__domPointerDown = (e) => { const r = canvas.getBoundingClientRect(); return this.handlePointerDown({ event: e, x: e.clientX - r.left, y: e.clientY - r.top }); };
  this.__domPointerMove = (e) => { const r = canvas.getBoundingClientRect(); return this.handlePointerMove({ event: e, x: e.clientX - r.left, y: e.clientY - r.top }); };
  this.__domMouseMove = (e) => { const r = canvas.getBoundingClientRect(); return this.handlePointerMove({ event: e, x: e.clientX - r.left, y: e.clientY - r.top }); };
  this.__domMouseUp = (e) => { const r = canvas.getBoundingClientRect(); return this.handlePointerUp({ event: e, x: e.clientX - r.left, y: e.clientY - r.top }); };
        canvas.addEventListener('pointerdown', this.__domPointerDown);
        canvas.addEventListener('pointermove', this.__domPointerMove);
  canvas.addEventListener('mousemove', this.__domMouseMove);
  canvas.addEventListener('mouseup', this.__domMouseUp);
      }
    } catch (err) { /* ignore */ }
    // Keyboard support: map Arrow keys and WASD to direction
    this.input.keyboard?.on('keydown', (e) => {
      if (!this.started) return;
      const key = (e.key || '').toLowerCase();
      switch (key) {
        case 'arrowup': case 'w': this.setDirection({ x: 0, y: -1 }); break;
        case 'arrowdown': case 's': this.setDirection({ x: 0, y: 1 }); break;
        case 'arrowleft': case 'a': this.setDirection({ x: -1, y: 0 }); break;
        case 'arrowright': case 'd': this.setDirection({ x: 1, y: 0 }); break;
        default: break;
      }
    });
  // graphics layer
  this.graphics = this.add.graphics();
  // Ensure initial sizing/draw (Phaser may not emit resize automatically on create)
  this.resize({ width: this.sys.canvas.width, height: this.sys.canvas.height });
    // Do not start the game automatically; wait for startGame() to be called
  }

  resetGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = { x: 0, y: -1 };
    this.food = this.generateFood();
    this.score = 0;
    useGameStore.getState().setScore(0);
    useGameStore.getState().setRunning(false);
    useGameStore.getState().setPaused(false);
    useGameStore.getState().setHighScore(useGameStore.getState().highScore);
  }

  startGame() {
    this.resetGame();
    if (this.timer) this.timer.remove();
    this.timer = this.time.addEvent({ delay: this.speedMs, loop: true, callback: this.tick, callbackScope: this });
    this.started = true;
    useGameStore.getState().setRunning(true);
    useGameStore.getState().setPaused(false);
    try { console.debug('[SnakeScene] startGame() started', { score: this.score, boardSize: this.boardSize, speedMs: this.speedMs }); } catch (e) {}
  }

  pauseGame() {
    if (this.timer) this.timer.paused = true;
    useGameStore.getState().setPaused(true);
    useGameStore.getState().setRunning(false);
  }

  resumeGame() {
    if (this.timer) this.timer.paused = false;
    useGameStore.getState().setPaused(false);
    useGameStore.getState().setRunning(true);
  }

  stopGame() {
    if (this.timer) { this.timer.remove(); this.timer = null; }
    useGameStore.getState().setRunning(false);
    useGameStore.getState().setPaused(false);
    this.started = false;
  }

  setBoardSize(boardSize) {
    if (!Number.isInteger(boardSize) || boardSize < 5) return;
    this.boardSize = boardSize;
    // Recalculate cell size immediately
    this.resize({ width: this.sys.canvas.width, height: this.sys.canvas.height });
  }

    generateFood() {
      const { snake } = this;
      const maxAttempts = 500;
      let attempt = 0;
      while (attempt++ < maxAttempts) {
        const candidate = { x: Phaser.Math.Between(0, this.boardSize - 1), y: Phaser.Math.Between(0, this.boardSize - 1) };
        if (!snake.some(s => s.x === candidate.x && s.y === candidate.y)) return candidate;
      }
      return { x: 0, y: 0 };
    }

  tick() {
    try { /* tick start */ } catch (e) {}
    // movement
    const head = { ...this.snake[0] };
    head.x += this.direction.x; head.y += this.direction.y;
    const wall = head.x < 0 || head.x >= this.boardSize || head.y < 0 || head.y >= this.boardSize;
    const self = this.snake.some(s => s.x === head.x && s.y === head.y);
    if (wall || self) {
      this.gameOver();
      return;
    }
    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      useGameStore.getState().addScore(10);
      this.speedMs = Math.max(80, this.speedMs - 5);
      this.food = this.generateFood();
      this.events.emit('ateFood', this.score);
    } else {
      this.snake.pop();
    }
    this.events.emit('update', { snake: this.snake, food: this.food, score: this.score });
    this.draw();
    try { /* tick end */ } catch (e) {}
  }

  draw() {
    if (!this.graphics) return;
    this.graphics.clear();
    const cell = this.cellSize || Math.floor(Math.min(this.sys.canvas.width, this.sys.canvas.height) / this.boardSize);
    // background
    this.graphics.fillStyle(0x0b1221, 1);
    this.graphics.fillRect(0, 0, this.sys.canvas.width, this.sys.canvas.height);
    // grid
    this.graphics.lineStyle(1, 0xffffff, 0.03);
    for (let i = 0; i <= this.boardSize; i++) {
      this.graphics.lineBetween(i * cell, 0, i * cell, cell * this.boardSize);
      this.graphics.lineBetween(0, i * cell, cell * this.boardSize, i * cell);
    }
    // food
    this.graphics.fillStyle(0xffd166, 1);
    this.graphics.fillCircle(this.food.x * cell + cell / 2, this.food.y * cell + cell / 2, cell * 0.3);
    // snake
    this.snake.forEach((seg, idx) => {
      this.graphics.fillStyle(idx === 0 ? 0x06b6d4 : 0x0891b2, 1);
      this.graphics.fillRoundedRect(seg.x * cell + 2, seg.y * cell + 2, cell - 4, cell - 4, idx === 0 ? 4 : 2);
    });
  }

  setDirection(newDir) {
    const cur = this.direction;
    if (cur.x + newDir.x === 0 && cur.y + newDir.y === 0) return; // prevent 180
    this.direction = newDir;
  }

  gameOver() {
    useGameStore.getState().setRunning(false);
    useGameStore.getState().setPaused(false);
    useGameStore.getState().setScore(this.score);
    const st = useGameStore.getState();
    if (this.score > st.highScore) {
      st.setHighScore(this.score);
    }
    this.events.emit('gameOver', this.score);
    this.scene.pause();
  }

  // simplistic pointer handlers: direction change
  handlePointerDown(pointer) {
    // Use Phaser pointer coords if available, otherwise derive from DOM event
    const canvasRect = this.sys && this.sys.canvas ? this.sys.canvas.getBoundingClientRect() : { left: 0, top: 0 };
    const px = (typeof pointer.x === 'number' && !Number.isNaN(pointer.x)) ? pointer.x : ((pointer.event && (pointer.event.clientX - canvasRect.left)) || 0);
    const py = (typeof pointer.y === 'number' && !Number.isNaN(pointer.y)) ? pointer.y : ((pointer.event && (pointer.event.clientY - canvasRect.top)) || 0);
  try { console.debug('[SnakeScene] pointerDown', { px, py, pointer }); } catch (err) {}
  try { if (typeof window !== 'undefined' && window.__PHASER_DEBUG__) window.__PHASER_LAST_POINTER_EVENT = { type: 'down', pointerEvent: pointer.event || null, px, py }; } catch (err) {}
  this.pointerDownPos = { x: px, y: py };
  }
  handlePointerMove(pointer) {
    if (!this.pointerDownPos) return;
    const canvasRect = this.sys && this.sys.canvas ? this.sys.canvas.getBoundingClientRect() : { left: 0, top: 0 };
    const px = (typeof pointer.x === 'number' && !Number.isNaN(pointer.x)) ? pointer.x : ((pointer.event && (pointer.event.clientX - canvasRect.left)) || 0);
    const py = (typeof pointer.y === 'number' && !Number.isNaN(pointer.y)) ? pointer.y : ((pointer.event && (pointer.event.clientY - canvasRect.top)) || 0);
    const dx = px - this.pointerDownPos.x; const dy = py - this.pointerDownPos.y;
    const newDir = (Math.abs(dx) > Math.abs(dy))
      ? { x: dx > 0 ? 1 : -1, y: 0 }
      : { x: 0, y: dy > 0 ? 1 : -1 };
  try { console.debug('[SnakeScene] pointerMove', { dx, dy, newDir, pointer }); } catch (err) {}
    // Use setDirection to prevent invalid 180-degree reversals
    this.setDirection(newDir);
    // emit an event for tests/consumers so they can wait deterministically
    try {
      if (this.events) this.events.emit('pointerDirection', this.direction);
    } catch (err) { /* ignore */ }
    try { if (typeof window !== 'undefined' && window.__PHASER_DEBUG__) window.__PHASER_LAST_POINTER_EVENT = { type: 'move', pointerEvent: pointer.event || null, px, py, dx, dy, newDir }; } catch (err) {}
    // expose a debug global when opt-in for Playwright tests to query reliably
    try {
      if (typeof window !== 'undefined' && window.__PHASER_DEBUG__) {
        window.__PHASER_LAST_POINTER_DIR = this.direction;
      }
    } catch (err) { /* ignore */ }
    this.pointerDownPos = null;
  }

  handlePointerUp(pointer) {
    this.pointerDownPos = null;
    try { if (typeof window !== 'undefined' && window.__PHASER_DEBUG__) window.__PHASER_LAST_POINTER_EVENT = { type: 'up', pointerEvent: pointer.event || null }; } catch (err) {}
  }

  // Helper for tests: programmatically simulate a swipe from center by dx/dy
  processSimulatedSwipe({ dx = 0, dy = 0 } = {}) {
    try {
      try { console.debug('[SnakeScene] processSimulatedSwipe', { dx, dy }); } catch (err) {}
      const canvasRect = this.sys && this.sys.canvas ? this.sys.canvas.getBoundingClientRect() : { left: 0, top: 0, width: 100, height: 100 };
      const cx = canvasRect.width / 2; const cy = canvasRect.height / 2;
      // Simulate down -> move -> up sequence
      const downEvt = { event: { clientX: canvasRect.left + cx, clientY: canvasRect.top + cy } };
      this.handlePointerDown(downEvt);
      const moveEvt = { event: { clientX: canvasRect.left + cx + dx, clientY: canvasRect.top + cy + dy } };
      this.handlePointerMove(moveEvt);
      this.handlePointerUp(moveEvt);
    } catch (err) { /* ignore */ }
  }

    resize(gameSize) {
      const width = gameSize.width; const height = gameSize.height;
      // Decide based on displayed (CSS) size to match user-visible grid
      const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? Math.min(window.devicePixelRatio, 2) : 1;
      const cssWidth = (this.sys && this.sys.canvas && this.sys.canvas.clientWidth) ? this.sys.canvas.clientWidth : Math.round(width / dpr);
      const cssHeight = (this.sys && this.sys.canvas && this.sys.canvas.clientHeight) ? this.sys.canvas.clientHeight : Math.round(height / dpr);
      const cellSz = Math.floor(Math.min(cssWidth, cssHeight) / this.boardSize);
      // Keep cellSize in internal canvas pixels (CSS size * DPR)
      this.cellSize = Math.max(8, Math.round(cellSz * dpr));
      // Re-draw immediately so the grid fills the new area
      this.draw();
    }

  update() {
    // visual update is left to Phaser's graphics or to React; events fired on tick
  }

  // Clean up DOM listeners on scene shutdown
    shutdown() {
      try {
        const canvas = this.sys && this.sys.canvas;
        if (canvas && this.__domPointerDown) canvas.removeEventListener('pointerdown', this.__domPointerDown);
        if (canvas && this.__domPointerMove) canvas.removeEventListener('pointermove', this.__domPointerMove);
        if (canvas && this.__domMouseMove) canvas.removeEventListener('mousemove', this.__domMouseMove);
        if (canvas && this.__domMouseUp) canvas.removeEventListener('mouseup', this.__domMouseUp);
      } catch (err) { /* ignore */ }
    }
  };
}
