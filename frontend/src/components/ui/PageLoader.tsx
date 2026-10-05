export default function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-400 animate-spin"></div>
      </div>
      <p className="text-sm text-text-tertiary font-medium">Loading...</p>
    </div>
  )
}
