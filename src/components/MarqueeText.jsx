import React from 'react';
import { cn } from '@/lib/utils';

const MarqueeText = ({ text, className }) => {
  return (
    <div className="marquee-container">
      <div className={cn("marquee-content", className)}>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default MarqueeText;