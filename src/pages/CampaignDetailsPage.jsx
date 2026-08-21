import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Heart, ImageIcon, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageSkeleton } from '../components/system/SystemUI'
import { charityMedia } from '../data/charityMedia'

const formatCurrency = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0))
const formatDate = value => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export default function CampaignDetailsPage() {
  const { slug } = useParams()
  const [state, setState] = useState({ loading: true, campaign: null, error: '' })

  useEffect(() => {
    let active = true
    fetch(`/api/campaigns/${encodeURIComponent(slug)}`)
      .then(async response => {
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Campaign not found.')
        if (active) setState({ loading: false, campaign: data.data, error: '' })
      })
      .catch(error => {
        if (active) setState({ loading: false, campaign: null, error: error.message || 'Campaign not found.' })
      })
    return () => { active = false }
  }, [slug])

  if (state.loading) return <main className="min-h-screen bg-[#f8fbff] px-5 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><PageSkeleton cards={4} /></div></main>

  const campaign = state.campaign
  if (!campaign) {
    return <main className="min-h-screen bg-[#f8fbff] px-5 py-20"><div className="mx-auto max-w-4xl rounded-[2rem] border border-rb-100 bg-white p-8 shadow-sm"><h1 className="text-3xl font-black text-rb-900">Campaign not found</h1><p className="mt-3 text-slate-600">{state.error}</p><Link to="/campaigns" className="mt-5 inline-flex items-center gap-2 font-black text-rb-700"><ArrowLeft size={17} /> Back to campaigns</Link></div></main>
  }

  const progress = campaign.goalAmount ? Math.min(100, Math.round((Number(campaign.raisedAmount || 0) / Number(campaign.goalAmount)) * 100)) : 0
  const cause = campaign.cause
  const acceptingDonations = campaign.status === 'active'
  const hasDates = campaign.startsAt || campaign.endsAt
  const heroImage = campaign.coverImage || charityMedia.campaigns[1]

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-slate-900">
      <section className="relative isolate min-h-[620px] overflow-hidden bg-rb-900 text-white">
        <img src={heroImage} alt={campaign.title} className="absolute inset-0 h-full w-full object-cover opacity-55" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,61,.97)_0%,rgba(8,31,61,.87)_46%,rgba(8,31,61,.28)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-rb-900/50 via-transparent to-transparent" />
        <div className="relative mx-auto flex min-h-[620px] w-full max-w-7xl flex-col justify-between px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link to="/campaigns" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"><ArrowLeft size={16} aria-hidden="true" /> All campaigns</Link>
          <div className="grid gap-10 pb-6 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-3">
                {cause?.slug ? <Link to={`/causes/${cause.slug}`} className="rounded-full bg-gold px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-rb-900">{cause.name}</Link> : <span className="rounded-full bg-gold px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-rb-900">Foundation campaign</span>}
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-white backdrop-blur">{campaign.status}</span>
              </div>
              <h1 className="mt-6 max-w-4xl break-words text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">{campaign.title}</h1>
              {campaign.summary && <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-white/75 sm:text-xl">{campaign.summary}</p>}
            </div>
            <div className="lg:justify-self-end">
              <div className="max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[.18em] text-gold">Campaign progress</p>
                <div className="mt-5 flex items-end justify-between gap-4"><div><p className="text-3xl font-black">{formatCurrency(campaign.raisedAmount)}</p><p className="text-sm text-white/55">raised</p></div><div className="text-right"><p className="text-lg font-black">{formatCurrency(campaign.goalAmount)}</p><p className="text-sm text-white/55">goal</p></div></div>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} /></div>
                <p className="mt-2 text-sm font-black text-gold">{progress}% funded</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 z-10 pb-24 sm:-mt-12 sm:pb-32">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <article className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-xl shadow-rb-900/5 sm:p-9 lg:p-12">
            <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Why this campaign matters</p>
            {campaign.description ? <div className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-600 sm:text-lg">{campaign.description}</div> : <p className="mt-5 text-lg leading-8 text-slate-600">This initiative is part of RB Charity Foundation's verified programme of community support.</p>}

            {hasDates && <div className="mt-8 grid gap-3 rounded-3xl bg-rb-50 p-5 sm:grid-cols-2">{campaign.startsAt && <div className="rounded-2xl bg-white p-4"><CalendarDays size={18} className="text-rb-600" aria-hidden="true"/><p className="mt-3 text-xs font-black uppercase tracking-[.15em] text-slate-400">Starts</p><p className="mt-1 font-black text-rb-900">{formatDate(campaign.startsAt)}</p></div>}{campaign.endsAt && <div className="rounded-2xl bg-white p-4"><CalendarDays size={18} className="text-rb-600" aria-hidden="true"/><p className="mt-3 text-xs font-black uppercase tracking-[.15em] text-slate-400">Ends</p><p className="mt-1 font-black text-rb-900">{formatDate(campaign.endsAt)}</p></div>}</div>}

            <div className="mt-10 rounded-[2rem] bg-rb-900 p-6 text-white sm:p-8">
              <div className="flex items-start gap-4"><ShieldCheck className="mt-1 shrink-0 text-gold" aria-hidden="true"/><div><p className="text-xs font-black uppercase tracking-[.18em] text-gold">Transparency built in</p><h2 className="mt-2 text-2xl font-black">Every rupee shown here is tied to verified payment activity.</h2></div></div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">{['Successful donations update the total automatically.','Campaign status is controlled through the foundation admin panel.','Stories, media and reports can document verified outcomes.'].map(item => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/70"><CheckCircle2 size={18} className="mb-3 text-gold" aria-hidden="true" />{item}</div>)}</div>
            </div>
          </article>

          <aside className="h-fit rounded-[2rem] bg-[#fff1dd] p-6 shadow-sm lg:sticky lg:top-28 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Take part</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.035em] text-rb-900">Help move this campaign forward.</h2>
            <p className="mt-4 leading-7 text-slate-700">Choose this campaign at checkout and your verified contribution will be counted toward its progress.</p>
            {acceptingDonations ? <Link to={`/donate?campaign=${encodeURIComponent(campaign.slug)}`} className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-rb-900 px-5 py-3.5 font-black text-white transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40">Donate to this campaign <Heart size={17} fill="currentColor" aria-hidden="true" /></Link> : <div className="mt-7 rounded-2xl border border-rb-900/10 bg-white/65 p-4 text-sm font-bold text-rb-800">This campaign is no longer accepting new donations.</div>}
            <Link to="/campaigns" className="mt-4 inline-flex items-center gap-2 font-black text-rb-700">Discover more campaigns <ArrowRight size={17} aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>
    </main>
  )
}
