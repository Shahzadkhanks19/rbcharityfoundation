import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { campaignsSeed, causesSeed } from '../data/foundationSeed'

export default function CauseDetailsPage() {
  const { slug } = useParams()
  const cause = causesSeed.find((item) => item.slug === slug)

  if (!cause) {
    return (
      <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32">
        <div className="mx-auto max-w-4xl rounded-3xl border border-rb-100 bg-white p-8">
          <h1 className="text-3xl font-black text-rb-900">Cause not found</h1>
          <Link to="/causes" className="mt-5 inline-flex items-center gap-2 font-black text-rb-700"><ArrowLeft size={17} /> Back to causes</Link>
        </div>
      </main>
    )
  }

  const relatedCampaigns = campaignsSeed.filter((campaign) => campaign.causeSlug === cause.slug)

  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Link to="/causes" className="inline-flex items-center gap-2 text-sm font-black text-rb-700"><ArrowLeft size={16} /> All causes</Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rb-700">Cause</span>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-rb-900 sm:text-6xl">{cause.name}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{cause.description}</p>

            <div className="mt-10 rounded-[2rem] border border-rb-100 bg-white p-7">
              <h2 className="text-2xl font-black text-rb-900">Focus areas</h2>
              <div className="mt-5 space-y-4">
                {cause.focusAreas.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-700"><CheckCircle2 size={20} className="text-rb-600" /> <span>{item}</span></div>
                ))}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] bg-rb-900 p-7 text-white lg:sticky lg:top-32">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">Support this cause</p>
            <h2 className="mt-4 text-3xl font-black">Contribute through a verified campaign.</h2>
            <p className="mt-4 leading-7 text-white/70">Donations will be linked to verified campaigns or the general foundation fund so allocations can be tracked clearly.</p>
            <Link to="/donate" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-black text-rb-900">Donate <ArrowRight size={17} /></Link>
          </aside>
        </div>

        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-rb-700">Campaigns</p>
              <h2 className="mt-2 text-3xl font-black text-rb-900">Related initiatives</h2>
            </div>
            <Link to="/campaigns" className="font-black text-rb-700">View all campaigns</Link>
          </div>

          {relatedCampaigns.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {relatedCampaigns.map((campaign) => (
                <article key={campaign.slug} className="rounded-[2rem] border border-rb-100 bg-white p-7">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-rb-600">{campaign.status}</p>
                  <h3 className="mt-3 text-2xl font-black text-rb-900">{campaign.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{campaign.summary}</p>
                  <Link to={`/campaigns/${campaign.slug}`} className="mt-6 inline-flex items-center gap-2 font-black text-rb-700">Campaign details <ArrowRight size={17} /></Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-[2rem] border border-dashed border-rb-100 bg-white p-7 text-slate-600">No public campaign is currently attached to this cause.</div>
          )}
        </section>
      </div>
    </main>
  )
}
