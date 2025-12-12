
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Clock } from 'lucide-react';
import OptimizedBlogImage from '@/components/OptimizedBlogImage';

// Prefetch Map needed here to preload components on hover
const prefetchComponents = {
  'age-regression-friends': () => import('@/pages/BlogPostAgeRegression'),
  'inner-child-journaling-prompt-kit': () => import('@/pages/BlogPostInnerChildJournaling'),
  'therapeutic-age-regression-honest-coping-skill': () => import('@/pages/BlogPostTherapeuticAgeRegression'),
  'age-regression-vs-pet-regression-whats-the-difference': () => import('@/pages/BlogPostAgeVsPetRegression'),
  '5-steps-to-surviving-young-adulthood': () => import('@/pages/BlogPostSurvivingYoungAdulthood'),
  'what-is-littlespace-a-simple-guide-for-new-age-regressors': () => import('@/pages/BlogPostWhatIsLittleSpace'),
  'am-i-really-an-age-regressor': () => import('@/pages/BlogPostAmIAnAgeRegressor'),
  'create-your-littlespace-diy-decor-cozy-nooks-and-sensory-faves': () => import('@/pages/BlogPostCreateYourLittlespace'),
  'my-little-secrets-because-adulting-is-literally-not-it': () => import('@/pages/BlogPostMyLittleSecrets'),
  '5-littlespace-bedtime-rituals-for-the-best-sleep': () => import('@/pages/BlogPostBedtimeRituals'),
};

const StarField = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
    {Array(20).fill(0).map((_, i) => (
      <div 
        key={i} 
        className="absolute w-0.5 h-0.5 rounded-full bg-white opacity-50 shadow-sm" 
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `twinkle ${3 + Math.random() * 4}s infinite alternate`,
          opacity: 0.2 + Math.random() * 0.8
        }} 
      />
    ))}
  </div>
);

const CelestialBlogCard = ({ post, index, pillarPrefix = '' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    const prefetch = prefetchComponents[post.slug];
    if (prefetch) {
      prefetch().catch(() => {}); 
    }
  };

  const randomDelay = Math.random() * 2;
  
  // Build the correct link. If pillarPrefix is provided, use it. 
  // Otherwise default to current structure logic or the post's assigned pillar.
  const linkPath = pillarPrefix 
    ? `/${pillarPrefix}/${post.slug}` 
    : `/${post.pillar}/${post.slug}`;

  return (
    <motion.div 
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        perspective: 1000,
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d" 
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full h-full rounded-2xl mx-auto"
    >
      <motion.div
        animate={{ 
          rotate: [0, -0.5, 0.5, -0.5, 0], 
          y: [0, -3, 0, 2, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: randomDelay
        }}
        className="flex flex-col h-full rounded-2xl relative group overflow-hidden bg-[#1a0b3d]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="celestial-card-bg" style={{ transform: "translateZ(-20px)" }}>
          <StarField />
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-t-2xl shrink-0" style={{ transform: "translateZ(20px)" }}>
          <OptimizedBlogImage
            src={post.imageUrl}
            alt={`${post.title} – age regression and inner child healing`}
            className="transition-transform duration-700 group-hover:scale-110"
            priority={index < 3}
          />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))' }}
          />
        </div>

        <div className="flex flex-col flex-grow p-6 pt-4 relative z-10" style={{ transform: "translateZ(30px)" }}>
          <h2 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-pink-200 transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          <div 
            className="text-gray-300 mb-6 text-sm flex-grow line-clamp-3 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: post.excerpt }} 
          />

          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-pink-400" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <Link 
              to={linkPath} 
              className="celestial-button w-full"
              style={{ transform: "translateZ(10px)" }}
            >
              Read Article
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CelestialBlogCard;
