
import React, { useState } from 'react';

const OptimizedBlogImage = ({ src, alt, className, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%231e0f50'/%3E%3C/svg%3E";

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#1a0b3d]">
      {!isLoaded && !hasError && (
        <div className="image-skeleton" />
      )}

      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        loading={priority ? "eager" : "lazy"}
        draggable="false"
      />
    </div>
  );
};

export default OptimizedBlogImage;
