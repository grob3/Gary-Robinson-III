import React, { useEffect, useState } from 'react';

const ParallaxBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Circle 1 - Moves slow */}
      <div 
        className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-[#CE191D]/5 blur-[100px]"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      
      {/* Circle 2 - Moves medium */}
      <div 
        className="absolute top-[40%] right-[15%] w-96 h-96 rounded-full bg-[#1F6B91]/5 blur-[120px]"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      />

      {/* Line Graphic - Moves fast */}
      <div 
        className="absolute top-[70%] left-[5%] w-[2px] h-40 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent opacity-30"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />

      {/* Floating text element */}
      <div 
        className="absolute top-[25%] right-[5%] text-[10rem] font-bold text-black/[0.03] dark:text-white/[0.02] leading-none select-none transition-colors duration-300"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        VISION
      </div>

       <div 
        className="absolute top-[80%] left-[20%] text-[8rem] font-bold text-black/[0.03] dark:text-white/[0.02] leading-none select-none transition-colors duration-300"
        style={{ transform: `translateY(${scrollY * -0.2}px)` }}
      >
        DEPTH
      </div>
    </div>
  );
};

export default ParallaxBackground;