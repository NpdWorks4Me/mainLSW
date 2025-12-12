import React, { useEffect, useRef } from 'react';

const GlobalStarfield = () => {
  const starfieldRef = useRef(null);

  useEffect(() => {
    const starfield = starfieldRef.current;
    if (starfield && starfield.children.length === 0) {
      const numStars = 200;
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starfield.appendChild(star);
      }
    }
  }, []);

  return <div ref={starfieldRef} className="starfield-global"></div>;
};

export default GlobalStarfield;