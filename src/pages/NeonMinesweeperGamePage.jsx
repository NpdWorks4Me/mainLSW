import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import NeonMinesweeperGame from '@/components/games/NeonMinesweeperGame';

export default function NeonMinesweeperGamePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <PageHelmet title="Neon Minesweeper" description="A luminous twist on Minesweeper." />
      <ContentSection title="Neon Minesweeper">
        <p className="text-gray-300">Clear the board without exploding neon mines!</p>
      </ContentSection>

      <section className="py-6">
        <div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
          <NeonMinesweeperGame />
        </div>
      </section>
    </main>
  );
}
