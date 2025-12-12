import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

export default function SelfHelpPage(){
	const resources = [
		{ title: 'Grounding Techniques', href: '/blog/therapeutic-age-regression-honest-coping-skill', excerpt: 'Simple exercises to ground and regulate your nervous system.' },
		{ title: 'Inner Child Journaling', href: '/inner-child/inner-child-journaling-prompt-kit', excerpt: 'Prompt kit to help explore feelings and heal.' },
		{ title: 'Bedtime Rituals', href: '/littlespace/5-littlespace-bedtime-rituals-for-the-best-sleep', excerpt: 'Practical bedtime tips to help you rest.' },
	];

	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Self Help" description="Helper resources, tips, and articles for self-care and regulation." />
			<ContentSection title="Self Help Resources">
				<p className="text-gray-300">Explore bite-sized resources for self-regulation, journaling, and building a soothing routine.</p>
			</ContentSection>

			<section className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
				{resources.map(r => (
					<div key={r.title} className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
						<h3 className="text-lg font-semibold text-white mb-2">{r.title}</h3>
						<p className="text-gray-300 mb-4">{r.excerpt}</p>
						<Link to={r.href} className="btn btn-primary">Read</Link>
					</div>
				))}
			</section>
		</main>
	);
}
