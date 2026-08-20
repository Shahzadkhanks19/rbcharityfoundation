import { CheckCircle2, HeartHandshake, Loader2, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CustomSelect from '../components/form/CustomSelect'
import { campaignsSeed, causesSeed } from '../data/foundationSeed'

const shell='mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8'
const input='w-full rounded-2xl border border-rb-100 bg-white px-4 py-3.5 text-rb-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 hover:border-rb-200 focus:border-rb-400 focus:ring-4 focus:ring-rb-100'
const label='mb-2 block text-sm font-black text-rb-900'
const quickAmounts=[500,1000,2500,5000]

export default function DonatePage(){
  const [searchParams]=useSearchParams()
  const initialCampaign=searchParams.get('campaign')||''
  const initialCause=searchParams.get('cause')||''
  const [form,setForm]=useState({donorName:'',email:'',phone:'',amount:'1000',destination:initialCampaign?'campaign':initialCause?'cause':'general',campaignSlug:initialCampaign,causeSlug:initialCause})
  const [status,setStatus]=useState({loading:false,error:'',success:false})
  const set=(key,value)=>setForm(current=>({...current,[key]:value}))

  const selectedCampaign=useMemo(()=>campaignsSeed.find(item=>item.slug===form.campaignSlug),[form.campaignSlug])
  const selectedCause=useMemo(()=>causesSeed.find(item=>item.slug===form.causeSlug),[form.causeSlug])
  const destinationLabel=form.destination==='campaign'?selectedCampaign?.title||'Campaign':form.destination==='cause'?selectedCause?.name||'Cause':'General Fund'

  async function submit(event){
    event.preventDefault()
    setStatus({loading:true,error:'',success:false})
    try{
      const response=await fetch('/api/donations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,cause:destinationLabel})})
      const data=await response.json()
      if(!response.ok)throw new Error(data.message||'Unable to save donation intent')
      setStatus({loading:false,error:'',success:true})
    }catch(error){setStatus({loading:false,error:error.message,success:false})}
  }

  if(status.success)return <main className="bg-[#f8fbff] py-20"><div className={shell}><div className="rounded-[2.25rem] border border-rb-100 bg-white p-8 text-center shadow-xl shadow-rb-100/50"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rb-50"><CheckCircle2 className="text-rb-600" size={34}/></div><h1 className="mt-5 text-3xl font-black text-rb-900">Donation intent recorded</h1><p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">Your details and intended contribution have been saved. No payment has been collected because the live payment gateway is not enabled yet.</p></div></div></main>

  const causeOptions=causesSeed.map(item=>({value:item.slug,label:item.name}))
  const campaignOptions=campaignsSeed.map(item=>({value:item.slug,label:item.title}))

  return <main className="bg-[#f8fbff] py-16 sm:py-20"><div className={shell}><div className="mb-10"><p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Support the mission</p><h1 className="mt-3 text-4xl font-black tracking-[-.04em] text-rb-900 sm:text-5xl">Make a contribution</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Choose where you want your contribution to go. Live payment collection remains disabled until the foundation's verified payment and compliance details are configured.</p></div><form onSubmit={submit} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><section className="rounded-[2.25rem] bg-rb-900 p-6 text-white shadow-xl shadow-rb-900/15 sm:p-8"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10"><HeartHandshake size={20} className="text-gold"/></div><div><p className="text-xs font-black uppercase tracking-[.18em] text-gold">Choose destination</p><p className="mt-1 text-sm text-white/55">Direct your contribution where it matters most.</p></div></div><div className="mt-6 grid gap-3">{[['general','General Fund','Support the foundation across verified needs.'],['cause','Specific Cause','Choose one core focus area.'],['campaign','Specific Campaign','Support one active campaign directly.']].map(([value,text,copy])=><button type="button" key={value} onClick={()=>set('destination',value)} className={`group rounded-2xl border px-4 py-4 text-left transition duration-300 ${form.destination===value?'border-gold bg-gold text-rb-900 shadow-lg shadow-gold/10':'border-white/15 bg-white/5 text-white hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10'}`}><div className="flex items-center justify-between gap-4"><div><p className="font-black">{text}</p><p className={`mt-1 text-sm leading-5 ${form.destination===value?'text-rb-900/65':'text-white/50'}`}>{copy}</p></div><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${form.destination===value?'border-rb-900 bg-rb-900':'border-white/30'}`}>{form.destination===value&&<span className="h-2 w-2 rounded-full bg-gold"/>}</span></div></button>)}</div>{form.destination==='cause'&&<div className="mt-6"><span className="mb-2 block text-sm font-black">Cause</span><CustomSelect dark value={form.causeSlug} onChange={value=>set('causeSlug',value)} options={causeOptions} placeholder="Select a cause"/></div>}{form.destination==='campaign'&&<div className="mt-6"><span className="mb-2 block text-sm font-black">Campaign</span><CustomSelect dark value={form.campaignSlug} onChange={value=>set('campaignSlug',value)} options={campaignOptions} placeholder="Select a campaign"/></div>}</section><section className="rounded-[2.25rem] border border-rb-100 bg-white p-6 shadow-xl shadow-rb-100/50 sm:p-8"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-50"><Sparkles size={19} className="text-gold"/></div><div><span className={label}>Contribution amount</span><p className="text-sm text-slate-500">Choose a preset or enter your own amount.</p></div></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{quickAmounts.map(amount=><button type="button" key={amount} onClick={()=>set('amount',String(amount))} className={`rounded-2xl border px-3 py-3.5 font-black transition duration-300 ${String(amount)===form.amount?'border-gold bg-orange-50 text-rb-900 shadow-sm':'border-rb-100 text-rb-900 hover:-translate-y-0.5 hover:border-rb-300 hover:bg-rb-50'}`}>₹{amount.toLocaleString('en-IN')}</button>)}</div><div className="relative mt-3"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-black text-rb-600">₹</span><input type="number" min="1" className={`${input} pl-8`} value={form.amount} onChange={e=>set('amount',e.target.value)} required/></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Name"><input className={input} value={form.donorName} onChange={e=>set('donorName',e.target.value)} placeholder="Your full name" required/></Field><Field label="Email"><input type="email" className={input} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" required/></Field><Field label="Mobile number"><input inputMode="numeric" maxLength={10} className={input} value={form.phone} onChange={e=>set('phone',e.target.value.replace(/\D/g,''))} placeholder="10-digit mobile number" required/></Field><div className="rounded-2xl border border-rb-100 bg-rb-50 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-rb-600">Selected destination</p><p className="mt-2 font-black text-rb-900">{destinationLabel}</p></div></div>{status.error&&<div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{status.error}</div>}<button disabled={status.loading} className="group mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-black text-rb-900 shadow-lg shadow-orange-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">{status.loading&&<Loader2 size={18} className="animate-spin"/>}{status.loading?'Saving...':'Continue'}</button><p className="mt-4 text-xs leading-5 text-slate-500">This currently records a pending donation intent only. It does not initiate or collect a payment.</p></section></form></div></main>
}

function Field({label:fieldLabel,children}){return <label><span className={label}>{fieldLabel}</span>{children}</label>}
