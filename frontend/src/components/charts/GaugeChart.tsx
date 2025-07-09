import React from 'react';
import { motion } from 'framer-motion';

interface GaugeChartProps {
  value: number;
  max: number;
  min?: number;
  label: string;
  unit?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showTrend?: boolean;
  trendValue?: number;
  trendDirection?: 'up' | 'down' | 'stable';
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  max,
  min = 0,
  label,
  unit = '',
  size = 120,
  strokeWidth = 8,
  color,
  showTrend = false,
  trendValue,
  trendDirection,
  quality
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const range = max - min;
  const percentage = Math.min(Math.max(((value - min) / range) * 100, 0), 100);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percentage: number, quality?: string) => {
    if (color) return color;
    
    if (quality) {
      switch (quality) {
        case 'excellent': return '#10B981'; // Green
        case 'good': return '#3B82F6'; // Blue
        case 'fair': return '#F59E0B'; // Yellow
        case 'poor': return '#EF4444'; // Red
        default: return '#3B82F6';
      }
    }

    if (percentage >= 80) return '#10B981'; // Green
    if (percentage >= 60) return '#3B82F6'; // Blue
    if (percentage >= 40) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getQualityText = (percentage: number, quality?: string) => {
    if (quality) {
      switch (quality) {
        case 'excellent': return 'Mükemmel';
        case 'good': return 'İyi';
        case 'fair': return 'Orta';
        case 'poor': return 'Kötü';
        default: return 'Bilinmiyor';
      }
    }

    if (percentage >= 80) return 'Mükemmel';
    if (percentage >= 60) return 'İyi';
    if (percentage >= 40) return 'Orta';
    return 'Kötü';
  };

  const getTrendIcon = (direction?: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '';
    }
  };

  const getTrendColor = (direction?: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      case 'stable': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const currentColor = getColor(percentage, quality);
  const qualityText = getQualityText(percentage, quality);

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
              {value.toFixed(1)}{unit}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {percentage.toFixed(0)}%
            </div>
            {showTrend && trendValue !== undefined && (
              <div className="text-xs text-gray-400 mt-1">
                {getTrendIcon(trendDirection)} {trendValue.toFixed(1)}{unit}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 mt-1">
          {qualityText}
        </div>
        {showTrend && trendDirection && (
          <div 
            className="text-xs mt-1 font-medium"
            style={{ color: getTrendColor(trendDirection) }}
          >
            {trendDirection === 'up' && 'Yükseliyor'}
            {trendDirection === 'down' && 'Düşüyor'}
            {trendDirection === 'stable' && 'Stabil'}
          </div>
        )}
      </div>
    </div>
  );
};

export default GaugeChart; 