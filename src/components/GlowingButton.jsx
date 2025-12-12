import React from 'react';
import { Link } from 'react-router-dom';

const GlowingButton = ({ to, children, className = '' }) => {
  // Detect if the button is being styled as a pill (rounded-full)
  const isPill = className.includes('rounded-full');
  
  return (
    <Link 
      to={to} 
      className={`glowing-btn ${isPill ? 'glowing-btn--pill' : ''} ${className}`}
    >
      {isPill ? (
        /* SVG Animation for Pill Shape */
        <div className="glowing-btn-pill__container">
           <svg className="glowing-btn-pill__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                  <filter id="glow-pill">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                      <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                  </filter>
              </defs>
              {/* Base border (faint) */}
              <rect 
                  x="1" y="1" 
                  width="98%" height="98%" 
                  rx="999" ry="999" 
                  className="glowing-btn-pill__base"
              />
              {/* Moving Snake Border */}
              <rect 
                  x="1" y="1" 
                  width="98%" height="98%" 
                  rx="999" ry="999" 
                  className="glowing-btn-pill__snake"
                  filter="url(#glow-pill)"
                  pathLength="100"
              />
           </svg>
        </div>
      ) : (
        /* Standard Rectangular Animation */
        <>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </>
      )}
      
      <div className="glowing-btn__content relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
    </Link>
  );
};

export default GlowingButton;