export default function Loading() {
  return (
    <div className="bg-white" aria-busy aria-label="Loading">
      <div className="relative min-h-[70svh] w-full animate-pulse bg-subtle md:min-h-[60vh]">
        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <div className="h-12 w-36 bg-line" />
        </div>
      </div>
      <div className="mx-auto max-w-content space-y-10 px-4 py-16 sm:px-8">
        <div className="mx-auto h-8 w-48 bg-line" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-subtle" />
              <div className="h-4 w-3/4 bg-line" />
              <div className="h-3 w-full bg-line/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
