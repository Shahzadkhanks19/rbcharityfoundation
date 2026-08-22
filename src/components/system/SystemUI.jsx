import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { LOGO_URL } from '../SiteLayout'

/*
 * Do not artificially hold the first paint. Route-level Suspense/PageSkeleton
 * already provides feedback when a chunk genuinely needs time to load.
 */
export function AppPreloader({ children }) {
  return children
}

export function Preloader() {
  return <div className="fixed inset-0 z-[200] grid place-items-center bg-[#fffaf2] px-5"><div className="flex flex-col items-center"><div className="relative grid h-28 w-28 place-items-center rounded-full bg-white shadow-xl ring-1 ring-rb-100"><span className="absolute inset-[-9px] rounded-full border-2 border-transparent border-t-gold border-r-rb-700 animate-spin"/><img src={LOGO_URL} alt="RB Charity Foundation" width="80" height="80" decoding="async" className="h-20 w-20 object-contain"/></div><p className="mt-6 text-xs font-black uppercase tracking-[.22em] text-rb-700">RB Charity Foundation</p><p className="mt-2 text-sm font-semibold text-rb-900/45">Preparing your experience…</p></div></div>
}

export function PageSkeleton({ cards = 6 }) {
  return <div className="min-h-[70vh] bg-[#f8fbff] px-5 py-14" aria-busy="true" aria-label="Loading content"><div className="mx-auto max-w-7xl animate-pulse" aria-hidden="true"><div className="h-4 w-28 rounded-full bg-rb-100"/><div className="mt-5 h-10 w-full max-w-xl rounded-2xl bg-rb-100"/><div className="mt-3 h-5 w-full max-w-2xl rounded-xl bg-rb-50"/><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:cards}).map((_,i)=><div key={i} className="rounded-3xl border border-rb-100 bg-white p-6"><div className="h-12 w-12 rounded-2xl bg-rb-100"/><div className="mt-5 h-6 w-2/3 rounded-xl bg-rb-100"/><div className="mt-3 h-4 w-full rounded-lg bg-rb-50"/><div className="mt-2 h-4 w-5/6 rounded-lg bg-rb-50"/></div>)}</div></div></div>
}

export class GlobalErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('RB Charity global UI error:', error, info) }
  render() {
    if (!this.state.hasError) return this.props.children
    return <div className="grid min-h-screen place-items-center bg-rb-900 px-5 py-12 text-white"><div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur"><img src={LOGO_URL} alt="RB Charity Foundation" width="96" height="96" decoding="async" className="mx-auto h-24 w-24 object-contain"/><div className="mx-auto mt-6 grid h-12 w-12 place-items-center rounded-full bg-gold text-rb-900"><AlertTriangle size={22}/></div><h1 className="mt-5 text-3xl font-black">Something went wrong</h1><p className="mt-3 leading-7 text-white/65">The page hit an unexpected error. Your data has not been intentionally changed.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={()=>window.location.reload()} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 font-black text-rb-900"><RefreshCw size={17}/>Reload</button><a href="/" className="rounded-full border border-white/15 px-5 py-3 font-black text-white">Go home</a></div></div></div>
  }
}
