import { CheckCircle2, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { campaignsSeed, causesSeed } from '../data/foundationSeed'

const shell='mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8'
const input='w-full rounded-2xl border border-rb-100 bg-white px-4 py-3 text-rb-900 outline-none transition focus:border-rb-400 focus:ring-4 focus:ring-rb-100'
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

  if(status.success)return <main className="bg-[#f8fbff] py-20"><div className={shell}><div className="rounded-[2rem] border border-rb-100 bg-white p-8 text-center shadow-sm"><CheckCircle2 className="mx-auto text-rb-600" size={48}/><h1 className="mt-5 text-3xl font-black text-rb-900">Donation intent recorded</h1><p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">Your details and intended contribution have been saved. No payment has been collected because the live payment gateway is not enabled yet.</p></div></div></main>

  return <main className="bg-[#f8fbff] py-16 sm:py-20"><div className={shell}><div className="mb-10"><p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Support the mission</p><h1 className="mt-3 text-4xl font-black tracking-[-.04em] text-rb-900 sm:text-5xl">Make a contribution</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Choose where you want your contribution to go. Live payment collection remains disabled until the foundation's verified payment and compliance details are configured.</p></div><form onSubmit={submit} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><section className="rounded-[2rem] bg-rb-900 p-6 text-white sm:p-8"><p className="text-xs font-black uppercase tracking-[.18em] text-gold">Choose destination</p><div className="mt-5 space-y-3">{[['general','General Fund'],['cause','Specific Cause'],['campaign','Specific Campaign']].map(([value,text])=><button type="button" key={value} onClick={()=>set('destination',value)} className={`w-full rounded-2xl border px-4 py-4 text-left font-black transition ${form.destination===value?'border-gold bg-gold text-rb-900':'border-white/15 bg-white/5 text-white hover:bg-white/10'}`}>{text}</button>)}</div>{form.destination==='cause'&&<div className="mt-5"><span className="mb-2 block text-sm font-black">Cause</span><select className="w-full rounded-2xl bg-white px-4 py-3 text-rb-900" value={form.causeSlug} onChange={e=>set('causeSlug',e.target.value)} required><option value="">Select cause</option>{causesSeed.map(item=><option key={item.slug} value={item.slug}>{item.name}</option>)}</select></div>}{form.destination==='campaign'&&<div className="mt-5"><span className="mb-2 block text-sm font-black">Campaign</span><select className="w-full rounded-2xl bg-white px-4 py-3 text-rb-900" value={form.campaignSlug} onChange={e=>set('campaignSlug',e.target.value)} required><option value="">Select campaign</option>{campaignsSeed.map(item=><option key={item.slug} value={item.slug}>{item.title}</option>)}</select></div>}</section><section className="rounded-[2rem] border border-rb-100 bg-white p-6 shadow-sm sm:p-8"><div><span className={label}>Amount</span><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{quickAmounts.map(amount=><button type="button" key={amount} onClick={()=>set('amount',String(amount))} className={`rounded-2xl border px-3 py-3 font-black transition ${String(amount)===form.amount?'border-gold bg-orange-50 text-rb-900':'border-rb-100 hover:border-rb-300'}`}>₹{amount.toLocaleString('en-IN')}</button>)}</div><input type="number" min="1" className={`${input} mt-3`} value={form.amount} onChange={e=>set('amount',e.target.value)} required/></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Name"><input className={input} value={form.donorName} onChange={e=>set('donorName',e.target.value)} required/></Field><Field label="Email"><input type="email" className={input} value={form.email} onChange={e=>set('email',e.target.value)} required/></Field><Field label="Mobile number"><input inputMode="numeric" maxLength={10} className={input} value={form.phone} onChange={e=>set('phone',e.target.value.replace(/\D/g,''))} required/></Field><div className="rounded-2xl bg-rb-50 p-4"><p className="text-xs font-black uppercase tracking-[.14em] text-rb-600">Selected</p><p className="mt-2 font-black text-rb-900">{destinationLabel}</p></div></div>{status.error&&<div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{status.error}</div>}<button disabled={status.loading} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-black text-rb-900 disabled:opacity-60">{status.loading&&<Loader2 size={18} className="animate-spin"/>}{status.loading?'Saving...':'Continue'}</button><p className="mt-4 text-xs leading-5 text-slate-500">This currently records a pending donation intent only. It does not initiate or collect a payment.</p></section></form></div></main>
}

function Field({label:fieldLabel,children}){return <label><span className={label}>{fieldLabel}</span>{children}</label>}
