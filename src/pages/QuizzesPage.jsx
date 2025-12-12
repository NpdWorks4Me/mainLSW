import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Puzzle, Heart, Sparkles, Star } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import ContentSection from '@/components/ContentSection';
import '@/styles/quizzes.css';

const StarField = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"> {/* Existing rounded-2xl */}
    {Array(25).fill(0).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-white/60"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `twinkle ${3 + Math.random() * 4}s infinite alternate`,
          opacity: 0.2 + Math.random() * 0.5,
        }}
      />
    ))}
  </div>
);

const CelestialQuizCard = ({ quiz, index, isComingSoon = false }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  const handleMouseMove = (e) => {
    if (isComingSoon || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cardContent = (
    <div
      style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
      className={`relative h-full rounded-2xl p-8 group transition-all duration-700 ${ // Existing rounded-2xl
        isComingSoon ? 'opacity-50 saturate-50' : ''
      }`}
    >
      {/* Background */}
      <div className="celestial-card-bg">
        <StarField />
      </div>

      {/* Content */}
      <div style={{ transform: 'translateZ(50px)' }} className="relative text-center space-y-8">
        <div className="relative inline-block">
          <div
            className={`absolute inset-0 rounded-full blur-3xl animate-pulse ${
              isComingSoon ? 'bg-gray-600/30' : 'bg-purple-500/40'
            }`}
          />
          <quiz.icon className="w-20 h-20 mx-auto text-white drop-shadow-2xl relative z-10" strokeWidth={2} />
          {!isComingSoon && <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-yellow-300 animate-pulse" />}
        </div>

        <h3
          className={`text-3xl md:text-4xl font-bold leading-tight ${
            isComingSoon ? 'text-gray-400' : 'text-white'
          }`}
        >
          {quiz.title}
        </h3>

        <span
          className={`inline-block px-6 py-2 rounded-full font-bold text-sm tracking-wider shadow-lg border ${
            isComingSoon
              ? 'bg-gray-700/60 border-gray-600 text-gray-400'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-white/20'
          }`}
        >
          {quiz.type}
        </span>

        {/* Hover glow line (only on live cards) */}
        {!isComingSoon && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
      </div>

      {/* Subtle "Coming Soon" ribbon */}
      {isComingSoon && (
        <div className="absolute inset-x-0 -bottom-6 left-1/2 -translate-x-1/2">
          <span className="inline-block px-6 py-1.5 text-sm font-medium text-gray-400 bg-gray-800/70 backdrop-blur-sm rounded-full border border-gray-700">
            Coming soon…
          </span>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isComingSoon ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      className={`h-full ${isComingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {isComingSoon ? (
        <div className="h-full pb-6">{cardContent}</div>
      ) : (
        <Link to={quiz.href} className="block h-full">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
};

const quizzes = [
  { title: "The Super-You! Quiz", type: "PERSONALITY", icon: Puzzle, href: "/quizzes/super-you" },
  { title: "The Comfort Functions Quiz", type: "DEEP DIVE", icon: Heart, href: "/quizzes/comfort-functions" },
  { title: "Little Space Triggers", type: "SELF-AWARENESS", icon: Star, href: "/quizzes/triggers", comingSoon: true },
  { title: "Caregiver Match Quiz", type: "RELATIONSHIP", icon: Sparkles, href: "/quizzes/caregiver-match", comingSoon: true },
];

const QuizzesPage = () => {
  return (
    <>
      <PageHelmet
        title="Magical Quizzes"
        description="Discover yourself through magical, science-backed, judgment-free quizzes made for regressors, dreamers, and healing hearts."
      />

      <div className="min-h-screen py-16 sm:py-24 px-4">
        <ContentSection>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="inline-block">Magical Quizzes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Science-backed • Trauma-informed • Skill-building
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {quizzes.map((quiz, i) => (
              <div key={quiz.title} className="h-96">
                <CelestialQuizCard quiz={quiz} index={i} isComingSoon={quiz.comingSoon} />
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <p className="text-gray-400 text-lg">More quizzes coming soon…</p>
          </div>
        </ContentSection>
      </div>
    </>
  );
};

export default QuizzesPage;