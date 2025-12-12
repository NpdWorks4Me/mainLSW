import React from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const ParallaxBackground = () => {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const y3 = useTransform(scrollY, [0, 500], [0, -150]);
  
  return (
    <>
      <motion.div 
        className="absolute inset-0 z-0 bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/d8b376c968f764a51e60f08e5c26b779.svg')`,
          backgroundSize: '110%',
          backgroundPosition: 'bottom center',
          y: y3,
        }}
      />
      <motion.div 
        className="absolute inset-0 z-0 bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/c24151770e5b7410f92473471dc0a1a8.svg')`,
          backgroundSize: '120%',
          backgroundPosition: 'bottom center',
          y: y2,
        }}
      />
      <motion.div 
        className="absolute inset-0 z-0 bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/70c1e82e7019808d4b0ad4b89326d9bc.svg')`,
          backgroundSize: '130%',
          backgroundPosition: 'bottom center',
          y: y1,
        }}
      />
    </>
  );
};

export default ParallaxBackground;