import React from 'react';
import { motion } from 'framer-motion';

const ContentSection = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 md:px-8 pt-24 pb-12 relative z-10" style={{ scrollMarginTop: '80px' }}>
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentSection;