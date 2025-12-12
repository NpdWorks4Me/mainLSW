import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

const stories = [
	{
		id: 'comfort-owl',
		title: 'Comfort Owl – A Soothing Bedtime Tale',
		excerpt: 'A short, calming bedtime story about an owl who helps a young friend find sleep and safety.'
	},
	{
		id: 'adventure-gem',
		title: 'Gemstone Adventure – Choose Your Path',
		excerpt: 'Interactive choose-your-path story with gentle adventure suitable for littles.'
	},
	{
		id: 'silly-sandcastle',
		title: 'The Silly Sandcastle',
		excerpt: 'A playful short to make you giggle—great for mood-lifting and laughter.'
	}
];

export default function StorytimePage(){
	return (
		<main className="max-w-5xl mx-auto px-4 py-12">
			<PageHelmet title="Storytime" description="Gentle guided stories, interactive pathways, and calming tales for littles." />
			<ContentSection title="Storytime Adventures">
				<p className="text-gray-300">Choose a story depending on your mood: soothing bedtime tales, playful adventures, or silly quick reads to brighten your day.</p>
			</ContentSection>

			<section className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
				{stories.map(s => (
					<article key={s.id} className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
						<h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
						<p className="text-gray-300 mb-4">{s.excerpt}</p>
						<div className="flex gap-2">
							<Link to={`/storytime/${s.id}`} className="btn btn-primary">Begin Story</Link>
							<Link to="/stories" className="btn">More Stories</Link>
						</div>
					</article>
				))}
			</section>
		</main>
	);
}
