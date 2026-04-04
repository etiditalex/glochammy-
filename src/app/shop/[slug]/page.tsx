import { FadeIn } from "@/components/motion/fade-in";
import { ProductCard } from "@/components/product/product-card";
import { AddToCartPanel } from "@/components/product/add-to-cart-panel";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/lib/data/products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(params.slug, 3);

  return (
    <div className="bg-white">
      <div className="mx-auto min-w-0 max-w-content px-4 py-10 sm:px-8 sm:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 text-2xs uppercase tracking-nav text-muted">
            <li>
              <Link href="/shop" className="hover:text-ink">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="min-w-0 break-words text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-10 grid min-w-0 gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <ProductGallery name={product.name} images={product.images} />
          </FadeIn>
          <div>
            <FadeIn>
              <p className="text-2xs font-medium uppercase tracking-nav text-muted">
                {product.category}
              </p>
              <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted">
                {product.description}
              </p>
              <p className="mt-8 text-sm leading-relaxed text-muted">
                {product.longDescription}
              </p>
            </FadeIn>
            <div className="mt-10">
              <AddToCartPanel product={product} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-line bg-cream py-16 sm:py-20">
          <div className="mx-auto min-w-0 max-w-content px-4 sm:px-8">
            <FadeIn>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                You may also like
              </h2>
            </FadeIn>
            <div className="mt-10 grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
