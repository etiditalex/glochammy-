/** Slug key from `product_categories.slug` (admin-managed when using Supabase). */
export type ProductCategory = string;

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
  stockQuantity?: number;
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
