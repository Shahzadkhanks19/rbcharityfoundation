import { Eye, EyeOff, KeyRound, LogOut, Menu, Save, Search, Settings2, ShieldCheck, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CustomSelect from '../components/form/CustomSelect'
import { PageSkeleton } from '../components/system/SystemUI'

const API = '/api/admin'
const input = 'w-full rounded-2xl border border-rb-100 bg-white px-4 py-3.5 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10'
const nav = [
  ['Dashboard', '/admin/dashboard'], ['Campaigns', '/admin/campaigns'], ['Causes', '/admin/causes'],
  ['Donations', '/admin/donations'], ['Donors', '/admin/donors'], ['Volunteers', '/admin/volunteers'],
  ['Partners', '/admin/partners'], ['Stories', '/admin/stories'], ['Messages', '/admin/messages'],
  ['Gallery', '/admin/gallery'], ['Reports', '/admin/reports'], ['Settings', '/admin/settings'], ['Activity', '/admin/activity']
]

const getToken = () => sessionStorage.getItem('rbAdminToken') || ''
const clearToken = () => {
  sessionStorage.removeItem('rbAdminToken')
  localStorage.removeItem('rbAdminToken')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

function Shell({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [location.pathname])

  const logout = () => {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  const links = nav.map(([label, path]) => (
    <Link
      key={path}
      to={path}
      className={`block rounded-2xl px-4 py-3 text-sm font-bold transition ${location.pathname === path ? 'bg-gold text-rb-900 shadow-sm' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}
    >
      {label}
    </Link>
  ))

  return (
    <div className="min-h-screen overflow-x-hidden bg-rb-50 text-rb-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-rb-900 text-white xl:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <Link to="/admin/dashboard" className="text-lg font-black">RB CHARITY</Link>
          <p className="mt-1 text-xs font-bold uppercase tracking-[.18em] text-white/40">Admin panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">{links}</nav>
        <div className="border-t border-white/10 p-3">
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      <div className="min-h-screen min-w-0 xl:pl-64">
        <header className="sticky top-0 z-30 border-b border-rb-100 bg-white/95 backdrop-blur">
          <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rb-50 xl:hidden" aria-label="Open admin navigation">
                <Menu size={21} />
              </button>
              <div className="min-w-0">
                <p className="truncate font-black">RB Charity Admin</p>
                <p className="hidden text-xs text-slate-400 sm:block">Foundation management console</p>
              </div>
            </div>
            <button type="button" onClick={logout} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rb-900 px-3 py-2 text-xs font-black text-white sm:px-4 sm:text-sm">
              <LogOut size={15} /><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button type="button" onClick={() => setOpen(false)} className="absolute inset-0 bg-rb-900/55 backdrop-blur-sm" aria-label="Close navigation" />
          <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-rb-900 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div><p className="font-black">RB CHARITY</p><p className="text-xs uppercase tracking-[.16em] text-white/40">Admin panel</p></div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10" aria-label="Close admin navigation"><X size={20} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">{links}</nav>
            <div className="border-t border-white/10 p-3">
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-bold text-white/70"><LogOut size={17} /> Logout</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

const settingGroups = [
  { title: 'Foundation contact', copy: 'Public contact information used across the site.', fields: [['contact.email', 'Contact email', 'email'], ['contact.phone', 'Contact phone', 'text'], ['contact.address', 'Address', 'textarea']] },
  { title: 'Social profiles', copy: 'Only add verified public profile URLs.', fields: [['social.instagram', 'Instagram URL', 'url'], ['social.facebook', 'Facebook URL', 'url'], ['social.youtube', 'YouTube URL', 'url']] },
  { title: 'Footer', copy: 'General footer information shown across public pages.', fields: [['footer.description', 'Footer description', 'textarea']] }
]

export function AdminSettingsPage() {
  const [state, setState] = useState({ loading: true, items: [], error: '', message: '' })
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    request('/settings')
      .then(data => {
        const items = data.items || []
        setState({ loading: false, items, error: '', message: '' })
        setValues(Object.fromEntries(items.map(item => [item.key, String(item.value ?? '')])))
      })
      .catch(error => setState({ loading: false, items: [], error: error.message, message: '' }))
  }, [])

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setState(current => ({ ...current, error: '', message: '' }))
    try {
      for (const group of settingGroups) {
        for (const [key] of group.fields) {
          const existing = state.items.find(item => item.key === key)
          const payload = { key, value: values[key] || '', group: key.split('.')[0] }
          if (existing) await request(`/settings/${existing._id}`, { method: 'PATCH', body: JSON.stringify(payload) })
          else await request('/settings', { method: 'POST', body: JSON.stringify(payload) })
        }
      }
      const fresh = await request('/settings')
      setState({ loading: false, items: fresh.items || [], error: '', message: 'Foundation settings saved successfully.' })
    } catch (error) {
      setState(current => ({ ...current, error: error.message, message: '' }))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Shell>
      {state.loading ? <PageSkeleton cards={4} /> : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Configuration</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">Foundation settings</h1>
              <p className="mt-2 max-w-2xl text-slate-500">Manage public contact details, social profiles and administrator security.</p>
            </div>
            <Settings2 className="hidden text-rb-600 sm:block" size={34} />
          </div>
          {state.error && <Notice type="error" text={state.error} />}
          {state.message && <Notice type="success" text={state.message} />}
          <form onSubmit={save} className="mt-7 space-y-5">
            {settingGroups.map(group => (
              <section key={group.title} className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-black sm:text-2xl">{group.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">{group.copy}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {group.fields.map(([key, label, type]) => (
                    <label key={key} className={type === 'textarea' ? 'md:col-span-2' : ''}>
                      <span className="mb-2 block text-sm font-black">{label}</span>
                      {type === 'textarea' ? (
                        <textarea className={`${input} min-h-28 resize-y`} value={values[key] || ''} onChange={e => setValues(current => ({ ...current, [key]: e.target.value }))} />
                      ) : (
                        <input className={input} type={type} value={values[key] || ''} onChange={e => setValues(current => ({ ...current, [key]: e.target.value }))} />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
            <div className="sticky bottom-3 z-10 flex justify-stretch sm:justify-end">
              <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-black text-rb-900 shadow-lg disabled:opacity-50 sm:w-auto">
                <Save size={17} />{saving ? 'Saving…' : 'Save settings'}
              </button>
            </div>
          </form>
          <ChangePasswordCard />
        </>
      )}
    </Shell>
  )
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input className={`${input} pr-12`} type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} required />
      <button type="button" onClick={() => setShow(current => !current)} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-rb-700 hover:bg-rb-50" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

function ChangePasswordCard() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [state, setState] = useState({ busy: false, error: '', message: '' })

  async function submit(event) {
    event.preventDefault()
    if (form.newPassword !== form.confirm) {
      setState({ busy: false, error: 'New passwords do not match.', message: '' })
      return
    }
    setState({ busy: true, error: '', message: '' })
    try {
      const data = await request('/change-password', { method: 'POST', body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) })
      setState({ busy: false, error: '', message: data.message })
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (error) {
      setState({ busy: false, error: error.message, message: '' })
    }
  }

  return (
    <section className="mt-7 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rb-50 text-rb-700"><KeyRound size={21} /></span>
        <div><h2 className="text-xl font-black sm:text-2xl">Admin password</h2><p className="mt-1 text-sm text-slate-500">Change the password used for this administrator account.</p></div>
      </div>
      <form onSubmit={submit} className="mt-5 grid gap-4 lg:grid-cols-3">
        <PasswordInput value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} placeholder="Current password" />
        <PasswordInput value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} placeholder="New password" />
        <PasswordInput value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Confirm new password" />
        <div className="lg:col-span-3">
          {state.error && <Notice type="error" text={state.error} />}
          {state.message && <Notice type="success" text={state.message} />}
          <button disabled={state.busy} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rb-900 px-5 py-3 font-black text-white disabled:opacity-50 sm:w-auto">
            <ShieldCheck size={17} />{state.busy ? 'Updating…' : 'Change password'}
          </button>
        </div>
      </form>
    </section>
  )
}

export function AdminActivityPage() {
  const [state, setState] = useState({ loading: true, items: [], error: '' })
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('all')
  const [resource, setResource] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    request('/activity')
      .then(data => setState({ loading: false, items: data.items || [], error: '' }))
      .catch(error => setState({ loading: false, items: [], error: error.message }))
  }, [])

  const actions = useMemo(() => [...new Set(state.items.map(item => item.action).filter(Boolean))].sort(), [state.items])
  const resources = useMemo(() => [...new Set(state.items.map(item => item.resource).filter(Boolean))].sort(), [state.items])
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return state.items.filter(item =>
      (action === 'all' || item.action === action) &&
      (resource === 'all' || item.resource === resource) &&
      (!query || [item.actor, item.action, item.resource, item.resourceId, item.details].some(value => String(value || '').toLowerCase().includes(query)))
    )
  }, [state.items, search, action, resource])

  useEffect(() => setPage(1), [search, action, resource])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pages)
  const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <Shell>
      {state.loading ? <PageSkeleton cards={5} /> : (
        <>
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Audit trail</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Activity log</h1>
            <p className="mt-2 text-slate-500">Read-only history of important administrative actions.</p>
          </div>
          {state.error && <Notice type="error" text={state.error} />}
          <section className="mt-7 rounded-3xl bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_200px_200px]">
              <label className="relative md:col-span-2 xl:col-span-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input value={search} onChange={e => setSearch(e.target.value)} className={`${input} pl-11`} placeholder="Search activity..." />
              </label>
              <CustomSelect value={action} onChange={setAction} options={[{ value: 'all', label: 'All actions' }, ...actions.map(value => ({ value, label: value }))]} />
              <CustomSelect value={resource} onChange={setResource} options={[{ value: 'all', label: 'All resources' }, ...resources.map(value => ({ value, label: value }))]} />
            </div>
          </section>
          <div className="mt-5 space-y-3">
            {items.length ? items.map(item => (
              <article key={item._id} className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-rb-50 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-rb-700">{item.action}</span>
                      {item.resource && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.resource}</span>}
                    </div>
                    <p className="mt-3 break-words font-black">{item.actor || 'admin'}</p>
                    {item.details && <p className="mt-2 break-words text-sm leading-6 text-slate-500">{item.details}</p>}
                    {item.resourceId && <p className="mt-2 break-all text-xs text-slate-400">ID: {item.resourceId}</p>}
                  </div>
                  <time className="shrink-0 text-xs font-semibold text-slate-400">{new Date(item.createdAt).toLocaleString('en-IN')}</time>
                </div>
              </article>
            )) : (
              <div className="rounded-3xl bg-white p-8 text-center text-slate-500">No activity matches your filters.</div>
            )}
          </div>
          {filtered.length > pageSize && (
            <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm sm:flex-row">
              <p className="text-center text-sm text-slate-500 sm:text-left">Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}</p>
              <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                <button disabled={safePage === 1} onClick={() => setPage(current => Math.max(1, current - 1))} className="rounded-full border border-rb-100 px-4 py-2 text-sm font-black disabled:opacity-30">Previous</button>
                <span className="text-sm font-black">{safePage} / {pages}</span>
                <button disabled={safePage === pages} onClick={() => setPage(current => Math.min(pages, current + 1))} className="rounded-full border border-rb-100 px-4 py-2 text-sm font-black disabled:opacity-30">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  )
}

function Notice({ type, text }) {
  return <p className={`mt-5 rounded-2xl p-4 text-sm font-bold ${type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{text}</p>
}
