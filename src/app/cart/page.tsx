import { CartPageContent } from "@/components/cart/cart-page-content";
import {
  isMpesaAutoCompleteConfigured,
  isMpesaStkAvailable,
} from "@/lib/mpesa/config";
import { getShopProducts, isSupabaseConfigured } from "@/lib/products/catalog";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your bag and adjust quantities.",
};

export default async function CartPage() {
  const catalog = await getShopProducts();

  let checkoutSession: { email: string; name: string } | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .maybeSingle();
        checkoutSession = {
          email: user.email,
          name: (profile?.full_name as string | undefined)?.trim() ?? "",
        };
      }
    } catch {
      /* */
    }
  }

  return (
    <div className="bg-white">
      <CartPageContent
        catalog={catalog}
        checkoutSession={checkoutSession}
        mpesaConfigured={isMpesaStkAvailable()}
        mpesaAutoComplete={isMpesaAutoCompleteConfigured()}
      />
    </div>
  );
}
