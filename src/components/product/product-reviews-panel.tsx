"use client";

import {
  submitProductReviewAction,
  toggleProductLikeAction,
} from "@/app/actions/reviews";
import { isBrowserSupabaseConfigured } from "@/lib/supabase/env";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type {
  ProductReviewPublic,
  ProductReviewStats,
} from "@/lib/products/reviews";
import { ButtonPush } from "@/components/ui/button-push";
import { Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useState } from "react";

const field =
  "mt-1 w-full border border-line bg-white px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const label = "text-2xs uppercase tracking-nav text-muted";

function StarsDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 shrink-0 ${
            i <= rating ? "fill-accent text-accent" : "text-line"
          }`}
          strokeWidth={1.25}
        />
      ))}
    </span>
  );
}

function useLikerKey(): string | null {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storageKey = "glochammy-product-liker-key";
    let v = window.localStorage.getItem(storageKey);
    if (!v || v.length < 8) {
      v = crypto.randomUUID();
      window.localStorage.setItem(storageKey, v);
    }
    setKey(v);
  }, []);
  return key;
}

type Props = {
  productId: string;
  productSlug: string;
  productName: string;
  initialReviews: ProductReviewPublic[];
  initialStats: ProductReviewStats;
};

export function ProductReviewsPanel({
  productId,
  productSlug,
  productName,
  initialReviews,
  initialStats,
}: Props) {
  const router = useRouter();
  const likerKey = useLikerKey();
  const [reviews, setReviews] = useState(initialReviews);
  const [stats, setStats] = useState(initialStats);
  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [likeChecked, setLikeChecked] = useState(false);

  const [rating, setRating] = useState(5);
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rBody, setRBody] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);
  const [formPending, setFormPending] = useState(false);

  const refreshLiked = useCallback(async () => {
    if (!likerKey || !isBrowserSupabaseConfigured()) {
      setLikeChecked(true);
      return;
    }
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.rpc("has_product_like", {
        p_product_id: productId,
        p_liker_key: likerKey,
      });
      if (!error) setLiked(Boolean(data));
    } catch {
      /* ignore */
    } finally {
      setLikeChecked(true);
    }
  }, [productId, likerKey]);

  useEffect(() => {
    void refreshLiked();
  }, [refreshLiked]);

  useEffect(() => {
    setReviews(initialReviews);
    setStats(initialStats);
  }, [initialReviews, initialStats]);

  async function onToggleLike() {
    if (!likerKey || !isBrowserSupabaseConfigured()) return;
    setLikePending(true);
    const res = await toggleProductLikeAction({
      productId,
      productSlug,
      likerKey,
    });
    setLikePending(false);
    if (!res.ok) return;
    if (typeof res.liked === "boolean") setLiked(res.liked);
    router.refresh();
  }

  async function onSubmitReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFormOk(null);
    setFormPending(true);
    const res = await submitProductReviewAction({
      productId,
      productSlug,
      name: rName,
      email: rEmail,
      rating,
      body: rBody,
    });
    setFormPending(false);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    setFormOk("Thank you—your review is live.");
    setRBody("");
    router.refresh();
  }

  const avg = stats.averageRating;

  return (
    <section
      className="mt-14 border-t border-line pt-12"
      aria-labelledby="reviews-heading"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="reviews-heading" className="font-display text-2xl text-ink sm:text-3xl">
            Reviews
          </h2>
          <p className="mt-2 text-sm text-muted">
            Share your experience with {productName}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            {avg != null ? (
              <>
                <span className="font-display text-3xl tabular-nums text-ink">
                  {avg.toFixed(1)}
                </span>
                <StarsDisplay rating={Math.round(avg)} />
              </>
            ) : (
              <span className="text-sm text-muted">No ratings yet</span>
            )}
          </div>
          <span className="text-2xs uppercase tracking-nav text-muted">
            {stats.reviewCount} review{stats.reviewCount === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            disabled={likePending || !likerKey || !likeChecked || !isBrowserSupabaseConfigured()}
            onClick={() => void onToggleLike()}
            className={`inline-flex items-center gap-2 border px-3 py-2 text-2xs uppercase tracking-nav transition-colors disabled:opacity-50 ${
              liked
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink hover:bg-subtle"
            }`}
            aria-pressed={liked}
            aria-label={liked ? "Unlike this product" : "Like this product"}
          >
            <Heart
              className={`h-4 w-4 ${liked ? "fill-white text-white" : ""}`}
              strokeWidth={1.25}
            />
            {stats.likeCount} like{stats.likeCount === 1 ? "" : "s"}
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className={label}>Recent reviews</h3>
          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Be the first to review this product.</p>
          ) : (
            <ul className="mt-4 space-y-6">
              {reviews.map((r) => (
                <li key={r.id} className="border-b border-line pb-6 last:border-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <StarsDisplay rating={r.rating} />
                    <span className="text-sm font-medium text-ink">{r.reviewer_name}</span>
                    <time
                      dateTime={r.created_at}
                      className="text-2xs uppercase tracking-nav text-muted"
                    >
                      {new Date(r.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                    {r.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className={label}>Write a review</h3>
          {!isBrowserSupabaseConfigured() ? (
            <p className="mt-3 text-sm text-muted">
              Reviews require the shop to be connected (configure Supabase in the site settings).
            </p>
          ) : (
            <form onSubmit={(e) => void onSubmitReview(e)} className="mt-4 space-y-4">
              <fieldset>
                <legend className={label}>Your rating</legend>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`rounded-none border px-2 py-2 transition-colors ${
                        rating === n
                          ? "border-ink bg-ink text-white"
                          : "border-line bg-white text-ink hover:bg-subtle"
                      }`}
                      aria-pressed={rating === n}
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    >
                      <Star
                        className={`h-5 w-5 ${rating >= n ? "fill-current" : ""}`}
                        strokeWidth={1.25}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="rev-name" className={label}>
                  Name
                </label>
                <input
                  id="rev-name"
                  required
                  value={rName}
                  onChange={(e) => setRName(e.target.value)}
                  autoComplete="name"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="rev-email" className={label}>
                  Email
                </label>
                <input
                  id="rev-email"
                  type="email"
                  required
                  value={rEmail}
                  onChange={(e) => setREmail(e.target.value)}
                  autoComplete="email"
                  className={field}
                />
                <p className="mt-1 text-2xs text-muted">
                  One review per email per product. Your email is not shown on the page.
                </p>
              </div>
              <div>
                <label htmlFor="rev-body" className={label}>
                  Your review
                </label>
                <textarea
                  id="rev-body"
                  required
                  rows={5}
                  value={rBody}
                  onChange={(e) => setRBody(e.target.value)}
                  className={field}
                  placeholder="What did you think—texture, results, scent?"
                />
              </div>
              {formError ? (
                <p className="text-sm text-red-700" role="alert">
                  {formError}
                </p>
              ) : null}
              {formOk ? (
                <p className="text-sm text-ink" role="status">
                  {formOk}
                </p>
              ) : null}
              <ButtonPush type="submit" disabled={formPending} className="w-full sm:w-auto">
                {formPending ? "Submitting…" : "Submit review"}
              </ButtonPush>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
