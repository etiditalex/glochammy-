export default function ProductLoading() {
  return (
    <div className="bg-white" aria-busy aria-label="Loading product">
      <div className="mx-auto max-w-content px-4 py-10 sm:px-8 sm:py-14">
        <div className="h-3 w-40 animate-pulse bg-line" />
        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-square animate-pulse bg-subtle" />
          <div className="space-y-6 animate-pulse">
            <div className="h-3 w-24 bg-line" />
            <div className="h-12 w-3/4 bg-line" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-line/70" />
              <div className="h-4 w-5/6 bg-line/70" />
              <div className="h-4 w-4/6 bg-line/70" />
            </div>
            <div className="h-12 w-48 bg-line" />
          </div>
        </div>
      </div>
    </div>
  );
}
