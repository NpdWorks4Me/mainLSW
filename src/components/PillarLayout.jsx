
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import PageHelmet from '@/components/PageHelmet';
import CelestialBlogCard from '@/components/blog/CelestialBlogCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { blogPosts } from '@/data/blogPosts';

// Using the same custom styles for consistency
const customStyles = `
  @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
  }
  .image-skeleton {
      animation: shimmer 2s infinite linear;
      background: linear-gradient(to right, #1e0f50 4%, #2d1464 25%, #1e0f50 36%);
      background-size: 1000px 100%;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
  }
  .celestial-card-bg {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(30, 15, 80, 0.9) 0%, rgba(45, 20, 100, 0.8) 100%);
    z-index: -1;
    border: 1px solid rgba(138, 43, 226, 0.4);
    transition: background 0.5s ease;
    box-shadow: 0 8px 32px rgba(75, 0, 130, 0.3);
  }
  .celestial-card-bg:hover {
      background: radial-gradient(ellipse at center, rgba(10, 5, 30, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%); 
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  }
  .celestial-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: #ADD8E6; 
    padding: 8px 16px;
    border: 2px solid #4169E1;
    border-radius: 20px;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(65, 105, 225, 0.5);
    cursor: pointer;
    box-shadow: 0 0 8px rgba(65, 105, 225, 0.5), inset 0 0 4px rgba(65, 105, 225, 0.3);
    font-size: 0.875rem;
  }
  .celestial-button:hover {
    background: #6A5ACD; 
    color: #0d0520; 
    border-color: #6A5ACD;
    box-shadow: 0 0 20px rgba(106, 90, 205, 1.0); 
    transform: scale(1.05); 
  }
`;

const PillarLayout = ({ 
  title, 
  description, 
  pillarSlug, 
  breadcrumbLabel,
  children 
}) => {
  const filteredPosts = blogPosts.filter(post => post.pillar === pillarSlug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://littlespaceworld.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": breadcrumbLabel,
        "item": `https://littlespaceworld.com/${pillarSlug}`
      }
    ]
  };

  // Generate TOC items from filtered posts
  const tocItems = filteredPosts.map(post => ({
    id: post.slug,
    text: post.title
  }));

  return (
    <>
      <PageHelmet
        title={title}
        description={description}
        canonical={`https://littlespaceworld.com/${pillarSlug}`}
        schema={[breadcrumbSchema, {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": title,
          "description": description,
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": filteredPosts.map((post, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `https://littlespaceworld.com/${pillarSlug}/${post.slug}`
            }))
          }
        }]}
      />

      <style>{`
          body {
              background: radial-gradient(ellipse at center, #1a0b3d 0%, #0d0520 70%, #000000 100%);
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
          }
          .app-container {
              perspective: 1500px;
          }
          ${customStyles}
      `}</style>
      
      <div className="app-container py-12 sm:py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto flex-grow w-full">
          
          <Breadcrumbs items={[{ label: breadcrumbLabel, href: null }]} />

          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300">
              {description}
            </p>
          </motion.div>

          {/* Table of Contents for Hub */}
          {tocItems.length > 0 && (
            <div className="mb-12 bg-[#1a0b3d]/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-purple-300 mb-4 text-center uppercase tracking-wider">
                Explore This Guide
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {tocItems.map(item => (
                  <a 
                    key={item.id}
                    href={`/${pillarSlug}/${item.id}`}
                    className="text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors border border-white/5 hover:border-purple-400/30"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredPosts.map((post, index) => (
                <div key={post.slug} className="h-[520px]">
                  <CelestialBlogCard 
                    post={post} 
                    index={index} 
                    pillarPrefix={pillarSlug}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Content is being curated for this pillar. Check back soon!</p>
            </div>
          )}

          {children}
        </div>

        <DisclaimerBanner />
      </div>
    </>
  );
};

export default PillarLayout;
