import React, { useRef } from 'react';
import { CanvasImage } from '../types/canvas';

interface ThumbnailGalleryProps {
  images: CanvasImage[];
  currentImageId: string | null;
  onSelectImage: (id: string) => void;
}

export const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({
  images,
  currentImageId,
  onSelectImage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (images.length === 0) return null;

  return (
    <div className="bg-slate-100 border-t-2 border-slate-300 p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => scroll('left')}
          className="bg-slate-600 text-white p-2 rounded hover:bg-slate-700 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto flex-1 py-2" style={{ scrollbarWidth: 'thin' }}>
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => onSelectImage(img.id)}
              className={`flex-shrink-0 cursor-pointer transition-all transform hover:scale-105 ${
                currentImageId === img.id ? 'ring-4 ring-blue-500 shadow-lg' : 'ring-2 ring-gray-300'
              }`}
              style={{ width: '120px', height: '120px' }}
            >
              <img
                src={img.thumbnail}
                alt="Thumbnail"
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="bg-slate-600 text-white p-2 rounded hover:bg-slate-700 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
