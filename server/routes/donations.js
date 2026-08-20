import { Router } from 'express'
import Donation from '../models/Donation.js'

const router = Router()

router.get('/', async (_req, res) => {
  if (!Donation.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })
  const donations = await Donation.find().sort({ createdAt: -1 }).limit(50)
  res.json({ success: true, donations })
})

router.post('/', async (req, res) => {
  if (!Donation.db.readyState) return res.status(503).json({ success: false, message: 'Database not connected' })

  const { donorName, email, phone, amount, cause } = req.body
  if (!amount || Number(amount) <= 0) return res.status(400).json({ success: false, message: 'A valid donation amount is required' })

  const donation = await Donation.create({ donorName, email, phone, amount: Number(amount), cause })
  res.status(201).json({ success: true, donation })
})

export default router
