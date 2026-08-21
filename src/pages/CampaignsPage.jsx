import { ArrowRight, ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageSkeleton } from '../components/system/SystemUI'

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

  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rb-700">Campaigns</span>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-rb-900 sm:text-5xl">Verified initiatives with clear goals and reporting.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Active and completed campaigns published by the foundation appear here automatically.</p>
        </div>

        {state.loading ? (
          <div className="mt-12"><PageSkeleton cards={6} /></div>
        ) : state.items.length ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {state.items.map(campaign => {
              const progress = campaign.goalAmount ? Math.min(100, Math.round((Number(campaign.raisedAmount || 0) / Number(campaign.goalAmount)) * 100)) : 0
              const causeName = campaign.cause?.name || 'Foundation campaign'
              return (
                <article key={campaign._id || campaign.slug} className="overflow-hidden rounded-[2rem] border border-rb-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {campaign.coverImage ? <img src={campaign.coverImage} alt={campaign.title} className="h-56 w-full object-cover" /> : <div className="grid h-56 place-items-center bg-rb-50 text-rb-400"><ImageIcon size={38} /></div>}
                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-rb-700">{causeName}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${campaign.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{campaign.status}</span>
                    </div>
                    <h2 className="mt-5 text-2xl font-black text-rb-900">{campaign.title}</h2>
                    <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{campaign.summary || campaign.description || 'View this campaign for more information.'}</p>
                    <div className="mt-7">
                      <div className="flex flex-wrap justify-between gap-2 text-sm font-bold text-slate-600"><span>{formatCurrency(campaign.raisedAmount)} raised</span><span>{formatCurrency(campaign.goalAmount)} goal</span></div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-rb-50"><div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} /></div>
                      <p className="mt-2 text-xs font-bold text-slate-400">{progress}% funded</p>
                    </div>
                    <Link to={`/campaigns/${campaign.slug}`} className="mt-7 inline-flex items-center gap-2 font-black text-rb-700 transition hover:gap-3">View campaign <ArrowRight size={17} /></Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-[2rem] border border-dashed border-rb-200 bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-rb-900">{state.error ? 'Unable to load campaigns' : 'No campaigns published yet'}</h2>
            <p className="mt-3 text-slate-600">{state.error || 'Active and completed campaigns from Admin will appear here automatically.'}</p>
          </div>
        )}
      </div>
    </main>
  )
}
