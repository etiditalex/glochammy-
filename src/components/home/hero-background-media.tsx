type HeroBackgroundMediaProps = {
  imageSrc: string;
  /** Anchor so top-left branding (e.g. logo on a banner) stays visible under object-cover. */
  imageClassName?: string;
  alt?: string;
};

export function HeroBackgroundMedia({
  imageSrc,
  imageClassName = "h-full w-full object-cover object-left-top",
  alt = "",
}: HeroBackgroundMediaProps) {
  const decorative = alt === "";
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={alt}
        aria-hidden={decorative}
        className={imageClassName}
        loading="eager"
      />
    </div>
  );
}
