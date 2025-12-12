import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostAgeVsPetRegression(){
  const post = blogPosts.find(p => p.slug.includes('age-regression-vs-pet-regression') || p.slug.includes('age-regression-vs-pet'));
  return <ArticleRenderer post={post} />;
}
// placeholder removed: ArticleRenderer usage above
