import jwt from 'jsonwebtoken'
import AdminAccount from '../models/AdminAccount.js'

export async function requireAdmin(req, res, next) {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(503).json({ success: false, message: 'JWT_SECRET is not configured on the server.' })
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ success: false, message: 'Admin login required.' })
    const payload = jwt.verify(token, secret)
    if (payload.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required.' })
    const admin = await AdminAccount.findById(payload.sub).lean()
    if (!admin || admin.status !== 'active') return res.status(401).json({ success: false, message: 'Admin session is no longer valid.' })
    req.admin = { id: String(admin._id), email: admin.email }
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Admin session expired. Please log in again.' })
  }
}
