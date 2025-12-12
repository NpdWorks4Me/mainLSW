import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import CelestialBlogCard from '@/components/blog/CelestialBlogCard';
import { blogPosts } from '@/data/blogPosts';

export default function StoriesPage(){
	const stories = blogPosts.filter(p => p.pillar === 'littlespace' || p.pillar === 'create');
	return (
		<main className="max-w-7xl mx-auto px-4 py-12">
			<PageHelmet title="Stories - Little Space" description="Community stories, creative takes, and micro-essays from Little Space World." />
			<ContentSection title="Stories & Community Pieces">
				<p className="text-gray-300">Curated stories and candid reflections from our community and contributors.</p>
			</ContentSection>

			<section className="py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{stories.map((post, i) => (
						<CelestialBlogCard key={post.id} post={post} index={i} pillarPrefix={post.pillar} />
					))}
				</div>
			</section>
		</main>
	);
}
