import React, { useEffect, useState, useMemo } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import '@/styles/starry-background-mobile.css';

const StarryBackground = () => {
  const [stars, setStars] = useState([]);
  const [clouds, setClouds] = useState([]);
  // We use a slightly wider definition of mobile here to ensure tablets also get the performant version if needed
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Generate box-shadow strings for mobile version
  // We use useMemo to generate these only once to avoid expensive recalculations
  const mobileShadows = useMemo(() => {
    // Use viewport-relative vertical offsets (vh) and significantly smaller counts
    // to avoid creating huge inline styles and extremely large layout extents.
    const generateShadows = (n) => {
      const parts = [];
      for (let i = 0; i < n; i++) {
        const x = (Math.random() * 100).toFixed(3);
        const y = (Math.random() * 100).toFixed(3);
        parts.push(`${x}vw ${y}vh #FFF`);
      }
      return parts.join(', ');
    };

    return {
      small: generateShadows(40),  // lighter for mobile
      medium: generateShadows(18),
      large: generateShadows(8)
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      // Mobile uses the CSS box-shadow technique handled by the render method
      setStars([]);
      setClouds([]);
      return;
    }

    const generateStars = () => {
      const starCount = 100;
      const newStars = Array.from({ length: starCount }, () => {
        const size = Math.random() * 2 + 1;
        const layer = Math.floor(Math.random() * 3) + 1;
        const colors = ['#C3AED6', '#BAE1FF', '#FFB3BA'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const twinkle = Math.random() < 0.3;

        let animationDuration;
        if (layer === 1) animationDuration = `${Math.random() * 50 + 70}s`;
        else if (layer === 2) animationDuration = `${Math.random() * 50 + 40}s`;
        else animationDuration = `${Math.random() * 30 + 20}s`;

        return {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          animation: `drift-up ${animationDuration} linear infinite ${Math.random() * -animationDuration.replace('s','')}s, twinkle 5s ease-in-out infinite ${Math.random() * 5}s`,
          opacity: twinkle ? 0.3 : (Math.random() * 0.5 + 0.5)
        };
      });
      setStars(newStars);
    };

    const generateClouds = () => {
        const newClouds = Array.from({ length: 5 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 200 + 150}px`,
            height: `${Math.random() * 100 + 100}px`,
            animation: `drift-clouds ${30 + Math.random() * 20}s linear infinite alternate ${Math.random() * 30}s`,
        }));
        setClouds(newClouds);
    };

    generateStars();
    generateClouds();

  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="starry-background-mobile" aria-hidden="true">
        <div className="stars-small" style={{ boxShadow: mobileShadows.small }}></div>
        <div className="stars-medium" style={{ boxShadow: mobileShadows.medium }}></div>
        <div className="stars-large" style={{ boxShadow: mobileShadows.large }}></div>
      </div>
    );
  }

  return (
    <div className="starry-background" aria-hidden="true">
      {stars.map((star, i) => (
        <div key={`s-${i}`} className="star" style={star} />
      ))}
      <div id="clouds-layer" className="clouds-layer">
        {clouds.map((cloud, i) => (
            <div key={`c-${i}`} className="cloud" style={cloud} />
        ))}
      </div>
    </div>
  );
};

export default StarryBackground;