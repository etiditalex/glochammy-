import { StorefrontChrome } from "@/components/layout/storefront-chrome";
import { CartProvider } from "@/context/cart-context";
import { BRAND } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env/site-url";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#faf9f7",
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND.shortName} · Beauty & Salon`,
    template: `%s · ${BRAND.shortName}`,
  },
  description: BRAND.tagline,
  applicationName: BRAND.shortName,
  /** Favicons: `src/app/icon.png` and `src/app/apple-icon.png` (file convention). */
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    type: "website",
    locale: "en_KE",
    siteName: BRAND.shortName,
    url: siteUrl,
    images: [
      {
        url: BRAND.ogImageSrc,
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.tagline,
    images: [BRAND.ogImageSrc],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen min-w-0 bg-background font-sans text-foreground antialiased">
        <CartProvider>
          <StorefrontChrome>{children}</StorefrontChrome>
        </CartProvider>
      </body>
    </html>
  );
}
