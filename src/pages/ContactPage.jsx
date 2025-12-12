import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import ContactForm from '@/components/ContactForm';

export default function ContactPage(){
	return (
		<main className="max-w-4xl mx-auto px-4 py-12">
			<PageHelmet title="Contact Us" description="Contact Little Space World support and help team." />
			<ContentSection title="Contact Us">
				<p className="text-gray-300">Questions about products, orders, or community guidelines? We’re happy to help. Complete the form below or email us at support@littlespaceworld.com.</p>
			</ContentSection>

			<section className="py-8">
				<div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
					<ContactForm />
				</div>
			</section>
		</main>
	);
}
