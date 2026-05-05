type HeroBackgroundMediaProps = {
  imageSrc: string;
};

export function HeroBackgroundMedia({ imageSrc }: HeroBackgroundMediaProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden={true}
        className="h-full w-full object-cover"
        loading="eager"
      />
    </div>
  );
}
