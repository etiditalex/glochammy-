export const BRAND = {
  name: "Glochammy Beauty Products & Salon",
  shortName: "Glochammy",
  tagline:
    "Your one-stop beauty shop in Kilifi—skincare, makeup, hair, nails, fragrance, tools, salon services, and a nails parlour.",
  oneStopHeadline: "Your one-stop beauty shop",
  oneStopLead:
    "Everything you need to look and feel your best—quality products plus expert salon and nails care.",
  logoSrc:
    "https://res.cloudinary.com/dyfnobo9r/image/upload/f_auto,q_auto,w_600/v1775097905/glochammy_logo-beauty_jt8hxr.png",
  /** Square PNG: browser tab, Apple touch icon, and platforms that use the site icon in previews. */
  iconSrc:
    "https://res.cloudinary.com/dyfnobo9r/image/upload/w_512,h_512,c_pad,b_rgb:faf9f7,f_auto,q_auto/v1775097905/glochammy_logo-beauty_jt8hxr.png",
  /** Default Open Graph / Twitter card when sharing the homepage or pages without their own image. */
  ogImageSrc:
    "https://res.cloudinary.com/dyfnobo9r/image/upload/w_1200,h_630,c_pad,b_rgb:faf9f7,f_auto,q_auto/v1775097905/glochammy_logo-beauty_jt8hxr.png",
  email: "hello@glochammybeauty.com",
  phone: "+254 788 508 836",
  addressLine: "Kilifi, Charo Wa Mae — near Msenangu Butchery",
  region: "Kilifi, Kenya",
  heroYoutubeVideoId: "otej7WLdPh0",
} as const;

export const RETAIL_DEPARTMENTS: readonly string[] = [
  "Skincare products",
  "Makeup & cosmetics",
  "Hair care & wigs",
  "Nail products",
  "Perfumes & body care",
  "Beauty tools & accessories",
];

export const SERVICE_DEPARTMENTS: readonly string[] = [
  "Salon services",
  "Nails parlour",
];

export const ANNOUNCEMENT_DISMISS_KEY = "glochammy-announcement-dismissed";

/** When a product has no image URLs; matches catalog fallback. */
export const FALLBACK_PRODUCT_IMAGE_URL =
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&w=1200&q=80";
