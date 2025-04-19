import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';

interface SliderWithLabelProps {
  onComplete: () => void;
  className?: string;
}

const SliderWithLabel: React.FC<SliderWithLabelProps> = ({ onComplete, className }) => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);
    
    if (value === 100) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsLocked(true);
    if (sliderRef.current) {
      sliderRef.current.classList.add('completed');
    }
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (!isLocked) {
      setIsDragging(false);
      if (sliderValue < 100) {
        setSliderValue(0);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isLocked, sliderValue]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full max-w-md mx-auto px-4 py-6",
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={cn(
            "text-sm font-medium transition-opacity duration-200",
            isDragging ? "opacity-0" : "opacity-70",
            isLocked ? "text-green-500" : "text-white"
          )}>
            {isLocked ? "Confirmed!" : "Slide to confirm"}
          </span>
        </div>
        
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          disabled={isLocked}
          className={cn(
            "appearance-none w-full h-12 rounded-full bg-gradient-to-r from-gray-700/50 to-gray-600/50",
            "backdrop-blur-sm border border-white/10",
            "transition-all duration-300 ease-out",
            "hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
            "relative cursor-pointer",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-11",
            "[&::-webkit-slider-thumb]:h-11",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-white",
            "[&::-webkit-slider-thumb]:shadow-lg",
            "[&::-webkit-slider-thumb]:shadow-black/20",
            "[&::-webkit-slider-thumb]:border",
            "[&::-webkit-slider-thumb]:border-gray-300/50",
            "[&::-webkit-slider-thumb]:transition-all",
            "[&::-webkit-slider-thumb]:duration-150",
            "[&.completed]:bg-green-500/20",
            "[&.completed]:border-green-500/30",
            "dark:[&::-webkit-slider-thumb]:bg-gray-800",
            "dark:[&::-webkit-slider-thumb]:border-gray-700",
            isLocked && "cursor-not-allowed opacity-75"
          )}
          style={{
            '--slider-value': `${sliderValue}%`,
            background: `linear-gradient(to right, 
              rgba(59, 130, 246, 0.5) 0%,
              rgba(59, 130, 246, 0.5) ${sliderValue}%,
              rgba(255, 255, 255, 0.1) ${sliderValue}%,
              rgba(255, 255, 255, 0.1) 100%
            )`
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default SliderWithLabel;