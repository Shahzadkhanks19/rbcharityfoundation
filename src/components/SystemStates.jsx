export function PageSkeleton({ cards = 6 }) {
  return (
    <div className="min-h-[60vh] bg-[#f8fbff]">
      <section className="bg-rb-900 py-20">
        <div className="mx-auto w-full max-w-7xl animate-pulse px-5 sm:px-6 lg:px-8">
          <div className="h-3 w-24 rounded-full bg-white/15" />
          <div className="mt-5 h-12 max-w-2xl rounded-2xl bg-white/15" />
          <div className="mt-4 h-5 max-w-xl rounded-full bg-white/10" />
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index} className="animate-pulse overflow-hidden rounded-[2rem] border border-rb-100 bg-white shadow-sm">
            <div className="h-48 bg-rb-50" />
            <div className="space-y-3 p-6">
              <div className="h-4 w-24 rounded-full bg-rb-50" />
              <div className="h-6 w-4/5 rounded-full bg-rb-50" />
              <div className="h-4 w-full rounded-full bg-slate-100" />
              <div className="h-4 w-2/3 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export function InlineSkeleton({ rows = 3 }) {
  return <div className="animate-pulse space-y-3">{Array.from({ length: rows }).map((_, index) => <div key={index} className="h-12 rounded-2xl bg-rb-50" />)}</div>
}
