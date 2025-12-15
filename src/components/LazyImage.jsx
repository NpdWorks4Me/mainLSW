"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ImageOff, RefreshCw } from 'lucide-react';

const ImagePlaceholder = ({ onRetry, variant }) => {
    const bgColor = variant === 'pink' ? 'bg-pink-500/10' : 'bg-blue-500/10';
    const textColor = variant === 'pink' ? 'text-pink-300' : 'text-blue-300';
    return (
        <div className={`w-full h-full flex flex-col items-center justify-center ${bgColor} rounded-lg p-2 text-center`}>
            <ImageOff className={`w-8 h-8 ${textColor} mb-2`} />
            <p className="text-xs text-foreground/80 mb-2">Image failed</p>
            <Button onClick={onRetry} variant="outline" size="sm" className="h-auto px-2 py-1 text-xs">
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
            </Button>
        </div>
    );
};

const LazyImage = React.memo(({ src, alt, className, width, height, placeholderVariant = 'pink', srcSet, sizes }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    if (containerRef.current) {
                        observer.unobserve(containerRef.current);
                    }
                }
            },
            { rootMargin: '200px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        setHasError(false);
    }, []);

    const handleError = useCallback(() => {
        setHasError(true);
    }, []);

    const handleRetry = useCallback((e) => {
        e.stopPropagation();
        setHasError(false);
        setShouldLoad(true); // Re-trigger image load
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: '1px' }}>
            {hasError ? (
                <ImagePlaceholder onRetry={handleRetry} variant={placeholderVariant} />
            ) : (
                <>
                    {!isLoaded && <div className="absolute inset-0 w-full h-full bg-slate-200/20 animate-pulse rounded-lg" />}
                    {shouldLoad && (
                        <img
                            src={src}
                            alt={alt}
                            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                            loading="lazy"
                            width={width}
                            height={height}
                            decoding="async"
                            srcSet={srcSet}
                            sizes={sizes}
                            onLoad={handleLoad}
                            onError={handleError}
                        />
                    )}
                </>
            )}
        </div>
    );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;