import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AboutAgeRegressionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="quiz-card p-6 rounded-2xl relative max-w-md w-full text-center flex flex-col" // Existing rounded-2xl
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            style={{ 
              background: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)', // Adjusted gradient
              border: '2px solid transparent',
              borderImage: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff9eed) 1',
              boxShadow: '0 0 30px rgba(255,0,255,0.4), 0 0 30px rgba(0,255,255,0.3)',
              color: 'white',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Center content horizontally
              minHeight: 'unset', // Allow content to dictate height
              paddingBottom: '2rem' // Keep some padding at the bottom
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center justify-center flex-grow py-4 px-2 space-y-4"> {/* Reduced vertical padding and horizontal padding */}
              <p className="text-lg md:text-xl font-medium leading-relaxed text-balance">
                This space is designed for age-regressors, people that feel "forever young", people doing inner-child healing work, and those feeling nostalgic for childhood.
              </p>
              <p className="text-lg md:text-xl font-medium leading-relaxed text-balance">
                Age-regression is widely seen as a healthy coping mechanism and tool for emotional processing and healing.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutAgeRegressionModal;