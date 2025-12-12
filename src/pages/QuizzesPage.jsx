import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import Quiz from '@/components/Quiz';
import { Link } from 'react-router-dom';

export default function QuizzesPage(){
	const quizzes = [
		{ id: 'super-you', title: 'Super You Quiz', href: '/quizzes/super-you', description: 'Personality-inspired quiz to find your little style.' },
		{ id: 'comfort-functions', title: 'Comfort Functions Quiz', href: '/quizzes/comfort-functions', description: 'Understand the comfort tools that work best for you.' }
	];

	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Quizzes" description="Interactive quizzes to help you discover your little style and comfort profile." />
			<ContentSection title="Quizzes & Self-Discovery">
				<p className="text-gray-300">Try our popular quizzes below or take a full interactive quiz right here.</p>
			</ContentSection>

			<section className="py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
					{quizzes.map(q => (
						<div key={q.id} className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
							<h3 className="text-lg font-semibold text-white mb-2">{q.title}</h3>
							<p className="text-gray-300 mb-3">{q.description}</p>
							<Link to={q.href} className="btn btn-primary">Take Quiz</Link>
						</div>
					))}
				</div>

				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<h3 className="text-lg font-semibold text-white mb-3">Try the Full Quiz</h3>
					<Quiz />
				</div>
			</section>
		</main>
	);
}
