import React from 'react';
import { motion } from 'framer-motion';

const LogoComponent = ({
  onLogoClick
}) => {
  
  const logoVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2
      }
    }
  };
  
  return (
    <div className="logo-container">
      <motion.div 
        className="cursor-pointer"
        variants={logoVariants} 
        initial="hidden" 
        animate="visible" 
        onClick={onLogoClick}
      >
        <img 
          src="https://twzknjvtwbxtedklclht.supabase.co/storage/v1/object/public/homepage-images/logo-200.webp"
          alt="LittleSpace World Logo"
          width="238"
          height="128"
          fetchPriority="high"
          loading="eager"
          className="h-24 md:h-32"
        />
      </motion.div>
    </div>
  );
};
export default LogoComponent;