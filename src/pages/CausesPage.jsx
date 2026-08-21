import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { charityFallback, charityMedia } from '../data/charityMedia'

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

  const featured = state.items[0]

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-slate-900">
      <section className="relative isolate overflow-hidden bg-rb-900 text-white">
        <img src={charityMedia.hero} alt="RB Charity Foundation community outreach" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,61,.96)_0%,rgba(8,31,61,.84)_43%,rgba(8,31,61,.28)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(242,162,58,.28),transparent_26%)]" />
        <div className="relative mx-auto grid min-h-[620px] w-full max-w-7xl items-end gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-white/85 backdrop-blur"><Sparkles size={14} aria-hidden="true" /> Our causes</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">Where compassion becomes <span className="text-gold">measurable change.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Every published cause represents a long-term area of work backed by verified campaigns, field activity and transparent reporting.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-white/80">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">Community-led</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">Transparent funding</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">Long-term impact</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="ml-auto max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <ShieldCheck className="text-gold" aria-hidden="true" />
              <p className="mt-5 text-sm font-black uppercase tracking-[.18em] text-gold">Built for trust</p>
              <p className="mt-3 text-xl font-black">Causes define the mission. Campaigns show the work. Reports show the outcome.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 z-10 pb-24 sm:-mt-12 sm:pb-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          {featured && !state.loading ? (
            <article className="grid overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl shadow-rb-900/10 lg:grid-cols-[1.05fr_.95fr]">
              <div className="relative min-h-[320px] overflow-hidden lg:min-h-[430px]">
                <img src={featured.image || charityMedia.heroAlt} alt={featured.name} className="absolute inset-0 h-full w-full object-cover" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-rb-900/50 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-rb-800 shadow-sm">Featured cause</span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">A mission worth following</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-.04em] text-rb-900 sm:text-5xl">{featured.name}</h2>
                <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{featured.summary || featured.description}</p>
                <Link to={`/causes/${featured.slug}`} className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-rb-900 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40">Explore this cause <ArrowRight size={17} aria-hidden="true" /></Link>
              </div>
            </article>
          ) : null}

          <div className="mt-20 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Areas of action</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-.045em] text-rb-900 sm:text-5xl">Each cause is a chapter in a bigger mission.</h2>
            </div>
            <Link to="/donate" className="inline-flex w-fit items-center gap-2 font-black text-rb-700">Support the foundation <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>

          {state.loading ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[420px] animate-pulse rounded-[2rem] bg-white" />)}
            </div>
          ) : state.items.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {state.items.map((cause, index) => (
                <Link key={cause._id || cause.slug} to={`/causes/${cause.slug}`} className="group relative isolate min-h-[420px] overflow-hidden rounded-[2rem] border border-rb-100 bg-rb-900 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40">
                  <img src={cause.image || charityFallback('causes', index)} alt={cause.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-rb-900 via-rb-900/40 to-rb-900/5" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-sm font-black text-white backdrop-blur">{String(index + 1).padStart(2, '0')}</span>
                      <HeartHandshake size={22} className="text-gold" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-3xl font-black tracking-[-.035em] text-white">{cause.name}</h3>
                    <p className="mt-3 line-clamp-3 leading-7 text-white/72">{cause.summary || cause.description || 'Explore this area of impact and the initiatives connected to it.'}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-black text-gold transition group-hover:gap-3">Explore cause <ArrowRight size={17} aria-hidden="true" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-rb-200 bg-white p-8 text-center sm:p-12">
              <HeartHandshake className="mx-auto text-rb-500" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-rb-900">{state.error ? 'Unable to load causes' : 'No causes published yet'}</h2>
              <p className="mx-auto mt-2 max-w-xl text-slate-600">{state.error || 'Published causes from Admin will appear here automatically.'}</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#fff1dd] py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">One mission, many ways to help</p><h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-.04em] text-rb-900 sm:text-5xl">Choose the cause that moves you, or support the foundation as a whole.</h2></div>
          <Link to="/donate" className="inline-flex w-fit items-center gap-2 rounded-full bg-rb-900 px-6 py-3.5 font-black text-white transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40">Make a contribution <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  )
}
