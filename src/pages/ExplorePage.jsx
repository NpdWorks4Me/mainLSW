import React from 'react';
import ProductsList from '@/components/ProductsList';
import SectionCarousel from '@/components/SectionCarousel';
import ContentSection from '@/components/ContentSection';

export default function ExplorePage(){
	return (
		<div className="max-w-7xl mx-auto px-4 py-12">
			<h1 className="text-3xl font-bold mb-6">Explore</h1>

			<SectionCarousel title="Spotlight" />

			<ContentSection title="Shop the Explore List" className="mt-8">
				<p className="text-purple-200 mb-6">Find curated picks, limited drops, and staff favorites.</p>
				<ProductsList />
			</ContentSection>
		</div>
	);
}
