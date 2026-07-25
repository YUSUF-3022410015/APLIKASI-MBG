"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: Props) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-64 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
        <span className="text-8xl">🍱</span>
      </div>
    );
  }

  return (
    <div className="relative h-64 bg-gray-100">
      <Image
        src={images[current]}
        alt={`${title} - ${current + 1}`}
        fill
        className="object-cover"
        priority
      />

      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between px-3">
            <button
              onClick={() => setCurrent((p) => (p === 0 ? images.length - 1 : p - 1))}
              className="w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition"
              type="button"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1))}
              className="w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition"
              type="button"
            >
              ›
            </button>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
