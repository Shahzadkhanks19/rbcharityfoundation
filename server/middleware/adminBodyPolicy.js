const allowedFields = {
  campaigns: new Set(['title','slug','cause','summary','description','goalAmount','coverImage','startsAt','endsAt','status','featured']),
  causes: new Set(['name','slug','summary','description','image','status','order']),
  stories: new Set(['title','slug','excerpt','content','coverImage','cause','campaign','status','publishedAt']),
  gallery: new Set(['title','mediaType','mediaUrl','image','category','caption','status','order']),
  reports: new Set(['title','type','year','fileUrl','summary','status']),
  settings: new Set(['key','value','group']),
  donors: new Set(['status']),
  volunteers: new Set(['status']),
  partners: new Set(['status']),
  messages: new Set(['status']),
}

function cleanMixedValue(value, depth = 0) {
  if (depth > 4) return null
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => cleanMixedValue(item, depth + 1))
  if (!value || typeof value !== 'object') return value
  const safe = {}
  for (const [key, nested] of Object.entries(value)) {
    if (key.startsWith('$') || key.includes('.')) continue
    safe[key] = cleanMixedValue(nested, depth + 1)
  }
  return safe
}

export function adminBodyPolicy(req, res, next) {
  if (!['POST', 'PATCH'].includes(req.method)) return next()

  const [resource] = req.path.split('/').filter(Boolean)
  const fields = allowedFields[resource]
  if (!fields) return next()

  const source = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {}
  const filtered = {}
  for (const [key, value] of Object.entries(source)) {
    if (!fields.has(key)) continue
    filtered[key] = resource === 'settings' && key === 'value' ? cleanMixedValue(value) : value
  }

  req.body = filtered
  next()
}
