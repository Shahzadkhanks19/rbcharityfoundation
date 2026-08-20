import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LEGACY_IMAGE_BASE } from '../components/SiteLayout'

const shell='mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'
const legacyImages=['DSC00592.JPG','DSC00661.JPG','DSC00888.JPG','DSC00902.JPG','DSC01084.JPG','DSC01089.JPG','DSC01114.JPG','DSC01126.JPG']

export default function ModulePage({title,description,modules=[],bare=false}){
  const image=LEGACY_IMAGE_BASE+legacyImages[Math.abs(title.length)%legacyImages.length]
  const content=<main className="min-h-screen bg-[#f8fbff] text-rb-900"><section className="relative overflow-hidden bg-rb-900 py-20 text-white sm:py-24"><img src={image} alt="RB Charity Foundation field work" className="absolute inset-0 h-full w-full object-cover opacity-25" onError={(event)=>{event.currentTarget.style.display='none'}}/><div className="absolute inset-0 bg-gradient-to-r from-rb-900 via-rb-900/90 to-rb-900/45"/><div className={`${shell} relative`}><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white"><ArrowLeft size={16}/> Back to home</Link><h1 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">{title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">{description}</p></div></section><section className="py-16 sm:py-20"><div className={shell}><p className="text-xs font-black uppercase tracking-[0.18em] text-rb-600">Module scaffold</p><h2 className="mt-3 text-2xl font-black sm:text-3xl">Sections planned for this page</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map((module,index)=><article key={module} className="rounded-3xl border border-rb-100 bg-white p-6 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-rb-50 text-sm font-black text-rb-700">{String(index+1).padStart(2,'0')}</span><h3 className="mt-5 text-lg font-black">{module}</h3><p className="mt-2 text-sm leading-6 text-slate-600">Functionality and final content for this module will be implemented before the dedicated UI polishing phase.</p></article>)}</div></div></section></main>
  return bare?content:content
}
