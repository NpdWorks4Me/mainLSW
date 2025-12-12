import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

export default function ConfirmationPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Confirmation" />
			<ContentSection title="Action Confirmation">
				<p className="text-gray-300">Your action has been received. Please check your email for any next steps. If this was an order, you should receive a confirmation shortly.</p>
			</ContentSection>

			<section className="py-8">
				<Link to="/" className="btn btn-primary">Return Home</Link>
			</section>
		</main>
	);
}
