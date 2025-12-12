import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostMyLittleSecrets(){
  const post = blogPosts.find(p => p.slug.includes('my-little-secrets'));
  return <ArticleRenderer post={post} />;
}
// placeholder removed: the ArticleRenderer is now used above
