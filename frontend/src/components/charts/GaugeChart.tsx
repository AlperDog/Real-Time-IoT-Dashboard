import React from 'react';
import { motion } from 'framer-motion';

interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max,
  label,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percentage: number) => {
    if (percentage >= 80) return '#10B981'; // Green
    if (percentage >= 60) return '#F59E0B'; // Yellow
    if (percentage >= 40) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const currentColor = getColor(percentage);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={currentColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDasharray, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(percentage)}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {value}/{max}
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-1">
          {percentage >= 80 ? 'Excellent' : 
           percentage >= 60 ? 'Good' : 
           percentage >= 40 ? 'Fair' : 'Poor'}
        </div>
      </div>
    </div>
  );
};

export default GaugeChart; 