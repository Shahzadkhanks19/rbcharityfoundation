import { Plus, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import CustomSelect from '../components/form/CustomSelect'
import AdminDataPage from './AdminDataPages'

const API='/api/admin'
const token=()=>sessionStorage.getItem('rbAdminToken')||''
const input='w-full rounded-2xl border border-rb-100 bg-white px-4 py-3.5 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10'
async function request(path,options={}){const res=await fetch(`${API}${path}`,{...options,headers:{'Content-Type':'application/json',...(token()?{Authorization:`Bearer ${token()}`}:{})}});const data=await res.json();if(!res.ok)throw new Error(data.message||'Request failed');return data}

export default function AdminReportsPage(){
  const [open,setOpen]=useState(false)
  const [refresh,setRefresh]=useState(0)
  return <div key={refresh}>
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7"><button type="button" onClick={()=>setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 font-black text-rb-900 shadow-xl transition hover:-translate-y-1"><Plus size={18}/>Add report</button></div>
    <AdminDataPage resource="reports"/>
    {open&&<ReportModal onClose={()=>setOpen(false)} onSaved={()=>{setOpen(false);setRefresh(value=>value+1)}}/>}
  </div>
}

function ReportModal({onClose,onSaved}){
  const [form,setForm]=useState({title:'',type:'impact',year:String(new Date().getFullYear()),fileUrl:'',summary:'',status:'draft'})
  const [state,setState]=useState({busy:false,error:''})
  useEffect(()=>{const onKey=e=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[onClose])
  async function submit(event){event.preventDefault();if(!form.title.trim())return setState({busy:false,error:'Report title is required.'});setState({busy:true,error:''});try{await request('/reports',{method:'POST',body:JSON.stringify({...form,year:form.year?Number(form.year):null})});onSaved()}catch(error){setState({busy:false,error:error.message})}}
  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-rb-900/70 p-3 backdrop-blur-sm sm:p-4"><div className="mx-auto my-6 w-full max-w-2xl rounded-[2rem] bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-rb-600">Publish content</p><h2 className="mt-1 text-2xl font-black text-rb-900">Add report</h2></div><button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-rb-50" aria-label="Close"><X size={18}/></button></div><form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-2 block text-sm font-black">Report title</span><input className={input} value={form.title} onChange={e=>setForm(v=>({...v,title:e.target.value}))} required/></label><label><span className="mb-2 block text-sm font-black">Report type</span><input className={input} value={form.type} onChange={e=>setForm(v=>({...v,type:e.target.value}))} placeholder="Annual, impact, governance…"/></label><label><span className="mb-2 block text-sm font-black">Year</span><input className={input} type="number" min="1900" max="2200" value={form.year} onChange={e=>setForm(v=>({...v,year:e.target.value}))}/></label><label className="sm:col-span-2"><span className="mb-2 block text-sm font-black">Document URL</span><input className={input} type="url" value={form.fileUrl} onChange={e=>setForm(v=>({...v,fileUrl:e.target.value}))} placeholder="https://…"/><span className="mt-2 block text-xs text-slate-500">Use the final public PDF/document URL. The public Reports page opens this link directly.</span></label><label className="sm:col-span-2"><span className="mb-2 block text-sm font-black">Summary</span><textarea className={`${input} min-h-28 resize-y`} value={form.summary} onChange={e=>setForm(v=>({...v,summary:e.target.value}))}/></label><label><span className="mb-2 block text-sm font-black">Status</span><CustomSelect value={form.status} onChange={status=>setForm(v=>({...v,status}))} options={['draft','published','archived'].map(value=>({value,label:value}))}/></label>{state.error&&<p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 sm:col-span-2">{state.error}</p>}<div className="flex flex-col-reverse gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-full bg-rb-50 px-5 py-3 font-black">Cancel</button><button disabled={state.busy} className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-black disabled:opacity-50"><Save size={16}/>{state.busy?'Saving…':'Save report'}</button></div></form></div></div>
}
