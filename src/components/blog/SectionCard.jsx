import React from 'react';
import { motion } from 'framer-motion';

const SectionCard = ({ icon, children, iconBgColor = 'bg-pink-500/20', iconColor = 'text-pink-400' }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
  };

  return (
    <motion.div
      className="blog-post-container p-6 sm:p-8 rounded-2xl"
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="flex items-center mb-6">
        {icon && (
          <div className={`p-3 rounded-full mr-4 shadow-lg ${iconBgColor}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${iconColor}` })}
          </div>
        )}
      </div>
      <div className="blog-post-content">
        {children}
      </div>
    </motion.div>
  );
};

export default SectionCard;