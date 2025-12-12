import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import Quiz from '@/components/Quiz';

export default function SuperYouQuizPage(){
	return (
		<main className="max-w-3xl mx-auto px-4 py-12">
			<PageHelmet title="Super You Quiz" description="Explore your little style with our Super You Quiz." />
			<ContentSection title="Super You Quiz">
				<p className="text-gray-300">Find your 'Super You' personality — which little persona fits your style best.</p>
			</ContentSection>

			<section className="py-8">
				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<Quiz />
				</div>
			</section>
		</main>
	);
}
