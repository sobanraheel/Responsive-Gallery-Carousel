
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GalleryImage } from '../types';
import { ChevronLeft, ChevronRight } from './Icons';

interface CarouselProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const items = container.querySelectorAll('.carousel-item');
    if (items[index]) {
      const offset = (items[index] as HTMLElement).offsetLeft;
      container.scrollTo({ left: offset, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  }, []);

  const next = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    scrollTo(nextIndex);
  }, [currentIndex, images.length, scrollTo]);

  const prev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    scrollTo(prevIndex);
  }, [currentIndex, images.length, scrollTo]);

  // Handle auto-scroll logic
  useEffect(() => {
    if (isAutoPlaying && images.length > 0) {
      autoPlayRef.current = window.setInterval(() => {
        next();
      }, 5000); // Advance every 5 seconds
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, next, images.length]);

  // Handle scroll snap updates for manual swipes to sync index
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.clientWidth * 0.8; // Approximate item width based on 80% width in CSS
    const index = Math.round(scrollLeft / (itemWidth + 24)); // 24 is space-x-6 gap
    if (index >= 0 && index < images.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  }, [currentIndex, images.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (images.length === 0) return null;

  return (
    <div 
      className="relative group w-full max-w-6xl mx-auto px-4 py-8"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md hidden md:block"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md hidden md:block"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-6 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, index) => (
          <div
            key={img.id}
            className="carousel-item flex-none w-[85%] md:w-[80%] snap-center"
          >
            <div 
              className="relative aspect-video rounded-3xl overflow-hidden cursor-pointer group/item shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
              onClick={() => onImageClick(index)}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-10">
                <h3 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">{img.title}</h3>
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl">{img.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              currentIndex === index ? 'w-10 bg-blue-500' : 'w-2 bg-gray-700 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
