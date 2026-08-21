import { LogOut, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const API='/api/admin'
const nav=[['Dashboard','/admin/dashboard'],['Campaigns','/admin/campaigns'],['Causes','/admin/causes'],['Donations','/admin/donations'],['Donors','/admin/donors'],['Volunteers','/admin/volunteers'],['Partners','/admin/partners'],['Stories','/admin/stories'],['Messages','/admin/messages'],['Gallery','/admin/gallery'],['Reports','/admin/reports'],['Settings','/admin/settings'],['Activity','/admin/activity']]
const clearLegacyTokens=()=>{sessionStorage.removeItem('rbAdminToken');localStorage.removeItem('rbAdminToken')}

async function logoutRequest(){
  const response=await fetch(`${API}/logout`,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'}})
  if(!response.ok)throw new Error('Logout failed')
}

export default function AdminShell({children}){
  const location=useLocation()
  const navigate=useNavigate()
  const [open,setOpen]=useState(false)

  useEffect(()=>setOpen(false),[location.pathname])

  async function logout(){
    try{await logoutRequest()}catch{}finally{
      clearLegacyTokens()
      navigate('/admin/login',{replace:true})
    }
  }

  const links=nav.map(([label,path])=><Link key={path} to={path} className={`block rounded-2xl px-4 py-3 text-sm font-bold transition ${location.pathname===path?'bg-gold text-rb-900 shadow-sm':'text-white/65 hover:bg-white/10 hover:text-white'}`}>{label}</Link>)

  return <div className="min-h-screen bg-rb-50 text-rb-900">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-rb-900 text-white xl:flex">
      <div className="border-b border-white/10 px-6 py-6"><Link to="/admin/dashboard" className="text-lg font-black">RB CHARITY</Link><p className="mt-1 text-xs font-bold uppercase tracking-[.18em] text-white/40">Admin panel</p></div>
      <nav className="flex-1 overflow-y-auto p-3">{links}</nav>
      <div className="border-t border-white/10 p-3"><button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"><LogOut size={17}/>Logout</button></div>
    </aside>

    <div className="min-h-screen xl:pl-64">
      <header className="sticky top-0 z-30 border-b border-rb-100 bg-white/95 backdrop-blur">
        <div className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={()=>setOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rb-50 text-rb-900 xl:hidden" aria-label="Open admin navigation"><Menu size={21}/></button>
            <div className="min-w-0"><p className="truncate font-black">RB Charity Admin</p><p className="hidden text-xs text-slate-400 sm:block">Foundation management console</p></div>
          </div>
          <button type="button" onClick={logout} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rb-900 px-3 py-2 text-xs font-black text-white sm:px-4 sm:text-sm"><LogOut size={15}/><span className="hidden sm:inline">Logout</span></button>
        </div>
      </header>
      <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>

    {open&&<div className="fixed inset-0 z-50 xl:hidden">
      <button type="button" aria-label="Close navigation" onClick={()=>setOpen(false)} className="absolute inset-0 bg-rb-900/55 backdrop-blur-sm"/>
      <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-rb-900 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5"><div><p className="font-black">RB CHARITY</p><p className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-white/40">Admin panel</p></div><button type="button" onClick={()=>setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10" aria-label="Close admin navigation"><X size={20}/></button></div>
        <nav className="flex-1 overflow-y-auto p-3">{links}</nav>
        <div className="border-t border-white/10 p-3"><button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-bold text-white/70"><LogOut size={17}/>Logout</button></div>
      </aside>
    </div>}
  </div>
}
