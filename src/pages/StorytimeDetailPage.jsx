import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GemstoneOdyssey from '@/components/GemstoneOdyssey';
import TechAdventure from '@/components/TechAdventure';
import PageHelmet from '@/components/PageHelmet';

const StorytimeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/storytime');
  };

  if (id === 'gemstone') {
    return (
      <>
        <PageHelmet title="A Gemstone Odyssey" description="Embark on a magical journey through a cavern of glowing gemstones." />
        <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center p-4">
          <GemstoneOdyssey onClose={handleClose} />
        </div>
      </>
    );
  }

  if (id === 'tech') {
    return (
      <>
        <PageHelmet title="Race from the Arcade" description="Will Miles make it home from the arcade in time?" />
        <div className="min-h-screen bg-[#0a0a1f] flex items-center justify-center p-4">
          <TechAdventure onClose={handleClose} />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
        <button 
          onClick={handleClose}
          className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition-colors"
        >
          Back to Stories
        </button>
      </div>
    </div>
  );
};

export default StorytimeDetailPage;
