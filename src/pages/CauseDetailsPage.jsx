import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

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
    return (
      <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl animate-pulse">
          <div className="h-5 w-28 rounded bg-rb-100" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="h-8 w-24 rounded-full bg-rb-100" />
              <div className="mt-5 h-14 max-w-2xl rounded-2xl bg-rb-100" />
              <div className="mt-6 h-28 max-w-3xl rounded-2xl bg-rb-50" />
              <div className="mt-10 h-56 rounded-[2rem] bg-white" />
            </div>
            <div className="h-72 rounded-[2rem] bg-rb-900/10" />
          </div>
        </div>
      </main>
    )
  }

  if (!cause) {
    return (
      <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32">
        <div className="mx-auto max-w-4xl rounded-3xl border border-rb-100 bg-white p-8">
          <h1 className="text-3xl font-black text-rb-900">Cause not found</h1>
          <p className="mt-3 text-slate-600">{error || 'This cause is unavailable or is no longer published.'}</p>
          <Link to="/causes" className="mt-5 inline-flex items-center gap-2 font-black text-rb-700"><ArrowLeft size={17} /> Back to causes</Link>
        </div>
      </main>
    )
  }

  const focusAreas = Array.isArray(cause.focusAreas) ? cause.focusAreas : []
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'active')

  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Link to="/causes" className="inline-flex items-center gap-2 text-sm font-black text-rb-700"><ArrowLeft size={16} /> All causes</Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            {cause.image ? <img src={cause.image} alt="" className="mb-8 aspect-[16/8] w-full rounded-[2rem] object-cover" /> : null}
            <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rb-700">Cause</span>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-rb-900 sm:text-6xl">{cause.name}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{cause.description}</p>

            {focusAreas.length ? (
              <div className="mt-10 rounded-[2rem] border border-rb-100 bg-white p-7">
                <h2 className="text-2xl font-black text-rb-900">Focus areas</h2>
                <div className="mt-5 space-y-4">
                  {focusAreas.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-slate-700"><CheckCircle2 size={20} className="text-rb-600" /> <span>{item}</span></div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <aside className="h-fit rounded-[2rem] bg-rb-900 p-7 text-white lg:sticky lg:top-32">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">Support this cause</p>
            <h2 className="mt-4 text-3xl font-black">Contribute through a verified campaign.</h2>
            <p className="mt-4 leading-7 text-white/70">Donations can support an active campaign connected to this cause or the foundation's general fund.</p>
            {activeCampaigns.length ? (
              <Link to={`/campaigns/${activeCampaigns[0].slug}`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-black text-rb-900">Support active campaign <ArrowRight size={17} /></Link>
            ) : (
              <Link to="/donate" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-black text-rb-900">Donate to foundation <ArrowRight size={17} /></Link>
            )}
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

          {campaigns.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {campaigns.map((campaign) => (
                <article key={campaign._id || campaign.slug} className="overflow-hidden rounded-[2rem] border border-rb-100 bg-white">
                  {campaign.coverImage ? <img src={campaign.coverImage} alt="" className="aspect-[16/8] w-full object-cover" /> : null}
                  <div className="p-7">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-rb-600">{campaign.status}</p>
                    <h3 className="mt-3 text-2xl font-black text-rb-900">{campaign.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{campaign.summary}</p>
                    <Link to={`/campaigns/${campaign.slug}`} className="mt-6 inline-flex items-center gap-2 font-black text-rb-700">Campaign details <ArrowRight size={17} /></Link>
                  </div>
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
