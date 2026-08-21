import { ArrowRight, Heart, ImageIcon, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageSkeleton } from '../components/system/SystemUI'
import { charityFallback, charityMedia } from '../data/charityMedia'

const formatCurrency = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0))

export default function CampaignsPage() {
  const [state, setState] = useState({ loading: true, items: [], error: '' })

  useEffect(() => {
    let active = true
    fetch('/api/campaigns')
      .then(async response => {
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Unable to load campaigns.')
        if (active) setState({ loading: false, items: data.data || [], error: '' })
      })
      .catch(error => {
        if (active) setState({ loading: false, items: [], error: error.message || 'Unable to load campaigns.' })
      })
    return () => { active = false }
  }, [])

  const featured = state.items.find(item => item.featured) || state.items[0]

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-slate-900">
      <section className="relative isolate overflow-hidden bg-rb-900 text-white">
        <img src={charityMedia.heroAlt} alt="RB Charity Foundation field initiative" className="absolute inset-0 h-full w-full object-cover opacity-50" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,61,.97)_0%,rgba(8,31,61,.88)_44%,rgba(8,31,61,.34)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(242,162,58,.25),transparent_25%)]" />
        <div className="relative mx-auto grid min-h-[590px] w-full max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-white/85 backdrop-blur"><Sparkles size={14} aria-hidden="true" /> Verified campaigns</span>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">Fund work you can <span className="text-gold">follow.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Every campaign connects a clear goal with verified donations, transparent progress and a published cause.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donate" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-black text-rb-900 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30">Donate now <Heart size={17} fill="currentColor" aria-hidden="true" /></Link>
              <Link to="/causes" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 font-black text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20">Explore causes <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="hidden lg:grid lg:justify-items-end">
            <div className="max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-7 backdrop-blur-xl">
              <ShieldCheck className="text-gold" aria-hidden="true" />
              <p className="mt-5 text-xs font-black uppercase tracking-[.18em] text-gold">Progress you can trust</p>
              <p className="mt-3 text-2xl font-black">Campaign totals update only from verified successful donations.</p>
              <p className="mt-3 text-sm leading-6 text-white/60">No decorative counters. No manual inflation. Just verified payment-backed progress.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 z-10 pb-24 sm:-mt-14 sm:pb-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          {featured && !state.loading ? (() => {
            const progress = featured.goalAmount ? Math.min(100, Math.round((Number(featured.raisedAmount || 0) / Number(featured.goalAmount)) * 100)) : 0
            return (
              <article className="grid overflow-hidden rounded-[2.2rem] border border-white/70 bg-white shadow-2xl shadow-rb-900/10 lg:grid-cols-[1.08fr_.92fr]">
                <div className="relative min-h-[320px] overflow-hidden lg:min-h-[470px]">
                  <img src={featured.coverImage || charityMedia.campaigns[0]} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-rb-900/65 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5 flex flex-wrap gap-2"><span className="rounded-full bg-gold px-4 py-2 text-xs font-black uppercase tracking-[.15em] text-rb-900">Featured</span><span className="rounded-full bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[.15em] text-rb-800">{featured.status}</span></div>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                  <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">{featured.cause?.name || 'Foundation campaign'}</p>
                  <h2 className="mt-4 text-3xl font-black tracking-[-.04em] text-rb-900 sm:text-5xl">{featured.title}</h2>
                  <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{featured.summary || featured.description}</p>
                  <div className="mt-7">
                    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-2xl font-black text-rb-900">{formatCurrency(featured.raisedAmount)}</p><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">raised</p></div><div className="text-right"><p className="text-lg font-black text-rb-800">{formatCurrency(featured.goalAmount)}</p><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">goal</p></div></div>
                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-rb-50"><div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} /></div>
                    <p className="mt-2 text-sm font-bold text-rb-600">{progress}% funded</p>
                  </div>
                  <Link to={`/campaigns/${featured.slug}`} className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-rb-900 px-5 py-3 font-black text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40">View campaign <ArrowRight size={17} aria-hidden="true" /></Link>
                </div>
              </article>
            )
          })() : null}

          <div className="mt-20 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Current initiatives</p><h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-.045em] text-rb-900 sm:text-5xl">Real goals. Visible progress. Human stories behind every number.</h2></div>
            <Link to="/reports" className="inline-flex w-fit items-center gap-2 font-black text-rb-700">View reports <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>

          {state.loading ? (
            <div className="mt-10"><PageSkeleton cards={6} /></div>
          ) : state.items.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {state.items.map((campaign, index) => {
                const progress = campaign.goalAmount ? Math.min(100, Math.round((Number(campaign.raisedAmount || 0) / Number(campaign.goalAmount)) * 100)) : 0
                const causeName = campaign.cause?.name || 'Foundation campaign'
                return (
                  <article key={campaign._id || campaign.slug} className="group overflow-hidden rounded-[2rem] border border-rb-100 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <Link to={`/campaigns/${campaign.slug}`} className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40">
                      <div className="relative aspect-[4/3] overflow-hidden bg-rb-50">
                        {campaign.coverImage ? <img src={campaign.coverImage} alt={campaign.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" decoding="async" /> : <img src={charityFallback('campaigns', index)} alt={campaign.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" decoding="async" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-rb-900/55 via-transparent to-transparent" />
                        <span className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[.14em] ${campaign.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-white/90 text-slate-600'}`}>{campaign.status}</span>
                      </div>
                    </Link>
                    <div className="p-6 sm:p-7">
                      <p className="text-xs font-black uppercase tracking-[.16em] text-rb-600">{causeName}</p>
                      <h3 className="mt-3 text-2xl font-black tracking-[-.03em] text-rb-900">{campaign.title}</h3>
                      <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{campaign.summary || campaign.description || 'View this campaign for more information.'}</p>
                      <div className="mt-7 rounded-2xl bg-rb-50/75 p-4">
                        <div className="flex flex-wrap justify-between gap-2 text-sm font-bold text-slate-600"><span>{formatCurrency(campaign.raisedAmount)} raised</span><span>{formatCurrency(campaign.goalAmount)} goal</span></div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} /></div>
                        <div className="mt-2 flex items-center justify-between gap-3"><p className="text-xs font-black text-rb-600">{progress}% funded</p><span className="text-xs font-bold text-slate-400">Verified donations</span></div>
                      </div>
                      <Link to={`/campaigns/${campaign.slug}`} className="mt-6 inline-flex items-center gap-2 font-black text-rb-700 transition hover:gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/30">View campaign <ArrowRight size={17} aria-hidden="true" /></Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-rb-200 bg-white p-10 text-center">
              <ImageIcon className="mx-auto text-rb-500" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-rb-900">{state.error ? 'Unable to load campaigns' : 'No campaigns published yet'}</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">{state.error || 'Active and completed campaigns from Admin will appear here automatically.'}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
