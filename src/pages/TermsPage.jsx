import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';

export default function TermsPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Terms of Service" description="Terms of service for Little Space World." />
			<ContentSection title="Terms of Service">
				<p className="text-gray-300">By using Little Space World, you agree to these Terms of Service. These terms cover account conduct, purchases, returns, and content moderation policies.</p>
			</ContentSection>

			<section className="py-8">
				<h2 className="text-lg font-semibold text-white mb-2">Purchases & Refunds</h2>
				<p className="text-gray-300">We accept returns and exchanges under the standard policy listed on each product page. For digital items and custom bundles, refunds are evaluated case-by-case.</p>

				<h2 className="text-lg font-semibold text-white mt-6 mb-2">Community Conduct</h2>
				<p className="text-gray-300">Our community standards emphasize consent and safety. Sharing personal or identifiable content is discouraged. Violation of rules may result in content removal or bans.</p>
			</section>
		</main>
	);
}
