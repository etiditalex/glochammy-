"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
};

const base =
  "inline-flex min-h-[48px] w-full min-w-0 items-center justify-center gap-2 rounded-none px-6 py-3 text-sm font-medium tracking-wide transition-[colors,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink hover:-translate-y-px active:scale-[0.99] motion-reduce:transition-colors motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:w-auto";

const variants: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  primary: "bg-ink text-white hover:bg-ink/90",
  secondary:
    "border border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  ghost: "border border-transparent text-ink hover:bg-subtle",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();
  return (
    <span className="inline-flex w-full min-w-0 justify-center sm:w-auto">
      <Link className={classes} {...props} />
    </span>
  );
}
