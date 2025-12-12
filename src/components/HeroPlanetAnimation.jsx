import React from 'react';
import { motion } from 'framer-motion';

const images = {
  background: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/d8b376c968f764a51e60f08e5c26b779.svg',
  distantPlanet: 'https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/lswworld-1200.webp', // 1. Replaced URL
  moon: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/a5acdf39b6ea45fb6136c8af228f79b7.webp',
  kitty: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/10f4756c65641f384beb5576674e07a5.webp',
  alien: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/50a782d0f4fd45b08864fb235feb8c07.webp',
  girlAstronaut: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/1e86f93eecba8cddf7d737221421e835.webp',
  boyAstronaut: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/6a0768e5499453a23080e786df2c3fec.webp',
  rocket: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/0738a99150bd4eb93b7cfa5962553eb0.png',
};

const HeroPlanetAnimation = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ backgroundImage: `url(${images.background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      
      {/* 
         2. Replaced the entire hero planet container with responsive <picture> element.
         3. Deleted the old tiny distantPlanet image and the 50vw container.
      */}
      <picture className="absolute inset-0 w-full h-full">
        <source 
          srcSet="https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/lswworld-400.webp 400w, https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/lswworld-800.webp 800w, https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/lswworld-1200.webp 1200w"
          sizes="(max-width: 768px) 90vw, 1200px"
          type="image/webp"
        />
        <motion.img
          src={images.distantPlanet}
          alt="A distant blue and white felt planet with rings"
          className="planet animate-planet-rotate-ultra-slow absolute inset-0 w-full h-full object-cover"
          style={{ 
            willChange: 'transform',
          }}
          animate={{ 
            rotate: 360
          }}
          transition={{
            rotate: { duration: 350, repeat: Infinity, ease: 'linear' }
          }}
          width="1200"
          height="1200"
          fetchPriority="high"
          loading="eager"
        />
      </picture>
      
      {/* Preserved floating elements, now siblings to the planet since 50vw container was removed */}
      
        <motion.img
          src={images.moon}
          alt="A large, colorful felt crescent moon"
          className="absolute w-[25vw] h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          style={{ willChange: 'transform' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 300, repeat: Infinity, ease: 'linear' }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] z-30 pointer-events-none">
          
          <motion.div
            className="absolute top-1/2 left-1/2 w-[12%] h-auto"
            style={{ willChange: 'transform' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          >
            <motion.img
              src={images.kitty}
              alt="A felt kitty cat in a spacecraft"
              className="absolute w-full h-auto"
              style={{ 
                transform: 'translate(-50%, -50%) translateX(14vw) translateY(-7vw)',
                willChange: 'transform'
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
          
          <motion.div
            className="absolute top-1/2 left-1/2 w-[12%] h-auto"
            style={{ willChange: 'transform' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            <motion.img
              src={images.alien}
              alt="A friendly felt alien in a UFO"
              className="absolute w-full h-auto"
              style={{ 
                transform: 'translate(-50%, -50%) translateX(16vw) translateY(-9vw)',
                willChange: 'transform'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>

        <motion.img
          src={images.girlAstronaut}
          alt="A felt girl astronaut drifting"
          className="absolute w-[15%] h-auto top-[20%] left-[15%] z-40"
          style={{ willChange: 'transform' }}
          animate={{
            x: [0, 8, -4, 0],
            y: [0, -6, 4, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
        />

        <motion.img
          src={images.boyAstronaut}
          alt="A felt boy astronaut drifting"
          className="absolute w-[14%] h-auto bottom-[20%] right-[8%] z-40"
          style={{ willChange: 'transform' }}
          animate={{
            x: [0, -6, 8, 0],
            y: [0, 4, -6, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0
          }}
        />

        <motion.img
          src={images.rocket}
          alt="A red felt rocket ship"
          className="absolute w-[12%] h-auto bottom-[15%] left-[20%] z-20"
          style={{ willChange: 'transform' }}
          animate={{
            y: [0, -8, 0],
            x: [0, 3, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
    </div>
  );
};

export default HeroPlanetAnimation;