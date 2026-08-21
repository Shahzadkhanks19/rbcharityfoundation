import { Link } from 'react-router-dom'
import { impactMetrics, transparencySteps } from '../data/contentSeed'
import usePublicContent, { cmsValue } from '../hooks/usePublicContent'

const shell='mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'

export default function CmsImpactPage(){
  const {content}=usePublicContent()
  const heroTitle=cmsValue(content,'impact.hero.title','From contribution to documented change.')
  const heroCopy=cmsValue(content,'impact.hero.copy','The impact module connects cause areas, campaigns, field activity and public reporting into one clear story.')
  const pathwayTitle=cmsValue(content,'impact.pathway.title','Impact pathway')
  const pathwayCopy=cmsValue(content,'impact.pathway.copy','Support moves through a documented process from contribution to allocation, field work and reporting.')
  return <main className="bg-[#f8fbff]">
    <section className="bg-rb-900 py-20 text-white"><div className={shell}><p className="text-xs font-black uppercase tracking-[.18em] text-gold">Impact</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-.04em] sm:text-5xl lg:text-6xl">{heroTitle}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">{heroCopy}</p></div></section>
    <section className="py-16 sm:py-20"><div className={shell}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{impactMetrics.map(item=><article key={item.label} className="rounded-[2rem] border border-rb-100 bg-white p-6 shadow-sm"><p className="text-3xl font-black text-rb-900">{item.value}</p><h2 className="mt-3 font-black text-rb-900">{item.label}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p></article>)}</div><div className="mt-12 rounded-[2.5rem] bg-rb-900 p-7 text-white sm:p-10"><h2 className="text-3xl font-black">{pathwayTitle}</h2><p className="mt-3 max-w-3xl leading-7 text-white/65">{pathwayCopy}</p><div className="mt-7 grid gap-4 lg:grid-cols-4">{transparencySteps.map(([n,title,copy])=><div key={n} className="rounded-3xl border border-white/10 bg-white/10 p-5"><span className="text-sm font-black text-gold">{n}</span><h3 className="mt-3 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{copy}</p></div>)}</div><div className="mt-7 flex flex-wrap gap-3"><Link to="/transparency" className="rounded-full bg-gold px-5 py-3 font-black text-rb-900">View transparency</Link><Link to="/reports" className="rounded-full border border-white/20 px-5 py-3 font-black text-white">Reports</Link></div></div></div></section>
  </main>
}
