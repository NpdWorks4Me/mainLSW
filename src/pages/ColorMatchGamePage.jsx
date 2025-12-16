import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import ColorMatchGame from '@/components/games/ColorMatchGame';

export default function ColorMatchGamePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <PageHelmet title="Color Match" description="Fast-paced matching of colorful shapes." />
      <ContentSection title="Color Match">
        <p className="text-gray-300">Match colorful shapes quickly to score points.</p>
      </ContentSection>

      <section className="py-6">
        <div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
          <ColorMatchGame />
        </div>
      </section>
    </main>
  );
}
