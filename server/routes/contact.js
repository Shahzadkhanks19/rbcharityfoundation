import { Router } from 'express'
import ContactMessage from '../models/ContactMessage.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/
const allowedCategories = new Set(['general', 'donation', 'volunteer', 'partnership', 'campaign', 'other'])
const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max)

router.post('/', async (req, res) => {
  if (!ContactMessage.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })

  const name = clean(req.body.name, 100)
  const email = clean(req.body.email, 160).toLowerCase()
  const phone = clean(req.body.phone, 10)
  const category = clean(req.body.category || 'general', 30)
  const subject = clean(req.body.subject, 180)
  const message = clean(req.body.message, 3000)

  if (name.length < 2) return res.status(400).json({ success: false, message: 'Please enter your name' })
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
  if (phone && !phonePattern.test(phone)) return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' })
  if (!allowedCategories.has(category)) return res.status(400).json({ success: false, message: 'Please select a valid enquiry category' })
  if (message.length < 10) return res.status(400).json({ success: false, message: 'Please enter a message of at least 10 characters' })

  const recentDuplicate = await ContactMessage.findOne({
    email,
    message,
    createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
  }).lean()
  if (recentDuplicate) return res.status(409).json({ success: false, message: 'We already received this message recently.' })

  const contact = await ContactMessage.create({ name, email, phone, category, subject, message, status: 'new' })
  res.status(201).json({ success: true, message: 'Your message has been received', messageId: contact._id })
})

export default router
