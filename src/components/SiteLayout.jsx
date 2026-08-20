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

export function SiteFooter() {
  const footerLink='rounded-lg px-2 py-1.5 -ml-2 text-rb-900/65 transition duration-300 hover:translate-x-1 hover:bg-rb-50 hover:text-rb-900'
  return <footer id="site-footer" className="border-t border-rb-100 bg-[#fffaf2] text-rb-900"><div className={`${shell} grid gap-12 py-16 lg:grid-cols-[1.1fr_.8fr_.9fr]`}><div><Link to="/"><img src={LOGO_URL} alt="RB Charity Foundation" className="h-24 w-auto max-w-[150px] object-contain object-left sm:h-28 sm:max-w-[175px]" /></Link><h2 className="mt-4 text-lg font-black">RB CHARITY FOUNDATION</h2><p className="mt-4 max-w-md leading-7 text-rb-900/60">Business-backed social impact with a transparent pathway for public participation.</p></div><div><p className="text-xs font-black uppercase tracking-[.18em] text-rb-900/55">Explore</p><div className="mt-5 flex flex-col items-start gap-1"><Link className={footerLink} to="/">Home</Link><Link className={footerLink} to="/about">About</Link><Link className={footerLink} to="/causes">Causes</Link><Link className={footerLink} to="/campaigns">Campaigns</Link><Link className={footerLink} to="/impact">Impact</Link><Link className={footerLink} to="/stories">Stories</Link></div></div><div><p className="text-xs font-black uppercase tracking-[.18em] text-rb-900/55">Get involved</p><div className="mt-5 flex flex-col items-start gap-1"><Link className={footerLink} to="/donate">Donate</Link><Link className={footerLink} to="/volunteer">Volunteer</Link><Link className={footerLink} to="/partner">Partner</Link><Link className={footerLink} to="/contact">Contact</Link><Link className={footerLink} to="/reports">Reports</Link></div></div></div><div className="border-t border-rb-100"><div className={`${shell} flex flex-col gap-4 py-7 text-sm text-rb-900/50 sm:flex-row sm:items-center sm:justify-between`}><span>© {new Date().getFullYear()} RB Charity Foundation. All rights reserved.</span><div className="flex flex-wrap gap-4"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/refund-policy">Refund policy</Link></div></div></div></footer>
}

export function FloatingActions() {
  const [showTop,setShowTop]=useState(false)
  const [overFooter,setOverFooter]=useState(false)
  useEffect(()=>{
    const onScroll=()=>{
      setShowTop(window.scrollY>500)
      const footer=document.getElementById('site-footer')
      if (!footer) return setOverFooter(false)
      setOverFooter(footer.getBoundingClientRect().top < window.innerHeight - 24)
    }
    onScroll()
    window.addEventListener('scroll',onScroll,{passive:true})
    window.addEventListener('resize',onScroll)
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)}
  },[])

  return <>
    {showTop&&<button type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Scroll to top" className={`fixed bottom-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-rb-900 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-rb-800 sm:bottom-7 ${overFooter ? 'left-4 sm:left-7' : 'right-4 sm:right-7'}`}><ArrowUp size={20}/></button>}
    <Link to="/donate" aria-label="Donate now" className={`group fixed bottom-5 right-4 z-40 flex flex-col items-center gap-1.5 text-rb-900 transition duration-300 sm:bottom-7 sm:right-7 ${overFooter ? 'pointer-events-none translate-y-3 opacity-0' : 'opacity-100'}`}><span className="grid h-12 w-12 place-items-center rounded-full bg-gold shadow-xl ring-2 ring-white/80 transition duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-2xl"><Heart size={21} fill="currentColor" className="transition duration-300 group-hover:scale-110"/></span><span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-black shadow-md backdrop-blur sm:text-[11px]">Donate now</span></Link>
  </>
}

export default function SiteLayout({ children }) {
  return <><ScrollToTopOnRoute/><SiteHeader/><div className="pt-24">{children}</div><SiteFooter/><FloatingActions/></>
}
