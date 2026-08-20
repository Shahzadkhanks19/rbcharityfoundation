import { ArrowUp, Heart, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export const LOGO_URL = 'https://media.githubusercontent.com/media/Shahzadkhanks19/rbserviceconnect/main/images/Charity-Logo-sample-1%20(1).png'
export const LEGACY_IMAGE_BASE = 'https://media.githubusercontent.com/media/Shahzadkhanks19/rbserviceconnect/main/images/'

const nav = [['Home','/'],['About','/about'],['Causes','/causes'],['Campaigns','/campaigns'],['Impact','/impact'],['Stories','/stories'],['Volunteer','/volunteer'],['Contact','/contact']]
const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'

function ScrollToTopOnRoute() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])
  return null
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:bg-rb-50 hover:text-rb-900 hover:shadow-sm ${isActive ? 'bg-rb-50 text-rb-900' : 'text-rb-900/70'}`
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-[#fffaf2]/95 shadow-sm backdrop-blur-xl"><div className={`${shell} flex h-24 items-center justify-between gap-5`}><Link to="/" aria-label="RB Charity Foundation home"><img src={LOGO_URL} alt="RB Charity Foundation" className="h-16 w-auto max-w-[105px] object-contain sm:h-[72px] sm:max-w-[120px]" /></Link><nav className="hidden items-center gap-1 xl:flex">{nav.map(([label,path])=><NavLink key={path} to={path} className={linkClass}>{label}</NavLink>)}</nav><Link to="/donate" className="hidden items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-black text-rb-900 shadow-sm transition hover:-translate-y-1 hover:shadow-lg lg:inline-flex">Donate now <Heart size={16}/></Link><button type="button" onClick={()=>setOpen(v=>!v)} className="rounded-xl p-2 text-rb-900 transition hover:bg-rb-50 xl:hidden" aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button></div>{open&&<div className="border-t border-slate-200 bg-[#fffaf2] px-5 py-5 shadow-xl xl:hidden">{nav.map(([label,path])=><NavLink onClick={()=>setOpen(false)} key={path} to={path} className="block rounded-xl px-3 py-3 font-semibold text-rb-900/75 transition hover:bg-rb-50 hover:text-rb-900">{label}</NavLink>)}<Link onClick={()=>setOpen(false)} to="/donate" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-black text-rb-900">Donate now <Heart size={16}/></Link></div>}</header>
}

function InstagramIcon(){return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none"/></svg>}
function FacebookBrandIcon(){return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden="true"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10H8.2v3h2.6v8h2.9Z"/></svg>}
function YouTubeIcon(){return <svg viewBox="0 0 24 24" className="h-[19px] w-[19px] fill-current" aria-hidden="true"><path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8ZM10 15.2V8.8l5.5 3.2L10 15.2Z"/></svg>}

export function SiteFooter() {
  const footerLink='rounded-lg px-2 py-1.5 -ml-2 text-rb-900/65 transition duration-300 hover:translate-x-1 hover:bg-rb-50 hover:text-rb-900'
  const Group=({title,links})=><div><p className="text-xs font-black uppercase tracking-[.18em] text-rb-900/55">{title}</p><div className="mt-5 flex flex-col items-start gap-1">{links.map(([label,path])=><Link key={path} className={footerLink} to={path}>{label}</Link>)}</div></div>
  const socialClass='grid h-10 w-10 place-items-center rounded-full border border-rb-100 bg-white text-rb-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:bg-gold hover:text-rb-900 hover:shadow-md'
  return <footer className="border-t border-rb-100 bg-[#fffaf2] text-rb-900"><div className={`${shell} grid gap-12 py-16 sm:grid-cols-2 xl:grid-cols-[1.2fr_.8fr_.8fr_.8fr_.8fr]`}><div><Link to="/"><img src={LOGO_URL} alt="RB Charity Foundation" className="h-24 w-auto max-w-[150px] object-contain object-left sm:h-28 sm:max-w-[175px]" /></Link><h2 className="mt-4 text-lg font-black">RB CHARITY FOUNDATION</h2><p className="mt-4 max-w-md leading-7 text-rb-900/60">Business-backed social impact with a transparent pathway for public participation.</p><div className="mt-6 flex items-center gap-3"><a href="#" aria-label="Instagram" className={socialClass}><InstagramIcon/></a><a href="#" aria-label="Facebook" className={socialClass}><FacebookBrandIcon/></a><a href="#" aria-label="YouTube" className={socialClass}><YouTubeIcon/></a></div></div><Group title="Foundation" links={[["Home","/"],["About","/about"],["Impact","/impact"],["Transparency","/transparency"]]}/><Group title="Our work" links={[["Causes","/causes"],["Campaigns","/campaigns"],["Stories","/stories"],["Gallery","/gallery"]]}/><Group title="Get involved" links={[["Donate","/donate"],["Volunteer","/volunteer"],["Partner","/partner"],["Contact","/contact"]]}/><Group title="Resources" links={[["Reports","/reports"],["FAQ","/faq"],["Privacy","/privacy"],["Terms","/terms"],["Refund policy","/refund-policy"]]}/></div><div className="border-t border-rb-100"><div className={`${shell} py-7 pr-24 text-center text-sm text-rb-900/50 sm:pr-28`}><span>© {new Date().getFullYear()} RB Charity Foundation. All rights reserved.</span></div></div></footer>
}

export function FloatingActions() {
  const [showTop,setShowTop]=useState(false)
  useEffect(()=>{const onScroll=()=>setShowTop(window.scrollY>80);onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[])
  return <div className="fixed bottom-5 right-4 z-40 flex flex-col items-center gap-3 sm:bottom-7 sm:right-7">{showTop&&<button type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Scroll to top" className="grid h-12 w-12 place-items-center rounded-full bg-rb-900 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-rb-800"><ArrowUp size={20}/></button>}<Link to="/donate" aria-label="Donate now" className="group flex flex-col items-center gap-1.5 text-rb-900"><span className="grid h-12 w-12 place-items-center rounded-full bg-gold shadow-xl ring-2 ring-white/80 transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-2xl"><Heart size={21} fill="currentColor" className="transition duration-300 group-hover:scale-110"/></span><span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-black shadow-md backdrop-blur sm:text-[11px]">Donate now</span></Link></div>
}

export default function SiteLayout({ children }) {
  return <><ScrollToTopOnRoute/><SiteHeader/><div className="pt-24">{children}</div><SiteFooter/><FloatingActions/></>
}
