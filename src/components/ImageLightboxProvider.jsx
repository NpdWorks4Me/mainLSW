"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import ImageLightbox from '@/components/ImageLightbox';

const ImageLightboxContext = createContext();

export const useImageLightbox = () => useContext(ImageLightboxContext);

export const ImageLightboxProvider = ({ children }) => {
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  const openLightbox = useCallback((images, startIndex = 0) => {
    if (!images || images.length === 0) {
      console.warn("Lightbox opened with no images.");
      return;
    }
    setLightboxState({
      isOpen: true,
      images,
      currentIndex: startIndex,
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxState(prevState => ({ ...prevState, isOpen: false }));
  }, []);

  const handleNext = useCallback(() => {
    setLightboxState(prevState => ({
      ...prevState,
      currentIndex: (prevState.currentIndex + 1) % prevState.images.length,
    }));
  }, []);

  const handlePrev = useCallback(() => {
    setLightboxState(prevState => ({
      ...prevState,
      currentIndex: (prevState.currentIndex - 1 + prevState.images.length) % prevState.images.length,
    }));
  }, []);
  
  const selectedImage = lightboxState.isOpen ? lightboxState.images[lightboxState.currentIndex] : null;

  return (
    <ImageLightboxContext.Provider value={{ openLightbox }}>
      {children}
      <ImageLightbox
        selectedImage={selectedImage}
        setSelectedImage={closeLightbox}
        onNext={lightboxState.images.length > 1 ? handleNext : null}
        onPrev={lightboxState.images.length > 1 ? handlePrev : null}
      />
    </ImageLightboxContext.Provider>
  );
};