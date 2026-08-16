"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded bg-espresso shadow-premium">
        <Image
          src={images[active]}
          alt={`${name} view ${active + 1}`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority={active === 0}
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            type="button"
            key={image}
            aria-label={`Show product image ${index + 1}`}
            onClick={() => setActive(index)}
            className={`relative aspect-square overflow-hidden rounded border transition ${
              active === index
                ? "border-espresso ring-2 ring-cognac"
                : "border-espresso/10 hover:border-cognac"
            }`}
          >
            <Image src={image} alt="" fill className="object-cover" sizes="20vw" />
          </button>
        ))}
      </div>
    </div>
  );
}
