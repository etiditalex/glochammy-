import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export function AdminPlaceholder({ title, children }: Props) {
  return (
    <div className="border border-line bg-white p-6 sm:p-8">
      <h1 className="font-display text-2xl text-ink sm:text-3xl">{title}</h1>
      <div className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        {children}
      </div>
    </div>
  );
}
