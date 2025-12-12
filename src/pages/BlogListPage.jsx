import React from 'react';
import CelestialBlogCard from '@/components/blog/CelestialBlogCard';
import ContentSection from '@/components/ContentSection';
import PageHelmet from '@/components/PageHelmet';

export default function BlogListPage() {
  const posts = [
    { id: '1', title: 'What is LittleSpace?', excerpt: 'A simple guide for new age regressors.', slug: '/blog/what-is-littlespace' },
    { id: '2', title: 'Create Your Littlespace', excerpt: 'DIY cozy nooks and sensory faves.', slug: '/blog/create-your-littlespace' },
  ];
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <PageHelmet title="Blog - Littlespace" />
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ContentSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <CelestialBlogCard key={post.id} title={post.title} excerpt={post.excerpt} to={post.slug} />
          ))}
        </div>
      </ContentSection>
    </main>
  );
}
