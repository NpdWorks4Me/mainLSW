import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { delay: 0.1, type: 'spring', stiffness: 120 },
  },
};

const ImageLightbox = ({ selectedImage, setSelectedImage, onNext, onPrev }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = selectedImage.src;
    link.download = selectedImage.title ? `${selectedImage.title.replace(/\s+/g, '_')}.png` : 'coloring-page.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    if (selectedImage) {
        window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, isDesktop, onNext, onPrev, setSelectedImage]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedImage(null);
    }
  };

  if (!selectedImage) return null;

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(13, 26, 62, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative w-full h-full flex flex-col items-center justify-center"
            variants={modalVariants}
          >
            <div className="relative flex items-center justify-center" style={{ maxWidth: '90vw', maxHeight: '80vh' }}>
              <LazyImage
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="object-contain rounded-lg shadow-2xl"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-4 right-4 text-white bg-black/30 hover:bg-black/60 rounded-full h-12 w-12"
                onClick={handleDownload}
              >
                <Download className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="text-center text-white mt-4 p-2 rounded-lg max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-1">{selectedImage.title}</h2>
              <p className="text-gray-300 text-sm">{selectedImage.description}</p>
            </div>
          </motion.div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-[#FFFFFF] bg-black/30 hover:bg-black/60 rounded-full h-12 w-12 z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-7 w-7" />
          </Button>

          {isDesktop && onPrev && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white rounded-full h-14 w-14"
                onClick={onPrev}
              >
                <ChevronLeft className="h-9 w-9" />
              </Button>
          )}
           {isDesktop && onNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 hover:text-white rounded-full h-14 w-14"
                onClick={onNext}
              >
                <ChevronRight className="h-9 w-9" />
              </Button>
           )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageLightbox;