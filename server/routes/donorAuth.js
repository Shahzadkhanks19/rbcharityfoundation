import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import Donation from '../models/Donation.js'
import Donor from '../models/Donor.js'
import { requireDonor } from '../middleware/donorAuth.js'

const router = express.Router()
const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const sign = id => jwt.sign({ sub: id.toString(), role: 'donor' }, process.env.JWT_SECRET || 'development-only-change-me', { expiresIn: '7d' })
const publicDonor = donor => ({ id: donor._id, name: donor.name, email: donor.email, phone: donor.phone, preferences: donor.preferences, createdAt: donor.createdAt })

router.post('/register', async (req, res) => {
  if (!process.env.MONGODB_URI) return res.status(503).json({ success: false, message: 'Database is not connected.' })
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  const phone = String(req.body.phone || '').trim()
  const password = String(req.body.password || '')
  if (name.length < 2 || !emailRx.test(email) || password.length < 8) return res.status(400).json({ success: false, message: 'Enter a valid name, email and a password of at least 8 characters.' })
  const existing = await Donor.findOne({ email })
  if (existing) return res.status(409).json({ success: false, message: 'An account already exists with this email.' })
  const donor = await Donor.create({ name, email, phone, passwordHash: await bcrypt.hash(password, 12) })
  res.status(201).json({ success: true, token: sign(donor._id), donor: publicDonor(donor) })
})

router.post('/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  const donor = await Donor.findOne({ email })
  if (!donor || donor.status !== 'active' || !await bcrypt.compare(password, donor.passwordHash)) return res.status(401).json({ success: false, message: 'Incorrect email or password.' })
  res.json({ success: true, token: sign(donor._id), donor: publicDonor(donor) })
})

router.get('/me', requireDonor, (req, res) => res.json({ success: true, donor: publicDonor(req.donor) }))

router.patch('/me', requireDonor, async (req, res) => {
  const name = String(req.body.name || req.donor.name).trim()
  const phone = String(req.body.phone ?? req.donor.phone ?? '').trim()
  const donor = await Donor.findByIdAndUpdate(req.donor._id, { name, phone }, { new: true, runValidators: true })
  res.json({ success: true, donor: publicDonor(donor) })
})

router.get('/donations', requireDonor, async (req, res) => {
  const donations = await Donation.find({ email: req.donor.email }).sort({ createdAt: -1 }).lean()
  res.json({ success: true, donations })
})

router.get('/dashboard', requireDonor, async (req, res) => {
  const donations = await Donation.find({ email: req.donor.email }).sort({ createdAt: -1 }).lean()
  const paid = donations.filter(item => item.status === 'paid')
  res.json({ success: true, summary: { totalContributed: paid.reduce((sum,item)=>sum+item.amount,0), totalDonations: donations.length, paidDonations: paid.length, campaignsSupported: new Set(paid.map(item=>item.campaignSlug).filter(Boolean)).size }, recent: donations.slice(0,5) })
})

export default router
