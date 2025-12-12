
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const PageHelmet = ({ 
  title, 
  description, 
  canonical, 
  schema, 
  image,
  publishedTime,
  modifiedTime,
  type = 'website',
  author,
  noIndex = false
}) => {
  const { pathname } = useLocation();
  const siteUrl = 'https://littlespaceworld.com';
  const defaultTitle = 'Little Space World - A Safe Place for LittleSpace';
  const defaultDescription = 'Welcome to Little Space World! A safe, SFW community for age regressors. Explore fun activities, self-help resources, blogs, and join our inclusive little space.';
  const defaultImage = 'https://storage.googleapis.com/hostinger-horizons-assets-prod/68470a32-d856-4001-aa04-6ef3f0b873ca/ce4ad81ff99374289babc8d1f0b6fc7c.png';

  const pageTitle = title ? `${title} | Little Space World` : defaultTitle;
  const pageDescription = description?.substring(0, 160) || defaultDescription.substring(0, 160);
  const pageImage = image || defaultImage;
  
  // Ensure canonical URL doesn't end with a trailing slash unless it's root
  const rawCanonical = canonical || `${siteUrl}${pathname}`;
  const canonicalUrl = rawCanonical.endsWith('/') && rawCanonical !== siteUrl ? rawCanonical.slice(0, -1) : rawCanonical;

  // Organization Schema (Global)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Little Space World",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": defaultImage,
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://twitter.com/littlespaceworld",
      "https://instagram.com/littlespaceworld"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0199",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": ["en"]
    }
  };

  // Internal Linking / Breadcrumb Schema fallback
  const defaultBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title || "Page",
        "item": canonicalUrl
      }
    ]
  };

  // Combine schemas
  const combinedSchema = Array.isArray(schema) 
    ? [...schema, organizationSchema] 
    : [schema || defaultBreadcrumbSchema, organizationSchema].filter(Boolean);

  return (
    <Helmet>
      <html lang="en" />
      
      {/* Security Headers */}
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Standard SEO */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <link rel="alternate" href={canonicalUrl} hreflang="en" />
      <link rel="alternate" href={canonicalUrl} hreflang="x-default" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Little Space World" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@littlespaceworld" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
    </Helmet>
  );
};

export default PageHelmet;
