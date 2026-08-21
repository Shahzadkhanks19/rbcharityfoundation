import { Router } from 'express'
import Partner from '../models/Partner.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/
const allowedTypes = new Set(['corporate', 'ngo', 'institution', 'community', 'other'])
const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max)

router.post('/', async (req, res) => {
  if (!Partner.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })

  const organisation = clean(req.body.organisation, 160)
  const contactName = clean(req.body.contactName, 100)
  const email = clean(req.body.email, 160).toLowerCase()
  const phone = clean(req.body.phone, 10)
  const type = clean(req.body.type || 'other', 30)
  const message = clean(req.body.message, 2500)

  if (organisation.length < 2) return res.status(400).json({ success: false, message: 'Please enter the organisation name' })
  if (contactName.length < 2) return res.status(400).json({ success: false, message: 'Please enter a contact person' })
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
  if (!phonePattern.test(phone)) return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' })
  if (!allowedTypes.has(type)) return res.status(400).json({ success: false, message: 'Please select a valid organisation type' })
  if (message.length < 10) return res.status(400).json({ success: false, message: 'Please tell us a little more about the partnership' })

  const recentDuplicate = await Partner.findOne({
    email,
    organisation,
    createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  }).lean()
  if (recentDuplicate) return res.status(409).json({ success: false, message: 'We already received this partnership enquiry recently.' })

  const partner = await Partner.create({ organisation, contactName, email, phone, type, message, status: 'new' })
  res.status(201).json({ success: true, message: 'Partnership enquiry received', partnerId: partner._id })
})

export default router
