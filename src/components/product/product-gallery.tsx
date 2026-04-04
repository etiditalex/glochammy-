"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[84px_1fr] lg:items-start">
      <div className="order-2 flex gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {images.map((src, i) => {
          const selected = i === active;
          return (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={selected}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden border bg-subtle sm:w-20 lg:w-full ${
                selected ? "border-ink" : "border-line"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 120px, 80px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
      <div className="relative order-1 aspect-square bg-subtle lg:order-2">
        <Image
          key={main}
          src={main}
          alt={name}
          fill
          sizes="(min-width: 1024px) min(640px, 50vw), 100vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
