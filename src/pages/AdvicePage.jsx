import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

const tips = [
	{ title: 'Create a Cozy Corner', body: 'Find a small, comfortable space with soft textures and calming lights. Keep it dedicated to self-care.' },
	{ title: 'Use Simple Grounding Tools', body: 'Try 5-4-3-2-1 grounding or gentle breathing to ease acute anxiety.' },
	{ title: 'Set Boundaries', body: 'Let friends and partners know your needs and consent boundaries in clear, compassionate terms.' }
];

export default function AdvicePage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Advice & Tips" description="Helpful micro-guides and tips for keeping your Littlespace safe and cozy." />
			<ContentSection title="Advice & Tips">
				<p className="text-gray-300">Small, gentle advice for everyday challenges — from sleep to play, sensory comfort, and social boundaries.</p>
			</ContentSection>

			<section className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
				{tips.map(t => (
					<div key={t.title} className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
						<h3 className="text-lg font-semibold text-white mb-2">{t.title}</h3>
						<p className="text-gray-300">{t.body}</p>
					</div>
				))}
			</section>

			<section className="py-6">
				<p className="text-gray-300">Want more? Explore guides and blog posts in our <Link to="/blog" className="text-pink-400 underline">Blog</Link>.</p>
			</section>
		</main>
	);
}
