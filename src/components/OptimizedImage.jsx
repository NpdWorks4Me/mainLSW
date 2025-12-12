
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  style = {}
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Helper to generate transformed Supabase URLs
  // Only works if the URL is actually from Supabase Storage
  const isSupabaseUrl = src && src.includes('supabase.co');
  
  const getOptimizedUrl = (url, w, format = 'webp') => {
    if (!url || !isSupabaseUrl) return url;
    // Append transformation params
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${w}&format=${format}&quality=80`;
  };

  // Only generate WebP srcSet if we can actually transform the image (Supabase)
  const srcSetWebP = isSupabaseUrl ? `
    ${getOptimizedUrl(src, 400, 'webp')} 400w,
    ${getOptimizedUrl(src, 800, 'webp')} 800w,
    ${getOptimizedUrl(src, 1200, 'webp')} 1200w
  ` : null;

  // Generate standard srcSet
  const srcSetFallback = isSupabaseUrl ? `
    ${getOptimizedUrl(src, 400, 'origin')} 400w,
    ${getOptimizedUrl(src, 800, 'origin')} 800w,
    ${getOptimizedUrl(src, 1200, 'origin')} 1200w
  ` : null; // If not supabase, let the browser handle the single src or we'd need manual resizing logic which we lack for external URLs

  return (
    <div 
      className={`relative overflow-hidden bg-gray-900/50 ${className}`}
      style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto', ...style }}
    >
      {/* Blur placeholder effect - fades out when loaded */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gray-800 animate-pulse z-10 pointer-events-none"
      />

      <picture>
        {srcSetWebP && (
          <source
            type="image/webp"
            srcSet={srcSetWebP}
            sizes={sizes}
          />
        )}
        {/* Only use srcSetFallback if we generated it (Supabase), otherwise just use src */}
        {srcSetFallback && (
             <source
             srcSet={srcSetFallback}
             sizes={sizes}
           />
        )}
       
        <motion.img
          src={src} // Default src
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.05 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full h-full object-cover ${className}`}
        />
      </picture>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 text-xs z-20">
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
