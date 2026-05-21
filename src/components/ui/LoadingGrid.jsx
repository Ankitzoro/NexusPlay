export default function LoadingGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="game-card animate-pulse">
          <div className="h-44 bg-[#1e1e40]" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-[#1e1e40] rounded w-16" />
            <div className="h-4 bg-[#1e1e40] rounded w-full" />
            <div className="h-3 bg-[#1e1e40] rounded w-24" />
            <div className="h-8 bg-[#1e1e40] rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
