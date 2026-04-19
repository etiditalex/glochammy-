export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy aria-label="Loading">
      <div className="space-y-2">
        <div className="h-9 w-48 max-w-full rounded bg-line" />
        <div className="h-4 w-[min(28rem,100%)] rounded bg-line/80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 border border-line bg-white p-6 shadow-sm">
            <div className="h-3 w-24 rounded bg-line" />
            <div className="mt-4 h-10 w-16 rounded bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
