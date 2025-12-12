import React from 'react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import { blogPosts } from '@/data/blogPosts';
import Breadcrumbs from '@/components/Breadcrumbs';
import OptimizedBlogImage from '@/components/OptimizedBlogImage';

const BlogPostWhatIsLittleSpace = () => {
  const post = blogPosts.find(p => p.slug.includes('what-is-littlespace'));
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
          <p className="mt-6 text-gray-300">This article is a concise guide; full content will be published here soon. In the meantime, feel free to explore our related posts and resources below.</p>
        </ContentSection>
      </article>
    </main>
  );
}

export default BlogPostWhatIsLittleSpace;
