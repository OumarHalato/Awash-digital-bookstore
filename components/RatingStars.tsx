
import React from 'react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  className?: string;
  isDarkMode?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, max = 5, className = "", isDarkMode = false }) => {
  return (
    <div 
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`ደረጃ፡ ከ 5 ውስጥ ${rating.toFixed(1)} ኮከቦች (Rating: ${rating.toFixed(1)} out of 5 stars)`}
    >
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFull = rating >= starValue;
        const isHalf = !isFull && rating >= starValue - 0.5;

        return (
          <svg
            key={i}
            className={`w-4 h-4 transition-colors duration-300 ${isFull || isHalf ? 'text-yellow-500' : isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            {isHalf ? (
              <defs>
                <linearGradient id={`halfStar-${i}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor={isDarkMode ? "#334155" : "#cbd5e1"} stopOpacity="1" />
                </linearGradient>
              </defs>
            ) : null}
            <path
              fill={isHalf ? `url(#halfStar-${i})` : "currentColor"}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      })}
      <span className={`ml-1 text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`} aria-hidden="true">{rating.toFixed(1)}</span>
    </div>
  );
};

export default RatingStars;
