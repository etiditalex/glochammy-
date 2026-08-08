export default function CartLoading() {
  return (
    <div className="bg-white" aria-busy aria-label="Loading cart">
      <section className="border-b border-line bg-cream">
        <div className="mx-auto max-w-content space-y-4 px-4 py-14 sm:px-8 sm:py-16">
          <div className="h-3 w-16 animate-pulse bg-line" />
          <div className="h-10 w-40 animate-pulse bg-line" />
          <div className="h-4 w-64 max-w-full animate-pulse bg-line/70" />
        </div>
      </section>
      <div className="mx-auto grid max-w-content gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex animate-pulse gap-4 border border-line p-4 sm:gap-6 sm:p-6"
            >
              <div className="h-24 w-24 shrink-0 bg-subtle sm:h-28 sm:w-28" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/2 bg-line" />
                <div className="h-3 w-1/3 bg-line/70" />
                <div className="h-10 w-32 bg-line" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 animate-pulse border border-line bg-cream" />
      </div>
    </div>
  );
}
