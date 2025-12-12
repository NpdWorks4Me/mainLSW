import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

export default function GuidanceAndSupportPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Guidance & Support" description="Guidance, resources, and support contacts for the community." />
			<ContentSection title="Guidance & Support">
				<p className="text-gray-300">Find curated support resources, referrals, and tips for navigating age regression with compassion and consent. This page gathers accessible resources to help you stay safe and cared for.</p>
			</ContentSection>

			<section className="py-8 space-y-4">
				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<h3 className="text-lg font-semibold text-white mb-2">Immediate Support</h3>
					<p className="text-gray-300">If you're in crisis, please contact your local emergency services. For non-urgent support, check local mental health resources or national hotlines.</p>
				</div>

				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<h3 className="text-lg font-semibold text-white mb-2">Community Support</h3>
					<p className="text-gray-300">Explore our community Q&A, stories, and moderated spaces to connect with peers and find compassionate advice.</p>
					<Link to="/community-qa" className="btn mt-3">Visit Q&A</Link>
				</div>

				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<h3 className="text-lg font-semibold text-white mb-2">Contact Support</h3>
					<p className="text-gray-300">For direct help, use our contact form and include a clear description so the team can respond more effectively.</p>
					<Link to="/contact" className="btn btn-primary mt-3">Contact Us</Link>
				</div>
			</section>
		</main>
	);
}
