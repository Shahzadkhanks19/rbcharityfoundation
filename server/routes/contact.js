import { Router } from 'express'
import ContactMessage from '../models/ContactMessage.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/

router.post('/', async (req, res) => {
  if (!ContactMessage.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })

  const { name, email = '', phone = '', category = 'general', subject = '', message = '' } = req.body
  if (!name || name.trim().length < 2) return res.status(400).json({ success: false, message: 'Please enter your name' })
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
  if (phone && !phonePattern.test(String(phone))) return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' })
  if (message.trim().length < 10) return res.status(400).json({ success: false, message: 'Please enter a message of at least 10 characters' })

  const contact = await ContactMessage.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: String(phone).trim(),
    category,
    subject: subject.trim(),
    message: message.trim(),
  })

  res.status(201).json({ success: true, message: 'Your message has been received', messageId: contact._id })
})

export default router
