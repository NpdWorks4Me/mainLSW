import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostBedtimeRituals(){
  const post = blogPosts.find(p => p.slug.includes('bedtime-rituals'));
  return <ArticleRenderer post={post} />;
}
// placeholder removed: ArticleRenderer usage above
