import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  onClick,
}) => {
  const baseClasses = 'rounded-xl overflow-hidden';
  const backgroundClasses = gradient
    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50'
    : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50';
  
  const Component = hover ? motion.div : 'div';
  const motionProps = hover
    ? {
        whileHover: { scale: 1.02, y: -2 },
        transition: { duration: 0.2 },
        onClick,
      }
    : {
        onClick,
      };

  return (
    <Component
      className={`${baseClasses} ${backgroundClasses} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
};