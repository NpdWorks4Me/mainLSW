import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { authorProfiles } from '@/data/authorProfiles';

export default function AboutPage(){
	const authors = Object.values(authorProfiles);
	return (
		<main className="max-w-7xl mx-auto px-4 py-12">
			<PageHelmet title="About" description="Little Space World - a safe, SFW community offering resources and a shop for age regressors and littles." />
			<ContentSection>
				<h1 className="text-3xl font-bold mb-4">About Little Space World</h1>
				<p className="text-gray-300 mb-4">Little Space World is an inclusive, SFW community created to provide resources, community, and curated products for age regression, inner child care, and related practices. We emphasize consent, safety, and compassionate language in all content.</p>
			</ContentSection>

			<section className="py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{authors.map(a => (
						<div key={a.name} className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
							<div className="flex items-center gap-4 mb-4">
								<img src={a.image} alt={a.name} className="w-16 h-16 rounded-full object-cover border" />
								<div>
									<h3 className="text-lg font-semibold text-white">{a.name}</h3>
									<div className="text-sm text-gray-400">{a.role}</div>
								</div>
							</div>
							<p className="text-gray-300 text-sm">{a.bio}</p>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
