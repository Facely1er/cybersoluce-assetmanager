import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselItem {
  primary: string;
  secondary: string;
}

interface TextCarouselProps {
  items: CarouselItem[];
  interval?: number;
}

const TextCarousel: React.FC<TextCarouselProps> = ({ 
  items, 
  interval = 6000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-sm">
            {items[currentIndex].primary}
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-lg">
            {items[currentIndex].secondary}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TextCarousel;

