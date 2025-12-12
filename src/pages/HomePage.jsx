import React from 'react';
import GalacticHeroSection from '@/components/GalacticHeroSection';
import FeaturedStarterPack from '@/components/FeaturedStarterPack';
import FeaturedStoreProducts from '@/components/FeaturedStoreProducts';
import ContentSection from '@/components/ContentSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <GalacticHeroSection />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <FeaturedStarterPack />
        </div>
      </section>

      <section className="py-8 bg-gradient-to-b from-[#071029] to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">New & Featured</h2>
          <FeaturedStoreProducts />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <FeaturedStoreProducts />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <ContentSection title="Welcome to LittleSpaceWorld">
            <p className="text-purple-200">A cozy, gentle corner of the internet for age regressors, regressive creatives, and anyone who loves fluffy plushies.</p>
          </ContentSection>
        </div>
      </section>
    </main>
  );
}
