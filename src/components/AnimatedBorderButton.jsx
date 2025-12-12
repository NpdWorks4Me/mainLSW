import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import '@/styles/components/animatedBorderButton.css';

const AnimatedBorderButton = ({ to, children, className }) => {
  return (
    <Link to={to} className={cn('animated-border-btn', className)}>
      <span>{children}</span>
    </Link>
  );
};

export default AnimatedBorderButton;