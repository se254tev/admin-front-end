const SkeletonLoader = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

const SkeletonCard = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="space-y-4">
      <SkeletonLoader className="h-4 w-3/4" />
      <SkeletonLoader className="h-8 w-1/2" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-2/3" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  </div>
);

export { SkeletonLoader, SkeletonCard, SkeletonTable };