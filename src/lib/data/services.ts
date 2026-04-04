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
  },
  {
    id: "svc-luminosity-peel",
    name: "Luminosity Peel",
    durationMinutes: 45,
    priceCents: 9200,
    currency: "KES",
    description:
      "Controlled brightening treatment with post-care guidance for smooth, even radiance.",
  },
  {
    id: "svc-sculpt-massage",
    name: "Sculpt & Release Massage",
    durationMinutes: 75,
    priceCents: 8800,
    currency: "KES",
    description:
      "Slow, restorative work for neck, shoulders, and facial tension release.",
  },
  {
    id: "svc-brow-def",
    name: "Brow Definition",
    durationMinutes: 30,
    priceCents: 3500,
    currency: "KES",
    description:
      "Shaping, tint optional, and finish mapping tailored to your features.",
  },
  {
    id: "svc-silk-blowout",
    name: "Silk Blowout",
    durationMinutes: 55,
    priceCents: 4800,
    currency: "KES",
    description:
      "Wash, treatment mist, and polished finish with heat protection.",
  },
];

export function getServiceById(id: string): SalonService | undefined {
  return salonServices.find((s) => s.id === id);
}
