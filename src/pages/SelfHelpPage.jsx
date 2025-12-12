import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, HeartHandshake, Shield, ArrowRight } from 'lucide-react';
import PageHelmet from '@/components/PageHelmet';
import { Button } from '@/components/ui/button';

// --- 1. Custom CSS Styles (Matches BlogListPage) ---
const customStyles = `
  /* Keyframe Animations */
  @keyframes pulse-glow {
    0% { box-shadow: 0 0 8px rgba(65, 105, 225, 0.5), inset 0 0 4px rgba(65, 105, 225, 0.3); }
    50% { box-shadow: 0 0 15px rgba(65, 105, 225, 0.8), inset 0 0 6px rgba(65, 105, 225, 0.5); }
    100% { box-shadow: 0 0 8px rgba(65, 105, 225, 0.5), inset 0 0 4px rgba(65, 105, 225, 0.3); }
  }

  @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
  }
  
  /* Custom Classes */
  .celestial-card-bg {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(30, 15, 80, 0.9) 0%, rgba(45, 20, 100, 0.8) 100%);
    z-index: -1;
    border: 1px solid rgba(138, 43, 226, 0.4);
    transition: background 0.5s ease;
    box-shadow: 0 8px 32px rgba(75, 0, 130, 0.3);
  }

  .celestial-card-bg:hover {
      background: radial-gradient(ellipse at center, rgba(10, 5, 30, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%); 
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  }
  
  .celestial-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: #ADD8E6; 
    padding: 8px 16px;
    border: 2px solid #4169E1;
    border-radius: 20px;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(65, 105, 225, 0.5);
    cursor: pointer;
    box-shadow: 0 0 8px rgba(65, 105, 225, 0.5), inset 0 0 4px rgba(65, 105, 225, 0.3);
    animation: pulse-glow 2s infinite alternate; 
  }
  
  .celestial-button:hover {
    animation: none;
    background: #6A5ACD; 
    color: #0d0520; 
    border-color: #6A5ACD;
    box-shadow: 0 0 20px rgba(106, 90, 205, 1.0); 
    transform: scale(1.05); 
  }
`;

// --- 2. Star Field Component ---
const StarField = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl">
    {Array(30).fill(0).map((_, i) => (
      <div
        key={i}
        className={`absolute w-1 h-1 rounded-full bg-white opacity-50 shadow-sm`}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`,
          filter: `blur(${Math.random() * 0.5}px)`,
          opacity: 0.2 + Math.random() * 0.8
        }}
      />
    ))}
  </div>
);

// --- 3. Celestial Resource Card ---
const CelestialResourceCard = ({ resource, index }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 1, 0.5, 1] }
    })
  };

  const Icon = resource.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="w-full h-full rounded-2xl mx-auto"
    >
      <div
        style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d', height: '100%' }}
        className="grid place-content-center h-full rounded-2xl p-6 relative group"
      >
        <div className="celestial-card-bg">
          <StarField />
        </div>

        <div style={{ transform: 'translateZ(30px)' }} className="text-center flex flex-col h-full items-center relative">
           {/* Icon */}
           <div 
             className={`mb-6 p-4 rounded-full bg-gradient-to-r ${resource.color} shadow-[0_0_20px_rgba(168,85,247,0.5)]`}
             style={{ transform: 'translateZ(40px)' }}
           >
              <Icon className="w-8 h-8 text-white" />
           </div>

          <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
            {resource.title}
          </h2>
          
          <p className="text-gray-300 mb-8 text-sm flex-grow leading-relaxed">
            {resource.description}
          </p>

          <Link
            to={resource.href}
            className="celestial-button mt-auto"
            style={{ transform: 'translateZ(40px)' }}
          >
            Open
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// --- 4. Data & Page Component ---
const selfHelpResources = [
  {
    title: "Guidance & Support",
    description: "Find external crisis helplines, mental health organizations, and trusted resources to support your well-being.",
    icon: HeartHandshake,
    href: "/guidance-and-support",
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "Our Little Blog",
    description: "Dive into educational articles and guides to help you understand littlespace, age regression, and personal growth.",
    icon: BookOpen,
    href: "/blog",
    color: "from-blue-400 to-purple-500"
  },
  {
    title: "Safety Guidelines",
    description: "Understand our SFW policy and community rules to ensure a safe, respectful, and positive environment for all members.",
    icon: Shield,
    href: "/safety",
    color: "from-red-400 to-orange-500"
  }
];

const SelfHelpPage = () => {
  return (
    <>
      <PageHelmet
        title="Self-Help & Resources"
        description="Access self-help resources, guidance articles, and community support to foster personal growth and well-being in your littlespace journey."
        canonical="/self-help"
      />
      
      {/* Inject Styles */}
      <style>{`
          body {
              background: radial-gradient(ellipse at center, #1a0b3d 0%, #0d0520 70%, #000000 100%);
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
          }
          .app-container {
              perspective: 1500px;
          }
          ${customStyles}
      `}</style>

      <div className="app-container py-16 sm:py-24 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Self-Help & Resources</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
              Empower your journey with valuable insights and supportive articles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 justify-center">
            {selfHelpResources.map((resource, index) => (
              <div key={resource.title} className="h-[450px]">
                <CelestialResourceCard resource={resource} index={index} />
              </div>
            ))}
          </div>
          
           <motion.div 
             className="mt-16 text-center" 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             transition={{ delay: 0.5 }}
           >
              <div className="glass-card p-8 max-w-2xl mx-auto rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h2 className="text-2xl font-semibold text-white mb-4">Need More Support?</h2>
                <p className="text-gray-300 mb-6">
                  If you're looking for personalized assistance or have specific questions, don't hesitate to reach out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white border-none">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-2 border-purple-300 text-purple-300 hover:bg-purple-500/20 hover:text-white bg-transparent">
                    <Link to="/about">About Us</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
        </div>
      </div>
    </>
  );
};

export default SelfHelpPage;