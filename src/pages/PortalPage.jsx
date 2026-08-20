import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'

export default function PortalPage({ portal, title, description, modules = [] }) {
  const isAdmin = portal === 'Admin'

  return (
    <main className="min-h-screen bg-slate-50 text-rb-900">
      <header className="border-b border-slate-200 bg-white">
        <div className={`${shell} flex min-h-20 items-center justify-between gap-4`}>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-rb-600">RB Charity Foundation</p>
            <p className="mt-1 font-black">{portal} Portal</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-rb-50 px-4 py-2 text-sm font-bold transition hover:bg-rb-100"><ArrowLeft size={15} /> Public site</Link>
        </div>
      </header>

      <div className={`${shell} grid gap-8 py-10 lg:grid-cols-[260px_1fr]`}>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">{isAdmin ? 'Administration' : 'My account'}</p>
          <div className="mt-4 space-y-2 text-sm font-bold text-rb-900/75">
            {(isAdmin
              ? [['Dashboard','/admin/dashboard'],['Campaigns','/admin/campaigns'],['Causes','/admin/causes'],['Donations','/admin/donations'],['Donors','/admin/donors'],['Volunteers','/admin/volunteers'],['Partners','/admin/partners'],['Stories','/admin/stories'],['Gallery','/admin/gallery'],['Reports','/admin/reports'],['Messages','/admin/messages'],['Content','/admin/content'],['Settings','/admin/settings'],['Activity','/admin/activity']]
              : [['Dashboard','/donor/dashboard'],['My donations','/donor/donations'],['Receipts','/donor/receipts'],['Supported campaigns','/donor/campaigns'],['Profile','/donor/profile']]
            ).map(([label, path]) => <Link key={path} to={path} className="block rounded-2xl px-4 py-3 transition hover:bg-rb-50 hover:text-rb-900">{label}</Link>)}
          </div>
        </aside>

        <section>
          <div className="rounded-3xl bg-rb-900 p-7 text-white sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">{portal} module</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-3xl leading-7 text-white/70">{description}</p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((module, index) => (
              <article key={module} className="rounded-3xl border border-slate-200 bg-white p-6">
                <span className="text-xs font-black text-rb-600">{String(index + 1).padStart(2, '0')}</span>
                <h2 className="mt-3 text-lg font-black">{module}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Module structure is reserved here. Data, permissions and final interface will be implemented in the functionality pass.</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
