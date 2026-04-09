"use client";

import { useEffect, useState } from "react";

type HeroBackgroundMediaProps = {
  videoSrc: string;
};

export function HeroBackgroundMedia({ videoSrc }: HeroBackgroundMediaProps) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const connection =
      typeof navigator !== "undefined" &&
      "connection" in navigator &&
      navigator.connection &&
      typeof navigator.connection === "object"
        ? navigator.connection
        : null;
    const saveData = Boolean(connection && "saveData" in connection && connection.saveData);

    const update = () => {
      setShowVideo(media.matches && !prefersReducedMotion && !saveData);
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!showVideo) return null;

  return (
    <iframe
      src={videoSrc}
      title="Background video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      tabIndex={-1}
      aria-hidden={true}
      className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.02] border-0"
      loading="lazy"
    />
  );
}
