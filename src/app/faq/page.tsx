import { FaqContent } from "@/components/faq/faq-content";
import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Answers about shopping, products, orders, and salon services at ${BRAND.shortName}.`,
};

export default function FaqPage() {
  return <FaqContent />;
}
