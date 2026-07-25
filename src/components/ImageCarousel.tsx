"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1)), [images.length]);
  const prev = useCallback(() => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1)), [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [images.length, next]);

  if (images.length === 0) {
    return (
      <div className="h-64 bg-gradient-to-br from-primary-100 to-emerald-200 flex items-center justify-center">
        <ImageIcon className="w-16 h-16 text-primary-300" />
      </div>
    );
  }

  return (
    <div className="relative h-64 md:h-80 bg-gray-100 overflow-hidden">
      {images.map((url, i) => (
        <div key={url} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <Image src={url} alt={`${title} - ${i + 1}`} fill className="object-cover" priority={i === 0} />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110" type="button">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110" type="button">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'}`} type="button" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
