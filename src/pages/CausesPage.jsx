import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CausesPage() {
  const [state, setState] = useState({ loading: true, items: [], error: '' })

  useEffect(() => {
    let active = true
    fetch('/api/causes')
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}))
        if (!response.ok || !payload.success) throw new Error(payload.message || 'Unable to load causes.')
        if (active) setState({ loading: false, items: Array.isArray(payload.data) ? payload.data : [], error: '' })
      })
      .catch((error) => {
        if (active) setState({ loading: false, items: [], error: error.message || 'Unable to load causes.' })
      })
    return () => { active = false }
  }, [])

  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rb-700">Our causes</span>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-rb-900 sm:text-5xl">Focused areas for measurable social impact.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Each cause groups related campaigns, field work and impact updates. Public fundraising is only shown for verified published initiatives.</p>
        </div>

        {state.loading ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-[2rem] bg-white" />)}
          </div>
        ) : state.items.length ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {state.items.map((cause, index) => (
              <article key={cause._id || cause.slug} className="overflow-hidden rounded-[2rem] border border-rb-100 bg-white shadow-sm">
                {cause.image ? <img src={cause.image} alt="" className="aspect-[16/9] w-full object-cover" /> : null}
                <div className="p-7">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rb-900 font-black text-white">{String(index + 1).padStart(2, '0')}</div>
                  <h2 className="mt-6 text-2xl font-black text-rb-900">{cause.name}</h2>
                  <p className="mt-3 leading-7 text-slate-600">{cause.summary}</p>
                  <Link to={`/causes/${cause.slug}`} className="mt-6 inline-flex items-center gap-2 font-black text-rb-700">Explore cause <ArrowRight size={17} /></Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[2rem] border border-dashed border-rb-100 bg-white p-8 text-center">
            <h2 className="text-2xl font-black text-rb-900">{state.error ? 'Unable to load causes' : 'No causes published yet'}</h2>
            <p className="mt-2 text-slate-600">{state.error || 'Published causes from Admin will appear here automatically.'}</p>
          </div>
        )}
      </div>
    </main>
  )
}
