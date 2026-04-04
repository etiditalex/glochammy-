"use client";

import { useCart } from "@/context/cart-context";
import { BRAND } from "@/lib/constants";
import { AboutYourSkinMegaMenu } from "@/components/layout/about-your-skin-mega-menu";
import { ShopMegaMenu } from "@/components/layout/shop-mega-menu";
import { UniverseMegaMenu } from "@/components/layout/universe-mega-menu";
import {
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const primaryLinks: { label: string; href: string }[] = [
  { label: "Book a treatment", href: "/booking" },
];

export function MainNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [universeOpen, setUniverseOpen] = useState(false);
  const [skinOpen, setSkinOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
    setUniverseOpen(false);
    setSkinOpen(false);
    setShopOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open && !universeOpen && !skinOpen && !shopOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, universeOpen, skinOpen, shopOpen]);

  useEffect(() => {
    if (!universeOpen && !skinOpen && !shopOpen) return;
    function handlePointerDown(e: MouseEvent | PointerEvent) {
      const el = headerRef.current;
      if (!el || !(e.target instanceof Node)) return;
      if (!el.contains(e.target)) {
        setUniverseOpen(false);
        setSkinOpen(false);
        setShopOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [universeOpen, skinOpen, shopOpen]);

  return (
    <header ref={headerRef} className="relative border-b border-line bg-white">
      <div className="mx-auto flex min-w-0 max-w-content items-center gap-3 px-4 py-4 sm:gap-6 sm:px-8 sm:py-6">
        <Link
          href="/"
          className="relative inline-flex shrink-0 items-center"
          aria-label={`${BRAND.shortName} home`}
        >
          <Image
            src={BRAND.logoSrc}
            alt=""
            width={240}
            height={69}
            sizes="(min-width: 640px) 240px, 192px"
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 justify-center overflow-x-auto overflow-y-visible lg:flex"
        >
          <ul className="flex shrink-0 flex-nowrap items-center justify-center gap-x-5 xl:gap-x-8 2xl:gap-x-10">
            <li className="shrink-0">
              <button
                type="button"
                className="min-h-[44px] whitespace-nowrap px-1 text-2xs font-medium uppercase tracking-nav text-ink transition-opacity hover:opacity-60 sm:text-xs lg:inline-flex lg:items-center"
                aria-expanded={skinOpen}
                aria-controls="about-your-skin-mega-menu"
                aria-haspopup="true"
                onClick={() => {
                  setUniverseOpen(false);
                  setShopOpen(false);
                  setSkinOpen((v) => !v);
                }}
              >
                About your skin
              </button>
            </li>
            <li>
              <button
                type="button"
                className="min-h-[44px] px-1 text-2xs font-medium uppercase tracking-nav text-ink transition-opacity hover:opacity-60 sm:text-xs lg:inline-flex lg:items-center"
                aria-expanded={shopOpen}
                aria-controls="shop-mega-menu"
                aria-haspopup="true"
                onClick={() => {
                  setSkinOpen(false);
                  setUniverseOpen(false);
                  setShopOpen((v) => !v);
                }}
              >
                Products
              </button>
            </li>
            <li className="shrink-0">
              <Link
                href="/shop"
                className="inline-flex min-h-[44px] items-center whitespace-nowrap text-2xs font-medium uppercase tracking-nav text-ink transition-opacity hover:opacity-60 sm:text-xs"
              >
                Shop
              </Link>
            </li>
            {primaryLinks.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center whitespace-nowrap text-2xs font-medium uppercase tracking-nav text-ink transition-opacity hover:opacity-60 sm:text-xs"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="shrink-0">
              <button
                type="button"
                className="min-h-[44px] whitespace-nowrap px-1 text-2xs font-medium uppercase tracking-nav text-ink transition-opacity hover:opacity-60 sm:text-xs lg:inline-flex lg:items-center"
                aria-expanded={universeOpen}
                aria-controls="universe-mega-menu"
                aria-haspopup="true"
                onClick={() => {
                  setSkinOpen(false);
                  setShopOpen(false);
                  setUniverseOpen((v) => !v);
                }}
              >
                Our universe
              </button>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-4 md:gap-5">
          <Link
            href="/shop"
            className="hidden min-h-[44px] min-w-[44px] items-center justify-center gap-2 text-sm text-ink transition-opacity hover:opacity-60 md:inline-flex md:min-h-0 md:min-w-0 md:px-1"
          >
            <Search className="h-4 w-4" strokeWidth={1.25} aria-hidden />
            <span className="sr-only sm:not-sr-only sm:inline">Search</span>
          </Link>
          <Link
            href="/account"
            aria-label="My account"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-ink transition-opacity hover:opacity-60"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </Link>
          <Link
            href="/locations"
            aria-label="Store locator"
            className="hidden min-h-[44px] min-w-[44px] items-center justify-center text-ink transition-opacity hover:opacity-60 sm:inline-flex"
          >
            <MapPin className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </Link>
          <Link
            href="/cart"
            aria-label={`Shopping bag${itemCount ? `, ${itemCount} items` : ""}`}
            className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-ink transition-opacity hover:opacity-60"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.25} />
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-ink px-1 text-[10px] font-medium text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X className="h-6 w-6" strokeWidth={1.25} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.25} />
            )}
          </button>
        </div>
      </div>

      <AboutYourSkinMegaMenu
        open={skinOpen}
        onClose={() => setSkinOpen(false)}
      />
      <ShopMegaMenu open={shopOpen} onClose={() => setShopOpen(false)} />
      <UniverseMegaMenu
        open={universeOpen}
        onClose={() => setUniverseOpen(false)}
      />

      {open ? (
        <div
          id="mobile-nav"
          className="max-h-[min(75dvh,calc(100dvh-6rem))] overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="mx-auto min-w-0 max-w-content px-4 py-4 pb-safe sm:px-8 sm:py-6">
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  type="button"
                  className="flex min-h-12 w-full items-center py-2 text-left text-sm font-medium uppercase tracking-nav text-ink"
                  onClick={() => {
                    setOpen(false);
                    setUniverseOpen(false);
                    setShopOpen(false);
                    setSkinOpen(true);
                  }}
                >
                  About your skin
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="flex min-h-12 w-full items-center py-2 text-left text-sm font-medium uppercase tracking-nav text-ink"
                  onClick={() => {
                    setOpen(false);
                    setSkinOpen(false);
                    setUniverseOpen(false);
                    setShopOpen(true);
                  }}
                >
                  Products
                </button>
              </li>
              {primaryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-12 items-center py-2 text-sm font-medium uppercase tracking-nav text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="flex min-h-12 items-center py-2 text-sm font-medium uppercase tracking-nav text-ink"
                >
                  Shop
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="flex min-h-12 w-full items-center py-2 text-left text-sm font-medium uppercase tracking-nav text-ink"
                  onClick={() => {
                    setOpen(false);
                    setSkinOpen(false);
                    setShopOpen(false);
                    setUniverseOpen(true);
                  }}
                >
                  Our universe
                </button>
              </li>
              <li>
                <Link
                  href="/salon"
                  className="flex min-h-12 items-center py-2 text-sm text-ink"
                >
                  Salon services
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
