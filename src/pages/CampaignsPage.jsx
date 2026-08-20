import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { campaignsSeed } from '../data/foundationSeed'

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export default function CampaignsPage() {
  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rb-700">Campaigns</span>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-rb-900 sm:text-5xl">Verified initiatives with clear goals and reporting.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Campaigns are designed to show the purpose, funding target, allocation plan and progress updates in one place.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {campaignsSeed.map((campaign) => {
            const progress = campaign.goalAmount ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)) : 0
            return (
              <article key={campaign.slug} className="rounded-[2rem] border border-rb-100 bg-white p-7 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-rb-700">{campaign.causeName}</span>
                  <span className="text-xs font-black uppercase text-slate-400">{campaign.status}</span>
                </div>
                <h2 className="mt-5 text-2xl font-black text-rb-900">{campaign.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{campaign.summary}</p>

                <div className="mt-7">
                  <div className="flex justify-between gap-4 text-sm font-bold text-slate-600"><span>{formatCurrency(campaign.raisedAmount)} raised</span><span>{formatCurrency(campaign.goalAmount)} goal</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-rb-50"><div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} /></div>
                  <p className="mt-2 text-xs font-bold text-slate-400">{progress}% funded</p>
                </div>

                <Link to={`/campaigns/${campaign.slug}`} className="mt-7 inline-flex items-center gap-2 font-black text-rb-700">View campaign <ArrowRight size={17} /></Link>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
