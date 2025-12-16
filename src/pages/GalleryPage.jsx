import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';

const sampleImages = [
  'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/b04395ac06dafe4006d9c1f87b412b1a.webp',
  'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/29f26cce71d33fe2b48b2a66dd78f98c.webp',
  'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/c6753346961f0fbffcc51f8c1e72f534.webp'
];

export default function GalleryPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <PageHelmet title="Gallery" description="A small curated gallery of cute and wholesome images." />
      <ContentSection title="Gallery">
        <p className="text-gray-300">A collection of fun and uplifting images to brighten your day.</p>
      </ContentSection>

      <section className="py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sampleImages.map((src, idx) => (
            <div key={idx} className="rounded overflow-hidden bg-[#07101a] p-1">
              <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-40 object-cover rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
