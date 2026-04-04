import type { ButtonHTMLAttributes } from "react";

type ButtonPushProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const base =
  "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-none px-6 py-3 text-base font-medium tracking-wide transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-px active:scale-[0.99] sm:w-auto sm:text-sm";

const variants: Record<NonNullable<ButtonPushProps["variant"]>, string> = {
  primary: "bg-ink text-white hover:bg-ink/90",
  secondary:
    "border border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
};

export function ButtonPush({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonPushProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();
  return <button type={type} className={classes} {...props} />;
}
