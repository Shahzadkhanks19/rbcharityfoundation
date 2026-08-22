const supportedRemoteHosts = new Set(['media.githubusercontent.com', 'res.cloudinary.com'])

export function optimizedPublicImage(value, width = 1200) {
  const source = String(value || '').trim()
  if (!source) return source

  let parsed
  try {
    parsed = new URL(source)
  } catch {
    return source
  }

  if (parsed.protocol !== 'https:' || !supportedRemoteHosts.has(parsed.hostname)) return source

  const safeWidth = Math.max(320, Math.min(2200, Math.round(Number(width) || 1200)))
  return `/api/image?src=${encodeURIComponent(source)}&w=${safeWidth}`
}
