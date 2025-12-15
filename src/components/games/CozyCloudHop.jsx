import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const CozyCloudHop = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [settings, setSettings] = useState({
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    enableSounds: true,
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const timerRef = useRef(null);
  const totalDurationRef = useRef(25 * 60);
  const audioContextRef = useRef(null);

  const playSound = (type) => {
    if (!settings.enableSounds || !audioContextRef.current) return;
    // In a real app, you'd have actual sound sources.
    // For now, this is a placeholder.
  };

  const updateTimerDisplay = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const updateProgress = () => {
    const progress = ((totalDurationRef.current - timeLeft) / totalDurationRef.current) * 100;
    return `${Math.min(100, Math.max(0, progress))}%`;
  };

  const timerComplete = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    playSound('complete');
    setShowCelebration(true);

    if (!isBreak) {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      localStorage.setItem('pomotimer-sessions', newSessionsCompleted);

      setTimeout(() => {
        const breakDuration = (newSessionsCompleted % 4 === 0) ? settings.longBreakDuration : settings.shortBreakDuration;
        totalDurationRef.current = breakDuration * 60;
        setTimeLeft(breakDuration * 60);
        setIsBreak(true);
        startTimer();
      }, 2000);
    } else {
      setTimeout(() => {
        totalDurationRef.current = settings.pomodoroDuration * 60;
        setTimeLeft(settings.pomodoroDuration * 60);
        setIsBreak(false);
      }, 2000);
    }
  };

  const updateTimer = () => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        timerComplete();
        return 0;
      }
      return prev - 1;
    });
  };

  const startTimer = () => {
    if (isRunning) return;
    if (!audioContextRef.current) {
        try {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser.");
        }
    }
    setIsRunning(true);
    timerRef.current = setInterval(updateTimer, 1000);
    playSound('start');
  };

  const pauseTimer = () => {
    if (!isRunning) return;
    clearInterval(timerRef.current);
    setIsRunning(false);
    playSound('pause');
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    const newTime = settings.pomodoroDuration * 60;
    setTimeLeft(newTime);
    totalDurationRef.current = newTime;
    setIsBreak(false);
    playSound('click');
  };

  const handleSettingChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newSettings = {
      ...settings,
      [id]: type === 'checkbox' ? checked : parseInt(value, 10),
    };
    setSettings(newSettings);
    localStorage.setItem('pomotimer-settings', JSON.stringify(newSettings));
    if (id === 'pomodoro-duration' && !isRunning && !isBreak) {
        const newTime = parseInt(value, 10) * 60;
        setTimeLeft(newTime);
        totalDurationRef.current = newTime;
    }
  };

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('pomotimer-settings'));
    if (savedSettings) {
      setSettings(savedSettings);
      const newTime = savedSettings.pomodoroDuration * 60;
      setTimeLeft(newTime);
      totalDurationRef.current = newTime;
    }
    const savedSessions = localStorage.getItem('pomotimer-sessions');
    if (savedSessions) {
      setSessionsCompleted(parseInt(savedSessions, 10));
    }

    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        pauseTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (showCelebration) {
      const timeoutId = setTimeout(() => setShowCelebration(false), 10000);
      return () => clearTimeout(timeoutId);
    }
  }, [showCelebration]);

  return (
    <>
  <Helmet>
        <title>{`${updateTimerDisplay(timeLeft)} - PomoTimer 2K`}</title>
        <link href="https://fonts.googleapis.com/css2?family=VT323:wght@400&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --primary: #00ff9d;
            --secondary: #ff00aa;
            --accent: #00f7ff;
            --background: #0a0a2a;
            --surface: #1a1a3a;
            --text: #ffffff;
            --pixel-border: 4px solid var(--accent);
            --glow: 0 0 10px var(--accent), 0 0 20px var(--accent);
          }
          .pomotimer-body {
            background: var(--background);
            background-image: 
                linear-gradient(45deg, rgba(0, 247, 255, 0.1) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(0, 255, 157, 0.1) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(255, 0, 170, 0.1) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(0, 255, 157, 0.1) 75%);
            background-size: 20px 20px;
            min-height: 100vh;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
            font-family: 'VT323', monospace;
            color: var(--text);
          }
          .pomotimer-body * {
            font-family: 'VT323', monospace;
            color: var(--text);
            text-shadow: 0 0 5px var(--accent);
          }
          .pomotimer-container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(10, 10, 42, 0.9);
            border: var(--pixel-border);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 247, 255, 0.2);
            padding: 20px;
            position: relative;
            z-index: 1;
            border-radius: 10px;
            overflow: hidden;
          }
          .pomotimer-header { text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 2px solid var(--accent); }
          .pomotimer-title { font-family: 'Orbitron', sans-serif; font-size: 3.5em; margin-bottom: 10px; background: linear-gradient(45deg, var(--primary), var(--accent), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: none; letter-spacing: 2px; }
          .pomotimer-subtitle { font-size: 1.5em; color: var(--accent); text-shadow: 0 0 10px var(--accent); }
          .timer-container { text-align: center; margin: 30px 0; }
          .timer-display { font-family: 'Orbitron', sans-serif; font-size: 5em; font-weight: bold; color: var(--primary); text-shadow: 0 0 20px var(--primary); margin: 20px 0; letter-spacing: 5px; }
          .progress-container { margin: 20px 0; }
          .progress-label { text-align: center; margin-bottom: 10px; font-size: 1.2em; color: var(--accent); }
          .progress-bar { width: 100%; height: 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; border: 2px solid var(--accent); box-shadow: 0 0 10px rgba(0, 247, 255, 0.3); }
          .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); width: 0%; transition: width 0.3s ease; }
          .controls { display: flex; flex-direction: column; align-items: center; gap: 20px; margin: 30px 0; }
          .timer-controls { display: flex; justify-content: center; gap: 15px; margin: 20px 0; }
          .btn { padding: 12px 24px; border: none; border-radius: 5px; font-family: 'VT323', monospace; font-size: 1.5em; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 2px; position: relative; overflow: hidden; z-index: 1; }
          .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
          .btn-primary { background: var(--primary); color: #000; border: 2px solid var(--primary); box-shadow: 0 0 15px rgba(0, 255, 157, 0.5); }
          .btn-primary:hover:not(:disabled) { background: #00e68a; transform: translateY(-2px); box-shadow: 0 0 20px rgba(0, 255, 157, 0.8); }
          .btn-secondary { background: var(--secondary); color: #fff; border: 2px solid var(--secondary); box-shadow: 0 0 15px rgba(255, 0, 170, 0.5); }
          .btn-secondary:hover:not(:disabled) { background: #e6009c; transform: translateY(-2px); box-shadow: 0 0 20px rgba(255, 0, 170, 0.8); }
          .btn-tertiary { background: var(--accent); color: #000; border: 2px solid var(--accent); box-shadow: 0 0 15px rgba(0, 247, 255, 0.5); }
          .btn-tertiary:hover:not(:disabled) { background: #00e5ff; transform: translateY(-2px); box-shadow: 0 0 20px rgba(0, 247, 255, 0.8); }
          .simple-settings { background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 10px; margin: 20px 0; border: 2px solid var(--accent); }
          .setting { display: flex; justify-content: space-between; align-items: center; margin: 15px 0; font-size: 1.2em; }
          .setting input[type="number"] { width: 80px; padding: 8px; background: rgba(255, 255, 255, 0.1); border: 2px solid var(--accent); border-radius: 5px; color: white; font-size: 1em; text-align: center; }
          .setting input[type="checkbox"] { margin-right: 10px; width: 20px; height: 20px; cursor: pointer; }
          .session-counter { text-align: center; font-size: 1.5em; margin: 20px 0; color: var(--accent); }
          .visitor-counter { display: inline-flex; align-items: center; justify-content: center; background: #000; border: 3px solid #ff00ff; padding: 5px 15px; margin: 10px 0; font-family: 'Courier New', monospace; font-size: 1.2em; color: #00ff00; text-shadow: 0 0 5px #00ff00; box-shadow: 0 0 10px #ff00ff, inset 0 0 10px #0000ff; border-radius: 5px; }
          .counter-gif { height: 20px; image-rendering: pixelated; margin: 0 5px; }
          .celebration { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; opacity: 0; visibility: hidden; transition: all 0.5s ease; }
          .celebration.show { opacity: 1; visibility: visible; }
          .celebration-content { background: var(--surface); padding: 30px; border-radius: 10px; text-align: center; border: var(--pixel-border); box-shadow: var(--glow); max-width: 80%; }
          .celebration h2 { font-size: 3em; margin-bottom: 20px; color: var(--primary); text-shadow: 0 0 10px var(--primary); }
          .celebration p { font-size: 1.5em; margin-bottom: 30px; }
          @media (max-width: 768px) {
            .timer-display { font-size: 3.5em; }
            .btn { padding: 10px 15px; font-size: 1.2em; }
            .setting { flex-direction: column; align-items: flex-start; gap: 5px; }
            .setting input[type="number"] { width: 100%; }
          }
        `}</style>
  </Helmet>
      <div className="pomotimer-body">
        <div className="pomotimer-container">
          <header className="pomotimer-header">
            <h1 className="pomotimer-title">PomoTimer 2K</h1>
            <p className="pomotimer-subtitle">✨ Focus Like It's 1999 ✨</p>
          </header>

          <div id="timer-panel" className="tab-content active" role="tabpanel">
            <div className="progress-container">
              <div className="progress-label" id="progress-label">Session Progress</div>
              <div className="progress-bar">
                <div className="progress-fill" id="progress-fill" style={{ width: updateProgress() }}></div>
              </div>
            </div>

            <div className="timer-container">
              <div className="timer-display" id="timer" aria-live="polite">{updateTimerDisplay(timeLeft)}</div>
            </div>

            <div className="controls">
              <div className="timer-controls">
                <button id="start-timer" className="btn btn-primary" onClick={startTimer} disabled={isRunning}>Start</button>
                <button id="pause-timer" className="btn btn-secondary" onClick={pauseTimer} disabled={!isRunning}>Pause</button>
                <button id="reset-timer" className="btn btn-tertiary" onClick={resetTimer}>Reset</button>
              </div>

              <div className="session-counter">
                <span>Sessions Completed: </span>
                <span id="session-count">{sessionsCompleted}</span>
                <div className="visitor-counter">
                  <img src="https://web.archive.org/web/20090829085351/http://www.geocities.com/EnchantedForest/Glade/2300/visitorcounter1.gif" alt="Visitor Counter" className="counter-gif" />
                  <span id="visitor-count">00103</span>
                  <img src="https://web.archive.org/web/20090829085351/http://www.geocities.com/EnchantedForest/Glade/2300/visitorcounter2.gif" alt="" className="counter-gif" />
                </div>
              </div>

              <div className="simple-settings">
                <div className="setting">
                  <label htmlFor="pomodoro-duration">Pomodoro (min):</label>
                  <input type="number" id="pomodoroDuration" min="1" max="60" value={settings.pomodoroDuration} onChange={handleSettingChange} />
                </div>
                <div className="setting">
                  <label htmlFor="short-break-duration">Short Break (min):</label>
                  <input type="number" id="shortBreakDuration" min="1" max="30" value={settings.shortBreakDuration} onChange={handleSettingChange} />
                </div>
                <div className="setting">
                  <label htmlFor="long-break-duration">Long Break (min):</label>
                  <input type="number" id="longBreakDuration" min="1" max="60" value={settings.longBreakDuration} onChange={handleSettingChange} />
                </div>
                <div className="setting">
                  <label>
                    <input type="checkbox" id="enableSounds" className="toggle" checked={settings.enableSounds} onChange={handleSettingChange} />
                    <span className="toggle-label">Enable Sounds</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCelebration && (
          <div className="celebration show" id="celebration">
            <div className="celebration-content">
              <h2>Great Job! 🎉</h2>
              <p>Take a break, you've earned it!</p>
              <button id="close-celebration" className="btn btn-primary" onClick={() => setShowCelebration(false)}>Continue</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CozyCloudHop;