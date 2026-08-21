import { ArrowRight, BookOpen, CheckCircle2, HandHeart, Heart, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FloatingActions, SiteFooter, SiteHeader } from './components/SiteLayout'

const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'
const eyebrow = 'inline-flex items-center gap-2 rounded-full border border-rb-100 bg-rb-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-rb-700 transition duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white hover:shadow-sm'
const sectionTitle = 'mt-4 max-w-3xl text-3xl font-black tracking-[-0.04em] text-rb-900 sm:text-4xl lg:text-5xl'
const sectionCopy = 'mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'
const formatMoney = value => `₹${Number(value || 0).toLocaleString('en-IN')}`

function App() {
  const [causeState, setCauseState] = useState({ loading: true, items: [], error: false })
  const [storyState, setStoryState] = useState({ loading: true, items: [], error: false })
  const [impactState, setImpactState] = useState({ loading: true, summary: null })

  useEffect(() => {
    let active = true

    Promise.allSettled([
      fetch('/api/causes').then(async response => {
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Unable to load causes')
        return (data.data || []).slice(0, 6)
      }),
      fetch('/api/public/stories').then(async response => {
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Unable to load stories')
        return (data.items || []).slice(0, 3)
      }),
      fetch('/api/public/impact-summary').then(async response => {
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Unable to load impact summary')
        return data.summary || null
      })
    ]).then(([causes, stories, impact]) => {
      if (!active) return
      setCauseState(causes.status === 'fulfilled'
        ? { loading: false, items: causes.value, error: false }
        : { loading: false, items: [], error: true })
      setStoryState(stories.status === 'fulfilled'
        ? { loading: false, items: stories.value, error: false }
        : { loading: false, items: [], error: true })
      setImpactState({ loading: false, summary: impact.status === 'fulfilled' ? impact.value : null })
    })

    return () => { active = false }
  }, [])

  const impactMetrics = impactState.summary ? [
    ['Verified funds raised', formatMoney(impactState.summary.totalRaised)],
    ['Supporters recorded', Number(impactState.summary.donors || 0).toLocaleString('en-IN')],
    ['Active/completed campaigns', Number(impactState.summary.campaigns || 0).toLocaleString('en-IN')],
    ['Approved volunteers', Number(impactState.summary.volunteers || 0).toLocaleString('en-IN')]
  ] : []

  return (
    <main className="overflow-hidden bg-[#f8fbff] text-slate-900">
      <SiteHeader />

      <section id="home" className="relative min-h-screen bg-rb-900 pt-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(242,162,58,.26),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(55,105,166,.62),transparent_38%)]" />
        <div className={`${shell} relative grid min-h-[calc(100vh-6rem)] items-center gap-14 py-20 lg:grid-cols-[1.15fr_.85fr]`}>
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">Profits with purpose</span>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl lg:text-7xl">Turning business success into <span className="text-gold">human impact.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">RB Charity Foundation channels support from the wider RB group and public donors into meaningful social initiatives across food, education, healthcare and community welfare.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/donate" className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-black text-rb-900 transition hover:-translate-y-1">Make a difference <ArrowRight size={18} /></Link>
              <Link to="/causes" className="rounded-full border border-white/20 px-6 py-3.5 font-bold text-white transition hover:-translate-y-1 hover:bg-white/10">Explore our work</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-[2.2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.7rem] bg-white p-6 text-rb-900">
                <span className="text-xs font-black uppercase tracking-[.18em] text-rb-600">How RB creates impact</span>
                <div className="mt-6 space-y-3">{['RB Group businesses grow','A share of success supports the foundation','Public donors can join the mission','Resources reach verified social initiatives'].map((item,index)=><div key={item} className="group flex items-center gap-4 rounded-2xl bg-rb-50 p-4 transition hover:translate-x-1 hover:bg-white hover:shadow-md"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rb-800 text-sm font-black text-white">{index+1}</span><p className="font-bold">{item}</p></div>)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 sm:py-32">
        <div className={`${shell} grid gap-14 lg:grid-cols-2 lg:items-center`}>
          <div><span className={eyebrow}>Our foundation</span><h2 className={sectionTitle}>A charitable arm built around responsibility, dignity and action.</h2><p className={sectionCopy}>RB Charity Foundation exists to convert commercial growth into positive social outcomes. Alongside contributions connected to RB businesses, the platform gives individuals and partners a clear way to support causes they believe in.</p><Link to="/about" className="mt-6 inline-flex items-center gap-2 font-black text-rb-700">Learn about us <ArrowRight size={17}/></Link></div>
          <div className="grid gap-4 sm:grid-cols-2">{[['Business-backed giving','A sustainable model that connects business performance with community responsibility.'],['Public participation','Supporters can contribute directly to the foundation or to specific campaigns.'],['Transparent impact','Campaign updates and reporting are designed to show where support goes.'],['Long-term thinking','We focus on meaningful, repeatable initiatives rather than one-time visibility.']].map(([title,copy])=><article key={title} className="group rounded-3xl border border-rb-100 bg-white p-6 shadow-soft transition hover:-translate-y-1.5 hover:border-gold/35 hover:shadow-xl"><CheckCircle2 className="text-rb-600"/><h3 className="mt-5 text-xl font-black text-rb-900">{title}</h3><p className="mt-3 leading-7 text-slate-600">{copy}</p></article>)}</div>
        </div>
      </section>

      <section id="causes" className="bg-rb-50 py-24 sm:py-32">
        <div className={shell}>
          <span className={eyebrow}>Our causes</span><h2 className={sectionTitle}>Focused areas where support can create lasting change.</h2><p className={sectionCopy}>Published focus areas from the foundation appear here automatically.</p>
          {causeState.loading ? <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-56 animate-pulse rounded-[2rem] border border-rb-100 bg-white"/>)}</div> : causeState.items.length ? <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{causeState.items.map((cause,i)=><Link to={`/causes/${cause.slug}`} key={cause._id||cause.slug} className="group rounded-[2rem] border border-rb-100 bg-white p-7 transition hover:-translate-y-2 hover:border-gold/35 hover:shadow-xl"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-rb-800 font-black text-white">{String(i+1).padStart(2,'0')}</div><h3 className="mt-6 text-2xl font-black text-rb-900">{cause.name}</h3><p className="mt-3 leading-7 text-slate-600">{cause.summary||cause.description||'Learn more about this foundation cause.'}</p></Link>)}</div> : <div className="mt-12 rounded-[2rem] border border-dashed border-rb-200 bg-white p-8 text-center"><h3 className="text-xl font-black text-rb-900">{causeState.error?'Unable to load causes':'No published causes yet'}</h3><p className="mt-2 text-slate-600">{causeState.error?'Please try again once the API is available.':'Published causes from Admin will appear here automatically.'}</p></div>}
          <Link to="/causes" className="mt-8 inline-flex items-center gap-2 rounded-full bg-rb-900 px-5 py-3 font-black text-white">View all causes <ArrowRight size={17}/></Link>
        </div>
      </section>

      <section id="impact" className="py-24 sm:py-32">
        <div className={shell}>
          <div className="rounded-[2.5rem] bg-rb-900 p-7 text-white shadow-xl sm:p-10 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div><span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-gold">Transparency first</span><h2 className="mt-5 text-4xl font-black tracking-[-.04em] sm:text-5xl">Every contribution should have a story you can follow.</h2><p className="mt-5 leading-8 text-white/70">Verified donation, donor, campaign and volunteer data now powers the public impact summary instead of decorative numbers.</p><Link to="/impact" className="mt-6 inline-flex items-center gap-2 font-black text-gold">Explore impact <ArrowRight size={17}/></Link></div>
              {impactState.loading ? <div className="grid gap-4 sm:grid-cols-2">{Array.from({length:4}).map((_,i)=><div key={i} className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/10"/>)}</div> : impactMetrics.length ? <div className="grid gap-4 sm:grid-cols-2">{impactMetrics.map(([title,value])=><div key={title} className="group rounded-3xl border border-white/10 bg-white/10 p-6 transition hover:-translate-y-1 hover:bg-white/[.14]"><ShieldCheck className="text-gold"/><p className="mt-4 break-words text-2xl font-black">{value}</p><h3 className="mt-2 text-sm font-bold text-white/65">{title}</h3></div>)}</div> : <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-white/70">Verified impact totals are not available right now.</div>}
            </div>
          </div>
        </div>
      </section>

      <section id="stories" className="py-24 sm:py-32">
        <div className={shell}>
          <span className={eyebrow}>Stories of change</span><h2 className={sectionTitle}>The people behind every campaign matter more than the numbers.</h2><p className={sectionCopy}>Published stories from the foundation appear here automatically.</p>
          {storyState.loading ? <div className="mt-10 grid gap-6 lg:grid-cols-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-[390px] animate-pulse rounded-[2rem] border border-rb-100 bg-white"/>)}</div> : storyState.items.length ? <div className="mt-10 grid gap-6 lg:grid-cols-3">{storyState.items.map(story=><Link key={story._id||story.slug} to={`/stories/${story.slug}`} className="group overflow-hidden rounded-[2rem] border border-rb-100 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl">{story.coverImage?<img src={story.coverImage} alt={story.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"/>:<div className="grid h-56 place-items-center bg-rb-50 text-rb-400"><BookOpen size={38}/></div>}<div className="p-6"><p className="text-xs font-black uppercase tracking-[.16em] text-rb-600">{story.category||'Foundation update'}</p><h3 className="mt-3 text-2xl font-black text-rb-900">{story.title}</h3><p className="mt-3 line-clamp-3 leading-7 text-slate-600">{story.excerpt}</p><span className="mt-5 inline-flex items-center gap-2 font-black text-rb-700">Read story <ArrowRight size={17}/></span></div></Link>)}</div> : <div className="mt-10 rounded-[2rem] border border-dashed border-rb-200 bg-white p-8 text-center"><BookOpen className="mx-auto text-rb-500"/><h3 className="mt-4 text-xl font-black text-rb-900">{storyState.error?'Unable to load stories':'No published stories yet'}</h3><p className="mt-2 text-slate-600">{storyState.error?'Please try again once the API is available.':'Published stories from Admin will appear here automatically.'}</p></div>}
          <Link to="/stories" className="mt-8 inline-flex items-center gap-2 font-black text-rb-700">View all stories <ArrowRight size={17}/></Link>
        </div>
      </section>

      <section id="volunteer" className="bg-[#fff1dd] py-24 sm:py-28"><div className={`${shell} grid gap-6 lg:grid-cols-3`}>{[[HandHeart,'Volunteer','Give your time and skills to field initiatives and community drives.','/volunteer'],[Users,'Partner','Collaborate as a company, institution, NGO or community partner.','/partner'],[Heart,'Donate','Support the general foundation fund or choose a specific verified campaign.','/donate']].map(([Icon,title,copy,path])=><Link to={path} key={title} className="group rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/60 hover:shadow-lg"><Icon size={34} className="text-rb-700"/><h3 className="mt-5 text-3xl font-black text-rb-900">{title}</h3><p className="mt-3 leading-7 text-slate-700">{copy}</p></Link>)}</div></section>

      <SiteFooter />
      <FloatingActions />
    </main>
  )
}

export default App
