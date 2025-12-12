import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Sparkles } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import GemstoneOdyssey from '@/components/GemstoneOdyssey';
import TechAdventure from '@/components/TechAdventure';

const stories = [
  {
    title: "A Gemstone Odyssey",
    type: "STORY",
    icon: BookOpen,
    action: 'gemstone'
  },
  {
    title: "Race from the Arcade",
    type: "STORY",
    icon: Cpu,
    action: 'tech'
  }
];

const StoryCard = ({ story, onClick }) => {
  const Icon = story.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="w-full"
      onClick={() => onClick(story.action)}
    >
      {/* Fixed Height Card */}
      <div className="quiz-card h-full min-h-96 p-10 rounded-2xl cursor-pointer relative overflow-hidden group flex flex-col justify-between"> {/* Existing rounded-2xl */}
        {/* Hover Glow Layer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-transparent to-cyan-500/20 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-8 flex-grow">
          {/* Icon */}
          <div className="relative">
            <div className="absolute inset-0 blur-xl animate-pulse">
              <Icon className="w-24 h-24 text-fuchsia-400" />
            </div>
            <Icon className="relative w-24 h-24 text-white drop-shadow-2xl" strokeWidth={2} />
          </div>

          {/* Title - Fixed height area */}
          <h3 className="pixel-font text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-wide min-h-28 flex items-center justify-center px-4">
            {story.title}
          </h3>

          {/* Tag */}
          <span className="px-8 py-3 rounded-full text-base font-bold tracking-wider
            bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-transparent bg-clip-text
            border-2 border-fuchsia-400/60 shadow-2xl">
            {story.type}
          </span>
        </div>

        {/* Floating Sparkles */}
        <Sparkles className="absolute top-6 right-6 w-8 h-8 text-cyan-400 opacity-70 animate-pulse" />
        <Sparkles className="absolute bottom-8 left-8 w-6 h-6 text-fuchsia-400 opacity-70 animate-pulse delay-500" />

        {/* Shine Sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200" />
        </div>
      </div>
    </motion.div>
  );
};

const StorytimePage = () => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isTechAdventureOpen, setIsTechAdventureOpen] = useState(false);

  const openStory = (story) => {
    if (story === 'gemstone') setIsStoryOpen(true);
    if (story === 'tech') setIsTechAdventureOpen(true);
  };

  return (
    <>
      <PageHelmet
        title="Storytime Adventures"
        description="Dive into interactive stories! Choose your path and embark on exciting adventures in the world of Little Space."
      />

      {/* Cyber-Y2K Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .pixel-font { font-family: 'VT323', monospace; }

        .quiz-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff) 1;
          box-shadow: 
            0 0 20px rgba(255, 0, 255, 0.3),
            0 0 20px rgba(0, 255, 255, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.05);
          transition: all 0.4s ease;
        }
        .quiz-card:hover {
          box-shadow: 
            0 0 35px rgba(255, 0, 255, 0.6),
            0 0 35px rgba(0, 255, 255, 0.6),
            inset 0 0 30px rgba(255, 255, 255, 0.1);
          transform: translateY(-10px);
        }
      `}</style>

      {/* The global starry background will show through now */}
      <div className="min-h-screen w-full bg-transparent"> {/* Changed to transparent */}
        <ContentSection className="minReported-h-screen"> {/* Removed dotted-bg */}
          <div className="text-center py-16 md:py-20">
            <h1 className="pixel-font text-6xl md:text-8xl font-extrabold text-white mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-fuchsia-400 animate-pulse">
                Interactive Stories
              </span>
            </h1>
            <p className="text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Welcome, little explorer! Pick your adventure and let the magic begin
            </p>
          </div>

          {/* Perfectly Equal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 mt-16">
            {stories.map((story) => (
              <StoryCard
                key={story.title}
                story={story}
                onClick={openStory}
              />
            ))}
          </div>
        </ContentSection>
      </div>

      {/* Story Modals */}
      {isStoryOpen && <GemstoneOdyssey onClose={() => setIsStoryOpen(false)} />}
      {isTechAdventureOpen && <TechAdventure onClose={() => setIsTechAdventureOpen(false)} />}
    </>
  );
};

export default StorytimePage;