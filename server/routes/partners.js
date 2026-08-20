import { Router } from 'express'
import Partner from '../models/Partner.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/

router.post('/', async (req, res) => {
  if (!Partner.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })

  const { organisation, contactName, email = '', phone = '', type = 'other', message = '' } = req.body
  if (!organisation || organisation.trim().length < 2) return res.status(400).json({ success: false, message: 'Please enter the organisation name' })
  if (!contactName || contactName.trim().length < 2) return res.status(400).json({ success: false, message: 'Please enter a contact person' })
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
  if (!phonePattern.test(String(phone))) return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' })
  if (message.trim().length < 10) return res.status(400).json({ success: false, message: 'Please tell us a little more about the partnership' })

  const partner = await Partner.create({
    organisation: organisation.trim(),
    contactName: contactName.trim(),
    email: email.trim().toLowerCase(),
    phone: String(phone).trim(),
    type,
    message: message.trim(),
  })

  res.status(201).json({ success: true, message: 'Partnership enquiry received', partnerId: partner._id })
})

export default router
