import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { causesSeed } from '../data/foundationSeed'

export default function CausesPage() {
  return (
    <main className="min-h-screen bg-[#f8fbff] px-5 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-rb-700">Our causes</span>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-rb-900 sm:text-5xl">Focused areas for measurable social impact.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Each cause groups related campaigns, field work and impact updates. Public fundraising will only be activated for verified initiatives.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {causesSeed.map((cause, index) => (
            <article key={cause.slug} className="rounded-[2rem] border border-rb-100 bg-white p-7 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rb-900 font-black text-white">{String(index + 1).padStart(2, '0')}</div>
              <h2 className="mt-6 text-2xl font-black text-rb-900">{cause.name}</h2>
              <p className="mt-3 leading-7 text-slate-600">{cause.summary}</p>
              <Link to={`/causes/${cause.slug}`} className="mt-6 inline-flex items-center gap-2 font-black text-rb-700">Explore cause <ArrowRight size={17} /></Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
