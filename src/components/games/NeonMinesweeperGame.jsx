import React, { useState, useEffect, useRef, useCallback } from 'react';

const NeonMinesweeperGame = () => {
    const DIFFICULTY_LEVELS = {
        easy: { GRID_SIZE: 10, MINE_COUNT: 10 },
        medium: { GRID_SIZE: 16, MINE_COUNT: 40 },
        hard: { GRID_SIZE: 24, MINE_COUNT: 99 }
    };

    const [difficultyKey, setDifficultyKey] = useState('medium');
    const [grid, setGrid] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [flagsRemaining, setFlagsRemaining] = useState(DIFFICULTY_LEVELS.medium.MINE_COUNT);
    const [cellsRevealed, setCellsRevealed] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [message, setMessage] = useState({ title: '', text: '', show: false });
    const [faceIcon, setFaceIcon] = useState('smile');
    const [showInstructionsModal, setShowInstructionsModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [actionType, setActionType] = useState('reveal'); // 'reveal' or 'flag'

    const timerIntervalRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 640;
            setIsMobile(newIsMobile);
            if (newIsMobile && (difficultyKey === 'hard' || difficultyKey === 'medium')) {
                setDifficultyKey('easy');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [difficultyKey]);

    const stopTimer = useCallback(() => {
        clearInterval(timerIntervalRef.current);
    }, []);

    const initializeGame = useCallback(() => {
        let currentKey = difficultyKey;
        if (window.innerWidth < 640 && (currentKey === 'hard' || currentKey === 'medium')) {
            currentKey = 'easy';
            setDifficultyKey('easy');
        }

        const config = DIFFICULTY_LEVELS[currentKey];
        const { GRID_SIZE, MINE_COUNT } = config;

        setIsGameOver(false);
        setIsGameStarted(false);
        setFlagsRemaining(MINE_COUNT);
        setCellsRevealed(0);
        setSeconds(0);
        stopTimer();
        setFaceIcon('smile');
        setMessage({ show: false });
        setShowInstructionsModal(false);

        const newGrid = Array.from({ length: GRID_SIZE }, (_, r) =>
            Array.from({ length: GRID_SIZE }, (_, c) => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighbors: 0,
                row: r,
                col: c,
                exploded: false,
                incorrectFlag: false,
            }))
        );
        setGrid(newGrid);
    }, [difficultyKey, stopTimer]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const placeMines = useCallback((startRow, startCol, currentGrid) => {
        const { GRID_SIZE, MINE_COUNT } = DIFFICULTY_LEVELS[difficultyKey];
        let newGrid = JSON.parse(JSON.stringify(currentGrid));
        let minesPlaced = 0;
        const safeCells = new Set();

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const r = startRow + dr;
                const c = startCol + dc;
                if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
                    safeCells.add(`${r},${c}`);
                }
            }
        }

        while (minesPlaced < MINE_COUNT) {
            const r = Math.floor(Math.random() * GRID_SIZE);
            const c = Math.floor(Math.random() * GRID_SIZE);

            if (!newGrid[r][c].isMine && !safeCells.has(`${r},${c}`)) {
                newGrid[r][c].isMine = true;
                minesPlaced++;
            }
        }
        return newGrid;
    }, [difficultyKey]);

    const calculateNeighborCounts = useCallback((currentGrid) => {
        const { GRID_SIZE } = DIFFICULTY_LEVELS[difficultyKey];
        let newGrid = JSON.parse(JSON.stringify(currentGrid));

        const countMinesAround = (r, c) => {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].isMine) {
                        count++;
                    }
                }
            }
            return count;
        };

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (!newGrid[r][c].isMine) {
                    newGrid[r][c].neighbors = countMinesAround(r, c);
                }
            }
        }
        return newGrid;
    }, [difficultyKey]);

    const startTimer = () => {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
    };

    const gameOver = useCallback((won, explodedR, explodedC) => {
        setIsGameOver(true);
        stopTimer();

        let title, text;
        if (won) {
            title = "SYSTEM: SUCCESSFUL DEPLOYMENT";
            text = `Field cleared in ${seconds} seconds. Mission complete.`;
            setFaceIcon('smile');
            setFlagsRemaining(0);
        } else {
            title = "SYSTEM: CRITICAL FAILURE";
            text = `Mine hit at T+${seconds} seconds. System reboot required.`;
            setFaceIcon('frown');
        }

        setGrid(prevGrid => {
            const newGrid = JSON.parse(JSON.stringify(prevGrid));
            for (let r = 0; r < newGrid.length; r++) {
                for (let c = 0; c < newGrid[r].length; c++) {
                    const cell = newGrid[r][c];
                    if (cell.isMine) {
                        cell.isRevealed = true;
                        if (r === explodedR && c === explodedC) {
                            cell.exploded = true;
                        }
                    } else if (cell.isFlagged && !cell.isMine) {
                        cell.incorrectFlag = true;
                    }
                }
            }
            return newGrid;
        });

        setMessage({ title, text, show: true });
    }, [seconds, stopTimer]);

    const checkWinCondition = useCallback((revealedCount) => {
        const { GRID_SIZE, MINE_COUNT } = DIFFICULTY_LEVELS[difficultyKey];
        const nonMineCells = GRID_SIZE * GRID_SIZE - MINE_COUNT;
        if (revealedCount === nonMineCells) {
            gameOver(true);
        }
    }, [difficultyKey, gameOver]);

    const revealCell = useCallback((r, c, currentGrid) => {
        const { GRID_SIZE } = DIFFICULTY_LEVELS[difficultyKey];
        let newGrid = JSON.parse(JSON.stringify(currentGrid));
        let revealedCount = 0;
        const cellsToReveal = [{ r, c }];
        const visited = new Set();

        while (cellsToReveal.length > 0) {
            const { r: row, c: col } = cellsToReveal.pop();
            const key = `${row},${col}`;

            if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || visited.has(key)) continue;

            const cell = newGrid[row][col];
            if (cell.isRevealed || cell.isFlagged) continue;

            visited.add(key);
            cell.isRevealed = true;
            revealedCount++;

            if (cell.neighbors === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr !== 0 || dc !== 0) {
                            cellsToReveal.push({ r: row + dr, c: col + dc });
                        }
                    }
                }
            }
        }
        return { newGrid, revealedCount };
    }, [difficultyKey]);

    const handleCellClick = useCallback((r, c) => {
        if (isGameOver || grid[r][c].isRevealed) return;

        if (isMobile && actionType === 'flag') {
            handleRightClick(r, c);
            return;
        }

        if (!isGameStarted) {
            setIsGameStarted(true);
            startTimer();

            setGrid(prevGrid => {
                let newGrid = placeMines(r, c, prevGrid);
                newGrid = calculateNeighborCounts(newGrid);
                const { newGrid: revealedGrid, revealedCount } = revealCell(r, c, newGrid);
                const totalRevealed = cellsRevealed + revealedCount;
                setCellsRevealed(totalRevealed);
                checkWinCondition(totalRevealed);
                return revealedGrid;
            });
            return;
        }

        if (grid[r][c].isFlagged) return;

        if (grid[r][c].isMine) {
            gameOver(false, r, c);
        } else {
            setGrid(prevGrid => {
                const { newGrid, revealedCount } = revealCell(r, c, prevGrid);
                const totalRevealed = cellsRevealed + revealedCount;
                setCellsRevealed(totalRevealed);
                checkWinCondition(totalRevealed);
                return newGrid;
            });
        }
    }, [isGameOver, grid, isGameStarted, isMobile, actionType, placeMines, calculateNeighborCounts, revealCell, cellsRevealed, checkWinCondition, gameOver]);

    const handleRightClick = useCallback((r, c) => {
        if (isGameOver || grid[r][c].isRevealed) return;

        setGrid(prevGrid => {
            const newGrid = JSON.parse(JSON.stringify(prevGrid));
            const cell = newGrid[r][c];

            if (cell.isFlagged) {
                cell.isFlagged = false;
                setFlagsRemaining(f => f + 1);
            } else if (flagsRemaining > 0) {
                cell.isFlagged = true;
                setFlagsRemaining(f => f - 1);
            }
            return newGrid;
        });
    }, [isGameOver, grid, flagsRemaining]);

    const handleContextMenu = (e, r, c) => {
        e.preventDefault();
        if (isGameOver) return;
        handleRightClick(r, c);
    };

    const handleDifficultyChange = (e) => {
        const newKey = e.target.value;
        if (isMobile && (newKey === 'hard' || newKey === 'medium')) return;
        setDifficultyKey(newKey);
    };

    const getCellClass = (cell) => {
        let classes = 'cell';
        if (cell.isRevealed) {
            classes += ' revealed';
            if (cell.isMine) {
                classes += ' mine';
                if (cell.exploded) classes += ' exploded';
            } else if (cell.neighbors > 0) {
                classes += ` color-${cell.neighbors}`;
            }
        } else if (cell.isFlagged) {
            classes += ' flagged';
        }
        if (isGameOver && !cell.isMine && cell.isFlagged) {
            classes += ' incorrect-flag';
        }
        return classes;
    };

    const getCellContent = (cell) => {
        if (isGameOver && !cell.isMine && cell.isFlagged) return '❌';
        if (cell.isRevealed) {
            if (cell.isMine) return '💣';
            if (cell.neighbors > 0) return cell.neighbors;
        }
        if (cell.isFlagged) return '🚩';
        return '';
    };

    const { GRID_SIZE } = DIFFICULTY_LEVELS[difficultyKey];
    const baseFontSize = GRID_SIZE <= 10 ? '1.1rem' : GRID_SIZE <= 16 ? '1rem' : '0.8rem';

    return (
        <>
            <style>{`
                .game-container { font-family: 'Major Mono Display', monospace; background-color: #000000; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 1rem; }
                .game-content { background: #1e1e1e; border-radius: 16px; padding: 1rem; width: 100%; max-width: 95vw; min-width: 320px; border: 1px solid #00FFFF; box-shadow: 0 0 30px rgba(0, 255, 255, 0.3), 0 0 10px rgba(0, 255, 255, 0.1); display: flex; flex-direction: column; align-items: center; }
                @media (min-width: 1024px) { .game-content { max-width: 700px; padding: 20px; } }
                .grid-and-controls-wrapper { display: flex; justify-content: center; align-items: flex-start; width: 100%; max-width: 100%; margin: 0 auto; overflow-x: auto; }
                .control-panel { margin-bottom: 15px; padding: 10px 0; display: flex; flex-direction: column; gap: 15px; justify-content: center; align-items: center; }
                .status-bar { background-color: #0d0d0d; padding: 12px 16px; border-radius: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; gap: 10px; border: 1px solid rgba(0, 255, 255, 0.5); width: 100%; max-width: 550px; }
                .counter-display { background-color: #000000; color: #00FFFF; font-family: 'Major Mono Display', monospace; font-size: 1.5rem; padding: 4px 8px; border-radius: 8px; min-width: 60px; text-align: center; font-weight: bold; box-shadow: inset 0 0 8px rgba(0, 255, 255, 0.5); text-shadow: 0 0 5px #00FFFF, 0 0 10px #00FFFF; letter-spacing: 2px; }
                @media (min-width: 640px) { .counter-display { font-size: 2rem; min-width: 80px; } }
                .status-icon-group { display: flex; align-items: center; gap: 8px; }
                #flagIcon { color: #FF00FF; }
                #timerIcon { color: #FF00FF; }
                #resetButton { width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; border: 2px solid #00FFFF; cursor: pointer; transition: all 0.2s; border-radius: 50%; background-color: #000000; color: #00FFFF; box-shadow: 0 0 10px #00FFFF, 0 0 5px #00FFFF; }
                #resetButton:hover { background-color: #00FFFF; color: #1e1e1e; box-shadow: 0 0 15px #00FFFF; transform: translateY(0); }
                #resetButton svg { width: 24px; height: 24px; transition: transform 0.2s; }
                #minesweeperGrid { display: grid; border: 1px solid #00FFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 255, 255, 0.5); max-width: min(90vw, 90vh, 550px); width: 100%; margin: 0 auto; flex-shrink: 0; }
                .cell { width: auto; height: auto; aspect-ratio: 1 / 1; display: flex; justify-content: center; align-items: center; text-align: center; background-color: #2c2c2c; border: 1px solid #1e1e1e; cursor: pointer; font-weight: bold; user-select: none; color: #ddd; transition: background-color 0.1s; font-size: ${baseFontSize}; touch-action: manipulation; }
                @media (max-width: 639px) { .cell { font-size: 1.2rem !important; } }
                .cell.revealed { background-color: #1e1e1e; cursor: default; border-color: #121212; color: #00FFFF; }
                .cell.flagged { background-color: #4a004a; color: #FF00FF; text-shadow: 0 0 3px #FF00FF; }
                .cell.mine { background-color: #8B0000; color: #FF0000; text-shadow: 0 0 5px #FF0000; }
                .cell.mine.exploded { background-color: #FF0000; box-shadow: 0 0 20px #FF0000; }
                .cell.incorrect-flag { background-color: #1e1e1e; }
                .color-1 { color: #00BFFF; text-shadow: 0 0 3px #00BFFF; }
                .color-2 { color: #39FF14; text-shadow: 0 0 3px #39FF14; }
                .color-3 { color: #FF0000; text-shadow: 0 0 3px #FF0000; }
                .color-4 { color: #7DF9FF; text-shadow: 0 0 3px #7DF9FF; }
                .color-5 { color: #FFD700; text-shadow: 0 0 3px #FFD700; }
                .color-6 { color: #FF1493; text-shadow: 0 0 3px #FF1493; }
                .color-7 { color: #FFFFFF; text-shadow: 0 0 3px #FFFFFF; }
                .color-8 { color: #A020F0; text-shadow: 0 0 3px #A020F0; }
                .difficulty-group { display: flex; flex-direction: column; align-items: center; }
                #difficultyLabel { color: #00FFFF; font-family: 'Major Mono Display', monospace; font-size: 0.8rem; margin-bottom: 5px; text-shadow: 0 0 5px #00FFFF; letter-spacing: 1px; font-weight: bold; }
                #difficultySelector { background-color: #1e1e1e; color: #00FFFF; border: 2px solid #FF00FF; padding: 8px 12px; border-radius: 8px; font-family: 'Major Mono Display', monospace; font-size: 1rem; text-shadow: 0 0 5px #00FFFF; box-shadow: 0 0 10px rgba(255, 0, 255, 0.5); appearance: none; cursor: pointer; outline: none; text-align: center; }
                #difficultySelector option { background-color: #0d0d0d; color: #00FFFF; font-size: 1rem; }
                @media (min-width: 640px) { .control-panel { flex-direction: row; gap: 20px; } }
                #messageBox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; }
                .message-content { background: #121212; padding: 30px; border-radius: 16px; text-align: center; border: 2px solid #00FFFF; box-shadow: 0 0 20px #00FFFF; max-width: 90%; color: #FFFFFF; }
                .message-content h2 { font-size: 1.5rem; margin-bottom: 10px; color: #00FFFF; text-shadow: 0 0 5px #00FFFF; }
                @media (min-width: 640px) { .message-content h2 { font-size: 2rem; } }
                .message-content p { margin-bottom: 20px; font-size: 1rem; color: #ddd; }
                @media (min-width: 640px) { .message-content p { font-size: 1.1rem; } }
                .message-content button { background-color: #FF00FF; color: #1e1e1e; padding: 10px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.2s; box-shadow: 0 0 10px #FF00FF; }
                .message-content button:hover { background-color: #FF1493; }
                #instructionModal { position: fixed; inset: 0; z-index: 1000; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; }
                .instruction-modal-content { background: #121212; padding: 20px; border-radius: 16px; border: 2px solid #FF00FF; box-shadow: 0 0 20px rgba(255, 0, 255, 0.5); max-width: 450px; width: 90%; color: #FFFFFF; }
                .instruction-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .instruction-modal-header h2 { font-size: 1.5rem; color: #00FFFF; text-shadow: 0 0 5px #00FFFF; }
                .instruction-modal-header button { background: none; border: none; color: #FF00FF; font-size: 1.5rem; cursor: pointer; padding: 5px; }
                .how-to-play-trigger { text-align: center; margin-top: 20px; }
                .how-to-play-trigger button { background: none; border: none; color: #FF00FF; text-decoration: underline; cursor: pointer; font-size: 1rem; font-family: 'Major Mono Display', monospace; }
                .how-to-play-content { color: #ddd; font-family: 'Major Mono Display', monospace; }
                .how-to-play-content h3 { color: #00FFFF; font-size: 1.2rem; margin-top: 1rem; margin-bottom: 0.5rem; text-shadow: 0 0 5px #00FFFF; }
                .how-to-play-content p { margin-bottom: 0.5rem; line-height: 1.6; }
                .how-to-play-content ul { list-style-type: disc; padding-left: 20px; margin-bottom: 1rem; }
                .how-to-play-content code { background-color: #0d0d0d; color: #FF00FF; padding: 2px 4px; border-radius: 4px; }
                .mobile-controls { display: flex; gap: 10px; margin-top: 15px; }
                .mobile-controls button { background-color: #1e1e1e; color: #00FFFF; border: 2px solid #FF00FF; padding: 10px 15px; border-radius: 8px; font-family: 'Major Mono Display', monospace; font-size: 1rem; box-shadow: 0 0 10px rgba(255, 0, 255, 0.5); }
                .mobile-controls button.active { background-color: #FF00FF; color: #1e1e1e; box-shadow: 0 0 15px #FF00FF; }
            `}</style>
            <div className="game-container">
                <div className="game-content">
                    <div className="control-panel">
                        <div className="difficulty-group">
                            <p id="difficultyLabel">DIFFICULTY:</p>
                            <select id="difficultySelector" title="Select Difficulty" value={difficultyKey} onChange={handleDifficultyChange}>
                                <option value="easy">EASY (10x10)</option>
                                {!isMobile && (
                                    <>
                                        <option value="medium">MEDIUM (16x16)</option>
                                        <option value="hard">HARD (24x24)</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="status-bar">
                        <div className="status-icon-group">
                            <svg id="flagIcon" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                            <div className="counter-display">{String(flagsRemaining).padStart(3, '0')}</div>
                        </div>
                        <button id="resetButton" title="Reset Game" onClick={initializeGame}>
                            <svg id="faceIcon" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                {faceIcon === 'smile' ? (
                                    <>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                    </>
                                ) : (
                                    <>
                                        <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                    </>
                                )}
                            </svg>
                        </button>
                        <div className="status-icon-group">
                            <svg id="timerIcon" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <div className="counter-display">{String(seconds).padStart(3, '0')}</div>
                        </div>
                    </div>

                    <div className="grid-and-controls-wrapper">
                        <div
                            id="minesweeperGrid"
                            style={{
                                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                                fontSize: baseFontSize
                            }}
                        >
                            {grid.map((row, r) =>
                                row.map((cell, c) => (
                                    <div
                                        key={`${r}-${c}`}
                                        className={getCellClass(cell)}
                                        onClick={() => handleCellClick(r, c)}
                                        onContextMenu={(e) => handleContextMenu(e, r, c)}
                                    >
                                        {getCellContent(cell)}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {isMobile && (
                        <div className="mobile-controls">
                            <button className={actionType === 'reveal' ? 'active' : ''} onClick={() => setActionType('reveal')}>Reveal</button>
                            <button className={actionType === 'flag' ? 'active' : ''} onClick={() => setActionType('flag')}>Flag</button>
                        </div>
                    )}

                    <div className="how-to-play-trigger">
                        <button onClick={() => setShowInstructionsModal(true)}>How to Play</button>
                    </div>

                    {showInstructionsModal && (
                        <div id="instructionModal" onClick={() => setShowInstructionsModal(false)}>
                            <div className="instruction-modal-content" onClick={e => e.stopPropagation()}>
                                <div className="instruction-modal-header">
                                    <h2>How to Play: Neon Minesweeper</h2>
                                    <button onClick={() => setShowInstructionsModal(false)}>&times;</button>
                                </div>
                                <div className="how-to-play-content">
                                    <h3>Objective</h3>
                                    <p>The goal is to clear the entire grid without detonating any of the hidden mines. Good luck, operative.</p>
                                    <h3>Gameplay (Desktop)</h3>
                                    <ul>
                                        <li><strong>Reveal Cell:</strong> Use <code className="text-[#00FFFF]">Left-Click</code> on a cell to reveal it.</li>
                                        <li><strong>Flagging:</strong> Use <code className="text-[#00FFFF]">Right-Click</code> on a cell to place or remove a flag.</li>
                                        <li><strong>Numbers:</strong> If a revealed cell has a number, it tells you how many mines are directly adjacent to it.</li>
                                    </ul>
                                    <h3>Mobile Controls (Touchscreen)</h3>
                                    <p>Use the toggle buttons below the grid to switch between <strong>Reveal</strong> and <strong>Flag</strong> modes.</p>
                                    <ul>
                                        <li><strong>Reveal Mode:</strong> <code className="text-[#00FFFF]">Tap</code> a cell to reveal it.</li>
                                        <li><strong>Flag Mode:</strong> <code className="text-[#FF00FF]">Tap</code> a cell to place or remove a flag.</li>
                                    </ul>
                                    <p>Note: On mobile devices, only the **Easy (10x10)** difficulty is available for optimal performance and tap accuracy.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {message.show && (
                        <div id="messageBox">
                            <div className="message-content">
                                <h2>{message.title}</h2>
                                <p>{message.text}</p>
                                <button onClick={initializeGame}>Play Again?</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NeonMinesweeperGame;