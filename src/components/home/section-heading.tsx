import Link from "next/link";

type HomeSectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
};

export function HomeSectionHeading({
  id,
  eyebrow,
  title,
  href,
  linkLabel = "See all",
}: HomeSectionHeadingProps) {
  return (
    <div className="mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-10">
      {eyebrow ? (
        <p className="text-2xs font-medium uppercase tracking-nav text-muted">{eyebrow}</p>
      ) : null}
      <h2
        id={id}
        className="mt-3 font-display text-[2.25rem] leading-none text-ink sm:text-5xl"
      >
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="mt-5 inline-flex min-h-11 items-center border-b border-ink pb-0.5 text-xs font-medium uppercase tracking-nav text-ink transition-opacity hover:opacity-60"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
