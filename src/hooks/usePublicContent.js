import { useEffect, useState } from 'react'

const cache = { data: null, promise: null }

async function loadContent() {
  if (cache.data) return cache.data
  if (!cache.promise) {
    cache.promise = fetch('/api/public/content')
      .then(async response => {
        if (!response.ok) throw new Error('Unable to load website content.')
        const data = await response.json()
        cache.data = data.content || {}
        return cache.data
      })
      .finally(() => { cache.promise = null })
  }
  return cache.promise
}

export default function usePublicContent() {
  const [state, setState] = useState({ loading: !cache.data, content: cache.data || {}, error: '' })

  useEffect(() => {
    let active = true
    loadContent()
      .then(content => { if (active) setState({ loading: false, content, error: '' }) })
      .catch(error => { if (active) setState({ loading: false, content: {}, error: error.message }) })
    return () => { active = false }
  }, [])

  return state
}

export function cmsValue(content, key, fallback) {
  const value = content?.[key]
  return value === undefined || value === null || String(value).trim() === '' ? fallback : value
}
