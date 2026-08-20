import { Router } from 'express'
import Donation from '../models/Donation.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[6-9]\d{9}$/

router.get('/', async (_req, res) => {
  if (!Donation.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })
  const donations = await Donation.find().sort({ createdAt: -1 }).limit(50)
  res.json({ success: true, donations })
})

router.post('/', async (req, res) => {
  if (!Donation.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })

  const { donorName = '', email = '', phone = '', amount, cause = 'General Fund', destination = 'general', causeSlug = '', campaignSlug = '' } = req.body
  if (donorName.trim().length < 2) return res.status(400).json({ success: false, message: 'Please enter your full name' })
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
  if (!phonePattern.test(String(phone))) return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number' })
  if (!amount || Number(amount) <= 0) return res.status(400).json({ success: false, message: 'A valid donation amount is required' })
  if (destination === 'cause' && !causeSlug) return res.status(400).json({ success: false, message: 'Please select a cause' })
  if (destination === 'campaign' && !campaignSlug) return res.status(400).json({ success: false, message: 'Please select a campaign' })

  const donation = await Donation.create({
    donorName: donorName.trim(),
    email: email.trim().toLowerCase(),
    phone: String(phone).trim(),
    amount: Number(amount),
    cause,
    destination,
    causeSlug,
    campaignSlug,
    status: 'pending',
  })

  res.status(201).json({ success: true, message: 'Donation intent recorded', donationId: donation._id })
})

export default router
