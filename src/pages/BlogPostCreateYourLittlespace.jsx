import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostCreateYourLittlespace(){
  const post = blogPosts.find(p => p.slug.includes('create-your-littlespace'));
  return <ArticleRenderer post={post} />;
}
// placeholder removed: ArticleRenderer usage above
