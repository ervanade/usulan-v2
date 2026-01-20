export default function KonfirmasiSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="h-6 w-1/3 bg-slate-200 rounded" />

      {/* Identitas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-9 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* SDM */}
      <div className="space-y-3">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 rounded" />
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <div className="h-10 w-32 bg-slate-300 rounded" />
      </div>
    </div>
  );
}
