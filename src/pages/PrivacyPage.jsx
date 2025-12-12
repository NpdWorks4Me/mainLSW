import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';

export default function PrivacyPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Privacy Policy" description="Our approach to privacy and data protection at Little Space World." />
			<ContentSection title="Privacy Policy">
				<p className="text-gray-300">We care deeply about your privacy. This page outlines what data we collect, how we use it, and the choices you have. We collect only the minimal data needed for account management, purchases, and community moderation. We do not share personal data with third parties for advertising purposes.</p>
			</ContentSection>

			<section className="py-8">
				<h2 className="text-lg font-semibold text-white mb-2">Data We Collect</h2>
				<ul className="list-disc list-inside text-gray-300">
					<li>Account information (email)</li>
					<li>Order and billing details for purchases</li>
					<li>Optional profile fields and community content (posts, comments)</li>
				</ul>

				<h2 className="text-lg font-semibold text-white mt-6 mb-2">How We Use Data</h2>
				<p className="text-gray-300">We use data to process orders, send transactional emails, moderate content, and improve our service. You can request data export or removal by contacting our support team.</p>
			</section>
		</main>
	);
}
