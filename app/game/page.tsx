// This is a Next.js App Router page for the Snake game.
// If you're using Vite-based setup, use src/pages/game.jsx instead.
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
const PhaserCanvas = dynamic(() => import('../../src/components/PhaserCanvas'), { ssr: false });
import MobileDpad from '../../src/components/MobileDpad';
import { useGameStore } from '../../src/lib/store';

export default function GamePage() {
  const score = useGameStore((s: any) => s.score);
  const highScore = useGameStore((s: any) => s.highScore);

  const onDirection = (dir: any) => {
    // The Phaser scene reads direction via pointer events or store; send to scene via event
    // For simplicity dispatch a custom event to window
    window.dispatchEvent(new CustomEvent('snake-direction', { detail: dir }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 text-white">
      <div className="max-w-lg w-full">
        <div className="flex justify-between items-center mb-2">
          <div>Score: {score}</div>
          <div>High: {highScore}</div>
        </div>
        <div style={{ aspectRatio: '1/1', width: '100%' }} className="rounded-2xl overflow-hidden border-4 border-purple-700">
          <PhaserCanvas />
        </div>
      </div>
      <MobileDpad onDirection={onDirection} />
    </div>
  );
}
