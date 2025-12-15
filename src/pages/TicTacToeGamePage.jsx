import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import TicTacToeGame from '@/components/games/TicTacToeGame';

export default function TicTacToeGamePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <PageHelmet title="Tic Tac Toe" description="Play Tic Tac Toe against a friend or our AI." />
      <ContentSection title="Tic Tac Toe">
        <p className="text-gray-300">A simple, accessible Tic Tac Toe experience.</p>
      </ContentSection>

      <section className="py-6">
        <div className="bg-[#0b1220] p-6 rounded-xl border border-white/6">
          <TicTacToeGame />
        </div>
      </section>
    </main>
  );
}
