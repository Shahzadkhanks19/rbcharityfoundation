const COOKIE_NAME = 'rb_admin_session'
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/api/admin',
    maxAge: EIGHT_HOURS_MS,
  }
}

export function readAdminSessionCookie(req) {
  const cookieHeader = String(req.headers.cookie || '')
  for (const part of cookieHeader.split(';')) {
    const [rawName, ...rawValue] = part.trim().split('=')
    if (rawName === COOKIE_NAME) return decodeURIComponent(rawValue.join('=') || '')
  }
  return ''
}

export function adminSessionMiddleware(req, res, next) {
  if (req.method === 'POST' && req.path === '/logout') {
    res.clearCookie(COOKIE_NAME, cookieOptions())
    return res.json({ success: true, message: 'Logged out successfully.' })
  }

  if (req.method === 'POST' && req.path === '/login') {
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      if (res.statusCode < 400 && body?.success && body?.token) {
        res.cookie(COOKIE_NAME, body.token, cookieOptions())
        const { token: _token, ...safeBody } = body
        return originalJson(safeBody)
      }
      return originalJson(body)
    }
  }

  next()
}
