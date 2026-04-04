export type ProductCategory = "skincare" | "hair" | "body" | "fragrance";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  priceCents: number;
  currency: string;
  category: ProductCategory;
  images: string[];
  featured?: boolean;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type SalonService = {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  currency: string;
  description: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  location: string;
};
