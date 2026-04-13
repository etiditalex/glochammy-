import Image from "next/image";

export function ProductSpotlightBanner() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-cream shadow-sm">
      <Image
        src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1776080210/gpro_ftxjgx.jpg"
        alt="Wonder Gro promotional banner"
        width={1600}
        height={512}
        className="h-auto w-full object-cover"
        sizes="(max-width: 768px) 100vw, 1200px"
        priority={false}
      />
    </div>
  );
}
