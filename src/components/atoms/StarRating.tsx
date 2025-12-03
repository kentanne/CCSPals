import { useState } from 'react';
import { StarRatingProps } from '@/interfaces/reviews';

export default function StarRating({ 
  rating, 
  interactive = false, 
  onRatingChange, 
  disabled = false,
  size = 'medium' 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  };
  
  const handleClick = (newRating: number) => {
    if (interactive && !disabled && onRatingChange) {
      onRatingChange(newRating);
    }
  };
  
  const handleMouseEnter = (newRating: number) => {
    if (interactive && !disabled) {
      setHoverRating(newRating);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive && !disabled) {
      setHoverRating(0);
    }
  };
  
  return (
    <div className={`stars ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <span
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`star ${isFilled ? 'filled' : ''} ${interactive && !disabled ? 'interactive' : ''} ${disabled ? 'disabled' : ''}`}
            style={{ cursor: interactive && !disabled ? 'pointer' : 'default' }}
          >
            {isFilled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
}