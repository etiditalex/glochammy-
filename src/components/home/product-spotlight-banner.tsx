import Image from "next/image";
import Link from "next/link";

export function ProductSpotlightBanner() {
  return (
    <section className="bg-white" aria-label="Featured promotion">
      <Link href="/shop" className="block outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ink">
        <Image
          src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1776080210/gpro_ftxjgx.jpg"
          alt="Wonder Gro promotional banner"
          width={1600}
          height={512}
          className="h-auto w-full object-cover"
          sizes="100vw"
        />
      </Link>
    </section>
  );
}
