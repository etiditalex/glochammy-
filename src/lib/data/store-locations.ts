import { BRAND } from "@/lib/constants";

export type StoreBranch = {
  id: string;
  name: string;
  category: string;
  addressLines: string[];
  city: string;
  phone: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
};

/** Coordinates are approximate; refine with your exact pinned place IDs when ready. */
export const storeBranches: StoreBranch[] = [
  {
    id: "kilifi",
    name: `${BRAND.shortName} Kilifi`,
    category: "Flagship beauty shop & salon",
    addressLines: ["Charo Wa Mae", "Near Msenangu Butchery"],
    city: "Kilifi",
    phone: BRAND.phone,
    lat: -3.6295,
    lng: 39.8492,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Charo+Wa+Mae+Kilifi+Kenya",
  },
  {
    id: "mombasa",
    name: `${BRAND.shortName} Mombasa`,
    category: "Retail & pick-up point",
    addressLines: ["Moi Avenue vicinity", "Central business district"],
    city: "Mombasa County",
    phone: BRAND.phone,
    lat: -4.0435,
    lng: 39.6682,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Mombasa+CBD+Kenya",
  },
  {
    id: "malindi",
    name: `${BRAND.shortName} Malindi`,
    category: "Retail & pick-up point",
    addressLines: ["Town centre service area"],
    city: "Malindi",
    phone: BRAND.phone,
    lat: -3.2192,
    lng: 40.1169,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Malindi+town+Kenya",
  },
];
