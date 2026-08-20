import { Router } from 'express'
import Volunteer from '../models/Volunteer.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/

router.post('/', async (req, res) => {
  if (!Volunteer.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })

  const { name, email = '', phone = '', city = '', skills = [], availability = '', message = '' } = req.body
  if (!name || name.trim().length < 2) return res.status(400).json({ success: false, message: 'Please enter your full name' })
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
  if (!phonePattern.test(String(phone))) return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' })
  if (!availability) return res.status(400).json({ success: false, message: 'Please select your availability' })

  const volunteer = await Volunteer.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: String(phone).trim(),
    city: city.trim(),
    skills: Array.isArray(skills) ? skills.filter(Boolean).map((item) => String(item).trim()) : [],
    availability,
    message: message.trim(),
  })

  res.status(201).json({ success: true, message: 'Volunteer registration received', volunteerId: volunteer._id })
})

export default router
