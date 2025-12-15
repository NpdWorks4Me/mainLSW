import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Cpu, Puzzle, Heart, Gamepad2, BrainCircuit, Sparkles, 
  Star, Moon, BedDouble, Info
} from 'lucide-react';

import PageHelmet from '@/components/PageHelmet';
import GalacticHeroSection from '@/components/GalacticHeroSection';
import ContentSection from '@/components/ContentSection';
import GemstoneOdyssey from '@/components/GemstoneOdyssey';
import TechAdventure from '@/components/TechAdventure';
import SectionCarousel from '@/components/SectionCarousel';
import DesktopFooter from '@/components/DesktopFooter';
import GlowingButton from '@/components/GlowingButton';
import GlitchTitle from '@/components/GlitchTitle';
import FeaturedStoreProducts from '@/components/FeaturedStoreProducts';
import AboutAgeRegressionModal from '@/components/AboutAgeRegressionModal';

// CI trigger: Minor non-functional comment to force a commit and run the CI pipeline (2025-12-12)

// ———————————————————————— INLINED COMPONENTS ————————————————————————

// Unified Y2K Cyber Card Component
const Y2KCard = ({ children, onClick, href }) => {
  const Component = href ? Link : 'div';

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full relative group rounded-2xl"
    >
      {/* Glowing Gradient Border Layer - Absolute positioned behind content */}
      <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-[#ff00ff] via-[#00ffff] to-[#ff9eed] opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-500 shadow-[0_0_15px_rgba(255,0,255,0.3),0_0_15px_rgba(0,255,255,0.2)] group-hover:shadow-[0_0_30px_rgba(255,0,255,0.5),0_0_30px_rgba(0,255,255,0.4)]" />

      {/* Main Content Card - Sits on top with masking background */}
      <Component
        to={href}
        onClick={onClick}
        className="relative flex flex-col h-full min-h-[220px] md:min-h-72 p-4 md:p-8 rounded-2xl bg-[#1a0b2e]/90 backdrop-blur-xl overflow-hidden cursor-pointer z-10 border border-white/10"
      >
        {/* Hover Glow inside */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-transparent to-cyan-500/20 blur-xl" />
        </div>

        {/* Shine Sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>

        {/* Removed Sparkles - Top Right Only */}
        {/* <Sparkles className="absolute top-4 right-4 w-5 h-5 md:w-6 md:h-6 text-cyan-400 opacity-60 animate-pulse" /> */}

        <div className="relative z-10 flex flex-col h-full w-full">
          {children}
        </div>
      </Component>
    </motion.div>
  );
};

const InfoCard = ({ item, openStory, openInfoModal }) => {
  const Icon = item.icon;
  const glowColor = item.glowColor || 'cyan';

  // Map known semantic colors to concrete Tailwind utility classes to avoid
  // dynamic class strings that Tailwind JIT may purge.
  const glowColorMap = {
    fuchsia: 'text-fuchsia-400',
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    emeralds: 'text-emerald-400',
    default: 'text-cyan-400'
  };
  const glowClass = glowColorMap[glowColor] || glowColorMap.default;

  const handleClick = () => {
    if (item.action) {
      openStory(item.action);
    } else if (item.infoAction === 'aboutAgeRegression') {
      openInfoModal();
    }
  };

  return (
    <Y2KCard href={item.href} onClick={handleClick}>
      <div className="flex flex-col items-center text-center space-y-3 md:space-y-6 flex-grow">
        {/* Icon with Glow */}
        <div className="relative transform scale-75 md:scale-100 mb-1 md:mb-0">
          <div className="absolute inset-0 blur-xl animate-pulse">
            <Icon className={`w-16 h-16 ${glowClass}`} />
          </div>
          <Icon className="relative w-16 h-16 text-white drop-shadow-2xl" strokeWidth={2} />
        </div>

        <div className="flex-grow flex flex-col justify-center">
          <h3 className="pixel-font text-xl md:text-3xl font-extrabold text-white leading-tight">
            {item.title}
          </h3>
          <p className="text-gray-300 text-xs md:text-sm mt-2 md:mt-3 max-w-xs mx-auto leading-relaxed line-clamp-3 md:line-clamp-none">
            {item.description}
          </p>
        </div>

        {(item.type || item.category) && (
          <span className="mt-3 px-3 py-1 md:px-6 md:py-2 rounded-full text-[10px] md:text-sm font-bold tracking-wider
            bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-transparent bg-clip-text
            border md:border-2 border-fuchsia-400/60 shadow-lg md:shadow-xl uppercase">
            {item.category || item.type}
          </span>
        )}
      </div>
    </Y2KCard>
  );
};

const aboutSnippets = [
  "Hi! I'm Jeana. I created this space to provide a safe, fun and nurturing environment for people that age-regress.",
  "My professional background is in Occupational Therapy, where I've spent 15 years supporting people (especially those with ASD) find comfort and connection in ways that work best for them.",
  "It was through supporting members of my own family through mental health struggles that I learned about age-regression and found it to be an incredible mechanism for emotional healing and experiencing happiness.",
  "Whether you're seeking knowledge, community, or fun activities to do while in littlespace, this site is here to support your little side with understanding, acceptance, and zero judgment."
];

const AboutCarousel = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="p-10 rounded-2xl max-w-4xl mx-auto mt-12 relative overflow-hidden bg-[#1a0b2e]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(255,0,255,0.2)]">
      <div className="text-center space-y-6">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg md:text-xl text-gray-200 leading-relaxed"
        >
          {aboutSnippets[index]}
        </motion.p>
        <div className="flex justify-center gap-3 mt-8">
          {aboutSnippets.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === index ? 'bg-fuchsia-400 w-8' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ———————————————————————— DATA ————————————————————————
const interactivities = [
  { title: "A Gemstone Odyssey", type: "STORY", icon: BookOpen, action: 'gemstone', description: "Embark on a magical journey to discover mystical gems.", glowColor: "fuchsia" },
  { title: "Race from the Arcade", type: "STORY", icon: Cpu, action: 'tech', description: "An 8-bit hero escapes the arcade in this retro adventure.", glowColor: "cyan" },
  { title: "The Super-You! Quiz", type: "QUIZ", icon: Puzzle, href: "/quizzes/super-you", description: "Uncover your unique inner superhero persona!", glowColor: "emerald" },
  { title: "The Comfort Functions Quiz", type: "QUIZ", icon: Heart, href: "/quizzes/comfort-functions", description: "Find out what truly brings you comfort and joy." },
];

const gameItems = [
  { title: "Snake", href: "/games/snake", icon: Gamepad2, description: "A neon twist on the timeless classic. Grow your snake!" },
  { title: "Word Search", href: "/games/wordsearch", icon: Gamepad2, description: "Relax and find hidden words in a vibrant grid." },
  { title: "Tic Tac Toe", href: "/games/tictactoe", icon: Gamepad2, description: "Challenge a friend or our AI in this futuristic version." },
  { title: "Color Sequence", href: "/games/colorsequence", icon: Gamepad2, description: "Test your memory with glowing color patterns." },
  { title: "Memory Game", href: "/games/memory", icon: Gamepad2, description: "Match pairs of cosmic cards in this brain-teaser." },
  { title: "Neon Minesweeper", href: "/games/neonminesweeper", icon: Gamepad2, description: "A luminous take on the strategic puzzle game." },
  { title: "Color Match", href: "/games/colormatch", icon: Gamepad2, description: "A fast-paced game of matching colorful shapes." },
];

const blogItems = [
  { title: "What is Littlespace?", category: "Education", href: "/blog/what-is-littlespace-a-simple-guide-for-new-age-regressors", icon: BrainCircuit, description: "A beginner's guide to understanding the world of age regression." },
  { title: "Create Your Space", category: "Lifestyle", href: "/blog/create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves", icon: Sparkles, description: "Tips and tricks for crafting your perfect cozy sanctuary." },
  { title: "Am I an Age-Regressor?", category: "Self-Discovery", href: "/blog/am-i-really-an-age-regressor", icon: Star, description: "Explore the signs and feelings of age regression." },
  { title: "My Little Secrets", category: "Personal Stories", href: "/blog/my-little-secrets-because-adulting-is-literally-not-it", icon: Moon, description: "A personal story about embracing one's little side." },
  { title: "5 Bedtime Rituals", category: "Self-Care", href: "/blog/5-littlespace-bedtime-rituals-for-the-best-sleep", icon: BedDouble, description: "Cozy up with these sweet routines for a restful night." },
];


// ———————————————————————— HOMEPAGE ————————————————————————
const HomePage = () => {
  React.useEffect(() => {
    // Debug: confirm HomePage mounts in production preview
    console.log('HomePage mounted');
  }, []);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isTechAdventureOpen, setIsTechAdventureOpen] = useState(false);
  const [isAboutAgeRegressionOpen, setIsAboutAgeRegressionOpen] = useState(false); 

  const openStory = (story) => {
    if (story === 'gemstone') setIsStoryOpen(true);
    if (story === 'tech') setIsTechAdventureOpen(true);
  };

  const openAboutAgeRegressionModal = () => {
    setIsAboutAgeRegressionOpen(true);
  };

  return (
    <>
      <PageHelmet
        title="Little Space World - Your Cozy Corner of the Internet"
        description="Welcome to Little Space World! A safe and cozy community for age regressors and anyone seeking comfort."
      />

      {/* Pixel font is provided globally via src/index.css (imported in src/main.jsx) */}

      {/* SINGLE H1 for SEO */}
      <h1 className="sr-only">Little Space World – Safe Space for Age Regressors</h1>

      <div className="relative bg-transparent overflow-x-hidden">

        {/* 1. HERO – full screen, no cutoff */}
        <div className="relative h-screen min-h-screen overflow-hidden">
          <GalacticHeroSection />
        </div>

        {/* 2. FEATURED GOODIES */}
        <section className="relative mt-12 md:mt-20 pb-20 z-10">
          <ContentSection>
            <Link to="/store"><GlitchTitle as="h2">Featured Goodies</GlitchTitle></Link>
            <div className="mt-8 md:mt-12">
              <FeaturedStoreProducts />
            </div>
            <div className="mt-16 text-center">
              <GlowingButton to="/store" className="!rounded-full">Visit The Little Shop</GlowingButton>
            </div>
          </ContentSection>
        </section>

        {/* 3. BLOG - UPDATED TO GRID ON MOBILE */}
        <section className="py-20">
          <ContentSection>
            <Link to="/blog"><GlitchTitle as="h2">Our Blog</GlitchTitle></Link>
            <SectionCarousel mobileLayout="grid">
              {blogItems.map((item) => (
                <InfoCard key={item.title} item={item} openStory={openStory} openInfoModal={openAboutAgeRegressionModal} />
              ))}
            </SectionCarousel>
            <div className="mt-12 text-center">
              <GlowingButton to="/blog" className="!rounded-full">Read more blogs</GlowingButton>
            </div>
          </ContentSection>
        </section>

        {/* 4. ACTIVITIES - UPDATED TO GRID ON MOBILE */}
        <section className="py-20 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
          <ContentSection>
            <Link to="/explore"><GlitchTitle as="h2">Activities</GlitchTitle></Link>
            <SectionCarousel mobileLayout="grid">
              {interactivities.map((item) => (
                <InfoCard key={item.title} item={item} openStory={openStory} openInfoModal={openAboutAgeRegressionModal} />
              ))}
            </SectionCarousel>
            <div className="mt-12 text-center">
              <GlowingButton to="/explore" className="!rounded-full">See More</GlowingButton>
            </div>
          </ContentSection>
        </section>

        {/* 5. GAMES - UPDATED TO GRID ON MOBILE */}
        <section className="py-20">
          <ContentSection>
            <Link to="/games"><GlitchTitle as="h2">Games</GlitchTitle></Link>
            <SectionCarousel mobileLayout="grid">
              {gameItems.map((item) => (
                <InfoCard key={item.title} item={item} openStory={openStory} openInfoModal={openAboutAgeRegressionModal} />
              ))}
            </SectionCarousel>
            <div className="mt-12 text-center">
              <GlowingButton to="/games" className="!rounded-full">See all games</GlowingButton>
            </div>
          </ContentSection>
        </section>

        {/* 6. ABOUT */}
        <section className="py-20">
          <ContentSection>
            <Link to="/about"><GlitchTitle as="h2">About Us</GlitchTitle></Link>
            <AboutCarousel />
            <div className="mt-12 text-center">
              <GlowingButton to="/about#contact" className="!rounded-full">Learn more about us</GlowingButton>
            </div>
          </ContentSection>
          <div className="hidden md:block">
            <DesktopFooter />
          </div>
        </section>

      </div>

      {/* STORY MODALS */}
      {isStoryOpen && <GemstoneOdyssey onClose={() => setIsStoryOpen(false)} />}
      {isTechAdventureOpen && <TechAdventure onClose={() => setIsTechAdventureOpen(false)} />}
      
      <AboutAgeRegressionModal isOpen={isAboutAgeRegressionOpen} onClose={() => setIsAboutAgeRegressionOpen(false)} />
    </>
  );
};

export default HomePage;