import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

export default function SafetyPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Safety & Moderation" description="Community safety guidelines, reporting, and resources." />
			<ContentSection title="Safety & Moderation">
				<p className="text-gray-300">Our community emphasizes consent, safety, and respectful interactions. If you see something that violates guidelines, please report it to the moderation team.</p>
			</ContentSection>

			<section className="py-8 space-y-4">
				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<h3 className="text-lg font-semibold text-white mb-2">Report a Concern</h3>
					<p className="text-gray-300 mb-4">If you encounter content or behavior that breaks our rules, please contact us via the Contact page and include clear details and links.</p>
					<Link to="/contact" className="btn btn-primary">Contact Moderation</Link>
				</div>

				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<h3 className="text-lg font-semibold text-white mb-2">Community Guidelines Snapshot</h3>
					<ul className="list-disc list-inside text-gray-300">
						<li>Keep things SFW and consenting.</li>
						<li>No sharing of identifying personal information.</li>
						<li>Be kind — treat others with respect.</li>
					</ul>
				</div>
			</section>
		</main>
	);
}
