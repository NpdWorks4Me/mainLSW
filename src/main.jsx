
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
// Consolidated CSS imports so Vite bundles everything and no runtime @import is left in compiled CSS
import '@/styles/base.css';
import '@/styles/typography.css';
import '@/styles/animations.css';
import '@/styles/utilities.css';
import '@/styles/micro-interactions.css';
import '@/styles/carousel.css';
import '@/styles/quizzes.css';
import '@/styles/product-page.css';
import '@/styles/marquee.css';
import '@/styles/starry-background-mobile.css';
import '@/styles/components/layout.css';
import '@/styles/components/forms.css';
import '@/styles/components/buttons.css';
import '@/styles/components/glassmorphism.css';
import '@/styles/components/cards.css';
import '@/styles/components/glowingButton.css';
import '@/styles/components/animatedBorderButton.css';
import '@/styles/quill-custom.css';
import '@/styles/components/game.css';

// Core Web Vitals Monitoring
const reportWebVitals = (metric) => {
  // In a real app, you would send this to your analytics endpoint
  // console.log(metric);
};

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
);

// Performance Observer
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // Log LCP (Largest Contentful Paint)
        if (entry.entryType === 'largest-contentful-paint') {
           // console.log('LCP candidate:', entry.startTime, entry);
        }
        // Log CLS (Cumulative Layout Shift)
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
           // console.log('Layout Shift:', entry.value);
        }
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    // Fallback or ignore
  }
}
