import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';

export default function CookiePolicyPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Cookie Policy" description="How Little Space World uses cookies and similar technologies." />
			<ContentSection title="Cookie Policy">
				<p className="text-gray-300">We use cookies and similar technologies to enhance your experience, remember preferences, and analyze site traffic. Below is a summary of the categories used on our site and how you can manage them.</p>
			</ContentSection>

			<section className="py-8">
				<h2 className="text-lg font-semibold text-white mb-2">Essential Cookies</h2>
				<p className="text-gray-300">Required for the site to function. These cannot be turned off via your browser for core site functionality.</p>

				<h2 className="text-lg font-semibold text-white mt-6 mb-2">Performance & Analytics</h2>
				<p className="text-gray-300">We use analytics cookies to measure and improve performance. You can opt out using the cookie consent panel or your browser settings.</p>

				<h2 className="text-lg font-semibold text-white mt-6 mb-2">Marketing</h2>
				<p className="text-gray-300">We may use marketing cookies to show relevant offers and measure campaign performance (third-party services).</p>

				<h2 className="text-lg font-semibold text-white mt-6 mb-2">Managing Cookies</h2>
				<p className="text-gray-300">To manage cookies, you can use your browser settings or the cookie panel found at the bottom of the site.</p>
			</section>
		</main>
	);
}
