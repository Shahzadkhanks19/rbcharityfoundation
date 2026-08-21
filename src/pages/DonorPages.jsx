import { Eye, EyeOff, Heart, KeyRound, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { PageSkeleton } from '../components/system/SystemUI'

const API = '/api/donor'
const field = 'w-full rounded-2xl border border-rb-100 bg-white px-4 py-3.5 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10'
const getToken = () => localStorage.getItem('rbDonorToken') || ''
const clearToken = () => localStorage.removeItem('rbDonorToken')

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {})
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

function PasswordField({ value, onChange, placeholder = 'Password', autoComplete = 'current-password' }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input className={`${field} pr-12`} type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} required />
      <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-rb-700 transition hover:bg-rb-50" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

function AuthFrame({ title, copy, children }) {
  return (
    <div className="min-h-screen bg-rb-900 px-4 py-10 sm:px-5 sm:py-16">
      <div className="mx-auto max-w-md">
        <Link to="/" className="text-sm font-black text-white/70">← Back to foundation</Link>
        <div className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-7">
          <span className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Donor account</span>
          <h1 className="mt-3 text-3xl font-black text-rb-900">{title}</h1>
          <p className="mt-2 leading-7 text-slate-600">{copy}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function DonorAuthPage({ mode }) {
  const register = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await request(register ? '/register' : '/login', { method: 'POST', body: JSON.stringify(form) })
      localStorage.setItem('rbDonorToken', data.token)
      navigate('/donor/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthFrame title={register ? 'Create your account' : 'Welcome back'} copy={register ? 'Keep your donation history and supported campaigns together.' : 'Sign in to view your contribution history.'}>
      <form onSubmit={submit} className="mt-7 space-y-4">
        {register && <><input className={field} placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /><input className={field} placeholder="Mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></>}
        <input className={field} type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="username" required />
        <PasswordField value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {error && <Notice type="error" text={error} />}
        {!register && <div className="flex justify-end"><Link to="/donor/forgot-password" className="text-sm font-black text-rb-700">Forgot password?</Link></div>}
        <button disabled={busy} className="w-full rounded-full bg-rb-900 px-5 py-3.5 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50">{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">{register ? 'Already registered?' : 'New donor?'} <Link className="font-black text-rb-700" to={register ? '/donor/login' : '/donor/register'}>{register ? 'Sign in' : 'Create account'}</Link></p>
    </AuthFrame>
  )
}

export function DonorForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ busy: false, error: '', message: '', devResetUrl: '' })
  async function submit(event) {
    event.preventDefault()
    setState({ busy: true, error: '', message: '', devResetUrl: '' })
    try {
      const data = await request('/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
      setState({ busy: false, error: '', message: data.message, devResetUrl: data.devResetUrl || '' })
    } catch (error) {
      setState({ busy: false, error: error.message, message: '', devResetUrl: '' })
    }
  }
  return <AuthFrame title="Forgot password" copy="Enter your donor email and we'll prepare a secure reset link."><form onSubmit={submit} className="mt-7 space-y-4"><input className={field} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />{state.error && <Notice type="error" text={state.error} />}{state.message && <Notice type="success" text={state.message} />}{state.devResetUrl && <a className="block break-all rounded-2xl bg-[#fff8ea] p-4 text-sm font-bold text-rb-700" href={state.devResetUrl}>Development reset link</a>}<button disabled={state.busy} className="w-full rounded-full bg-rb-900 px-5 py-3.5 font-black text-white disabled:opacity-50">{state.busy ? 'Preparing link…' : 'Send reset link'}</button><Link to="/donor/login" className="block text-center text-sm font-black text-rb-700">Back to login</Link></form></AuthFrame>
}

export function DonorResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [state, setState] = useState({ busy: false, error: '' })
  const email = params.get('email') || ''
  const token = params.get('token') || ''
  async function submit(event) {
    event.preventDefault()
    if (form.password !== form.confirm) return setState({ busy: false, error: 'Passwords do not match.' })
    setState({ busy: true, error: '' })
    try {
      await request('/reset-password', { method: 'POST', body: JSON.stringify({ email, token, password: form.password }) })
      navigate('/donor/login', { replace: true })
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }
  return <AuthFrame title="Reset password" copy="Choose a new donor-account password of at least 8 characters."><form onSubmit={submit} className="mt-7 space-y-4"><PasswordField value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="New password" autoComplete="new-password" /><PasswordField value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Confirm new password" autoComplete="new-password" />{state.error && <Notice type="error" text={state.error} />}<button disabled={state.busy || !email || !token} className="w-full rounded-full bg-rb-900 px-5 py-3.5 font-black text-white disabled:opacity-50">{state.busy ? 'Resetting…' : 'Reset password'}</button></form></AuthFrame>
}

const nav = [['Dashboard','/donor/dashboard'],['My donations','/donor/donations'],['Receipts','/donor/receipts'],['Supported campaigns','/donor/campaigns'],['Profile','/donor/profile']]
function DonorShell({ children }) {
  const navigate = useNavigate()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [loc.pathname])
  const logout = () => { clearToken(); navigate('/donor/login', { replace: true }) }
  const links = nav.map(([label, path]) => <Link key={path} to={path} className={`block rounded-2xl px-4 py-3 text-sm font-bold transition ${loc.pathname === path ? 'bg-gold text-rb-900' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>{label}</Link>)
  return <div className="min-h-screen overflow-x-hidden bg-rb-50"><aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-rb-900 p-3 text-white lg:flex"><div className="px-3 py-5"><Link to="/" className="font-black">RB CHARITY FOUNDATION</Link><p className="mt-1 text-xs uppercase tracking-[.16em] text-white/40">Donor portal</p></div><nav className="flex-1 overflow-y-auto">{links}</nav><button onClick={logout} className="mt-3 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white/70 hover:bg-white/10"><LogOut size={16}/>Logout</button></aside><div className="min-h-screen min-w-0 lg:pl-60"><header className="sticky top-0 z-30 border-b border-rb-100 bg-white/95 backdrop-blur"><div className="flex min-h-[70px] items-center justify-between gap-3 px-4 py-3 sm:px-6"><div className="flex min-w-0 items-center gap-3"><button onClick={() => setOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rb-50 lg:hidden" aria-label="Open donor navigation"><Menu size={20}/></button><div className="min-w-0"><p className="truncate font-black text-rb-900">Donor Portal</p><p className="hidden text-xs text-slate-400 sm:block">Your RB Charity contribution account</p></div></div><button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-rb-900 px-3 py-2 text-xs font-black text-white sm:px-4 sm:text-sm"><LogOut size={15}/><span className="hidden sm:inline">Logout</span></button></div></header><main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main></div>{open && <div className="fixed inset-0 z-50 lg:hidden"><button onClick={() => setOpen(false)} className="absolute inset-0 bg-rb-900/55 backdrop-blur-sm" aria-label="Close donor navigation"/><aside className="absolute inset-y-0 left-0 flex w-[min(86vw,310px)] flex-col bg-rb-900 p-3 text-white shadow-2xl"><div className="flex items-center justify-between px-3 py-4"><div><p className="font-black">RB CHARITY</p><p className="text-xs uppercase tracking-[.16em] text-white/40">Donor portal</p></div><button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><X size={20}/></button></div><nav className="flex-1 overflow-y-auto">{links}</nav><button onClick={logout} className="mt-3 flex items-center gap-2 rounded-2xl px-4 py-3 font-bold text-white/70"><LogOut size={16}/>Logout</button></aside></div>}</div>
}

function useProtected(path) {
  const [state, setState] = useState({ loading: true, data: null, error: '' })
  useEffect(() => {
    if (!getToken()) return setState({ loading: false, data: null, error: 'unauthorized' })
    request(path).then(data => setState({ loading: false, data, error: '' })).catch(err => {
      if (/session|log in|expired|valid/i.test(err.message)) clearToken()
      setState({ loading: false, data: null, error: err.message })
    })
  }, [path])
  return state
}
const Loading = () => <PageSkeleton cards={4}/>
const Money = ({ value }) => <>₹{Number(value || 0).toLocaleString('en-IN')}</>

export function DonorDashboardPage() {
  const s = useProtected('/dashboard')
  if (s.error === 'unauthorized') return <Navigate to="/donor/login" replace/>
  return <DonorShell>{s.loading ? <Loading/> : <><h1 className="text-3xl font-black text-rb-900 sm:text-4xl">Your impact dashboard</h1><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Total contributed',<Money value={s.data.summary.totalContributed}/>],['Donation records',s.data.summary.totalDonations],['Completed donations',s.data.summary.paidDonations],['Campaigns supported',s.data.summary.campaignsSupported]].map(([a,b]) => <div key={a} className="rounded-3xl bg-white p-5 shadow-sm sm:p-6"><p className="text-sm font-bold text-slate-500">{a}</p><p className="mt-2 break-words text-2xl font-black text-rb-900 sm:text-3xl">{b}</p></div>)}</div><DonationList items={s.data.recent} title="Recent donations"/></>}</DonorShell>
}

function DonationList({ items = [], title = 'My donations' }) {
  return <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm sm:p-6"><h2 className="text-xl font-black text-rb-900 sm:text-2xl">{title}</h2><div className="mt-5 space-y-3">{items.length ? items.map(item => <div key={item._id} className="flex flex-col gap-3 rounded-2xl border border-rb-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="break-words font-black text-rb-900">{item.cause || 'General Fund'}</p><p className="mt-1 break-words text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString('en-IN')} · {item.status}</p></div><p className="shrink-0 text-xl font-black text-rb-800"><Money value={item.amount}/></p></div>) : <p className="text-slate-500">No donation records yet.</p>}</div></section>
}

export function DonorDonationsPage() { const s = useProtected('/donations'); if (s.error === 'unauthorized') return <Navigate to="/donor/login" replace/>; return <DonorShell>{s.loading ? <Loading/> : <><h1 className="text-3xl font-black text-rb-900 sm:text-4xl">My donations</h1><DonationList items={s.data.donations}/></>}</DonorShell> }
export function DonorReceiptsPage() { const s = useProtected('/donations'); if (s.error === 'unauthorized') return <Navigate to="/donor/login" replace/>; const paid = s.data?.donations?.filter(x => x.status === 'paid') || []; return <DonorShell>{s.loading ? <Loading/> : <><h1 className="text-3xl font-black text-rb-900 sm:text-4xl">Receipts</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Receipts will become downloadable here when payment verification and receipt generation are enabled.</p><DonationList items={paid} title="Completed contributions"/></>}</DonorShell> }
export function DonorCampaignsPage() { const s = useProtected('/donations'); if (s.error === 'unauthorized') return <Navigate to="/donor/login" replace/>; const campaigns = [...new Map((s.data?.donations || []).filter(x => x.campaignSlug).map(x => [x.campaignSlug,x])).values()]; return <DonorShell>{s.loading ? <Loading/> : <><h1 className="text-3xl font-black text-rb-900 sm:text-4xl">Supported campaigns</h1><div className="mt-7 grid gap-4 md:grid-cols-2">{campaigns.length ? campaigns.map(x => <Link to={`/campaigns/${x.campaignSlug}`} key={x.campaignSlug} className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-1 sm:p-6"><Heart className="text-rb-700"/><h2 className="mt-4 break-words text-xl font-black text-rb-900">{x.cause}</h2><p className="mt-2 text-slate-500">View campaign</p></Link>) : <p className="text-slate-500">You have not supported a campaign yet.</p>}</div></>}</DonorShell> }

export function DonorProfilePage() {
  const s = useProtected('/me')
  const [form, setForm] = useState(null)
  const [message, setMessage] = useState('')
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [passwordState, setPasswordState] = useState({ busy: false, error: '', message: '' })
  useEffect(() => { if (s.data?.donor) setForm({ name: s.data.donor.name, phone: s.data.donor.phone || '' }) }, [s.data])
  if (s.error === 'unauthorized') return <Navigate to="/donor/login" replace/>
  async function save(event) { event.preventDefault(); const data = await request('/me', { method: 'PATCH', body: JSON.stringify(form) }); setForm({ name: data.donor.name, phone: data.donor.phone || '' }); setMessage('Profile updated.') }
  async function changePassword(event) { event.preventDefault(); if (passwords.newPassword !== passwords.confirm) return setPasswordState({ busy: false, error: 'New passwords do not match.', message: '' }); setPasswordState({ busy: true, error: '', message: '' }); try { const data = await request('/change-password', { method: 'POST', body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }) }); setPasswordState({ busy: false, error: '', message: data.message }); setPasswords({ currentPassword: '', newPassword: '', confirm: '' }) } catch (error) { setPasswordState({ busy: false, error: error.message, message: '' }) } }
  return <DonorShell>{s.loading || !form ? <Loading/> : <><h1 className="text-3xl font-black text-rb-900 sm:text-4xl">Profile</h1><div className="mt-7 grid gap-6 xl:grid-cols-2"><form onSubmit={save} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm sm:p-7"><UserRound className="text-rb-700"/><h2 className="text-xl font-black text-rb-900">Personal details</h2><input className={field} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/><input className={field} value={form.phone} placeholder="Mobile number" onChange={e => setForm({ ...form, phone: e.target.value })}/><p className="break-all text-sm text-slate-500">Email: {s.data.donor.email}</p>{message && <Notice type="success" text={message}/>}<button className="w-full rounded-full bg-rb-900 px-5 py-3 font-black text-white sm:w-auto">Save changes</button></form><form onSubmit={changePassword} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm sm:p-7"><KeyRound className="text-rb-700"/><h2 className="text-xl font-black text-rb-900">Change password</h2><PasswordField value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} placeholder="Current password"/><PasswordField value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="New password" autoComplete="new-password"/><PasswordField value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="Confirm new password" autoComplete="new-password"/>{passwordState.error && <Notice type="error" text={passwordState.error}/>} {passwordState.message && <Notice type="success" text={passwordState.message}/>}<button disabled={passwordState.busy} className="w-full rounded-full bg-rb-900 px-5 py-3 font-black text-white disabled:opacity-50 sm:w-auto">{passwordState.busy ? 'Updating…' : 'Change password'}</button></form></div></>}</DonorShell>
}

function Notice({ type, text }) { return <p className={`rounded-2xl p-3 text-sm font-bold ${type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{text}</p> }
