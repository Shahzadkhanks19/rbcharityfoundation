import { ArrowRight, CheckCircle2, Heart, HandHeart, Menu, ShieldCheck, Users, X } from 'lucide-react'
import { useState } from 'react'

const LOGO_URL = 'https://media.githubusercontent.com/media/Shahzadkhanks19/rbserviceconnect/main/images/Charity-Logo-sample-1%20(1).png'

const causes = [
  ['Hunger & Food Support', 'Nutritious meals and essential food support for vulnerable communities.'],
  ['Education', 'Learning support, school resources and opportunities for children and young people.'],
  ['Healthcare', 'Medical assistance and healthcare support for people who need it most.'],
  ['Women Empowerment', 'Helping women access skills, opportunities and pathways to greater independence.'],
  ['Emergency Relief', 'Rapid support for families and communities during urgent situations.'],
  ['Community Development', 'Long-term initiatives focused on dignity, opportunity and stronger communities.']
]

const nav = ['About', 'Causes', 'Impact', 'Stories', 'Volunteer', 'Contact']
const shell = 'mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8'
const eyebrow = 'inline-flex items-center gap-2 rounded-full border border-rb-100 bg-rb-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-rb-700'
const sectionTitle = 'mt-4 max-w-3xl text-3xl font-black tracking-[-0.04em] text-rb-900 sm:text-4xl lg:text-5xl'
const sectionCopy = 'mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'

function BrandLogo({ footer = false }) {
  return (
    <img
      src={LOGO_URL}
      alt="RB Charity Foundation"
      className={footer
        ? 'h-24 w-auto max-w-[150px] object-contain object-left sm:h-28 sm:max-w-[175px]'
        : 'h-16 w-auto max-w-[105px] object-contain transition duration-200 hover:scale-[1.03] sm:h-[72px] sm:max-w-[120px]'}
    />
  )
}

function App() {
  const [open, setOpen] = useState(false)

  return (
    <main className="overflow-hidden bg-[#f8fbff] text-slate-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-[#fffaf2]/95 text-rb-900 shadow-sm backdrop-blur-xl">
        <div className={`${shell} flex h-24 items-center justify-between gap-6`}>
          <a href="#home" className="flex shrink-0 items-center" aria-label="RB Charity Foundation home">
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-rb-900/70 transition hover:text-rb-900">{item}</a>)}
          </nav>

          <div className="hidden lg:block"><a href="#donate" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-black text-rb-900 transition hover:-translate-y-0.5 hover:shadow-md">Donate now <Heart size={16} /></a></div>
          <button className="rounded-xl p-2 text-rb-900 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
        </div>
        {open && <div className="border-t border-slate-200 bg-[#fffaf2] px-5 py-5 lg:hidden">{nav.map((item) => <a onClick={() => setOpen(false)} key={item} href={`#${item.toLowerCase()}`} className="block border-b border-slate-200 py-3 font-semibold text-rb-900/75">{item}</a>)}<a href="#donate" className="mt-4 inline-flex w-full justify-center rounded-full bg-gold px-5 py-3 font-black text-rb-900">Donate now</a></div>}
      </header>

      <section id="home" className="relative min-h-screen bg-rb-900 pt-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(242,162,58,.26),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(55,105,166,.62),transparent_38%)]" />
        <div className={`${shell} relative grid min-h-[calc(100vh-6rem)] items-center gap-14 py-20 lg:grid-cols-[1.15fr_.85fr]`}>
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">Profits with purpose</span>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl lg:text-7xl">Turning business success into <span className="text-gold">human impact.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">RB Charity Foundation channels support from the wider RB group and public donors into meaningful social initiatives across food, education, healthcare and community welfare.</p>
            <div className="mt-9 flex flex-wrap gap-4"><a href="#donate" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-black text-rb-900">Make a difference <ArrowRight size={18} /></a><a href="#causes" className="rounded-full border border-white/20 px-6 py-3.5 font-bold text-white">Explore our work</a></div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-[2.2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.7rem] bg-white p-6 text-rb-900">
                <span className="text-xs font-black uppercase tracking-[.18em] text-rb-600">How RB creates impact</span>
                <div className="mt-6 space-y-3">
                  {['RB Group businesses grow', 'A share of success supports the foundation', 'Public donors can join the mission', 'Resources reach verified social initiatives'].map((item, index) => <div key={item} className="flex items-center gap-4 rounded-2xl bg-rb-50 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rb-800 text-sm font-black text-white">{index + 1}</span><p className="font-bold">{item}</p></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 sm:py-32">
        <div className={`${shell} grid gap-14 lg:grid-cols-2 lg:items-center`}>
          <div><span className={eyebrow}>Our foundation</span><h2 className={sectionTitle}>A charitable arm built around responsibility, dignity and action.</h2><p className={sectionCopy}>RB Charity Foundation exists to convert commercial growth into positive social outcomes. Alongside contributions connected to RB businesses, the platform gives individuals and partners a clear way to support causes they believe in.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[['Business-backed giving','A sustainable model that connects business performance with community responsibility.'],['Public participation','Supporters can contribute directly to the foundation or to specific campaigns.'],['Transparent impact','Campaign updates and reporting are designed to show where support goes.'],['Long-term thinking','We focus on meaningful, repeatable initiatives rather than one-time visibility.']].map(([title,copy]) => <article key={title} className="rounded-3xl border border-rb-100 bg-white p-6 shadow-soft"><CheckCircle2 className="text-rb-600" /><h3 className="mt-5 text-xl font-black text-rb-900">{title}</h3><p className="mt-3 leading-7 text-slate-600">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section id="causes" className="bg-rb-50 py-24 sm:py-32">
        <div className={shell}><span className={eyebrow}>Our causes</span><h2 className={sectionTitle}>Focused areas where support can create lasting change.</h2><p className={sectionCopy}>These categories form the foundation of the platform. Real campaigns and verified impact figures will be published as they are approved.</p><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{causes.map(([title,copy],i) => <article key={title} className="group rounded-[2rem] border border-rb-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-soft"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-rb-800 font-black text-white">0{i+1}</div><h3 className="mt-6 text-2xl font-black text-rb-900">{title}</h3><p className="mt-3 leading-7 text-slate-600">{copy}</p><button className="mt-6 inline-flex items-center gap-2 text-sm font-black text-rb-700">Learn more <ArrowRight size={16} /></button></article>)}</div></div>
      </section>

      <section id="impact" className="py-24 sm:py-32">
        <div className={shell}>
          <div className="rounded-[2.5rem] bg-rb-900 p-7 text-white sm:p-10 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div><span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-gold">Transparency first</span><h2 className="mt-5 text-4xl font-black tracking-[-.04em] sm:text-5xl">Every contribution should have a story you can follow.</h2><p className="mt-5 leading-8 text-white/70">The platform is designed around traceable campaigns, updates, reports and real impact data rather than decorative numbers.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">{[['Funds received','Donation and group contribution records'],['Funds allocated','Cause and campaign allocation'],['Work completed','Field updates and project status'],['Impact documented','Stories, media and reports']].map(([title,copy]) => <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-6"><ShieldCheck className="text-gold"/><h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{copy}</p></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="stories" className="py-24 sm:py-32">
        <div className={shell}><span className={eyebrow}>Stories of change</span><h2 className={sectionTitle}>The people behind every campaign matter more than the numbers.</h2><div className="mt-12 grid gap-6 lg:grid-cols-3">{['Field stories and updates','Campaign milestones','Community partnerships'].map((title,i)=><article key={title} className="overflow-hidden rounded-[2rem] border border-rb-100 bg-white"><div className="aspect-[4/3] bg-gradient-to-br from-rb-100 via-rb-50 to-orange-100 p-6"><span className="text-xs font-black uppercase tracking-[.18em] text-rb-700">Story 0{i+1}</span></div><div className="p-6"><h3 className="text-xl font-black text-rb-900">{title}</h3><p className="mt-3 leading-7 text-slate-600">Real stories, photographs and verified campaign updates will appear here as the foundation publishes them.</p></div></article>)}</div></div>
      </section>

      <section id="volunteer" className="bg-[#fff1dd] py-24 sm:py-28"><div className={`${shell} grid gap-10 lg:grid-cols-3`}><div><HandHeart size={34} className="text-rb-700"/><h3 className="mt-5 text-3xl font-black text-rb-900">Volunteer</h3><p className="mt-3 leading-7 text-slate-700">Give your time and skills to field initiatives and community drives.</p></div><div><Users size={34} className="text-rb-700"/><h3 className="mt-5 text-3xl font-black text-rb-900">Partner</h3><p className="mt-3 leading-7 text-slate-700">Collaborate as a company, institution, NGO or community partner.</p></div><div><Heart size={34} className="text-rb-700"/><h3 className="mt-5 text-3xl font-black text-rb-900">Donate</h3><p className="mt-3 leading-7 text-slate-700">Support the general foundation fund or choose a specific verified campaign.</p></div></div></section>

      <section id="donate" className="py-24 sm:py-32"><div className={shell}><div className="grid overflow-hidden rounded-[2.5rem] bg-white shadow-soft lg:grid-cols-2"><div className="bg-rb-900 p-8 text-white sm:p-12"><span className="text-xs font-black uppercase tracking-[.2em] text-gold">Join the mission</span><h2 className="mt-5 text-4xl font-black tracking-[-.04em] sm:text-5xl">Your contribution can become someone else's opportunity.</h2><p className="mt-5 leading-8 text-white/70">The payment gateway will be connected only after the foundation's verified banking, legal and compliance details are available.</p></div><div className="p-8 sm:p-12"><p className="text-sm font-black uppercase tracking-[.18em] text-rb-600">Choose an amount</p><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{['₹500','₹1,000','₹2,500','Custom'].map(a=><button key={a} className="rounded-2xl border border-rb-100 px-4 py-4 font-black text-rb-900 transition hover:border-rb-600 hover:bg-rb-50">{a}</button>)}</div><button disabled className="mt-6 w-full cursor-not-allowed rounded-full bg-rb-800 px-6 py-4 font-black text-white opacity-60">Donation gateway coming soon</button><p className="mt-4 text-xs leading-5 text-slate-500">No payment will be collected until verified foundation details and gateway credentials are configured.</p></div></div></div></section>

      <footer id="contact" className="border-t border-slate-200 bg-[#fffaf2] py-14 text-rb-900">
        <div className={`${shell} grid gap-10 md:grid-cols-3`}>
          <div>
            <BrandLogo footer />
            <p className="mt-3 font-black">RB CHARITY FOUNDATION</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-rb-900/60">Business-backed social impact with a transparent pathway for public participation.</p>
          </div>
          <div><p className="text-sm font-black uppercase tracking-[.15em] text-rb-900/45">Explore</p><div className="mt-4 space-y-2 text-sm text-rb-900/70"><a className="block transition hover:text-gold" href="#about">About</a><a className="block transition hover:text-gold" href="#causes">Causes</a><a className="block transition hover:text-gold" href="#impact">Impact</a></div></div>
          <div><p className="text-sm font-black uppercase tracking-[.15em] text-rb-900/45">Get involved</p><div className="mt-4 space-y-2 text-sm text-rb-900/70"><a className="block transition hover:text-gold" href="#donate">Donate</a><a className="block transition hover:text-gold" href="#volunteer">Volunteer</a><span className="block">Contact details to be verified</span></div></div>
        </div>
        <div className={`${shell} mt-10 border-t border-slate-200 pt-6 text-xs text-rb-900/45`}>© {new Date().getFullYear()} RB Charity Foundation. All rights reserved.</div>
      </footer>
    </main>
  )
}

export default App
