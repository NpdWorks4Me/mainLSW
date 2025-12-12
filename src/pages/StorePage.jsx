import React from 'react';
import ProductsList from '@/components/ProductsList';
import PageHelmet from '@/components/PageHelmet';

export default function StorePage(){
	return (
		<main className="min-h-screen">
			<PageHelmet title="Store" />
			<div className="max-w-7xl mx-auto px-4 py-12">
				<h1 className="text-3xl font-bold mb-6">Shop</h1>
				<ProductsList />
			</div>
		</main>
	);
}
