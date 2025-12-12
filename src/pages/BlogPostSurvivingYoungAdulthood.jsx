import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostSurvivingYoungAdulthood(){
  const post = blogPosts.find(p => p.slug.includes('5-steps-to-surviving-young-adulthood') || p.slug.includes('surviving-young-adulthood'));
  return <ArticleRenderer post={post} />;
}
// placeholder removed: ArticleRenderer usage above
