/**
 * This file defines the structure for the XML sitemap.
 * It can be used by a build script or server function to generate the actual XML.
 */

export const sitemapRoutes = [
  {
    path: '/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    path: '/blog',
    changefreq: 'daily',
    priority: 0.9
  },
  // New Pillar Hubs
  {
    path: '/littlespace',
    changefreq: 'weekly',
    priority: 0.95
  },
  {
    path: '/inner-child',
    changefreq: 'weekly',
    priority: 0.95
  },
  {
    path: '/mental-health',
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    path: '/young-adult',
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    path: '/create',
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    path: '/advocacy',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/resources',
    changefreq: 'monthly',
    priority: 0.8
  },
  // Store & Activities
  {
    path: '/store',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    path: '/coloring-pages',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    path: '/quizzes',
    changefreq: 'monthly',
    priority: 0.7
  },
  // Reorganized Blog Posts (New URLs)
  {
    path: '/littlespace/age-regression-friends',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2025-12-05'
  },
  {
    path: '/inner-child/inner-child-journaling-prompt-kit',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2025-12-12'
  },
  {
    path: '/mental-health/therapeutic-age-regression-honest-coping-skill',
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: '2025-11-18'
  },
  {
    path: '/littlespace/age-regression-vs-pet-regression-whats-the-difference',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-11-27'
  },
  {
    path: '/young-adult/5-steps-to-surviving-young-adulthood',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-11-11'
  },
  {
    path: '/littlespace/what-is-littlespace-a-simple-guide-for-new-age-regressors',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-06-06'
  },
  {
    path: '/littlespace/am-i-really-an-age-regressor',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-07-23'
  },
  {
    path: '/create/create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves',
    changefreq: 'monthly',
    priority: 0.7,
    lastmod: '2025-05-01'
  },
  {
    path: '/littlespace/my-little-secrets-because-adulting-is-literally-not-it',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: '2025-02-14'
  },
  {
    path: '/littlespace/5-littlespace-bedtime-rituals-for-the-best-sleep',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: '2025-02-10'
  }
];