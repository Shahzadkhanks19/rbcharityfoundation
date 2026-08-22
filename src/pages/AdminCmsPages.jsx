import { Edit3, FileText, ImageIcon, Loader2, Plus, Save, Trash2, UploadCloud, Video, X } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AdminShell from '../components/admin/AdminShell'
import CustomSelect from '../components/form/CustomSelect'
import { PageSkeleton } from '../components/system/SystemUI'

const API = '/api/admin'
const input = 'w-full rounded-2xl border border-rb-100 bg-white px-4 py-3.5 text-rb-900 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10'
const textarea = `${input} min-h-28 resize-y`

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

const configs = {
  campaigns: {
    title: 'Campaigns', primary: 'title', secondary: 'summary', statuses: ['draft', 'active', 'completed', 'paused', 'archived'],
    fields: [['title', 'Campaign title'], ['slug', 'URL slug'], ['cause', 'Cause', 'cause'], ['summary', 'Short summary', 'textarea'], ['description', 'Full description', 'textarea'], ['goalAmount', 'Funding goal'], ['coverImage', 'Cover image', 'mediaImage'], ['startsAt', 'Start date'], ['endsAt', 'End date'], ['featured', 'Featured campaign', 'boolean'], ['status', 'Status', 'status']]
  },
  causes: {
    title: 'Causes', primary: 'name', secondary: 'summary', statuses: ['draft', 'published', 'archived'],
    fields: [['name', 'Cause name'], ['slug', 'URL slug'], ['summary', 'Short summary', 'textarea'], ['description', 'Full description', 'textarea'], ['image', 'Cause image', 'mediaImage'], ['order', 'Display order'], ['status', 'Status', 'status']]
  },
  stories: {
    title: 'Stories', primary: 'title', secondary: 'excerpt', statuses: ['draft', 'published', 'archived'],
    fields: [['title', 'Story title'], ['slug', 'URL slug'], ['excerpt', 'Excerpt', 'textarea'], ['content', 'Story content', 'textarea'], ['coverImage', 'Cover image', 'mediaImage'], ['publishedAt', 'Publish date'], ['status', 'Status', 'status']]
  },
  gallery: {
    title: 'Gallery', primary: 'title', secondary: 'caption', statuses: ['draft', 'published', 'archived'],
    fields: [['title', 'Title'], ['mediaType', 'Media type', 'mediaType'], ['mediaUrl', 'Gallery media', 'media'], ['category', 'Category'], ['caption', 'Caption', 'textarea'], ['order', 'Display order'], ['status', 'Status', 'status']]
  }
}

export default function AdminCmsPage({ resource }) {
  const config = configs[resource]
  const loc = useLocation()
  const [state, setState] = useState({ loading: true, items: [], error: '' })
  const [editor, setEditor] = useState(null)
  const [remove, setRemove] = useState(null)

  const load = () => {
    setState(current => ({ ...current, loading: true, error: '' }))
    request(`/${resource}`)
      .then(data => setState({ loading: false, items: data.items || [], error: '' }))
      .catch(error => setState({ loading: false, items: [], error: error.message }))
  }

  useEffect(load, [resource, loc.key])

  const sorted = useMemo(() => [...state.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [state.items])

  async function quickStatus(item, status) {
    try {
      await request(`/${resource}/${item._id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      load()
    } catch (error) {
      setState(current => ({ ...current, error: error.message }))
    }
  }

  async function confirmDelete() {
    try {
      await request(`/${resource}/${remove._id}`, { method: 'DELETE' })
      setRemove(null)
      load()
    } catch (error) {
      setState(current => ({ ...current, error: error.message }))
      setRemove(null)
    }
  }

  if (!config) return null

  return (
    <AdminShell>
      {state.loading ? <PageSkeleton cards={5} /> : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.18em] text-rb-600">Content management</p>
              <h1 className="mt-2 break-words text-3xl font-black sm:text-4xl">{config.title}</h1>
              <p className="mt-2 max-w-2xl text-slate-500">Create, edit, publish and organise {config.title.toLowerCase()}.</p>
            </div>
            <button type="button" onClick={() => setEditor({ mode: 'create', item: {} })} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-black sm:w-auto"><Plus size={17} /> Add new</button>
          </div>

          {state.error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{state.error}</p>}

          <div className="mt-7 grid gap-4">
            {sorted.length ? sorted.map(item => (
              <article key={item._id} className="grid min-w-0 gap-4 rounded-3xl bg-white p-4 shadow-sm sm:p-5 lg:grid-cols-[minmax(0,1fr)_190px_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="min-w-0 break-words text-lg font-black">{item[config.primary] || 'Untitled'}</h2>
                    {resource === 'gallery' && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rb-50 px-2.5 py-1 text-xs font-bold text-rb-700">{item.mediaType === 'video' ? <Video size={13} /> : <ImageIcon size={13} />} {item.mediaType || 'image'}</span>}
                  </div>
                  <p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-slate-500">{item[config.secondary] || 'No description yet.'}</p>
                  {resource === 'campaigns' && <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-rb-700"><span>Goal: ₹{Number(item.goalAmount || 0).toLocaleString('en-IN')}</span><span>Cause: {item.cause?.name || 'Not linked'}</span></div>}
                </div>
                <CustomSelect value={item.status || config.statuses[0]} onChange={value => quickStatus(item, value)} options={config.statuses.map(value => ({ value, label: value }))} />
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditor({ mode: 'edit', item })} className="grid h-11 w-11 place-items-center rounded-full border border-rb-100 text-rb-700 transition hover:bg-rb-50" aria-label={`Edit ${item[config.primary]}`}><Edit3 size={17} /></button>
                  <button type="button" onClick={() => setRemove(item)} className="grid h-11 w-11 place-items-center rounded-full border border-red-100 text-red-600 transition hover:bg-red-50" aria-label={`Delete ${item[config.primary]}`}><Trash2 size={17} /></button>
                </div>
              </article>
            )) : (
              <div className="rounded-3xl border border-dashed border-rb-200 bg-white p-8 text-center sm:p-10">
                <FileText className="mx-auto text-rb-400" />
                <h2 className="mt-4 text-xl font-black">No {config.title.toLowerCase()} yet</h2>
              </div>
            )}
          </div>

          {editor && <EditorModal resource={resource} config={config} mode={editor.mode} item={editor.item} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); load() }} />}
          {remove && <ConfirmModal title={remove[config.primary]} onCancel={() => setRemove(null)} onConfirm={confirmDelete} />}
        </>
      )}
    </AdminShell>
  )
}

function EditorModal({ resource, config, mode, item, onClose, onSaved }) {
  const initial = Object.fromEntries(config.fields.map(([key, , type]) => [key, type === 'boolean' ? Boolean(item[key]) : formatInitial(key, item[key])]))
  if (resource === 'campaigns') initial.cause = item.cause?._id || item.cause || ''
  if (resource === 'gallery') {
    initial.mediaType = item.mediaType || 'image'
    initial.mediaUrl = item.mediaUrl || item.image || ''
  }

  const [form, setForm] = useState(initial)
  const [state, setState] = useState({ busy: false, error: '' })
  const [causeState, setCauseState] = useState({ loading: resource === 'campaigns', options: [], error: '' })

  useEffect(() => {
    if (resource !== 'campaigns') return undefined
    let active = true
    request('/causes')
      .then(data => {
        if (!active) return
        const currentCauseId = item.cause?._id || item.cause || ''
        const options = (data.items || [])
          .filter(cause => cause.status === 'published' || String(cause._id) === String(currentCauseId))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name))
          .map(cause => ({ value: String(cause._id), label: `${cause.name}${cause.status !== 'published' ? ` (${cause.status})` : ''}` }))
        setCauseState({ loading: false, options, error: '' })
      })
      .catch(error => {
        if (active) setCauseState({ loading: false, options: [], error: error.message })
      })
    return () => { active = false }
  }, [resource, item.cause])

  async function submit(event) {
    event.preventDefault()
    if (resource === 'campaigns' && ['active', 'completed'].includes(form.status) && !form.cause) {
      setState({ busy: false, error: 'Choose a cause before making this campaign active or completed.' })
      return
    }
    setState({ busy: true, error: '' })
    const payload = { ...form }
    ;['goalAmount', 'order'].forEach(key => { if (key in payload && payload[key] !== '') payload[key] = Number(payload[key]) })
    if (resource === 'gallery') payload.image = payload.mediaType === 'image' ? payload.mediaUrl : ''

    try {
      await request(mode === 'create' ? `/${resource}` : `/${resource}/${item._id}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        body: JSON.stringify(payload)
      })
      onSaved()
    } catch (error) {
      setState({ busy: false, error: error.message })
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-rb-900/70 p-3 backdrop-blur-sm sm:p-4">
      <div className="mx-auto my-3 w-full max-w-2xl rounded-[1.75rem] bg-white p-4 shadow-2xl sm:my-6 sm:rounded-[2rem] sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><p className="text-xs font-black uppercase tracking-[.16em] text-rb-600">{mode === 'create' ? 'Create' : 'Edit'}</p><h2 className="mt-1 break-words text-2xl font-black">{config.title}</h2></div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rb-50" aria-label="Close"><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          {config.fields.map(([key, label, type]) => (
            <Field key={key} fieldKey={key} label={label} type={type} value={form[key]} statuses={config.statuses} mediaType={form.mediaType || 'image'} causeOptions={causeState.options} causeLoading={causeState.loading} onChange={value => setForm(current => ({ ...current, [key]: value }))} />
          ))}

          {causeState.error && <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800 sm:col-span-2">Unable to load causes: {causeState.error}</p>}
          {state.error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700 sm:col-span-2">{state.error}</p>}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="w-full rounded-full bg-rb-50 px-5 py-3 font-black sm:w-auto">Cancel</button>
            <button disabled={state.busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-black disabled:opacity-50 sm:w-auto"><Save size={16} />{state.busy ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ fieldKey, label, type, value, statuses, mediaType, causeOptions = [], causeLoading = false, onChange }) {
  const wide = ['summary', 'description', 'content', 'caption', 'mediaUrl', 'coverImage', 'image'].includes(fieldKey)
  if (type === 'textarea') return <label className={`block min-w-0 ${wide ? 'sm:col-span-2' : ''}`}><span className="mb-2 block text-sm font-black">{label}</span><textarea className={textarea} value={value || ''} onChange={event => onChange(event.target.value)} /></label>
  if (type === 'status') return <label className="block min-w-0"><span className="mb-2 block text-sm font-black">{label}</span><CustomSelect value={value || statuses[0]} onChange={onChange} options={statuses.map(option => ({ value: option, label: option }))} /></label>
  if (type === 'cause') return <label className="block min-w-0"><span className="mb-2 block text-sm font-black">{label}</span><CustomSelect value={value || ''} onChange={onChange} disabled={causeLoading} placeholder={causeLoading ? 'Loading causes…' : causeOptions.length ? 'Select a cause' : 'No published causes'} options={[{ value: '', label: 'No cause linked' }, ...causeOptions]} /></label>
  if (type === 'mediaType') return <label className="block min-w-0"><span className="mb-2 block text-sm font-black">{label}</span><CustomSelect value={value || 'image'} onChange={onChange} options={[{ value: 'image', label: 'Image' }, { value: 'video', label: 'Video' }]} /></label>
  if (type === 'boolean') return <label className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-rb-100 bg-rb-50 px-4 py-3.5"><span className="font-black">{label}</span><button type="button" onClick={() => onChange(!value)} className={`relative h-7 w-12 shrink-0 rounded-full transition ${value ? 'bg-rb-900' : 'bg-slate-300'}`} aria-pressed={Boolean(value)}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${value ? 'left-6' : 'left-1'}`} /></button></label>
  if (type === 'mediaImage' || type === 'media') return <MediaField label={label} value={value} mediaType={type === 'mediaImage' ? 'image' : mediaType} onChange={onChange} />
  const inputType = ['startsAt', 'endsAt', 'publishedAt'].includes(fieldKey) ? 'date' : 'text'
  return <label className={`block min-w-0 ${wide ? 'sm:col-span-2' : ''}`}><span className="mb-2 block text-sm font-black">{label}</span><input className={input} type={inputType} value={value ?? ''} onChange={event => onChange(event.target.value)} /></label>
}

function MediaField({ label, value, mediaType, onChange }) {
  const rawId = useId()
  const fileId = `media-${rawId.replace(/:/g, '')}`
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const accept = mediaType === 'video' ? 'video/*' : 'image/*'

  async function upload(file) {
    if (!file) return
    const isVideo = mediaType === 'video'
    const validType = isVideo ? file.type.startsWith('video/') : file.type.startsWith('image/')
    if (!validType) { setError(`Please choose a valid ${isVideo ? 'video' : 'image'} file.`); return }
    const maxBytes = isVideo ? 100 * 1024 * 1024 : 12 * 1024 * 1024
    if (file.size > maxBytes) { setError(`${isVideo ? 'Video' : 'Image'} must be smaller than ${isVideo ? '100 MB' : '12 MB'}.`); return }

    setUploading(true)
    setError('')
    try {
      const signed = await request('/media/signature', { method: 'POST', body: '{}' })
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', signed.apiKey)
      formData.append('timestamp', String(signed.timestamp))
      formData.append('signature', signed.signature)
      formData.append('folder', signed.folder)
      const response = await fetch(signed.uploadUrl, { method: 'POST', body: formData })
      const result = await response.json()
      if (!response.ok || !result.secure_url) throw new Error(result?.error?.message || 'Media upload failed.')
      onChange(result.secure_url)
    } catch (uploadError) {
      setError(uploadError.message || 'Media upload failed.')
    } finally { setUploading(false) }
  }

  return <div className="min-w-0 sm:col-span-2">
    <span className="mb-2 block text-sm font-black">{label}</span>
    <div className="overflow-hidden rounded-2xl border border-rb-100 bg-rb-50/40">
      {value && <div className="border-b border-rb-100 bg-white p-3">{mediaType === 'video' ? <video src={value} controls preload="metadata" className="max-h-64 w-full rounded-xl bg-black object-contain" /> : <img src={value} alt={`${label} preview`} loading="lazy" decoding="async" className="max-h-64 w-full rounded-xl object-contain" />}</div>}
      <div className="p-4">
        <input id={fileId} type="file" accept={accept} className="hidden" onChange={event => { upload(event.target.files?.[0]); event.target.value = '' }} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor={fileId} className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-rb-900 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 ${uploading ? 'pointer-events-none opacity-60' : ''}`}>{uploading ? <Loader2 size={17} className="animate-spin" /> : <UploadCloud size={17} />}{uploading ? 'Uploading…' : `Upload ${mediaType === 'video' ? 'video' : 'image'}`}</label>
          <p className="text-xs leading-5 text-slate-500">{mediaType === 'video' ? 'Video up to 100 MB.' : 'Image up to 12 MB.'} Stored securely in Cloudinary.</p>
        </div>
        <div className="mt-3"><label className="text-xs font-black uppercase tracking-[.12em] text-slate-400">Or paste media URL</label><input className={`${input} mt-2`} type="url" value={value || ''} onChange={event => onChange(event.target.value)} placeholder="https://..." /></div>
        {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p>}
      </div>
    </div>
  </div>
}

function formatInitial(key, value) {
  if (!value) return ''
  if (['startsAt', 'endsAt', 'publishedAt'].includes(key)) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10)
  }
  return value
}

function ConfirmModal({ title, onCancel, onConfirm }) {
  return <div className="fixed inset-0 z-[110] grid place-items-center bg-rb-900/70 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-[2rem] bg-white p-5 shadow-2xl sm:p-6"><h2 className="text-2xl font-black">Delete this item?</h2><p className="mt-3 break-words leading-7 text-slate-600">“{title}” will be permanently removed.</p><div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="w-full rounded-full bg-rb-50 px-5 py-3 font-black sm:w-auto">Cancel</button><button type="button" onClick={onConfirm} className="w-full rounded-full bg-red-600 px-5 py-3 font-black text-white sm:w-auto">Delete</button></div></div></div>
}