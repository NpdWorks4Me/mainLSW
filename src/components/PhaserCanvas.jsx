import React, { useEffect, useRef } from 'react';
// Phaser and SnakeScene are loaded dynamically to avoid bundling Phaser into the main bundle
import useGameStore from '../lib/store';

const PhaserCanvas = ({ width = '100%', height = '100%' }) => {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let scene = null;
    // Dynamically import Phaser and the scene factory on the client only
    const loadPhaser = async () => {
      try {
        const [sceneMod, phaserMod] = await Promise.all([
          import('../lib/phaser/SnakeScene'),
          import('phaser')
        ]);
        const createSnakeScene = sceneMod && sceneMod.default ? sceneMod.default : null;
        const PhaserLib = phaserMod && phaserMod.default ? phaserMod.default : phaserMod;
        if (!createSnakeScene || !PhaserLib) {
          console.error('[PhaserCanvas] Failed to dynamically import Phaser or SnakeScene');
          return;
        }
        scene = createSnakeScene(PhaserLib);
        // After loading, attempt to create the game
        if (mounted) createIfReady();
      } catch (err) {
        console.error('[PhaserCanvas] dynamic import failed', err);
      }
    };
    // Kick off dynamic import
    loadPhaser();

    const getSize = () => {
      const rect = containerRef.current?.getBoundingClientRect() || { width: 600, height: 600 };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      return { width: Math.round(rect.width * dpr), height: Math.round(rect.height * dpr) };
    };
    const size = getSize();
  const createConfig = (w, h) => ({
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: '#000000',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: w,
        height: h,
      },
      scene: [scene],
      physics: { default: 'arcade' },
  });

    // Defer creation to client only and ensure container has a size
    const createIfReady = () => {
      try {
        if (!containerRef.current) return false;
        const { width: w, height: h } = containerRef.current.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rw = Math.round(Math.max(1, w) * dpr);
        const rh = Math.round(Math.max(1, h) * dpr);
        if (rw <= 1 || rh <= 1) return false;
        if (!gameRef.current && scene) {
          gameRef.current = new (awaitablePhaserGameCreator(createConfig))(scene);
          // In case Phaser wasn't loaded at file top-level, we construct using the scene class
          try { if (gameRef.current && gameRef.current.canvas) gameRef.current.canvas.setAttribute('data-testid', 'phaser-canvas'); } catch (e) {}
          console.debug('[PhaserCanvas] Game created with', rw, rh);
        }
        return true;
      } catch (err) {
        console.error('[PhaserCanvas] Failed to create Phaser.Game', err);
        return false;
      }
    };

    // Helper to create Phaser.Game after dynamic import was done. We can't reference the Phaser
    // constructor until it's loaded; build an adapter that will create the Game when Phaser is available.
    function awaitablePhaserGameCreator(config) {
      // If Phaser is loaded, create Game immediately
      try {
        // eslint-disable-next-line global-require
        const PhaserLib = require('phaser');
        return function(SceneClass) {
          return new PhaserLib.Game({ ...config, scene: [SceneClass] });
        }(scene);
      } catch (err) {
        // Fallback: try to import Phaser synchronously isn't possible; throw to be caught above
        throw err;
      }
    }

    if (mounted) {
      // If the container already has a size, create immediately
      if (!createIfReady()) {
        // Otherwise, wait for the container to be sized using ResizeObserver
        const waitInterval = setInterval(() => {
          if (createIfReady()) clearInterval(waitInterval);
        }, 50);
        }
  // Debugging: log to console so Playwright captures attachment time
  try { console.debug('[PhaserCanvas] Game created', !!gameRef.current); } catch (e) {}
      // Controlled debug interface: only expose a getter when the test harness opts in
      try {
        if (typeof window !== 'undefined' && window.__PHASER_DEBUG__) {
          try { window.getPhaserGame = () => gameRef.current; } catch (e) { /* ignore */ }
          try { console.debug('[PhaserCanvas] window.getPhaserGame attached'); } catch (e) {}
          if (containerRef.current) {
            try { containerRef.current.getPhaserGame = () => gameRef.current; } catch (e) { /* ignore */ }
            try { console.debug('[PhaserCanvas] container.getPhaserGame attached'); } catch (e) {}
          }
        }
      } catch (e) { /* ignore */ }
      // Wire store updates and direction event once scene is created inside the game
      let gameScene = gameRef.current.scene.getScene('SnakeScene') || (gameRef.current.scene.getScenes && gameRef.current.scene.getScenes()[0]);
      // If the scene isn't immediately available, poll for a short while to attach listeners
  let scenePollAttempts = 0;
  const queuedControls = [];
  const queuedDirs = [];
  const queuedSwipes = [];
      const attachEvents = (s) => {
        if (s && s.events) {
          s.events.on('update', (payload) => {
            useGameStore.getState().setScore(payload.score || 0);
          });
          s.events.on('gameOver', (score) => {
            useGameStore.getState().setRunning(false);
          });
          s.events.on('ateFood', (score) => {
            useGameStore.getState().setScore(score);
          });
          // Allow test harness to trigger simulated swipes reliably
          try {
            const onSimSwipe = (ev) => { if (s && typeof s.processSimulatedSwipe === 'function') s.processSimulatedSwipe(ev.detail); };
            if (typeof window !== 'undefined') {
              window.addEventListener('snake-simulate-swipe', onSimSwipe);
              try { console.debug('[PhaserCanvas] attached snake-simulate-swipe listener'); } catch (e) {}
            }
            // store ref for cleanup
            s.__onSimSwipe = onSimSwipe;
          } catch (err) { try { console.error('[PhaserCanvas] failed to attach onSimSwipe', err); } catch (e) {} }
          return true;
        }
        return false;
      };

      if (!gameScene || !gameScene.events) {
        const interval = setInterval(() => {
          scenePollAttempts++;
          gameScene = gameRef.current.scene.getScene('SnakeScene') || (gameRef.current.scene.getScenes && gameRef.current.scene.getScenes()[0]);
          if (attachEvents(gameScene) || scenePollAttempts > 20) {
            clearInterval(interval);
            if (gameScene) {
              try { console.debug('[PhaserCanvas] Processing queued events', queuedControls.length, queuedDirs.length); } catch (err) {}
              queuedControls.forEach((d) => {
                const { action, value } = d || {};
                if (action === 'start') gameScene.startGame();
                if (action === 'pause') gameScene.pauseGame();
                if (action === 'resume') gameScene.resumeGame();
                if (action === 'reset') gameScene.resetGame();
                if (action === 'stop') gameScene.stopGame();
                if (action === 'setBoardSize') gameScene.setBoardSize(Number(value));
              });
              queuedDirs.forEach((dir) => gameScene.setDirection(dir));
              queuedSwipes.forEach((d) => { if (d && typeof gameScene.processSimulatedSwipe === 'function') gameScene.processSimulatedSwipe(d); });
              queuedSwipes.length = 0;
              queuedControls.length = 0; queuedDirs.length = 0;
              // attach cleanup handler ref on scene so tests don't leak
            }
          }
        }, 50);
      } else {
        attachEvents(gameScene);
        try { console.debug('[PhaserCanvas] Scene immediately available, processing queued events', queuedControls.length, queuedDirs.length); } catch (err) {}
        queuedControls.forEach((d) => {
          const { action, value } = d || {};
          if (action === 'start') gameScene.startGame();
          if (action === 'pause') gameScene.pauseGame();
          if (action === 'resume') gameScene.resumeGame();
          if (action === 'reset') gameScene.resetGame();
          if (action === 'stop') gameScene.stopGame();
          if (action === 'setBoardSize') gameScene.setBoardSize(Number(value));
        });
  queuedDirs.forEach((dir) => gameScene.setDirection(dir));
  queuedSwipes.forEach((d) => { if (d && typeof gameScene.processSimulatedSwipe === 'function') gameScene.processSimulatedSwipe(d); });
  queuedSwipes.length = 0;
        queuedControls.length = 0; queuedDirs.length = 0;
      }

  const onDir = (e) => {
        if (gameScene && typeof gameScene.setDirection === 'function') {
          gameScene.setDirection(e.detail);
        } else {
          try { console.debug('[PhaserCanvas] Queuing direction event', e.detail); } catch (err) {}
          queuedDirs.push(e.detail);
        }
      };
  window.addEventListener('snake-direction', onDir);
  const onSim = (e) => {
    if (gameScene && typeof gameScene.processSimulatedSwipe === 'function') {
      gameScene.processSimulatedSwipe(e.detail);
    } else {
      queuedSwipes.push(e.detail);
    }
  };
  window.addEventListener('snake-simulate-swipe', onSim);

      // control events for game control: start/pause/resume/reset/setBoardSize
      const onCtl = (e) => {
        const { action, value } = e.detail || {};
        if (!gameScene) {
          try { console.debug('[PhaserCanvas] Queuing control event', e.detail); } catch (err) {}
          queuedControls.push(e.detail);
          return;
        }
        switch (action) {
          case 'start': gameScene.startGame(); break;
          case 'pause': gameScene.pauseGame(); break;
          case 'resume': gameScene.resumeGame(); break;
          case 'reset': gameScene.resetGame(); break;
          case 'stop': gameScene.stopGame(); break;
          case 'setBoardSize': gameScene.setBoardSize(Number(value)); break;
          default: break;
        }
      };
      window.addEventListener('snake-control', onCtl);
    }

    const onResize = () => {
      if (!gameRef.current || !containerRef.current) return;
      const { width, height } = getSize();
      if (gameRef.current?.scale) gameRef.current.scale.resize(width, height);
      gameRef.current?.events?.emit('resize', { width, height });
    };
    const observer = new ResizeObserver(onResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      mounted = false;
      if (gameRef.current) {
        try { gameRef.current.destroy(true); } catch (e) { /* ignore */ }
        gameRef.current = null;
      }
  window.removeEventListener('snake-direction', onDir);
  window.removeEventListener('snake-simulate-swipe', onSim);
      try { if (gameRef.current && gameRef.current.scene) {
        const s = gameRef.current.scene.getScene('SnakeScene') || (gameRef.current.scene.getScenes && gameRef.current.scene.getScenes()[0]);
        if (s && s.__onSimSwipe) { window.removeEventListener('snake-simulate-swipe', s.__onSimSwipe); delete s.__onSimSwipe; }
      } } catch (err) { /* ignore */ }
    window.removeEventListener('snake-control', onCtl);
      observer.disconnect();
  try { if (containerRef.current && containerRef.current.getPhaserGame) { delete containerRef.current.getPhaserGame; } } catch (e) {}
  try { if (window && window.getPhaserGame) delete window.getPhaserGame; } catch (e) {}
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width, height }} className="phaser-container" />
  );
};

export default PhaserCanvas;
