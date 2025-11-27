import React from 'react';
import MatrixBackground from './MatrixBackground';

interface DomainBackgroundProps {
  color?: string;
  secondaryColor?: string;
}

const DomainBackground: React.FC<DomainBackgroundProps> = ({ 
  color = "59, 130, 246",
  secondaryColor = "29, 78, 216"
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <MatrixBackground />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-30 animate-[gradient-shift_15s_ease-in-out_infinite]"
        style={{
          background: `
            radial-gradient(
              circle at 30% 30%, 
              rgba(${color}, 0.4), 
              rgba(${secondaryColor}, 0.1)
            )
          `,
          backgroundSize: '200% 200%'
        }}
      />

      {/* Floating gradient background */}
      <div 
        className="absolute inset-0 animate-[float_20s_ease-in-out_infinite]"
        style={{
          background: `linear-gradient(45deg, rgba(${color}, 0.1) 0%, rgba(${secondaryColor}, 0.05) 100%)`
        }}
      />

      {/* Pulsing borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[pulse_4s_ease-in-out_infinite_0.5s]" />
    </div>
  );
};

export default DomainBackground;

