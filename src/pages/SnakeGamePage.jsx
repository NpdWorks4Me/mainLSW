import React, { useEffect, useState } from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import PhaserCanvas from '@/components/PhaserCanvas';

const sendControl = (action, value) => {
	if (typeof window === 'undefined') return;
	try { window.dispatchEvent(new CustomEvent('snake-control', { detail: { action, value } })); } catch (e) { /* ignore */ }
};

export default function SnakeGamePage(){
	const [running, setRunning] = useState(false);
	const [boardSize, setBoardSize] = useState(20);

	const startGame = () => { sendControl('start'); setRunning(true); };
	const pauseGame = () => { sendControl('pause'); setRunning(false); };
	const resetGame = () => { sendControl('reset'); setRunning(false); };
	const setSize = (n) => { setBoardSize(n); sendControl('setBoardSize', n); };

	// Start the game automatically on page load by default. This mirrors the
	// historic UX where the game begins immediately and allows test harnesses to
	// assert 'start on load' behavior without requiring a manual click.
	useEffect(() => {
		// sendControl will be queued by PhaserCanvas if the scene isn't ready yet
		startGame();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => { return () => { sendControl('stop'); }; }, []);

	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Snake" description="A small, mobile-friendly Snake game built with Phaser." />
			<ContentSection title="Snake Game">
				<p className="text-gray-300">Play a short, focus-friendly Snake game. Use on-screen controls or your keyboard.</p>
			</ContentSection>

			<section className="py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
						<div className="flex flex-col gap-3">
							<div className="text-gray-300">Board Size</div>
							<div className="flex gap-2">
								<button className="btn" onClick={() => setSize(16)}>Small</button>
								<button className="btn" onClick={() => setSize(20)}>Medium</button>
								<button className="btn" onClick={() => setSize(28)}>Large</button>
							</div>

							<div className="flex gap-2 mt-4">
								{!running ? (
									<button className="btn btn-primary" onClick={startGame}>Start</button>
								) : (
									<button className="btn" onClick={pauseGame}>Pause</button>
								)}
								<button className="btn" onClick={resetGame}>Reset</button>
							</div>
						</div>
					</div>

					<div className="lg:col-span-2 bg-[#0b1220] p-6 rounded-xl border border-white/6">
						<div className="h-[480px]">
							<PhaserCanvas width="100%" height="100%" />
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
