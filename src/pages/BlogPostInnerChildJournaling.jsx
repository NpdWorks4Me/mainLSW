import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostInnerChildJournaling(){
  const post = blogPosts.find(p => p.slug.includes('inner-child-journaling'));
  return <ArticleRenderer post={post} />;
}
// placeholder removed: ArticleRenderer usage above
