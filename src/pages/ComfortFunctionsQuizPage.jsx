import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import Quiz from '@/components/Quiz';

export default function ComfortFunctionsQuizPage(){
	return (
		<main className="max-w-3xl mx-auto px-4 py-12">
			<PageHelmet title="Comfort Functions Quiz" description="Discover tools and functions that create comfort for you." />
			<ContentSection title="Comfort Functions Quiz">
				<p className="text-gray-300">This quiz helps you identify comfort functions and coping tools that ease anxiety and soothe your nervous system.</p>
			</ContentSection>

			<section className="py-8">
				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<Quiz />
				</div>
			</section>
		</main>
	);
}
