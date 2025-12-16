import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import WordSearchGame from '@/components/games/WordSearchGame';

export default function WordSearchGamePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <PageHelmet title="Word Search" description="Relax with a colorful word search puzzle." />
      <ContentSection title="Word Search">
        <p className="text-gray-300">Find hidden words in a relaxing, vibrant grid.</p>
      </ContentSection>

      <section className="py-6">
        <div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
          <WordSearchGame />
        </div>
      </section>
    </main>
  );
}
