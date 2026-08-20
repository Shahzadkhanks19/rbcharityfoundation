import { CheckCircle2, Loader2, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import CustomSelect from '../components/form/CustomSelect'

const shell='mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8'
const input='w-full rounded-2xl border border-rb-100 bg-white px-4 py-3.5 text-rb-900 shadow-sm outline-none transition duration-300 placeholder:text-slate-400 hover:border-rb-200 focus:border-rb-400 focus:ring-4 focus:ring-rb-100'
const labelClass='mb-2 block text-sm font-black text-rb-900'

const configs={
  volunteer:{title:'Volunteer With Us',description:'Register your interest in contributing time and skills to RB Charity Foundation initiatives.',endpoint:'/api/volunteers',success:'Thank you. Your volunteer registration has been received.'},
  partner:{title:'Partner With Us',description:'Tell us how your company, institution, NGO or community organisation would like to collaborate.',endpoint:'/api/partners',success:'Thank you. Your partnership enquiry has been received.'},
  contact:{title:'Contact Us',description:'Send a general, donation, campaign, volunteer or partnership enquiry to the foundation.',endpoint:'/api/contact',success:'Thank you. Your message has been received.'}
}

const organisationOptions=[{value:'corporate',label:'Corporate'},{value:'ngo',label:'NGO'},{value:'institution',label:'Institution'},{value:'community',label:'Community organisation'},{value:'other',label:'Other'}]
const availabilityOptions=[{value:'weekdays',label:'Weekdays'},{value:'weekends',label:'Weekends'},{value:'flexible',label:'Flexible'},{value:'events-only',label:'Events only'}]
const enquiryOptions=[{value:'general',label:'General'},{value:'donation',label:'Donation'},{value:'volunteer',label:'Volunteer'},{value:'partnership',label:'Partnership'},{value:'campaign',label:'Campaign'},{value:'other',label:'Other'}]

export default function EngagementFormPage({type}){
  const config=configs[type]
  const [form,setForm]=useState(type==='partner'?{organisation:'',contactName:'',email:'',phone:'',type:'corporate',message:''}:type==='contact'?{name:'',email:'',phone:'',category:'general',subject:'',message:''}:{name:'',email:'',phone:'',city:'',skills:'',availability:'',message:''})
  const [status,setStatus]=useState({loading:false,error:'',success:false})
  const set=(key,value)=>setForm(current=>({...current,[key]:value}))

  async function submit(event){
    event.preventDefault()
    setStatus({loading:true,error:'',success:false})
    const payload=type==='volunteer'?{...form,skills:form.skills.split(',').map(item=>item.trim()).filter(Boolean)}:form
    try{
      const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      const data=await response.json()
      if(!response.ok) throw new Error(data.message||'Unable to submit the form')
      setStatus({loading:false,error:'',success:true})
    }catch(error){setStatus({loading:false,error:error.message,success:false})}
  }

  if(status.success)return <main className="bg-[#f8fbff] py-20"><div className={shell}><div className="rounded-[2.25rem] border border-rb-100 bg-white p-8 text-center shadow-xl shadow-rb-100/50"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rb-50"><CheckCircle2 className="text-rb-600" size={34}/></div><h1 className="mt-5 text-3xl font-black text-rb-900">Received successfully</h1><p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">{config.success}</p><button onClick={()=>setStatus({loading:false,error:'',success:false})} className="mt-7 rounded-full bg-rb-900 px-6 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">Submit another response</button></div></div></main>

  return <main className="bg-[#f8fbff] py-16 sm:py-20"><div className={shell}><div className="mb-10 flex items-start gap-4"><div className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50"><Sparkles size={20} className="text-gold"/></div><div><p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Get involved</p><h1 className="mt-3 text-4xl font-black tracking-[-.04em] text-rb-900 sm:text-5xl">{config.title}</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{config.description}</p></div></div><form onSubmit={submit} className="grid gap-5 rounded-[2.25rem] border border-rb-100 bg-white p-6 shadow-xl shadow-rb-100/50 sm:p-8 md:grid-cols-2">
    {type==='partner'?<><Field label="Organisation"><input className={input} value={form.organisation} onChange={e=>set('organisation',e.target.value)} placeholder="Organisation name" required/></Field><Field label="Contact person"><input className={input} value={form.contactName} onChange={e=>set('contactName',e.target.value)} placeholder="Full name" required/></Field><Field label="Email"><input type="email" className={input} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" required/></Field><Field label="Mobile number"><input inputMode="numeric" maxLength={10} className={input} value={form.phone} onChange={e=>set('phone',e.target.value.replace(/\D/g,''))} placeholder="10-digit mobile number" required/></Field><Field label="Organisation type"><CustomSelect value={form.type} onChange={value=>set('type',value)} options={organisationOptions}/></Field><div/><Field label="How would you like to collaborate?" full><textarea rows={5} className={`${input} resize-none`} value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Tell us about the collaboration you have in mind" required/></Field></>:
    type==='contact'?<><Field label="Name"><input className={input} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your full name" required/></Field><Field label="Email"><input type="email" className={input} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" required/></Field><Field label="Mobile number (optional)"><input inputMode="numeric" maxLength={10} className={input} value={form.phone} onChange={e=>set('phone',e.target.value.replace(/\D/g,''))} placeholder="10-digit mobile number"/></Field><Field label="Enquiry category"><CustomSelect value={form.category} onChange={value=>set('category',value)} options={enquiryOptions}/></Field><Field label="Subject" full><input className={input} value={form.subject} onChange={e=>set('subject',e.target.value)} placeholder="What is this about?"/></Field><Field label="Message" full><textarea rows={5} className={`${input} resize-none`} value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Write your message" required/></Field></>:
    <><Field label="Name"><input className={input} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your full name" required/></Field><Field label="Email"><input type="email" className={input} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" required/></Field><Field label="Mobile number"><input inputMode="numeric" maxLength={10} className={input} value={form.phone} onChange={e=>set('phone',e.target.value.replace(/\D/g,''))} placeholder="10-digit mobile number" required/></Field><Field label="City"><input className={input} value={form.city} onChange={e=>set('city',e.target.value)} placeholder="Your city"/></Field><Field label="Skills (comma separated)"><input className={input} value={form.skills} onChange={e=>set('skills',e.target.value)} placeholder="Teaching, design, logistics"/></Field><Field label="Availability"><CustomSelect value={form.availability} onChange={value=>set('availability',value)} options={availabilityOptions} placeholder="Select availability"/></Field><Field label="Why would you like to volunteer?" full><textarea rows={5} className={`${input} resize-none`} value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Tell us how you would like to help"/></Field></>}
    {status.error&&<div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{status.error}</div>}
    <div className="md:col-span-2"><button disabled={status.loading} className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-black text-rb-900 shadow-lg shadow-orange-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">{status.loading?<Loader2 size={18} className="animate-spin"/>:<Send size={18} className="transition group-hover:translate-x-0.5"/>}{status.loading?'Submitting...':'Submit'}</button></div>
  </form></div></main>
}

function Field({label,children,full=false}){return <label className={full?'md:col-span-2':''}><span className={labelClass}>{label}</span>{children}</label>}
