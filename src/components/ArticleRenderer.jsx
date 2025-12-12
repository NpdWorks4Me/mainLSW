import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContentSection from '@/components/ContentSection';
import OptimizedBlogImage from '@/components/OptimizedBlogImage';

export default function ArticleRenderer({ post, pillarPrefix = 'blog' }){
  if (!post) return <div className="p-6">Post not found</div>;
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <PageHelmet title={post.title} description={post.excerpt} canonical={`https://littlespaceworld.com/${post.slug}`} />
      <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
      <article>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-3">{post.title}</h1>
          <div className="text-sm text-gray-400">{post.date} • {post.readTime} • by {post.author}</div>
        </div>
        {post.imageUrl && <div className="mb-6"><OptimizedBlogImage src={post.imageUrl} alt={post.title} /></div>}
        <ContentSection>
          <div className="prose max-w-none text-gray-200" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          <p className="mt-6 text-gray-300">This article will be extended to a full post soon. Subscribe to the blog to get updates.</p>
        </ContentSection>
      </article>
    </main>
  );
}
