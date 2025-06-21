import React from 'react';
import { motion } from 'framer-motion';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  showPercentage = false,
  color = 'primary'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    primary: 'from-indigo-500 to-purple-600',
    secondary: 'from-purple-500 to-pink-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-600'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Progress</span>
          <span className="text-gray-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
        />
      </div>
    </div>
  );
};