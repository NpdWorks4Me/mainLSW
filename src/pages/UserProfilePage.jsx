import { useParams } from 'react-router-dom';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';

export default function UserProfilePage() {
  const { nickname } = useParams();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <PageHelmet title={`User: ${nickname}`} description={`Public profile for ${nickname}`} />
      <ContentSection title={`Profile: ${nickname}`}>
        <p className="text-gray-300">This is a public profile placeholder for <strong>{nickname}</strong>. If profiles exist, user details will appear here.</p>
      </ContentSection>

      <section className="py-6">
        <div className="bg-[#0b1220] p-6 rounded-xl border border-white/6 text-gray-300">
          <p>Profile features are coming soon. If you expect to see content here, it may be behind privacy settings or only available to registered users.</p>
        </div>
      </section>
    </main>
  );
}
