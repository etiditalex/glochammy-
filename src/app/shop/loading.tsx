export default function ShopLoading() {
  return (
    <div className="bg-white" aria-busy aria-label="Loading shop">
      <div className="mx-auto flex max-w-content flex-col items-center px-4 py-20 sm:px-8 sm:py-24">
        <div className="h-3 w-16 animate-pulse bg-line" />
        <div className="mt-5 h-10 w-48 animate-pulse bg-line" />
        <div className="mt-6 h-16 w-full max-w-2xl animate-pulse bg-line/70" />
      </div>
      <div className="mx-auto max-w-content px-4 sm:px-8">
        <div className="flex flex-wrap gap-2 border-b border-line py-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-20 animate-pulse bg-line" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 py-10 sm:gap-6 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse space-y-3 border border-line bg-white p-0">
              <div className="aspect-square bg-subtle" />
              <div className="space-y-2 p-5">
                <div className="h-4 w-3/4 bg-line" />
                <div className="h-3 w-full bg-line/70" />
                <div className="h-3 w-1/2 bg-line/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
