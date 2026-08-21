import { ArrowLeft, CalendarDays, CheckCircle2, ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageSkeleton } from '../components/system/SystemUI'

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
    return <main className="min-h-screen bg-[#f8fbff] px-5 py-20"><div className="mx-auto max-w-4xl rounded-3xl border border-rb-100 bg-white p-8"><h1 className="text-3xl font-black text-rb-900">Campaign not found</h1><p className="mt-3 text-slate-600">{state.error}</p><Link to="/campaigns" className="mt-5 inline-flex items-center gap-2 font-black text-rb-700"><ArrowLeft size={17} /> Back to campaigns</Link></div></main>
  }

  const progress = campaign.goalAmount ? Math.min(100, Math.round((Number(campaign.raisedAmount || 0) / Number(campaign.goalAmount)) * 100)) : 0
  const cause = campaign.cause
  const acceptingDonations = campaign.status === 'active'
  const hasDates = campaign.startsAt || campaign.endsAt

  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Link to="/campaigns" className="inline-flex items-center gap-2 text-sm font-black text-rb-700"><ArrowLeft size={16} /> All campaigns</Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <section className="min-w-0">
            {campaign.coverImage ? <img src={campaign.coverImage} alt={campaign.title} className="mb-8 max-h-[520px] w-full rounded-[2rem] object-cover shadow-sm" /> : <div className="mb-8 grid h-72 place-items-center rounded-[2rem] bg-rb-50 text-rb-400"><ImageIcon size={44} /></div>}
            <div className="flex flex-wrap gap-3">
              {cause?.slug ? <Link to={`/causes/${cause.slug}`} className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-rb-700">{cause.name}</Link> : <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-rb-700">Foundation campaign</span>}
              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${acceptingDonations ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{campaign.status}</span>
            </div>
            <h1 className="mt-5 break-words text-4xl font-black tracking-[-0.04em] text-rb-900 sm:text-6xl">{campaign.title}</h1>
            {campaign.summary && <p className="mt-5 text-xl font-semibold leading-8 text-rb-800">{campaign.summary}</p>}
            {campaign.description && <div className="mt-6 whitespace-pre-wrap text-lg leading-8 text-slate-600">{campaign.description}</div>}

            {hasDates && <div className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-rb-100 bg-white p-4 text-sm font-bold text-slate-600">{campaign.startsAt && <span className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-rb-600" /> Starts {formatDate(campaign.startsAt)}</span>}{campaign.endsAt && <span className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-rb-600" /> Ends {formatDate(campaign.endsAt)}</span>}</div>}

            <div className="mt-10 rounded-[2rem] border border-rb-100 bg-white p-7">
              <h2 className="text-2xl font-black text-rb-900">Transparency and reporting</h2>
              <div className="mt-5 space-y-4">
                {['Verified successful donations update the campaign total automatically.','Campaign status and funding progress are controlled through the foundation admin panel.','Field evidence, stories, gallery media and reports can document outcomes as they are verified.'].map(item => <div key={item} className="flex items-start gap-3 text-slate-700"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-rb-600" /><span>{item}</span></div>)}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] bg-rb-900 p-7 text-white lg:sticky lg:top-32">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">Campaign progress</p>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-3xl font-black">{formatCurrency(campaign.raisedAmount)}</p><p className="mt-1 text-sm text-white/60">raised</p></div><div className="text-right"><p className="text-lg font-black">{formatCurrency(campaign.goalAmount)}</p><p className="mt-1 text-sm text-white/60">goal</p></div></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} /></div>
            <p className="mt-3 text-sm font-bold text-white/60">{progress}% funded</p>
            {acceptingDonations ? <Link to={`/donate?campaign=${encodeURIComponent(campaign.slug)}`} className="mt-7 flex w-full justify-center rounded-full bg-gold px-5 py-3 font-black text-rb-900 transition hover:-translate-y-0.5">Donate to this campaign</Link> : <div className="mt-7 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold text-white/70">This campaign is completed and is no longer accepting new donations.</div>}
            <p className="mt-4 text-xs leading-5 text-white/50">A contribution is counted only after secure server-side payment verification.</p>
          </aside>
        </div>
      </div>
    </main>
  )
}
