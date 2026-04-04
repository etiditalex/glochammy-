import type { ReactNode } from "react";

type LegalDocPageProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalDocPage({
  title,
  lastUpdated,
  children,
}: LegalDocPageProps) {
  return (
    <div className="w-full min-w-0 bg-white text-ink">
      <div className="w-full min-w-0 px-4 py-14 sm:px-6 md:px-8 lg:px-10 lg:py-20 xl:px-12 2xl:px-16">
        <h1 className="font-sans text-4xl font-light tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-8 text-sm italic text-muted">{lastUpdated}</p>
        <div className="mt-14 max-w-none space-y-10 text-left font-sans text-sm leading-relaxed text-ink sm:text-base">
          {children}
        </div>
      </div>
    </div>
  );
}
