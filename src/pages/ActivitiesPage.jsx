import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

export default function ActivitiesPage(){
	const activityCards = [
		{ title: 'Quizzes', href: '/quizzes', description: 'Discover fun quizzes to explore your style and preferences.' },
		{ title: 'Story Time', href: '/storytime', description: 'Gentle bedtime and adventure stories for littles.' },
		{ title: 'Coloring Pages', href: '/coloring-pages', description: 'Printable coloring fun to relax and be creative.' },
		{ title: 'Games', href: '/games/snake', description: 'Play mini-games like Snake for short focus and play sessions.' }
	];

	return (
		<main className="max-w-5xl mx-auto px-4 py-12">
			<PageHelmet title="Activities" description="Activities, quizzes, stories and games for littles to enjoy and relax." />
			<ContentSection title="Activities & Games">
				<p className="text-gray-300">Explore everything from calming storytime to playful games and creative coloring pages. Our activities are designed for SFW enjoyment.</p>
			</ContentSection>

			<section className="py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{activityCards.map(card => (
						<div key={card.title} className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
							<h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
							<p className="text-gray-300 mb-4">{card.description}</p>
							<Link to={card.href} className="btn btn-primary">Explore</Link>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
