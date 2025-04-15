import React, { useState, useEffect, useRef } from 'react';

interface SliderWithLabelProps {
  onComplete: () => void;
}

const SliderWithLabel: React.FC<SliderWithLabelProps> = ({ onComplete }) => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [label, setLabel] = useState<string>('Yes, proceed');
  
  const sliderRef = useRef<HTMLInputElement | null>(null);

  const min = 0;
  const max = 100;

  const setSliderBackground = (value: number) => {
    const position = ((value - min) / (max - min)) * 100;
    return `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${position}%, #fff ${position}%, white 100%)`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setSliderValue(value);
    if (value === max) {
      setLabel('Confirming');
      onComplete();
    } else {
      setLabel('Yes, proceed');
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.background = setSliderBackground(sliderValue);
    }
  }, [sliderValue]);

  return (
    <div
      id="sliderContainer"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '0 10px',
      }}
    >
      <input
        id="confirm"
        type="range"
        value={sliderValue}
        min={min}
        max={max}
        onChange={handleSliderChange}
        ref={sliderRef}
        style={{
          width: '100%',
          height: '30px',
          border: 'solid 1px #4CAF50',
          borderRadius: '10px',
          outline: 'none',
          transition: 'background 450ms ease-in',
          WebkitAppearance: 'none',
          margin: '0',
        }}
        disabled={sliderValue === max}
      />
      <span
        id="sliderLabel"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          fontSize: 'smaller',
          fontFamily: 'sans-serif',
        }}
      >
        {label}
      </span>

      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 19px;
            height: 20px;
            background: #4CAF50;
            border-radius: 5px;
            cursor: pointer;
            display: hidden;
            // margin-top: -6px;
          }
          
        `}
      </style>
    </div>
  );
};

export default SliderWithLabel;
