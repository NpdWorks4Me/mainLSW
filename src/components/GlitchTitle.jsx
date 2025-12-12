import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const GlitchTitle = ({ children, className, as = "div" }) => {
  const [glitching, setGlitching] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const intervalRef = useRef(null);

  const startIntervalGlitch = () => {
      if (intervalRef.current) return;

      intervalRef.current = setInterval(() => {
          if (Math.random() < 0.30) { 
              setGlitching(true);
              setTimeout(() => setGlitching(false), 100); 
          }
      }, 1500);
  };
  
  const stopIntervalGlitch = () => {
      if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
      }
  };

  useEffect(() => {
    const animationDelay = setTimeout(() => {
        setShouldAnimate(true);
    }, 50);

    startIntervalGlitch();

    return () => {
      clearTimeout(animationDelay);
      stopIntervalGlitch();
    };
  }, []); 

  useEffect(() => {
      if (isHovering) {
          stopIntervalGlitch();
          setGlitching(true); 
      } else if (shouldAnimate) {
          setGlitching(false);
          startIntervalGlitch();
      }
  }, [isHovering, shouldAnimate]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  const isGlitched = glitching || isHovering;
  const Tag = as;

  return (
    <Tag
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'cyber-glitch-title relative text-[14vw] sm:text-6xl md:text-7xl lg:text-8xl font-bold font-mono text-white select-none transition-all duration-100',
        isGlitched && 'glitching',
        shouldAnimate && 'zoom-in-keyframe',
        className
      )}
      data-text={children}
    >
      {children}
    </Tag>
  );
};

export default GlitchTitle;