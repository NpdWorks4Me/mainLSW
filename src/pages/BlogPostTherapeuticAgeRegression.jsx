import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostTherapeuticAgeRegression(){
  const post = blogPosts.find(p => p.slug.includes('therapeutic-age-regression'));
  return <ArticleRenderer post={post} />;
}
// placeholder removed: ArticleRenderer usage above
