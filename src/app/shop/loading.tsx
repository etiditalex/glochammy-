export default function ShopLoading() {
  return (
    <div className="bg-white" aria-busy aria-label="Loading shop">
      <div className="bg-[#f3f0ea]">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 sm:py-11 lg:py-14">
          <div className="h-3 w-12 animate-pulse bg-ink/10" />
          <div className="mt-4 h-12 w-56 animate-pulse bg-ink/10 sm:h-16 sm:w-80" />
          <div className="mt-4 h-4 w-full max-w-md animate-pulse bg-ink/10" />
        </div>
      </div>
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-[1280px] gap-4 px-4 py-4 sm:px-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-4 w-16 animate-pulse bg-line" />
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-8">
        <div className="h-11 w-full max-w-sm animate-pulse border-b border-line" />
      </div>
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-3 gap-y-10 px-4 pb-16 sm:px-8 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="animate-pulse">
            <div className="aspect-square bg-[#f4f2ef]" />
            <div className="mt-3 h-4 w-3/4 bg-line" />
            <div className="mt-2 h-4 w-1/3 bg-line/70" />
            <div className="mt-3 h-11 w-full bg-line/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
