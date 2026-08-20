import jwt from 'jsonwebtoken'

export function requireAdmin(req, res, next) {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(503).json({ success: false, message: 'JWT_SECRET is not configured on the server.' })
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ success: false, message: 'Admin login required.' })
    const payload = jwt.verify(token, secret)
    if (payload.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required.' })
    req.admin = payload
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Admin session expired. Please log in again.' })
  }
}
