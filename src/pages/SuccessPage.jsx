import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { Link } from 'react-router-dom';

export default function SuccessPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Success" />
			<ContentSection title="Success">
				<p className="text-gray-300">Your purchase was completed successfully. We'll send you an email confirmation with details shortly. Thanks for supporting Little Space World!</p>
			</ContentSection>

			<section className="py-8">
				<Link to="/store" className="btn btn-primary">Back to Store</Link>
			</section>
		</main>
	);
}
