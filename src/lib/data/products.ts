import type { Product } from "@/lib/types/commerce";

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&w=2400&q=88`;

export const products: Product[] = [
  {
    id: "prod-aurora-cleanser",
    slug: "aurora-gentle-cleanser",
    name: "Aurora Gentle Cleanser",
    description: "Silky daily cleanser to lift impurities without stripping.",
    longDescription:
      "A sulfate-free gel-cream that respects your barrier. Massage onto damp skin, rinse, and follow with your serum. Formulated for sensitive and combination skin with a soft botanical scent.",
    priceCents: 3800,
    currency: "KES",
    category: "skincare",
    images: [
      u("photo-1556228578-0d85b1a4d571"),
      u("photo-1620916566398-39f1143ab7be"),
    ],
    featured: true,
  },
  {
    id: "prod-lumen-serum",
    slug: "lumen-clarity-serum",
    name: "Lumen Clarity Serum",
    description: "Brightening serum with stabilized vitamin C and peptides.",
    longDescription:
      "Featherlight and fast-absorbing. Use morning and night before moisturizer. Helps even tone and refine texture without irritation.",
    priceCents: 6200,
    currency: "KES",
    category: "skincare",
    images: [
      u("photo-1612817288484-6f916006741a"),
      u("photo-1571875257727-256c39da42af"),
    ],
    featured: true,
  },
  {
    id: "prod-ritual-oil",
    slug: "midnight-ritual-face-oil",
    name: "Midnight Ritual Face Oil",
    description: "Nourishing oil blend for overnight recovery.",
    longDescription:
      "Cold-pressed marula and squalane melt into the skin. Press in after moisturizer on dry days or use alone as the final step.",
    priceCents: 5400,
    currency: "KES",
    category: "skincare",
    images: [u("photo-1598440947619-2c35fc9aa908")],
  },
  {
    id: "prod-silk-mist",
    slug: "silk-hair-mist",
    name: "Silk Hair Mist",
    description: "Weightless finish for shine and heat protection.",
    longDescription:
      "Mist from mid-lengths to ends before styling. Heat-activated polymers smooth the cuticle while keeping movement.",
    priceCents: 2900,
    currency: "KES",
    category: "hair",
    images: [u("photo-1522338242992-e1a54906a8da")],
    featured: true,
  },
  {
    id: "prod-bloom-scrub",
    slug: "bloom-body-polish",
    name: "Bloom Body Polish",
    description: "Fine botanical grains and oils for supple skin.",
    longDescription:
      "Use once or twice weekly on damp skin. Rinse thoroughly and pat dry. Follow with body lotion or oil.",
    priceCents: 3600,
    currency: "KES",
    category: "body",
    images: [u("photo-1556228720-195a672e8a03")],
  },
  {
    id: "prod-noir-parfum",
    slug: "noir-drift-edp",
    name: "Noir Drift Eau de Parfum",
    description: "Airy woods, soft iris, and a trace of citrus.",
    longDescription:
      "Designed to sit close to the skin. Spritz on pulse points; layer with unscented body care for longevity.",
    priceCents: 8900,
    currency: "KES",
    category: "fragrance",
    images: [u("photo-1587017539504-67cfbddac569")],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(slug: string, limit: number): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return [];
  return products
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}
