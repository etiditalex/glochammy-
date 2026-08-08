import type { ReactNode } from "react";

/**
 * Lightweight route enter animation via CSS (no framer-motion on every navigation).
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
