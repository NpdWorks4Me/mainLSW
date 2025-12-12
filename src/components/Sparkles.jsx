import { motion } from 'framer-motion';
import React from 'react';

const Sparkles = ({ color = "#FFD700", style = {} }) => {
  return (
    <motion.span
      className="inline-block ml-1"
      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={style}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={color} />
      </svg>
    </motion.span>
  );
};

export default Sparkles;
