import { FileUp, Plus, Save, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import CustomSelect from '../components/form/CustomSelect'
import AdminDataPage from './AdminDataPages'

const API='/api/admin'
const input='w-full rounded-2xl border border-rb-100 bg-white px-4 py-3.5 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10'
async function request(path,options={}){const res=await fetch(`${API}${path}`,{...options,credentials:'same-origin',headers:{'Content-Type':'application/json',...(options.headers||{})}});const data=await res.json();if(!res.ok)throw new Error(data.message||'Request failed');return data}
async function uploadReport(file){
  if(!file)return ''
  if(file.type!=='application/pdf')throw new Error('Please choose a PDF file.')
  if(file.size>25*1024*1024)throw new Error('Report PDF must be 25 MB or smaller.')
  const signatureResponse=await fetch('/api/admin/media/signature',{method:'POST',credentials:'same-origin'})
  const signatureData=await signatureResponse.json().catch(()=>({}))
  if(!signatureResponse.ok||!signatureData.success)throw new Error(signatureData.message||'Unable to prepare upload.')
  const formData=new FormData()
  formData.append('file',file)
  formData.append('api_key',signatureData.apiKey)
  formData.append('timestamp',String(signatureData.timestamp))
  formData.append('signature',signatureData.signature)
  formData.append('folder',signatureData.folder)
  const uploadResponse=await fetch(signatureData.uploadUrl,{method:'POST',body:formData})
  const uploadData=await uploadResponse.json().catch(()=>({}))
  if(!uploadResponse.ok||!uploadData.secure_url)throw new Error(uploadData.error?.message||'Report upload failed.')
  return uploadData.secure_url
}

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
  const [state,setState]=useState({busy:false,error:'',uploading:false})
  const fileRef=useRef(null)
  useEffect(()=>{const onKey=e=>{if(e.key==='Escape'&&!state.busy&&!state.uploading)onClose()};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[onClose,state.busy,state.uploading])
  async function chooseFile(event){
    const file=event.target.files?.[0]
    if(!file)return
    setState(current=>({...current,uploading:true,error:''}))
    try{
      const url=await uploadReport(file)
      setForm(value=>({...value,fileUrl:url}))
      setState(current=>({...current,uploading:false,error:''}))
    }catch(error){setState(current=>({...current,uploading:false,error:error.message}))}
    finally{event.target.value=''}
  }
  async function submit(event){event.preventDefault();if(!form.title.trim())return setState(current=>({...current,error:'Report title is required.'}));if(form.status==='published'&&!form.fileUrl.trim())return setState(current=>({...current,error:'Upload or enter a document URL before publishing this report.'}));setState(current=>({...current,busy:true,error:''}));try{await request('/reports',{method:'POST',body:JSON.stringify({...form,year:form.year?Number(form.year):null})});onSaved()}catch(error){setState(current=>({...current,busy:false,error:error.message}))}}
  const locked=state.busy||state.uploading
  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-rb-900/70 p-3 backdrop-blur-sm sm:p-4"><div className="mx-auto my-6 w-full max-w-2xl rounded-[2rem] bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-rb-600">Publish content</p><h2 className="mt-1 text-2xl font-black text-rb-900">Add report</h2></div><button type="button" disabled={locked} onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-rb-50 disabled:opacity-40" aria-label="Close"><X size={18}/></button></div><form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-2 block text-sm font-black">Report title</span><input className={input} value={form.title} onChange={e=>setForm(v=>({...v,title:e.target.value}))} required/></label><label><span className="mb-2 block text-sm font-black">Report type</span><input className={input} value={form.type} onChange={e=>setForm(v=>({...v,type:e.target.value}))} placeholder="Annual, impact, governance…"/></label><label><span className="mb-2 block text-sm font-black">Year</span><input className={input} type="number" min="1900" max="2200" value={form.year} onChange={e=>setForm(v=>({...v,year:e.target.value}))}/></label><div className="sm:col-span-2"><span className="mb-2 block text-sm font-black">Report document</span><input ref={fileRef} type="file" accept="application/pdf,.pdf" onChange={chooseFile} className="hidden"/><button type="button" disabled={locked} onClick={()=>fileRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-rb-200 bg-rb-50/60 px-4 py-5 font-black text-rb-800 transition hover:border-gold hover:bg-gold/5 disabled:opacity-50"><FileUp size={19}/>{state.uploading?'Uploading PDF…':'Upload report PDF'}</button><p className="mt-2 text-xs text-slate-500">PDF only, maximum 25 MB. The uploaded file is stored in Cloudinary and its public URL is filled below automatically.</p></div><label className="sm:col-span-2"><span className="mb-2 block text-sm font-black">Document URL</span><input className={input} type="url" value={form.fileUrl} onChange={e=>setForm(v=>({...v,fileUrl:e.target.value}))} placeholder="https://…"/><span className="mt-2 block text-xs text-slate-500">You can still paste an external public PDF URL instead of uploading a file.</span></label><label className="sm:col-span-2"><span className="mb-2 block text-sm font-black">Summary</span><textarea className={`${input} min-h-28 resize-y`} value={form.summary} onChange={e=>setForm(v=>({...v,summary:e.target.value}))}/></label><label><span className="mb-2 block text-sm font-black">Status</span><CustomSelect value={form.status} onChange={status=>setForm(v=>({...v,status}))} options={['draft','published','archived'].map(value=>({value,label:value}))}/></label>{state.error&&<p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 sm:col-span-2">{state.error}</p>}<div className="flex flex-col-reverse gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end"><button type="button" disabled={locked} onClick={onClose} className="rounded-full bg-rb-50 px-5 py-3 font-black disabled:opacity-40">Cancel</button><button disabled={locked} className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-black disabled:opacity-50"><Save size={16}/>{state.busy?'Saving…':state.uploading?'Uploading…':'Save report'}</button></div></form></div></div>
}
