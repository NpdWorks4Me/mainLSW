"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import ProductLightbox from '@/components/ProductLightbox';

const ProductLightboxContext = createContext(null);

export const useProductLightbox = () => {
  const context = useContext(ProductLightboxContext);
  if (!context) {
    throw new Error('useProductLightbox must be used within a ProductLightboxProvider');
  }
  return context;
};

export const ProductLightboxProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ProductLightboxContext.Provider value={{ openLightbox }}>
      {children}
      <ProductLightbox isOpen={isOpen} onClose={closeLightbox} />
    </ProductLightboxContext.Provider>
  );
};