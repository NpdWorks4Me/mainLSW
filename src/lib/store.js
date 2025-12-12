import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  highScore: 0,
  isPaused: false,
  isRunning: false,
  setScore: (n) => set({ score: n }),
  addScore: (n) => set((s) => ({ score: s.score + n })),
  setHighScore: (n) => set({ highScore: n }),
  setPaused: (val) => set({ isPaused: val }),
  setRunning: (val) => set({ isRunning: val }),
}));

export default useGameStore;
