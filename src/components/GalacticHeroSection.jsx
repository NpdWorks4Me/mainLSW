import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import GlitchTitle from '@/components/GlitchTitle';

// —————————————————————————————————————————————————————————————————————————————
// MESMERIZING GLOW COMPONENT
// —————————————————————————————————————————————————————————————————————————————
const MesmerizingGlow = ({ isMobile }) => (
  // CONTAINER:
  // Desktop: Expanded to 300% to allow large, lush atmosphere.
  // Mobile: Constrained to 180% to keep glow tight around astronaut and prevent screen-edge clipping.
  <div 
    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 flex items-center justify-center transition-all duration-500 ${
      isMobile ? 'w-[180%] h-[180%]' : 'w-[300%] h-[300%]'
    }`}
  >
    
    {/* 1. Deep Core Pulse - Anchors the glow */}
    <motion.div
      className={`absolute rounded-full bg-cyan-500/30 mix-blend-screen ${
        isMobile ? 'w-[45%] h-[45%] blur-[25px]' : 'w-[35%] h-[35%] blur-[60px]'
      }`}
      animate={{
        scale: [0.9, 1.1, 0.9],
        opacity: isMobile ? [0.3, 0.5, 0.3] : [0.4, 0.6, 0.4], // Slightly reduced opacity on mobile
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    {/* 2. Primary Flowing Nebula (Clockwise) - The main visual driver */}
    <motion.div
      className={`absolute rounded-full ${
        isMobile ? 'w-[55%] h-[55%] opacity-60 blur-[30px]' : 'w-[45%] h-[45%] opacity-70 blur-[45px]'
      }`}
      style={{
        background: 'conic-gradient(from 0deg, transparent 0%, #06b6d4 20%, #8b5cf6 45%, #ec4899 70%, transparent 100%)',
      }}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 8, 
        repeat: Infinity,
        ease: "linear"
      }}
    />

    {/* 3. Secondary Counter-Flow (Counter-Clockwise) - Creates the "Nebulous" interference pattern */}
    <motion.div
      className={`absolute rounded-full mix-blend-plus-lighter ${
        isMobile ? 'w-[58%] h-[58%] opacity-40 blur-[30px]' : 'w-[48%] h-[48%] opacity-50 blur-[50px]'
      }`}
      style={{
        background: 'conic-gradient(from 180deg, transparent 0%, #ec4899 25%, #8b5cf6 50%, transparent 100%)',
      }}
      animate={{
        rotate: -360, 
        scale: [1, 1.05, 1]
      }}
      transition={{
        rotate: { duration: 12, repeat: Infinity, ease: "linear" },
        scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }}
    />

    {/* 4. Inner Highlight Pulse - Adds hot core */}
    <motion.div
      className={`absolute rounded-full bg-white/10 ${
        isMobile ? 'w-[40%] h-[40%] blur-[20px]' : 'w-[30%] h-[30%] blur-[30px]'
      }`}
      animate={{
        scale: [0.95, 1.05, 0.95],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
);

const GalacticHeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const parallaxRef = useRef(null);
  const heroSectionRef = useRef(null);

  // State to track if it's a mobile device
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const parallaxEl = parallaxRef.current;
    const heroSection = heroSectionRef.current;
    if (!parallaxEl || !heroSection) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Use isMobileView from state for consistent logic
    if (prefersReducedMotion || isMobileView) return;

    const xTo = gsap.quickTo(parallaxEl, 'x', { duration: 0.8, ease: 'power3' });
    const yTo = gsap.quickTo(parallaxEl, 'y', { duration: 0.8, ease: 'power3' });

    const handleMouseMove = (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const targetX = (x / rect.width - 0.5) * 70;
      const targetY = (y / rect.height - 0.5) * 70;
      xTo(targetX);
      yTo(targetY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobileView]); // Re-run effect if isMobileView changes

  // Generate static random values for particles to avoid re-renders
  const [particles] = useState(() => 
    Array.from({ length: 30 }).map(() => ({
      x: Math.random() * 100, // percent
      y: Math.random() * 100, // percent
      size: Math.random() * 3 + 1, // px
      duration: Math.random() * 20 + 10, // seconds
      delay: Math.random() * 5
    }))
  );

  // Enhanced Animation Props for Astronaut
  // Prolonged duration (3s for scale/rotate, 1.4s spring for y) to ensure user catches it
  const astronautEntranceProps = {
    initial: { opacity: 0, scale: 0.6, y: 80, rotate: -10 },
    animate: { opacity: 1, scale: 1, y: 0, rotate: 0 },
    transition: { 
      delay: 0.2, // Reduced delay slightly to start sooner, but animation is longer
      opacity: { duration: 1.2, ease: "easeOut" },
      scale: { duration: 1.5, ease: "easeOut" },
      rotate: { duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }, // Overshoot bezier for fun
      y: { type: "spring", stiffness: 50, damping: 12, mass: 1.5 } // Heavy, floaty feel
    }
  };

  return (
    <div className="relative w-full min-h-screen -mt-20 pt-28 md:pt-20 overflow-hidden bg-transparent flex items-start md:items-center justify-center">
      
      {/* SUBTLE PARTICLE OVERLAY */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/40 blur-[1px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -100], // Move upwards slowly
              opacity: [0.2, 0.6, 0.2], // Twinkle
            }}
            transition={{
              y: {
                duration: p.duration,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              },
              opacity: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
                delay: p.delay
              }
            }}
          />
        ))}
      </div>

      <div ref={heroSectionRef} className="galactic-hero-section w-full h-full relative z-10 flex flex-col md:flex-row items-center justify-start md:justify-center max-w-7xl mx-auto">

        {/* LEFT COLUMN (Desktop) / TOP (Mobile) - Text & CTAs */}
        <motion.div 
          className="relative z-20 w-full md:w-[45%] flex flex-col items-center md:items-start justify-start md:justify-center p-4 md:p-8 order-1 md:order-1 text-center md:text-left md:h-auto pointer-events-none md:pointer-events-auto"
          initial={false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          
          {/* Tagline */}
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 md:mb-4"
           >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-cyan-300 font-mono tracking-widest text-xs md:text-sm uppercase shadow-[0_0_10px_rgba(0,255,255,0.3)] pointer-events-auto">
              Your Safe Space Among the Stars
            </span>
          </motion.div>

          {/* Main Title with Glitch Effect */}
          <div className="flex flex-col items-center md:items-start justify-center space-y-2 mb-2">
            <div
              onClick={openModal}
              className="cursor-pointer flex flex-col items-center md:items-start pointer-events-auto hover:scale-95 transition-transform duration-300 drop-shadow-2xl origin-center md:origin-left"
            >
              <GlitchTitle 
                as="h1" 
                className="leading-none text-5xl sm:text-6xl md:text-5xl lg:text-7xl mb-2"
              >
                LittleSpace World:
              </GlitchTitle>
              <GlitchTitle 
                as="div" 
                className="leading-tight text-2xl sm:text-3xl md:text-2xl lg:text-4xl text-cyan-100"
              >
                You Are Safe, Valid, and Welcome Here.
              </GlitchTitle>
            </div>
          </div>

          {/* ASTRONAUT - MOBILE ONLY POSITIONING */}
          <div className="md:hidden relative z-10 my-6 w-full flex justify-center pointer-events-auto overflow-visible">
            <motion.div
              {...astronautEntranceProps}
              className="relative overflow-visible"
            >
              <Link
                to="/explore"
                className="block cursor-pointer transition-transform hover:scale-105 duration-300 overflow-visible"
                aria-label="Explore LittleSpace World"
              >
                {/* Scaled up by 15% using scale-115 equivalent, preserving layout flow */}
                <div className="relative w-48 aspect-[1/1] scale-[1.15] overflow-visible"> 
                  
                  {/* NEW: Complex flowing glow component with mobile adjustments */}
                  <MesmerizingGlow isMobile={isMobileView} />
                  
                  <picture className="relative z-10">
                    <source
                      srcSet="
                        https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/astronaut-300.webp 300w,
                        https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/astronaut-600.webp 600w
                      "
                      sizes="240px"
                      type="image/webp"
                    />
                    <img
                      src="https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/astronaut-600.webp"
                      alt="Cute astronaut floating in space"
                      width="600"
                      height="600"
                      className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(200,220,255,0.5)]"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              </Link>
            </motion.div>
          </div>
          
          {/* Body Paragraph - VISIBLE ONLY ON DESKTOP */}
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="hidden md:block text-white/90 text-lg md:text-xl leading-relaxed max-w-lg mb-6 md:mb-8 drop-shadow-md pointer-events-auto"
          >
            Explore our universe designed for the little ones in all of us. Find community, fun, educational resources, and a supportive, judgment-free zone.
          </motion.p>

          {/* CTAs */}
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: isMobileView ? "-7%" : "0%" }}
              transition={{ delay: 0.8 }}
              className="flex flex-row gap-3 w-full md:w-auto justify-center md:justify-start pointer-events-auto"
           >
            <Link 
               to="/blog" 
               className="
                 relative overflow-hidden group flex-1 md:flex-none
                 px-2 py-[14px] md:px-6 md:py-[15px] rounded-xl md:rounded-xl 
                 font-bold text-black text-center uppercase tracking-wider 
                 text-xs sm:text-sm md:text-base
                 bg-[#00FFFF] shadow-[0_0_25px_rgba(0,255,255,0.4)]
                 hover:shadow-[0_0_50px_rgba(0,255,255,0.7)] hover:scale-105 transition-all duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFFF] focus-visible:ring-offset-2 focus-visible:ring-offset-black
                 flex items-center justify-center
               "
            >
               <span className="relative z-10 block md:hidden">Read Blog</span>
               <span className="relative z-10 hidden md:block">Read Our Latest Stories</span>
               
               {/* Glitch/Shine overlay effect */}
               <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12 pointer-events-none" />
            </Link>
            
            <Link 
               to="/store" 
               className="
                 relative overflow-hidden group flex-1 md:flex-none
                 px-2 py-[14px] md:px-6 md:py-[15px] rounded-xl md:rounded-xl 
                 font-bold text-[#FF00FF] text-center uppercase tracking-wider 
                 text-xs sm:text-sm md:text-base
                 border-2 border-[#FF00FF] bg-transparent
                 shadow-[0_0_20px_rgba(255,0,255,0.25)]
                 hover:bg-[#FF00FF] hover:text-white hover:shadow-[0_0_40px_rgba(255,0,255,0.6)] hover:scale-105 transition-all duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF00FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black
                 flex items-center justify-center
               "
            >
               <span className="relative z-10 block md:hidden">Shop Gear</span>
               <span className="relative z-10 hidden md:block">Shop Little Gear</span>
              
              {/* Glitch/Shine overlay effect - ensure overlay does not capture pointer events */}
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12 pointer-events-none" />
            </Link>
          </motion.div>

        </motion.div>

        {/* RIGHT COLUMN (Desktop) / BACKGROUND LAYER (Mobile) - Planet & Astronaut */}
        <div className="absolute inset-0 md:relative md:inset-auto w-full md:w-[55%] h-full flex items-center justify-center order-2 md:order-2 pointer-events-none z-0 md:z-auto">
          
           {/* PLANET LAYER */}
           <div className="absolute inset-0 z-0 flex items-center justify-center overflow-visible">
              <div className="relative w-[85vw] h-[85vw] md:w-[90%] md:h-[90%] max-w-[800px] max-h-[800px] flex items-center justify-center">
                 <picture>
                  <source
                    srcSet="
                      https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/lswworld-400.webp 400w,
                      https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/lswworld-800.webp 800w,
                      https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/lswworld-1200.webp 1200w
                    "
                    sizes="(max-width: 768px) 90vw, (min-width: 769px) 50vw"
                    type="image/webp"
                  />
                  <motion.img
                    src="https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/lswworld-1200.webp"
                    alt="Stylized glowing planet with rings"
                    width="1200"
                    height="1200"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="planet animate-planet-rotate-ultra-slow w-full h-full object-contain"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 350, repeat: Infinity, ease: 'linear' }}
                    style={{ willChange: 'transform' }}
                  />
                </picture>
              </div>
           </div>

           {/* ASTRONAUT - DESKTOP ONLY POSITIONING */}
           {/* This element is hidden on mobile (hidden) and only shown on desktop (md:block) */}
           <div ref={parallaxRef} className="pointer-events-auto relative z-10 hidden md:block md:mb-0 overflow-visible">
            <motion.div
              {...astronautEntranceProps}
              className="overflow-visible"
            >
              <Link
                to="/explore"
                className="block cursor-pointer transition-transform hover:scale-105 duration-300 overflow-visible"
                aria-label="Explore LittleSpace World"
              >
                <div className="relative md:w-80 lg:w-[350px] aspect-[1/1] overflow-visible"> 
                  
                  {/* NEW: Complex flowing glow component (Desktop mode) */}
                  <MesmerizingGlow isMobile={false} />
                  
                  <picture className="relative z-10">
                    <source
                      srcSet="
                        https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/astronaut-300.webp 300w,
                        https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/astronaut-600.webp 600w
                      "
                      sizes="350px"
                      type="image/webp"
                    />
                    <img
                      src="https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/astronaut-600.webp"
                      alt="Cute astronaut floating in space"
                      width="600"
                      height="600"
                      className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(200,220,255,0.5)]"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
              </Link>
            </motion.div>
          </div>

        </div>

      </div>

      {/* COMPACT, BEAUTIFUL MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className={`fixed inset-0 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm ${isModalOpen ? 'z-50 pointer-events-auto' : 'z-10 pointer-events-none'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.9,
                opacity: 0
              }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)',
                borderRadius: '1.5rem',
                padding: '2rem 1.5rem',
                boxShadow: '0 0 40px rgba(255,0,255,0.4), 0 0 40px rgba(0,255,255,0.3)',
              }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition"
                aria-label="Close modal"
              >
                <X size={28} />
              </button>

              <div className="text-center space-y-5 text-white">
                <p className="text-lg md:text-xl leading-relaxed">
                  This space is designed for age-regressors, people that feel &quot;forever young&quot;, people doing inner-child healing work, and those feeling nostalgic for childhood.
                </p>
                <p className="text-lg md:text-xl font-medium text-pink-200">
                  Age-regression is widely seen as a healthy coping mechanism and tool for emotional processing and healing.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalacticHeroSection;