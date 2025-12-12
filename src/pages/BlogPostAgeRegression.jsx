import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostAgeRegression(){
  const post = blogPosts.find(p => p.slug.includes('age-regression') && p.slug.includes('-friends') === false);
  // This may find multiple, so ensure selecting intended slug
  return <ArticleRenderer post={post} />;
}
// placeholder removed: ArticleRenderer usage above
