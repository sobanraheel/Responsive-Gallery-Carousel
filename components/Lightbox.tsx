
import React, { useEffect, useCallback } from 'react';
import { GalleryImage } from '../types';
import { X, ChevronLeft, ChevronRight } from './Icons';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft') onPrev();
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [handleKeyDown]);

  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Header UI */}
      <div className="absolute top-0 inset-x-0 flex justify-between items-center p-6 z-10">
        <div className="text-white">
          <span className="text-sm font-medium text-gray-400">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-10 hidden md:block"
      >
        <ChevronLeft className="w-12 h-12" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-10 hidden md:block"
      >
        <ChevronRight className="w-12 h-12" />
      </button>

      {/* Main Image View */}
      <div className="w-full h-full flex items-center justify-center p-4 md:p-20 relative select-none">
        <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center gap-8">
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-500"
          />
          <div className="text-center max-w-2xl px-4 animate-in slide-in-from-bottom-4 duration-500 delay-150">
            <h2 className="text-3xl font-bold text-white mb-3">{currentImage.title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed">{currentImage.description}</p>
          </div>
        </div>
      </div>

      {/* Mobile Swipe/Tap Zones */}
      <div className="absolute inset-y-0 left-0 w-1/4 md:hidden" onClick={onPrev} />
      <div className="absolute inset-y-0 right-0 w-1/4 md:hidden" onClick={onNext} />
    </div>
  );
};

export default Lightbox;
