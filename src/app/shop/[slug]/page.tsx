import { FadeIn } from "@/components/motion/fade-in";
import { ProductCard } from "@/components/product/product-card";
import { AddToCartPanel } from "@/components/product/add-to-cart-panel";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/lib/products/catalog";
import { getProductReviewStats, getProductReviewsList, isUuidProductId } from "@/lib/products/reviews";
import { ProductReviewsPanel } from "@/components/product/product-reviews-panel";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product" };
  const desc =
    product.longDescription.trim() && product.longDescription !== product.description
      ? `${product.description} ${product.longDescription}`.slice(0, 160)
      : product.description;
  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(params.slug, 3);

  const longTrim = product.longDescription.trim();
  const shortTrim = product.description.trim();
  const hasDistinctLong =
    longTrim.length > 0 && longTrim.toLowerCase() !== shortTrim.toLowerCase();

  const reviewsEnabled = isUuidProductId(product.id);
  const [initialReviews, initialReviewStats] = reviewsEnabled
    ? await Promise.all([
        getProductReviewsList(product.id),
        getProductReviewStats(product.id),
      ])
    : [
        [],
        {
          averageRating: null as number | null,
          reviewCount: 0,
          likeCount: 0,
        },
      ];

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
              <p className="mt-6 max-w-prose text-base leading-relaxed text-ink">
                {product.description}
              </p>
              {hasDistinctLong ? (
                <section className="mt-10 border-t border-line pt-10" aria-labelledby="product-details-heading">
                  <h2
                    id="product-details-heading"
                    className="font-display text-xl text-ink sm:text-2xl"
                  >
                    About this product
                  </h2>
                  <p className="mt-4 max-w-prose whitespace-pre-line text-sm leading-relaxed text-muted">
                    {longTrim}
                  </p>
                </section>
              ) : null}
            </FadeIn>
            <div className="mt-10">
              <AddToCartPanel product={product} />
            </div>
            <p className="mt-6 text-2xs text-muted">
              <Link href="/cart" className="underline underline-offset-4 hover:text-ink">
                View shopping bag
              </Link>
              {" · "}
              <Link href="/shop" className="underline underline-offset-4 hover:text-ink">
                Continue shopping
              </Link>
            </p>
          </div>
        </div>

        {reviewsEnabled ? (
          <ProductReviewsPanel
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            initialReviews={initialReviews}
            initialStats={initialReviewStats}
          />
        ) : null}
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
