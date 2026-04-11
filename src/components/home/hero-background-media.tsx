"use client";

import { useEffect, useState } from "react";

type HeroBackgroundMediaProps = {
  videoSrc: string;
};

export function HeroBackgroundMedia({ videoSrc }: HeroBackgroundMediaProps) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const connection =
      typeof navigator !== "undefined" &&
      "connection" in navigator &&
      navigator.connection &&
      typeof navigator.connection === "object"
        ? navigator.connection
        : null;
    const saveData = Boolean(connection && "saveData" in connection && connection.saveData);

    const update = () => {
      const prefersReducedMotion = motionQuery.matches;
      const allow =
        desktopQuery.matches && !prefersReducedMotion && !saveData;
      setShowVideo(allow);
    };

    update();
    desktopQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      desktopQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  if (!showVideo) return null;

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden [container-type:size]">
      {/*
        Cover the hero box (not the whole viewport): 16×9 iframe scaled so both edges meet or exceed
        the container. Mobile: pin to top so the crop feels full-bleed, not “floating” in the middle.
      */}
      <iframe
        src={videoSrc}
        title="Background video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        tabIndex={-1}
        aria-hidden={true}
        className="pointer-events-none absolute left-1/2 top-0 z-0 max-w-none -translate-x-1/2 border-0 [height:max(100cqh,calc(100cqw*9/16))] [width:max(100cqw,calc(100cqh*16/9))] scale-[1.03] md:top-1/2 md:-translate-y-1/2"
        loading="lazy"
      />
    </div>
  );
}
