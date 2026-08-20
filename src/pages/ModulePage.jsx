import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://media.githubusercontent.com/media/Shahzadkhanks19/rbserviceconnect/main/images/Charity-Logo-sample-1%20(1).png'
const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'

export default function ModulePage({ title, description, modules = [] }) {
  return (
    <main className="min-h-screen bg-[#f8fbff] text-rb-900">
      <header className="border-b border-slate-200 bg-[#fffaf2]">
        <div className={`${shell} flex min-h-24 items-center justify-between gap-6 py-3`}>
          <Link to="/" className="flex items-center gap-4">
            <img src={LOGO_URL} alt="RB Charity Foundation" className="h-16 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/campaigns" className="hidden rounded-full px-4 py-2 text-sm font-bold transition hover:bg-rb-50 sm:inline-flex">Campaigns</Link>
            <Link to="/donate" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">Donate <ArrowRight size={16} /></Link>
          </div>
        </div>
      </header>

      <section className="bg-rb-900 py-20 text-white sm:py-24">
        <div className={shell}>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/65 transition hover:text-white"><ArrowLeft size={16} /> Back to home</Link>
          <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">{description}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className={shell}>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-rb-600">Module scaffold</p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">Sections planned for this page</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <article key={module} className="rounded-3xl border border-rb-100 bg-white p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rb-50 text-sm font-black text-rb-700">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-5 text-lg font-black">{module}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Functionality and final content for this module will be implemented before the dedicated UI polishing phase.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-[#fffaf2] py-8">
        <div className={`${shell} flex flex-col gap-3 text-sm text-rb-900/60 sm:flex-row sm:items-center sm:justify-between`}>
          <span>© {new Date().getFullYear()} RB Charity Foundation</span>
          <div className="flex gap-4"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/contact">Contact</Link></div>
        </div>
      </footer>
    </main>
  )
}
