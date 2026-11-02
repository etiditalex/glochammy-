import type { SalonService } from "@/lib/types/commerce";

export const salonServices: SalonService[] = [
  {
    id: "svc-signature-facial",
    name: "Signature Glochammy Facial",
    durationMinutes: 60,
    priceCents: 7500,
    currency: "KES",
    description:
      "Deep cleanse, gentle exfoliation, massage, and a mask chosen for your skin goals.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&w=800&q=80",
  },
  {
    id: "svc-luminosity-peel",
    name: "Luminosity Peel",
    durationMinutes: 45,
    priceCents: 9200,
    currency: "KES",
    description:
      "Controlled brightening treatment with post-care guidance for smooth, even radiance.",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&w=800&q=80",
  },
  {
    id: "svc-sculpt-massage",
    name: "Sculpt & Release Massage",
    durationMinutes: 75,
    priceCents: 8800,
    currency: "KES",
    description:
      "Slow, restorative work for neck, shoulders, and facial tension release.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&w=800&q=80",
  },
  {
    id: "svc-brow-def",
    name: "Brow Definition",
    durationMinutes: 30,
    priceCents: 3500,
    currency: "KES",
    description:
      "Shaping, tint optional, and finish mapping tailored to your features.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&w=800&q=80",
  },
  {
    id: "svc-silk-blowout",
    name: "Silk Blowout",
    durationMinutes: 55,
    priceCents: 4800,
    currency: "KES",
    description:
      "Wash, treatment mist, and polished finish with heat protection.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&w=800&q=80",
  },
];

export function getServiceById(id: string): SalonService | undefined {
  return salonServices.find((s) => s.id === id);
}
