import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { campaignsSeed } from '../data/foundationSeed'

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export default function CampaignDetailsPage() {
  const { slug } = useParams()
  const campaign = campaignsSeed.find((item) => item.slug === slug)

  if (!campaign) {
    return (
      <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32">
        <div className="mx-auto max-w-4xl rounded-3xl border border-rb-100 bg-white p-8">
          <h1 className="text-3xl font-black text-rb-900">Campaign not found</h1>
          <Link to="/campaigns" className="mt-5 inline-flex items-center gap-2 font-black text-rb-700"><ArrowLeft size={17} /> Back to campaigns</Link>
        </div>
      </main>
    )
  }

  const progress = campaign.goalAmount ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)) : 0

  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Link to="/campaigns" className="inline-flex items-center gap-2 text-sm font-black text-rb-700"><ArrowLeft size={16} /> All campaigns</Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <div className="flex flex-wrap gap-3">
              <Link to={`/causes/${campaign.causeSlug}`} className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-rb-700">{campaign.causeName}</Link>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-orange-700">{campaign.status}</span>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-rb-900 sm:text-6xl">{campaign.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">{campaign.description}</p>

            <div className="mt-10 rounded-[2rem] border border-rb-100 bg-white p-7">
              <h2 className="text-2xl font-black text-rb-900">Allocation plan</h2>
              <p className="mt-3 leading-7 text-slate-600">Before a campaign accepts live payments, its intended allocation and verification process should be documented here.</p>
              <div className="mt-5 space-y-4">
                {campaign.allocationPlan.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-700"><CheckCircle2 size={20} className="text-rb-600" /> <span>{item}</span></div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-rb-100 bg-white p-7">
              <h2 className="text-2xl font-black text-rb-900">Campaign updates</h2>
              {campaign.updates.length ? (
                <div className="mt-5 space-y-4">{campaign.updates.map((update) => <article key={update.title}><h3 className="font-black text-rb-900">{update.title}</h3><p className="mt-2 text-slate-600">{update.copy}</p></article>)}</div>
              ) : (
                <p className="mt-3 leading-7 text-slate-600">Verified field updates, milestones, photographs and allocation notes will appear here as the campaign progresses.</p>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] bg-rb-900 p-7 text-white lg:sticky lg:top-32">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">Campaign progress</p>
            <div className="mt-6 flex items-end justify-between gap-4"><div><p className="text-3xl font-black">{formatCurrency(campaign.raisedAmount)}</p><p className="mt-1 text-sm text-white/60">raised</p></div><div className="text-right"><p className="text-lg font-black">{formatCurrency(campaign.goalAmount)}</p><p className="mt-1 text-sm text-white/60">goal</p></div></div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gold" style={{ width: `${progress}%` }} /></div>
            <p className="mt-3 text-sm font-bold text-white/60">{progress}% funded</p>
            <Link to={`/donate?campaign=${campaign.slug}`} className="mt-7 flex w-full justify-center rounded-full bg-gold px-5 py-3 font-black text-rb-900">Donate to this campaign</Link>
            <p className="mt-4 text-xs leading-5 text-white/50">Live payment collection remains disabled until verified foundation payment and compliance details are configured.</p>
          </aside>
        </div>
      </div>
    </main>
  )
}
