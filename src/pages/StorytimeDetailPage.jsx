import React from 'react';
import { useParams } from 'react-router-dom';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';

const stories = {
  'comfort-owl': {
    title: 'Comfort Owl – A Soothing Bedtime Tale',
    content: `Once upon a time, there was an owl who loved to tuck the forest in each night. The owl would tuck the trees in and hum a soft tune, and the young foxes and bunnies would fall asleep under a sky of gentle stars.`
  },
  'adventure-gem': {
    title: 'Gemstone Adventure – Choose Your Path',
    content: `You find a glowing gemstone. Do you follow its trail into the moonlit glade, or stay by the river and build a tiny beacon? Wherever you go, the gemstone helps you hold onto bravery.`
  },
  'silly-sandcastle': {
    title: 'The Silly Sandcastle',
    content: `A little sandcastle with a big hat marched across the shore, inviting the tide to a tea party. The waves giggled and made tiny foam hats.`
  }
};

export default function StorytimeDetailPage(){
  const { id } = useParams();
  const story = stories[id];
  if(!story) return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <PageHelmet title="Story Not Found" />
      <ContentSection>
        <h2 className="text-xl font-semibold">Story not found</h2>
        <p className="text-gray-300">Sorry, we couldn't find that story. Please return to Storytime and pick another one.</p>
      </ContentSection>
    </main>
  );
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <PageHelmet title={story.title} description={`${story.title} – a short story`} />
      <ContentSection>
        <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
        <article className="prose prose-invert text-gray-200">
          <p>{story.content}</p>
        </article>
      </ContentSection>
    </main>
  );
}
