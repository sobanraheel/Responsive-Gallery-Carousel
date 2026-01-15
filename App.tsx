import React, { useState, useEffect } from "react";
import Carousel from "./components/Carousel";
import Lightbox from "./components/Lightbox";
import { GalleryImage, LightboxState, LoadingState } from "./types";
import { Sparkles, Loader2 } from "./components/Icons";

const INITIAL_IMAGES: GalleryImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    title: "Highland Serenity",
    description:
      "Breathtaking mountain peaks reflected in a crystal-clear alpine lake at sunrise.",
    timestamp: Date.now(),
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
    title: "Azure Coastline",
    description:
      "Dramatic cliffs meeting the turquoise waters of a secluded Mediterranean cove.",
    timestamp: Date.now(),
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200",
    title: "Sun-Drenched Canopy",
    description:
      "Golden hour sunlight piercing through the dense leaves of an ancient deciduous forest.",
    timestamp: Date.now(),
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1200",
    title: "Misty Valley",
    description:
      "A quiet village nestled in a valley as early morning fog rolls over the surrounding hills.",
    timestamp: Date.now(),
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1200",
    title: "Pastoral Harmony",
    description:
      "Rolling green pastures dotted with wildflowers under a vast, cloudless sky.",
    timestamp: Date.now(),
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    title: "Lava Tides",
    description:
      "Surreal volcanic landscapes where black sand meets the deep blue of the Atlantic.",
    timestamp: Date.now(),
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=1200",
    title: "Oasis of Light",
    description:
      "The shifting sands of a vast desert creating intricate patterns under the midday sun.",
    timestamp: Date.now(),
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
    title: "Yosemite Echo",
    description:
      "Iconic granite monoliths standing tall over the verdant floor of the Yosemite Valley.",
    timestamp: Date.now(),
  },
];

const App: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>(INITIAL_IMAGES);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    currentIndex: 0,
  });

  const openLightbox = (index: number) => {
    setLightbox({ isOpen: true, currentIndex: index });
  };

  const closeLightbox = () => {
    setLightbox({ ...lightbox, isOpen: false });
  };

  const nextImage = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % images.length,
    }));
  };

  const prevImage = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + images.length) % images.length,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0a0a0a]">
      {/* Background Accent */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      {/* Header & Controls */}
      <header className="w-full max-w-4xl px-6 pt-16 pb-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Best Gallery Carousel</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-4 bg-gradient-to-br from-white via-white to-gray-600 bg-clip-text text-transparent">
          Carousel
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-1 max-w-2xl mx-auto font-light leading-relaxed">
          Experience a living gallery.
        </p>
      </header>

      {/* Main Content: Carousel */}
      <main className="w-full flex-1 relative z-10 flex flex-col justify-center py-4">
        {loading === LoadingState.GENERATING ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="relative">
              <div className="w-28 h-28 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-2 border-purple-500/10 border-b-purple-500 rounded-full animate-spin-slow absolute" />
                <Sparkles className="w-10 h-10 text-blue-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-white tracking-tight">
                Dreaming up your gallery
              </p>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Gemini is brainstorming 8 cinematic scenes and painting them
                with light. Please wait a few moments.
              </p>
            </div>
          </div>
        ) : (
          <Carousel images={images} onImageClick={openLightbox} />
        )}
      </main>

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <Lightbox
          images={images}
          currentIndex={lightbox.currentIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};

export default App;
