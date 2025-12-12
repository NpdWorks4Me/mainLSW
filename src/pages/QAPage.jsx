import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';

const faqs = [
	{ q: 'Is this community SFW?', a: 'Yes — Little Space World is a safe, SFW community and content follows our community guidelines.' },
	{ q: 'How do I buy products?', a: 'Visit the Store, add items to your cart, and checkout. We support standard payment flows.' },
	{ q: 'Can I submit stories?', a: 'Yes — contact us via the Contact page and include your story for consideration.' }
];

export default function QAPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Community Q&A" />
			<ContentSection title="Community Q&A">
				<p className="text-gray-300">Find answers to common questions about community guidelines, purchases, and site features.</p>
			</ContentSection>

			<section className="py-8 space-y-4">
				{faqs.map((f, i) => (
					<div key={i} className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
						<h3 className="text-lg font-semibold text-white mb-2">{f.q}</h3>
						<p className="text-gray-300">{f.a}</p>
					</div>
				))}
			</section>
		</main>
	);
}
