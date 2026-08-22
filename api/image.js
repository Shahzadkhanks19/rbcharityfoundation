const githubHost = 'media.githubusercontent.com'
const cloudinaryHost = 'res.cloudinary.com'

function clampWidth(value) {
  const width = Number(value || 1200)
  if (!Number.isFinite(width)) return 1200
  return Math.max(320, Math.min(2200, Math.round(width)))
}

function transformCloudinaryUrl(source, width) {
  if (!source.includes('/upload/')) return source
  return source.replace('/upload/', `/upload/f_auto,q_auto:good,w_${width},c_limit/`)
}

export default function handler(req, res) {
  const requestUrl = new URL(req.url, 'https://rbcharityfoundation.vercel.app')
  const rawSource = requestUrl.searchParams.get('src') || ''
  const width = clampWidth(requestUrl.searchParams.get('w'))

  let source
  try {
    source = new URL(rawSource)
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid image source.' })
  }

  if (source.protocol !== 'https:' || ![githubHost, cloudinaryHost].includes(source.hostname)) {
    return res.status(400).json({ success: false, message: 'Image source is not allowed.' })
  }

  let destination = source.toString()

  if (source.hostname === cloudinaryHost) {
    destination = transformCloudinaryUrl(destination, width)
  } else {
    const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || '').trim()
    if (cloudName) {
      destination = `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto:good,w_${width},c_limit/${encodeURIComponent(destination)}`
    }
  }

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800')
  res.redirect(307, destination)
}
