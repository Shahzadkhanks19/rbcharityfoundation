import { ArrowLeft, ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { charityFallback, charityMedia } from '../data/charityMedia'

export default function CauseDetailsPage() {
  const { slug } = useParams()
  const [cause, setCause] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    Promise.all([
      fetch(`/api/causes/${encodeURIComponent(slug)}`).then(async (response) => {
        const payload = await response.json().catch(() => ({}))
        if (!response.ok || !payload.success) throw new Error(payload.message || 'Unable to load cause.')
        return payload.data
      }),
      fetch('/api/campaigns').then(async (response) => {
        const payload = await response.json().catch(() => ({}))
        if (!response.ok || !payload.success) throw new Error(payload.message || 'Unable to load campaigns.')
        return Array.isArray(payload.data) ? payload.data : []
      }),
    ])
      .then(([causeData, campaignData]) => {
        if (!active) return
        setCause(causeData)
        setCampaigns(campaignData.filter((campaign) => campaign.cause?.slug === causeData.slug))
      })
      .catch((requestError) => {
        if (!active) return
        setCause(null)
        setCampaigns([])
        setError(requestError.message || 'Unable to load cause.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [slug])

  if (loading) {
    return <main className="min-h-screen bg-[#f8fbff] px-5 py-16 sm:px-6 lg:px-8"><div className="mx-auto w-full max-w-7xl animate-pulse"><div className="h-[520px] rounded-[2rem] bg-rb-100"/><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"><div className="h-80 rounded-[2rem] bg-white"/><div className="h-72 rounded-[2rem] bg-rb-900/10"/></div></div></main>
  }

  if (!cause) {
    return <main className="min-h-screen bg-[#f8fbff] px-5 py-20"><div className="mx-auto max-w-4xl rounded-[2rem] border border-rb-100 bg-white p-8"><h1 className="text-3xl font-black text-rb-900">Cause not found</h1><p className="mt-3 text-slate-600">{error || 'This cause is unavailable or is no longer published.'}</p><Link to="/causes" className="mt-5 inline-flex items-center gap-2 font-black text-rb-700"><ArrowLeft size={17}/> Back to causes</Link></div></main>
  }

  const focusAreas = Array.isArray(cause.focusAreas) ? cause.focusAreas : []
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'active')
  const heroImage = cause.image || charityMedia.hero

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-slate-900">
      <section className="relative isolate min-h-[620px] overflow-hidden bg-rb-900 text-white">
        <img src={heroImage} alt={cause.name} className="absolute inset-0 h-full w-full object-cover opacity-55" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,61,.97)_0%,rgba(8,31,61,.88)_46%,rgba(8,31,61,.3)_100%)]" />
        <div className="relative mx-auto flex min-h-[620px] w-full max-w-7xl flex-col justify-between px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link to="/causes" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"><ArrowLeft size={16} aria-hidden="true" /> All causes</Link>
          <div className="max-w-4xl pb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-rb-900"><HeartHandshake size={14} aria-hidden="true"/> Cause</span>
            <h1 className="mt-6 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">{cause.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">{cause.summary || cause.description}</p>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 z-10 pb-24 sm:-mt-12 sm:pb-32">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <article className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-xl shadow-rb-900/5 sm:p-9 lg:p-12">
            <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">What this cause stands for</p>
            <div className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-600 sm:text-lg">{cause.description || cause.summary}</div>

            {focusAreas.length ? <div className="mt-10"><h2 className="text-3xl font-black tracking-[-.035em] text-rb-900">Our focus within this cause</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{focusAreas.map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl bg-rb-50 p-4 text-slate-700"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-rb-600" aria-hidden="true"/><span className="font-semibold leading-6">{item}</span></div>)}</div></div> : null}

            <div className="mt-10 rounded-[2rem] bg-rb-900 p-6 text-white sm:p-8"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 shrink-0 text-gold" aria-hidden="true"/><div><p className="text-xs font-black uppercase tracking-[.18em] text-gold">How impact is shown</p><h2 className="mt-2 text-2xl font-black">Campaigns, stories, gallery evidence and reports bring this cause to life.</h2><p className="mt-4 leading-7 text-white/65">The cause defines the mission area. Published initiatives and verified reporting show the activity around it.</p></div></div></div>
          </article>

          <aside className="h-fit rounded-[2rem] bg-[#fff1dd] p-6 shadow-sm lg:sticky lg:top-28 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Support this cause</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.035em] text-rb-900">Turn care into action.</h2>
            <p className="mt-4 leading-7 text-slate-700">Support an active campaign attached to this cause, or contribute to the foundation's general fund.</p>
            {activeCampaigns.length ? <Link to={`/campaigns/${activeCampaigns[0].slug}`} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-rb-900 px-5 py-3.5 font-black text-white transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40">Support active campaign <ArrowRight size={17} aria-hidden="true" /></Link> : <Link to="/donate" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-rb-900 px-5 py-3.5 font-black text-white transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40">Donate to foundation <ArrowRight size={17} aria-hidden="true" /></Link>}
          </aside>
        </div>

        <div className="mx-auto mt-20 w-full max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Related initiatives</p><h2 className="mt-3 text-3xl font-black tracking-[-.04em] text-rb-900 sm:text-5xl">Campaigns connected to this cause.</h2></div><Link to="/campaigns" className="inline-flex w-fit items-center gap-2 font-black text-rb-700">View all campaigns <ArrowRight size={17} aria-hidden="true"/></Link></div>
          {campaigns.length ? <div className="mt-9 grid gap-6 md:grid-cols-2">{campaigns.map((campaign, index) => <Link key={campaign._id || campaign.slug} to={`/campaigns/${campaign.slug}`} className="group overflow-hidden rounded-[2rem] border border-rb-100 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"><div className="relative aspect-[16/9] overflow-hidden"><img src={campaign.coverImage || charityFallback('campaigns', index)} alt={campaign.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" decoding="async"/><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black uppercase tracking-[.14em] text-rb-800">{campaign.status}</span></div><div className="p-6 sm:p-7"><h3 className="text-2xl font-black text-rb-900">{campaign.title}</h3><p className="mt-3 line-clamp-3 leading-7 text-slate-600">{campaign.summary || campaign.description}</p><span className="mt-6 inline-flex items-center gap-2 font-black text-rb-700 transition group-hover:gap-3">Campaign details <ArrowRight size={17} aria-hidden="true"/></span></div></Link>)}</div> : <div className="mt-9 rounded-[2rem] border border-dashed border-rb-200 bg-white p-8 text-slate-600">No public campaign is currently attached to this cause.</div>}
        </div>
      </section>
    </main>
  )
}
