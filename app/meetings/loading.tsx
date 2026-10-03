export default function Loading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading meetings">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-lg bg-black/5 dark:bg-white/10"
        />
      ))}
    </div>
  );
}
