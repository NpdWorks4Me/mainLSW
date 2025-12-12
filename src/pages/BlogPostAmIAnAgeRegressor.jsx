import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostAmIAnAgeRegressor(){
  const post = blogPosts.find(p => p.slug.includes('am-i-really-an-age-regressor') || p.slug.includes('am-i-really-an-age'));
  return <ArticleRenderer post={post} />;
}
// placeholder removed: ArticleRenderer usage above
