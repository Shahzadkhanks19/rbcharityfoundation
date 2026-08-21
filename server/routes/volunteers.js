import { Router } from 'express'
import Volunteer from '../models/Volunteer.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/
const allowedAvailability = new Set(['weekdays', 'weekends', 'flexible', 'events-only'])
const clean = (value, max = 500) => String(value ?? '').trim().slice(0, max)

router.post('/', async (req, res) => {
  if (!Volunteer.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })

  const name = clean(req.body.name, 100)
  const email = clean(req.body.email, 160).toLowerCase()
  const phone = clean(req.body.phone, 10)
  const city = clean(req.body.city, 100)
  const availability = clean(req.body.availability, 30)
  const message = clean(req.body.message, 2000)
  const skills = Array.isArray(req.body.skills)
    ? [...new Set(req.body.skills.map((item) => clean(item, 60)).filter(Boolean))].slice(0, 12)
    : []

  if (name.length < 2) return res.status(400).json({ success: false, message: 'Please enter your full name' })
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
  if (!phonePattern.test(phone)) return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' })
  if (!allowedAvailability.has(availability)) return res.status(400).json({ success: false, message: 'Please select a valid availability option' })

  const recentDuplicate = await Volunteer.findOne({
    email,
    phone,
    createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
  }).lean()
  if (recentDuplicate) return res.status(409).json({ success: false, message: 'We already received this volunteer application recently.' })

  const volunteer = await Volunteer.create({ name, email, phone, city, skills, availability, message, status: 'new' })
  res.status(201).json({ success: true, message: 'Volunteer registration received', volunteerId: volunteer._id })
})

export default router
