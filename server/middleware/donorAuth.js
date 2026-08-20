import jwt from 'jsonwebtoken'
import Donor from '../models/Donor.js'

export async function requireDonor(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ success: false, message: 'Please log in to continue.' })
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-only-change-me')
    const donor = await Donor.findById(payload.sub).select('-passwordHash')
    if (!donor || donor.status !== 'active') return res.status(401).json({ success: false, message: 'Your session is no longer valid.' })
    req.donor = donor
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' })
  }
}
