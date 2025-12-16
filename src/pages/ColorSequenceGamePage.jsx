import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import ColorSequenceGame from '@/components/games/ColorSequenceGame';

export default function ColorSequenceGamePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <PageHelmet title="Color Sequence" description="Test your memory with colorful sequences." />
      <ContentSection title="Color Sequence">
        <p className="text-gray-300">Repeat the glowing color patterns to advance levels.</p>
      </ContentSection>

      <section className="py-6">
        <div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
          <ColorSequenceGame />
        </div>
      </section>
    </main>
  );
}
