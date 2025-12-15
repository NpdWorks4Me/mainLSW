import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import MemoryGame from '@/components/games/MemoryGame';

export default function MemoryGamePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <PageHelmet title="Memory Game" description="Match pairs of cards in this memory challenge." />
      <ContentSection title="Memory Game">
        <p className="text-gray-300">Flip cards and find matching pairs to win.</p>
      </ContentSection>

      <section className="py-6">
        <div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
          <MemoryGame />
        </div>
      </section>
    </main>
  );
}
